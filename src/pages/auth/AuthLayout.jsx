import Logo from '../../components/Logo';
import { ShieldCheck, Lock, FileCheck, Activity } from 'lucide-react';

export default function AuthLayout({ children, sideNote }) {
  return (
    <div className="min-h-screen flex bg-white">
      <div className="hidden lg:flex w-[45%] bg-navy relative flex-col justify-between p-10 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06] pattern" aria-hidden="true" />
        <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full bg-primary/20 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-32 -left-16 w-96 h-96 rounded-full bg-info/10 blur-3xl" aria-hidden="true" />
        <div className="relative">
          <Logo light size="lg" />
        </div>
        <div className="relative">
          <h2 className="text-3xl font-bold text-white leading-snug">
            Secure hospital management
            <br />
            for modern care teams.
          </h2>
          <p className="mt-4 text-secondary text-slate-300 max-w-md">
            Manage patients, staff, appointments, records and clinical workflows from one trusted, HIPAA-compliant platform.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 max-w-md">
            {[
              { icon: ShieldCheck, label: 'Role-based access' },
              { icon: Lock, label: 'Encrypted records' },
              { icon: FileCheck, label: 'Audit compliance' },
              { icon: Activity, label: 'Real-time insights' },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-card px-3.5 py-3">
                <f.icon size={17} className="text-blue-300 shrink-0" />
                <span className="text-small font-medium text-slate-200">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-small text-slate-400">{sideNote}</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-5 py-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo size="lg" />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
