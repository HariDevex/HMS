import { db } from '../data/inMemoryDb.js';

export const getLabOrders = (req, res) => {
  const { status, patientId, search } = req.query;
  let orders = db.labOrders.find();

  if (status && status !== 'All') {
    orders = orders.filter((o) => o.status === status);
  }

  if (patientId) {
    orders = orders.filter((o) => o.patientId === patientId);
  }

  if (search) {
    const q = search.toLowerCase();
    orders = orders.filter(
      (o) =>
        o.testName.toLowerCase().includes(q) ||
        o.patientName.toLowerCase().includes(q) ||
        o.orderNumber.toLowerCase().includes(q) ||
        (o.sampleBarcode && o.sampleBarcode.toLowerCase().includes(q))
    );
  }

  return res.json({ success: true, count: orders.length, labOrders: orders });
};

export const getLabOrderById = (req, res) => {
  const { id } = req.params;
  const order = db.labOrders.findById(id);

  if (!order) {
    return res.status(404).json({ success: false, message: `Lab order ${id} not found` });
  }

  return res.json({ success: true, labOrder: order });
};

export const createLabOrder = (req, res) => {
  const { patientId, testName, priority, department, sampleType, notes, parameters, pdfReport } = req.body;

  const patient = patientId ? db.patients.findById(patientId) : null;
  const generatedOrderNum = `ORD-LAB-${Math.floor(4000 + Math.random() * 5000)}`;

  const defaultParams = [
    { name: 'Primary Diagnostic Marker', value: 'Within Normal Limits', unit: '', refRange: 'Standard Reference', flag: 'Normal' },
    { name: 'Secondary Biochemical Marker', value: 'Negative', unit: '', refRange: 'Negative', flag: 'Normal' },
  ];

  const newOrder = db.labOrders.create({
    id: `LAB-${Math.floor(900 + Math.random() * 900)}`,
    orderNumber: generatedOrderNum,
    patientId: patientId || 'PAT-101',
    patientName: patient ? patient.name : 'Registered Inpatient',
    patientMrn: patient ? patient.mrn : 'MC-2026-XXXX',
    age: patient ? patient.age : 50,
    gender: patient ? patient.gender : 'Unknown',
    orderedBy: req.body.orderedBy || 'Dr. Sarah Jenkins, MD',
    orderDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
    priority: priority || 'Routine',
    department: department || 'Clinical Pathology',
    testName: testName || 'Diagnostic Panel',
    sampleType: sampleType || 'Venous Blood',
    sampleBarcode: `SMP-2026-${Math.floor(10000 + Math.random() * 90000)}`,
    status: 'Result Ready',
    parameters: parameters || defaultParams,
    pdfReport: pdfReport || {
      fileName: `Certified_Lab_Report_${generatedOrderNum}.pdf`,
      fileSize: '1.4 MB',
      pages: 2,
      uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      uploadedBy: 'Automated Analyzer Core',
    },
    technicianComment: notes || '',
  });

  db.auditLogs.create({
    action: 'Lab Test Ordered',
    details: `Ordered ${newOrder.testName} (${newOrder.priority})`,
    status: 'Success',
    patientName: newOrder.patientName,
  });

  return res.status(201).json({ success: true, labOrder: newOrder });
};

export const verifyLabOrder = (req, res) => {
  const { id } = req.params;
  const { parameters, technicianComment, pdfReport, verifiedBy } = req.body;

  const existing = db.labOrders.findById(id);
  if (!existing) {
    return res.status(404).json({ success: false, message: `Lab order ${id} not found` });
  }

  const updated = db.labOrders.update(id, {
    status: 'Verified',
    parameters: parameters || existing.parameters,
    technicianComment: technicianComment || existing.technicianComment,
    verifiedBy: verifiedBy || 'Alex Morgan, MLS (Clinical Pathology)',
    verifiedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    pdfReport: pdfReport || existing.pdfReport || {
      fileName: `Certified_Lab_Report_${existing.orderNumber}.pdf`,
      fileSize: '1.4 MB',
      pages: 2,
      uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      uploadedBy: 'Alex Morgan, MLS',
    },
  });

  db.auditLogs.create({
    action: 'Lab Result Verified',
    details: `Order ${existing.orderNumber} verified and published with certified PDF`,
    status: 'Success',
    patientName: existing.patientName,
  });

  return res.json({ success: true, labOrder: updated });
};
