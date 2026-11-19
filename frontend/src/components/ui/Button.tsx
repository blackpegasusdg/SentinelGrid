import React from 'react';
import { motion } from 'framer-motion';
import { useCursor } from '@/context/CursorContext';
import { useMagnet } from '@/hooks/useMagnet';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size    = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  magnetic?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:   'bg-accent-cyan text-bg-primary font-semibold hover:shadow-glow-cyan hover:brightness-110',
  secondary: 'border border-border-active text-accent-cyan bg-transparent hover:bg-accent-cyan/10',
  ghost:     'text-text-secondary border border-transparent hover:text-text-primary hover:border-border-hover',
  danger:    'bg-critical/10 text-critical border border-critical/30 hover:bg-critical/20',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm gap-1.5',
  md: 'px-6 py-3 text-sm gap-2',
  lg: 'px-8 py-4 text-base gap-2.5',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  magnetic = false,
  icon,
  iconRight,
  children,
  className = '',
  disabled,
  onMouseEnter: externalMouseEnter,
  onMouseLeave: externalMouseLeave,
  ...props
}: ButtonProps) {
  const { setCursorState, setCursorLabel } = useCursor();
  const magnet = useMagnet(0.3);
  const isDisabled = disabled || loading;

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    setCursorState('hover');
    externalMouseEnter?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    setCursorState('default');
    setCursorLabel('');
    if (magnetic) {
      magnet.onMouseLeave(e as unknown as React.MouseEvent<HTMLElement>);
    }
    externalMouseLeave?.(e);
  };

  return (
    <motion.button
      ref={magnetic ? (magnet.ref as React.RefObject<HTMLButtonElement>) : undefined}
      onMouseMove={magnetic ? (magnet.onMouseMove as unknown as React.MouseEventHandler<HTMLButtonElement>) : undefined}
      whileTap={{ scale: isDisabled ? 1 : 0.97 }}
      onMouseEnter={handleMouseEnter as unknown as React.MouseEventHandler<HTMLButtonElement>}
      onMouseLeave={handleMouseLeave as unknown as React.MouseEventHandler<HTMLButtonElement>}
      disabled={isDisabled}
      className={[
        'relative inline-flex items-center justify-center rounded-lg font-inter',
        'transition-all duration-200 select-none overflow-hidden',
        variantClasses[variant],
        sizeClasses[size],
        isDisabled ? 'opacity-50 cursor-not-allowed' : '',
        className,
      ].join(' ')}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {loading ? <Loader2 className="animate-spin" size={16} /> : icon}
      <span>{children}</span>
      {!loading && iconRight}
    </motion.button>
  );
}
