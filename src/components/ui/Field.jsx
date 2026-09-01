export function Field({ label, error, hint, required, children, className = '' }) {
  return (
    <div className={className}>
      {label && (
        <label className="label">
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="mt-1.5 text-small text-ink-secondary">{hint}</p>}
      {error && (
        <p className="mt-1.5 text-small text-error flex items-center gap-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function Input(props) {
  const { error, ...rest } = props;
  return (
    <input
      className={`input ${error ? '!border-error focus:!border-error focus:!ring-red-100' : ''}`}
      {...rest}
    />
  );
}

export function Select({ children, error, ...rest }) {
  return (
    <select
      className={`input appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748B%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_0.75rem_center] pr-10 ${
        error ? '!border-error' : ''
      }`}
      {...rest}
    >
      {children}
    </select>
  );
}

export function Textarea({ error, ...rest }) {
  return (
    <textarea
      className={`input h-auto min-h-[90px] py-2.5 resize-y ${error ? '!border-error' : ''}`}
      {...rest}
    />
  );
}

export function SearchInput({ icon, ...rest }) {
  return (
    <div className="relative">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-secondary">{icon}</span>
      )}
      <input className={`input ${icon ? 'pl-9' : ''}`} {...rest} />
    </div>
  );
}
