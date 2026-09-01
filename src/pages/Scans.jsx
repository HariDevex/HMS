import { useCallback, useRef, useState } from 'react';
import {
  Plus,
  Search,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  ScanLine,
  X,
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Badge from '../components/ui/Badge';
import { scans, statusColor } from '../data/mock';
import { useApp } from '../context/AppContext';

const scanTypes = ['MRI', 'CT Scan', 'X-Ray', 'Ultrasound', 'PET Scan'];

export default function Scans() {
  const { pushToast } = useApp();
  const [query, setQuery] = useState('');
  const [type, setType] = useState('');
  const [viewer, setViewer] = useState(null);

  const filtered = scans.filter((s) => {
    const q = query.toLowerCase();
    return (!q || s.patient.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)) && (!type || s.type === type);
  });

  return (
    <div>
      <PageHeader
        title="Scans"
        subtitle="Manage diagnostic imaging and scan records."
        actions={
          <button className="btn-primary" onClick={() => pushToast('Requesting new scan order form', 'info')}>
            <Plus size={16} /> New Scan
          </button>
        }
      />

      <div className="card">
        <div className="p-4 border-b border-line flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="relative flex-1 max-w-xs">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-secondary" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search scans…" className="input pl-10" aria-label="Search scans" />
          </div>
          <div className="flex gap-2.5 ml-auto">
            {scanTypes.map((t) => (
              <button key={t} onClick={() => setType(type === t ? '' : t)} className={`px-3 h-9 rounded-input text-small font-medium transition-colors ${type === t ? 'bg-primary text-white' : 'text-ink-secondary border border-line hover:bg-slate-50'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-line bg-slate-50/50">
                <th className="th">Scan</th>
                <th className="th">Patient</th>
                <th className="th">Date</th>
                <th className="th">Requested By</th>
                <th className="th">Performed By</th>
                <th className="th">Findings</th>
                <th className="th">Status</th>
                <th className="th text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="td">
                    <span className="inline-flex items-center gap-2"><Badge color="info"><ScanLine size={12} /> {s.type}</Badge><span className="text-ink-secondary">{s.id}</span></span>
                  </td>
                  <td className="td font-medium">{s.patient}</td>
                  <td className="td text-ink-secondary">{s.date}</td>
                  <td className="td text-ink-secondary">{s.requestedBy}</td>
                  <td className="td text-ink-secondary">{s.performedBy}</td>
                  <td className="td text-ink-secondary max-w-[220px] truncate">{s.findings}</td>
                  <td className="td"><Badge color={statusColor(s.status)} dot>{s.status}</Badge></td>
                  <td className="td text-right">
                    <button onClick={() => setViewer(s)} className="btn-secondary !h-9 !px-3 !text-small">
                      <Maximize size={13} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {viewer && <ScanViewer scan={viewer} onClose={() => setViewer(null)} />}
    </div>
  );
}

function ScanViewer({ scan, onClose }) {
  const [zoom, setZoom] = useState(1);
  const [full, setFull] = useState(false);
  const containerRef = useRef(null);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setFull(true);
    } else {
      document.exitFullscreen?.();
      setFull(false);
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={containerRef} className="w-full max-w-4xl card overflow-hidden bg-white flex flex-col animate-slide-up">
        <div className="px-5 py-3.5 flex items-center justify-between border-b border-line bg-slate-50">
          <div className="flex items-center gap-3">
            <Badge color="info">{scan.type}</Badge>
            <div>
              <p className="text-body font-semibold text-ink">{scan.id} · {scan.patient}</p>
              <p className="text-small text-ink-secondary">{scan.date} · {scan.performedBy}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.25).toFixed(2)))} className="p-2 rounded-input text-ink-secondary hover:bg-slate-100" aria-label="Zoom out"><ZoomOut size={18} /></button>
            <span className="text-small text-ink-secondary w-10 text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)))} className="p-2 rounded-input text-ink-secondary hover:bg-slate-100" aria-label="Zoom in"><ZoomIn size={18} /></button>
            <button onClick={toggleFullscreen} className="p-2 rounded-input text-ink-secondary hover:bg-slate-100" aria-label="Toggle fullscreen">{full ? <Minimize size={18} /> : <Maximize size={18} />}</button>
            <button onClick={onClose} className="p-2 rounded-input text-ink-secondary hover:bg-slate-100 ml-1" aria-label="Close"><X size={18} /></button>
          </div>
        </div>
        <div
          className="h-[420px] bg-[repeating-linear-gradient(0deg,#f8fafc,#f8fafc_24px,#eef2f7_24px,#eef2f7_25px)] relative overflow-auto scrollbar-thin"
          style={{ cursor: 'grab' }}
        >
          <div className="absolute left-1/2 top-1/2" style={{ transform: `translate(-50%,-50%) scale(${zoom})`, transition: 'transform 0.15s ease' }}>
            <div className="w-[320px] h-[320px] rounded-full bg-[radial-gradient(circle_at_center,#dbeafe_0%,#93c5fd_45%,#3b82f6_70%,#1d4ed8_100%)] border-4 border-white shadow-dropdown relative">
              <span className="absolute inset-x-0 top-1/2 h-0.5 bg-white/50" />
              <span className="absolute inset-y-0 left-1/2 w-0.5 bg-white/50" />
            </div>
          </div>
        </div>
        <div className="px-5 py-4 border-t border-line">
          <p className="text-small font-semibold text-ink mb-1">Findings</p>
          <p className="text-body text-ink-secondary leading-relaxed">{scan.findings}</p>
        </div>
      </div>
    </div>
  );
}
