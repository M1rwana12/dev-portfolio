/**
 * Спільний стор вводу для 3D-сцени.
 * Оновлюється слухачами вікна, читається всередині useFrame —
 * без React-стейту, щоб не викликати ререндери на кожен рух миші.
 */
export const input = {
  scroll: 0, // 0..1 — прогрес скролу всієї сторінки
  mx: 0, // -1..1 — миша по X від центру
  my: 0, // -1..1 — миша по Y від центру
};

let attached = false;

export function attachInput(): () => void {
  if (attached) return () => {};
  attached = true;

  const onScroll = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight || 1;
    input.scroll = Math.min(Math.max(h.scrollTop / max, 0), 1);
  };
  const onMove = (e: MouseEvent) => {
    input.mx = (e.clientX / window.innerWidth) * 2 - 1;
    input.my = (e.clientY / window.innerHeight) * 2 - 1;
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('mousemove', onMove, { passive: true });

  return () => {
    attached = false;
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('mousemove', onMove);
  };
}
