import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Timeline from '../components/ui/Timeline';
import { timeline, patients } from '../data/mock';

export default function History() {
  const [query, setQuery] = useState('');
  const [patient, setPatient] = useState('All patients');

  const items = [...timeline].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div>
      <PageHeader
        title="Medical History"
        subtitle="Chronological medical timeline across all records."
        actions={
          <div className="hdx_flex hdx_gap-2.5">
            <div className="hdx_relative">
              <Filter size={15} className="hdx_absolute hdx_left-3 hdx_top-1/2 hdx_transform hdx_translate-y--1/2 hdx_text-ink-secondary" />
              <select value={patient} onChange={(e) => setPatient(e.target.value)} className="input hdx_appearance-none hdx_pr-8 !w-44">
                <option>All patients</option>
                {patients.map((p) => <option key={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>
        }
      />

      <div className="hdx_relative hdx_max-w-sm hdx_mb-6">
        <Search size={16} className="hdx_absolute hdx_left-3.5 hdx_top-1/2 hdx_transform hdx_translate-y--1/2 hdx_text-ink-secondary" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search medical history…" className="input hdx_pl-10" aria-label="Search" />
      </div>

      <div className="hdx_grid hdx_grid-cols-1 hdx_lg_grid-cols-3 hdx_gap-4">
        <div className="hdx_lg_col-span-2 card hdx_p-6">
          <div className="hdx_flex hdx_items-center hdx_justify-between hdx_mb-6">
            <div>
              <h2 className="hdx_text-card-title hdx_text-ink">Patient Timeline</h2>
              <p className="hdx_text-small hdx_text-ink-secondary">Consultations, reports, scans & prescriptions</p>
            </div>
          </div>
          <Timeline items={items} />
        </div>

        <div className="hdx_space-y-4">
          <div className="card hdx_p-6">
            <h2 className="hdx_text-card-title hdx_text-ink hdx_mb-4">Summary</h2>
            {[
              { label: 'Total consultations', value: 24 },
              { label: 'Medical reports', value: 18 },
              { label: 'Scans performed', value: 9 },
              { label: 'Prescriptions', value: 31 },
              { label: 'Recommendations', value: 12 },
              { label: 'Follow-ups due', value: 4 },
            ].map((s) => (
              <div key={s.label} className="hdx_flex hdx_items-center hdx_justify-between hdx_py-2.5 hdx_border-b hdx_border-line hdx_last_border-0">
                <span className="hdx_text-body hdx_text-ink-secondary">{s.label}</span>
                <span className="hdx_text-body hdx_font-bold hdx_text-ink">{s.value}</span>
              </div>
            ))}
          </div>
          <div className="card hdx_p-6">
            <h2 className="hdx_text-card-title hdx_text-ink hdx_mb-3">Records Access</h2>
            <p className="hdx_text-body hdx_text-ink-secondary hdx_leading-relaxed">Medical history is accessed in accordance with HIPAA guidelines. All access to patient records is logged in the audit trail.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
