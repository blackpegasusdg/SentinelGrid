import React from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'critical' | 'info' | 'pending';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

const styles: Record<BadgeVariant, string> = {
  default:  'bg-white/5 text-text-secondary border-border-default',
  success:  'bg-success/10 text-success border-success/30',
  warning:  'bg-warning/10 text-warning border-warning/30',
  critical: 'bg-critical/10 text-critical border-critical/30',
  info:     'bg-accent-blue/10 text-accent-blue border-accent-blue/30',
  pending:  'bg-warning/10 text-warning border-warning/30',
};

const dotColors: Record<BadgeVariant, string> = {
  default:  'bg-text-secondary',
  success:  'bg-success',
  warning:  'bg-warning',
  critical: 'bg-critical',
  info:     'bg-accent-blue',
  pending:  'bg-warning animate-pulse',
};

export function Badge({ variant = 'default', children, className = '', dot }: BadgeProps) {
  return (
    <span className={[
      'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-mono',
      'border font-medium tracking-wide',
      styles[variant], className,
    ].join(' ')}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
}

// Status badge specifically for scan status
export function ScanStatusBadge({ status }: { status: string }) {
  const map: Record<string, BadgeVariant> = {
    pending:   'pending',
    running:   'info',
    completed: 'success',
    failed:    'critical',
  };
  return <Badge variant={map[status] ?? 'default'} dot>{status.toUpperCase()}</Badge>;
}

// Verification badge for assets
export function VerificationBadge({ verified }: { verified: boolean }) {
  return (
    <Badge variant={verified ? 'success' : 'warning'} dot>
      {verified ? 'VERIFIED' : 'UNVERIFIED'}
    </Badge>
  );
}
