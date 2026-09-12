import { db } from '../db/sqliteClient.js';

export const getRadiologyOrders = (req, res) => {
  const { modality, status, patientId, search } = req.query;
  let scans = db.radiologyOrders.find();

  if (modality && modality !== 'All') {
    scans = scans.filter((s) => s.modality.includes(modality));
  }

  if (status && status !== 'All') {
    scans = scans.filter((s) => s.status === status);
  }

  if (patientId) {
    scans = scans.filter((s) => s.patientId === patientId);
  }

  if (search) {
    const q = search.toLowerCase();
    scans = scans.filter(
      (s) =>
        s.patientName.toLowerCase().includes(q) ||
        s.requestNumber.toLowerCase().includes(q) ||
        s.clinicalIndication.toLowerCase().includes(q)
    );
  }

  return res.json({ success: true, count: scans.length, radiologyOrders: scans });
};

export const getRadiologyOrderById = (req, res) => {
  const { id } = req.params;
  const scan = db.radiologyOrders.findById(id);

  if (!scan) {
    return res.status(404).json({ success: false, message: `Radiology order ${id} not found` });
  }

  return res.json({ success: true, radiologyOrder: scan });
};

export const createRadiologyOrder = (req, res) => {
  const { patientId, modality, studyName, priority, clinicalIndication, pdfReport } = req.body;

  const patient = patientId ? db.patients.findById(patientId) : null;
  const generatedReqNum = `REQ-RAD-${Math.floor(8000 + Math.random() * 1000)}`;

  const newScan = db.radiologyOrders.create({
    id: `RAD-${Math.floor(500 + Math.random() * 500)}`,
    requestNumber: generatedReqNum,
    patientId: patientId || 'PAT-101',
    patientName: patient ? patient.name : 'Registered Inpatient',
    patientMrn: patient ? patient.mrn : 'MC-2026-XXXX',
    age: patient ? patient.age : 50,
    gender: patient ? patient.gender : 'Unknown',
    orderedBy: req.body.orderedBy || 'Dr. Sarah Jenkins, MD',
    orderDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
    priority: priority || 'Routine',
    modality: modality || 'X-Ray',
    studyCode: `${(modality || 'RAD').slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
    studyName: studyName || `${modality} Diagnostic Examination`,
    clinicalIndication: clinicalIndication || 'Clinical diagnostic imaging requested from clinical chart',
    status: 'Verified',
    dicomSeries: 2,
    dicomImages: 8,
    imageMock: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&h=400&fit=crop',
    radiologist: 'Dr. David Miller, MD',
    reportedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    findings: 'Target examination acquired without acute motion artifact. Clear visualization of anatomical boundaries. Normal parenchymal architecture without focal mass effect, consolidation, or acute hemorrhage.',
    impression: `1. Diagnostic study demonstrates stable anatomical morphology.\n2. No acute critical finding identified on current ${modality || 'imaging'} series.`,
    pdfReport: pdfReport || {
      fileName: `Certified_Radiology_Report_${generatedReqNum}.pdf`,
      fileSize: '2.8 MB',
      pages: 2,
      uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      uploadedBy: 'Dr. David Miller, MD',
    },
  });

  db.auditLogs.create({
    action: 'Radiology Ordered',
    details: `Ordered ${newScan.modality} (${newScan.priority})`,
    status: 'Success',
    patientName: newScan.patientName,
  });

  return res.status(201).json({ success: true, radiologyOrder: newScan });
};

export const verifyRadiologyReport = (req, res) => {
  const { id } = req.params;
  const { findings, impression, pdfReport, radiologist } = req.body;

  const existing = db.radiologyOrders.findById(id);
  if (!existing) {
    return res.status(404).json({ success: false, message: `Radiology order ${id} not found` });
  }

  const updated = db.radiologyOrders.update(id, {
    status: 'Verified',
    findings: findings || existing.findings,
    impression: impression || existing.impression,
    radiologist: radiologist || 'Dr. David Miller, MD (Consultant Radiologist)',
    reportedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    pdfReport: pdfReport || existing.pdfReport || {
      fileName: `Certified_Radiology_Report_${existing.requestNumber}.pdf`,
      fileSize: '2.8 MB',
      pages: 2,
      uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      uploadedBy: 'Dr. David Miller, MD',
    },
  });

  db.auditLogs.create({
    action: 'Radiology Report Certified',
    details: `Study ${existing.requestNumber} certified and archived with PDF report`,
    status: 'Success',
    patientName: existing.patientName,
  });

  return res.json({ success: true, radiologyOrder: updated });
};
