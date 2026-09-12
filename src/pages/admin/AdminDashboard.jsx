import React from 'react';
import { useApp } from '../../context/AppContext';
import StatCard from '../../components/ui/StatCard';
import Card, { CardHeader, CardBody } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import CriticalAlert from '../../components/ui/CriticalAlert';
import RupeeIcon from '../../components/ui/RupeeIcon';
import {
  Users,
  Calendar,
  UserCheck,
  HeartPulse,
  FlaskConical,
  Scan,
  BedDouble,
  ShieldCheck,
  } from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useNavigate } from 'react-router-dom';

const patientFlowData = [
  { time: '08:00', admissions: 12, discharges: 5, emergency: 8 },
  { time: '10:00', admissions: 24, discharges: 14, emergency: 15 },
  { time: '12:00', admissions: 35, discharges: 22, emergency: 19 },
  { time: '14:00', admissions: 28, discharges: 30, emergency: 14 },
  { time: '16:00', admissions: 42, discharges: 38, emergency: 21 },
  { time: '18:00', admissions: 30, discharges: 25, emergency: 16 },
  { time: '20:00', admissions: 18, discharges: 12, emergency: 11 },
];

const revenueData = [
  { day: 'Mon', revenue: 42000, claims: 34000 },
  { day: 'Tue', revenue: 48500, claims: 39000 },
  { day: 'Wed', revenue: 51200, claims: 41000 },
  { day: 'Thu', revenue: 46800, claims: 38000 },
  { day: 'Fri', revenue: 59000, claims: 47000 },
  { day: 'Sat', revenue: 32000, claims: 28000 },
  { day: 'Sun', revenue: 27500, claims: 22000 },
];

export default function AdminDashboard() {
  const { metrics, auditLogs, wards } = useApp();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Top Banner with Hospital Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Hospital Executive Overview</h2>
            <Badge variant="primary">Campus A & B Live</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time census, throughput, revenue metrics, and clinical safety compliance.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="secondary" size="sm" onClick={() => navigate('/audit-logs')}>
            Audit Logs
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate('/reports')}>
            Generate Board Report
          </Button>
        </div>
      </div>

      {/* Critical Alert Warning Bar */}
      <CriticalAlert
        title="Immediate Executive Attention Required"
        message="ICU Bed capacity is approaching critical threshold (83% capacity, 2 beds available). High-Sensitivity Troponin STAT alert logged for patient James Wilson (ICU-04)."
        type="critical"
        action={
          <div className="flex items-center gap-2">
            <Button size="sm" variant="danger" onClick={() => navigate('/wards')}>
              Manage ICU Beds
            </Button>
            <Button size="sm" variant="secondary" onClick={() => navigate('/patients/P-1001')}>
              View Critical Patient
            </Button>
          </div>
        }
      />

      {/* 8 Metric Cards required by Prompt Section 7 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Patients"
          value={metrics.totalPatients.toLocaleString()}
          subtitle="Cumulative Registered"
          trend="+4.2% this month"
          trendType="up"
          icon={Users}
          iconBg="bg-blue-50 text-primary"
          onClick={() => navigate('/patients')}
        />
        <StatCard
          title="Today's Appointments"
          value={metrics.todayAppointments}
          subtitle="18 In Progress / Waiting"
          trend="82% on schedule"
          trendType="up"
          icon={Calendar}
          iconBg="bg-amber-50 text-amber-600"
          onClick={() => navigate('/appointments')}
        />
        <StatCard
          title="Active Doctors"
          value={metrics.activeDoctors}
          subtitle="Across 14 Specialties"
          trend="4 On Call"
          trendType="neutral"
          icon={UserCheck}
          iconBg="bg-emerald-50 text-emerald-600"
          onClick={() => navigate('/users')}
        />
        <StatCard
          title="Active Nurses"
          value={metrics.activeNurses}
          subtitle="Shift 1 & 2 coverage"
          trend="100% staff ratio"
          trendType="up"
          icon={HeartPulse}
          iconBg="bg-rose-50 text-rose-600"
          onClick={() => navigate('/users')}
        />
        <StatCard
          title="Pending Lab Tests"
          value={metrics.pendingLabTests}
          subtitle="3 STAT Priority"
          trend="Avg TAT 42 mins"
          trendType="up"
          icon={FlaskConical}
          iconBg="bg-violet-50 text-violet-600"
          onClick={() => navigate('/laboratory')}
        />
        <StatCard
          title="Pending Radiology"
          value={metrics.pendingRadiology}
          subtitle="2 Scheduled Today"
          trend="Avg TAT 65 mins"
          trendType="neutral"
          icon={Scan}
          iconBg="bg-cyan-50 text-cyan-600"
          onClick={() => navigate('/radiology')}
        />
        <StatCard
          title="Available Beds"
          value={`${metrics.availableBeds} / ${metrics.totalBeds}`}
          subtitle={`Occupancy: ${metrics.occupancyRate}`}
          trend="2 ICU available"
          trendType="down"
          icon={BedDouble}
          iconBg="bg-indigo-50 text-indigo-600"
          onClick={() => navigate('/wards')}
        />
        <StatCard
          title="Today's Revenue"
          value={metrics.todayRevenue}
          subtitle={`MTD: ${metrics.monthRevenue}`}
          trend="+9.1% vs last week"
          trendType="up"
          icon={RupeeIcon}
          iconBg="bg-emerald-50 text-emerald-700"
          onClick={() => navigate('/billing')}
        />
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Inflow & Census Chart */}
        <Card className="p-5">
          <CardHeader
            title="Patient Census & Emergency Inflow"
            subtitle="Hourly patient admissions, discharges, and triage volume"
            action={<Badge variant="primary">Real-time Stream</Badge>}
          />
          <CardBody className="pt-4">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={patientFlowData}>
                  <defs>
                    <linearGradient id="admitGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="erGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#DC2626" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#DC2626" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="admissions" name="Inpatient Admissions" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#admitGrad)" />
                  <Area type="monotone" dataKey="emergency" name="Emergency Triage" stroke="#DC2626" strokeWidth={2} fillOpacity={1} fill="url(#erGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-3 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" /> Admissions
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-error" /> Emergency
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Revenue & Billing Performance Chart */}
        <Card className="p-5">
          <CardHeader
            title="Weekly Revenue & Claims Adjudication"
            subtitle="Gross hospital charges vs adjudicated insurance remittances"
            action={<Badge variant="success">96.4% Clean Claims</Badge>}
          />
          <CardBody className="pt-4">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                  <Tooltip
                    formatter={(value) => [`₹${Number(value).toLocaleString()}`, '']}
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Bar dataKey="revenue" name="Total Revenue" fill="#16A34A" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="claims" name="Insurance Settled" fill="#93C5FD" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-3 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-success" /> Gross Billed
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-300" /> Settled Insurance
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Ward Occupancy & Live Audit Feed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ward Occupancy Quick Monitor */}
        <Card className="lg:col-span-1 p-5">
          <CardHeader
            title="Ward Occupancy Census"
            subtitle="Live bed distribution"
            action={<Button size="sm" variant="ghost" onClick={() => navigate('/wards')}>View Grid</Button>}
          />
          <CardBody className="space-y-4 pt-2">
            {wards.map((w) => {
              const pct = Math.round((w.occupiedBeds / w.totalBeds) * 100);
              const isHigh = pct >= 80;
              return (
                <div key={w.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-800">{w.name}</span>
                    <span className={`${isHigh ? 'text-error font-bold' : 'text-slate-500'}`}>
                      {w.occupiedBeds}/{w.totalBeds} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        pct > 80 ? 'bg-error' : pct > 60 ? 'bg-amber-500' : 'bg-primary'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Charge: {w.nurseInCharge}</span>
                    <span>{w.availableBeds} beds open</span>
                  </div>
                </div>
              );
            })}
          </CardBody>
        </Card>

        {/* Recent Operational & Clinical Audit Trail */}
        <Card className="lg:col-span-2 p-5">
          <CardHeader
            title="Recent Clinical & Security Audit Feed"
            subtitle="Immutable hospital event stream"
            action={<Button size="sm" variant="ghost" onClick={() => navigate('/audit-logs')}>View All Logs</Button>}
          />
          <CardBody className="pt-2">
            <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto scrollbar-thin">
              {auditLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="py-3 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-primary flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{log.action}</span>
                        <Badge
                          size="sm"
                          variant={log.severity === 'Warning' ? 'warning' : log.severity === 'Success' ? 'success' : 'neutral'}
                        >
                          {log.role}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{log.details}</p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-medium">
                        <span>by {log.user}</span>
                        <span>•</span>
                        <span>{log.patient}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-mono text-slate-400">{log.time}</span>
                    <div className="text-[10px] text-slate-400">{log.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
