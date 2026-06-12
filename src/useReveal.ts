import { useEffect } from 'react';

/**
 * Спостерігає за елементами .reveal і додає .visible,
 * коли вони потрапляють у вʼюпорт.
 */
export function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    );

    document
      .querySelectorAll('.reveal:not(.visible)')
      .forEach((el) => io.observe(el));

    return () => io.disconnect();
  });
}
