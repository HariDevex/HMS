import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  DEMO_ROLES,
  INITIAL_PATIENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_LAB_ORDERS,
  INITIAL_RADIOLOGY_ORDERS,
  INITIAL_MEDICATIONS,
  INITIAL_NURSING_TASKS,
  INITIAL_WARDS,
  INITIAL_INVOICES,
  INITIAL_AUDIT_LOGS,
  INITIAL_CLINICAL_TIMELINE,
  INITIAL_USERS,
  HOSPITAL_METRICS,
} from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Role & Authentication State
  const [currentRole, setCurrentRole] = useState('admin');
  const [currentUser, setCurrentUser] = useState(DEMO_ROLES[0]);
  
  // Clinical & Administrative State
  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  const [selectedPatientId, setSelectedPatientId] = useState('P-1001');
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
  const [labOrders, setLabOrders] = useState(INITIAL_LAB_ORDERS);
  const [radiologyOrders, setRadiologyOrders] = useState(INITIAL_RADIOLOGY_ORDERS);
  const [medications, setMedications] = useState(INITIAL_MEDICATIONS);
  const [nursingTasks, setNursingTasks] = useState(INITIAL_NURSING_TASKS);
  const [wards, setWards] = useState(INITIAL_WARDS);
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);
  const [clinicalTimeline, setClinicalTimeline] = useState(INITIAL_CLINICAL_TIMELINE);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [metrics, setMetrics] = useState(HOSPITAL_METRICS);

  // Global UI State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [activeModal, setActiveModal] = useState(null); // { type: string, data?: any }

  // Sync currentUser whenever currentRole changes
  useEffect(() => {
    const found = DEMO_ROLES.find(r => r.id === currentRole) || DEMO_ROLES[0];
    setCurrentUser(found);
  }, [currentRole]);

  // Active Patient Object
  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  // Toast System
  const addToast = ({ title, message, type = 'info', duration = 4000 }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 7);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Add an Audit Log entry automatically
  const logAuditAction = (action, details, severity = 'Info', patientName = 'System') => {
    const newLog = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      user: currentUser.name,
      role: currentUser.role,
      action,
      patient: patientName,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      ipAddress: '10.240.12.' + Math.floor(Math.random() * 80 + 10),
      severity,
      details,
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Switch Role
  const switchRole = (roleId) => {
    setCurrentRole(roleId);
    const target = DEMO_ROLES.find(r => r.id === roleId);
    if (target) {
      setCurrentUser(target);
      addToast({
        title: `Switched Persona: ${target.role}`,
        message: `Now viewing MediCore HMS as ${target.name} (${target.department})`,
        type: 'info',
      });
    }
  };

  // Actions for Patients
  const registerPatient = (patientData) => {
    const newId = `P-${1000 + patients.length + 1}`;
    const newMrn = `MRN-${Math.floor(10000 + Math.random() * 90000)}`;
    const newPatient = {
      ...patientData,
      id: newId,
      mrn: newMrn,
      admissionDate: patientData.status === 'Admitted' ? new Date().toISOString().replace('T', ' ').slice(0, 16) : null,
    };
    setPatients(prev => [newPatient, ...prev]);
    setSelectedPatientId(newId);
    logAuditAction('New Patient Registered', `Registered ${newPatient.name} with ${newMrn}`, 'Success', newPatient.name);
    addToast({
      title: 'Patient Registered',
      message: `${newPatient.name} successfully registered with ${newMrn}.`,
      type: 'success',
    });
    return newPatient;
  };

  // Actions for Appointments
  const bookAppointment = (appointmentData) => {
    const token = `A-${(appointments.length + 1).toString().padStart(2, '0')}`;
    const newApt = {
      ...appointmentData,
      id: `APT-${appointments.length + 201}`,
      tokenNumber: token,
      status: 'Scheduled',
      waitingTime: '-',
    };
    setAppointments(prev => [newApt, ...prev]);
    logAuditAction('Appointment Scheduled', `Booked ${newApt.type} for ${newApt.patientName} with ${newApt.doctor}`, 'Info', newApt.patientName);
    addToast({
      title: 'Appointment Booked',
      message: `Token ${token} issued for ${newApt.patientName}.`,
      type: 'success',
    });
  };

  const updateAppointmentStatus = (id, newStatus) => {
    setAppointments(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          status: newStatus,
          waitingTime: newStatus === 'Waiting' ? '5 min' : a.waitingTime,
        };
      }
      return a;
    }));
    logAuditAction('Appointment Status Updated', `Appointment ${id} changed to ${newStatus}`, 'Info');
    addToast({
      title: 'Status Updated',
      message: `Appointment ${id} is now ${newStatus}.`,
      type: 'info',
    });
  };

  // Actions for Vitals
  const recordVitals = (patientId, vitalsData) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          vitals: {
            ...vitalsData,
            lastRecorded: `Just now by ${currentUser.name}`,
          },
        };
      }
      return p;
    }));
    logAuditAction('Vitals Recorded', `BP: ${vitalsData.bp}, HR: ${vitalsData.heartRate} bpm, SpO2: ${vitalsData.oxygenSaturation}%`, 'Info', selectedPatient.name);
    addToast({
      title: 'Vitals Saved',
      message: `Vitals recorded successfully for ${selectedPatient.name}.`,
      type: 'success',
    });
  };

  // Actions for Lab
  const orderLabTest = (orderData) => {
    const newOrder = {
      id: `LAB-${labOrders.length + 901}`,
      orderNumber: `ORD-LAB-${Math.floor(4000 + Math.random() * 5000)}`,
      orderedBy: currentUser.name,
      orderDate: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Ordered',
      parameters: [],
      ...orderData,
    };
    setLabOrders(prev => [newOrder, ...prev]);
    logAuditAction('Lab Test Ordered', `Ordered ${newOrder.testName} (${newOrder.priority})`, 'Info', newOrder.patientName);
    addToast({
      title: 'Lab Order Submitted',
      message: `${newOrder.testName} ordered for ${newOrder.patientName}.`,
      type: 'success',
    });
  };

  const verifyLabOrder = (orderId, verifiedParameters, comments) => {
    setLabOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'Verified',
          parameters: verifiedParameters || o.parameters,
          technicianComment: comments || o.technicianComment,
          verifiedAt: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          verifiedBy: `${currentUser.name} (${currentUser.role})`,
        };
      }
      return o;
    }));
    logAuditAction('Lab Result Verified', `Order ${orderId} verified and published to clinical record`, 'Success');
    addToast({
      title: 'Lab Result Verified',
      message: `Order ${orderId} is now verified and read-only.`,
      type: 'success',
    });
  };

  // Actions for Radiology
  const orderRadiologyScan = (scanData) => {
    const newScan = {
      id: `RAD-${radiologyOrders.length + 501}`,
      requestNumber: `REQ-RAD-${Math.floor(8000 + Math.random() * 1000)}`,
      orderedBy: currentUser.name,
      orderDate: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'New Requests',
      ...scanData,
    };
    setRadiologyOrders(prev => [newScan, ...prev]);
    logAuditAction('Radiology Ordered', `Ordered ${newScan.modality} (${newScan.priority})`, 'Info', newScan.patientName);
    addToast({
      title: 'Radiology Request Created',
      message: `${newScan.modality} ordered for ${newScan.patientName}.`,
      type: 'success',
    });
  };

  const verifyRadiologyReport = (scanId, findings, impression) => {
    setRadiologyOrders(prev => prev.map(s => {
      if (s.id === scanId) {
        return {
          ...s,
          status: 'Verified',
          findings,
          impression,
          reportedAt: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          radiologist: `${currentUser.name}, MD`,
        };
      }
      return s;
    }));
    logAuditAction('Radiology Report Verified', `Scan ${scanId} finalized with diagnostic impressions`, 'Success');
    addToast({
      title: 'Report Verified & Published',
      message: `Diagnostic report for scan ${scanId} is now locked & verified.`,
      type: 'success',
    });
  };

  // Actions for Prescriptions
  const prescribeMedication = (medData) => {
    const newMed = {
      id: `MED-${medications.length + 101}`,
      prescribedBy: currentUser.name,
      startDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      scheduleStatus: 'Scheduled',
      ...medData,
    };
    setMedications(prev => [newMed, ...prev]);
    logAuditAction('Prescription Created', `Prescribed ${newMed.name} ${newMed.dose} ${newMed.frequency}`, 'Info', selectedPatient.name);
    addToast({
      title: 'Prescription Added',
      message: `${newMed.name} prescribed for ${selectedPatient.name}.`,
      type: 'success',
    });
  };

  const recordMARAdministration = (medId, notes = '') => {
    setMedications(prev => prev.map(m => {
      if (m.id === medId) {
        return {
          ...m,
          scheduleStatus: 'Administered',
          lastAdministered: `Just now by ${currentUser.name}`,
        };
      }
      return m;
    }));
    logAuditAction('Medication Administered (MAR)', `Administered med ${medId}. ${notes ? `Notes: ${notes}. ` : ''}Allergy checked.`, 'Success', selectedPatient.name);
    addToast({
      title: 'Medication Administered',
      message: `Documented in Medication Administration Record (MAR).`,
      type: 'success',
    });
  };

  // Actions for Wards & Beds
  const assignBed = (wardId, bedId, patient) => {
    setWards(prev => prev.map(w => {
      if (w.id === wardId) {
        const updatedBeds = w.beds.map(b => {
          if (b.bedId === bedId) {
            return {
              ...b,
              status: 'Occupied',
              patientId: patient.id,
              patientName: patient.name,
              gender: patient.gender,
              age: patient.age,
              admittedDate: new Date().toISOString().split('T')[0],
            };
          }
          return b;
        });
        const occupied = updatedBeds.filter(b => b.status === 'Occupied').length;
        return {
          ...w,
          beds: updatedBeds,
          occupiedBeds: occupied,
          availableBeds: w.totalBeds - occupied,
        };
      }
      return w;
    }));

    // Update patient bed
    setPatients(prev => prev.map(p => p.id === patient.id ? { ...p, status: 'Admitted', ward: wardId, bed: bedId } : p));
    logAuditAction('Patient Bed Assigned', `Assigned ${patient.name} to ${bedId}`, 'Info', patient.name);
    addToast({
      title: 'Bed Assigned',
      message: `${patient.name} assigned to ${bedId}.`,
      type: 'success',
    });
  };

  const dischargeBed = (wardId, bedId, patientName) => {
    setWards(prev => prev.map(w => {
      if (w.id === wardId) {
        const updatedBeds = w.beds.map(b => {
          if (b.bedId === bedId) {
            return { ...b, status: 'Cleaning', patientId: null, patientName: null, notes: 'Terminal disinfection' };
          }
          return b;
        });
        return {
          ...w,
          beds: updatedBeds,
          occupiedBeds: updatedBeds.filter(b => b.status === 'Occupied').length,
          availableBeds: updatedBeds.filter(b => b.status === 'Available').length,
        };
      }
      return w;
    }));
    logAuditAction('Patient Discharged', `Bed ${bedId} cleared and moved to cleaning state`, 'Info', patientName);
    addToast({
      title: 'Discharge Processed',
      message: `${bedId} marked for terminal cleaning.`,
      type: 'info',
    });
  };

  // Actions for Billing
  const recordPayment = (invoiceId, amount, method) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        const newPaid = inv.paidAmount + Number(amount);
        const newBalance = Math.max(0, inv.patientResponsibility - newPaid);
        return {
          ...inv,
          paidAmount: newPaid,
          balanceDue: newBalance,
          status: newBalance <= 0 ? 'Paid' : 'Partially Paid',
          paymentMethod: method || inv.paymentMethod,
        };
      }
      return inv;
    }));
    logAuditAction('Payment Recorded', `Received $${amount} via ${method} for invoice ${invoiceId}`, 'Success');
    addToast({
      title: 'Payment Received',
      message: `Successfully recorded $${amount} for ${invoiceId}.`,
      type: 'success',
    });
  };

  // Actions for Users
  const addUser = (userData) => {
    const newUser = {
      id: `USR-${(users.length + 1).toString().padStart(2, '0')}`,
      status: 'Active',
      lastLogin: 'Never',
      ...userData,
    };
    setUsers(prev => [newUser, ...prev]);
    logAuditAction('Staff User Added', `Created account for ${newUser.name} (${newUser.role})`, 'Info');
    addToast({
      title: 'Staff Member Added',
      message: `${newUser.name} added to ${newUser.department}.`,
      type: 'success',
    });
  };

  return (
    <AppContext.Provider
      value={{
        // Role & Auth
        currentRole,
        currentUser,
        switchRole,
        roles: DEMO_ROLES,

        // Data
        patients,
        selectedPatientId,
        setSelectedPatientId,
        selectedPatient,
        appointments,
        labOrders,
        radiologyOrders,
        medications,
        nursingTasks,
        wards,
        invoices,
        auditLogs,
        clinicalTimeline,
        setClinicalTimeline,
        users,
        metrics,
        setMetrics,
        setNursingTasks,

        // Operations
        registerPatient,
        bookAppointment,
        updateAppointmentStatus,
        recordVitals,
        orderLabTest,
        verifyLabOrder,
        orderRadiologyScan,
        verifyRadiologyReport,
        prescribeMedication,
        recordMARAdministration,
        assignBed,
        dischargeBed,
        recordPayment,
        addUser,
        logAuditAction,

        // UI & Modals
        sidebarCollapsed,
        setSidebarCollapsed,
        mobileMenuOpen,
        setMobileMenuOpen,
        globalSearchOpen,
        setGlobalSearchOpen,
        toasts,
        addToast,
        removeToast,
        activeModal,
        setActiveModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
