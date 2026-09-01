import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import AuthLayout from './AuthLayout';
import { useApp } from '../../context/AppContext';

export default function TwoFactor() {
  const navigate = useNavigate();
  const { pushToast } = useApp();
  const inputs = useRef([]);
  const [digits, setDigits] = useState(['', '', '', '', '', '']);

  const setDigit = (i, val) => {
    const v = val.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[i] = v;
    setDigits(next);
    if (v && i < 5) inputs.current[i + 1]?.focus();
  };

  const onKey = (e, i) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) inputs.current[i - 1]?.focus();
  };

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  const code = digits.join('');
  const verify = () => {
    if (code.length < 6) {
      pushToast('Enter the 6-digit code', 'info');
      return;
    }
    pushToast('Two-factor authentication verified', 'success');
    navigate('/');
  };

  return (
    <AuthLayout sideNote="Multi-factor authentication adds a critical layer of account protection.">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light mb-6">
        <ShieldCheck size={24} className="text-primary" />
      </div>
      <h1 className="text-2xl font-bold text-ink">Two-factor authentication</h1>
      <p className="text-secondary text-ink-secondary mt-1.5">
        Enter the 6-digit code from your authenticator app to verify your identity.
      </p>

      <div className="mt-8">
        <div className="flex gap-2.5" role="group" aria-label="Verification code">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => (inputs.current[i] = el)}
              value={d}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => onKey(e, i)}
              inputMode="numeric"
              maxLength={1}
              className="input !w-12 text-center text-page-title font-bold"
              aria-label={`Digit ${i + 1}`}
            />
          ))}
        </div>
        <button onClick={verify} className="btn-primary w-full h-[44px] mt-6">
          Verify & continue
        </button>
      </div>

      <div className="mt-6 flex items-center justify-between text-small">
        <span className="text-ink-secondary">Didn't get a code?</span>
        <button className="font-medium text-primary hover:underline">Resend code</button>
      </div>

      <Link to="/login" className="mt-4 inline-block text-body font-medium text-primary hover:underline">
        Back to sign in
      </Link>
    </AuthLayout>
  );
}
