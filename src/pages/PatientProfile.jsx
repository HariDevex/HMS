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
      <button onClick={() => navigate('/patients')} className="inline-flex items-center gap-2 text-body font-medium text-ink-secondary hover:text-ink mb-4">
        <ArrowLeft size={16} /> Back to Patients
      </button>

      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <Avatar initials={patient.avatar} size="xl" />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-bold text-ink">{patient.name}</h1>
              <Badge color={statusColor(patient.status)} dot>{patient.status}</Badge>
            </div>
            <p className="text-secondary text-ink-secondary mt-1">
              {patient.id} · {patient.gender} · {patient.age} yrs · {patient.blood}
            </p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-3 text-small text-ink-secondary">
              <span className="flex items-center gap-1.5"><MapPin size={13} /> {patient.address}</span>
              <span className="flex items-center gap-1.5"><Stethoscope size={13} /> {patient.doctor}</span>
              <span className="flex items-center gap-1.5"><Activity size={13} /> {patient.department}</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 flex-shrink-0">
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

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-line pt-5">
          {[
            { icon: HeartPulse, label: 'Heart Rate', value: '72 bpm' },
            { icon: Activity, label: 'Blood Pressure', value: '128/82' },
            { icon: Clock, label: 'Last Visit', value: patient.lastVisit },
            { icon: Users, label: 'Last Doctor', value: patient.doctor.split(' ')[1] },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <span className="h-10 w-10 rounded-[10px] bg-surface flex items-center justify-center text-primary">
                <s.icon size={18} />
              </span>
              <div>
                <p className="text-small text-ink-secondary">{s.label}</p>
                <p className="text-body font-semibold text-ink">{s.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 border-b border-line overflow-x-auto scrollbar-thin">
        <div className="flex gap-1 min-w-max">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={`px-4 py-3 text-body font-medium border-b-2 -mb-px transition-colors ${
                active === t
                  ? 'border-primary text-primary'
                  : 'border-transparent text-ink-secondary hover:text-ink'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
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
          <div className="space-y-4">
            {prescriptions.map((rx) => <PrescriptionCard key={rx.id} rx={rx} />)}
          </div>
        )}
        {active === 'Recommendations' && (
          <div className="space-y-4">
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
  return <div className="card p-6">{children}</div>;
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-small text-ink-secondary mb-0.5">{label}</p>
      <p className="text-body font-medium text-ink">{value}</p>
    </div>
  );
}

function Overview({ patient }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="card p-6 lg:col-span-2">
        <h2 className="text-card-title text-ink mb-4">Patient Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          {infoRows2(patient).map((r) => <InfoItem key={r.label} {...r} />)}
        </div>
      </div>
      <div className="space-y-4">
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Phone size={16} className="text-primary" />
            <h2 className="text-card-title text-ink">Emergency Contact</h2>
          </div>
          <p className="text-body text-ink">{patient.emergencyContact}</p>
          <p className="text-small text-ink-secondary mt-1">Primary emergency contact on file</p>
        </div>
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert size={16} className="text-warning" />
            <h2 className="text-card-title text-ink">Allergies</h2>
          </div>
          {patient.allergies.length ? (
            <div className="flex flex-wrap gap-2">
              {patient.allergies.map((a) => (
                <Badge key={a} color="warning"><AlertTriangle size={11} /> {a}</Badge>
              ))}
            </div>
          ) : <p className="text-body text-ink-secondary">No known allergies</p>}
        </div>
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Pill size={16} className="text-success" />
            <h2 className="text-card-title text-ink">Current Medications</h2>
          </div>
          {patient.medications.length ? (
            <ul className="space-y-2">
              {patient.medications.map((m) => (
                <li key={m} className="flex items-center gap-2 text-body text-ink">
                  <span className="w-1.5 h-1.5 rounded-full bg-success" /> {m}
                </li>
              ))}
            </ul>
          ) : <p className="text-body text-ink-secondary">No active medications</p>}
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
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px]">
        <thead><tr className="border-b border-line"><th className="th">Report</th><th className="th">Type</th><th className="th">Date</th><th className="th">Status</th></tr></thead>
        <tbody className="divide-y divide-line">
          {reports.map((r) => (
            <tr key={r.id} className="hover:bg-slate-50/60">
              <td className="td font-medium">{r.report}</td>
              <td className="td text-ink-secondary">{r.type}</td>
              <td className="td text-ink-secondary">{r.date}</td>
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
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px]">
        <thead><tr className="border-b border-line"><th className="th">Scan</th><th className="th">Date</th><th className="th">Performed By</th><th className="th">Status</th></tr></thead>
        <tbody className="divide-y divide-line">
          {scans.map((s) => (
            <tr key={s.id} className="hover:bg-slate-50/60">
              <td className="td"><span className="inline-flex items-center gap-2"><Badge color="info">{s.type}</Badge><span className="text-ink-secondary">{s.id}</span></span></td>
              <td className="td text-ink-secondary">{s.date}</td>
              <td className="td text-ink-secondary">{s.performedBy}</td>
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
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-body font-semibold text-ink">{rx.id} · <span className="text-ink-secondary">{rx.diagnosis}</span></p>
          <p className="text-small text-ink-secondary mt-0.5">{rx.doctor} · {rx.date}</p>
        </div>
        <button onClick={() => setOpen(!open)} className="btn-secondary"><ChevronDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} /> Details</button>
      </div>
      {open && (
        <div className="mt-4">
          <table className="w-full">
            <thead><tr className="border-b border-line"><th className="th">Medicine</th><th className="th">Dosage</th><th className="th">Frequency</th><th className="th">Duration</th><th className="th">Instructions</th></tr></thead>
            <tbody className="divide-y divide-line">
              {rx.medications.map((m, i) => (
                <tr key={i}>
                  <td className="td font-medium">{m.name}</td>
                  <td className="td text-ink-secondary">{m.dosage}</td>
                  <td className="td text-ink-secondary">{m.frequency}</td>
                  <td className="td text-ink-secondary">{m.duration}</td>
                  <td className="td text-ink-secondary">{m.instructions}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-small text-ink-secondary mt-3">Follow-up: {rx.followUp}</p>
        </div>
      )}
    </div>
  );
}

function RecommendationCard({ r, compact }) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar initials={r.doctor.split(' ').map((n) => n[0]).join('')} size="sm" />
          <div>
            <p className="text-body font-semibold text-ink">{r.doctor}</p>
            <p className="text-small text-ink-secondary">{r.date}</p>
          </div>
        </div>
        <Badge color="warning">{r.diagnosis}</Badge>
      </div>
      {!compact && (
        <>
          <p className="text-body text-ink-secondary leading-relaxed">{r.notes}</p>
          <div className="mt-4">
            <p className="text-small font-semibold text-ink mb-2">Recommendations</p>
            <ul className="space-y-1.5">
              {r.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2 text-body text-ink-secondary"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />{rec}</li>
              ))}
            </ul>
          </div>
        </>
      )}
      <div className="mt-4 pt-4 border-t border-line flex items-center justify-between">
        <p className="text-small text-ink-secondary">{compact ? r.notes : r.medicationInstructions}</p>
        <Badge color="primary">Follow-up: {r.followUp}</Badge>
      </div>
    </div>
  );
}

function AppointmentsTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[580px]">
        <thead><tr className="border-b border-line"><th className="th">Date/Time</th><th className="th">Doctor</th><th className="th">Department</th><th className="th">Status</th></tr></thead>
        <tbody className="divide-y divide-line">
          {appointments.map((a) => (
            <tr key={a.id} className="hover:bg-slate-50/60">
              <td className="td"><span className="font-medium">{a.date}</span><span className="text-ink-secondary ml-2">{a.time}</span></td>
              <td className="td text-ink-secondary">{a.doctor}</td>
              <td className="td text-ink-secondary">{a.dept}</td>
              <td className="td"><Badge color={statusColor(a.status)}>{a.status}</Badge></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
