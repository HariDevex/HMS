import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import AuthLayout from './AuthLayout';

export default function AccessDenied() {
  const navigate = useNavigate();
  return (
    <AuthLayout sideNote="Access is logged and monitored for compliance.">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 mb-6">
        <ShieldAlert size={24} className="text-error" />
      </div>
      <p className="text-secondary font-semibold text-error">403 · Access denied</p>
      <h1 className="text-2xl font-bold text-ink mt-1">You don't have permission</h1>
      <p className="text-secondary text-ink-secondary mt-2 leading-relaxed">
        Your role does not grant access to this resource. If you believe this is a mistake, contact your
        administrator or request elevated permissions.
      </p>
      <div className="mt-8 flex gap-3">
        <button onClick={() => navigate('/')} className="btn-primary">
          <ArrowLeft size={16} /> Back to dashboard
        </button>
        <button onClick={() => navigate('/settings')} className="btn-secondary">
          Request access
        </button>
      </div>
    </AuthLayout>
  );
}
