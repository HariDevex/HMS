import { useState } from 'react';
import {
  FileText,
  CalendarDays,
  ClipboardList,
  CalendarClock,
  Clock3,
  Users,
  Check,
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Badge from '../components/ui/Badge';
import { notifications } from '../data/mock';
import { useApp } from '../context/AppContext';

const typeMeta = {
  report: { icon: FileText, color: 'hdx_bg-blue-50 hdx_text-primary' },
  appointment: { icon: CalendarDays, color: 'hdx_bg-cyan-50 hdx_text-info' },
  recommendation: { icon: ClipboardList, color: 'hdx_bg-amber-50 hdx_text-warning' },
  followup: { icon: CalendarClock, color: 'hdx_bg-violet-50 hdx_text-violet-600' },
  pending: { icon: Clock3, color: 'hdx_bg-red-50 hdx_text-error' },
  staff: { icon: Users, color: 'hdx_bg-slate-100 hdx_text-ink-secondary' },
};

export default function Notifications() {
  const { pushToast } = useApp();
  const [list, setList] = useState(notifications);
  const [filter, setFilter] = useState('');

  const filtered = list.filter((n) => !filter || n.type === filter);
  const unread = list.filter((n) => n.unread).length;

  const markAll = () => {
    setList(list.map((n) => ({ ...n, unread: false })));
    pushToast('All notifications marked as read', 'success');
  };

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle={`You have ${unread} unread notifications.`}
        actions={
          <button className="btn-secondary" onClick={markAll}><Check size={16} /> Mark all read</button>
        }
      />

      <div className="hdx_grid hdx_grid-cols-1 hdx_lg_grid-cols-4 hdx_gap-4">
        <div className="hdx_lg_col-span-1 card hdx_p-4 hdx_h-fit">
          <p className="hdx_text-small hdx_font-semibold hdx_text-ink hdx_mb-3">Filter by category</p>
          <button onClick={() => setFilter('')} className={`hdx_w-full hdx_text-left hdx_px-3 hdx_py-2 hdx_rounded-input hdx_text-body hdx_font-medium hdx_mb-1 ${!filter ? 'hdx_bg-primary-light hdx_text-primary' : 'hdx_text-ink-secondary hdx_hover_bg-slate-50'}`}>
            All notifications
          </button>
          {Object.entries({
            report: 'Reports', appointment: 'Appointments', recommendation: 'Recommendations',
            followup: 'Follow-ups', pending: 'Pending', staff: 'Staff activity',
          }).map(([k, label]) => (
            <button key={k} onClick={() => setFilter(k)} className={`hdx_w-full hdx_text-left hdx_px-3 hdx_py-2 hdx_rounded-input hdx_text-body hdx_font-medium hdx_mb-1 ${filter === k ? 'hdx_bg-primary-light hdx_text-primary' : 'hdx_text-ink-secondary hdx_hover_bg-slate-50'}`}>
              {label}
            </button>
          ))}
        </div>

        <div className="hdx_lg_col-span-3 card hdx_divide-y hdx_divide-line">
          {filtered.map((n) => {
            const meta = typeMeta[n.type];
            const Icon = meta.icon;
            return (
              <div key={n.id} className={`hdx_flex hdx_items-start hdx_gap-3.5 hdx_px-5 hdx_py-4 ${n.unread ? 'hdx_bg-primary-light-40' : ''}`}>
                <span className={`hdx_h-10 hdx_w-10 hdx_rounded-10 hdx_flex hdx_items-center hdx_justify-center hdx_shrink-0 ${meta.color}`}>
                  <Icon size={18} />
                </span>
                <div className="hdx_flex-1 hdx_min-w-0">
                  <div className="hdx_flex hdx_items-center hdx_gap-2">
                    <p className="hdx_text-body hdx_font-semibold hdx_text-ink">{n.title}</p>
                    {n.unread && <Badge color="primary">New</Badge>}
                  </div>
                  <p className="hdx_text-secondary-text hdx_text-ink-secondary hdx_mt-0.5">{n.message}</p>
                  <p className="hdx_text-small hdx_text-ink-secondary hdx_mt-1">{n.time}</p>
                </div>
                {n.unread && <span className="hdx_mt-2 hdx_w-2 hdx_h-2 hdx_rounded-full hdx_bg-primary hdx_shrink-0" />}
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="hdx_px-5 hdx_py-14 hdx_text-center hdx_text-ink-secondary">No notifications in this category.</div>
          )}
        </div>
      </div>
    </div>
  );
}
