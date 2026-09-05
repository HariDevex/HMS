export function Field({ label, error, hint, required, children, className='' }) {
  return (
    <div className={className}>
      {label && (
        <label className="label">
          {label} {required && <span className="hdx_text-error">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="hdx_mt-1.5 hdx_text-small hdx_text-ink-secondary">{hint}</p>}
      {error && (
        <p className="hdx_mt-1.5 hdx_text-small hdx_text-error hdx_flex hdx_items-center hdx_gap-1" role="alert">
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
      className={`input hdx_appearance-none hdx_select-chevron hdx_pr-10 ${
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
      className={`input hdx_h-auto hdx_min-h-90px hdx_py-2.5 hdx_resize-y ${error ? '!border-error' : ''}`}
      {...rest}
    />
  );
}

export function SearchInput({ icon, ...rest }) {
  return (
    <div className="hdx_relative">
      {icon && (
        <span className="hdx_absolute hdx_left-3 hdx_top-1/2 hdx_transform hdx_translate-y--1/2 hdx_text-ink-secondary">{icon}</span>
      )}
      <input className={`input ${icon ? 'hdx_pl-9' : ''}`} {...rest} />
    </div>
  );
}
