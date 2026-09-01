import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Toaster from '../ui/Toast';

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      {mobileOpen && <Sidebar mobile onClose={() => setMobileOpen(false)} />}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenu={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto">
          <Outlet />
        </main>
        <footer className="px-6 py-4 text-small text-ink-secondary border-t border-line bg-white">
          © 2026 MediCore Hospital Management System · Secure · HIPAA Compliant
        </footer>
      </div>
      <Toaster />
    </div>
  );
}
