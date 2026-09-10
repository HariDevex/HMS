import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FlaskConical,
  Scan,
  BedDouble,
  ReceiptText,
  BarChart3,
  UserCog,
  FileClock,
  Settings,
  Stethoscope,
  HeartPulse,
  UserPlus,
  ListOrdered,
  ChevronLeft,
  ChevronRight,
  Hospital,
  } from 'lucide-react';

export default function Sidebar() {
  const { currentRole, sidebarCollapsed, setSidebarCollapsed, mobileMenuOpen, setMobileMenuOpen } = useApp();

  // Role-specific navigation definitions
  const getNavSections = () => {
    switch (currentRole) {
      case 'doctor':
        return [
          {
            title: 'Clinical Practice',
            items: [
              { to: '/doctor', label: 'Doctor Dashboard', icon: LayoutDashboard },
              { to: '/consultation', label: 'Active Consultation', icon: Stethoscope },
              { to: '/patients', label: 'Patient Records', icon: Users },
              { to: '/appointments', label: 'Appointments Queue', icon: Calendar },
            ],
          },
          {
            title: 'Orders & Diagnostics',
            items: [
              { to: '/laboratory', label: 'Lab Orders & Results', icon: FlaskConical },
              { to: '/radiology', label: 'Radiology Imaging', icon: Scan },
              { to: '/wards', label: 'Inpatient Beds', icon: BedDouble },
            ],
          },
        ];

      case 'nurse':
        return [
          {
            title: 'Nursing Care',
            items: [
              { to: '/nurse', label: 'Nurse Dashboard', icon: LayoutDashboard },
              { to: '/nurse-workstation', label: 'Vitals & MAR Queue', icon: HeartPulse },
              { to: '/wards', label: 'Assigned Wards & Beds', icon: BedDouble },
              { to: '/patients', label: 'Inpatients Directory', icon: Users },
            ],
          },
          {
            title: 'Diagnostic Support',
            items: [
              { to: '/laboratory', label: 'Sample Collection', icon: FlaskConical },
            ],
          },
        ];

      case 'lab':
        return [
          {
            title: 'Pathology & Lab',
            items: [
              { to: '/laboratory', label: 'Lab Work Queue', icon: FlaskConical },
              { to: '/patients', label: 'Patient Directory', icon: Users },
              { to: '/reports', label: 'Lab Analytics', icon: BarChart3 },
            ],
          },
        ];

      case 'radiology':
        return [
          {
            title: 'Imaging Department',
            items: [
              { to: '/radiology', label: 'Radiology Worklist', icon: Scan },
              { to: '/patients', label: 'Patient Directory', icon: Users },
              { to: '/reports', label: 'Modality Reports', icon: BarChart3 },
            ],
          },
        ];

      case 'reception':
        return [
          {
            title: 'Front Desk & Reception',
            items: [
              { to: '/reception', label: 'Reception Dashboard', icon: LayoutDashboard },
              { to: '/reception/register', label: 'Patient Registration', icon: UserPlus },
              { to: '/reception/queue', label: 'Live Queue Board', icon: ListOrdered },
              { to: '/appointments', label: 'Appointments Book', icon: Calendar },
              { to: '/patients', label: 'Search Patients', icon: Users },
              { to: '/billing', label: 'Cashier & Billing', icon: ReceiptText },
            ],
          },
        ];

      case 'admin':
      default:
        return [
          {
            title: 'Executive Overview',
            items: [
              { to: '/admin', label: 'Hospital Dashboard', icon: LayoutDashboard },
              { to: '/reports', label: 'Analytics & Reports', icon: BarChart3 },
            ],
          },
          {
            title: 'Clinical Operations',
            items: [
              { to: '/patients', label: 'Patients Directory', icon: Users },
              { to: '/appointments', label: 'Appointments & Queue', icon: Calendar },
              { to: '/wards', label: 'Ward & Bed Management', icon: BedDouble },
              { to: '/billing', label: 'Billing & Invoicing', icon: ReceiptText },
            ],
          },
          {
            title: 'Diagnostic Departments',
            items: [
              { to: '/laboratory', label: 'Laboratory Worklist', icon: FlaskConical },
              { to: '/radiology', label: 'Radiology Department', icon: Scan },
            ],
          },
          {
            title: 'System & Governance',
            items: [
              { to: '/users', label: 'Staff & Roles', icon: UserCog },
              { to: '/audit-logs', label: 'Audit Trail & Security', icon: FileClock },
              { to: '/settings', label: 'Hospital Settings', icon: Settings },
            ],
          },
        ];
    }
  };

  const navSections = getNavSections();

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 flex flex-col bg-slate-900 text-slate-300 transition-all duration-200 ease-in-out border-r border-slate-800 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        } ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Hospital Branding Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 shrink-0 bg-slate-950/40">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-black tracking-tighter shrink-0 shadow-sm shadow-blue-500/20">
              <Hospital className="w-5 h-5" />
            </div>
            {!sidebarCollapsed && (
              <div className="truncate">
                <h2 className="text-sm font-bold text-white tracking-wide leading-tight">
                  MediCore <span className="text-primary font-normal">HMS</span>
                </h2>
                <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                  Enterprise Health
                </p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 items-center justify-center transition-colors"
            title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {!sidebarCollapsed && (
                <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  {section.title}
                </p>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group ${
                        isActive
                          ? 'bg-primary text-white shadow-sm shadow-primary/30'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
                      } ${sidebarCollapsed ? 'justify-center px-0' : ''}`
                    }
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-105" />
                    {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>

        {/* Inpatient Emergency Indicator & Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40 shrink-0">
          {!sidebarCollapsed ? (
            <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[11px] font-medium text-slate-300">System Online</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">v2.4 Pro</span>
            </div>
          ) : (
            <div className="flex justify-center py-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" title="System Operational" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
