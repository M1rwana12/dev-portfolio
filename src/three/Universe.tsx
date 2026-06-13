import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import StarField from './StarField';
import LogoParticles from './LogoParticles';
import ServiceNodes from './ServiceNodes';
import CameraRig from './CameraRig';
import { attachInput } from './input';

/**
 * Корінь 3D-всесвіту: повноекранний фіксований Canvas позаду контенту.
 * Лінива (через React.lazy у Hero) важка сцена; вантажиться лише на
 * десктопі з WebGL. На прихованій вкладці рендер ставиться на паузу.
 */
export default function Universe() {
  const [dpr, setDpr] = useState(1.5);
  const [active, setActive] = useState(true);
  const ready = useRef(false);

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
      onCreated={() => {
        ready.current = true;
      }}
    >
      {/* туман ховає дальню межу — вузли виринають із темряви */}
      <fog attach="fog" args={['#0c0a07', 70, 300]} />

      {/* адаптивний DPR: просідає FPS — знижуємо роздільність */}
      <PerformanceMonitor
        onDecline={() => setDpr(1)}
        onIncline={() => setDpr(1.75)}
        flipflops={3}
        onFallback={() => setDpr(1)}
      />

      <Suspense fallback={null}>
        <CameraRig />
        <StarField />
        <LogoParticles />
        <ServiceNodes />
        <EffectComposer enableNormalPass={false}>
          <Bloom
            intensity={0.42}
            luminanceThreshold={0.45}
            luminanceSmoothing={0.3}
            mipmapBlur
            radius={0.5}
          />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
