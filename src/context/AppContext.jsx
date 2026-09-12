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
    const targetPatient = patients.find(p => p.id === patientId) || selectedPatient;
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
    logAuditAction('Vitals Recorded', `BP: ${vitalsData.bp}, HR: ${vitalsData.heartRate} bpm, SpO2: ${vitalsData.oxygenSaturation}%`, 'Info', targetPatient.name);
    setClinicalTimeline(prev => [
      {
        id: `TL-${Date.now()}-1`,
        patientId: targetPatient.id,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        department: 'Bedside Care',
        user: currentUser.name,
        role: currentUser.role,
        action: 'Vitals Recorded',
        status: 'Recorded',
        badgeVariant: 'info',
        title: `Vital Signs Recorded (BP ${vitalsData.bp}, HR ${vitalsData.heartRate} bpm)`,
        description: `BP: ${vitalsData.bp} mmHg, HR: ${vitalsData.heartRate} bpm, SpO2: ${vitalsData.oxygenSaturation}%, Temp: ${vitalsData.temperature}°F, Resp: ${vitalsData.respiratoryRate}/min.`,
      },
      ...prev,
    ]);
    addToast({
      title: 'Vitals Saved',
      message: `Vitals recorded successfully for ${targetPatient.name}.`,
      type: 'success',
    });
  };

  const getDefaultLabParameters = (testName = '') => {
    const name = testName.toLowerCase();
    if (name.includes('cbc') || name.includes('blood count')) {
      return [
        { name: 'White Blood Cells (WBC)', value: '10.8', unit: 'x10^3/uL', refRange: '4.5 - 11.0', flag: 'Normal' },
        { name: 'Red Blood Cells (RBC)', value: '4.72', unit: 'x10^6/uL', refRange: '4.3 - 5.9', flag: 'Normal' },
        { name: 'Hemoglobin (Hgb)', value: '14.2', unit: 'g/dL', refRange: '13.5 - 17.5', flag: 'Normal' },
        { name: 'Hematocrit (Hct)', value: '42.5', unit: '%', refRange: '41.0 - 50.0', flag: 'Normal' },
        { name: 'Platelet Count', value: '248', unit: 'x10^3/uL', refRange: '150 - 450', flag: 'Normal' },
        { name: 'Absolute Neutrophils', value: '7.8', unit: 'x10^3/uL', refRange: '1.8 - 7.7', flag: 'High' },
      ];
    }
    if (name.includes('troponin') || name.includes('cadiac') || name.includes('c-tni')) {
      return [
        { name: 'Cardiac Troponin I (hs-cTnI)', value: '0.086', unit: 'ng/mL', refRange: '0.000 - 0.034', flag: 'Critical High' },
        { name: 'CK-MB', value: '6.2', unit: 'ng/mL', refRange: '0.0 - 5.0', flag: 'High' },
        { name: 'Myoglobin', value: '92', unit: 'ng/mL', refRange: '25 - 72', flag: 'High' },
      ];
    }
    if (name.includes('metabolic') || name.includes('cmp')) {
      return [
        { name: 'Sodium', value: '139', unit: 'mmol/L', refRange: '136 - 145', flag: 'Normal' },
        { name: 'Potassium', value: '4.4', unit: 'mmol/L', refRange: '3.5 - 5.1', flag: 'Normal' },
        { name: 'Chloride', value: '102', unit: 'mmol/L', refRange: '98 - 107', flag: 'Normal' },
        { name: 'Carbon Dioxide (CO2)', value: '24', unit: 'mmol/L', refRange: '22 - 29', flag: 'Normal' },
        { name: 'Blood Urea Nitrogen (BUN)', value: '22', unit: 'mg/dL', refRange: '7 - 20', flag: 'High' },
        { name: 'Serum Creatinine', value: '1.2', unit: 'mg/dL', refRange: '0.7 - 1.3', flag: 'Normal' },
        { name: 'Glucose Fasting', value: '112', unit: 'mg/dL', refRange: '70 - 99', flag: 'High' },
        { name: 'eGFR', value: '68', unit: 'mL/min/1.73m²', refRange: '> 60', flag: 'Normal' },
      ];
    }
    if (name.includes('lipid')) {
      return [
        { name: 'Total Cholesterol', value: '215', unit: 'mg/dL', refRange: '< 200', flag: 'High' },
        { name: 'Triglycerides', value: '180', unit: 'mg/dL', refRange: '< 150', flag: 'High' },
        { name: 'HDL Cholesterol', value: '42', unit: 'mg/dL', refRange: '> 40', flag: 'Normal' },
        { name: 'LDL Cholesterol (Calc)', value: '137', unit: 'mg/dL', refRange: '< 100', flag: 'High' },
      ];
    }
    if (name.includes('abg') || name.includes('arterial')) {
      return [
        { name: 'pH', value: '7.34', unit: '', refRange: '7.35 - 7.45', flag: 'Low' },
        { name: 'PaCO2', value: '48', unit: 'mmHg', refRange: '35 - 45', flag: 'High' },
        { name: 'PaO2', value: '76', unit: 'mmHg', refRange: '80 - 100', flag: 'Low' },
        { name: 'HCO3', value: '25.2', unit: 'mmol/L', refRange: '22 - 26', flag: 'Normal' },
        { name: 'Oxygen Saturation (SaO2)', value: '93.5', unit: '%', refRange: '95 - 100', flag: 'Low' },
      ];
    }
    return [
      { name: 'Primary Diagnostic Marker', value: 'Within Normal Limits', unit: '', refRange: 'Standard Reference', flag: 'Normal' },
      { name: 'Secondary Biochemical Marker', value: 'Negative', unit: '', refRange: 'Negative', flag: 'Normal' },
    ];
  };

  // Actions for Lab
  const orderLabTest = (orderData) => {
    const generatedOrderNum = `ORD-LAB-${Math.floor(4000 + Math.random() * 5000)}`;
    const newOrder = {
      id: `LAB-${labOrders.length + 901}`,
      orderNumber: generatedOrderNum,
      orderedBy: currentUser.name,
      orderDate: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Result Ready',
      verifiedBy: 'Dr. R. Patel, MD (Clinical Pathology)',
      verifiedAt: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      parameters: (orderData.parameters && orderData.parameters.length > 0) ? orderData.parameters : getDefaultLabParameters(orderData.testName),
      pdfReport: orderData.pdfReport || {
        fileName: `Certified_Lab_Report_${generatedOrderNum}.pdf`,
        fileSize: '1.4 MB',
        pages: 2,
        uploadedAt: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        uploadedBy: currentUser.name,
      },
      ...orderData,
    };
    setLabOrders(prev => [newOrder, ...prev]);
    logAuditAction('Lab Test Ordered', `Ordered ${newOrder.testName} (${newOrder.priority})`, 'Info', newOrder.patientName);
    setClinicalTimeline(prev => [
      {
        id: `TL-${Date.now()}-2`,
        patientId: newOrder.patientId,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        department: 'Pathology & Lab',
        user: currentUser.name,
        role: currentUser.role,
        action: 'Lab Test Ordered',
        status: newOrder.priority === 'STAT' ? 'Critical' : 'Ordered',
        badgeVariant: newOrder.priority === 'STAT' ? 'critical' : 'primary',
        title: `${newOrder.testName} Ordered`,
        description: `Priority: ${newOrder.priority}. Specimen: ${newOrder.specimenType || 'Venous Blood'}. Notes: ${newOrder.notes || 'Diagnostic workup'}.`,
      },
      ...prev,
    ]);
    addToast({
      title: 'Lab Order Submitted',
      message: `${newOrder.testName} ordered for ${newOrder.patientName}.`,
      type: 'success',
    });
  };

  const verifyLabOrder = (orderId, verifiedParameters, comments, pdfReport) => {
    setLabOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'Verified',
          parameters: verifiedParameters || o.parameters,
          technicianComment: comments || o.technicianComment,
          verifiedAt: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          verifiedBy: `${currentUser.name} (${currentUser.role})`,
          pdfReport: pdfReport || o.pdfReport || {
            fileName: `Certified_Lab_Report_${o.orderNumber || orderId}.pdf`,
            fileSize: '1.4 MB',
            pages: 2,
            uploadedAt: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            uploadedBy: currentUser.name,
          },
        };
      }
      return o;
    }));
    logAuditAction('Lab Result Verified', `Order ${orderId} verified and published to clinical record`, 'Success');
    addToast({
      title: 'Lab Result Verified',
      message: `Order ${orderId} is now verified and read-only. Certified PDF attached.`,
      type: 'success',
    });
  };

  // Actions for Radiology
  const orderRadiologyScan = (scanData) => {
    const generatedReqNum = `REQ-RAD-${Math.floor(8000 + Math.random() * 1000)}`;
    const newScan = {
      id: `RAD-${radiologyOrders.length + 501}`,
      requestNumber: generatedReqNum,
      orderedBy: currentUser.name,
      orderDate: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Verified',
      imageMock: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&h=400&fit=crop',
      dicomSeries: 2,
      dicomImages: 8,
      radiologist: 'Dr. David Miller, MD',
      reportedAt: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      findings: 'Target examination acquired without acute motion artifact. Clear visualization of anatomical boundaries. Normal parenchymal architecture without focal mass effect, consolidation, or acute hemorrhage.',
      impression: `1. Diagnostic study demonstrates stable anatomical morphology.\n2. No acute critical finding identified on current ${scanData.modality || 'imaging'} series.`,
      pdfReport: scanData.pdfReport || {
        fileName: `Certified_Radiology_Report_${generatedReqNum}.pdf`,
        fileSize: '2.8 MB',
        pages: 2,
        uploadedAt: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        uploadedBy: 'Dr. David Miller, MD',
      },
      ...scanData,
    };
    setRadiologyOrders(prev => [newScan, ...prev]);
    logAuditAction('Radiology Ordered', `Ordered ${newScan.modality} (${newScan.priority})`, 'Info', newScan.patientName);
    setClinicalTimeline(prev => [
      {
        id: `TL-${Date.now()}-3`,
        patientId: newScan.patientId,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        department: 'Radiology & Imaging',
        user: currentUser.name,
        role: currentUser.role,
        action: 'Imaging Requested',
        status: newScan.priority === 'STAT' ? 'Critical' : 'Ordered',
        badgeVariant: newScan.priority === 'STAT' ? 'critical' : 'purple',
        title: `${newScan.studyName || newScan.modality} Study Ordered`,
        description: `Modality: ${newScan.modality} (${newScan.priority}). Indication: ${newScan.clinicalIndication || 'Diagnostic evaluation'}.`,
      },
      ...prev,
    ]);
    addToast({
      title: 'Radiology Request Created',
      message: `${newScan.modality} ordered for ${newScan.patientName}.`,
      type: 'success',
    });
  };

  const verifyRadiologyReport = (scanId, findings, impression, pdfReport) => {
    setRadiologyOrders(prev => prev.map(s => {
      if (s.id === scanId) {
        return {
          ...s,
          status: 'Verified',
          findings,
          impression,
          reportedAt: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          radiologist: `${currentUser.name} (${currentUser.role})`,
          pdfReport: pdfReport || s.pdfReport || {
            fileName: `Certified_Radiology_Report_${s.requestNumber || scanId}.pdf`,
            fileSize: '2.8 MB',
            pages: 2,
            uploadedAt: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            uploadedBy: currentUser.name,
          },
        };
      }
      return s;
    }));
    logAuditAction('Radiology Report Verified', `Report for ${scanId} verified and signed`, 'Success');
    addToast({
      title: 'Radiology Report Verified',
      message: `Study ${scanId} certified and published to patient chart. PDF report attached.`,
      type: 'success',
    });
  };

  // Actions for Prescriptions
  const prescribeMedication = (medData) => {
    const ptName = medData.patientName || selectedPatient.name;
    const newMed = {
      id: `MED-${medications.length + 101}`,
      prescribedBy: currentUser.name,
      startDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      scheduleStatus: 'Scheduled',
      ...medData,
    };
    setMedications(prev => [newMed, ...prev]);
    logAuditAction('Prescription Created', `Prescribed ${newMed.name} ${newMed.dose} ${newMed.frequency}`, 'Info', ptName);
    setClinicalTimeline(prev => [
      {
        id: `TL-${Date.now()}-4`,
        patientId: newMed.patientId,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        department: 'Clinical Pharmacy',
        user: currentUser.name,
        role: currentUser.role,
        action: 'Prescription Created',
        status: 'Active',
        badgeVariant: 'success',
        title: `Rx: ${newMed.name} ${newMed.dose}`,
        description: `Route: ${newMed.route}, Frequency: ${newMed.frequency}, Duration: ${newMed.duration}. Indication: ${newMed.indication}.`,
      },
      ...prev,
    ]);
    addToast({
      title: 'Prescription Added',
      message: `${newMed.name} prescribed for ${ptName}.`,
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
    logAuditAction('Payment Recorded', `Received ₹${amount} via ${method} for invoice ${invoiceId}`, 'Success');
    addToast({
      title: 'Payment Received',
      message: `Successfully recorded ₹${amount} for ${invoiceId}.`,
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
