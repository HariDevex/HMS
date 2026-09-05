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

      <div className="hdx_relative hdx_max-w-xs hdx_mb-6">
        <Search size={16} className="hdx_absolute hdx_left-3.5 hdx_top-1/2 hdx_transform hdx_translate-y--1/2 hdx_text-ink-secondary" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search recommendations…" className="input hdx_pl-10" aria-label="Search" />
      </div>

      <div className="hdx_grid hdx_grid-cols-1 hdx_lg_grid-cols-2 hdx_gap-4">
        {filtered.map((r) => (
          <div key={r.id} className="card hdx_p-6 hdx_flex hdx_flex-col">
            <div className="hdx_flex hdx_items-center hdx_justify-between hdx_mb-4">
              <div className="hdx_flex hdx_items-center hdx_gap-3">
                <Avatar initials={r.doctor.split(' ').map((n) => n[0]).join('')} size="sm" />
                <div>
                  <p className="hdx_text-body hdx_font-semibold hdx_text-ink">{r.doctor}</p>
                  <p className="hdx_text-small hdx_text-ink-secondary">{r.date} · {r.patient}</p>
                </div>
              </div>
              <Badge color="warning">{r.diagnosis}</Badge>
            </div>

            <div className="hdx_rounded-input hdx_bg-surface hdx_border hdx_border-line hdx_p-4 hdx_flex-1">
              <p className="hdx_text-small hdx_font-semibold hdx_text-ink hdx_mb-1.5">Clinical Notes</p>
              <p className="hdx_text-body hdx_text-ink-secondary hdx_leading-relaxed">{r.notes}</p>
            </div>

            <p className="hdx_text-small hdx_font-semibold hdx_text-ink hdx_mt-4 hdx_mb-2">Recommendations</p>
            <ul className="hdx_space-y-2">
              {r.recommendations.map((rec, i) => (
                <li key={i} className="hdx_flex hdx_items-start hdx_gap-2.5 hdx_text-body hdx_text-ink">
                  <span className="hdx_mt-1.5 hdx_h-2 hdx_w-2 hdx_rounded-full hdx_bg-primary hdx_shrink-0" />
                  {rec}
                </li>
              ))}
            </ul>

            <div className="hdx_mt-4 hdx_pt-4 hdx_border-t hdx_border-line hdx_space-y-2">
              <div>
                <p className="hdx_text-small hdx_font-semibold hdx_text-ink hdx_mb-0.5">Medication Instructions</p>
                <p className="hdx_text-body hdx_text-ink-secondary">{r.medicationInstructions}</p>
              </div>
              <div className="hdx_flex hdx_items-center hdx_gap-2">
                <Badge color="primary"><span className="hdx_inline-flex hdx_items-center hdx_gap-1">Follow-up: {r.followUp}</span></Badge>
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
      <div className="hdx_space-y-5">
        <div className="hdx_grid hdx_grid-cols-1 hdx_sm_grid-cols-3 hdx_gap-4">
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
