import {
  Users,
  Stethoscope,
  CalendarCheck,
  FileWarning,
  Plus,
  ArrowUpRight,
  Clock,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import { activity, reports, DEPARTMENTS } from '../data/mock';
import { useApp } from '../context/AppContext';

const roleConfig = {
  doctor: {
    greeting: 'Good morning, Dr. Chen',
    subtitle: "Here's your clinical schedule for today.",
    stats: [
      { icon: CalendarCheck, iconBg: 'hdx_bg-primary', label: "Today's Appointments", value: '14', trend: '+3', hint: 'vs yesterday', trendDir: 'up' },
      { icon: Users, iconBg: 'hdx_bg-info', label: 'Patients Under Care', value: '38', trend: '+5', hint: 'this week', trendDir: 'up' },
      { icon: FileWarning, iconBg: 'hdx_bg-warning', label: 'Pending Reports', value: '6', trend: '-2', hint: 'needs review', trendDir: 'up' },
      { icon: Stethoscope, iconBg: 'hdx_bg-navy', label: 'Consultations Today', value: '11', trend: '40%', hint: 'of capacity', trendDir: 'up' },
    ],
  },
  nurse: {
    greeting: 'Good morning, Nurse',
    subtitle: "Here's your care summary for today.",
    stats: [
      { icon: Users, iconBg: 'hdx_bg-primary', label: 'Patients Assigned', value: '22', trend: '+2', hint: 'today', trendDir: 'up' },
      { icon: CalendarCheck, iconBg: 'hdx_bg-info', label: 'Check-ins Pending', value: '9', trend: '+4', hint: 'this morning', trendDir: 'up' },
      { icon: Clock, iconBg: 'hdx_bg-warning', label: 'Medications Due', value: '31', trend: 'On track', hint: '', trendDir: 'up' },
      { icon: FileWarning, iconBg: 'hdx_bg-navy', label: 'Vitals Due', value: '15', trend: '-3', hint: '', trendDir: 'up' },
    ],
  },
  lab: {
    greeting: 'Good morning, Lab Technician',
    subtitle: "Here's your laboratory workload today.",
    stats: [
      { icon: FileWarning, iconBg: 'hdx_bg-warning', label: 'Samples Pending', value: '17', trend: '+6', hint: 'to process', trendDir: 'up' },
      { icon: Users, iconBg: 'hdx_bg-primary', label: 'Reports Completed', value: '42', trend: '+12%', hint: 'vs yesterday', trendDir: 'up' },
      { icon: CalendarCheck, iconBg: 'hdx_bg-info', label: 'In Progress', value: '8', trend: '+3', hint: 'active batches', trendDir: 'up' },
      { icon: Stethoscope, iconBg: 'hdx_bg-navy', label: 'Avg Turnaround', value: '2.4h', trend: '-18%', hint: 'faster', trendDir: 'up' },
    ],
  },
  radiology: {
    greeting: 'Good morning, Radiology Technician',
    subtitle: "Here's your imaging queue today.",
    stats: [
      { icon: Users, iconBg: 'hdx_bg-primary', label: 'Scans Queued', value: '12', trend: '+4', hint: 'scheduled', trendDir: 'up' },
      { icon: CalendarCheck, iconBg: 'hdx_bg-info', label: 'Completed Today', value: '18', trend: '+10', hint: 'vs yesterday', trendDir: 'up' },
      { icon: FileWarning, iconBg: 'hdx_bg-warning', label: 'Pending Reads', value: '7', trend: '-3', hint: 'to review', trendDir: 'up' },
      { icon: Stethoscope, iconBg: 'hdx_bg-navy', label: 'Avg Scan Time', value: '32m', trend: '-8%', hint: 'faster', trendDir: 'up' },
    ],
  },
  reception: {
    greeting: 'Good morning, Reception',
    subtitle: "Here's your front-desk summary today.",
    stats: [
      { icon: CalendarCheck, iconBg: 'hdx_bg-primary', label: "Today's Appointments", value: '74', trend: '+5%', hint: 'vs yesterday', trendDir: 'up' },
      { icon: Users, iconBg: 'hdx_bg-info', label: 'Checked In', value: '31', trend: '+8', hint: 'so far', trendDir: 'up' },
      { icon: FileWarning, iconBg: 'hdx_bg-warning', label: 'In Waiting Room', value: '12', trend: '-4', hint: 'average wait', trendDir: 'up' },
      { icon: Stethoscope, iconBg: 'hdx_bg-navy', label: 'New Patients', value: '5', trend: '+2', hint: 'registered', trendDir: 'up' },
    ],
  },
};

const activityData = [
  { m: 'Mon', patients: 42, appointments: 31 },
  { m: 'Tue', patients: 48, appointments: 38 },
  { m: 'Wed', patients: 45, appointments: 35 },
  { m: 'Thu', patients: 58, appointments: 44 },
  { m: 'Fri', patients: 52, appointments: 40 },
  { m: 'Sat', patients: 33, appointments: 22 },
  { m: 'Sun', patients: 28, appointments: 18 },
];

const appointmentOverview = [
  { name: 'Scheduled', value: 34, color: '#2563EB' },
  { name: 'Checked In', value: 11, color: '#0891B2' },
  { name: 'In Consult', value: 16, color: '#F59E0B' },
  { name: 'Completed', value: 29, color: '#16A34A' },
  { name: 'Missed', value: 10, color: '#DC2626' },
];

const deptStats = DEPARTMENTS.map((d) => ({
  ...d,
  staff: 12 + (d.name.length % 14),
  beds: 8 + (d.id.length % 20),
}));

const stats = [
  { icon: Users, iconBg: 'hdx_bg-primary', label: 'Total Patients', value: '1,284', trend: '+8.2%', hint: 'vs last month', trendDir: 'up', sparkline: '2,5 8,4 14,6 20,3 26,7 32,5 38,6 44,4 50,8 56,6 64,5' },
  { icon: Stethoscope, iconBg: 'hdx_bg-navy', label: 'Total Staff', value: '186', trend: '+3.4%', hint: 'vs last month', trendDir: 'up', sparkline: '2,8 8,6 14,7 20,8 26,6 32,5 38,7 44,6 50,8 56,7 64,8' },
  { icon: CalendarCheck, iconBg: 'hdx_bg-info', label: "Today's Appointments", value: '74', trend: '-2.1%', hint: 'vs yesterday', trendDir: 'down', sparkline: '2,4 8,5 14,3 20,6 26,4 32,5 38,7 44,5 50,6 56,5 64,6' },
  { icon: FileWarning, iconBg: 'hdx_bg-warning', label: 'Pending Reports', value: '23', trend: '+1.2%', hint: 'needs review', trendDir: 'up', sparkline: '2,7 8,6 14,8 20,7 26,8 32,7 38,8 44,8 50,7 56,8 64,8' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { role } = useApp();

  const key = (role || 'admin').toLowerCase();
  const cfg = roleConfig[key] || roleConfig.doctor;
  const activeStats = key === 'admin' ? stats : cfg.stats;

  return (
    <div>
      <PageHeader
        title={cfg.greeting}
        subtitle={cfg.subtitle}
        actions={key === 'admin' ? (
          <>
            <button onClick={() => navigate('/patients?new=1')} className="btn-primary">
              <Plus size={16} /> Add Patient
            </button>
            <button onClick={() => navigate('/appointments?new=1')} className="btn-secondary">
              <Plus size={16} /> New Appointment
            </button>
          </>
        ) : (
          <button onClick={() => navigate('/appointments')} className="btn-primary">
            <CalendarCheck size={16} /> View Schedule
          </button>
        )}
      />

      <div className="hdx_grid hdx_grid-cols-1 hdx_sm_grid-cols-2 hdx_xl_grid-cols-4 hdx_gap-4">
        {activeStats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="hdx_mt-6 hdx_grid hdx_grid-cols-1 hdx_xl_grid-cols-3 hdx_gap-4">
        <div className="card hdx_p-5 hdx_xl_col-span-2">
          <div className="hdx_flex hdx_items-center hdx_justify-between hdx_mb-4">
            <div>
              <h2 className="hdx_text-card-title hdx_text-ink">Patient Activity</h2>
              <p className="hdx_text-small hdx_text-ink-secondary">Patients seen and appointments this week</p>
            </div>
            <div className="hdx_flex hdx_items-center hdx_gap-4 hdx_text-small hdx_text-ink-secondary">
              <span className="hdx_flex hdx_items-center hdx_gap-1.5"><span className="hdx_w-2.5 hdx_h-2.5 hdx_rounded-full hdx_bg-primary" /> Patients</span>
              <span className="hdx_flex hdx_items-center hdx_gap-1.5"><span className="hdx_w-2.5 hdx_h-2.5 hdx_rounded-full hdx_bg-cyan-500" /> Appointments</span>
            </div>
          </div>
          <div className="hdx_h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gP" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0891B2" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#0891B2" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="m" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 13, boxShadow: '0 8px 24px -4px rgba(15,39,71,0.12)' }}
                />
                <Area type="monotone" dataKey="patients" stroke="#2563EB" strokeWidth={2.5} fill="url(#gP)" name="Patients" />
                <Area type="monotone" dataKey="appointments" stroke="#0891B2" strokeWidth={2.5} fill="url(#gA)" name="Appointments" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card hdx_p-5">
          <h2 className="hdx_text-card-title hdx_text-ink hdx_mb-4">Appointment Overview</h2>
          <div className="hdx_h-230px">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={appointmentOverview} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={78} tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 13 }}
                  formatter={(v) => [`${v}%`, 'Share']}
                />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={18}>
                  {appointmentOverview.map((e) => (
                    <Cell key={e.name} fill={e.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="hdx_mt-2 hdx_flex hdx_flex-wrap hdx_gap-x-4 hdx_gap-y-1 hdx_text-small hdx_text-ink-secondary">
            {appointmentOverview.map((e) => (
              <span key={e.name} className="hdx_flex hdx_items-center hdx_gap-1.5">
                <span className="hdx_w-2 hdx_h-2 hdx_rounded-full" style={{ background: e.color }} /> {e.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="hdx_mt-6 hdx_grid hdx_grid-cols-1 hdx_xl_grid-cols-3 hdx_gap-4">
        <div className="card hdx_p-5">
          <div className="hdx_flex hdx_items-center hdx_justify-between hdx_mb-4">
            <h2 className="hdx_text-card-title hdx_text-ink">Department Statistics</h2>
            <button onClick={() => navigate('/staff')} className="hdx_text-small hdx_font-medium hdx_text-primary hdx_hover_underline">
              View staff
            </button>
          </div>
          <div className="hdx_space-y-4">
            {deptStats.slice(0, 5).map((d) => (
              <div key={d.id}>
                <div className="hdx_flex hdx_items-center hdx_justify-between hdx_text-body hdx_mb-1.5">
                  <span className="hdx_font-medium hdx_text-ink hdx_flex hdx_items-center hdx_gap-2">
                    <span className="hdx_w-2 hdx_h-2 hdx_rounded-full" style={{ background: d.color }} />
                    {d.name}
                  </span>
                  <span className="hdx_text-small hdx_text-ink-secondary">{d.staff} staff · {d.beds} beds</span>
                </div>
                <div className="hdx_h-2 hdx_rounded-full hdx_bg-slate-100 hdx_overflow-hidden">
                  <div className="hdx_h-full hdx_rounded-full" style={{ width: `${d.staff}%`, background: d.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card hdx_p-5 hdx_xl_col-span-2">
          <div className="hdx_flex hdx_items-center hdx_justify-between hdx_mb-4">
            <div>
              <h2 className="hdx_text-card-title hdx_text-ink">Recent Medical Reports</h2>
              <p className="hdx_text-small hdx_text-ink-secondary">Latest uploads across the hospital</p>
            </div>
            <button onClick={() => navigate('/reports')} className="hdx_text-small hdx_font-medium hdx_text-primary hdx_hover_underline hdx_inline-flex hdx_items-center hdx_gap-1">
              View all <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="hdx_overflow-x-auto hdx_-mx-5 hdx_px-5">
            <table className="hdx_w-full hdx_min-w-520px">
              <thead>
                <tr className="hdx_border-b hdx_border-line">
                  <th className="th">Report</th>
                  <th className="th">Patient</th>
                  <th className="th">Type</th>
                  <th className="th">Status</th>
                  <th className="th">Date</th>
                </tr>
              </thead>
              <tbody className="hdx_divide-y hdx_divide-line">
                {reports.slice(0, 4).map((r) => (
                  <tr key={r.id} className="hdx_hover_bg-slate-50-60 hdx_transition-colors">
                    <td className="td hdx_font-medium">{r.report}</td>
                    <td className="td hdx_text-ink-secondary">{r.patient}</td>
                    <td className="td hdx_text-ink-secondary">{r.type}</td>
                    <td className="td"><Badge color={r.status === 'Reviewed' ? 'success' : 'warning'}>{r.status}</Badge></td>
                    <td className="td hdx_text-ink-secondary">{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card hdx_p-5 hdx_mt-4">
        <div className="hdx_flex hdx_items-center hdx_justify-between hdx_mb-4">
          <div>
            <h2 className="hdx_text-card-title hdx_text-ink">Recent Hospital Activity</h2>
            <p className="hdx_text-small hdx_text-ink-secondary">Live feed of staff actions</p>
          </div>
        </div>
        <div className="hdx_space-y-0">
          {activity.map((a) => (
            <div key={a.id} className="hdx_flex hdx_items-center hdx_gap-3.5 hdx_py-3 hdx_border-b hdx_border-line hdx_last_border-0">
              <Avatar initials={a.user.split(' ').map((n) => n[0]).join('').slice(0, 2)} size="sm" />
              <p className="hdx_flex-1 hdx_text-body hdx_text-ink">
                <span className="hdx_font-semibold">{a.user}</span>{' '}
                <span className="hdx_text-ink-secondary">{a.action}</span>{' '}
                <span className="hdx_font-medium hdx_text-primary">{a.target}</span>
              </p>
              <span className="hdx_text-small hdx_text-ink-secondary hdx_whitespace-nowrap">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
