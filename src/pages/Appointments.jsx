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

      <div className="hdx_grid hdx_grid-cols-2 hdx_lg_grid-cols-4 hdx_gap-4 hdx_mb-6">
        {stats.map((s) => (
          <div key={s.label} className="card hdx_p-4 hdx_flex hdx_items-center hdx_gap-3">
            <div className="hdx_h-10 hdx_w-10 hdx_rounded-10 hdx_bg-primary-light hdx_flex hdx_items-center hdx_justify-center hdx_text-primary">
              <CalendarDays size={18} />
            </div>
            <div><p className="hdx_text-2xl hdx_font-bold hdx_text-ink">{s.value}</p><p className="hdx_text-small hdx_text-ink-secondary">{s.label}</p></div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="hdx_p-4 hdx_border-b hdx_border-line hdx_flex hdx_flex-col hdx_sm_flex-row hdx_gap-3 hdx_sm_items-center">
          <div className="hdx_flex hdx_items-center hdx_gap-2">
            <button className="btn-secondary !h-9 !px-2.5" aria-label="Previous"><ChevronLeft size={16} /></button>
            <div className="hdx_px-4 hdx_text-body hdx_font-semibold hdx_text-ink">Monday, Aug 31, 2026</div>
            <button className="btn-secondary !h-9 !px-2.5" aria-label="Next"><ChevronRight size={16} /></button>
          </div>
          <div className="hdx_flex hdx_flex-wrap hdx_gap-2 hdx_ml-auto">
            {['Daily', 'Weekly', 'Monthly'].map((v) => (
              <button key={v} onClick={() => setView(v)} className={`hdx_px-3.5 hdx_h-9 hdx_rounded-input hdx_text-small hdx_font-medium hdx_transition-colors ${view === v ? 'hdx_bg-primary hdx_text-white' : 'hdx_text-ink-secondary hdx_hover_bg-slate-50'}`}>
                {v}
              </button>
            ))}
          </div>
        </div>

        {view === 'Weekly' ? (
          <WeeklyView />
        ) : (
          <div className="hdx_overflow-x-auto scrollbar-thin">
            <table className="hdx_w-full hdx_min-w-820px">
              <thead>
                <tr className="hdx_border-b hdx_border-line hdx_bg-slate-50-50">
                  <th className="th">Time</th>
                  <th className="th">Patient</th>
                  <th className="th">Doctor</th>
                  <th className="th">Department</th>
                  <th className="th">Status</th>
                  <th className="th hdx_text-right">Action</th>
                </tr>
              </thead>
              <tbody className="hdx_divide-y hdx_divide-line">
                {filtered.map((a) => (
                  <tr key={a.id} className="hdx_hover_bg-slate-50-60 hdx_transition-colors">
                    <td className="td"><span className="hdx_inline-flex hdx_items-center hdx_gap-2"><span className="hdx_h-2 hdx_w-2 hdx_rounded-full hdx_bg-primary" />{a.time}</span></td>
                    <td className="td"><div className="hdx_flex hdx_items-center hdx_gap-2.5"><Avatar initials={a.patient.split(' ').map((n) => n[0]).join('')} size="sm" /><span className="hdx_font-medium">{a.patient}</span></div></td>
                    <td className="td hdx_text-ink-secondary">{a.doctor}</td>
                    <td className="td hdx_text-ink-secondary">{a.dept}</td>
                    <td className="td"><Badge color={statusColor(a.status)} dot>{a.status}</Badge></td>
                    <td className="td hdx_text-right">
                      <div className="hdx_inline-flex hdx_gap-1.5">
                        {canCheckIn(a.status) && (
                          <button onClick={() => advance(a)} title="Check in" className="hdx_p-1.5 hdx_rounded-input hdx_text-info hdx_hover_bg-cyan-50" aria-label="Check in">
                            <UserCheck size={17} />
                          </button>
                        )}
                        {canDone(a.status) && (
                          <button onClick={() => advance(a)} title="Start/Complete consultation" className="hdx_p-1.5 hdx_rounded-input hdx_text-success hdx_hover_bg-green-50" aria-label="Update consultation">
                            <CheckCircle2 size={17} />
                          </button>
                        )}
                        <Dropdown trigger={<button className="hdx_p-1.5 hdx_rounded-input hdx_text-ink-secondary hdx_hover_bg-slate-100" aria-label="More">⋯</button>}>
                          {appointmentStatuses.filter((s) => s !== a.status).map((s) => (
                            <button key={s} onClick={() => pushToast(`${a.patient}: status set to ${s}`, 'info')} className="hdx_w-full hdx_text-left hdx_px-3 hdx_py-2 hdx_rounded-input hdx_text-body hdx_text-ink-secondary hdx_hover_bg-slate-50">{s}</button>
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
    <div className="hdx_p-4 hdx_overflow-x-auto">
      <div className="hdx_grid hdx_grid-cols-7 hdx_gap-2 hdx_min-w-800px">
        {weekDays.map((d, i) => (
          <div key={d} className={i === 0 ? 'hdx_rounded-card hdx_bg-primary-light hdx_border hdx_border-blue-100' : 'hdx_rounded-card hdx_border hdx_border-line'}>
            <div className={`hdx_p-2.5 hdx_text-center hdx_font-semibold hdx_text-small ${i === 0 ? 'hdx_text-primary' : 'hdx_text-ink'}`}>{d}</div>
            <div className="hdx_border-t hdx_border-line hdx_px-1.5 hdx_py-2 hdx_space-y-1.5 hdx_min-h-160px">
              {appointments.filter((a) => (i === 0 ? true : a.date === 'Sep 1, 2026')).slice(0, 3).map((a) => (
                <div key={a.id} className="hdx_rounded-input hdx_bg-background hdx_px-2 hdx_py-1.5 hdx_text-11 hdx_border-l-2 hdx_border-primary">
                  <p className="hdx_font-medium hdx_text-ink hdx_truncate">{a.time} {a.patient.split(' ')[0]}</p>
                  <p className="hdx_text-ink-secondary hdx_truncate">{a.doctor}</p>
                </div>
              ))}
              {i === 0 && <div className="hdx_text-center hdx_text-11 hdx_text-primary hdx_font-semibold hdx_pt-1">+{appointments.filter((aa) => new Date(aa.date.split(',')[0] + ' 2026') > new Date()).length} more</div>}
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
    <div className="hdx_fixed hdx_inset-0 hdx_z-50 hdx_flex hdx_items-start hdx_justify-center hdx_bg-slate-900-40 hdx_p-4 hdx_sm_p-6 hdx_overflow-y-auto" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="card hdx_w-full hdx_max-w-lg hdx_my-8 hdx_animate-slide-up">
        <div className="hdx_px-6 hdx_pt-5 hdx_pb-4 hdx_border-b hdx_border-line"><h3 className="hdx_text-card-title hdx_text-ink">Book New Appointment</h3><p className="hdx_text-secondary-text hdx_text-ink-secondary hdx_mt-0.5">Schedule a patient appointment</p></div>
        <div className="hdx_px-6 hdx_py-5 hdx_grid hdx_grid-cols-1 hdx_sm_grid-cols-2 hdx_gap-5">
          {[
            { l: 'Patient', t: 'select', placeholder: 'Select patient' },
            { l: 'Doctor', t: 'select', placeholder: 'Select doctor' },
            { l: 'Department', t: 'select', placeholder: 'Select department' },
            { l: 'Date', t: 'date' },
            { l: 'Time', t: 'time' },
            { l: 'Reason', t: 'text', placeholder: 'Reason for visit' },
          ].map((f) => (
            <div key={f.l} className={f.l === 'Reason' ? 'hdx_sm_col-span-2' : ''}>
              <label className="label">{f.l}</label>
              <input type={f.t} placeholder={f.placeholder} className="input" />
            </div>
          ))}
        </div>
        <div className="hdx_flex hdx_justify-end hdx_gap-3 hdx_px-6 hdx_py-4 hdx_border-t hdx_border-line hdx_bg-slate-50-50 hdx_rounded-b-card">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={() => { pushToast('Appointment scheduled', 'success'); onClose(); }}>Schedule</button>
        </div>
      </div>
    </div>
  );
}
