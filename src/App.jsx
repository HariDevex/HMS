import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import TwoFactor from './pages/auth/TwoFactor';
import AccessDenied from './pages/auth/AccessDenied';
import SessionManagement from './pages/auth/SessionManagement';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import PatientProfile from './pages/PatientProfile';
import Staff from './pages/Staff';
import Appointments from './pages/Appointments';
import Reports from './pages/Reports';
import Scans from './pages/Scans';
import Prescriptions from './pages/Prescriptions';
import Recommendations from './pages/Recommendations';
import History from './pages/History';
import Notifications from './pages/Notifications';
import AuditLogs from './pages/AuditLogs';
import Settings from './pages/Settings';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/2fa" element={<TwoFactor />} />
      <Route path="/access-denied" element={<AccessDenied />} />
      <Route path="/session" element={<SessionManagement />} />

      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/patients/:id" element={<PatientProfile />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/scans" element={<Scans />} />
        <Route path="/prescriptions" element={<Prescriptions />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/history" element={<History />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/audit" element={<AuditLogs />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
