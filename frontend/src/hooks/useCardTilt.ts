import { useRef, useCallback } from 'react';

/**
 * useCardTilt — 3D tilt effect on card hover.
 */
export function useCardTilt(maxTilt = 8) {
  const ref = useRef<HTMLDivElement | null>(null);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top)  / rect.height;
    const rotateX = (y - 0.5) * -maxTilt;
    const rotateY = (x - 0.5) *  maxTilt;
    el.style.setProperty('--mouse-x', `${x * 100}%`);
    el.style.setProperty('--mouse-y', `${y * 100}%`);
    el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
  }, [maxTilt]);

  const onMouseLeave = useCallback((_e?: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
    setTimeout(() => { if (el) el.style.transition = ''; }, 500);
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}
