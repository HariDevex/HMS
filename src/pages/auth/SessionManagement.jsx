import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Laptop,
  Smartphone,
  Tablet,
  Globe,
  MoreHorizontal,
  ShieldCheck,
} from 'lucide-react';
import Badge from '../../components/ui/Badge';

const sessions = [
  { id: 1, device: 'MacBook Pro — Chrome', type: 'laptop', ip: '10.12.4.55', location: 'San Jose, CA', lastActive: 'Active now', current: true },
  { id: 2, device: 'iPhone 14 — MediCore App', type: 'mobile', ip: '10.12.8.12', location: 'San Jose, CA', lastActive: '2 hrs ago', current: false },
  { id: 3, device: 'iPad — Safari', type: 'tablet', ip: '10.12.9.07', location: 'San Francisco, CA', lastActive: '1 day ago', current: false },
];

const deviceIcons = { laptop: Laptop, mobile: Smartphone, tablet: Tablet };

export default function SessionManagement() {
  return (
    <div className="min-h-screen bg-surface p-6 sm:p-10 flex justify-center">
      <div className="w-full max-w-3xl">
        <Link to="/login" className="inline-flex items-center gap-2 text-body font-medium text-primary hover:underline mb-8">
          <ArrowLeft size={16} /> Back to sign in
        </Link>
        <div className="flex items-center gap-3 mb-8">
          <div className="h-11 w-11 rounded-xl bg-primary-light flex items-center justify-center">
            <ShieldCheck size={22} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-ink">Active sessions</h1>
            <p className="text-secondary text-ink-secondary">Manage devices currently signed in to your account.</p>
          </div>
        </div>

        <div className="card divide-y divide-line">
          {sessions.map((s) => {
            const Icon = deviceIcons[s.type] || Globe;
            return (
              <div key={s.id} className="flex items-center gap-4 px-5 py-4">
                <div className="h-10 w-10 rounded-input bg-slate-100 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-ink-secondary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-body font-semibold text-ink truncate">{s.device}</p>
                    {s.current && <Badge color="primary" dot>This device</Badge>}
                  </div>
                  <p className="text-small text-ink-secondary mt-0.5">
                    IP {s.ip} · {s.location}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-small font-medium text-ink">{s.lastActive}</p>
                  <button className="text-small font-medium text-error hover:underline mt-0.5">
                    {s.current ? 'Active' : 'Sign out'}
                  </button>
                </div>
                <button className="text-ink-secondary hover:text-ink p-1.5 rounded-input hover:bg-slate-50" aria-label="More options">
                  <MoreHorizontal size={18} />
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex justify-end">
          <button className="btn-secondary text-error border-error/30 hover:bg-red-50">
            Sign out all other sessions
          </button>
        </div>
      </div>
    </div>
  );
}
