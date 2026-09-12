import { db } from '../db/sqliteClient.js';

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
  const data = db.getReportsSummary();

  return res.json({
    success: true,
    data: {
      ...data,
      departmentOccupancy: [
        { name: 'Cardiology', occupancy: 85 },
        { name: 'ICU', occupancy: 92 },
        { name: 'Surgical', occupancy: 70 },
        { name: 'General Ward', occupancy: 65 },
      ],
    },
  });
};
