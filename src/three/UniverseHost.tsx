import { lazy, Suspense } from 'react';
import { useCapability } from './useCapability';

// важкий three-chunk вантажиться лише коли клієнт справді потягне сцену
const Universe = lazy(() => import('./Universe'));

/**
 * Фіксований фон-всесвіт за контентом. На мобайлі / без WebGL /
 * за reduced-motion не монтується взагалі — лишається CSS-аврора в hero.
 */
export default function UniverseHost() {
  const cap = useCapability();
  if (cap !== 'full') return null;

  return (
    <div className="universe-layer" aria-hidden="true">
      <Suspense fallback={null}>
        <Universe />
      </Suspense>
    </div>
  );
}
