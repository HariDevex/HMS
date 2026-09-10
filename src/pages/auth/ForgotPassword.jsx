import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Hospital, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 relative">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 animate-slide-up">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-primary text-white mx-auto flex items-center justify-center shadow-lg mb-3">
            <Hospital className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Reset Hospital Password</h2>
          <p className="text-xs text-slate-500 mt-1">
            Enter your official MediCore email address to receive password reset instructions.
          </p>
        </div>

        {submitted ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Instructions Sent</h4>
              <p className="text-xs text-slate-500 mt-1">
                If an account exists for <span className="font-semibold">{email}</span>, you will receive a secure reset link valid for 15 minutes.
              </p>
            </div>
            <Button
              variant="primary"
              className="w-full"
              onClick={() => navigate('/reset-password')}
            >
              Simulate Opening Reset Link
            </Button>
            <div>
              <Link to="/login" className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center justify-center gap-1.5 mt-2">
                <ArrowLeft className="w-3.5 h-3.5" /> Return to Login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Staff Email
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor@medicore.org"
                  className="w-full h-11 pl-9 pr-3 text-sm bg-slate-50 rounded-xl border border-slate-300 focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <Button type="submit" size="lg" loading={loading} className="w-full">
              Send Reset Instructions
            </Button>

            <div className="text-center pt-2">
              <Link to="/login" className="text-xs font-semibold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
