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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1 card p-3 h-fit">
          <div className="flex items-center gap-3 px-3 py-3 border-b border-line mb-2">
            <Avatar initials={currentUser.avatar} size="lg" />
            <div>
              <p className="text-body font-semibold text-ink">{currentUser.name}</p>
              <p className="text-small text-ink-secondary">{currentUser.role}</p>
            </div>
          </div>
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setActive(t.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-input text-body font-medium mb-0.5 transition-colors ${active === t.id ? 'bg-primary-light text-primary' : 'text-ink-secondary hover:bg-slate-50'}`}>
              <t.icon size={17} /> {t.label}
            </button>
          ))}
        </div>

        <div className="lg:col-span-3">
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
    <div className="card p-6">
      <h2 className="text-card-title text-ink mb-5">Personal Information</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl">
        <Field label="Full name"><Input value={form.name} onChange={set('name')} /></Field>
        <Field label="Job title"><Input value={form.title} onChange={set('title')} /></Field>
        <Field label="Email"><Input type="email" value={form.email} onChange={set('email')} /></Field>
        <Field label="Phone"><Input value={form.phone} onChange={set('phone')} /></Field>
        <Field label="Department" className="sm:col-span-2"><Input value={form.department} onChange={set('department')} /></Field>
      </div>
      <div className="mt-6 flex items-center gap-3">
        <button className="btn-primary" onClick={() => pushToast('Profile updated', 'success')}>Save changes</button>
        <button className="btn-secondary">Cancel</button>
      </div>
    </div>
  );
}

function SecurityTab() {
  const { pushToast } = useApp();
  return (
    <div className="space-y-4">
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-1"><KeyRound size={17} className="text-primary" /><h2 className="text-card-title text-ink">Change Password</h2></div>
        <p className="text-small text-ink-secondary mb-5">Update your account password. Use at least 8 characters with letters and numbers.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
          <Field label="Current password"><Input type="password" /></Field>
          <Field label="New password"><Input type="password" /></Field>
          <Field label="Confirm new password"><Input type="password" /></Field>
        </div>
        <button className="btn-primary mt-4" onClick={() => pushToast('Password updated', 'success')}>Update password</button>
      </div>

      <div className="card p-6">
        <div className="flex items-center gap-2 mb-1"><Shield size={17} className="text-primary" /><h2 className="text-card-title text-ink">Two-Factor Authentication</h2></div>
        <p className="text-small text-ink-secondary mb-5">Protect your account with an authenticator app.</p>
        <div className="flex items-center justify-between rounded-input bg-surface border border-line p-4 max-w-3xl">
          <div className="flex items-center gap-2.5">
            <Smartphone size={18} className="text-primary" />
            <div><p className="text-body font-medium text-ink">Authenticator app</p><p className="text-small text-ink-secondary">Enforced for all administrative roles</p></div>
          </div>
          <Badge color="success">Enabled</Badge>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center gap-2 mb-1"><Shield size={17} className="text-primary" /><h2 className="text-card-title text-ink">Active Sessions</h2></div>
        <p className="text-small text-ink-secondary mb-4">Review and manage devices signed into your account.</p>
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
    <div className="card p-6">
      <h2 className="text-card-title text-ink mb-1">{notify ? 'Notification Preferences' : 'Application Preferences'}</h2>
      <p className="text-small text-ink-secondary mb-5">{notify ? 'Choose which notifications you receive.' : 'Customize the interface to your workflow.'}</p>
      <div className="divide-y divide-line max-w-2xl">
        {items.map((item) => (
          <label key={item} className="flex items-center justify-between py-3.5 cursor-pointer">
            <span className="text-body text-ink">{item}</span>
            <input type="checkbox" defaultChecked className="h-[18px] w-[18px] rounded accent-primary" />
          </label>
        ))}
      </div>
      <button className="btn-primary mt-5" onClick={() => pushToast('Preferences saved', 'success')}>Save preferences</button>
    </div>
  );
}
