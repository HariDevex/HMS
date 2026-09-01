import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import AuthLayout from './AuthLayout';
import { Field, Input } from '../../components/ui/Field';
import { useApp } from '../../context/AppContext';

export default function Login() {
  const navigate = useNavigate();
  const { pushToast } = useApp();
  const [show, setShow] = useState(false);
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const onChange = (e) => setValues({ ...values, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (!values.email) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(values.email)) e.email = 'Enter a valid email';
    if (!values.password) e.password = 'Password is required';
    else if (values.password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    pushToast('Signed in successfully', 'success');
    navigate('/');
  };

  return (
    <AuthLayout sideNote="Protected by end-to-end encryption & multi-factor authentication.">
      <h1 className="text-2xl font-bold text-ink">Welcome back</h1>
      <p className="text-secondary text-ink-secondary mt-1.5">
        Sign in to your hospital account to continue.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-5" noValidate>
        <Field label="Email address" error={errors.email}>
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-secondary" />
            <Input
              name="email"
              type="email"
              placeholder="you@hospital.com"
              className="pl-10"
              value={values.email}
              onChange={onChange}
            />
          </div>
        </Field>

        <Field label="Password" error={errors.password}>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-secondary" />
            <Input
              name="password"
              type={show ? 'text' : 'password'}
              placeholder="••••••••"
              className="pl-10 pr-10"
              value={values.password}
              onChange={onChange}
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-secondary hover:text-ink"
              aria-label={show ? 'Hide password' : 'Show password'}
            >
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </Field>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-small text-ink-secondary cursor-pointer select-none">
            <input type="checkbox" className="h-4 w-4 rounded border-line accent-primary" />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-small font-medium text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        <button type="submit" className="btn-primary w-full h-[44px]">
          Sign in <ArrowRight size={16} />
        </button>
      </form>

      <div className="mt-6 rounded-card bg-surface border border-line p-3.5 flex items-start gap-2.5">
        <ShieldCheck size={17} className="text-primary shrink-0 mt-0.5" />
        <p className="text-small text-ink-secondary">
          Your session is protected with two-factor authentication and modern encryption standards.
        </p>
      </div>
    </AuthLayout>
  );
}
