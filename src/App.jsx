import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext';

// Layout
import Layout from './components/layout/Layout';

// Auth Pages
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import TwoFactor from './pages/auth/TwoFactor';
import AccessDenied from './pages/auth/AccessDenied';
import NotFound from './pages/NotFound';

// Administrator Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import AuditLogs from './pages/admin/AuditLogs';
import Settings from './pages/admin/Settings';

// Doctor Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import ConsultationView from './pages/doctor/ConsultationView';

// Nurse Pages
import NurseDashboard from './pages/nurse/NurseDashboard';
import NurseWorkstation from './pages/nurse/NurseWorkstation';

// Lab Pages
import LabDashboard from './pages/lab/LabDashboard';

// Radiology Pages
import RadiologyDashboard from './pages/radiology/RadiologyDashboard';

// Reception Pages
import ReceptionDashboard from './pages/reception/ReceptionDashboard';
import PatientRegistration from './pages/reception/PatientRegistration';
import QueueManagement from './pages/reception/QueueManagement';

// Patient Profile & Records
import PatientList from './pages/patients/PatientList';
import PatientProfile from './pages/patients/PatientProfile';

// Operational Modules
import AppointmentsList from './pages/appointments/AppointmentsList';
import WardManagement from './pages/wards/WardManagement';
import BillingDashboard from './pages/billing/BillingDashboard';
import ReportsDashboard from './pages/reports/ReportsDashboard';

// Patient Portal Pages
import PatientPortalHome from './pages/portal/PatientPortalHome';
import PatientAppointments from './pages/portal/PatientAppointments';
import PatientRecords from './pages/portal/PatientRecords';
import PatientPrescriptions from './pages/portal/PatientPrescriptions';
import PatientBilling from './pages/portal/PatientBilling';

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
  );
}
