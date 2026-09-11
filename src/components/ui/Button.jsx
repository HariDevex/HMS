import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-lg select-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1';
  
  const sizeClasses = {
    xs: 'text-[11px] px-2 py-1 h-6.5 gap-1 rounded-md font-semibold',
    sm: 'text-xs px-2.5 py-1.5 h-8 gap-1.5',
    md: 'text-sm px-3.5 py-2 h-10 gap-2',
    lg: 'text-base px-5 py-2.5 h-12 gap-2.5',
    icon: 'p-2 h-10 w-10 justify-center',
    'icon-sm': 'p-1.5 h-8 w-8 justify-center',
    'icon-xs': 'p-1 h-6.5 w-6.5 justify-center',
  }[size] || 'text-sm px-3.5 py-2 h-10 gap-2';

  const iconSizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    icon: 'w-4 h-4',
    'icon-sm': 'w-3.5 h-3.5',
    'icon-xs': 'w-3 h-3',
  }[size] || 'w-4 h-4';

  const variantClasses = {
    primary: "bg-primary text-white hover:bg-primary-dark focus:ring-blue-300 shadow-sm",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 focus:ring-slate-200 shadow-sm",
    outline: "bg-transparent text-primary border border-primary/30 hover:bg-primary-light focus:ring-blue-200",
    danger: "bg-error text-white hover:bg-red-700 focus:ring-red-200 shadow-sm",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-200",
    success: "bg-success text-white hover:bg-green-700 focus:ring-green-200 shadow-sm",
    soft: "bg-primary-light text-primary hover:bg-blue-100 focus:ring-blue-200 font-semibold",
  }[variant] || 'bg-primary text-white hover:bg-primary-dark';

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {loading && <Loader2 className={`${iconSizeClasses} animate-spin text-current`} />}
      {!loading && Icon && iconPosition === 'left' && <Icon className={`${iconSizeClasses} text-current`} />}
      {children}
      {!loading && Icon && iconPosition === 'right' && <Icon className={`${iconSizeClasses} text-current`} />}
    </button>
  );
}
