import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import AuthLayout from './AuthLayout';
import { Field, Input } from '../../components/ui/Field';
import { useApp } from '../../context/AppContext';

export default function ResetPassword() {
  const navigate = useNavigate();
  const { pushToast } = useApp();
  const [show, setShow] = useState({ a: false, b: false });
  const [values, setValues] = useState({ a: '', b: '' });
  const [errors, setErrors] = useState({});

  const onSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (values.a.length < 8) errs.a = 'Must be at least 8 characters';
    if (!/^(?=.*[A-Za-z])(?=.*\d)/.test(values.a)) errs.a = 'Include letters and numbers';
    if (values.b !== values.a) errs.b = 'Passwords do not match';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    pushToast('Password updated successfully', 'success');
    navigate('/login');
  };

  const fields = [
    { key: 'a', label: 'New password', showKey: 'a' },
    { key: 'b', label: 'Confirm new password', showKey: 'b' },
  ];

  return (
    <AuthLayout sideNote="Choose a strong, unique password you haven't used before.">
      <h1 className="text-2xl font-bold text-ink">Set a new password</h1>
      <p className="text-secondary text-ink-secondary mt-1.5">
        Create a strong password for your account.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-5" noValidate>
        {fields.map((f) => (
          <Field key={f.key} label={f.label} error={errors[f.key]}>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-secondary" />
              <Input
                type={show[f.showKey] ? 'text' : 'password'}
                placeholder="••••••••"
                className="pl-10 pr-10"
                value={values[f.key]}
                onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShow({ ...show, [f.showKey]: !show[f.showKey] })}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-secondary hover:text-ink"
                aria-label={show[f.showKey] ? 'Hide password' : 'Show password'}
              >
                {show[f.showKey] ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </Field>
        ))}

        <div className="rounded-card bg-surface border border-line p-3.5 flex items-start gap-2.5">
          <ShieldCheck size={17} className="text-primary shrink-0 mt-0.5" />
          <div className="text-small text-ink-secondary">
            <p className="font-semibold text-ink mb-0.5">Password strength</p>
            <p>Minimum 8 characters with letters and numbers.</p>
          </div>
        </div>

        <button type="submit" className="btn-primary w-full h-[44px]">
          Update password
        </button>
      </form>

      <Link to="/login" className="mt-6 inline-block text-body font-medium text-primary hover:underline">
        Back to sign in
      </Link>
    </AuthLayout>
  );
}
