import {
  LayoutDashboard,
  Users,
  Stethoscope,
  CalendarDays,
  FileText,
  ScanLine,
  Pill,
  ClipboardList,
  History,
  Bell,
  ScrollText,
  Settings,
} from 'lucide-react';

export const navItems = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['admin', 'doctor', 'nurse', 'lab', 'radiology', 'reception'] },
  { label: 'Patients', path: '/patients', icon: Users, roles: ['admin', 'doctor', 'nurse', 'reception'] },
  { label: 'Staff', path: '/staff', icon: Stethoscope, roles: ['admin'] },
  { label: 'Appointments', path: '/appointments', icon: CalendarDays, roles: ['admin', 'doctor', 'nurse', 'reception'] },
  { label: 'Medical Reports', path: '/reports', icon: FileText, roles: ['admin', 'doctor', 'lab', 'radiology'] },
  { label: 'Scans', path: '/scans', icon: ScanLine, roles: ['admin', 'doctor', 'radiology'] },
  { label: 'Prescriptions', path: '/prescriptions', icon: Pill, roles: ['admin', 'doctor'] },
  { label: 'Recommendations', path: '/recommendations', icon: ClipboardList, roles: ['admin', 'doctor'] },
  { label: 'Medical History', path: '/history', icon: History, roles: ['admin', 'doctor', 'nurse'] },
  { label: 'Notifications', path: '/notifications', icon: Bell, roles: ['admin', 'doctor', 'nurse', 'lab', 'radiology', 'reception'], badge: true },
  { label: 'Audit Logs', path: '/audit', icon: ScrollText, roles: ['admin'] },
  { label: 'Settings', path: '/settings', icon: Settings, roles: ['admin', 'doctor', 'nurse', 'lab', 'radiology', 'reception'] },
];

export const getRoleNav = (role) => navItems.filter((i) => i.roles.includes(role));
