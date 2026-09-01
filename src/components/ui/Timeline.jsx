import {
  Stethoscope,
  FileText,
  ScanLine,
  Pill,
  ClipboardList,
  CalendarClock,
} from 'lucide-react';
import Badge from '../ui/Badge';

const typeConfig = {
  consultation: { icon: Stethoscope, color: 'bg-blue-50 text-primary ring-blue-200' },
  report: { icon: FileText, color: 'bg-violet-50 text-violet-600 ring-violet-200' },
  scan: { icon: ScanLine, color: 'bg-info/10 text-info ring-cyan-200' },
  prescription: { icon: Pill, color: 'bg-emerald-50 text-success ring-emerald-200' },
  recommendation: { icon: ClipboardList, color: 'bg-amber-50 text-warning ring-amber-200' },
  'follow-up': { icon: CalendarClock, color: 'bg-slate-50 text-ink-secondary ring-slate-200' },
};

export default function Timeline({ items }) {
  return (
    <ol className="relative">
      {items.map((item, i) => {
        const cfg = typeConfig[item.type] || typeConfig['follow-up'];
        const Icon = cfg.icon;
        return (
          <li key={item.id} className="relative flex gap-4 pb-7 last:pb-0">
            {i < items.length - 1 && (
              <span className="absolute left-[19px] top-11 bottom-0 w-px bg-line" aria-hidden="true" />
            )}
            <span className={`relative z-10 h-10 w-10 shrink-0 rounded-full ring-4 ring-white flex items-center justify-center ${cfg.color}`}>
              <Icon size={17} />
            </span>
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-body font-semibold text-ink">{item.title}</p>
                <Badge color="primary">{item.type.replace('-', ' ')}</Badge>
              </div>
              <p className="text-small text-ink-secondary mt-0.5">{item.date}</p>
              <p className="text-body text-ink-secondary mt-1.5 leading-relaxed">{item.desc}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
