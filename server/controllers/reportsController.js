import { db } from '../data/inMemoryDb.js';

export const getAuditLogs = (req, res) => {
  const { status, action } = req.query;
  let logs = db.auditLogs.find();

  if (status && status !== 'All') {
    logs = logs.filter((l) => l.status === status);
  }

  if (action) {
    logs = logs.filter((l) => l.action.toLowerCase().includes(action.toLowerCase()));
  }

  return res.json({ success: true, count: logs.length, auditLogs: logs });
};

export const createAuditLog = (req, res) => {
  const { action, details, status, patientName } = req.body;
  const newLog = db.auditLogs.create({
    action: action || 'System Event',
    details: details || '',
    status: status || 'Info',
    patientName: patientName || null,
    ipAddress: req.ip || '127.0.0.1',
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
  });

  return res.status(201).json({ success: true, auditLog: newLog });
};

export const getReportsSummary = (req, res) => {
  const patientsCount = db.patients.find().length;
  const appointmentsCount = db.appointments.find().length;
  const totalLabs = db.labOrders.find().length;
  const radOrdersCount = db.radiologyOrders.find().length;
  const beds = db.beds.find();
  const occupiedBeds = beds.filter((b) => b.status === 'Occupied').length;
  const bedOccupancyRate = beds.length > 0 ? Math.round((occupiedBeds / beds.length) * 100) : 0;

  const invoices = db.invoices.find();
  const totalRevenue = invoices.reduce((sum, i) => sum + (i.paidAmount || 0), 0);

  return res.json({
    success: true,
    data: {
      totalPatients: patientsCount,
      totalAppointments: appointmentsCount,
      totalLabs,
      pendingLabs: db.labOrders.find((l) => l.status !== 'Verified').length,
      verifiedLabs: db.labOrders.find((l) => l.status === 'Verified').length,
      totalScans: radOrdersCount,
      bedOccupancyRate: `${bedOccupancyRate}%`,
      totalRevenue: `$${totalRevenue.toLocaleString()}`,
      departmentOccupancy: [
        { name: 'Cardiology', occupancy: 85 },
        { name: 'ICU', occupancy: 92 },
        { name: 'Surgical', occupancy: 70 },
        { name: 'General Ward', occupancy: 65 },
      ],
    },
  });
};
