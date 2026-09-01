import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const icons = {
  success: <CheckCircle2 size={18} className="text-success" />,
  error: <AlertCircle size={18} className="text-error" />,
  info: <Info size={18} className="text-info" />,
};

export default function Toaster() {
  const { toasts, dismissToast } = useApp();
  return (
    <div className="fixed top-4 right-4 z-[60] flex flex-col gap-2 w-80">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="card toast-enter flex items-start gap-3 px-4 py-3 shadow-dropdown"
        >
          <span className="mt-0.5 shrink-0">{icons[t.type] || icons.info}</span>
          <p className="flex-1 text-body text-ink">{t.message}</p>
          <button
            onClick={() => dismissToast(t.id)}
            className="text-ink-secondary hover:text-ink"
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
