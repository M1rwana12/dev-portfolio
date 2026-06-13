import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js';
import gsap from 'gsap';
import * as THREE from 'three';
import { input } from './input';
import { sampleText } from './sampleText';
import { noiseGLSL, curlGLSL } from './glsl';

// центр хмари: праворуч-угору й углиб, щоб не лізти в зону заголовка (зліва)
const OFFSET = new THREE.Vector3(4.0, 0.6, -5.0);

interface Props {
  size?: number; // сторона текстури симуляції (N×N частинок)
}

/**
 * GPGPU-хмара частинок на ping-pong FBO (GPUComputationRenderer).
 * Частинки течуть по власному curl-noise полю, відштовхуються від курсора,
 * на intro збираються у форму «AS», на скролі розпорошуються у всесвіт.
 * Уся симуляція — на GPU; CPU лише оновлює юніформи.
 */
export default function FlowParticles({ size = 128 }: Props) {
  const gl = useThree((s) => s.gl);
  const pointsRef = useRef<THREE.Points>(null);
  const morph = useRef({ v: 0 });
  const matRef = useRef<THREE.ShaderMaterial>(null);

  // ---- ініціалізація GPGPU (один раз) ----
  const sim = useMemo(() => {
    const count = size * size;
    const gpu = new GPUComputationRenderer(size, size, gl);

    // ціль «AS» — точки контуру літер, зсунуті в OFFSET
    const target = sampleText('AS', count, 12, 0.5);

    // стартова хмара — сфера навколо OFFSET (хаос, з якого збереться напис);
    // ціль «AS» — окрема текстура того ж формату, що й симуляція
    // (через gpu.createTexture, інакше float-семплінг ламається на ANGLE/D3D11)
    const initTex = gpu.createTexture();
    const targetTex = gpu.createTexture();
    const data = initTex.image.data as unknown as Float32Array;
    const targetData = targetTex.image.data as unknown as Float32Array;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const i4 = i * 4;
      const seed = Math.random();

      // сфера
      const u = Math.random();
      const v = Math.random();
      const th = 2 * Math.PI * u;
      const ph = Math.acos(2 * v - 1);
      const r = 17 * (0.55 + Math.random() * 0.45);
      data[i4] = OFFSET.x + r * Math.sin(ph) * Math.cos(th);
      data[i4 + 1] = OFFSET.y + r * Math.sin(ph) * Math.sin(th);
      data[i4 + 2] = OFFSET.z + r * Math.cos(ph);
      data[i4 + 3] = seed;

      // ціль «AS»
      targetData[i4] = target[i3] + OFFSET.x;
      targetData[i4 + 1] = target[i3 + 1] + OFFSET.y;
      targetData[i4 + 2] = target[i3 + 2] + OFFSET.z;
      targetData[i4 + 3] = seed;
    }
    targetTex.needsUpdate = true;

    const posFrag = /* glsl */ `
      uniform float uTime;
      uniform float uDelta;
      uniform float uForm;
      uniform float uDisperse;
      uniform vec3 uMouse;
      uniform sampler2D uTarget;

      ${noiseGLSL}
      ${curlGLSL}

      void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        vec4 data = texture2D(texturePosition, uv);
        vec3 pos = data.xyz;
        float seed = data.w;
        vec3 target = texture2D(uTarget, uv).xyz;

        // curl-noise потік — органічна течія; слабшає, коли збирається «AS»
        vec3 flow = curlNoise(pos * 0.045 + vec3(0.0, 0.0, uTime * 0.03));
        vec3 vel = flow * (1.5 + seed * 0.8) * (1.0 - uForm * 0.6);

        // повернення до форми «AS»
        vec3 toForm = (target - pos) * uForm * 2.4;

        // відштовхування від курсора — брижі полем
        vec3 md = pos - uMouse;
        float d2 = dot(md, md) + 0.5;
        vel += normalize(md) * (10.0 / d2);

        // розпорошення на скролі — назовні від центру
        vec3 outDir = normalize(pos - vec3(${OFFSET.x.toFixed(
          1,
        )}, ${OFFSET.y.toFixed(1)}, ${OFFSET.z.toFixed(1)}) + 0.001);
        vel += outDir * uDisperse * (10.0 + seed * 14.0);

        pos += (vel + toForm) * uDelta;

        gl_FragColor = vec4(pos, seed);
      }
    `;

    const posVar = gpu.addVariable('texturePosition', posFrag, initTex);
    gpu.setVariableDependencies(posVar, [posVar]);
    Object.assign(posVar.material.uniforms, {
      uTime: { value: 0 },
      uDelta: { value: 0 },
      uForm: { value: 0 },
      uDisperse: { value: 0 },
      uMouse: { value: new THREE.Vector3() },
      uTarget: { value: targetTex },
    });

    const err = gpu.init();
    if (err !== null) {
      // не валимо застосунок — фон просто лишиться без частинок
      console.error('GPGPU init:', err);
    }

    // геометрія рендера: aRef → координата в текстурі симуляції
    const refs = new Float32Array(count * 2);
    const seeds = new Float32Array(count);
    const dummy = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const x = i % size;
      const y = Math.floor(i / size);
      refs[i * 2] = (x + 0.5) / size;
      refs[i * 2 + 1] = (y + 0.5) / size;
      seeds[i] = Math.random();
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(dummy, 3));
    geom.setAttribute('aRef', new THREE.BufferAttribute(refs, 2));
    geom.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));

    return { gpu, posVar, geom };
  }, [gl, size]);

  const uniforms = useMemo(
    () => ({
      uPos: { value: null as THREE.Texture | null },
      uSize: { value: 1.0 },
      uForm: { value: 0 },
      uColA: { value: new THREE.Color('#ff8a1e') },
      uColB: { value: new THREE.Color('#ffd27a') },
    }),
    [],
  );

  // intro-морф: хаос → «AS»
  useEffect(() => {
    const tw = gsap.to(morph.current, {
      v: 1,
      duration: 2.6,
      delay: 0.4,
      ease: 'power3.out',
    });
    return () => {
      tw.kill();
    };
  }, []);

  useFrame((_, dt) => {
    const d = Math.min(dt, 0.033); // стабільність на лагах/рефокусі
    const su = sim.posVar.material.uniforms;
    const disperse = Math.min(input.scroll * 2, 1);
    const form = morph.current.v * (1 - disperse);

    su.uTime.value += d;
    su.uDelta.value = d;
    su.uForm.value = form;
    su.uDisperse.value = disperse;
    const mo = su.uMouse.value as THREE.Vector3;
    const mx = OFFSET.x + input.mx * 9;
    const my = OFFSET.y - input.my * 6;
    mo.x += (mx - mo.x) * Math.min(d * 3, 1);
    mo.y += (my - mo.y) * Math.min(d * 3, 1);
    mo.z = OFFSET.z;

    sim.gpu.compute();

    // R3F клонує uniforms у матеріал — оновлюємо РЕАЛЬНІ юніформи матеріалу
    const mu = matRef.current?.uniforms;
    if (mu) {
      mu.uPos.value = sim.gpu.getCurrentRenderTarget(sim.posVar).texture;
      mu.uForm.value = form;
    }
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <primitive object={sim.geom} attach="geometry" />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        glslVersion={THREE.GLSL3}
        vertexShader={/* glsl */ `
          uniform sampler2D uPos;
          uniform float uSize;
          attribute vec2 aRef;
          attribute float aSeed;
          varying float vSeed;
          varying float vFade;
          void main() {
            vSeed = aSeed;
            // texelFetch: точний семпл float-текстури у вертекс-шейдері
            // (texture2D у GLSL ES 1.0 не робить VTF float на ANGLE/D3D11 → нулі)
            ivec2 px = ivec2(aRef * vec2(textureSize(uPos, 0)));
            vec3 pos = texelFetch(uPos, px, 0).xyz;
            vec4 mv = modelViewMatrix * vec4(pos, 1.0);
            float dist = -mv.z;
            gl_Position = projectionMatrix * mv;
            gl_PointSize = (0.6 + aSeed * 1.0) * uSize * (245.0 / dist);
            // далекі й найближчі гаснуть — м'яка глибина
            vFade = smoothstep(330.0, 40.0, dist) * smoothstep(2.0, 12.0, dist);
          }
        `}
        fragmentShader={/* glsl */ `
          precision highp float;
          uniform vec3 uColA;
          uniform vec3 uColB;
          uniform float uForm;
          varying float vSeed;
          varying float vFade;
          out vec4 fragColor;
          void main() {
            vec2 c = gl_PointCoord - 0.5;
            float dd = length(c);
            float glow = pow(smoothstep(0.5, 0.0, dd), 1.8);
            vec3 col = mix(uColA, uColB, vSeed);
            float a = glow * vFade * (0.10 + 0.34 * uForm);
            fragColor = vec4(col, a);
          }
        `}
      />
    </points>
  );
}
