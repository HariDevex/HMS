import { useState } from 'react';
import { Plus, Printer, Search, ChevronDown } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { Field, Input, Select, Textarea } from '../components/ui/Field';
import { prescriptions } from '../data/mock';
import { useApp } from '../context/AppContext';

export default function Prescriptions() {
  const { pushToast } = useApp();
  const [query, setQuery] = useState('');
  const [openNew, setOpenNew] = useState(false);
  const [active, setActive] = useState(prescriptions[0]);

  const filtered = prescriptions.filter(
    (p) => !query || p.patient.toLowerCase().includes(query.toLowerCase()) || p.id.toLowerCase().includes(query.toLowerCase())
  );

  const print = () => {
    pushToast('Sending to printer', 'info');
    window.print();
  };

  return (
    <div>
      <PageHeader
        title="Prescriptions"
        subtitle="Create, manage and print digital prescriptions."
        actions={
          <>
            <button className="btn-secondary" onClick={print}><Printer size={16} /> Print Preview</button>
            <button className="btn-primary" onClick={() => setOpenNew(true)}><Plus size={16} /> New Prescription</button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          <div className="card">
            <div className="p-4 border-b border-line relative">
              <Search size={16} className="absolute left-7 top-4 z-10 h-4 w-4 text-ink-secondary" style={{ left: '1.75rem' }} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search prescriptions…" className="input pl-10" aria-label="Search" />
            </div>
            <div className="divide-y divide-line">
              {filtered.map((p) => (
                <button key={p.id} onClick={() => setActive(p)} className={`w-full text-left px-4 py-3.5 transition-colors ${active?.id === p.id ? 'bg-primary-light' : 'hover:bg-slate-50'}`}>
                  <div className="flex items-center justify-between">
                    <p className={`text-body font-semibold ${active?.id === p.id ? 'text-primary' : 'text-ink'}`}>{p.patient}</p>
                    {active?.id === p.id && <ChevronDown size={16} className="text-primary rotate-[-90deg]" />}
                  </div>
                  <p className="text-small text-ink-secondary mt-0.5">{p.id} · {p.date}</p>
                  <p className="text-small text-ink-secondary mt-0.5">{p.diagnosis}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="card print-area">
            <div className="p-6 border-b border-line flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-ink">MediCore Hospital</h2>
                <p className="text-small text-ink-secondary mt-1">484 Meridian Health Blvd · San Jose, CA 95100</p>
                <p className="text-small text-ink-secondary">Phone +1 (555) 010-1000 · Rx Department</p>
              </div>
              <Badge color="primary">Prescription</Badge>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-5 border-b border-dashed border-line">
                {[
                  { l: 'Prescription', v: active.id },
                  { l: 'Patient', v: active.patient },
                  { l: 'Doctor', v: active.doctor },
                  { l: 'Date', v: active.date },
                ].map((f) => (
                  <div key={f.l}><p className="text-small text-ink-secondary mb-1">{f.l}</p><p className="text-body font-semibold text-ink">{f.v}</p></div>
                ))}
              </div>
              <div className="mt-5">
                <p className="text-small text-ink-secondary mb-1">Diagnosis</p>
                <p className="text-body font-medium text-ink bg-surface rounded-input px-3 py-2 border border-line">{active.diagnosis}</p>
              </div>

              <div className="mt-5">
                <p className="text-card-title text-ink mb-3">Medications</p>
                <div className="rounded-card border border-line overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 border-b border-line">
                        <th className="th">Medicine</th><th className="th">Dosage</th><th className="th">Frequency</th><th className="th">Duration</th><th className="th">Instructions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {active.medications.map((m, i) => (
                        <tr key={i}>
                          <td className="td font-semibold">{m.name}</td>
                          <td className="td text-ink-secondary">{m.dosage}</td>
                          <td className="td text-ink-secondary">{m.frequency}</td>
                          <td className="td text-ink-secondary">{m.duration}</td>
                          <td className="td text-ink-secondary">{m.instructions}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-dashed border-line flex flex-wrap items-center justify-between">
                <div>
                  <p className="text-small text-ink-secondary mb-1">Follow-up visit</p>
                  <p className="text-body font-semibold text-primary">{active.followUp}</p>
                </div>
                <div className="text-center">
                  <p className="text-body font-semibold text-ink">{active.doctor}</p>
                  <p className="text-small text-ink-secondary">Attending Physician</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <NewPrescriptionModal open={openNew} onClose={() => setOpenNew(false)} />
    </div>
  );
}

function NewPrescriptionModal({ open, onClose }) {
  const { pushToast } = useApp();
  const [meds, setMeds] = useState([{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  const setMed = (i, k, v) => setMeds(meds.map((m, idx) => (idx === i ? { ...m, [k]: v } : m)));
  return (
    <Modal open={open} onClose={onClose} title="New Prescription" subtitle="Issue a digital prescription" size="lg"
      footer={<>
        <button className="btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn-primary" onClick={() => { pushToast('Prescription issued', 'success'); onClose(); }}>Issue Prescription</button>
      </>}>
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Patient"><Select><option>Amelia Rodriguez</option><option>James Okafor</option><option>Sofia Martinez</option></Select></Field>
          <Field label="Doctor"><Select><option>Dr. Sarah Chen</option><option>Dr. Emily Park</option><option>Dr. David Kumar</option></Select></Field>
        </div>
        <Field label="Diagnosis"><Input placeholder="Primary diagnosis" /></Field>
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-card-title text-ink">Medications</span>
            <button type="button" className="btn-secondary !h-9 !px-3 !text-small" onClick={() => setMeds([...meds, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }])}>
              <Plus size={14} /> Add medicine
            </button>
          </div>
          <div className="space-y-4">
            {meds.map((m, i) => (
              <div key={i} className="rounded-card border border-line p-4 grid grid-cols-1 sm:grid-cols-5 gap-3">
                <Field label="Medicine" className="sm:col-span-2"><Input placeholder="Name" value={m.name} onChange={(e) => setMed(i, 'name', e.target.value)} /></Field>
                <Field label="Dosage"><Input placeholder="e.g. 500mg" value={m.dosage} onChange={(e) => setMed(i, 'dosage', e.target.value)} /></Field>
                <Field label="Frequency"><Input placeholder="e.g. 3x daily" value={m.frequency} onChange={(e) => setMed(i, 'frequency', e.target.value)} /></Field>
                <Field label="Duration"><Input placeholder="e.g. 2 weeks" value={m.duration} onChange={(e) => setMed(i, 'duration', e.target.value)} /></Field>
                <Field label="Instructions" className="sm:col-span-5"><Input placeholder="e.g. Take after meals" value={m.instructions} onChange={(e) => setMed(i, 'instructions', e.target.value)} /></Field>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Follow-up date"><Input type="date" /></Field>
          <Field label="Notes"><Textarea placeholder="Additional clinical notes" /></Field>
        </div>
      </div>
    </Modal>
  );
}
