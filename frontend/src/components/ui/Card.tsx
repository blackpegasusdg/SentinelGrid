import React from 'react';
import { motion } from 'framer-motion';
import { useCardTilt } from '@/hooks/useCardTilt';
import { useCursor } from '@/context/CursorContext';
import { fadeUp } from '@/animations';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  tilt?: boolean;
  spotlight?: boolean;
  hover?: boolean;
  animate?: boolean;
  onClick?: () => void;
  cursorLabel?: string;
}

export function Card({
  children,
  className = '',
  tilt = false,
  spotlight = false,
  hover = true,
  animate = true,
  onClick,
  cursorLabel,
}: CardProps) {
  const { setCursorState, setCursorLabel } = useCursor();
  const tiltProps = useCardTilt(6);

  const baseClass = [
    'relative bg-bg-card border border-border-default rounded-xl overflow-hidden',
    'transition-all duration-300',
    hover ? 'hover:border-border-active hover:shadow-card-hover' : '',
    onClick ? 'cursor-none' : '',
    className,
  ].join(' ');

  const handleMouseEnter = () => {
    if (cursorLabel) { setCursorState('hover'); setCursorLabel(cursorLabel); }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    setCursorState('default');
    setCursorLabel('');
    if (tilt) tiltProps.onMouseLeave(e);
  };

  const inner = (
    <div
      ref={tilt ? tiltProps.ref : undefined}
      onMouseMove={tilt ? tiltProps.onMouseMove : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={baseClass}
      style={{ willChange: 'transform' }}
    >
      {spotlight && (
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: 'radial-gradient(500px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(53,214,232,0.06), transparent 40%)',
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );

  if (!animate) return inner;

  return (
    <motion.div
      variants={fadeUp}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: '-40px' }}
    >
      {inner}
    </motion.div>
  );
}
