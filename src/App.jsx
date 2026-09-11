import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext';
import { PageSkeleton } from './components/ui/LoadingState';

// Layout
import Layout from './components/layout/Layout';

// Auth Pages (lazy loaded)
const Login = lazy(() => import('./pages/auth/Login'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const TwoFactor = lazy(() => import('./pages/auth/TwoFactor'));
const AccessDenied = lazy(() => import('./pages/auth/AccessDenied'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Administrator Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const UserManagement = lazy(() => import('./pages/admin/UserManagement'));
const AuditLogs = lazy(() => import('./pages/admin/AuditLogs'));
const Settings = lazy(() => import('./pages/admin/Settings'));

// Doctor Pages
const DoctorDashboard = lazy(() => import('./pages/doctor/DoctorDashboard'));
const ConsultationView = lazy(() => import('./pages/doctor/ConsultationView'));

// Nurse Pages
const NurseDashboard = lazy(() => import('./pages/nurse/NurseDashboard'));
const NurseWorkstation = lazy(() => import('./pages/nurse/NurseWorkstation'));

// Lab Pages
const LabDashboard = lazy(() => import('./pages/lab/LabDashboard'));

// Radiology Pages
const RadiologyDashboard = lazy(() => import('./pages/radiology/RadiologyDashboard'));

// Reception Pages
const ReceptionDashboard = lazy(() => import('./pages/reception/ReceptionDashboard'));
const PatientRegistration = lazy(() => import('./pages/reception/PatientRegistration'));
const QueueManagement = lazy(() => import('./pages/reception/QueueManagement'));

// Patient Profile & Records
const PatientList = lazy(() => import('./pages/patients/PatientList'));
const PatientProfile = lazy(() => import('./pages/patients/PatientProfile'));

// Operational Modules
const AppointmentsList = lazy(() => import('./pages/appointments/AppointmentsList'));
const WardManagement = lazy(() => import('./pages/wards/WardManagement'));
const BillingDashboard = lazy(() => import('./pages/billing/BillingDashboard'));
const ReportsDashboard = lazy(() => import('./pages/reports/ReportsDashboard'));

// Patient Portal Pages
const PatientPortalHome = lazy(() => import('./pages/portal/PatientPortalHome'));
const PatientAppointments = lazy(() => import('./pages/portal/PatientAppointments'));
const PatientRecords = lazy(() => import('./pages/portal/PatientRecords'));
const PatientPrescriptions = lazy(() => import('./pages/portal/PatientPrescriptions'));
const PatientBilling = lazy(() => import('./pages/portal/PatientBilling'));

export default function App() {
  const { currentRole } = useApp();

  const getRoleDefaultPath = () => {
    switch (currentRole) {
      case 'doctor': return '/doctor';
      case 'nurse': return '/nurse';
      case 'lab': return '/laboratory';
      case 'radiology': return '/radiology';
      case 'reception': return '/reception';
      case 'patient': return '/portal';
      case 'admin':
      default:
        return '/admin';
    }
  };

  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/2fa" element={<TwoFactor />} />
        <Route path="/access-denied" element={<AccessDenied />} />

        {/* Main App Layout */}
        <Route path="/" element={<Layout />}>
          {/* Role Default Redirect */}
          <Route index element={<Navigate to={getRoleDefaultPath()} replace />} />

          {/* Administrator Routes */}
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="settings" element={<Settings />} />

          {/* Doctor Routes */}
          <Route path="doctor" element={<DoctorDashboard />} />
          <Route path="consultation" element={<ConsultationView />} />

          {/* Nurse Routes */}
          <Route path="nurse" element={<NurseDashboard />} />
          <Route path="nurse-workstation" element={<NurseWorkstation />} />

          {/* Laboratory Routes */}
          <Route path="laboratory" element={<LabDashboard />} />

          {/* Radiology Routes */}
          <Route path="radiology" element={<RadiologyDashboard />} />

          {/* Reception Routes */}
          <Route path="reception" element={<ReceptionDashboard />} />
          <Route path="reception/register" element={<PatientRegistration />} />
          <Route path="reception/queue" element={<QueueManagement />} />

          {/* Patients Central Profile */}
          <Route path="patients" element={<PatientList />} />
          <Route path="patients/:id" element={<PatientProfile />} />

          {/* Operational Modules */}
          <Route path="appointments" element={<AppointmentsList />} />
          <Route path="wards" element={<WardManagement />} />
          <Route path="billing" element={<BillingDashboard />} />
          <Route path="reports" element={<ReportsDashboard />} />

          {/* Patient Portal Routes */}
          <Route path="portal" element={<PatientPortalHome />} />
          <Route path="portal/appointments" element={<PatientAppointments />} />
          <Route path="portal/records" element={<PatientRecords />} />
          <Route path="portal/prescriptions" element={<PatientPrescriptions />} />
          <Route path="portal/billing" element={<PatientBilling />} />
        </Route>

        {/* Catch-all 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
