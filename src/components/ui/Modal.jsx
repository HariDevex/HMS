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
    sm: 'hdx_max-w-md',
    md: 'hdx_max-w-2xl',
    lg: 'hdx_max-w-4xl',
  };

  return (
    <div
      className="hdx_fixed hdx_inset-0 hdx_z-50 hdx_flex hdx_items-start hdx_justify-center hdx_overflow-y-auto hdx_bg-slate-900-40 hdx_backdrop-blur-2px hdx_p-4 hdx_sm_p-6"
      onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        ref={panelRef}
        className={`card hdx_w-full ${sizes[size] || sizes.md} hdx_my-8 hdx_animate-slide-up`}
      >
        <div className="hdx_flex hdx_items-start hdx_justify-between hdx_px-6 hdx_pt-5 hdx_pb-4 hdx_border-b hdx_border-line">
          <div>
            <h3 className="hdx_text-card-title hdx_text-ink">{title}</h3>
            {subtitle && <p className="hdx_text-secondary-text hdx_text-ink-secondary hdx_mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="hdx_p-1.5 hdx_rounded-input hdx_text-ink-secondary hdx_hover_bg-slate-100 hdx_hover_text-ink hdx_transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="hdx_px-6 hdx_py-5 hdx_max-h-70vh hdx_overflow-y-auto scrollbar-thin">{children}</div>
        {footer && (
          <div className="hdx_flex hdx_justify-end hdx_gap-3 hdx_px-6 hdx_py-4 hdx_border-t hdx_border-line hdx_bg-slate-50-50 hdx_rounded-b-card">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
