import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

type CursorState = 'default' | 'hover' | 'active' | 'text';

interface CursorContextValue {
  cursorState: CursorState;
  cursorLabel: string;
  setCursorState: (s: CursorState) => void;
  setCursorLabel: (l: string) => void;
}

const CursorContext = createContext<CursorContextValue>({
  cursorState: 'default',
  cursorLabel: '',
  setCursorState: () => {},
  setCursorLabel: () => {},
});

export function CursorProvider({ children }: { children: React.ReactNode }) {
  const [cursorState, setCursorState] = useState<CursorState>('default');
  const [cursorLabel, setCursorLabel] = useState('');

  return (
    <CursorContext.Provider value={{ cursorState, cursorLabel, setCursorState, setCursorLabel }}>
      {children}
    </CursorContext.Provider>
  );
}

export function useCursor() {
  return useContext(CursorContext);
}

// Custom Cursor component (rendered once at root level)
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const { cursorState, cursorLabel } = useCursor();

  const mouse = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);
  const isTouch = useRef(false);

  useEffect(() => {
    // Detect touch device
    if (window.matchMedia('(pointer: coarse)').matches) {
      isTouch.current = true;
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }
      if (labelRef.current) {
        labelRef.current.style.left = `${e.clientX + 16}px`;
        labelRef.current.style.top = `${e.clientY + 16}px`;
      }
    };

    // Smooth ring interpolation via rAF
    const animate = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.12;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = `${ring.current.x}px`;
        ringRef.current.style.top = `${ring.current.y}px`;
      }
      rafId.current = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', onMouseMove);
    rafId.current = requestAnimationFrame(animate);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  const stateClass = cursorState === 'hover' ? 'cursor-hover' : cursorState === 'active' ? 'cursor-active' : '';

  return (
    <div className={stateClass} aria-hidden="true">
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
      <div ref={labelRef} className="cursor-label">{cursorLabel}</div>
    </div>
  );
}
