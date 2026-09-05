import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Toaster from '../ui/Toast';

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="hdx_flex hdx_min-h-screen hdx_bg-surface">
      <Sidebar />
      {mobileOpen && <Sidebar mobile onClose={() => setMobileOpen(false)} />}
      <div className="hdx_flex-1 hdx_flex hdx_flex-col hdx_min-w-0">
        <Topbar onMenu={() => setMobileOpen(true)} />
        <main className="hdx_flex-1 hdx_p-4 hdx_sm_p-6 hdx_lg_p-8 hdx_max-w-1440px hdx_w-full hdx_mx-auto">
          <Outlet />
        </main>
        <footer className="hdx_px-6 hdx_py-4 hdx_text-small hdx_text-ink-secondary hdx_border-t hdx_border-line hdx_bg-white">
          © 2026 MediCore Hospital Management System · Secure · HIPAA Compliant
        </footer>
      </div>
      <Toaster />
    </div>
  );
}
