const tones = [
  'hdx_bg-blue-100 hdx_text-blue-700',
  'hdx_bg-emerald-100 hdx_text-emerald-700',
  'hdx_bg-amber-100 hdx_text-amber-700',
  'hdx_bg-violet-100 hdx_text-violet-700',
  'hdx_bg-rose-100 hdx_text-rose-700',
  'hdx_bg-cyan-100 hdx_text-cyan-700',
];

export default function Avatar({ name, initials, size = 'md', className = '' }) {
  const hash = [...(initials || name || '')].reduce((a, c) => a + c.charCodeAt(0), 0);
  const tone = tones[hash % tones.length];
  const sizes = {
    xs: 'hdx_h-7 hdx_w-7 hdx_text-11',
    sm: 'hdx_h-8 hdx_w-8 hdx_text-xs',
    md: 'hdx_h-10 hdx_w-10 hdx_text-sm',
    lg: 'hdx_h-14 hdx_w-14 hdx_text-lg',
    xl: 'hdx_h-20 hdx_w-20 hdx_text-2xl',
  };
  return (
    <span
      className={`hdx_inline-flex hdx_items-center hdx_justify-center hdx_rounded-full hdx_font-semibold hdx_shrink-0 ${tone} ${sizes[size]} ${className}`}
      aria-hidden="true"
    >
      {initials || name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
    </span>
  );
}
