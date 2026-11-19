import { useRef, useCallback } from 'react';

/**
 * useMagnet — magnetic hover effect
 */
export function useMagnet(strength = 0.4) {
  const ref = useRef<HTMLElement | null>(null);
  const animRef = useRef<number>(0);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * strength;
    const dy = (e.clientY - cy) * strength;
    cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(() => {
      if (el) el.style.transform = `translate(${dx}px, ${dy}px)`;
    });
  }, [strength]);

  const onMouseLeave = useCallback((_e?: React.MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(animRef.current);
    el.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    el.style.transform = 'translate(0, 0)';
    setTimeout(() => { if (el) el.style.transition = ''; }, 500);
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}
