import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />,
          error: <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />,
          info: <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />,
        };

        const borders = {
          success: "border-emerald-200 bg-emerald-50/95 text-emerald-950",
          error: "border-red-200 bg-red-50/95 text-red-950",
          warning: "border-amber-200 bg-amber-50/95 text-amber-950",
          info: "border-blue-200 bg-blue-50/95 text-blue-950",
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl shadow-lg border flex items-start gap-3 backdrop-blur-xs transition-all duration-200 animate-slide-in-right ${
              borders[toast.type] || borders.info
            }`}
          >
            {icons[toast.type] || icons.info}
            <div className="grow">
              {toast.title && <h5 className="text-xs font-bold uppercase tracking-wider mb-0.5">{toast.title}</h5>}
              <p className="text-xs text-slate-700 leading-snug">{toast.message}</p>
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-700 rounded p-1 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
