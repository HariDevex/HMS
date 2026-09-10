import React from 'react';
import { AlertOctagon, AlertTriangle, Info } from 'lucide-react';

export default function CriticalAlert({
  title,
  message,
  type = 'critical', // 'critical' | 'warning' | 'info'
  action,
  className = '',
}) {
  const styles = {
    critical: {
      container: 'bg-red-50/90 border-l-4 border-error text-red-950 border-y border-r border-red-200 shadow-xs',
      icon: <AlertOctagon className="w-5 h-5 text-error shrink-0 mt-0.5" />,
      titleColor: 'text-red-900',
      badge: 'CRITICAL CLINICAL ALERT',
      badgeColor: 'bg-red-100 text-red-800 border-red-300',
    },
    warning: {
      container: 'bg-amber-50/90 border-l-4 border-warning text-amber-950 border-y border-r border-amber-200 shadow-xs',
      icon: <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />,
      titleColor: 'text-amber-900',
      badge: 'CLINICAL CAUTION',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    },
    info: {
      container: 'bg-blue-50/90 border-l-4 border-primary text-blue-950 border-y border-r border-blue-200 shadow-xs',
      icon: <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />,
      titleColor: 'text-blue-900',
      badge: 'NOTICE',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    },
  }[type] || styles.critical;

  return (
    <div className={`p-4 rounded-xl flex items-start gap-3.5 ${styles.container} ${className}`}>
      {styles.icon}
      <div className="grow">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${styles.badgeColor}`}>
            {styles.badge}
          </span>
          {title && <h5 className={`text-sm font-bold ${styles.titleColor}`}>{title}</h5>}
        </div>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{message}</p>
        {action && <div className="mt-2.5">{action}</div>}
      </div>
    </div>
  );
}
