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
    <div className="hdx_min-h-screen hdx_bg-surface hdx_p-6 hdx_sm_p-10 hdx_flex hdx_justify-center">
      <div className="hdx_w-full hdx_max-w-3xl">
        <Link to="/login" className="hdx_inline-flex hdx_items-center hdx_gap-2 hdx_text-body hdx_font-medium hdx_text-primary hdx_hover_underline hdx_mb-8">
          <ArrowLeft size={16} /> Back to sign in
        </Link>
        <div className="hdx_flex hdx_items-center hdx_gap-3 hdx_mb-8">
          <div className="hdx_h-11 hdx_w-11 hdx_rounded-xl hdx_bg-primary-light hdx_flex hdx_items-center hdx_justify-center">
            <ShieldCheck size={22} className="hdx_text-primary" />
          </div>
          <div>
            <h1 className="hdx_text-2xl hdx_font-bold hdx_text-ink">Active sessions</h1>
            <p className="hdx_text-secondary-text hdx_text-ink-secondary">Manage devices currently signed in to your account.</p>
          </div>
        </div>

        <div className="card hdx_divide-y hdx_divide-line">
          {sessions.map((s) => {
            const Icon = deviceIcons[s.type] || Globe;
            return (
              <div key={s.id} className="hdx_flex hdx_items-center hdx_gap-4 hdx_px-5 hdx_py-4">
                <div className="hdx_h-10 hdx_w-10 hdx_rounded-input hdx_bg-slate-100 hdx_flex hdx_items-center hdx_justify-center hdx_shrink-0">
                  <Icon size={18} className="hdx_text-ink-secondary" />
                </div>
                <div className="hdx_flex-1 hdx_min-w-0">
                  <div className="hdx_flex hdx_items-center hdx_gap-2">
                    <p className="hdx_text-body hdx_font-semibold hdx_text-ink hdx_truncate">{s.device}</p>
                    {s.current && <Badge color="primary" dot>This device</Badge>}
                  </div>
                  <p className="hdx_text-small hdx_text-ink-secondary hdx_mt-0.5">
                    IP {s.ip} · {s.location}
                  </p>
                </div>
                <div className="hdx_text-right">
                  <p className="hdx_text-small hdx_font-medium hdx_text-ink">{s.lastActive}</p>
                  <button className="hdx_text-small hdx_font-medium hdx_text-error hdx_hover_underline hdx_mt-0.5">
                    {s.current ? 'Active' : 'Sign out'}
                  </button>
                </div>
                <button className="hdx_text-ink-secondary hdx_hover_text-ink hdx_p-1.5 hdx_rounded-input hdx_hover_bg-slate-50" aria-label="More options">
                  <MoreHorizontal size={18} />
                </button>
              </div>
            );
          })}
        </div>

        <div className="hdx_mt-4 hdx_flex hdx_justify-end">
          <button className="btn-secondary hdx_text-error hdx_border-error-30 hdx_hover_bg-red-50">
            Sign out all other sessions
          </button>
        </div>
      </div>
    </div>
  );
}
