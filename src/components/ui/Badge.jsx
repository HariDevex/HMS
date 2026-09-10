import React from 'react';

export default function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  icon: Icon,
  className = '',
}) {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  }[size] || 'text-xs px-2.5 py-1 gap-1.5';

  const variantClasses = {
    primary: "bg-blue-50 text-blue-700 border border-blue-200",
    success: "bg-green-50 text-green-700 border border-green-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    error: "bg-red-50 text-red-700 border border-red-200",
    critical: "bg-red-100 text-red-800 border border-red-300 font-bold",
    info: "bg-cyan-50 text-cyan-700 border border-cyan-200",
    purple: "bg-violet-50 text-violet-700 border border-violet-200",
    neutral: "bg-slate-100 text-slate-700 border border-slate-200",
  }[variant] || 'bg-slate-100 text-slate-700 border border-slate-200';

  const dotColors = {
    primary: "bg-primary",
    success: "bg-success",
    warning: "bg-warning",
    error: "bg-error",
    critical: "bg-error animate-pulse",
    info: "bg-info",
    purple: "bg-violet-600",
    neutral: "bg-slate-400",
  }[variant] || 'bg-slate-400';

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${sizeClasses} ${variantClasses} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors}`} />}
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{children}</span>
    </span>
  );
}
