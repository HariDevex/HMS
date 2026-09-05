import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarPlus,
  FileUp,
  Pill,
  MoreHorizontal,
  Phone,
  MapPin,
  ShieldAlert,
  AlertTriangle,
  Activity,
  Clock,
  HeartPulse,
  Users,
  Stethoscope,
  ChevronDown,
} from 'lucide-react';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Dropdown, { DropdownItem } from '../components/ui/Dropdown';
import Timeline from '../components/ui/Timeline';
import { useApp } from '../context/AppContext';
import {
  patients,
  timeline,
  reports,
  scans,
  prescriptions,
  recommendations,
  appointments,
  statusColor,
} from '../data/mock';

const tabs = ['Overview', 'Medical History', 'Reports', 'Scans', 'Prescriptions', 'Recommendations', 'Appointments'];

export default function PatientProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { pushToast } = useApp();
  const [active, setActive] = useState('Overview');

  const patient = patients.find((p) => p.id === id) || patients[0];

  return (
    <div>
      <button onClick={() => navigate('/patients')} className="hdx_inline-flex hdx_items-center hdx_gap-2 hdx_text-body hdx_font-medium hdx_text-ink-secondary hdx_hover_text-ink hdx_mb-4">
        <ArrowLeft size={16} /> Back to Patients
      </button>

      <div className="card hdx_p-6">
        <div className="hdx_flex hdx_flex-col hdx_sm_flex-row hdx_sm_items-center hdx_gap-5">
          <Avatar initials={patient.avatar} size="xl" />
          <div className="hdx_flex-1">
            <div className="hdx_flex hdx_flex-wrap hdx_items-center hdx_gap-2.5">
              <h1 className="hdx_text-2xl hdx_font-bold hdx_text-ink">{patient.name}</h1>
              <Badge color={statusColor(patient.status)} dot>{patient.status}</Badge>
            </div>
            <p className="hdx_text-secondary-text hdx_text-ink-secondary hdx_mt-1">
              {patient.id} · {patient.gender} · {patient.age} yrs · {patient.blood}
            </p>
            <div className="hdx_flex hdx_flex-wrap hdx_items-center hdx_gap-x-5 hdx_gap-y-1 hdx_mt-3 hdx_text-small hdx_text-ink-secondary">
              <span className="hdx_flex hdx_items-center hdx_gap-1.5"><MapPin size={13} /> {patient.address}</span>
              <span className="hdx_flex hdx_items-center hdx_gap-1.5"><Stethoscope size={13} /> {patient.doctor}</span>
              <span className="hdx_flex hdx_items-center hdx_gap-1.5"><Activity size={13} /> {patient.department}</span>
            </div>
          </div>
          <div className="hdx_flex hdx_items-center hdx_gap-2.5 hdx_shrink-0">
            <button className="btn-primary" onClick={() => { pushToast('Appointment booking opened', 'info'); navigate('/appointments?new=1'); }}>
              <CalendarPlus size={16} /> Book Appointment
            </button>
            <button className="btn-secondary" onClick={() => pushToast('Report upload opened', 'info')}>
              <FileUp size={16} /> Add Report
            </button>
            <Dropdown
              trigger={<button className="btn-secondary" aria-label="More actions"><MoreHorizontal size={18} /></button>}
            >
              <DropdownItem icon={Pill} onClick={() => setActive('Prescriptions')}>Add prescription</DropdownItem>
              <DropdownItem icon={Stethoscope} onClick={() => setActive('Recommendations')}>Add recommendation</DropdownItem>
              <DropdownItem danger onClick={() => pushToast('Patient flagged for review', 'info')}>Flag patient</DropdownItem>
            </Dropdown>
          </div>
        </div>

        <div className="hdx_mt-6 hdx_grid hdx_grid-cols-2 hdx_sm_grid-cols-4 hdx_gap-3 hdx_border-t hdx_border-line hdx_pt-5">
          {[
            { icon: HeartPulse, label: 'Heart Rate', value: '72 bpm' },
            { icon: Activity, label: 'Blood Pressure', value: '128/82' },
            { icon: Clock, label: 'Last Visit', value: patient.lastVisit },
            { icon: Users, label: 'Last Doctor', value: patient.doctor.split(' ')[1] },
          ].map((s) => (
            <div key={s.label} className="hdx_flex hdx_items-center hdx_gap-3">
              <span className="hdx_h-10 hdx_w-10 hdx_rounded-10 hdx_bg-surface hdx_flex hdx_items-center hdx_justify-center hdx_text-primary">
                <s.icon size={18} />
              </span>
              <div>
                <p className="hdx_text-small hdx_text-ink-secondary">{s.label}</p>
                <p className="hdx_text-body hdx_font-semibold hdx_text-ink">{s.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="hdx_mt-6 hdx_border-b hdx_border-line hdx_overflow-x-auto scrollbar-thin">
        <div className="hdx_flex hdx_gap-1 hdx_min-w-max">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={`hdx_px-4 hdx_py-3 hdx_text-body hdx_font-medium hdx_border-b-2 hdx_-mb-px hdx_transition-colors ${
                active === t
                  ? 'hdx_border-primary hdx_text-primary'
                  : 'hdx_border-transparent hdx_text-ink-secondary hdx_hover_text-ink'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="hdx_mt-6">
        {active === 'Overview' && <Overview patient={patient} />}
        {active === 'Medical History' && (
          <Card><Timeline items={timeline} /></Card>
        )}
        {active === 'Reports' && (
          <Card>
            <ReportsTable />
          </Card>
        )}
        {active === 'Scans' && (
          <Card>
            <ScansTable />
          </Card>
        )}
        {active === 'Prescriptions' && (
          <div className="hdx_space-y-4">
            {prescriptions.map((rx) => <PrescriptionCard key={rx.id} rx={rx} />)}
          </div>
        )}
        {active === 'Recommendations' && (
          <div className="hdx_space-y-4">
            {recommendations.map((r) => <RecommendationCard key={r.id} r={r} compact />)}
          </div>
        )}
        {active === 'Appointments' && (
          <Card>
            <AppointmentsTable />
          </Card>
        )}
      </div>
    </div>
  );
}

function Card({ children }) {
  return <div className="card hdx_p-6">{children}</div>;
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="hdx_text-small hdx_text-ink-secondary hdx_mb-0.5">{label}</p>
      <p className="hdx_text-body hdx_font-medium hdx_text-ink">{value}</p>
    </div>
  );
}

function Overview({ patient }) {
  return (
    <div className="hdx_grid hdx_grid-cols-1 hdx_lg_grid-cols-3 hdx_gap-4">
      <div className="card hdx_p-6 hdx_lg_col-span-2">
        <h2 className="hdx_text-card-title hdx_text-ink hdx_mb-4">Patient Information</h2>
        <div className="hdx_grid hdx_grid-cols-1 hdx_sm_grid-cols-2 hdx_gap-x-6 hdx_gap-y-4">
          {infoRows2(patient).map((r) => <InfoItem key={r.label} {...r} />)}
        </div>
      </div>
      <div className="hdx_space-y-4">
        <div className="card hdx_p-6">
          <div className="hdx_flex hdx_items-center hdx_gap-2 hdx_mb-4">
            <Phone size={16} className="hdx_text-primary" />
            <h2 className="hdx_text-card-title hdx_text-ink">Emergency Contact</h2>
          </div>
          <p className="hdx_text-body hdx_text-ink">{patient.emergencyContact}</p>
          <p className="hdx_text-small hdx_text-ink-secondary hdx_mt-1">Primary emergency contact on file</p>
        </div>
        <div className="card hdx_p-6">
          <div className="hdx_flex hdx_items-center hdx_gap-2 hdx_mb-4">
            <ShieldAlert size={16} className="hdx_text-warning" />
            <h2 className="hdx_text-card-title hdx_text-ink">Allergies</h2>
          </div>
          {patient.allergies.length ? (
            <div className="hdx_flex hdx_flex-wrap hdx_gap-2">
              {patient.allergies.map((a) => (
                <Badge key={a} color="warning"><AlertTriangle size={11} /> {a}</Badge>
              ))}
            </div>
          ) : <p className="hdx_text-body hdx_text-ink-secondary">No known allergies</p>}
        </div>
        <div className="card hdx_p-6">
          <div className="hdx_flex hdx_items-center hdx_gap-2 hdx_mb-4">
            <Pill size={16} className="hdx_text-success" />
            <h2 className="hdx_text-card-title hdx_text-ink">Current Medications</h2>
          </div>
          {patient.medications.length ? (
            <ul className="hdx_space-y-2">
              {patient.medications.map((m) => (
                <li key={m} className="hdx_flex hdx_items-center hdx_gap-2 hdx_text-body hdx_text-ink">
                  <span className="hdx_w-1.5 hdx_h-1.5 hdx_rounded-full hdx_bg-success" /> {m}
                </li>
              ))}
            </ul>
          ) : <p className="hdx_text-body hdx_text-ink-secondary">No active medications</p>}
        </div>
      </div>
    </div>
  );
}

// Helpers (kept module-local)
function infoRows2(p) {
  return [
    { label: 'Patient ID', value: p.id },
    { label: 'Full name', value: p.name },
    { label: 'Gender', value: p.gender },
    { label: 'Age', value: `${p.age} years` },
    { label: 'Blood group', value: p.blood },
    { label: 'Department', value: p.department },
    { label: 'Insurance', value: p.insurance },
    { label: 'Registered', value: p.registered },
    { label: 'Height / Weight', value: `${p.height} / ${p.weight}` },
    { label: 'Primary condition', value: p.condition },
  ];
}

function ReportsTable() {
  return (
    <div className="hdx_overflow-x-auto">
      <table className="hdx_w-full hdx_min-w-560px">
        <thead><tr className="hdx_border-b hdx_border-line"><th className="th">Report</th><th className="th">Type</th><th className="th">Date</th><th className="th">Status</th></tr></thead>
        <tbody className="hdx_divide-y hdx_divide-line">
          {reports.map((r) => (
            <tr key={r.id} className="hdx_hover_bg-slate-50-60">
              <td className="td hdx_font-medium">{r.report}</td>
              <td className="td hdx_text-ink-secondary">{r.type}</td>
              <td className="td hdx_text-ink-secondary">{r.date}</td>
              <td className="td"><Badge color={statusColor(r.status)}>{r.status}</Badge></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ScansTable() {
  return (
    <div className="hdx_overflow-x-auto">
      <table className="hdx_w-full hdx_min-w-560px">
        <thead><tr className="hdx_border-b hdx_border-line"><th className="th">Scan</th><th className="th">Date</th><th className="th">Performed By</th><th className="th">Status</th></tr></thead>
        <tbody className="hdx_divide-y hdx_divide-line">
          {scans.map((s) => (
            <tr key={s.id} className="hdx_hover_bg-slate-50-60">
              <td className="td"><span className="hdx_inline-flex hdx_items-center hdx_gap-2"><Badge color="info">{s.type}</Badge><span className="hdx_text-ink-secondary">{s.id}</span></span></td>
              <td className="td hdx_text-ink-secondary">{s.date}</td>
              <td className="td hdx_text-ink-secondary">{s.performedBy}</td>
              <td className="td"><Badge color={statusColor(s.status)}>{s.status}</Badge></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PrescriptionCard({ rx }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card hdx_p-6">
      <div className="hdx_flex hdx_items-center hdx_justify-between">
        <div>
          <p className="hdx_text-body hdx_font-semibold hdx_text-ink">{rx.id} · <span className="hdx_text-ink-secondary">{rx.diagnosis}</span></p>
          <p className="hdx_text-small hdx_text-ink-secondary hdx_mt-0.5">{rx.doctor} · {rx.date}</p>
        </div>
        <button onClick={() => setOpen(!open)} className="btn-secondary"><ChevronDown size={16} className={`hdx_transition-transform ${open ? 'hdx_transform hdx_rotate-180' : ''}`} /> Details</button>
      </div>
      {open && (
        <div className="hdx_mt-4">
          <table className="hdx_w-full">
            <thead><tr className="hdx_border-b hdx_border-line"><th className="th">Medicine</th><th className="th">Dosage</th><th className="th">Frequency</th><th className="th">Duration</th><th className="th">Instructions</th></tr></thead>
            <tbody className="hdx_divide-y hdx_divide-line">
              {rx.medications.map((m, i) => (
                <tr key={i}>
                  <td className="td hdx_font-medium">{m.name}</td>
                  <td className="td hdx_text-ink-secondary">{m.dosage}</td>
                  <td className="td hdx_text-ink-secondary">{m.frequency}</td>
                  <td className="td hdx_text-ink-secondary">{m.duration}</td>
                  <td className="td hdx_text-ink-secondary">{m.instructions}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="hdx_text-small hdx_text-ink-secondary hdx_mt-3">Follow-up: {rx.followUp}</p>
        </div>
      )}
    </div>
  );
}

function RecommendationCard({ r, compact }) {
  return (
    <div className="card hdx_p-6">
      <div className="hdx_flex hdx_items-center hdx_justify-between hdx_mb-3">
        <div className="hdx_flex hdx_items-center hdx_gap-3">
          <Avatar initials={r.doctor.split(' ').map((n) => n[0]).join('')} size="sm" />
          <div>
            <p className="hdx_text-body hdx_font-semibold hdx_text-ink">{r.doctor}</p>
            <p className="hdx_text-small hdx_text-ink-secondary">{r.date}</p>
          </div>
        </div>
        <Badge color="warning">{r.diagnosis}</Badge>
      </div>
      {!compact && (
        <>
          <p className="hdx_text-body hdx_text-ink-secondary hdx_leading-relaxed">{r.notes}</p>
          <div className="hdx_mt-4">
            <p className="hdx_text-small hdx_font-semibold hdx_text-ink hdx_mb-2">Recommendations</p>
            <ul className="hdx_space-y-1.5">
              {r.recommendations.map((rec, i) => (
                <li key={i} className="hdx_flex hdx_items-start hdx_gap-2 hdx_text-body hdx_text-ink-secondary"><span className="hdx_mt-1.5 hdx_w-1.5 hdx_h-1.5 hdx_rounded-full hdx_bg-primary hdx_shrink-0" />{rec}</li>
              ))}
            </ul>
          </div>
        </>
      )}
      <div className="hdx_mt-4 hdx_pt-4 hdx_border-t hdx_border-line hdx_flex hdx_items-center hdx_justify-between">
        <p className="hdx_text-small hdx_text-ink-secondary">{compact ? r.notes : r.medicationInstructions}</p>
        <Badge color="primary">Follow-up: {r.followUp}</Badge>
      </div>
    </div>
  );
}

function AppointmentsTable() {
  return (
    <div className="hdx_overflow-x-auto">
      <table className="hdx_w-full hdx_min-w-580px">
        <thead><tr className="hdx_border-b hdx_border-line"><th className="th">Date/Time</th><th className="th">Doctor</th><th className="th">Department</th><th className="th">Status</th></tr></thead>
        <tbody className="hdx_divide-y hdx_divide-line">
          {appointments.map((a) => (
            <tr key={a.id} className="hdx_hover_bg-slate-50-60">
              <td className="td"><span className="hdx_font-medium">{a.date}</span><span className="hdx_text-ink-secondary hdx_ml-2">{a.time}</span></td>
              <td className="td hdx_text-ink-secondary">{a.doctor}</td>
              <td className="td hdx_text-ink-secondary">{a.dept}</td>
              <td className="td"><Badge color={statusColor(a.status)}>{a.status}</Badge></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
