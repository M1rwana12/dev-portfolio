import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { ScreenQuad } from '@react-three/drei';
import * as THREE from 'three';
import { input } from './input';
import { noiseGLSL } from './glsl';

/**
 * Повноекранна об'ємна небула (raymarch-подібне накопичення fbm).
 * Малюється в екранному просторі позаду всього, depthTest вимкнено —
 * дає кінематографічну глибину, не конкуруючи з контентом.
 * Колір: глибокий індиго в тінях → теплий бурштин у згустках.
 */
export default function NebulaBackdrop() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uRes: { value: new THREE.Vector2(1, 1) },
      uShadow: { value: new THREE.Color('#0a0a1f') }, // індиго-тінь
      uAmber: { value: new THREE.Color('#ff9c2e') }, // бурштиновий згусток
      uDeep: { value: new THREE.Color('#070504') }, // майже чорна база
    }),
    [],
  );

  useFrame((_, dt) => {
    const m = matRef.current;
    if (!m) return;
    m.uniforms.uTime.value += dt;
    m.uniforms.uRes.value.set(size.width, size.height);
    const mo = m.uniforms.uMouse.value as THREE.Vector2;
    mo.x += (input.mx - mo.x) * Math.min(dt * 2, 1);
    mo.y += (input.my - mo.y) * Math.min(dt * 2, 1);
  });

  return (
    <ScreenQuad renderOrder={-10}>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
        vertexShader={/* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position.xy, 0.0, 1.0);
          }
        `}
        fragmentShader={/* glsl */ `
          precision highp float;
          varying vec2 vUv;
          uniform float uTime;
          uniform vec2 uMouse;
          uniform vec2 uRes;
          uniform vec3 uShadow;
          uniform vec3 uAmber;
          uniform vec3 uDeep;

          ${noiseGLSL}

          void main() {
            // зберігаємо пропорції, центруємо
            vec2 p = (vUv - 0.5);
            p.x *= uRes.x / uRes.y;

            // паралакс від курсора + повільний дрейф
            vec2 par = uMouse * 0.06;
            vec3 q = vec3(p * 1.6 + par, uTime * 0.025);

            // domain warping — згустки течуть, а не стоять
            vec3 w = vec3(
              fbm(q + vec3(0.0, 0.0, 0.0)),
              fbm(q + vec3(5.2, 1.3, 2.1)),
              fbm(q + vec3(2.7, 8.3, 4.4))
            );
            float n = fbm(q + w * 1.7);
            n = pow(clamp(n, 0.0, 1.0), 1.5);

            // другий, дрібніший шар для «пилу»
            float dust = fbm(q * 3.4 - w) * 0.5;

            // колір: база → індиго → бурштин у найгустіших місцях
            vec3 col = uDeep;
            col = mix(col, uShadow, smoothstep(0.15, 0.6, n) * 0.7);
            col = mix(col, uAmber, smoothstep(0.55, 0.95, n + dust * 0.4) * 0.55);

            // вінʼєтка до країв — фокус у центрі, читабельність тексту
            float vig = smoothstep(1.25, 0.35, length(p));
            col *= mix(0.45, 1.0, vig);

            // дизеринг проти бандингу на темних градієнтах
            float dither = (hash13(vec3(gl_FragCoord.xy, uTime)) - 0.5) / 255.0;
            col += dither;

            gl_FragColor = vec4(col, 1.0);
          }
        `}
      />
    </ScreenQuad>
  );
}
