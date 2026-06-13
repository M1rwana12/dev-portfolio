import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import * as THREE from 'three';
import { input } from './input';
import { sampleSphere, sampleText } from './sampleText';

interface Props {
  count?: number;
}

/**
 * Хмара частинок, що на intro збирається зі сфери у напис «AS».
 * На скролі розпорошується назад у всесвіт; реагує на курсор (параллакс).
 */
export default function LogoParticles({ count = 5600 }: Props) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const morph = useRef({ v: 0 });

  const geom = useMemo(() => {
    const start = sampleSphere(count, 8);
    const target = sampleText('AS', count, 7.2, 0.25);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) seeds[i] = Math.random();

    const g = new THREE.BufferGeometry();
    // position тримаємо рівним target, щоб frustum-bounds були коректні
    g.setAttribute('position', new THREE.BufferAttribute(target.slice(), 3));
    g.setAttribute('aStart', new THREE.BufferAttribute(start, 3));
    g.setAttribute('aTarget', new THREE.BufferAttribute(target, 3));
    g.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    return g;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uMorph: { value: 0 },
      uDisperse: { value: 0 },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uColorA: { value: new THREE.Color('#ffb224') },
      uColorB: { value: new THREE.Color('#ff7a18') },
    }),
    [],
  );

  // intro-морф: сфера → напис за 2.2 c
  useEffect(() => {
    const tw = gsap.to(morph.current, {
      v: 1,
      duration: 2.2,
      delay: 0.35,
      ease: 'power3.inOut',
    });
    return () => {
      tw.kill();
    };
  }, []);

  useFrame((_, dt) => {
    const m = matRef.current;
    if (!m) return;
    m.uniforms.uTime.value += dt;
    m.uniforms.uMorph.value = morph.current.v;
    // у першій третині скролу напис розлітається у всесвіт
    m.uniforms.uDisperse.value = Math.min(input.scroll * 3, 1);
    const mouse = m.uniforms.uMouse.value as THREE.Vector2;
    mouse.x += (input.mx - mouse.x) * Math.min(dt * 3, 1);
    mouse.y += (input.my - mouse.y) * Math.min(dt * 3, 1);
  });

  return (
    <points geometry={geom} frustumCulled={false} position={[4.8, 0.4, -3.5]}>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={`
          uniform float uMorph;
          uniform float uDisperse;
          uniform float uTime;
          uniform vec2 uMouse;
          attribute vec3 aStart;
          attribute vec3 aTarget;
          attribute float aSeed;
          varying float vAlpha;
          varying float vSeed;
          void main() {
            vSeed = aSeed;
            float e = smoothstep(0.0, 1.0, uMorph);
            vec3 pos = mix(aStart, aTarget, e);

            // легке «дихання» сформованого напису
            float br = (1.0 - uDisperse) * 0.05;
            pos.x += sin(uTime * 0.8 + aSeed * 30.0) * br;
            pos.y += cos(uTime * 0.7 + aSeed * 24.0) * br;

            // розпорошення на скролі — назовні вздовж напрямку від центру
            vec3 dir = normalize(pos + 0.0001);
            pos += dir * uDisperse * (16.0 + aSeed * 26.0);
            pos.z -= uDisperse * (aSeed * 40.0);

            // параллакс від курсора (далі — слабше)
            pos.x += uMouse.x * 1.6;
            pos.y += -uMouse.y * 1.2;

            vec4 mv = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = (0.9 + aSeed * 1.2) * (26.0 / -mv.z);
            vAlpha = (0.22 + 0.26 * e) * (1.0 - uDisperse);
          }
        `}
        fragmentShader={`
          uniform vec3 uColorA;
          uniform vec3 uColorB;
          varying float vAlpha;
          varying float vSeed;
          void main() {
            vec2 c = gl_PointCoord - 0.5;
            float d = length(c);
            if (d > 0.5) discard;
            float glow = smoothstep(0.5, 0.0, d);
            vec3 col = mix(uColorA, uColorB, vSeed);
            gl_FragColor = vec4(col, glow * vAlpha);
          }
        `}
      />
    </points>
  );
}
