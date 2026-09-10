import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Header from './Header';
import Sidebar from './Sidebar';
import GlobalSearchModal from './GlobalSearchModal';
import ToastContainer from '../ui/Toast';
import PatientPortalLayout from './PatientPortalLayout';

export default function Layout() {
  const { currentRole } = useApp();
  const location = useLocation();

  // If active role is patient or on /portal, show PatientPortalLayout
  if (currentRole === 'patient' || location.pathname.startsWith('/portal')) {
    return <PatientPortalLayout />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex antialiased text-slate-800">
      {/* Global Notifications & Modals */}
      <ToastContainer />
      <GlobalSearchModal />

      {/* Enterprise Staff Collapsible Sidebar */}
      <Sidebar />

      {/* Main Staff App Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scrollbar-thin">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
