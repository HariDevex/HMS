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
  consultation: { icon: Stethoscope, color: 'hdx_bg-blue-50 hdx_text-primary hdx_ring-blue-200' },
  report: { icon: FileText, color: 'hdx_bg-violet-50 hdx_text-violet-600 hdx_ring-violet-200' },
  scan: { icon: ScanLine, color: 'hdx_bg-info-10 hdx_text-info hdx_ring-cyan-200' },
  prescription: { icon: Pill, color: 'hdx_bg-emerald-50 hdx_text-success hdx_ring-emerald-200' },
  recommendation: { icon: ClipboardList, color: 'hdx_bg-amber-50 hdx_text-warning hdx_ring-amber-200' },
  'follow-up': { icon: CalendarClock, color: 'hdx_bg-slate-50 hdx_text-ink-secondary hdx_ring-slate-200' },
};

export default function Timeline({ items }) {
  return (
    <ol className="hdx_relative">
      {items.map((item, i) => {
        const cfg = typeConfig[item.type] || typeConfig['follow-up'];
        const Icon = cfg.icon;
        return (
          <li key={item.id} className="hdx_relative hdx_flex hdx_gap-4 hdx_pb-7 hdx_last_pb-0">
            {i < items.length - 1 && (
              <span className="hdx_absolute hdx_left-19px hdx_top-11 hdx_bottom-0 hdx_w-px hdx_bg-line" aria-hidden="true" />
            )}
            <span className={`hdx_relative hdx_z-10 hdx_h-10 hdx_w-10 hdx_shrink-0 hdx_rounded-full hdx_ring-4 hdx_ring-white hdx_flex hdx_items-center hdx_justify-center ${cfg.color}`}>
              <Icon size={17} />
            </span>
            <div className="hdx_flex-1 hdx_min-w-0 hdx_pt-0.5">
              <div className="hdx_flex hdx_flex-wrap hdx_items-center hdx_gap-2">
                <p className="hdx_text-body hdx_font-semibold hdx_text-ink">{item.title}</p>
                <Badge color="primary">{item.type.replace('-', ' ')}</Badge>
              </div>
              <p className="hdx_text-small hdx_text-ink-secondary hdx_mt-0.5">{item.date}</p>
              <p className="hdx_text-body hdx_text-ink-secondary hdx_mt-1.5 hdx_leading-relaxed">{item.desc}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
