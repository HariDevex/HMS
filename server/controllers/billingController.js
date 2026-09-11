import { db } from '../data/inMemoryDb.js';

export const getInvoices = (req, res) => {
  const { status, patientId } = req.query;
  let invoices = db.invoices.find();

  if (status && status !== 'All') {
    invoices = invoices.filter((inv) => inv.status === status);
  }

  if (patientId) {
    invoices = invoices.filter((inv) => inv.patientId === patientId);
  }

  const totalBilled = invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
  const totalCollected = invoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0);
  const pendingAmount = invoices.reduce(
    (sum, inv) => (inv.status === 'Pending' || inv.status === 'Partially Paid' ? sum + (inv.patientPayable - inv.paidAmount) : sum),
    0
  );

  return res.json({
    success: true,
    count: invoices.length,
    summary: {
      totalBilled,
      totalCollected,
      pendingAmount,
    },
    invoices,
  });
};

export const getInvoiceById = (req, res) => {
  const { id } = req.params;
  const invoice = db.invoices.findById(id);

  if (!invoice) {
    return res.status(404).json({ success: false, message: `Invoice ${id} not found` });
  }

  return res.json({ success: true, invoice });
};

export const recordPayment = (req, res) => {
  const { id } = req.params;
  const { amount, paymentMethod } = req.body;

  const invoice = db.invoices.findById(id);
  if (!invoice) {
    return res.status(404).json({ success: false, message: `Invoice ${id} not found` });
  }

  const newPaidAmount = (invoice.paidAmount || 0) + Number(amount || 0);
  const isFullyPaid = newPaidAmount >= invoice.patientPayable;

  const updated = db.invoices.update(id, {
    paidAmount: newPaidAmount,
    status: isFullyPaid ? 'Paid' : 'Partially Paid',
    paymentMethod: paymentMethod || invoice.paymentMethod,
  });

  db.auditLogs.create({
    action: 'Payment Processed',
    details: `Processed ₹${amount} for invoice ${invoice.invoiceNumber} via ${paymentMethod || 'Card'}`,
    status: 'Success',
    patientName: invoice.patientName,
  });

  return res.json({ success: true, invoice: updated });
};
