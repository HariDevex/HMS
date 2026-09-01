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
  report: { icon: FileText, color: 'bg-blue-50 text-primary' },
  appointment: { icon: CalendarDays, color: 'bg-cyan-50 text-info' },
  recommendation: { icon: ClipboardList, color: 'bg-amber-50 text-warning' },
  followup: { icon: CalendarClock, color: 'bg-violet-50 text-violet-600' },
  pending: { icon: Clock3, color: 'bg-red-50 text-error' },
  staff: { icon: Users, color: 'bg-slate-100 text-ink-secondary' },
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1 card p-4 h-fit">
          <p className="text-small font-semibold text-ink mb-3">Filter by category</p>
          <button onClick={() => setFilter('')} className={`w-full text-left px-3 py-2 rounded-input text-body font-medium mb-1 ${!filter ? 'bg-primary-light text-primary' : 'text-ink-secondary hover:bg-slate-50'}`}>
            All notifications
          </button>
          {Object.entries({
            report: 'Reports', appointment: 'Appointments', recommendation: 'Recommendations',
            followup: 'Follow-ups', pending: 'Pending', staff: 'Staff activity',
          }).map(([k, label]) => (
            <button key={k} onClick={() => setFilter(k)} className={`w-full text-left px-3 py-2 rounded-input text-body font-medium mb-1 ${filter === k ? 'bg-primary-light text-primary' : 'text-ink-secondary hover:bg-slate-50'}`}>
              {label}
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 card divide-y divide-line">
          {filtered.map((n) => {
            const meta = typeMeta[n.type];
            const Icon = meta.icon;
            return (
              <div key={n.id} className={`flex items-start gap-3.5 px-5 py-4 ${n.unread ? 'bg-primary-light/40' : ''}`}>
                <span className={`h-10 w-10 rounded-[10px] flex items-center justify-center shrink-0 ${meta.color}`}>
                  <Icon size={18} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-body font-semibold text-ink">{n.title}</p>
                    {n.unread && <Badge color="primary">New</Badge>}
                  </div>
                  <p className="text-secondary text-ink-secondary mt-0.5">{n.message}</p>
                  <p className="text-small text-ink-secondary mt-1">{n.time}</p>
                </div>
                {n.unread && <span className="mt-2 w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="px-5 py-14 text-center text-ink-secondary">No notifications in this category.</div>
          )}
        </div>
      </div>
    </div>
  );
}
