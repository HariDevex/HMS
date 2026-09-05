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
      <h1 className="hdx_text-2xl hdx_font-bold hdx_text-ink">Set a new password</h1>
      <p className="hdx_text-secondary-text hdx_text-ink-secondary hdx_mt-1.5">
        Create a strong password for your account.
      </p>

      <form onSubmit={onSubmit} className="hdx_mt-8 hdx_space-y-5" noValidate>
        {fields.map((f) => (
          <Field key={f.key} label={f.label} error={errors[f.key]}>
            <div className="hdx_relative">
              <Lock size={16} className="hdx_absolute hdx_left-3.5 hdx_top-1/2 hdx_transform hdx_translate-y--1/2 hdx_text-ink-secondary" />
              <Input
                type={show[f.showKey] ? 'text' : 'password'}
                placeholder="••••••••"
                className="hdx_pl-10 hdx_pr-10"
                value={values[f.key]}
                onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShow({ ...show, [f.showKey]: !show[f.showKey] })}
                className="hdx_absolute hdx_right-3.5 hdx_top-1/2 hdx_transform hdx_translate-y--1/2 hdx_text-ink-secondary hdx_hover_text-ink"
                aria-label={show[f.showKey] ? 'Hide password' : 'Show password'}
              >
                {show[f.showKey] ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </Field>
        ))}

        <div className="hdx_rounded-card hdx_bg-surface hdx_border hdx_border-line hdx_p-3.5 hdx_flex hdx_items-start hdx_gap-2.5">
          <ShieldCheck size={17} className="hdx_text-primary hdx_shrink-0 hdx_mt-0.5" />
          <div className="hdx_text-small hdx_text-ink-secondary">
            <p className="hdx_font-semibold hdx_text-ink hdx_mb-0.5">Password strength</p>
            <p>Minimum 8 characters with letters and numbers.</p>
          </div>
        </div>

        <button type="submit" className="btn-primary hdx_w-full hdx_h-44px">
          Update password
        </button>
      </form>

      <Link to="/login" className="hdx_mt-6 hdx_inline-block hdx_text-body hdx_font-medium hdx_text-primary hdx_hover_underline">
        Back to sign in
      </Link>
    </AuthLayout>
  );
}
