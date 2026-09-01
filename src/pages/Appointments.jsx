import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, ChevronLeft, ChevronRight, CalendarDays, CheckCircle2, UserCheck } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import Dropdown from '../components/ui/Dropdown';
import { appointments, statusColor, appointmentStatuses } from '../data/mock';
import { useApp } from '../context/AppContext';

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function Appointments() {
  const [params] = useSearchParams();
  const { pushToast } = useApp();
  const openedFromParam = params.get('new') === '1';
  const [view, setView] = useState('Daily');
  const [openAdd, setOpenAdd] = useState(openedFromParam);

  const stats = [
    { label: 'Scheduled', value: appointments.filter((a) => a.status === 'Scheduled').length },
    { label: 'Checked In', value: appointments.filter((a) => a.status === 'Checked In').length },
    { label: 'In Consultation', value: appointments.filter((a) => a.status === 'In Consultation').length },
    { label: 'Completed', value: appointments.filter((a) => a.status === 'Completed').length },
  ];

  const filtered = appointments;

  const canCheckIn = (status) => status === 'Scheduled';
  const canDone = (status) => status === 'Checked In' || status === 'In Consultation';

  const nextStatus = (status) => {
    const flow = { Scheduled: 'Checked In', 'Checked In': 'In Consultation', 'In Consultation': 'Completed' };
    return flow[status];
  };

  const advance = (a) => {
    const next = nextStatus(a.status);
    pushToast(`${a.patient} moved to "${next}"`, 'success');
  };

  return (
    <div>
      <PageHeader
        title="Appointments"
        subtitle="Manage schedules, check-ins and consultations."
        actions={
          <button className="btn-primary" onClick={() => setOpenAdd(true)}>
            <Plus size={16} /> New Appointment
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="card p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-[10px] bg-primary-light flex items-center justify-center text-primary">
              <CalendarDays size={18} />
            </div>
            <div><p className="text-2xl font-bold text-ink">{s.value}</p><p className="text-small text-ink-secondary">{s.label}</p></div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="p-4 border-b border-line flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="flex items-center gap-2">
            <button className="btn-secondary !h-9 !px-2.5" aria-label="Previous"><ChevronLeft size={16} /></button>
            <div className="px-4 text-body font-semibold text-ink">Monday, Aug 31, 2026</div>
            <button className="btn-secondary !h-9 !px-2.5" aria-label="Next"><ChevronRight size={16} /></button>
          </div>
          <div className="flex flex-wrap gap-2 ml-auto">
            {['Daily', 'Weekly', 'Monthly'].map((v) => (
              <button key={v} onClick={() => setView(v)} className={`px-3.5 h-9 rounded-input text-small font-medium transition-colors ${view === v ? 'bg-primary text-white' : 'text-ink-secondary hover:bg-slate-50'}`}>
                {v}
              </button>
            ))}
          </div>
        </div>

        {view === 'Weekly' ? (
          <WeeklyView />
        ) : (
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full min-w-[820px]">
              <thead>
                <tr className="border-b border-line bg-slate-50/50">
                  <th className="th">Time</th>
                  <th className="th">Patient</th>
                  <th className="th">Doctor</th>
                  <th className="th">Department</th>
                  <th className="th">Status</th>
                  <th className="th text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="td"><span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-primary" />{a.time}</span></td>
                    <td className="td"><div className="flex items-center gap-2.5"><Avatar initials={a.patient.split(' ').map((n) => n[0]).join('')} size="sm" /><span className="font-medium">{a.patient}</span></div></td>
                    <td className="td text-ink-secondary">{a.doctor}</td>
                    <td className="td text-ink-secondary">{a.dept}</td>
                    <td className="td"><Badge color={statusColor(a.status)} dot>{a.status}</Badge></td>
                    <td className="td text-right">
                      <div className="inline-flex gap-1.5">
                        {canCheckIn(a.status) && (
                          <button onClick={() => advance(a)} title="Check in" className="p-1.5 rounded-input text-info hover:bg-cyan-50" aria-label="Check in">
                            <UserCheck size={17} />
                          </button>
                        )}
                        {canDone(a.status) && (
                          <button onClick={() => advance(a)} title="Start/Complete consultation" className="p-1.5 rounded-input text-success hover:bg-green-50" aria-label="Update consultation">
                            <CheckCircle2 size={17} />
                          </button>
                        )}
                        <Dropdown trigger={<button className="p-1.5 rounded-input text-ink-secondary hover:bg-slate-100" aria-label="More">⋯</button>}>
                          {appointmentStatuses.filter((s) => s !== a.status).map((s) => (
                            <button key={s} onClick={() => pushToast(`${a.patient}: status set to ${s}`, 'info')} className="w-full text-left px-3 py-2 rounded-input text-body text-ink-secondary hover:bg-slate-50">{s}</button>
                          ))}
                        </Dropdown>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {openAdd && <NewAppointmentModal onClose={() => setOpenAdd(false)} />}
    </div>
  );
}

function WeeklyView() {
  return (
    <div className="p-4 overflow-x-auto">
      <div className="grid grid-cols-7 gap-2 min-w-[800px]">
        {weekDays.map((d, i) => (
          <div key={d} className={i === 0 ? 'rounded-card bg-primary-light border border-blue-100' : 'rounded-card border border-line'}>
            <div className={`p-2.5 text-center font-semibold text-small ${i === 0 ? 'text-primary' : 'text-ink'}`}>{d}</div>
            <div className="border-t border-line px-1.5 py-2 space-y-1.5 min-h-[160px]">
              {appointments.filter((a) => (i === 0 ? true : a.date === 'Sep 1, 2026')).slice(0, 3).map((a) => (
                <div key={a.id} className="rounded-input bg-background px-2 py-1.5 text-[11px] border-l-2 border-primary">
                  <p className="font-medium text-ink truncate">{a.time} {a.patient.split(' ')[0]}</p>
                  <p className="text-ink-secondary truncate">{a.doctor}</p>
                </div>
              ))}
              {i === 0 && <div className="text-center text-[11px] text-primary font-semibold pt-1">+{appointments.filter((aa) => new Date(aa.date.split(',')[0] + ' 2026') > new Date()).length} more</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
function NewAppointmentModal({ onClose }) {
  const { pushToast } = useApp();
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/40 p-4 sm:p-6 overflow-y-auto" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="card w-full max-w-lg my-8 animate-slide-up">
        <div className="px-6 pt-5 pb-4 border-b border-line"><h3 className="text-card-title text-ink">Book New Appointment</h3><p className="text-secondary text-ink-secondary mt-0.5">Schedule a patient appointment</p></div>
        <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            { l: 'Patient', t: 'select', placeholder: 'Select patient' },
            { l: 'Doctor', t: 'select', placeholder: 'Select doctor' },
            { l: 'Department', t: 'select', placeholder: 'Select department' },
            { l: 'Date', t: 'date' },
            { l: 'Time', t: 'time' },
            { l: 'Reason', t: 'text', placeholder: 'Reason for visit' },
          ].map((f) => (
            <div key={f.l} className={f.l === 'Reason' ? 'sm:col-span-2' : ''}>
              <label className="label">{f.l}</label>
              <input type={f.t} placeholder={f.placeholder} className="input" />
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-line bg-slate-50/50 rounded-b-card">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={() => { pushToast('Appointment scheduled', 'success'); onClose(); }}>Schedule</button>
        </div>
      </div>
    </div>
  );
}
