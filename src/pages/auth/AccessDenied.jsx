import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, ArrowLeft, Home, Lock } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function AccessDenied() {
  const { currentRole } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const attemptedPath = location.state?.attemptedPath;
  const activeRole = location.state?.currentRole || currentRole;

  const getRoleHome = () => {
    switch (activeRole) {
      case 'patient': return '/portal';
      case 'doctor': return '/doctor';
      case 'nurse': return '/nurse';
      case 'lab': return '/laboratory';
      case 'radiology': return '/radiology';
      case 'reception': return '/reception';
      case 'admin':
      default: return '/admin';
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-3xl bg-red-100 text-error flex items-center justify-center shadow-lg shadow-red-500/10 mb-4">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <span className="text-xs font-bold uppercase tracking-wider text-error bg-red-50 px-2.5 py-1 rounded-full border border-red-200 mb-2">
        Error 403 • Restricted Area
      </span>
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
        Permission Denied
      </h2>
      <p className="text-sm text-slate-500 max-w-md mt-2 mb-4 leading-relaxed">
        You do not have administrative or clinical privileges to access this resource under your current role (<span className="font-semibold text-slate-700 capitalize">{activeRole}</span>). Please consult your department head or system administrator if you believe this is in error.
      </p>

      {attemptedPath && (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-mono mb-6 border border-slate-200">
          <Lock className="w-3.5 h-3.5 text-slate-500" />
          <span>Restricted path: <strong className="text-slate-900">{attemptedPath}</strong></span>
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button variant="secondary" icon={ArrowLeft} onClick={() => navigate(-1)}>
          Go Back
        </Button>
        <Button variant="primary" icon={Home} onClick={() => navigate(getRoleHome())}>
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
}
