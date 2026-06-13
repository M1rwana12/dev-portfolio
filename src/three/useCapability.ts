import { useEffect, useState } from 'react';

export type Capability = 'full' | 'reduced';

let cached: Capability | null = null;

function detect(): Capability {
  if (cached) return cached;
  if (typeof window === 'undefined') return 'reduced';

  // 1. Користувач просить менше руху
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    cached = 'reduced';
    return cached;
  }

  // 2. Мобільні / тачскрін / вузький екран — важка 3D-сцена не на користь
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  if (coarse || window.innerWidth < 980) {
    cached = 'reduced';
    return cached;
  }

  // 3. Економія даних
  const conn = (navigator as unknown as { connection?: { saveData?: boolean } })
    .connection;
  if (conn?.saveData) {
    cached = 'reduced';
    return cached;
  }

  // 4. Чи є взагалі робочий WebGL
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    if (!gl) {
      cached = 'reduced';
      return cached;
    }
  } catch {
    cached = 'reduced';
    return cached;
  }

  cached = 'full';
  return cached;
}

/**
 * Вирішує, чи показувати важку 3D-сцену.
 * 'full'    — десктоп із WebGL і без reduced-motion → летимо крізь всесвіт
 * 'reduced' — мобайл / слабкий клієнт / reduced-motion → статичний фон (CSS-аврора)
 *
 * Рендериться спершу як 'reduced', щоб не блокувати перший кадр,
 * і піднімається до 'full' уже після монтування.
 */
export function useCapability(): Capability {
  const [cap, setCap] = useState<Capability>('reduced');

  useEffect(() => {
    setCap(detect());
  }, []);

  return cap;
}
