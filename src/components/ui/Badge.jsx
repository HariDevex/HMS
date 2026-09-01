const BadgeStyles = {
  success: 'bg-green-50 text-green-700 ring-1 ring-green-200',
  warning: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  error: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  info: 'bg-cyan-50 text-cyan-700 ring-1 ring-cyan-200',
  primary: 'bg-blue-50 text-primary ring-1 ring-blue-200',
  navy: 'bg-[#EFF6FF] text-navy ring-1 ring-blue-200',
  secondary: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
};

export default function Badge({ color = 'secondary', children, dot }) {
  return (
    <span className={`badge ${BadgeStyles[color] || BadgeStyles.secondary}`}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
