import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Field, { Input } from '../../components/ui/Field';
import { CreditCard, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function PatientBilling() {
  const { selectedPatient, invoices, recordPayment } = useApp();
  const [payModalInvoice, setPayModalInvoice] = useState(null);
  const [amount, setAmount] = useState('');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');

  const myInvoices = invoices.filter((i) => i.patientId === selectedPatient.id);

  const handlePay = (e) => {
    e.preventDefault();
    if (!payModalInvoice) return;
    recordPayment(payModalInvoice.id, amount, 'Online Portal (Credit Card)');
    setPayModalInvoice(null);
  };

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Billing & Medical Statements</h2>
        <p className="text-xs text-slate-500">Secure online bill payment and insurance explanation of benefits</p>
      </div>

      <div className="space-y-4">
        {myInvoices.map((inv) => (
          <Card key={inv.id} className="p-5 border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-slate-500 uppercase">{inv.invoiceNumber}</span>
                <h4 className="text-sm font-bold text-slate-900">Hospital Statement of Account</h4>
                <p className="text-xs text-slate-400">{inv.date} • Due: {inv.dueDate}</p>
              </div>
              <Badge variant={inv.status === 'Paid' ? 'success' : 'warning'}>
                {inv.status}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Total Charges</span>
                <span className="font-bold text-slate-800">₹{inv.subtotal.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-[10px] text-emerald-700 block uppercase">Insurance Paid</span>
                <span className="font-bold text-emerald-600">₹{inv.insuranceCovered.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-[10px] text-red-700 block uppercase">You Owe</span>
                <span className="font-bold text-error font-mono">₹{inv.balanceDue.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 256-Bit Encrypted Payment
              </span>

              {inv.balanceDue > 0 ? (
                <Button
                  size="sm"
                  variant="primary"
                  icon={CreditCard}
                  onClick={() => {
                    setPayModalInvoice(inv);
                    setAmount(inv.balanceDue.toString());
                  }}
                >
                  Pay ₹{inv.balanceDue.toFixed(2)}
                </Button>
              ) : (
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Paid in Full
                </span>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Pay Online Modal */}
      {payModalInvoice && (
        <Modal
          isOpen={Boolean(payModalInvoice)}
          onClose={() => setPayModalInvoice(null)}
          title="Secure Online Payment"
          subtitle={`Paying Statement #${payModalInvoice.invoiceNumber}`}
          footer={
            <>
              <Button variant="secondary" onClick={() => setPayModalInvoice(null)}>Cancel</Button>
              <Button variant="primary" icon={ShieldCheck} onClick={handlePay}>
                Submit Payment of ₹{amount}
              </Button>
            </>
          }
        >
          <form onSubmit={handlePay} className="space-y-4 text-xs">
            <Field label="Payment Amount (₹)" required>
              <Input
                type="number"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Field>

            <Field label="Card Number (Demo Mock)" required>
              <Input
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                required
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Expiration Date" required>
                <Input defaultValue="12/28" required />
              </Field>
              <Field label="CVC Code" required>
                <Input defaultValue="982" required />
              </Field>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
