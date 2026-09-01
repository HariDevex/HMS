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
      <h1 className="text-2xl font-bold text-ink">Forgot password</h1>
      <p className="text-secondary text-ink-secondary mt-1.5">
        Enter your email and we'll send you a secure reset link.
      </p>

      {sent ? (
        <div className="mt-8 rounded-card bg-green-50 border border-green-200 p-4 flex items-start gap-3">
          <ShieldCheck size={18} className="text-success shrink-0 mt-0.5" />
          <div>
            <p className="text-body font-semibold text-ink">Check your inbox</p>
            <p className="text-secondary text-ink-secondary mt-1">
              A password reset link has been sent to <strong>{email}</strong>. The link expires in 30 minutes.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-8 space-y-5" noValidate>
          <Field label="Email address" error={error}>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-secondary" />
              <Input
                type="email"
                placeholder="you@hospital.com"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </Field>
          <button type="submit" className="btn-primary w-full h-[44px]">
            Send reset link
          </button>
        </form>
      )}

      <Link
        to="/login"
        className="mt-6 inline-flex items-center gap-2 text-body font-medium text-primary hover:underline"
      >
        <ArrowLeft size={16} /> Back to sign in
      </Link>
    </AuthLayout>
  );
}
