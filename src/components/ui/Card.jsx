import React from 'react';

export function CardHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-4 ${className}`}>
      <div>
        {title && <h3 className="text-base font-semibold text-slate-900 tracking-tight">{title}</h3>}
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0 flex items-center gap-2">{action}</div>}
    </div>
  );
}

export function CardBody({ children, className = '' }) {
  return <div className={`p-4 sm:p-5 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`px-4 sm:px-5 py-3 bg-slate-50/70 border-t border-slate-100 rounded-b-xl flex items-center justify-between gap-3 ${className}`}>
      {children}
    </div>
  );
}

export default function Card({ children, className = '', hover = false, onClick, ...props }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200/80 shadow-sm transition-all duration-200 ${
        hover ? 'hover:shadow-md hover:border-slate-300 cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
