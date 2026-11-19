import { motion } from 'framer-motion';
import { Shield, Plus } from 'lucide-react';
import { Button } from './Button';
import { fadeUp } from '@/animations';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      variants={fadeUp}
      initial="initial"
      animate="animate"
      className="flex flex-col items-center justify-center py-20 px-8 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-bg-secondary border border-border-default flex items-center justify-center mb-6 text-text-secondary">
        {icon ?? <Shield size={28} />}
      </div>
      <h3 className="text-text-primary font-semibold font-space text-lg mb-2">{title}</h3>
      {description && (
        <p className="text-text-secondary text-sm font-inter max-w-sm mb-6">{description}</p>
      )}
      {action && (
        <Button size="sm" icon={<Plus size={14} />} onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </motion.div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div className="w-12 h-12 rounded-xl bg-critical/10 border border-critical/30 flex items-center justify-center mb-4 text-critical text-xl">
        ⚠
      </div>
      <p className="text-text-secondary text-sm font-inter mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-accent-cyan text-sm font-inter hover:underline"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function LoadingState({ message = 'Loading…' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-8 h-8 border-2 border-accent-cyan/20 border-t-accent-cyan rounded-full animate-spin mb-4" />
      <p className="text-text-secondary text-sm font-mono">{message}</p>
    </div>
  );
}
