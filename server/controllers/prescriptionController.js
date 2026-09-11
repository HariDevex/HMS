import { db } from '../data/inMemoryDb.js';

export const getPrescriptions = (req, res) => {
  const { patientId, status } = req.query;
  let rxs = db.prescriptions.find();

  if (patientId) {
    rxs = rxs.filter((r) => r.patientId === patientId);
  }

  if (status && status !== 'All') {
    rxs = rxs.filter((r) => r.status === status);
  }

  return res.json({ success: true, count: rxs.length, prescriptions: rxs });
};

export const createPrescription = (req, res) => {
  const { patientId, drugName, dosage, route, frequency, duration, indication, refills, daw } = req.body;

  if (!drugName || !dosage) {
    return res.status(400).json({ success: false, message: 'Drug name and dosage are required' });
  }

  const patient = patientId ? db.patients.findById(patientId) : null;

  // Automated allergy contraindication checking
  if (patient && patient.allergies && patient.allergies.length > 0) {
    const hasAllergy = patient.allergies.some(
      (a) =>
        drugName.toLowerCase().includes(a.allergen.toLowerCase()) ||
        a.allergen.toLowerCase().includes(drugName.toLowerCase())
    );
    if (hasAllergy && !req.body.overrideAllergy) {
      return res.status(409).json({
        success: false,
        warning: 'ALLERGY_CONTRAINDICATION_ALERT',
        message: `Patient has documented allergy to ${drugName}. Provide overrideAllergy: true to confirm clinical necessity.`,
      });
    }
  }

  const generatedRxNum = `RX-2026-${Math.floor(10000 + Math.random() * 90000)}`;

  const newRx = db.prescriptions.create({
    id: `RX-${Math.floor(900 + Math.random() * 900)}`,
    rxNumber: generatedRxNum,
    patientId: patientId || 'PAT-101',
    patientName: patient ? patient.name : 'Inpatient Care',
    prescribedById: req.body.prescribedById || 'USR-002',
    prescribedBy: req.body.prescribedBy || 'Dr. Sarah Jenkins, MD',
    drugName,
    dosage,
    route: route || 'Oral (PO)',
    frequency: frequency || 'Once Daily (QD)',
    duration: duration || '30 Days',
    indication: indication || 'Clinical Management',
    refills: refills || 3,
    daw: daw !== false,
    status: 'Active',
    prescribedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
  });

  db.auditLogs.create({
    action: 'Prescription Authorized',
    details: `Prescribed ${newRx.drugName} ${newRx.dosage} (${newRx.frequency})`,
    status: 'Success',
    patientName: newRx.patientName,
  });

  return res.status(201).json({ success: true, prescription: newRx });
};

export const updateAdministration = (req, res) => {
  const { id } = req.params;
  const { status, notes, administeredBy } = req.body;

  const existing = db.prescriptions.findById(id);
  if (!existing) {
    return res.status(404).json({ success: false, message: `Prescription ${id} not found` });
  }

  const updated = db.prescriptions.update(id, {
    lastAdministeredStatus: status,
    lastAdministeredAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    lastAdministeredBy: administeredBy || 'Nurse Emily Rodriguez, RN',
    adminNotes: notes || '',
  });

  return res.json({ success: true, prescription: updated });
};
