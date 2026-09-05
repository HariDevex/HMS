import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, ShieldCheck } from 'lucide-react';
import AuthLayout from './AuthLayout';
import { Field, Input } from '../../components/ui/Field';
import { useApp } from '../../context/AppContext';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { pushToast } = useApp();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Enter a valid email address');
      return;
    }
    setError('');
    setSent(true);
    pushToast('Reset link sent to your email', 'info');
    setTimeout(() => navigate('/reset-password'), 600);
  };

  return (
    <AuthLayout sideNote="Recovery links expire after 30 minutes for security.">
      <h1 className="hdx_text-2xl hdx_font-bold hdx_text-ink">Forgot password</h1>
      <p className="hdx_text-secondary-text hdx_text-ink-secondary hdx_mt-1.5">
        Enter your email and we'll send you a secure reset link.
      </p>

      {sent ? (
        <div className="hdx_mt-8 hdx_rounded-card hdx_bg-green-50 hdx_border hdx_border-green-200 hdx_p-4 hdx_flex hdx_items-start hdx_gap-3">
          <ShieldCheck size={18} className="hdx_text-success hdx_shrink-0 hdx_mt-0.5" />
          <div>
            <p className="hdx_text-body hdx_font-semibold hdx_text-ink">Check your inbox</p>
            <p className="hdx_text-secondary-text hdx_text-ink-secondary hdx_mt-1">
              A password reset link has been sent to <strong>{email}</strong>. The link expires in 30 minutes.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="hdx_mt-8 hdx_space-y-5" noValidate>
          <Field label="Email address" error={error}>
            <div className="hdx_relative">
              <Mail size={16} className="hdx_absolute hdx_left-3.5 hdx_top-1/2 hdx_transform hdx_translate-y--1/2 hdx_text-ink-secondary" />
              <Input
                type="email"
                placeholder="you@hospital.com"
                className="hdx_pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </Field>
          <button type="submit" className="btn-primary hdx_w-full hdx_h-44px">
            Send reset link
          </button>
        </form>
      )}

      <Link
        to="/login"
        className="hdx_mt-6 hdx_inline-flex hdx_items-center hdx_gap-2 hdx_text-body hdx_font-medium hdx_text-primary hdx_hover_underline"
      >
        <ArrowLeft size={16} /> Back to sign in
      </Link>
    </AuthLayout>
  );
}
