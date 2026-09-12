import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Hospital,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import Button from '../../components/ui/Button';

const HOSPITAL_IMAGE_URL = '/hospital-image.svg';

export default function Login() {
  const { roles, login, isAuthenticated, addToast } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both your username and password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const input = email.toLowerCase().trim();
      const match = roles.find(
        (r) =>
          r.email.toLowerCase() === input ||
          (r.username && r.username.toLowerCase() === input)
      );
      if (match && match.password === password) {
        login(match.id);
        navigate(match.id === 'patient' ? '/portal' : `/${match.id}`, { replace: true });
        addToast({
          title: 'Login Successful',
          message: `Welcome back, ${match.name}.`,
          type: 'success',
        });
      } else {
        setError('Invalid username or password. Please try again.');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Decorative background blurs */}
      <div className="absolute -top-52 -right-52 w-[28rem] h-[28rem] rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-52 -left-52 w-[28rem] h-[28rem] rounded-full bg-teal-600/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      {/* Login Card — Split layout on lg, stacked on mobile */}
      <div className="relative w-full max-w-[860px] bg-white rounded-3xl shadow-2xl overflow-hidden z-10 animate-slide-up flex flex-col lg:flex-row">

        {/* ─── Left: Hospital Image / Branding Panel ─────────────────── */}
        <div className="relative hidden lg:flex lg:w-[48%] bg-gradient-to-br from-primary via-primary-dark to-slate-900 items-center justify-center p-10 overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-white/5" />
          <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-white/5" />

          <div className="relative z-10 text-center text-white flex flex-col items-center gap-6">
            {/* Hospital image — replace the src with your actual image */}
            <img
              src={HOSPITAL_IMAGE_URL}
              alt="Hospital"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
              className="w-56 h-40 object-cover rounded-2xl shadow-2xl border-2 border-white/20"
            />

            <div>
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                  <Hospital className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-black tracking-tight">
                  Medi<span className="font-bold text-blue-200">Core</span>
                </h1>
              </div>
              <p className="text-sm text-blue-100/80 font-medium leading-relaxed max-w-xs mx-auto">
                Enterprise Clinical Information &amp; Hospital Operations System
              </p>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-blue-100/60 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              HIPAA Compliant &bull; ISO 27001 Certified
            </div>
          </div>
        </div>

        {/* ─── Right: Login Form Panel ─────────────────────────────── */}
        <div className="flex-1 flex flex-col justify-center p-6 sm:p-8 lg:p-10">

          {/* Mobile-only branding header */}
          <div className="lg:hidden text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary text-white mx-auto flex items-center justify-center shadow-lg shadow-primary/25 mb-3">
              <Hospital className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              MediCore <span className="text-primary">HMS</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Sign in to your hospital account
            </p>
          </div>

          {/* Desktop-only heading */}
          <div className="hidden lg:block mb-6">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Sign in with your hospital credentials
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Username / Email
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 text-slate-400 pointer-events-none">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. s.jenkins@medicore.org"
                  className="w-full h-11 pl-9 pr-3 text-sm bg-slate-50 rounded-xl border border-slate-300 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-primary hover:text-primary-dark hover:underline font-semibold"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative flex items-center">
                <div className="absolute left-3 text-slate-400 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full h-11 pl-9 pr-10 text-sm bg-slate-50 rounded-xl border border-slate-300 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-400 hover:text-slate-700 p-1 cursor-pointer transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-blue-400 cursor-pointer"
                />
                <span>Remember this device</span>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              loading={loading}
              className="w-full mt-1 font-bold shadow-md shadow-primary/20"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <p className="text-[11px] text-slate-500/70 mt-6 text-center absolute bottom-4 w-full">
        MediCore Healthcare Systems &copy; {new Date().getFullYear()}. All rights reserved. Authorized personnel only.
      </p>
    </div>
  );
}
