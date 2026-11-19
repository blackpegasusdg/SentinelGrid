import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { scaleIn, fadeIn } from '@/animations';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  footer?: React.ReactNode;
}

const sizeMap = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
};

export function Modal({ open, onClose, title, children, size = 'md', footer }: ModalProps) {
  // Lock scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            variants={fadeIn}
            initial="initial"
            animate="animate"
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[200] bg-bg-primary/70 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Dialog */}
          <div
            className="fixed inset-0 z-[201] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
          >
            <motion.div
              key="dialog"
              variants={scaleIn}
              initial="initial"
              animate="animate"
              exit="exit"
              className={[
                'w-full relative bg-bg-card border border-border-default rounded-2xl shadow-2xl',
                'flex flex-col max-h-[90vh]',
                sizeMap[size],
              ].join(' ')}
            >
              {/* Header */}
              {title && (
                <div className="flex items-center justify-between px-6 py-5 border-b border-border-default flex-shrink-0">
                  <h2 id="modal-title" className="text-base font-semibold text-text-primary font-space">
                    {title}
                  </h2>
                  <button
                    onClick={onClose}
                    className="text-text-secondary hover:text-text-primary transition-colors p-1 rounded-lg hover:bg-white/5"
                    aria-label="Close modal"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-6 py-5">
                {children}
              </div>

              {/* Footer */}
              {footer && (
                <div className="px-6 py-4 border-t border-border-default flex-shrink-0">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// Confirm Delete Dialog
interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  loading?: boolean;
}

export function ConfirmDialog({
  open, onClose, onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmLabel = 'Confirm',
  loading,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm"
      footer={
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary border border-border-default rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-sm bg-critical/10 text-critical border border-critical/30 rounded-lg hover:bg-critical/20 transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing…' : confirmLabel}
          </button>
        </div>
      }
    >
      <p className="text-text-secondary text-sm font-inter">{message}</p>
    </Modal>
  );
}
