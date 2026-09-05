import { useState } from 'react';
import { User, Shield, Bell, Palette, KeyRound, Smartphone } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import { Field, Input } from '../components/ui/Field';
import { currentUser } from '../data/mock';
import { useApp } from '../context/AppContext';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'preferences', label: 'Preferences', icon: Palette },
];

export default function Settings() {
  const [active, setActive] = useState('profile');

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your account, security and preferences." />

      <div className="hdx_grid hdx_grid-cols-1 hdx_lg_grid-cols-4 hdx_gap-4">
        <div className="hdx_lg_col-span-1 card hdx_p-3 hdx_h-fit">
          <div className="hdx_flex hdx_items-center hdx_gap-3 hdx_px-3 hdx_py-3 hdx_border-b hdx_border-line hdx_mb-2">
            <Avatar initials={currentUser.avatar} size="lg" />
            <div>
              <p className="hdx_text-body hdx_font-semibold hdx_text-ink">{currentUser.name}</p>
              <p className="hdx_text-small hdx_text-ink-secondary">{currentUser.role}</p>
            </div>
          </div>
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setActive(t.id)} className={`hdx_w-full hdx_flex hdx_items-center hdx_gap-3 hdx_px-3 hdx_py-2.5 hdx_rounded-input hdx_text-body hdx_font-medium hdx_mb-0.5 hdx_transition-colors ${active === t.id ? 'hdx_bg-primary-light hdx_text-primary' : 'hdx_text-ink-secondary hdx_hover_bg-slate-50'}`}>
              <t.icon size={17} /> {t.label}
            </button>
          ))}
        </div>

        <div className="hdx_lg_col-span-3">
          {active === 'profile' && <ProfileTab />}
          {active === 'security' && <SecurityTab />}
          {active === 'notifications' && <PrefsTab type="notifications" />}
          {active === 'preferences' && <PrefsTab type="preferences" />}
        </div>
      </div>
    </div>
  );
}

function ProfileTab() {
  const { pushToast } = useApp();
  const [form, setForm] = useState({ name: currentUser.name, email: 'sarah.chen@medicore.com', phone: '+1 (555) 020-1020', department: 'Cardiology', title: 'Senior Cardiologist' });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  return (
    <div className="card hdx_p-6">
      <h2 className="hdx_text-card-title hdx_text-ink hdx_mb-5">Personal Information</h2>
      <div className="hdx_grid hdx_grid-cols-1 hdx_sm_grid-cols-2 hdx_gap-5 hdx_max-w-2xl">
        <Field label="Full name"><Input value={form.name} onChange={set('name')} /></Field>
        <Field label="Job title"><Input value={form.title} onChange={set('title')} /></Field>
        <Field label="Email"><Input type="email" value={form.email} onChange={set('email')} /></Field>
        <Field label="Phone"><Input value={form.phone} onChange={set('phone')} /></Field>
        <Field label="Department" className="hdx_sm_col-span-2"><Input value={form.department} onChange={set('department')} /></Field>
      </div>
      <div className="hdx_mt-6 hdx_flex hdx_items-center hdx_gap-3">
        <button className="btn-primary" onClick={() => pushToast('Profile updated', 'success')}>Save changes</button>
        <button className="btn-secondary">Cancel</button>
      </div>
    </div>
  );
}

function SecurityTab() {
  const { pushToast } = useApp();
  return (
    <div className="hdx_space-y-4">
      <div className="card hdx_p-6">
        <div className="hdx_flex hdx_items-center hdx_gap-2 hdx_mb-1"><KeyRound size={17} className="hdx_text-primary" /><h2 className="hdx_text-card-title hdx_text-ink">Change Password</h2></div>
        <p className="hdx_text-small hdx_text-ink-secondary hdx_mb-5">Update your account password. Use at least 8 characters with letters and numbers.</p>
        <div className="hdx_grid hdx_grid-cols-1 hdx_sm_grid-cols-3 hdx_gap-4 hdx_max-w-3xl">
          <Field label="Current password"><Input type="password" /></Field>
          <Field label="New password"><Input type="password" /></Field>
          <Field label="Confirm new password"><Input type="password" /></Field>
        </div>
        <button className="btn-primary hdx_mt-4" onClick={() => pushToast('Password updated', 'success')}>Update password</button>
      </div>

      <div className="card hdx_p-6">
        <div className="hdx_flex hdx_items-center hdx_gap-2 hdx_mb-1"><Shield size={17} className="hdx_text-primary" /><h2 className="hdx_text-card-title hdx_text-ink">Two-Factor Authentication</h2></div>
        <p className="hdx_text-small hdx_text-ink-secondary hdx_mb-5">Protect your account with an authenticator app.</p>
        <div className="hdx_flex hdx_items-center hdx_justify-between hdx_rounded-input hdx_bg-surface hdx_border hdx_border-line hdx_p-4 hdx_max-w-3xl">
          <div className="hdx_flex hdx_items-center hdx_gap-2.5">
            <Smartphone size={18} className="hdx_text-primary" />
            <div><p className="hdx_text-body hdx_font-medium hdx_text-ink">Authenticator app</p><p className="hdx_text-small hdx_text-ink-secondary">Enforced for all administrative roles</p></div>
          </div>
          <Badge color="success">Enabled</Badge>
        </div>
      </div>

      <div className="card hdx_p-6">
        <div className="hdx_flex hdx_items-center hdx_gap-2 hdx_mb-1"><Shield size={17} className="hdx_text-primary" /><h2 className="hdx_text-card-title hdx_text-ink">Active Sessions</h2></div>
        <p className="hdx_text-small hdx_text-ink-secondary hdx_mb-4">Review and manage devices signed into your account.</p>
        <button className="btn-secondary" onClick={() => { pushToast('Signed out other sessions', 'success'); }}>Manage sessions</button>
      </div>
    </div>
  );
}

function PrefsTab({ type }) {
  const { pushToast } = useApp();
  const notify = type === 'notifications';
  const items = notify
    ? ['Report uploaded', 'Appointment reminders', 'Follow-up reminders', 'New recommendations', 'Pending reports', 'Staff activity alerts']
    : ['Compact tables', 'Show confirmation dialogs', 'Auto-refresh dashboard', 'Enable keyboard shortcuts'];
  return (
    <div className="card hdx_p-6">
      <h2 className="hdx_text-card-title hdx_text-ink hdx_mb-1">{notify ? 'Notification Preferences' : 'Application Preferences'}</h2>
      <p className="hdx_text-small hdx_text-ink-secondary hdx_mb-5">{notify ? 'Choose which notifications you receive.' : 'Customize the interface to your workflow.'}</p>
      <div className="hdx_divide-y hdx_divide-line hdx_max-w-2xl">
        {items.map((item) => (
          <label key={item} className="hdx_flex hdx_items-center hdx_justify-between hdx_py-3.5 hdx_cursor-pointer">
            <span className="hdx_text-body hdx_text-ink">{item}</span>
            <input type="checkbox" defaultChecked className="hdx_h-18px hdx_w-18px hdx_rounded hdx_accent-primary" />
          </label>
        ))}
      </div>
      <button className="btn-primary hdx_mt-5" onClick={() => pushToast('Preferences saved', 'success')}>Save preferences</button>
    </div>
  );
}
