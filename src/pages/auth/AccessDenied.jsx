import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import AuthLayout from './AuthLayout';

export default function AccessDenied() {
  const navigate = useNavigate();
  return (
    <AuthLayout sideNote="Access is logged and monitored for compliance.">
      <div className="hdx_flex hdx_h-12 hdx_w-12 hdx_items-center hdx_justify-center hdx_rounded-xl hdx_bg-red-50 hdx_mb-6">
        <ShieldAlert size={24} className="hdx_text-error" />
      </div>
      <p className="hdx_text-secondary-text hdx_font-semibold hdx_text-error">403 · Access denied</p>
      <h1 className="hdx_text-2xl hdx_font-bold hdx_text-ink hdx_mt-1">You don't have permission</h1>
      <p className="hdx_text-secondary-text hdx_text-ink-secondary hdx_mt-2 hdx_leading-relaxed">
        Your role does not grant access to this resource. If you believe this is a mistake, contact your
        administrator or request elevated permissions.
      </p>
      <div className="hdx_mt-8 hdx_flex hdx_gap-3">
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
