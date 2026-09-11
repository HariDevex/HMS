import { db } from '../data/inMemoryDb.js';

export const getPatientVitals = (req, res) => {
  const { patientId } = req.params;
  const patient = db.patients.findById(patientId);

  if (!patient) {
    return res.status(404).json({ success: false, message: `Patient ${patientId} not found` });
  }

  // Simulated trend history for patient
  const vitalsTrend = [
    { time: '08:00', systolic: 148, diastolic: 92, hr: 90, spo2: 95 },
    { time: '12:00', systolic: 142, diastolic: 88, hr: 84, spo2: 97 },
    { time: '16:00', systolic: 136, diastolic: 84, hr: 80, spo2: 98 },
    { time: '20:00', systolic: 130, diastolic: 82, hr: 76, spo2: 98 },
    { time: '08:00 (Today)', systolic: 128, diastolic: 80, hr: 74, spo2: 99 },
  ];

  return res.json({ success: true, patientId, vitals: patient.vitals || null, vitalsTrend });
};

export const recordVitals = (req, res) => {
  const { patientId } = req.params;
  const { bp, systolic, diastolic, heartRate, temperature, tempUnit, respRate, oxygenSaturation, painLevel, weight, height, notes } = req.body;

  const patient = db.patients.findById(patientId);
  if (!patient) {
    return res.status(404).json({ success: false, message: `Patient ${patientId} not found` });
  }

  // Compute BMI if weight and height provided
  let bmi = 24.2;
  const wNum = parseFloat(weight);
  const hNum = parseFloat(height);
  if (wNum && hNum) {
    const heightM = hNum > 3 ? hNum / 100 : hNum;
    bmi = Number((wNum / (heightM * heightM)).toFixed(1));
  }

  const newVitalsRecord = {
    recordedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    bp: bp || `${systolic || 120}/${diastolic || 80}`,
    systolic: Number(systolic || 120),
    diastolic: Number(diastolic || 80),
    heartRate: Number(heartRate || 72),
    temperature: Number(temperature || 98.6),
    tempUnit: tempUnit || '°F',
    respRate: Number(respRate || 16),
    oxygenSaturation: Number(oxygenSaturation || 99),
    painLevel: Number(painLevel || 0),
    weight: weight || '72 kg',
    height: height || '175 cm',
    bmi,
    notes: notes || '',
  };

  db.patients.update(patientId, { vitals: newVitalsRecord });

  db.auditLogs.create({
    action: 'Vitals Recorded',
    details: `BP ${newVitalsRecord.bp}, HR ${newVitalsRecord.heartRate}, SpO2 ${newVitalsRecord.oxygenSaturation}%`,
    status: 'Success',
    patientName: patient.name,
  });

  return res.status(201).json({ success: true, vitals: newVitalsRecord });
};
