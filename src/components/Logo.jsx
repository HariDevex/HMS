import { Plus } from 'lucide-react';

export default function Logo({ size = 'md', light = false }) {
  const box = size === 'lg' ? 'h-10 w-10' : 'h-9 w-9';
  const text = size === 'lg' ? 'text-lg' : 'text-base';
  return (
    <div className="flex items-center gap-2.5">
      <div className={`${box} rounded-lg bg-primary flex items-center justify-center shadow-card`}>
        <Plus size={size === 'lg' ? 22 : 20} className="text-white" strokeWidth={3} />
      </div>
      <div className={`font-semibold tracking-tight ${text} ${light ? 'text-white' : 'text-navy'}`}>
        Medi<span className="text-primary">Core</span>
        <span className={`block text-[11px] font-medium ${light ? 'text-slate-300' : 'text-ink-secondary'}`}>
          Hospital Management
        </span>
      </div>
    </div>
  );
}
