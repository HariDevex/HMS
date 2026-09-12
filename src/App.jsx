import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useApp } from './context/AppContext';
import { hasRouteAccess } from './config/permissions';
import { PageSkeleton } from './components/ui/LoadingState';

// Route Guard Component
function RequireRole({ children, path }) {
  const { currentRole } = useApp();
  const location = useLocation();
  const targetPath = path || location.pathname;

  if (!hasRouteAccess(currentRole, targetPath)) {
    return <Navigate to="/access-denied" replace state={{ attemptedPath: targetPath, currentRole }} />;
  }

  return children;
}

// Authentication Guard
function RequireAuth({ children }) {
  const { isAuthenticated } = useApp();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

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

        {/* Main App Layout (Protected — requires login) */}
        <Route path="/" element={<RequireAuth><Layout /></RequireAuth>}>
          {/* Role Default Redirect */}
          <Route index element={<Navigate to={getRoleDefaultPath()} replace />} />

          {/* Administrator Routes */}
          <Route path="admin" element={<RequireRole path="/admin"><AdminDashboard /></RequireRole>} />
          <Route path="users" element={<RequireRole path="/users"><UserManagement /></RequireRole>} />
          <Route path="audit-logs" element={<RequireRole path="/audit-logs"><AuditLogs /></RequireRole>} />
          <Route path="settings" element={<RequireRole path="/settings"><Settings /></RequireRole>} />

          {/* Doctor Routes */}
          <Route path="doctor" element={<RequireRole path="/doctor"><DoctorDashboard /></RequireRole>} />
          <Route path="consultation" element={<RequireRole path="/consultation"><ConsultationView /></RequireRole>} />

          {/* Nurse Routes */}
          <Route path="nurse" element={<RequireRole path="/nurse"><NurseDashboard /></RequireRole>} />
          <Route path="nurse-workstation" element={<RequireRole path="/nurse-workstation"><NurseWorkstation /></RequireRole>} />

          {/* Laboratory Routes */}
          <Route path="laboratory" element={<RequireRole path="/laboratory"><LabDashboard /></RequireRole>} />

          {/* Radiology Routes */}
          <Route path="radiology" element={<RequireRole path="/radiology"><RadiologyDashboard /></RequireRole>} />

          {/* Reception Routes */}
          <Route path="reception" element={<RequireRole path="/reception"><ReceptionDashboard /></RequireRole>} />
          <Route path="reception/register" element={<RequireRole path="/reception/register"><PatientRegistration /></RequireRole>} />
          <Route path="reception/queue" element={<RequireRole path="/reception/queue"><QueueManagement /></RequireRole>} />

          {/* Patients Central Profile */}
          <Route path="patients" element={<RequireRole path="/patients"><PatientList /></RequireRole>} />
          <Route path="patients/:id" element={<RequireRole><PatientProfile /></RequireRole>} />

          {/* Operational Modules */}
          <Route path="appointments" element={<RequireRole path="/appointments"><AppointmentsList /></RequireRole>} />
          <Route path="wards" element={<RequireRole path="/wards"><WardManagement /></RequireRole>} />
          <Route path="billing" element={<RequireRole path="/billing"><BillingDashboard /></RequireRole>} />
          <Route path="reports" element={<RequireRole path="/reports"><ReportsDashboard /></RequireRole>} />

          {/* Patient Portal Routes */}
          <Route path="portal" element={<RequireRole path="/portal"><PatientPortalHome /></RequireRole>} />
          <Route path="portal/appointments" element={<RequireRole path="/portal/appointments"><PatientAppointments /></RequireRole>} />
          <Route path="portal/records" element={<RequireRole path="/portal/records"><PatientRecords /></RequireRole>} />
          <Route path="portal/prescriptions" element={<RequireRole path="/portal/prescriptions"><PatientPrescriptions /></RequireRole>} />
          <Route path="portal/billing" element={<RequireRole path="/portal/billing"><PatientBilling /></RequireRole>} />
        </Route>

        {/* Catch-all 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
