import { db } from '../db/sqliteClient.js';

export const getPatients = (req, res) => {
  const { search, department, status } = req.query;
  let patients = db.patients.find();

  if (search) {
    const q = search.toLowerCase();
    patients = patients.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.mrn.toLowerCase().includes(q) ||
        (p.primaryCondition && p.primaryCondition.toLowerCase().includes(q))
    );
  }

  if (department && department !== 'All') {
    patients = patients.filter((p) => p.department === department);
  }

  if (status && status !== 'All') {
    patients = patients.filter((p) => p.status === status);
  }

  return res.json({ success: true, count: patients.length, patients });
};

export const getPatientById = (req, res) => {
  const { id } = req.params;
  const patient = db.patients.findById(id);

  if (!patient) {
    return res.status(404).json({ success: false, message: `Patient with ID ${id} not found` });
  }

  // Aggregate relational data for clinical hub
  const labs = db.labOrders.find((l) => l.patientId === id);
  const scans = db.radiologyOrders.find((r) => r.patientId === id);
  const prescriptions = db.prescriptions.find((rx) => rx.patientId === id);
  const appointments = db.appointments.find((apt) => apt.patientId === id);

  return res.json({
    success: true,
    patient: {
      ...patient,
      labs,
      scans,
      prescriptions,
      appointments,
    },
  });
};

export const createPatient = (req, res) => {
  const { name, age, gender, bloodGroup, primaryCondition, chiefComplaint, contactPhone, department, ward, bed } = req.body;

  if (!name || !age || !gender) {
    return res.status(400).json({ success: false, message: 'Name, age, and gender are required' });
  }

  const generatedId = `PAT-${Math.floor(100 + Math.random() * 900)}`;
  const generatedMrn = `MC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const newPatient = db.patients.create({
    id: generatedId,
    mrn: generatedMrn,
    name,
    age: Number(age),
    gender,
    bloodGroup: bloodGroup || 'O+',
    contactPhone: contactPhone || '+1 (555) 000-0000',
    primaryCondition: primaryCondition || 'Observation',
    chiefComplaint: chiefComplaint || 'Routine medical intake',
    diagnosis: primaryCondition || 'Pending Clinical Evaluation',
    department: department || 'General Medicine',
    attendingDoctor: 'Dr. Sarah Jenkins, MD',
    ward: ward || 'Outpatient',
    bed: bed || 'OP',
    admissionDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
    status: 'Admitted',
    allergies: req.body.allergies || [],
  });

  db.auditLogs.create({
    action: 'Patient Registered',
    details: `Registered ${name} (${generatedMrn})`,
    status: 'Success',
    patientName: name,
  });

  return res.status(201).json({ success: true, patient: newPatient });
};

export const updatePatient = (req, res) => {
  const { id } = req.params;
  const updated = db.patients.update(id, req.body);

  if (!updated) {
    return res.status(404).json({ success: false, message: `Patient with ID ${id} not found` });
  }

  db.auditLogs.create({
    action: 'Patient Chart Updated',
    details: `Updated clinical chart for ${updated.name}`,
    status: 'Success',
    patientName: updated.name,
  });

  return res.json({ success: true, patient: updated });
};
