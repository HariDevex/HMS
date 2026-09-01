import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, subtitle, children, size = 'md', footer }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 backdrop-blur-[2px] p-4 sm:p-6"
      onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        ref={panelRef}
        className={`card w-full ${sizes[size] || sizes.md} my-8 animate-slide-up`}
      >
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-line">
          <div>
            <h3 className="text-card-title text-ink">{title}</h3>
            {subtitle && <p className="text-secondary text-ink-secondary mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-input text-ink-secondary hover:bg-slate-100 hover:text-ink transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto scrollbar-thin">{children}</div>
        {footer && (
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-line bg-slate-50/50 rounded-b-card">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
