import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

export default function Login() {
  const { roles, switchRole, addToast } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('s.jenkins@medicore.org');
  const [password, setPassword] = useState('Password123!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both your hospital email and password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Determine matching demo user or default to doctor
      const match = roles.find((r) => r.email.toLowerCase() === email.toLowerCase());
      if (match) {
        switchRole(match.id);
        navigate(match.id === 'patient' ? '/portal' : `/${match.id}`);
      } else {
        switchRole('doctor');
        navigate('/doctor');
      }
      addToast({
        title: 'Authentication Successful',
        message: 'Welcome back to MediCore Enterprise Hospital System.',
        type: 'success',
      });
    }, 600);
  };

  const handleQuickDemo = (roleId) => {
    const roleObj = roles.find((r) => r.id === roleId);
    if (roleObj) {
      setEmail(roleObj.email);
      setPassword('MediCore2026!');
      switchRole(roleId);
      navigate(roleId === 'patient' ? '/portal' : `/${roleId}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 pattern opacity-15 pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-teal-600/20 blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100/10 p-6 sm:p-8 z-10 animate-slide-up">
        {/* Hospital Branding Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-primary text-white mx-auto flex items-center justify-center shadow-lg shadow-blue-500/25 mb-3">
            <Hospital className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            MediCore <span className="text-primary font-semibold">HMS</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Clinical Information & Hospital Operations System
          </p>
        </div>

        {/* Error State Banner */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-error text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Staff Email / ID
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
                placeholder="doctor@medicore.org"
                className="w-full h-11 pl-9 pr-3 text-sm bg-slate-50 rounded-xl border border-slate-300 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-primary hover:underline font-semibold"
              >
                Forgot?
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
                placeholder="••••••••••••"
                className="w-full h-11 pl-9 pr-10 text-sm bg-slate-50 rounded-xl border border-slate-300 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 text-primary focus:ring-blue-400"
              />
              <span>Remember this workstation</span>
            </label>
            <span className="flex items-center gap-1 text-slate-400 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> HIPAA Compliant
            </span>
          </div>

          <Button
            type="submit"
            size="lg"
            loading={loading}
            className="w-full mt-2 font-bold shadow-md shadow-blue-500/20"
          >
            <span>Sign In to System</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>

        {/* Quick Demo Role Selector */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-2.5">
            Quick Persona Login (1-Click Test)
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
            {roles.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => handleQuickDemo(r.id)}
                className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 text-slate-700 hover:text-primary text-[11px] font-semibold text-center transition-colors truncate"
                title={`Login as ${r.name} (${r.role})`}
              >
                {r.role}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-400 mt-6 text-center">
        MediCore Healthcare Systems © 2026. Authorized Personnel Only.
      </p>
    </div>
  );
}
