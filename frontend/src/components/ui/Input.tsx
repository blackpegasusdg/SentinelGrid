import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, icon, className = '', id, ...props },
  ref
) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm text-text-secondary font-medium font-inter"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={[
            'w-full bg-bg-secondary border rounded-lg px-4 py-3',
            'text-text-primary text-sm font-inter placeholder:text-text-muted',
            'transition-all duration-200 outline-none',
            'focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan/20',
            error ? 'border-critical/60' : 'border-border-default hover:border-border-hover',
            icon ? 'pl-10' : '',
            'cursor-text',
            className,
          ].join(' ')}
          style={{ cursor: 'text' }}
          {...props}
        />
      </div>
      {error && <p className="text-critical text-xs font-inter">{error}</p>}
      {hint && !error && <p className="text-text-secondary text-xs font-inter">{hint}</p>}
    </div>
  );
});

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, className = '', id, ...props },
  ref
) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm text-text-secondary font-medium font-inter">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        className={[
          'w-full bg-bg-secondary border rounded-lg px-4 py-3',
          'text-text-primary text-sm font-inter placeholder:text-text-muted',
          'transition-all duration-200 outline-none resize-none',
          'focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan/20',
          error ? 'border-critical/60' : 'border-border-default hover:border-border-hover',
          className,
        ].join(' ')}
        style={{ cursor: 'text' }}
        {...props}
      />
      {error && <p className="text-critical text-xs font-inter">{error}</p>}
    </div>
  );
});

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, options, className = '', id, ...props }: SelectProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm text-text-secondary font-medium font-inter">
          {label}
        </label>
      )}
      <select
        id={inputId}
        className={[
          'w-full bg-bg-secondary border rounded-lg px-4 py-3',
          'text-text-primary text-sm font-inter',
          'transition-all duration-200 outline-none',
          'focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan/20',
          error ? 'border-critical/60' : 'border-border-default hover:border-border-hover',
          className,
        ].join(' ')}
        {...props}
      >
        {options.map(o => (
          <option key={o.value} value={o.value} className="bg-bg-secondary">
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="text-critical text-xs font-inter">{error}</p>}
    </div>
  );
}
