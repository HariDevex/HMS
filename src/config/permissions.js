/**
 * Hospital Management System (HMS) — Central Role-Based Access Control (RBAC)
 * Single source of truth for route access allow-lists and fine-grained action rights.
 */

export const ROLE_PERMISSIONS = {
  admin: {
    label: 'System Administrator',
    routes: [
      '/admin',
      '/reports',
      '/patients',
      '/appointments',
      '/wards',
      '/billing',
      '/laboratory',
      '/radiology',
      '/users',
      '/audit-logs',
      '/settings',
    ],
    actions: {
      canManageUsers: true,
      canViewAuditLogs: true,
      canEditSettings: true,
      canPrescribeMedication: false, // Rule fix: Admin has operational authority, not clinical/prescriptive authority
      canOrderLab: false,            // Rule fix: Clinical orders require licensed physician
      canOrderRadiology: false,      // Rule fix: Clinical orders require licensed physician
      canRecordVitals: false,        // Rule fix: Vitals collection is licensed nursing/physician task
      canAdministerMAR: false,       // Rule fix: Medication administration is licensed nursing scope
      canVerifyLab: false,
      canVerifyRadiology: false,
      canRegisterPatient: true,
      canManageBeds: true,
      canRecordPayment: true,
      canViewBilling: true,
      canViewReports: true,
    },
  },

  doctor: {
    label: 'Attending Physician',
    routes: [
      '/doctor',
      '/consultation',
      '/patients',
      '/appointments',
      '/laboratory',
      '/radiology',
      '/wards',
    ],
    actions: {
      canManageUsers: false,
      canViewAuditLogs: false,
      canEditSettings: false,
      canPrescribeMedication: true,
      canOrderLab: true,
      canOrderRadiology: true,
      canRecordVitals: true,
      canAdministerMAR: false,       // Rule fix: Nurses administer prescribed medications
      canVerifyLab: false,           // Certified pathologist/technologist scope
      canVerifyRadiology: false,     // Radiologist specialist scope
      canRegisterPatient: false,
      canManageBeds: false,
      canRecordPayment: false,
      canViewBilling: false,
      canViewReports: false,
    },
  },

  nurse: {
    label: 'Registered Nurse',
    routes: [
      '/nurse',
      '/nurse-workstation',
      '/wards',
      '/patients',
      '/laboratory',
    ],
    actions: {
      canManageUsers: false,
      canViewAuditLogs: false,
      canEditSettings: false,
      canPrescribeMedication: false, // Rule fix: Nurses cannot initiate prescriptive drug orders
      canOrderLab: false,
      canOrderRadiology: false,
      canRecordVitals: true,
      canAdministerMAR: true,
      canVerifyLab: false,
      canVerifyRadiology: false,
      canRegisterPatient: false,
      canManageBeds: true,
      canRecordPayment: false,
      canViewBilling: false,
      canViewReports: false,
    },
  },

  lab: {
    label: 'Laboratory Technologist',
    routes: [
      '/laboratory',
      '/patients',
      '/reports',
    ],
    actions: {
      canManageUsers: false,
      canViewAuditLogs: false,
      canEditSettings: false,
      canPrescribeMedication: false,
      canOrderLab: false,
      canOrderRadiology: false,
      canRecordVitals: false,
      canAdministerMAR: false,
      canVerifyLab: true,
      canVerifyRadiology: false,
      canRegisterPatient: false,
      canManageBeds: false,
      canRecordPayment: false,
      canViewBilling: false,
      canViewReports: true,
    },
  },

  radiology: {
    label: 'Diagnostic Radiologist',
    routes: [
      '/radiology',
      '/patients',
      '/reports',
    ],
    actions: {
      canManageUsers: false,
      canViewAuditLogs: false,
      canEditSettings: false,
      canPrescribeMedication: false,
      canOrderLab: false,
      canOrderRadiology: false,
      canRecordVitals: false,
      canAdministerMAR: false,
      canVerifyLab: false,
      canVerifyRadiology: true,
      canRegisterPatient: false,
      canManageBeds: false,
      canRecordPayment: false,
      canViewBilling: false,
      canViewReports: true,
    },
  },

  reception: {
    label: 'Front Desk Receptionist',
    routes: [
      '/reception',
      '/reception/register',
      '/reception/queue',
      '/appointments',
      '/patients',
      '/billing',
    ],
    actions: {
      canManageUsers: false,
      canViewAuditLogs: false,
      canEditSettings: false,
      canPrescribeMedication: false,
      canOrderLab: false,
      canOrderRadiology: false,
      canRecordVitals: false,
      canAdministerMAR: false,
      canVerifyLab: false,
      canVerifyRadiology: false,
      canRegisterPatient: true,
      canManageBeds: false,
      canRecordPayment: true,
      canViewBilling: true,
      canViewReports: false,
    },
  },

  patient: {
    label: 'Patient Portal User',
    routes: [
      '/portal',
      '/portal/appointments',
      '/portal/records',
      '/portal/prescriptions',
      '/portal/billing',
    ],
    actions: {
      canManageUsers: false,
      canViewAuditLogs: false,
      canEditSettings: false,
      canPrescribeMedication: false,
      canOrderLab: false,
      canOrderRadiology: false,
      canRecordVitals: false,
      canAdministerMAR: false,
      canVerifyLab: false,
      canVerifyRadiology: false,
      canRegisterPatient: false,
      canManageBeds: false,
      canRecordPayment: false,
      canViewBilling: false,
      canViewReports: false,
      canViewOwnRecords: true,
      canPayOwnBills: true,
    },
  },
};

/**
 * Validates if a role is permitted to access a given URL path
 * @param {string} role - The role key (admin, doctor, nurse, lab, radiology, reception, patient)
 * @param {string} pathname - Current or target path
 * @returns {boolean}
 */
export function hasRouteAccess(role, pathname) {
  if (!role) return false;
  const config = ROLE_PERMISSIONS[role];
  if (!config || !config.routes) return false;

  // Normalize path
  const cleanPath = (pathname || '').split('?')[0].replace(/\/+$/, '') || '/';

  // Public/always allowed paths
  if (['/access-denied', '/404'].includes(cleanPath)) return true;

  // Patient role is strictly fenced to /portal/*
  if (role === 'patient') {
    return cleanPath === '/portal' || cleanPath.startsWith('/portal/');
  }

  // Non-patient roles attempting to access /portal are blocked
  if (cleanPath === '/portal' || cleanPath.startsWith('/portal/')) {
    return false;
  }

  // Check allow-list
  return config.routes.some((allowedPrefix) => {
    if (allowedPrefix === cleanPath) return true;
    // Prefix match for nested routes like /patients/:id or /reception/register
    return cleanPath.startsWith(allowedPrefix + '/');
  });
}

/**
 * Checks fine-grained permission for a role
 * @param {string} role - The role key
 * @param {string} actionName - Name of the action boolean
 * @returns {boolean}
 */
export function can(role, actionName) {
  if (!role || !actionName) return false;
  return Boolean(ROLE_PERMISSIONS[role]?.actions?.[actionName]);
}

export default {
  ROLE_PERMISSIONS,
  hasRouteAccess,
  can,
};
