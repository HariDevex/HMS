import { db } from '../db/db.js';

export const getAppointments = (req, res) => {
  const { date, doctorId, patientId, status } = req.query;
  let appointments = db.appointments.find();

  if (date) {
    appointments = appointments.filter((a) => a.date === date);
  }

  if (doctorId) {
    appointments = appointments.filter((a) => a.doctorId === doctorId);
  }

  if (patientId) {
    appointments = appointments.filter((a) => a.patientId === patientId);
  }

  if (status && status !== 'All') {
    appointments = appointments.filter((a) => a.status === status);
  }

  return res.json({ success: true, count: appointments.length, appointments });
};

export const createAppointment = (req, res) => {
  const { patientId, doctorId, date, time, type, reason, notes, department } = req.body;

  const patient = patientId ? db.patients.findById(patientId) : null;
  const doctor = doctorId ? db.users.findById(doctorId) : null;

  const generatedToken = `T-${Math.floor(100 + Math.random() * 900)}`;

  const newApt = db.appointments.create({
    id: `APT-${Math.floor(100 + Math.random() * 900)}`,
    patientId: patientId || 'PAT-101',
    patientName: patient ? patient.name : 'Outpatient Intake',
    patientMrn: patient ? patient.mrn : 'MC-2026-XXXX',
    doctorId: doctorId || 'USR-002',
    doctorName: doctor ? doctor.name : 'Dr. Sarah Jenkins, MD',
    department: department || (doctor ? doctor.department : 'General Consultation'),
    date: date || new Date().toISOString().split('T')[0],
    time: time || '11:00 AM',
    durationMins: 30,
    type: type || 'Consultation',
    status: 'Confirmed',
    tokenNumber: generatedToken,
    reason: reason || 'Clinical Consultation',
    notes: notes || '',
  });

  return res.status(201).json({ success: true, appointment: newApt });
};

export const updateAppointmentStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const existing = db.appointments.findById(id);
  if (!existing) {
    return res.status(404).json({ success: false, message: `Appointment ${id} not found` });
  }

  const updated = db.appointments.update(id, { status });
  return res.json({ success: true, appointment: updated });
};
