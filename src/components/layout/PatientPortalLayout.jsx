import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Heart,
  Calendar,
  FileText,
  Pill,
  CreditCard,
  Shield,
  PhoneCall,
  ChevronDown,
  Hospital,
} from 'lucide-react';
import ToastContainer from '../ui/Toast';

export default function PatientPortalLayout() {
  const { currentRole, switchRole, roles, currentUser } = useApp();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const patientNav = [
    { to: '/portal', end: true, label: 'My Health', icon: Heart },
    { to: '/portal/appointments', label: 'Appointments', icon: Calendar },
    { to: '/portal/records', label: 'Test Results', icon: FileText },
    { to: '/portal/prescriptions', label: 'Prescriptions', icon: Pill },
    { to: '/portal/billing', label: 'Bills & Pay', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased text-slate-800">
      <ToastContainer />

      {/* Top Patient Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center font-bold shadow-xs">
              <Hospital className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-none">
                MediCore <span className="text-primary font-medium">Patient Portal</span>
              </h1>
              <p className="text-[11px] text-slate-500 mt-0.5">Welcome, {currentUser.name}</p>
            </div>
          </div>

          {/* Quick Staff Switcher for demo & Emergency Help */}
          <div className="flex items-center gap-2">
            <a
              href="tel:911"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200 hover:bg-red-100 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-red-600" />
              <span>Emergency 911</span>
            </a>

            <div className="relative">
              <button
                type="button"
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-primary" />
                <span className="hidden sm:inline">Role:</span> Patient
                <ChevronDown className="w-3 h-3" />
              </button>

              {roleMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setRoleMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs animate-slide-up">
                    <div className="px-3 py-1 font-bold text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-100">
                      Switch Persona
                    </div>
                    {roles.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => {
                          switchRole(r.id);
                          setRoleMenuOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-50 ${
                          currentRole === r.id ? 'font-bold text-primary bg-blue-50' : 'text-slate-700'
                        }`}
                      >
                        <span>{r.role} ({r.name})</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Patient Content Area */}
      <main className="grow max-w-4xl w-full mx-auto p-4 pb-24 sm:p-6 sm:pb-12">
        <Outlet />
      </main>

      {/* Bottom Sticky Navigation for Mobile Users */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 shadow-lg px-2 py-1.5">
        <div className="max-w-md mx-auto flex items-center justify-around">
          {patientNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-semibold transition-colors ${
                    isActive ? 'text-primary font-bold' : 'text-slate-500 hover:text-slate-900'
                  }`
                }
              >
                <Icon className="w-5 h-5 mb-0.5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
