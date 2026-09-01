const tones = [
  'bg-blue-100 text-blue-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-violet-100 text-violet-700',
  'bg-rose-100 text-rose-700',
  'bg-cyan-100 text-cyan-700',
];

export default function Avatar({ name, initials, size = 'md', className = '' }) {
  const hash = [...(initials || name || '')].reduce((a, c) => a + c.charCodeAt(0), 0);
  const tone = tones[hash % tones.length];
  const sizes = {
    xs: 'h-7 w-7 text-[11px]',
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-lg',
    xl: 'h-20 w-20 text-2xl',
  };
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-semibold shrink-0 ${tone} ${sizes[size]} ${className}`}
      aria-hidden="true"
    >
      {initials || name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
    </span>
  );
}
