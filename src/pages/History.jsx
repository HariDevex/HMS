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
          <div className="flex gap-2.5">
            <div className="relative">
              <Filter size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-secondary" />
              <select value={patient} onChange={(e) => setPatient(e.target.value)} className="input appearance-none pr-8 !w-44">
                <option>All patients</option>
                {patients.map((p) => <option key={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>
        }
      />

      <div className="relative max-w-sm mb-6">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-secondary" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search medical history…" className="input pl-10" aria-label="Search" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-card-title text-ink">Patient Timeline</h2>
              <p className="text-small text-ink-secondary">Consultations, reports, scans & prescriptions</p>
            </div>
          </div>
          <Timeline items={items} />
        </div>

        <div className="space-y-4">
          <div className="card p-6">
            <h2 className="text-card-title text-ink mb-4">Summary</h2>
            {[
              { label: 'Total consultations', value: 24 },
              { label: 'Medical reports', value: 18 },
              { label: 'Scans performed', value: 9 },
              { label: 'Prescriptions', value: 31 },
              { label: 'Recommendations', value: 12 },
              { label: 'Follow-ups due', value: 4 },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between py-2.5 border-b border-line last:border-0">
                <span className="text-body text-ink-secondary">{s.label}</span>
                <span className="text-body font-bold text-ink">{s.value}</span>
              </div>
            ))}
          </div>
          <div className="card p-6">
            <h2 className="text-card-title text-ink mb-3">Records Access</h2>
            <p className="text-body text-ink-secondary leading-relaxed">Medical history is accessed in accordance with HIPAA guidelines. All access to patient records is logged in the audit trail.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
