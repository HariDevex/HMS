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
        <div className="hdx_p-4 hdx_border-b hdx_border-line hdx_flex hdx_flex-col hdx_sm_flex-row hdx_gap-3 hdx_sm_items-center">
          <div className="hdx_relative hdx_flex-1 hdx_max-w-xs">
            <Search size={16} className="hdx_absolute hdx_left-3.5 hdx_top-1/2 hdx_transform hdx_translate-y--1/2 hdx_text-ink-secondary" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search audit logs…" className="input hdx_pl-10" aria-label="Search logs" />
          </div>
          <label className="hdx_flex hdx_items-center hdx_gap-2 hdx_text-small hdx_text-ink-secondary hdx_ml-auto hdx_cursor-pointer hdx_select-none">
            <input type="checkbox" checked={onlyFailed} onChange={(e) => setOnlyFailed(e.target.checked)} className="hdx_h-4 hdx_w-4 hdx_rounded hdx_border-line hdx_accent-error" />
            Show failures only
          </label>
        </div>

        <div className="hdx_overflow-x-auto scrollbar-thin">
          <table className="hdx_w-full hdx_min-w-900px">
            <thead>
              <tr className="hdx_border-b hdx_border-line hdx_bg-slate-50-50">
                <th className="th">User</th>
                <th className="th">Role</th>
                <th className="th">Action</th>
                <th className="th">Resource</th>
                <th className="th">Timestamp</th>
                <th className="th">IP / Device</th>
                <th className="th">Status</th>
              </tr>
            </thead>
            <tbody className="hdx_divide-y hdx_divide-line">
              {filtered.map((l) => (
                <tr key={l.id} className="hdx_hover_bg-slate-50-60 hdx_transition-colors">
                  <td className="td">
                    <div className="hdx_flex hdx_items-center hdx_gap-3">
                      <Avatar initials={l.user === 'Unknown' ? 'UN' : l.user.split(' ').filter((w) => /^[A-Z]/.test(w)).map((w) => w[0]).join('').slice(0, 2)} size="sm" />
                      <span className="hdx_font-medium">{l.user}</span>
                    </div>
                  </td>
                  <td className="td hdx_text-ink-secondary">{l.role}</td>
                  <td className="td hdx_text-ink">{l.action}</td>
                  <td className="td hdx_text-ink-secondary">{l.resource}</td>
                  <td className="td hdx_text-ink-secondary hdx_whitespace-nowrap">{l.timestamp}</td>
                  <td className="td hdx_text-ink-secondary hdx_max-w-200px hdx_truncate"><span className="hdx_inline-flex hdx_items-center hdx_gap-1.5"><Globe size={13} className="hdx_text-ink-secondary" />{l.ip}</span></td>
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
