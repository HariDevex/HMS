/**
 * In-Memory Mock Database Store
 * Formatted to mirror PostgreSQL relational schema.
 * Can be swapped with pg / Prisma / TypeORM queries when connecting to PostgreSQL.
 */

// Initial Seed Data
const initialUsers = [
  { id: 'USR-001', name: 'Dr. Katherine Vance', email: 'k.vance@medicore.org', role: 'admin', department: 'Executive Management', avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face', isActive: true, createdAt: '2026-01-10T08:00:00Z' },
  { id: 'USR-002', name: 'Dr. Sarah Jenkins, MD', email: 's.jenkins@medicore.org', role: 'doctor', department: 'Cardiology', avatarUrl: 'https://images.unsplash.com/photo-1594824813589-3549646b9762?w=150&h=150&fit=crop&crop=face', isActive: true, createdAt: '2026-01-12T08:00:00Z' },
  { id: 'USR-003', name: 'Nurse Emily Rodriguez, RN', email: 'e.rodriguez@medicore.org', role: 'nurse', department: 'Critical Care / ICU', avatarUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=150&h=150&fit=crop&crop=face', isActive: true, createdAt: '2026-01-15T08:00:00Z' },
  { id: 'USR-004', name: 'Alex Morgan, MLS', email: 'a.morgan@medicore.org', role: 'lab', department: 'Clinical Pathology', avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&h=150&fit=crop&crop=face', isActive: true, createdAt: '2026-01-20T08:00:00Z' },
  { id: 'USR-005', name: 'Dr. David Miller, MD', email: 'd.miller@medicore.org', role: 'radiology', department: 'Diagnostic Radiology', avatarUrl: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=150&h=150&fit=crop&crop=face', isActive: true, createdAt: '2026-01-22T08:00:00Z' },
  { id: 'USR-006', name: 'Marcus Chen', email: 'm.chen@medicore.org', role: 'reception', department: 'Patient Admissions', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', isActive: true, createdAt: '2026-01-25T08:00:00Z' },
  { id: 'USR-007', name: 'James Wilson', email: 'j.wilson@gmail.com', role: 'patient', department: 'Outpatient Clinic', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', isActive: true, createdAt: '2026-02-01T08:00:00Z' },
];

const initialPatients = [
  {
    id: 'PAT-101',
    mrn: 'MC-2026-0891',
    name: 'James Wilson',
    age: 58,
    gender: 'Male',
    bloodGroup: 'O+',
    contactPhone: '+1 (555) 234-8901',
    contactEmail: 'j.wilson@gmail.com',
    address: '742 Evergreen Terrace, Springfield, IL',
    emergencyContact: 'Sarah Wilson (Spouse) - +1 (555) 234-8902',
    primaryCondition: 'Acute Coronary Syndrome / NSTEMI',
    chiefComplaint: 'Substernal chest pressure radiating to left jaw, onset 2 hours prior',
    diagnosis: 'Non-ST-Elevation Myocardial Infarction (NSTEMI), Hypertensive Heart Disease',
    attendingDoctorId: 'USR-002',
    attendingDoctor: 'Dr. Sarah Jenkins, MD',
    department: 'Cardiology',
    wardId: 'WARD-CARD',
    ward: 'Cardiology Ward (Telemetry)',
    bedId: 'BED-C104',
    bed: 'Bed C-104',
    admissionDate: '2026-09-08 14:32',
    status: 'Admitted',
    insuranceProvider: 'BlueCross BlueShield Premier Gold',
    policyNumber: 'BCBS-IL-8892019',
    allergies: [
      { allergen: 'Penicillin', severity: 'Severe', reaction: 'Anaphylaxis, Angioedema' },
      { allergen: 'Iodinated Contrast Media', severity: 'Moderate', reaction: 'Urticaria, Pruritus' },
    ],
  },
  {
    id: 'PAT-102',
    mrn: 'MC-2026-0412',
    name: 'Elena Rostova',
    age: 34,
    gender: 'Female',
    bloodGroup: 'A+',
    contactPhone: '+1 (555) 872-1094',
    contactEmail: 'elena.rostova@techcorp.io',
    address: '104 Michigan Avenue, Apt 4B, Chicago, IL',
    emergencyContact: 'Dmitri Rostov (Brother) - +1 (555) 872-9900',
    primaryCondition: 'Severe Pneumonia / Hypoxemia',
    chiefComplaint: 'High fevers (103°F), productive cough with rusty sputum, pleuritic chest pain',
    diagnosis: 'Right Middle Lobe Community-Acquired Pneumonia, Type 1 Respiratory Failure',
    attendingDoctorId: 'USR-002',
    attendingDoctor: 'Dr. Marcus Reynolds, MD',
    department: 'Pulmonology / ICU',
    wardId: 'WARD-ICU',
    ward: 'Medical Intensive Care Unit (MICU)',
    bedId: 'BED-ICU03',
    bed: 'Bed ICU-03',
    admissionDate: '2026-09-09 03:15',
    status: 'Admitted',
    insuranceProvider: 'Aetna Open Choice PPO',
    policyNumber: 'AET-99214-X',
    allergies: [
      { allergen: 'Sulfa Drugs', severity: 'Moderate', reaction: 'Maculopapular rash' },
    ],
  },
  {
    id: 'PAT-103',
    mrn: 'MC-2026-1189',
    name: 'Robert Thorne',
    age: 71,
    gender: 'Male',
    bloodGroup: 'B-',
    contactPhone: '+1 (555) 341-7654',
    contactEmail: 'r.thorne.retired@att.net',
    address: '12 Oak Ridge Lane, Peoria, IL',
    emergencyContact: 'Mary Thorne (Wife) - +1 (555) 341-7655',
    primaryCondition: 'Post-Op Total Knee Arthroplasty',
    chiefComplaint: 'Post-operative pain management and physical rehabilitation protocol',
    diagnosis: 'Right Knee Osteoarthritis s/p Uncomplicated Total Knee Replacement',
    attendingDoctorId: 'USR-002',
    attendingDoctor: 'Dr. Arthur Pendelton, MD',
    department: 'Orthopedic Surgery',
    wardId: 'WARD-SURG',
    ward: 'Post-Surgical Inpatient Wing',
    bedId: 'BED-S208',
    bed: 'Bed S-208',
    admissionDate: '2026-09-09 07:00',
    status: 'Post-Op Observation',
    insuranceProvider: 'Medicare Part A & B + Humana Advantage',
    policyNumber: 'MED-7182-991A',
    allergies: [
      { allergen: 'Morphine', severity: 'Severe', reaction: 'Severe bronchospasm, nausea' },
      { allergen: 'Latex', severity: 'Mild', reaction: 'Contact dermatitis' },
    ],
  },
];

const initialLabOrders = [
  {
    id: 'LAB-901',
    orderNumber: 'ORD-LAB-4401',
    patientId: 'PAT-101',
    patientName: 'James Wilson',
    patientMrn: 'MC-2026-0891',
    age: 58,
    gender: 'Male',
    orderedBy: 'Dr. Sarah Jenkins, MD',
    orderDate: '2026-09-10 08:30',
    priority: 'STAT',
    department: 'Clinical Pathology',
    testName: 'Cardiac Biomarkers Panel (hs-cTnI, CK-MB)',
    category: 'Biochemistry',
    sampleType: 'Venous Whole Blood',
    sampleBarcode: 'SMP-2026-88192',
    status: 'Verified',
    verifiedBy: 'Alex Morgan, MLS',
    verifiedAt: '2026-09-10 09:12',
    technicianComment: 'Troponin I critically elevated. Verified on Beckman Coulter Access 2. Dr. Jenkins notified via telephone at 09:15.',
    parameters: [
      { name: 'High-Sensitivity Troponin I (hs-cTnI)', value: '0.142', unit: 'ng/mL', refRange: '0.000 - 0.034', flag: 'Critical High' },
      { name: 'Creatine Kinase-MB (CK-MB)', value: '18.4', unit: 'ng/mL', refRange: '0.0 - 5.0', flag: 'High' },
      { name: 'Total Creatine Kinase', value: '312', unit: 'U/L', refRange: '30 - 200', flag: 'High' },
      { name: 'Myoglobin', value: '142', unit: 'ng/mL', refRange: '25 - 72', flag: 'High' },
    ],
    pdfReport: {
      fileName: 'Certified_Lab_Report_ORD-LAB-4401.pdf',
      fileSize: '1.4 MB',
      pages: 2,
      uploadedAt: '2026-09-10 09:14',
      uploadedBy: 'Alex Morgan, MLS',
    },
  },
  {
    id: 'LAB-902',
    orderNumber: 'ORD-LAB-4402',
    patientId: 'PAT-101',
    patientName: 'James Wilson',
    patientMrn: 'MC-2026-0891',
    age: 58,
    gender: 'Male',
    orderedBy: 'Dr. Sarah Jenkins, MD',
    orderDate: '2026-09-10 09:00',
    priority: 'Urgent',
    department: 'Hematology',
    testName: 'Complete Blood Count with Differential (CBC)',
    category: 'Hematology',
    sampleType: 'Whole Blood (Lavender Top EDTA)',
    sampleBarcode: 'SMP-2026-88193',
    status: 'Verified',
    verifiedBy: 'Alex Morgan, MLS',
    verifiedAt: '2026-09-10 09:40',
    technicianComment: 'Automated differential verified by slide scan. Normocytic, normochromic RBCs. No blasts seen.',
    parameters: [
      { name: 'White Blood Cell Count (WBC)', value: '11.8', unit: 'x10^3/uL', refRange: '4.5 - 11.0', flag: 'High' },
      { name: 'Red Blood Cell Count (RBC)', value: '4.82', unit: 'x10^6/uL', refRange: '4.30 - 5.90', flag: 'Normal' },
      { name: 'Hemoglobin (Hgb)', value: '14.6', unit: 'g/dL', refRange: '13.5 - 17.5', flag: 'Normal' },
      { name: 'Hematocrit (Hct)', value: '43.2', unit: '%', refRange: '41.0 - 50.0', flag: 'Normal' },
      { name: 'Platelet Count', value: '248', unit: 'x10^3/uL', refRange: '150 - 450', flag: 'Normal' },
      { name: 'Neutrophil Percentage', value: '76.4', unit: '%', refRange: '40.0 - 70.0', flag: 'High' },
    ],
    pdfReport: {
      fileName: 'Certified_Lab_Report_ORD-LAB-4402.pdf',
      fileSize: '1.2 MB',
      pages: 2,
      uploadedAt: '2026-09-10 09:42',
      uploadedBy: 'Alex Morgan, MLS',
    },
  },
];

const initialRadiologyOrders = [
  {
    id: 'RAD-501',
    requestNumber: 'REQ-RAD-8812',
    patientId: 'PAT-101',
    patientName: 'James Wilson',
    patientMrn: 'MC-2026-0891',
    age: 58,
    gender: 'Male',
    orderedBy: 'Dr. Sarah Jenkins, MD',
    orderDate: '2026-09-08 15:00',
    priority: 'STAT',
    modality: 'Chest X-Ray PA & Lateral',
    studyCode: 'CXR-PA-LAT',
    clinicalIndication: 'Acute onset substernal chest pressure. Evaluate for cardiomegaly, pulmonary edema, widened mediastinum, or pneumothorax.',
    status: 'Verified',
    dicomSeries: 2,
    dicomImages: 4,
    imageMock: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&h=400&fit=crop',
    radiologist: 'Dr. David Miller, MD',
    reportedAt: '2026-09-08 15:45',
    findings: 'Lungs are clear bilaterally without focal consolidation, pneumothorax, or large pleural effusion. Cardiothoracic ratio is mildly prominent at 0.52, suggestive of borderline cardiomegaly. Pulmonary vascularity is normal. Mediastinal contours and hila appear normal. Visualized osseous structures demonstrate no acute fracture.',
    impression: '1. No acute pulmonary infiltrate or pulmonary edema.\n2. Borderline cardiomegaly without overt congestive cardiac failure.\n3. Mediastinal silhouette within physiological limits.',
    pdfReport: {
      fileName: 'Certified_Radiology_Report_REQ-RAD-8812.pdf',
      fileSize: '2.8 MB',
      pages: 2,
      uploadedAt: '2026-09-08 15:50',
      uploadedBy: 'Dr. David Miller, MD',
    },
  },
];

const initialAppointments = [
  {
    id: 'APT-001',
    patientId: 'PAT-101',
    patientName: 'James Wilson',
    patientMrn: 'MC-2026-0891',
    doctorId: 'USR-002',
    doctorName: 'Dr. Sarah Jenkins, MD',
    department: 'Cardiology',
    date: '2026-09-11',
    time: '10:00 AM',
    durationMins: 30,
    type: 'Inpatient Cardiology Follow-Up',
    status: 'Confirmed',
    tokenNumber: 'A-102',
    reason: 'Post-NSTEMI serial cardiac biomarker review and telemetry re-evaluation',
    notes: 'Prior troponin 0.142. Repeat ECG and review coronary angiogram indication.',
  },
  {
    id: 'APT-002',
    patientId: 'PAT-102',
    patientName: 'Elena Rostova',
    patientMrn: 'MC-2026-0412',
    doctorId: 'USR-002',
    doctorName: 'Dr. Sarah Jenkins, MD',
    department: 'Pulmonology',
    date: '2026-09-11',
    time: '10:30 AM',
    durationMins: 30,
    type: 'ICU Pulmonology Round',
    status: 'In Consultation',
    tokenNumber: 'A-103',
    reason: 'Right lower lobe pneumonia, reassess oxygenation titration and IV antibiotic response',
    notes: 'On 2L nasal cannula. Continue Ceftriaxone + Azithromycin.',
  },
];

const initialPrescriptions = [
  {
    id: 'RX-901',
    rxNumber: 'RX-2026-00192',
    patientId: 'PAT-101',
    patientName: 'James Wilson',
    prescribedById: 'USR-002',
    prescribedBy: 'Dr. Sarah Jenkins, MD',
    drugName: 'Aspirin (Enteric Coated)',
    dosage: '81 mg',
    route: 'Oral (PO)',
    frequency: 'Once Daily (QD)',
    duration: '30 Days',
    indication: 'Secondary cardiovascular antiplatelet prophylaxis post-NSTEMI',
    refills: 3,
    daw: true,
    status: 'Active',
    prescribedAt: '2026-09-08 16:30',
  },
  {
    id: 'RX-902',
    rxNumber: 'RX-2026-00193',
    patientId: 'PAT-101',
    patientName: 'James Wilson',
    prescribedById: 'USR-002',
    prescribedBy: 'Dr. Sarah Jenkins, MD',
    drugName: 'Atorvastatin Calcium',
    dosage: '80 mg',
    route: 'Oral (PO)',
    frequency: 'At Bedtime (QHS)',
    duration: '30 Days',
    indication: 'High-intensity statin therapy for acute coronary plaque stabilization',
    refills: 3,
    daw: true,
    status: 'Active',
    prescribedAt: '2026-09-08 16:35',
  },
];

const initialWards = [
  { id: 'WARD-ICU', name: 'Intensive Care Unit (ICU)', type: 'Critical', floor: '3rd Floor, Wing A', totalBeds: 12 },
  { id: 'WARD-CARD', name: 'Cardiology Telemetry Ward', type: 'Step-Down', floor: '4th Floor, Wing B', totalBeds: 24 },
  { id: 'WARD-GEN', name: 'General Medical Ward', type: 'Acute', floor: '2nd Floor, Wing C', totalBeds: 36 },
  { id: 'WARD-SURG', name: 'Post-Surgical Recovery', type: 'Surgical', floor: '5th Floor, Wing A', totalBeds: 20 },
  { id: 'WARD-MAT', name: 'Maternity & Neonatal Unit', type: 'Specialized', floor: '1st Floor, Wing D', totalBeds: 18 },
];

const initialBeds = [
  { id: 'BED-C104', wardId: 'WARD-CARD', bedNumber: 'C-104', status: 'Occupied', patientId: 'PAT-101', patientName: 'James Wilson', assignedAt: '2026-09-08 14:32' },
  { id: 'BED-ICU03', wardId: 'WARD-ICU', bedNumber: 'ICU-03', status: 'Occupied', patientId: 'PAT-102', patientName: 'Elena Rostova', assignedAt: '2026-09-09 03:15' },
  { id: 'BED-S208', wardId: 'WARD-SURG', bedNumber: 'S-208', status: 'Occupied', patientId: 'PAT-103', patientName: 'Robert Thorne', assignedAt: '2026-09-09 07:00' },
  { id: 'BED-C105', wardId: 'WARD-CARD', bedNumber: 'C-105', status: 'Available', patientId: null },
  { id: 'BED-C106', wardId: 'WARD-CARD', bedNumber: 'C-106', status: 'Reserved', patientId: null },
  { id: 'BED-ICU04', wardId: 'WARD-ICU', bedNumber: 'ICU-04', status: 'Cleaning', patientId: null },
  { id: 'BED-ICU05', wardId: 'WARD-ICU', bedNumber: 'ICU-05', status: 'Available', patientId: null },
];

const initialInvoices = [
  {
    id: 'INV-401',
    invoiceNumber: 'INV-2026-8801',
    patientId: 'PAT-101',
    patientName: 'James Wilson',
    patientMrn: 'MC-2026-0891',
    billDate: '2026-09-08',
    dueDate: '2026-10-08',
    status: 'Paid',
    paymentMethod: 'Insurance + Credit Card',
    totalAmount: 18450.00,
    insuranceCovered: 16200.00,
    patientPayable: 2250.00,
    paidAmount: 2250.00,
    items: [
      { serviceName: 'Emergency Department Trauma Bay Intake', category: 'Emergency', quantity: 1, unitPrice: 3200.00, totalPrice: 3200.00 },
      { serviceName: 'Cardiology Telemetry Ward (3 Days)', category: 'Room & Board', quantity: 3, unitPrice: 2800.00, totalPrice: 8400.00 },
      { serviceName: 'STAT Cardiac Troponin I & CK-MB Assay', category: 'Laboratory', quantity: 2, unitPrice: 420.00, totalPrice: 840.00 },
      { serviceName: 'Chest X-Ray PA & Lateral Digital Radiograph', category: 'Radiology', quantity: 1, unitPrice: 850.00, totalPrice: 850.00 },
      { serviceName: 'Inpatient Pharmacy Infusions & Antiplatelet Meds', category: 'Pharmacy', quantity: 1, unitPrice: 1660.00, totalPrice: 1660.00 },
      { serviceName: 'Cardiologist Consultation & Telemetry Monitoring', category: 'Professional', quantity: 1, unitPrice: 3500.00, totalPrice: 3500.00 },
    ],
  },
];

const initialAuditLogs = [
  { id: 'LOG-001', userId: 'USR-002', action: 'Patient Record Accessed', details: 'Viewed patient chart and telemetry timeline', status: 'Success', timestamp: '2026-09-11 10:14:02', ipAddress: '192.168.1.45', patientName: 'James Wilson' },
  { id: 'LOG-002', userId: 'USR-004', action: 'Lab Result Verified', details: 'Order ORD-LAB-4401 verified and published to clinical record. PDF attached.', status: 'Success', timestamp: '2026-09-10 09:12:30', ipAddress: '192.168.1.88', patientName: 'James Wilson' },
  { id: 'LOG-003', userId: 'USR-005', action: 'Radiology Report Certified', details: 'Study REQ-RAD-8812 verified and signed with digital seal.', status: 'Success', timestamp: '2026-09-08 15:45:12', ipAddress: '192.168.1.92', patientName: 'James Wilson' },
];

// Helper Repository Class providing clean CRUD operations
class Collection {
  constructor(initialData = []) {
    this.data = [...initialData];
  }

  find(filterFn) {
    if (!filterFn) return [...this.data];
    return this.data.filter(filterFn);
  }

  findById(id) {
    return this.data.find((item) => item.id === id) || null;
  }

  create(item) {
    const newItem = {
      ...item,
      id: item.id || `REC-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
    };
    this.data.unshift(newItem);
    return newItem;
  }

  update(id, updates) {
    const idx = this.data.findIndex((item) => item.id === id);
    if (idx === -1) return null;
    this.data[idx] = {
      ...this.data[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.data[idx];
  }

  delete(id) {
    const idx = this.data.findIndex((item) => item.id === id);
    if (idx === -1) return false;
    this.data.splice(idx, 1);
    return true;
  }
}

// Global In-Memory Database Instance
export const db = {
  users: new Collection(initialUsers),
  patients: new Collection(initialPatients),
  labOrders: new Collection(initialLabOrders),
  radiologyOrders: new Collection(initialRadiologyOrders),
  appointments: new Collection(initialAppointments),
  prescriptions: new Collection(initialPrescriptions),
  wards: new Collection(initialWards),
  beds: new Collection(initialBeds),
  invoices: new Collection(initialInvoices),
  auditLogs: new Collection(initialAuditLogs),
};
