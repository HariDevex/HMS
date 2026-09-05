import Logo from '../../components/Logo';
import { ShieldCheck, Lock, FileCheck, Activity } from 'lucide-react';

export default function AuthLayout({ children, sideNote }) {
  return (
    <div className="hdx_min-h-screen hdx_flex hdx_bg-white">
      <div className="hdx_hidden hdx_lg_flex hdx_w-45pct hdx_bg-navy hdx_relative hdx_flex-col hdx_justify-between hdx_p-10 hdx_overflow-hidden">
        <div className="hdx_absolute hdx_inset-0 hdx_opacity-6 pattern" aria-hidden="true" />
        <div className="hdx_absolute hdx_-right-24 hdx_-top-24 hdx_w-80 hdx_h-80 hdx_rounded-full hdx_bg-primary-20 hdx_blur-3xl" aria-hidden="true" />
        <div className="hdx_absolute hdx_-bottom-32 hdx_-left-16 hdx_w-96 hdx_h-96 hdx_rounded-full hdx_bg-info-10 hdx_blur-3xl" aria-hidden="true" />
        <div className="hdx_relative">
          <Logo light size="lg" />
        </div>
        <div className="hdx_relative">
          <h2 className="hdx_text-3xl hdx_font-bold hdx_text-white hdx_leading-snug">
            Secure hospital management
            <br />
            for modern care teams.
          </h2>
          <p className="hdx_mt-4 hdx_text-secondary-text hdx_text-slate-300 hdx_max-w-md">
            Manage patients, staff, appointments, records and clinical workflows from one trusted, HIPAA-compliant platform.
          </p>
          <div className="hdx_mt-8 hdx_grid hdx_grid-cols-2 hdx_gap-3 hdx_max-w-md">
            {[
              { icon: ShieldCheck, label: 'Role-based access' },
              { icon: Lock, label: 'Encrypted records' },
              { icon: FileCheck, label: 'Audit compliance' },
              { icon: Activity, label: 'Real-time insights' },
            ].map((f) => (
              <div key={f.label} className="hdx_flex hdx_items-center hdx_gap-2.5 hdx_bg-white-5 hdx_border hdx_border-white-10 hdx_rounded-card hdx_px-3.5 hdx_py-3">
                <f.icon size={17} className="hdx_text-blue-300 hdx_shrink-0" />
                <span className="hdx_text-small hdx_font-medium hdx_text-slate-200">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="hdx_relative hdx_text-small hdx_text-slate-400">{sideNote}</p>
      </div>

      <div className="hdx_flex-1 hdx_flex hdx_flex-col hdx_items-center hdx_justify-center hdx_px-5 hdx_py-10">
        <div className="hdx_w-full hdx_max-w-md">
          <div className="hdx_lg_hidden hdx_mb-8 hdx_flex hdx_justify-center">
            <Logo size="lg" />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
