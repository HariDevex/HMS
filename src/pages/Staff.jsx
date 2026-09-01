import { useMemo, useState } from 'react';
import { Plus, Search, Eye, Mail, Phone } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import Modal from '../components/ui/Modal';
import { Field, Input, Select } from '../components/ui/Field';
import { staff, DEPARTMENTS, ROLES } from '../data/mock';
import { useApp } from '../context/AppContext';

const emptyForm = { name: '', role: 'Doctor', department: 'General Medicine', qualification: '', contact: '', email: '', shift: 'Morning (7–3)' };

export default function Staff() {
  const { pushToast } = useApp();
  const [query, setQuery] = useState('');
  const [dept, setDept] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [openAdd, setOpenAdd] = useState(false);
  const [viewing, setViewing] = useState(null);

  const filtered = useMemo(
    () =>
      staff.filter((s) => {
        const q = query.toLowerCase();
        const matchQ = !q || s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q);
        return matchQ && (!dept || s.department === dept) && (!role || s.role === role) && (!status || s.status === status);
      }),
    [query, dept, role, status]
  );

  return (
    <div>
      <PageHeader
        title="Staff"
        subtitle="Manage hospital staff, roles and availability."
        actions={
          <button className="btn-primary" onClick={() => setOpenAdd(true)}>
            <Plus size={16} /> Add Staff
          </button>
        }
      />

      <div className="card">
        <div className="p-4 border-b border-line flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="relative flex-1 max-w-xs">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-secondary" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search staff…" className="input pl-10" aria-label="Search staff" />
          </div>
          <div className="flex flex-wrap gap-2.5 ml-auto">
            <Select value={dept} onChange={(e) => setDept(e.target.value)} className="!w-auto">
              <option value="">Department</option>
              {DEPARTMENTS.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
            </Select>
            <Select value={role} onChange={(e) => setRole(e.target.value)} className="!w-auto">
              <option value="">Role</option>
              {ROLES.map((r) => <option key={r.id} value={r.name}>{r.name}</option>)}
            </Select>
            <Select value={status} onChange={(e) => setStatus(e.target.value)} className="!w-auto">
              <option value="">Status</option>
              {['Active', 'On Leave', 'Inactive'].map((s) => <option key={s}>{s}</option>)}
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[860px]">
            <thead>
              <tr className="border-b border-line bg-slate-50/50">
                <th className="th">Staff</th>
                <th className="th">ID</th>
                <th className="th">Role</th>
                <th className="th">Department</th>
                <th className="th">Qualification</th>
                <th className="th">Shift</th>
                <th className="th">Availability</th>
                <th className="th text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="td">
                    <div className="flex items-center gap-3">
                      <Avatar initials={s.avatar} size="sm" />
                      <span className="font-semibold">{s.name}</span>
                    </div>
                  </td>
                  <td className="td text-ink-secondary">{s.id}</td>
                  <td className="td">{s.role}</td>
                  <td className="td text-ink-secondary">{s.department}</td>
                  <td className="td text-ink-secondary">{s.qualification}</td>
                  <td className="td text-ink-secondary">{s.shift}</td>
                  <td className="td">
                    <Badge color={s.availability === 'Available' ? 'success' : s.availability === 'Off Duty' ? 'secondary' : 'warning'} dot>{s.availability}</Badge>
                  </td>
                  <td className="td text-right">
                    <button onClick={() => setViewing(s)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-input text-small font-medium text-primary hover:bg-primary-light">
                      <Eye size={15} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddStaffModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSave={() => {
          setOpenAdd(false);
          pushToast('Staff record created. Temporary credentials sent.', 'success');
        }}
      />

      <StaffProfile open={!!viewing} staff={viewing} onClose={() => setViewing(null)} />
    </div>
  );
}

function AddStaffModal({ open, onClose, onSave }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name) errs.name = 'Full name is required';
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.contact) errs.contact = 'Contact number is required';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    onSave();
  };
  return (
    <Modal open={open} onClose={onClose} title="Add Staff Member" subtitle="Create a new staff account" size="lg"
      footer={<>
        <button className="btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn-primary" onClick={submit}>Create Staff</button>
      </>}>
      <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-5" noValidate>
        <Field label="Full name" required error={errors.name} className="sm:col-span-2"><Input placeholder="e.g. Dr. Jane Smith" value={form.name} onChange={set('name')} /></Field>
        <Field label="Role"><Select value={form.role} onChange={set('role')}>{ROLES.map((r) => <option key={r.id}>{r.name}</option>)}</Select></Field>
        <Field label="Department"><Select value={form.department} onChange={set('department')}>{DEPARTMENTS.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}</Select></Field>
        <Field label="Qualification" className="sm:col-span-2"><Input placeholder="e.g. MD, BSN, MLT" value={form.qualification} onChange={set('qualification')} /></Field>
        <Field label="Contact" required error={errors.contact}><Input placeholder="+1 (555) 000-0000" value={form.contact} onChange={set('contact')} /></Field>
        <Field label="Email" required error={errors.email}><Input type="email" placeholder="name@medicore.com" value={form.email} onChange={set('email')} /></Field>
        <Field label="Shift" className="sm:col-span-2"><Select value={form.shift} onChange={set('shift')}><option>Morning (7–3)</option><option>Evening (3–11)</option><option>Night (11–7)</option></Select></Field>
      </form>
    </Modal>
  );
}

function StaffProfile({ open, staff, onClose }) {
  if (!staff) return null;
  return (
    <Modal open={open} onClose={onClose} title="Staff Profile" size="lg">
      <div className="flex items-center gap-4 mb-6">
        <Avatar initials={staff.avatar} size="xl" />
        <div className="flex-1">
          <h3 className="text-xl font-bold text-ink">{staff.name}</h3>
          <p className="text-secondary text-ink-secondary">{staff.role} · {staff.id}</p>
          <div className="mt-2"><Badge color={staff.availability === 'Available' ? 'success' : 'warning'} dot>{staff.availability}</Badge></div>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary"><Mail size={15} /> Email</button>
          <button className="btn-secondary"><Phone size={15} /> Call</button>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 border-t border-line pt-5">
        {[
          { label: 'Department', value: staff.department },
          { label: 'Qualification', value: staff.qualification },
          { label: 'Contact', value: staff.contact },
          { label: 'Email', value: staff.email },
          { label: 'Joining date', value: staff.joiningDate },
          { label: 'Shift', value: staff.shift },
        ].map((r) => (
          <div key={r.label}><p className="text-small text-ink-secondary mb-0.5">{r.label}</p><p className="text-body font-medium text-ink">{r.value}</p></div>
        ))}
      </div>
    </Modal>
  );
}
