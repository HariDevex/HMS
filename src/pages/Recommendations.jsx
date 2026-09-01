import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import Modal from '../components/ui/Modal';
import { Field, Input, Textarea } from '../components/ui/Field';
import { recommendations } from '../data/mock';
import { useApp } from '../context/AppContext';

export default function Recommendations() {
  const [query, setQuery] = useState('');
  const [openNew, setOpenNew] = useState(false);

  const filtered = recommendations.filter((r) => !query || r.patient.toLowerCase().includes(query.toLowerCase()) || r.diagnosis.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <PageHeader
        title="Doctor Recommendations"
        subtitle="Clinical recommendations and follow-up plans."
        actions={
          <button className="btn-primary" onClick={() => setOpenNew(true)}><Plus size={16} /> New Recommendation</button>
        }
      />

      <div className="relative max-w-xs mb-6">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-secondary" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search recommendations…" className="input pl-10" aria-label="Search" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((r) => (
          <div key={r.id} className="card p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar initials={r.doctor.split(' ').map((n) => n[0]).join('')} size="sm" />
                <div>
                  <p className="text-body font-semibold text-ink">{r.doctor}</p>
                  <p className="text-small text-ink-secondary">{r.date} · {r.patient}</p>
                </div>
              </div>
              <Badge color="warning">{r.diagnosis}</Badge>
            </div>

            <div className="rounded-input bg-surface border border-line p-4 flex-1">
              <p className="text-small font-semibold text-ink mb-1.5">Clinical Notes</p>
              <p className="text-body text-ink-secondary leading-relaxed">{r.notes}</p>
            </div>

            <p className="text-small font-semibold text-ink mt-4 mb-2">Recommendations</p>
            <ul className="space-y-2">
              {r.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2.5 text-body text-ink">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                  {rec}
                </li>
              ))}
            </ul>

            <div className="mt-4 pt-4 border-t border-line space-y-2">
              <div>
                <p className="text-small font-semibold text-ink mb-0.5">Medication Instructions</p>
                <p className="text-body text-ink-secondary">{r.medicationInstructions}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge color="primary"><span className="inline-flex items-center gap-1">Follow-up: {r.followUp}</span></Badge>
              </div>
            </div>
          </div>
        ))}
      </div>

      <NewRecommendationModal open={openNew} onClose={() => setOpenNew(false)} />
    </div>
  );
}

function NewRecommendationModal({ open, onClose }) {
  const { pushToast } = useApp();
  return (
    <Modal open={open} onClose={onClose} title="New Recommendation" subtitle="Record clinical recommendation & follow-up" size="lg"
      footer={<>
        <button className="btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn-primary" onClick={() => { pushToast('Recommendation recorded', 'success'); onClose(); }}>Save Recommendation</button>
      </>}>
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Patient"><Input placeholder="Patient name" /></Field>
          <Field label="Diagnosis"><Input placeholder="Diagnosis" /></Field>
          <Field label="Follow-up date"><Input type="date" /></Field>
        </div>
        <Field label="Clinical notes"><Textarea placeholder="Detailed clinical notes and observations" /></Field>
        <Field label="Recommendations"><Textarea placeholder="One recommendation per line" hint="Each line becomes a separate recommendation item" /></Field>
        <Field label="Medication instructions"><Textarea placeholder="Prescribing and dosing instructions" /></Field>
      </div>
    </Modal>
  );
}
