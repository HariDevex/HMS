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

      <div className="hdx_grid hdx_grid-cols-1 hdx_lg_grid-cols-3 hdx_gap-4">
        <div className="hdx_lg_col-span-1">
          <div className="card">
            <div className="hdx_p-4 hdx_border-b hdx_border-line hdx_relative">
              <Search size={16} className="hdx_absolute hdx_left-7 hdx_top-4 hdx_z-10 hdx_h-4 hdx_w-4 hdx_text-ink-secondary" style={{ left: '1.75rem' }} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search prescriptions…" className="input hdx_pl-10" aria-label="Search" />
            </div>
            <div className="hdx_divide-y hdx_divide-line">
              {filtered.map((p) => (
                <button key={p.id} onClick={() => setActive(p)} className={`hdx_w-full hdx_text-left hdx_px-4 hdx_py-3.5 hdx_transition-colors ${active?.id === p.id ? 'hdx_bg-primary-light' : 'hdx_hover_bg-slate-50'}`}>
                  <div className="hdx_flex hdx_items-center hdx_justify-between">
                    <p className={`hdx_text-body hdx_font-semibold ${active?.id === p.id ? 'hdx_text-primary' : 'hdx_text-ink'}`}>{p.patient}</p>
                    {active?.id === p.id && <ChevronDown size={16} className="hdx_text-primary hdx_transform hdx_rotate-neg90" />}
                  </div>
                  <p className="hdx_text-small hdx_text-ink-secondary hdx_mt-0.5">{p.id} · {p.date}</p>
                  <p className="hdx_text-small hdx_text-ink-secondary hdx_mt-0.5">{p.diagnosis}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="hdx_lg_col-span-2">
          <div className="card print-area">
            <div className="hdx_p-6 hdx_border-b hdx_border-line hdx_flex hdx_items-start hdx_justify-between">
              <div>
                <h2 className="hdx_text-xl hdx_font-bold hdx_text-ink">MediCore Hospital</h2>
                <p className="hdx_text-small hdx_text-ink-secondary hdx_mt-1">484 Meridian Health Blvd · San Jose, CA 95100</p>
                <p className="hdx_text-small hdx_text-ink-secondary">Phone +1 (555) 010-1000 · Rx Department</p>
              </div>
              <Badge color="primary">Prescription</Badge>
            </div>
            <div className="hdx_p-6">
              <div className="hdx_grid hdx_grid-cols-2 hdx_sm_grid-cols-4 hdx_gap-4 hdx_pb-5 hdx_border-b hdx_border-dashed hdx_border-line">
                {[
                  { l: 'Prescription', v: active.id },
                  { l: 'Patient', v: active.patient },
                  { l: 'Doctor', v: active.doctor },
                  { l: 'Date', v: active.date },
                ].map((f) => (
                  <div key={f.l}><p className="hdx_text-small hdx_text-ink-secondary hdx_mb-1">{f.l}</p><p className="hdx_text-body hdx_font-semibold hdx_text-ink">{f.v}</p></div>
                ))}
              </div>
              <div className="hdx_mt-5">
                <p className="hdx_text-small hdx_text-ink-secondary hdx_mb-1">Diagnosis</p>
                <p className="hdx_text-body hdx_font-medium hdx_text-ink hdx_bg-surface hdx_rounded-input hdx_px-3 hdx_py-2 hdx_border hdx_border-line">{active.diagnosis}</p>
              </div>

              <div className="hdx_mt-5">
                <p className="hdx_text-card-title hdx_text-ink hdx_mb-3">Medications</p>
                <div className="hdx_rounded-card hdx_border hdx_border-line hdx_overflow-hidden">
                  <table className="hdx_w-full">
                    <thead>
                      <tr className="hdx_bg-slate-50 hdx_border-b hdx_border-line">
                        <th className="th">Medicine</th><th className="th">Dosage</th><th className="th">Frequency</th><th className="th">Duration</th><th className="th">Instructions</th>
                      </tr>
                    </thead>
                    <tbody className="hdx_divide-y hdx_divide-line">
                      {active.medications.map((m, i) => (
                        <tr key={i}>
                          <td className="td hdx_font-semibold">{m.name}</td>
                          <td className="td hdx_text-ink-secondary">{m.dosage}</td>
                          <td className="td hdx_text-ink-secondary">{m.frequency}</td>
                          <td className="td hdx_text-ink-secondary">{m.duration}</td>
                          <td className="td hdx_text-ink-secondary">{m.instructions}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="hdx_mt-5 hdx_pt-5 hdx_border-t hdx_border-dashed hdx_border-line hdx_flex hdx_flex-wrap hdx_items-center hdx_justify-between">
                <div>
                  <p className="hdx_text-small hdx_text-ink-secondary hdx_mb-1">Follow-up visit</p>
                  <p className="hdx_text-body hdx_font-semibold hdx_text-primary">{active.followUp}</p>
                </div>
                <div className="hdx_text-center">
                  <p className="hdx_text-body hdx_font-semibold hdx_text-ink">{active.doctor}</p>
                  <p className="hdx_text-small hdx_text-ink-secondary">Attending Physician</p>
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
      <div className="hdx_space-y-5">
        <div className="hdx_grid hdx_grid-cols-1 hdx_sm_grid-cols-2 hdx_gap-4">
          <Field label="Patient"><Select><option>Amelia Rodriguez</option><option>James Okafor</option><option>Sofia Martinez</option></Select></Field>
          <Field label="Doctor"><Select><option>Dr. Sarah Chen</option><option>Dr. Emily Park</option><option>Dr. David Kumar</option></Select></Field>
        </div>
        <Field label="Diagnosis"><Input placeholder="Primary diagnosis" /></Field>
        <div>
          <div className="hdx_flex hdx_items-center hdx_justify-between hdx_mb-3">
            <span className="hdx_text-card-title hdx_text-ink">Medications</span>
            <button type="button" className="btn-secondary !h-9 !px-3 !text-small" onClick={() => setMeds([...meds, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }])}>
              <Plus size={14} /> Add medicine
            </button>
          </div>
          <div className="hdx_space-y-4">
            {meds.map((m, i) => (
              <div key={i} className="hdx_rounded-card hdx_border hdx_border-line hdx_p-4 hdx_grid hdx_grid-cols-1 hdx_sm_grid-cols-5 hdx_gap-3">
                <Field label="Medicine" className="hdx_sm_col-span-2"><Input placeholder="Name" value={m.name} onChange={(e) => setMed(i, 'name', e.target.value)} /></Field>
                <Field label="Dosage"><Input placeholder="e.g. 500mg" value={m.dosage} onChange={(e) => setMed(i, 'dosage', e.target.value)} /></Field>
                <Field label="Frequency"><Input placeholder="e.g. 3x daily" value={m.frequency} onChange={(e) => setMed(i, 'frequency', e.target.value)} /></Field>
                <Field label="Duration"><Input placeholder="e.g. 2 weeks" value={m.duration} onChange={(e) => setMed(i, 'duration', e.target.value)} /></Field>
                <Field label="Instructions" className="hdx_sm_col-span-5"><Input placeholder="e.g. Take after meals" value={m.instructions} onChange={(e) => setMed(i, 'instructions', e.target.value)} /></Field>
              </div>
            ))}
          </div>
        </div>
        <div className="hdx_grid hdx_grid-cols-1 hdx_sm_grid-cols-2 hdx_gap-4">
          <Field label="Follow-up date"><Input type="date" /></Field>
          <Field label="Notes"><Textarea placeholder="Additional clinical notes" /></Field>
        </div>
      </div>
    </Modal>
  );
}
