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
      <div className="hdx_flex hdx_h-12 hdx_w-12 hdx_items-center hdx_justify-center hdx_rounded-xl hdx_bg-primary-light hdx_mb-6">
        <ShieldCheck size={24} className="hdx_text-primary" />
      </div>
      <h1 className="hdx_text-2xl hdx_font-bold hdx_text-ink">Two-factor authentication</h1>
      <p className="hdx_text-secondary-text hdx_text-ink-secondary hdx_mt-1.5">
        Enter the 6-digit code from your authenticator app to verify your identity.
      </p>

      <div className="hdx_mt-8">
        <div className="hdx_flex hdx_gap-2.5" role="group" aria-label="Verification code">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => (inputs.current[i] = el)}
              value={d}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => onKey(e, i)}
              inputMode="numeric"
              maxLength={1}
              className="input !w-12 hdx_text-center hdx_text-page-title hdx_font-bold"
              aria-label={`Digit ${i + 1}`}
            />
          ))}
        </div>
        <button onClick={verify} className="btn-primary hdx_w-full hdx_h-44px hdx_mt-6">
          Verify & continue
        </button>
      </div>

      <div className="hdx_mt-6 hdx_flex hdx_items-center hdx_justify-between hdx_text-small">
        <span className="hdx_text-ink-secondary">Didn't get a code?</span>
        <button className="hdx_font-medium hdx_text-primary hdx_hover_underline">Resend code</button>
      </div>

      <Link to="/login" className="hdx_mt-4 hdx_inline-block hdx_text-body hdx_font-medium hdx_text-primary hdx_hover_underline">
        Back to sign in
      </Link>
    </AuthLayout>
  );
}
