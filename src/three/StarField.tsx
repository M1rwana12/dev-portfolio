import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props {
  count?: number;
  depth?: number; // довжина тунелю по -Z
  radius?: number; // радіус тунелю
}

/**
 * Тунель «зір» — хмара точок навколо осі Z, крізь яку летить камера.
 * Один THREE.Points, анімація — у шейдері (мерехтіння + атенюація розміру).
 */
export default function StarField({
  count = 4400,
  depth = 280,
  radius = 36,
}: Props) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const geom = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const sizes = new Float32Array(count);
    const warm = new Float32Array(count); // 0 — світло-золотий, 1 — теплий бурштин

    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      // густіше до країв тунелю, по центру — порожньо (щоб не лізли в камеру)
      const r = radius * (0.18 + Math.pow(Math.random(), 0.6) * 0.82);
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = Math.sin(a) * r * 0.7;
      positions[i * 3 + 2] = 10 - Math.random() * depth;
      seeds[i] = Math.random() * 100;
      sizes[i] = 0.4 + Math.random() * 1.3;
      warm[i] = Math.random();
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    g.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    g.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    g.setAttribute('aWarm', new THREE.BufferAttribute(warm, 1));
    return g;
  }, [count, depth, radius]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color('#ffd27a') },
      uColorB: { value: new THREE.Color('#ff8a1e') },
    }),
    [],
  );

  useFrame((_, dt) => {
    if (matRef.current) {
      (matRef.current.uniforms.uTime.value as number) += dt;
    }
  });

  return (
    <points geometry={geom} frustumCulled={false}>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={`
          uniform float uTime;
          attribute float aSeed;
          attribute float aSize;
          attribute float aWarm;
          varying float vTwinkle;
          varying float vWarm;
          varying float vFog;
          void main() {
            vWarm = aWarm;
            vTwinkle = 0.6 + 0.4 * sin(uTime * 1.4 + aSeed * 6.28);

            // мʼякий потік (flow-field) — частинки пливуть, а не стоять шумом
            float t = uTime * 0.06;
            vec3 p = position;
            vec3 flow = vec3(
              sin(p.y * 0.14 + t) + sin(p.z * 0.09 - t * 1.3),
              cos(p.x * 0.12 - t) + sin(p.z * 0.11 + t),
              sin(p.x * 0.1 + t * 0.7)
            );
            p += flow * 1.4;

            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;

            float dist = -mv.z;
            // depth-fog: далекі розчиняються у фоні, найближчі теж гаснуть
            vFog = smoothstep(300.0, 50.0, dist) * smoothstep(4.0, 18.0, dist);

            // sizeAttenuation — далі дрібніше
            gl_PointSize = aSize * (54.0 / dist) * (0.7 + 0.3 * vTwinkle);
          }
        `}
        fragmentShader={`
          uniform vec3 uColorA;
          uniform vec3 uColorB;
          varying float vTwinkle;
          varying float vWarm;
          varying float vFog;
          void main() {
            // мʼякий round-спрайт: плавний alpha-falloff від центру
            vec2 c = gl_PointCoord - 0.5;
            float d = length(c);
            float glow = pow(smoothstep(0.5, 0.0, d), 1.7);
            vec3 col = mix(uColorA, uColorB, vWarm);
            gl_FragColor = vec4(col, glow * vTwinkle * vFog * 0.85);
          }
        `}
      />
    </points>
  );
}
