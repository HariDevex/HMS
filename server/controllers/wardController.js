import { db } from '../db/db.js';

export const getWards = (req, res) => {
  const wards = db.wards.find();
  const beds = db.beds.find();

  const wardsWithStats = wards.map((w) => {
    const wardBeds = beds.filter((b) => b.wardId === w.id);
    const occupied = wardBeds.filter((b) => b.status === 'Occupied').length;
    const available = wardBeds.filter((b) => b.status === 'Available').length;
    return {
      ...w,
      occupiedBeds: occupied,
      availableBeds: available,
      occupancyRate: wardBeds.length > 0 ? Math.round((occupied / wardBeds.length) * 100) : 0,
    };
  });

  return res.json({ success: true, count: wardsWithStats.length, wards: wardsWithStats });
};

export const getBeds = (req, res) => {
  const { wardId, status } = req.query;
  let beds = db.beds.find();

  if (wardId && wardId !== 'All') {
    beds = beds.filter((b) => b.wardId === wardId);
  }

  if (status && status !== 'All') {
    beds = beds.filter((b) => b.status === status);
  }

  return res.json({ success: true, count: beds.length, beds });
};

export const assignBed = (req, res) => {
  const { bedId } = req.params;
  const { patientId } = req.body;

  const bed = db.beds.findById(bedId);
  if (!bed) return res.status(404).json({ success: false, message: `Bed ${bedId} not found` });

  const patient = db.patients.findById(patientId);
  if (!patient) return res.status(404).json({ success: false, message: `Patient ${patientId} not found` });

  const updatedBed = db.beds.update(bedId, {
    status: 'Occupied',
    patientId,
    patientName: patient.name,
    assignedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
  });

  db.patients.update(patientId, {
    wardId: bed.wardId,
    bedId,
    bed: `Bed ${bed.bedNumber}`,
    status: 'Admitted',
  });

  return res.json({ success: true, bed: updatedBed });
};

export const updateBedStatus = (req, res) => {
  const { bedId } = req.params;
  const { status } = req.body;

  const bed = db.beds.findById(bedId);
  if (!bed) return res.status(404).json({ success: false, message: `Bed ${bedId} not found` });

  const updated = db.beds.update(bedId, {
    status,
    patientId: status === 'Available' || status === 'Cleaning' ? null : bed.patientId,
    patientName: status === 'Available' || status === 'Cleaning' ? null : bed.patientName,
  });

  return res.json({ success: true, bed: updated });
};
