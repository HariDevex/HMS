import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Card, { CardHeader } from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Field, { Input, Select } from '../../components/ui/Field';
import {
  DollarSign,
  ReceiptText,
  CreditCard,
  Printer,
  CheckCircle2,
  Clock,
  Search,
} from 'lucide-react';

export default function BillingDashboard() {
  const { invoices, recordPayment, addToast } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedInvoice, setSelectedInvoice] = useState(null); // For Invoice Preview & Print
  const [paymentModalInvoice, setPaymentModalInvoice] = useState(null); // For Record Payment
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');

  const totalBilled = invoices.reduce((acc, i) => acc + i.subtotal, 0);
  const totalPaid = invoices.reduce((acc, i) => acc + i.paidAmount, 0);
  const totalBalance = invoices.reduce((acc, i) => acc + i.balanceDue, 0);

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.patientMrn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleProcessPayment = (e) => {
    e.preventDefault();
    if (!paymentModalInvoice || !paymentAmount) return;
    recordPayment(paymentModalInvoice.id, paymentAmount, paymentMethod);
    setPaymentModalInvoice(null);
    setPaymentAmount('');
  };

  const columns = [
    {
      key: 'invoiceNumber',
      label: 'Invoice #',
      sortable: true,
      render: (val) => <span className="font-mono font-bold text-xs text-slate-800">{val}</span>,
    },
    {
      key: 'patientName',
      label: 'Patient',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-semibold text-slate-900">{val}</span>
          <span className="text-xs text-slate-400 block font-mono">{row.patientMrn}</span>
        </div>
      ),
    },
    {
      key: 'date',
      label: 'Date & Due',
      render: (val, row) => (
        <div className="text-xs">
          <span className="text-slate-700 block">{val}</span>
          <span className="text-slate-400">Due: {row.dueDate}</span>
        </div>
      ),
    },
    {
      key: 'subtotal',
      label: 'Total Billed',
      sortable: true,
      render: (val) => <span className="font-mono font-bold text-slate-900">${val.toFixed(2)}</span>,
    },
    {
      key: 'insuranceCovered',
      label: 'Insurance Paid',
      render: (val) => <span className="font-mono text-emerald-700 font-semibold">${val.toFixed(2)}</span>,
    },
    {
      key: 'balanceDue',
      label: 'Patient Balance',
      sortable: true,
      render: (val) => (
        <span className={`font-mono font-bold ${val > 0 ? 'text-error' : 'text-slate-400'}`}>
          ${val.toFixed(2)}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Payment Status',
      render: (val) => {
        const variants = {
          Paid: 'success',
          'Partially Paid': 'warning',
          Pending: 'neutral',
          Cancelled: 'error',
        };
        return <Badge dot variant={variants[val] || 'neutral'}>{val}</Badge>;
      },
    },
    {
      key: 'actions',
      label: 'Action',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            icon={Printer}
            onClick={() => setSelectedInvoice(row)}
          >
            Invoice
          </Button>

          {row.balanceDue > 0 && (
            <Button
              size="sm"
              variant="primary"
              icon={CreditCard}
              onClick={() => {
                setPaymentModalInvoice(row);
                setPaymentAmount(row.balanceDue.toString());
              }}
            >
              Pay
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Revenue Cycle & Cashier Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Itemized hospital bills, medical claims processing, copays, and receipts.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={ReceiptText}
          onClick={() => {
            addToast({
              title: 'Generate Invoice',
              message: 'Billing draft created from active admission encounter.',
              type: 'info',
            });
          }}
        >
          Create New Invoice
        </Button>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Gross Billed"
          value={`$${totalBilled.toLocaleString()}`}
          subtitle="All encounters"
          trend="+8.2% vs last month"
          trendType="up"
          icon={DollarSign}
          iconBg="bg-blue-50 text-primary"
        />
        <StatCard
          title="Collected Revenue"
          value={`$${totalPaid.toLocaleString()}`}
          subtitle="Insurance & copays settled"
          trend="86.5% collection rate"
          trendType="up"
          icon={CheckCircle2}
          iconBg="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="Outstanding Patient Balance"
          value={`$${totalBalance.toLocaleString()}`}
          subtitle="Pending settlement"
          trend="3 accounts active"
          trendType="neutral"
          icon={Clock}
          iconBg="bg-amber-50 text-amber-600"
        />
      </div>

      {/* Filter Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by invoice number, patient name, or MRN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-9 pr-3 text-sm bg-slate-50 rounded-lg border border-slate-300 focus:outline-none focus:border-primary"
            />
          </div>

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'All', label: 'All Invoices' },
              { value: 'Paid', label: 'Paid in Full' },
              { value: 'Partially Paid', label: 'Partially Paid' },
              { value: 'Pending', label: 'Pending Insurance' },
            ]}
          />
        </div>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardHeader
          title={`Hospital Invoices (${filteredInvoices.length})`}
          subtitle="Showing clinical billing encounters and payment settlements"
        />
        <Table
          columns={columns}
          data={filteredInvoices}
          emptyTitle="No invoices found"
          emptyDescription="No billing records match the selected criteria."
        />
      </Card>

      {/* Payment Entry Modal */}
      {paymentModalInvoice && (
        <Modal
          isOpen={Boolean(paymentModalInvoice)}
          onClose={() => setPaymentModalInvoice(null)}
          title="Record Patient Payment / Copay"
          subtitle={`Invoice #${paymentModalInvoice.invoiceNumber} • ${paymentModalInvoice.patientName}`}
          footer={
            <>
              <Button variant="secondary" onClick={() => setPaymentModalInvoice(null)}>Cancel</Button>
              <Button variant="primary" onClick={handleProcessPayment}>Confirm Payment Receipt</Button>
            </>
          }
        >
          <form onSubmit={handleProcessPayment} className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
              <div>
                <span className="text-slate-400 block uppercase font-bold text-[10px]">Total Patient Responsibility</span>
                <span className="font-bold text-slate-900 text-base">${paymentModalInvoice.patientResponsibility.toFixed(2)}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block uppercase font-bold text-[10px]">Current Balance Due</span>
                <span className="font-bold text-error text-base font-mono">${paymentModalInvoice.balanceDue.toFixed(2)}</span>
              </div>
            </div>

            <Field label="Payment Amount ($)" required>
              <Input
                type="number"
                step="0.01"
                required
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
              />
            </Field>

            <Field label="Payment Tender Method" required>
              <Select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                options={[
                  { value: 'Credit Card', label: 'Credit / Debit Card (EMV Chip)' },
                  { value: 'Health Savings Account (HSA)', label: 'Health Savings Account (HSA / FSA)' },
                  { value: 'Cash', label: 'Cash (Cashier Desk)' },
                  { value: 'Insurance Check / Wire', label: 'Insurance Remittance Wire' },
                ]}
              />
            </Field>
          </form>
        </Modal>
      )}

      {/* Printable Invoice Preview Modal */}
      {selectedInvoice && (
        <Modal
          isOpen={Boolean(selectedInvoice)}
          onClose={() => setSelectedInvoice(null)}
          title="Hospital Statement of Account"
          subtitle={`Invoice #${selectedInvoice.invoiceNumber}`}
          footer={
            <>
              <Button variant="secondary" onClick={() => setSelectedInvoice(null)}>Close</Button>
              <Button variant="primary" icon={Printer} onClick={() => window.print()}>
                Print Itemized Statement
              </Button>
            </>
          }
        >
          <div className="space-y-6 text-xs p-2">
            <div className="flex justify-between items-start border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">MediCore Central Hospital</h3>
                <p className="text-slate-500 text-[11px]">100 Medical Parkway, Springfield, IL</p>
                <p className="text-slate-500 text-[11px]">Tax ID: 36-9920192 • NPI: 1049281900</p>
              </div>
              <Badge variant={selectedInvoice.status === 'Paid' ? 'success' : 'warning'}>
                {selectedInvoice.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <p><strong>Billed To:</strong> {selectedInvoice.patientName}</p>
                <p><strong>MRN:</strong> {selectedInvoice.patientMrn}</p>
              </div>
              <div className="text-right">
                <p><strong>Statement Date:</strong> {selectedInvoice.date}</p>
                <p><strong>Due Date:</strong> {selectedInvoice.dueDate}</p>
              </div>
            </div>

            {/* Line items */}
            <div>
              <h4 className="font-bold text-slate-900 uppercase text-[11px] mb-2">Itemized Healthcare Services</h4>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-[10px] font-bold uppercase text-slate-600">
                    <tr>
                      <th className="p-2">Service Description</th>
                      <th className="p-2">Qty</th>
                      <th className="p-2">Unit Price</th>
                      <th className="p-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedInvoice.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-2 font-medium">{item.description}</td>
                        <td className="p-2">{item.quantity}</td>
                        <td className="p-2 font-mono">${item.unitPrice.toFixed(2)}</td>
                        <td className="p-2 text-right font-mono font-bold">${item.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary calculations */}
            <div className="border-t border-slate-200 pt-4 flex justify-end">
              <div className="w-64 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-mono">${selectedInvoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span>Insurance Adjustment:</span>
                  <span className="font-mono">-${selectedInvoice.insuranceCovered.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-200">
                  <span>Patient Responsibility:</span>
                  <span className="font-mono">${selectedInvoice.patientResponsibility.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Payments Received:</span>
                  <span className="font-mono">-${selectedInvoice.paidAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-black text-sm text-error pt-1 border-t border-slate-200">
                  <span>Balance Due:</span>
                  <span className="font-mono">${selectedInvoice.balanceDue.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
