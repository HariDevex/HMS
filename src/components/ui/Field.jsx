import React from 'react';
import { AlertCircle } from 'lucide-react';

export function Label({ children, required = false, htmlFor, className = '' }) {
  return (
    <label htmlFor={htmlFor} className={`block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 ${className}`}>
      {children}
      {required && <span className="text-error ml-1 font-bold">*</span>}
    </label>
  );
}

export function Input({
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  error,
  icon: Icon,
  className = '',
  ...props
}) {
  return (
    <div className="relative flex items-center">
      {Icon && (
        <div className="absolute left-3 text-slate-400 pointer-events-none flex items-center">
          <Icon className="w-4 h-4" />
        </div>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full h-10 text-sm bg-white rounded-lg border transition-colors duration-150 text-slate-900 placeholder_text-slate-400 focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed ${
          Icon ? 'pl-9 pr-3' : 'px-3'
        } ${
          error
            ? 'border-error focus:border-error focus:ring-red-100 text-error'
            : 'border-slate-300 focus:border-primary focus:ring-blue-100'
        } ${className}`}
        {...props}
      />
    </div>
  );
}

export function Select({
  id,
  value,
  onChange,
  disabled = false,
  error,
  options = [],
  placeholder,
  children,
  className = '',
  ...props
}) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full h-10 text-sm bg-white rounded-lg border transition-colors duration-150 text-slate-900 focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed appearance-none px-3 pr-8 ${
          error
            ? 'border-error focus:border-error focus:ring-red-100'
            : 'border-slate-300 focus:border-primary focus:ring-blue-100'
        } ${className}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.length > 0
          ? options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))
          : children}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

export function Textarea({
  id,
  placeholder,
  value,
  onChange,
  rows = 3,
  disabled = false,
  error,
  className = '',
  ...props
}) {
  return (
    <textarea
      id={id}
      rows={rows}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full text-sm bg-white rounded-lg border p-3 transition-colors duration-150 text-slate-900 placeholder_text-slate-400 focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed ${
        error
          ? 'border-error focus:border-error focus:ring-red-100 text-error'
          : 'border-slate-300 focus:border-primary focus:ring-blue-100'
      } ${className}`}
      {...props}
    />
  );
}

export default function Field({
  label,
  required = false,
  error,
  hint,
  children,
  className = '',
}) {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && <Label required={required}>{label}</Label>}
      {children}
      {error && (
        <p className="mt-1.5 text-xs text-error flex items-center gap-1 font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
      {!error && hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
