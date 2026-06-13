import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import {
  EffectComposer,
  Bloom,
  Noise,
  Vignette,
} from '@react-three/postprocessing';
import NebulaBackdrop from './NebulaBackdrop';
import StarField from './StarField';
import FlowParticles from './FlowParticles';
import CameraRig from './CameraRig';
import { attachInput } from './input';

/**
 * Корінь 3D-всесвіту: повноекранний фіксований Canvas позаду контенту.
 * Шари глибини: raymarched-небула (далеко) → зорі-стрічки (політ) →
 * GPGPU-хмара «AS» (близько). Кінематографічний постпроцес зверху.
 * Важка сцена вантажиться лениво лише на десктопі з WebGL.
 */
export default function Universe() {
  const [dpr, setDpr] = useState(1.5);
  const [active, setActive] = useState(true);

  useEffect(() => attachInput(), []);

  useEffect(() => {
    const onVis = () => setActive(!document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  return (
    <Canvas
      className="universe-canvas"
      frameloop={active ? 'always' : 'never'}
      dpr={dpr}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
      }}
      camera={{ position: [0, 0, 9], fov: 60, near: 0.1, far: 400 }}
    >
      {/* туман ховає дальню межу — об'єкти виринають із темряви */}
      <fog attach="fog" args={['#0c0a07', 60, 320]} />

      {/* адаптив: просідає FPS — знижуємо DPR і прибираємо DOF */}
      <PerformanceMonitor
        onDecline={() => setDpr(1)}
        onIncline={() => setDpr(1.6)}
        flipflops={3}
        onFallback={() => setDpr(1)}
      />

      <Suspense fallback={null}>
        <CameraRig />
        <NebulaBackdrop />
        <StarField count={2600} />
        <FlowParticles size={128} />
        <EffectComposer enableNormalPass={false}>
          <Bloom
            intensity={0.42}
            luminanceThreshold={0.52}
            luminanceSmoothing={0.35}
            mipmapBlur
            radius={0.5}
          />
          <Noise premultiply opacity={0.035} />
          <Vignette offset={0.32} darkness={0.82} eskil={false} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
