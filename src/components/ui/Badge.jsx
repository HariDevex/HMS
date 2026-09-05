const BadgeStyles = {
  success: 'hdx_bg-green-50 hdx_text-green-700 hdx_ring-1 hdx_ring-green-200',
  warning: 'hdx_bg-amber-50 hdx_text-amber-700 hdx_ring-1 hdx_ring-amber-200',
  error: 'hdx_bg-red-50 hdx_text-red-700 hdx_ring-1 hdx_ring-red-200',
  info: 'hdx_bg-cyan-50 hdx_text-cyan-700 hdx_ring-1 hdx_ring-cyan-200',
  primary: 'hdx_bg-blue-50 hdx_text-primary hdx_ring-1 hdx_ring-blue-200',
  navy: 'hdx_bg-primary-light hdx_text-navy hdx_ring-1 hdx_ring-blue-200',
  secondary: 'hdx_bg-slate-100 hdx_text-slate-600 hdx_ring-1 hdx_ring-slate-200',
};

export default function Badge({ color = 'secondary', children, dot }) {
  return (
    <span className={`badge ${BadgeStyles[color] || BadgeStyles.secondary}`}>
      {dot && <span className="hdx_w-1.5 hdx_h-1.5 hdx_rounded-full hdx_bg-current" />}
      {children}
    </span>
  );
}
