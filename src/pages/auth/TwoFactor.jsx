import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function TwoFactor() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/doctor');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 animate-slide-up text-center">
        <div className="w-12 h-12 rounded-2xl bg-primary text-white mx-auto flex items-center justify-center shadow-lg mb-3">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Two-Factor Authentication</h2>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          Enter the 6-digit security verification code sent to your registered authenticator or phone.
        </p>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-center gap-2 sm:gap-3">
            {code.map((digit, idx) => (
              <input
                key={idx}
                id={`otp-${idx}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                className="w-11 h-13 text-xl font-bold text-center bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-colors"
              />
            ))}
          </div>

          <Button type="submit" size="lg" loading={loading} className="w-full">
            <span>Verify & Enter</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>

        <p className="text-xs text-slate-400 mt-4">
          Didn't receive code? <button className="text-primary font-semibold hover:underline">Resend code</button>
        </p>
      </div>
    </div>
  );
}
