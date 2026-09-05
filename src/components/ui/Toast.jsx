import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const icons = {
  success: <CheckCircle2 size={18} className="hdx_text-success" />,
  error: <AlertCircle size={18} className="hdx_text-error" />,
  info: <Info size={18} className="hdx_text-info" />,
};

export default function Toaster() {
  const { toasts, dismissToast } = useApp();
  return (
    <div className="hdx_fixed hdx_top-4 hdx_right-4 hdx_z-60 hdx_flex hdx_flex-col hdx_gap-2 hdx_w-80">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="card toast-enter hdx_flex hdx_items-start hdx_gap-3 hdx_px-4 hdx_py-3 hdx_shadow-dropdown"
        >
          <span className="hdx_mt-0.5 hdx_shrink-0">{icons[t.type] || icons.info}</span>
          <p className="hdx_flex-1 hdx_text-body hdx_text-ink">{t.message}</p>
          <button
            onClick={() => dismissToast(t.id)}
            className="hdx_text-ink-secondary hdx_hover_text-ink"
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
