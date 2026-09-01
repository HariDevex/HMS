import { useState } from 'react';
import { Search, Download, Globe, ShieldCheck, ShieldX } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import { auditLogs } from '../data/mock';
import { useApp } from '../context/AppContext';

export default function AuditLogs() {
  const { pushToast } = useApp();
  const [query, setQuery] = useState('');
  const [onlyFailed, setOnlyFailed] = useState(false);

  const filtered = auditLogs.filter((l) => {
    const q = query.toLowerCase();
    const matchQ = !q || l.user.toLowerCase().includes(q) || l.action.toLowerCase().includes(q) || l.resource.toLowerCase().includes(q);
    return matchQ && (!onlyFailed || l.status === 'Failed');
  });

  return (
    <div>
      <PageHeader
        title="Audit Logs"
        subtitle="Immutable record of system and user activity."
        actions={
          <button className="btn-secondary" onClick={() => pushToast('Audit log exported (CSV)', 'success')}>
            <Download size={16} /> Export Logs
          </button>
        }
      />

      <div className="card">
        <div className="p-4 border-b border-line flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="relative flex-1 max-w-xs">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-secondary" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search audit logs…" className="input pl-10" aria-label="Search logs" />
          </div>
          <label className="flex items-center gap-2 text-small text-ink-secondary ml-auto cursor-pointer select-none">
            <input type="checkbox" checked={onlyFailed} onChange={(e) => setOnlyFailed(e.target.checked)} className="h-4 w-4 rounded border-line accent-error" />
            Show failures only
          </label>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-line bg-slate-50/50">
                <th className="th">User</th>
                <th className="th">Role</th>
                <th className="th">Action</th>
                <th className="th">Resource</th>
                <th className="th">Timestamp</th>
                <th className="th">IP / Device</th>
                <th className="th">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="td">
                    <div className="flex items-center gap-3">
                      <Avatar initials={l.user === 'Unknown' ? 'UN' : l.user.split(' ').filter((w) => /^[A-Z]/.test(w)).map((w) => w[0]).join('').slice(0, 2)} size="sm" />
                      <span className="font-medium">{l.user}</span>
                    </div>
                  </td>
                  <td className="td text-ink-secondary">{l.role}</td>
                  <td className="td text-ink">{l.action}</td>
                  <td className="td text-ink-secondary">{l.resource}</td>
                  <td className="td text-ink-secondary whitespace-nowrap">{l.timestamp}</td>
                  <td className="td text-ink-secondary max-w-[200px] truncate"><span className="inline-flex items-center gap-1.5"><Globe size={13} className="text-ink-secondary" />{l.ip}</span></td>
                  <td className="td">
                    <Badge color={l.status === 'Success' ? 'success' : 'error'}>
                      {l.status === 'Success' ? <ShieldCheck size={11} /> : <ShieldX size={11} />} {l.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
