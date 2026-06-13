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
  count = 3800,
  depth = 280,
  radius = 34,
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
          void main() {
            vWarm = aWarm;
            vTwinkle = 0.55 + 0.45 * sin(uTime * 1.6 + aSeed * 6.28);
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = aSize * (70.0 / -mv.z) * (0.6 + 0.4 * vTwinkle);
          }
        `}
        fragmentShader={`
          uniform vec3 uColorA;
          uniform vec3 uColorB;
          varying float vTwinkle;
          varying float vWarm;
          void main() {
            vec2 c = gl_PointCoord - 0.5;
            float d = length(c);
            if (d > 0.5) discard;
            float glow = smoothstep(0.5, 0.0, d);
            vec3 col = mix(uColorA, uColorB, vWarm);
            gl_FragColor = vec4(col, glow * vTwinkle);
          }
        `}
      />
    </points>
  );
}
