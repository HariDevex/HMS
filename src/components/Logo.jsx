import { Plus } from 'lucide-react';

export default function Logo({ size = 'md', light = false }) {
  const box = size === 'lg' ? 'hdx_h-10 hdx_w-10' : 'hdx_h-9 hdx_w-9';
  const text = size === 'lg' ? 'hdx_text-lg' : 'hdx_text-base';
  return (
    <div className="hdx_flex hdx_items-center hdx_gap-2.5">
      <div className={`${box} hdx_rounded-lg hdx_bg-primary hdx_flex hdx_items-center hdx_justify-center hdx_shadow-card`}>
        <Plus size={size === 'lg' ? 22 : 20} className="hdx_text-white" strokeWidth={3} />
      </div>
      <div className={`hdx_font-semibold hdx_tracking-tight ${text} ${light ? 'hdx_text-white' : 'hdx_text-navy'}`}>
        Medi<span className="hdx_text-primary">Core</span>
        <span className={`hdx_block hdx_text-11 hdx_font-medium ${light ? 'hdx_text-slate-300' : 'hdx_text-ink-secondary'}`}>
          Hospital Management
        </span>
      </div>
    </div>
  );
}
