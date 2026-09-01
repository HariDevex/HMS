import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Plus,
  Search,
  Download,
  SlidersHorizontal,
  MoreHorizontal,
  Eye,
  CalendarPlus,
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import Dropdown, { DropdownItem } from '../components/ui/Dropdown';
import Modal from '../components/ui/Modal';
import { Field, Input, Select } from '../components/ui/Field';
import { patients, DEPARTMENTS, statusColor } from '../data/mock';
import { useApp } from '../context/AppContext';

const emptyForm = {
  name: '', age: '', gender: 'Female', blood: '', department: 'General Medicine',
  phone: '', email: '', address: '', medications: '', allergies: '',
};

export default function Patients() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { pushToast } = useApp();
  const [query, setQuery] = useState('');
  const [dept, setDept] = useState('');
  const [status, setStatus] = useState('');
  const [openAdd, setOpenAdd] = useState(params.get('new') === '1');

  const filtered = useMemo(() => {
    return patients.filter((p) => {
      const q = query.toLowerCase();
      const matchQ = !q || p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.doctor.toLowerCase().includes(q);
      const matchD = !dept || p.department === dept;
      const matchS = !status || p.status === status;
      return matchQ && matchD && matchS;
    });
  }, [query, dept, status]);

  const exportCsv = () => {
    const rows = [['ID', 'Name', 'Age', 'Gender', 'Department', 'Doctor', 'Status']];
    filtered.forEach((p) => rows.push([p.id, p.name, p.age, p.gender, p.department, p.doctor, p.status]));
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'patients.csv';
    a.click();
    URL.revokeObjectURL(url);
    pushToast(`Exported ${filtered.length} patients`, 'success');
  };

  return (
    <div>
      <PageHeader
        title="Patients"
        subtitle="Manage and access patient medical records."
        actions={
          <>
            <button onClick={exportCsv} className="btn-secondary">
              <Download size={16} /> Export
            </button>
            <button onClick={() => setOpenAdd(true)} className="btn-primary">
              <Plus size={16} /> Add Patient
            </button>
          </>
        }
      />

      <div className="card">
        <div className="p-4 border-b border-line flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="relative flex-1 max-w-xs">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-secondary" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search patients…"
              className="input pl-10"
              aria-label="Search patients"
            />
          </div>
          <div className="flex gap-2.5 ml-auto">
            <Select value={dept} onChange={(e) => setDept(e.target.value)} aria-label="Filter by department" className="!w-auto">
              <option value="">All departments</option>
              {DEPARTMENTS.map((d) => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </Select>
            <Select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status" className="!w-auto">
              <option value="">All statuses</option>
              {['Active', 'Follow-up', 'In Treatment'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
            <button className="btn-secondary" aria-label="More filters">
              <SlidersHorizontal size={16} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-line bg-slate-50/50">
                <th className="th">Patient</th>
                <th className="th">ID</th>
                <th className="th">Age/Gender</th>
                <th className="th">Doctor</th>
                <th className="th">Department</th>
                <th className="th">Last Visit</th>
                <th className="th">Status</th>
                <th className="th text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/60 transition-colors cursor-pointer" onClick={() => navigate(`/patients/${p.id}`)}>
                  <td className="td">
                    <div className="flex items-center gap-3">
                      <Avatar initials={p.avatar} size="sm" />
                      <span className="font-semibold">{p.name}</span>
                    </div>
                  </td>
                  <td className="td text-ink-secondary">{p.id}</td>
                  <td className="td">{p.age} · {p.gender === 'Female' ? 'F' : 'M'}</td>
                  <td className="td text-ink-secondary">{p.doctor}</td>
                  <td className="td text-ink-secondary">{p.department}</td>
                  <td className="td text-ink-secondary">{p.lastVisit}</td>
                  <td className="td"><Badge color={statusColor(p.status)} dot>{p.status}</Badge></td>
                  <td className="td text-right" onClick={(e) => e.stopPropagation()}>
                    <Dropdown
                      trigger={<button className="p-1.5 rounded-input text-ink-secondary hover:bg-slate-100" aria-label="Actions"><MoreHorizontal size={18} /></button>}
                    >
                      <DropdownItem icon={Eye} onClick={() => navigate(`/patients/${p.id}`)}>View profile</DropdownItem>
                      <DropdownItem icon={CalendarPlus} onClick={() => navigate('/appointments?new=1')}>Book appointment</DropdownItem>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-line text-small text-ink-secondary">
          Showing {filtered.length} of {patients.length} patients
        </div>
      </div>

      <AddPatientModal
        open={openAdd}
        onClose={() => { setOpenAdd(false); setParams({}, { replace: true }); }}
        onSave={() => {
          pushToast('Patient record created successfully', 'success');
          setOpenAdd(false);
          setParams({}, { replace: true });
        }}
      />
    </div>
  );
}

function AddPatientModal({ open, onClose, onSave }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name) errs.name = 'Patient name is required';
    if (!form.age || form.age < 0 || form.age > 120) errs.age = 'Enter a valid age';
    if (!form.phone) errs.phone = 'Contact number is required';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    onSave();
  };

  return (
    <Modal open={open} onClose={onClose} title="Add New Patient" subtitle="Create a new patient record in the system" size="lg"
      footer={<>
        <button className="btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn-primary" onClick={submit}>Create Patient</button>
      </>}>
      <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-5" noValidate>
        <Field label="Full name" required error={errors.name} className="sm:col-span-2">
          <Input placeholder="e.g. John Carter" value={form.name} onChange={set('name')} />
        </Field>
        <Field label="Age" required error={errors.age}>
          <Input type="number" placeholder="e.g. 34" value={form.age} onChange={set('age')} />
        </Field>
        <Field label="Gender">
          <Select value={form.gender} onChange={set('gender')}>
            <option>Female</option>
            <option>Male</option>
            <option>Other</option>
          </Select>
        </Field>
        <Field label="Blood group">
          <Select value={form.blood} onChange={set('blood')}>
            <option value="">Select</option>
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((b) => <option key={b}>{b}</option>)}
          </Select>
        </Field>
        <Field label="Department">
          <Select value={form.department} onChange={set('department')}>
            {DEPARTMENTS.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
          </Select>
        </Field>
        <Field label="Phone" required error={errors.phone} className="sm:col-span-2">
          <Input placeholder="+1 (555) 000-0000" value={form.phone} onChange={set('phone')} />
        </Field>
        <Field label="Email" className="sm:col-span-2">
          <Input type="email" placeholder="patient@example.com" value={form.email} onChange={set('email')} />
        </Field>
        <Field label="Address" className="sm:col-span-2">
          <Input placeholder="Street, City, State" value={form.address} onChange={set('address')} />
        </Field>
        <Field label="Current medications">
          <Input placeholder="List current medications" value={form.medications} onChange={set('medications')} />
        </Field>
        <Field label="Allergies">
          <Input placeholder="List known allergies" value={form.allergies} onChange={set('allergies')} />
        </Field>
      </form>
    </Modal>
  );
}
