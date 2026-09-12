import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Bell,
  Menu,
  ChevronDown,
  Shield,
  AlertCircle,
  Clock,
  LogOut,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Header() {
  const {
    currentRole,
    currentUser,
    switchRole,
    logout,
    roles,
    setGlobalSearchOpen,
    mobileMenuOpen,
    setMobileMenuOpen,
  } = useApp();
  const navigate = useNavigate();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const location = useLocation();

  // Determine current page title from pathname
  const path = location.pathname;
  let pageTitle = 'Dashboard';
  let breadcrumb = 'HMS';

  if (path.startsWith('/patients')) {
    pageTitle = 'Patient Registry & Clinical Records';
    breadcrumb = 'Clinical / Patients';
  } else if (path.startsWith('/appointments')) {
    pageTitle = 'Appointments & Outpatient Queue';
    breadcrumb = 'Operations / Appointments';
  } else if (path.startsWith('/laboratory')) {
    pageTitle = 'Clinical Pathology & Laboratory Worklist';
    breadcrumb = 'Diagnostics / Lab';
  } else if (path.startsWith('/radiology')) {
    pageTitle = 'Radiology & Medical Imaging';
    breadcrumb = 'Diagnostics / Radiology';
  } else if (path.startsWith('/wards')) {
    pageTitle = 'Ward Inpatient & Bed Management';
    breadcrumb = 'Inpatient / Wards';
  } else if (path.startsWith('/billing')) {
    pageTitle = 'Billing, Claims & Revenue Cycle';
    breadcrumb = 'Finance / Billing';
  } else if (path.startsWith('/reports')) {
    pageTitle = 'Hospital Analytics & Operational Reports';
    breadcrumb = 'Analytics / Reports';
  } else if (path.startsWith('/users')) {
    pageTitle = 'Staff & User Access Management';
    breadcrumb = 'Administration / Users';
  } else if (path.startsWith('/audit-logs')) {
    pageTitle = 'System Audit Trail & Security Logs';
    breadcrumb = 'Administration / Audit Logs';
  } else if (path.startsWith('/settings')) {
    pageTitle = 'Hospital Facility Settings';
    breadcrumb = 'System / Settings';
  } else if (path.startsWith('/consultation')) {
    pageTitle = 'Clinical Consultation & E-Prescribing';
    breadcrumb = 'Clinical / Consultation';
  } else if (path.startsWith('/nurse-workstation')) {
    pageTitle = 'Nursing Station & Inpatient MAR';
    breadcrumb = 'Inpatient / Nursing';
  }

  // Critical notification items
  const recentAlerts = [
    { id: 1, title: 'Critical Troponin I Alert', desc: 'James Wilson (ICU-04) - 0.142 ng/mL', time: '10m ago', urgent: true },
    { id: 2, title: 'Penicillin Allergy Warning', desc: 'Verify MAR before administering IV fluids', time: '30m ago', urgent: true },
    { id: 3, title: 'ICU Capacity Warning', desc: 'ICU is at 83% occupancy (10/12 beds occupied)', time: '1h ago', urgent: false },
  ];

  return (
    <header className="h-16 shrink-0 bg-white border-b border-slate-200/80 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 shadow-xs">
      {/* Left: Mobile Hamburger + Breadcrumb / Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <span>{breadcrumb}</span>
          </div>
          <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-tight">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Middle: Prominent Global Search Bar */}
      <div className="hidden md:flex items-center justify-center flex-1 max-w-md mx-4">
        <div
          onClick={() => setGlobalSearchOpen(true)}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-xl text-slate-400 text-xs sm:text-sm cursor-pointer transition-colors shadow-xs group"
        >
          <Search className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
          <span className="truncate">Search patients, staff, appointments, reports…</span>
          <span className="ml-auto hidden xl:inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-2xs">
            ⌘K
          </span>
        </div>
      </div>

      {/* Right: Role Switcher, Notifications, User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Search Icon */}
        <button
          type="button"
          onClick={() => setGlobalSearchOpen(true)}
          className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Live Role Switcher (Gated to Development Only) */}
        {import.meta.env.DEV ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-blue-50/80 border border-blue-200 text-primary hover:bg-blue-100/70 transition-colors text-xs font-semibold cursor-pointer shadow-xs"
              title="Dev Persona Switcher"
            >
              <Shield className="w-3.5 h-3.5 text-primary" />
              <span className="hidden sm:inline">Role:</span>
              <span className="font-bold">{currentUser.role}</span>
              <span className="text-[10px] uppercase font-mono px-1 py-0.2 bg-blue-200/60 rounded text-blue-900 ml-0.5">DEV</span>
              <ChevronDown className="w-3.5 h-3.5 text-primary/70" />
            </button>

            {roleDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setRoleDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-slide-up">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 flex items-center justify-between">
                    <span>Switch Persona / Role</span>
                    <span className="text-[9px] text-amber-600 bg-amber-50 px-1 py-0.5 rounded font-mono">Dev Only</span>
                  </div>
                  <div className="py-1">
                    {roles.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => {
                          switchRole(r.id);
                          setRoleDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-50 transition-colors text-xs cursor-pointer ${
                          currentRole === r.id ? 'bg-blue-50/60 font-bold text-primary' : 'text-slate-700'
                        }`}
                      >
                        <div>
                          <div className="font-medium">{r.role}</div>
                          <div className="text-[11px] text-slate-400">{r.name}</div>
                        </div>
                        {currentRole === r.id && (
                          <span className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200/80 text-slate-700 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-400 font-normal">Acting as:</span>
            <span className="font-bold text-slate-900">{currentUser.role}</span>
          </div>
        )}

        {/* Notifications Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-error rounded-full ring-2 ring-white animate-pulse" />
          </button>

          {notificationsOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setNotificationsOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-slide-up">
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Alerts & Notifications</span>
                    <span className="bg-red-100 text-error text-[10px] font-bold px-1.5 py-0.2 rounded-full">3 STAT</span>
                  </div>
                  <button
                    onClick={() => setNotificationsOpen(false)}
                    className="text-[11px] text-primary hover:underline font-medium"
                  >
                    Mark read
                  </button>
                </div>
                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto scrollbar-thin">
                  {recentAlerts.map((a) => (
                    <div key={a.id} className="p-3.5 hover:bg-slate-50 transition-colors cursor-pointer">
                      <div className="flex items-start gap-2.5">
                        <AlertCircle className={`w-4 h-4 shrink-0 mt-0.5 ${a.urgent ? 'text-error' : 'text-amber-500'}`} />
                        <div>
                          <p className="text-xs font-bold text-slate-900 leading-snug">{a.title}</p>
                          <p className="text-xs text-slate-600 mt-0.5">{a.desc}</p>
                          <span className="text-[10px] text-slate-400 mt-1 inline-block flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {a.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 text-center">
                  <Link
                    to="/audit-logs"
                    onClick={() => setNotificationsOpen(false)}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    View Complete Audit Log & Activity Stream →
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Profile Pill */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-100"
          />
          <div className="hidden xl:block text-left">
            <div className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[120px]">
              {currentUser.name}
            </div>
            <div className="text-[10px] text-slate-500 truncate max-w-[120px]">
              {currentUser.department}
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/login', { replace: true });
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
