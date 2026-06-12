import type { MouseEvent } from 'react';

/** Пише координати курсора в CSS-змінні --mx/--my елемента (спотлайт на картках). */
export function trackSpotlight(e: MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${e.clientX - r.left}px`);
  el.style.setProperty('--my', `${e.clientY - r.top}px`);
}
