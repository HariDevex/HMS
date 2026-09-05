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
        <div className="hdx_p-4 hdx_border-b hdx_border-line hdx_flex hdx_flex-col hdx_sm_flex-row hdx_gap-3 hdx_sm_items-center">
          <div className="hdx_relative hdx_flex-1 hdx_max-w-xs">
            <Search size={16} className="hdx_absolute hdx_left-3.5 hdx_top-1/2 hdx_transform hdx_translate-y--1/2 hdx_text-ink-secondary" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search staff…" className="input hdx_pl-10" aria-label="Search staff" />
          </div>
          <div className="hdx_flex hdx_flex-wrap hdx_gap-2.5 hdx_ml-auto">
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

        <div className="hdx_overflow-x-auto scrollbar-thin">
          <table className="hdx_w-full hdx_min-w-860px">
            <thead>
              <tr className="hdx_border-b hdx_border-line hdx_bg-slate-50-50">
                <th className="th">Staff</th>
                <th className="th">ID</th>
                <th className="th">Role</th>
                <th className="th">Department</th>
                <th className="th">Qualification</th>
                <th className="th">Shift</th>
                <th className="th">Availability</th>
                <th className="th hdx_text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="hdx_divide-y hdx_divide-line">
              {filtered.map((s) => (
                <tr key={s.id} className="hdx_hover_bg-slate-50-60 hdx_transition-colors">
                  <td className="td">
                    <div className="hdx_flex hdx_items-center hdx_gap-3">
                      <Avatar initials={s.avatar} size="sm" />
                      <span className="hdx_font-semibold">{s.name}</span>
                    </div>
                  </td>
                  <td className="td hdx_text-ink-secondary">{s.id}</td>
                  <td className="td">{s.role}</td>
                  <td className="td hdx_text-ink-secondary">{s.department}</td>
                  <td className="td hdx_text-ink-secondary">{s.qualification}</td>
                  <td className="td hdx_text-ink-secondary">{s.shift}</td>
                  <td className="td">
                    <Badge color={s.availability === 'Available' ? 'success' : s.availability === 'Off Duty' ? 'secondary' : 'warning'} dot>{s.availability}</Badge>
                  </td>
                  <td className="td hdx_text-right">
                    <button onClick={() => setViewing(s)} className="hdx_inline-flex hdx_items-center hdx_gap-1.5 hdx_px-3 hdx_py-1.5 hdx_rounded-input hdx_text-small hdx_font-medium hdx_text-primary hdx_hover_bg-primary-light">
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
      <form onSubmit={submit} className="hdx_grid hdx_grid-cols-1 hdx_sm_grid-cols-2 hdx_gap-5" noValidate>
        <Field label="Full name" required error={errors.name} className="hdx_sm_col-span-2"><Input placeholder="e.g. Dr. Jane Smith" value={form.name} onChange={set('name')} /></Field>
        <Field label="Role"><Select value={form.role} onChange={set('role')}>{ROLES.map((r) => <option key={r.id}>{r.name}</option>)}</Select></Field>
        <Field label="Department"><Select value={form.department} onChange={set('department')}>{DEPARTMENTS.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}</Select></Field>
        <Field label="Qualification" className="hdx_sm_col-span-2"><Input placeholder="e.g. MD, BSN, MLT" value={form.qualification} onChange={set('qualification')} /></Field>
        <Field label="Contact" required error={errors.contact}><Input placeholder="+1 (555) 000-0000" value={form.contact} onChange={set('contact')} /></Field>
        <Field label="Email" required error={errors.email}><Input type="email" placeholder="name@medicore.com" value={form.email} onChange={set('email')} /></Field>
        <Field label="Shift" className="hdx_sm_col-span-2"><Select value={form.shift} onChange={set('shift')}><option>Morning (7–3)</option><option>Evening (3–11)</option><option>Night (11–7)</option></Select></Field>
      </form>
    </Modal>
  );
}

function StaffProfile({ open, staff, onClose }) {
  if (!staff) return null;
  return (
    <Modal open={open} onClose={onClose} title="Staff Profile" size="lg">
      <div className="hdx_flex hdx_items-center hdx_gap-4 hdx_mb-6">
        <Avatar initials={staff.avatar} size="xl" />
        <div className="hdx_flex-1">
          <h3 className="hdx_text-xl hdx_font-bold hdx_text-ink">{staff.name}</h3>
          <p className="hdx_text-secondary-text hdx_text-ink-secondary">{staff.role} · {staff.id}</p>
          <div className="hdx_mt-2"><Badge color={staff.availability === 'Available' ? 'success' : 'warning'} dot>{staff.availability}</Badge></div>
        </div>
        <div className="hdx_flex hdx_gap-2">
          <button className="btn-secondary"><Mail size={15} /> Email</button>
          <button className="btn-secondary"><Phone size={15} /> Call</button>
        </div>
      </div>
      <div className="hdx_grid hdx_grid-cols-2 hdx_sm_grid-cols-3 hdx_gap-x-6 hdx_gap-y-4 hdx_border-t hdx_border-line hdx_pt-5">
        {[
          { label: 'Department', value: staff.department },
          { label: 'Qualification', value: staff.qualification },
          { label: 'Contact', value: staff.contact },
          { label: 'Email', value: staff.email },
          { label: 'Joining date', value: staff.joiningDate },
          { label: 'Shift', value: staff.shift },
        ].map((r) => (
          <div key={r.label}><p className="hdx_text-small hdx_text-ink-secondary hdx_mb-0.5">{r.label}</p><p className="hdx_text-body hdx_font-medium hdx_text-ink">{r.value}</p></div>
        ))}
      </div>
    </Modal>
  );
}
