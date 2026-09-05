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
      <h1 className="hdx_text-2xl hdx_font-bold hdx_text-ink">Welcome back</h1>
      <p className="hdx_text-secondary-text hdx_text-ink-secondary hdx_mt-1.5">
        Sign in to your hospital account to continue.
      </p>

      <form onSubmit={onSubmit} className="hdx_mt-8 hdx_space-y-5" noValidate>
        <Field label="Email address" error={errors.email}>
          <div className="hdx_relative">
            <Mail size={16} className="hdx_absolute hdx_left-3.5 hdx_top-1/2 hdx_transform hdx_translate-y--1/2 hdx_text-ink-secondary" />
            <Input
              name="email"
              type="email"
              placeholder="you@hospital.com"
              className="hdx_pl-10"
              value={values.email}
              onChange={onChange}
            />
          </div>
        </Field>

        <Field label="Password" error={errors.password}>
          <div className="hdx_relative">
            <Lock size={16} className="hdx_absolute hdx_left-3.5 hdx_top-1/2 hdx_transform hdx_translate-y--1/2 hdx_text-ink-secondary" />
            <Input
              name="password"
              type={show ? 'text' : 'password'}
              placeholder="••••••••"
              className="hdx_pl-10 hdx_pr-10"
              value={values.password}
              onChange={onChange}
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="hdx_absolute hdx_right-3.5 hdx_top-1/2 hdx_transform hdx_translate-y--1/2 hdx_text-ink-secondary hdx_hover_text-ink"
              aria-label={show ? 'Hide password' : 'Show password'}
            >
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </Field>

        <div className="hdx_flex hdx_items-center hdx_justify-between">
          <label className="hdx_flex hdx_items-center hdx_gap-2 hdx_text-small hdx_text-ink-secondary hdx_cursor-pointer hdx_select-none">
            <input type="checkbox" className="hdx_h-4 hdx_w-4 hdx_rounded hdx_border-line hdx_accent-primary" />
            Remember me
          </label>
          <Link to="/forgot-password" className="hdx_text-small hdx_font-medium hdx_text-primary hdx_hover_underline">
            Forgot password?
          </Link>
        </div>

        <button type="submit" className="btn-primary hdx_w-full hdx_h-44px">
          Sign in <ArrowRight size={16} />
        </button>
      </form>

      <div className="hdx_mt-6 hdx_rounded-card hdx_bg-surface hdx_border hdx_border-line hdx_p-3.5 hdx_flex hdx_items-start hdx_gap-2.5">
        <ShieldCheck size={17} className="hdx_text-primary hdx_shrink-0 hdx_mt-0.5" />
        <p className="hdx_text-small hdx_text-ink-secondary">
          Your session is protected with two-factor authentication and modern encryption standards.
        </p>
      </div>
    </AuthLayout>
  );
}
