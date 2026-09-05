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
        <div className="hdx_p-4 hdx_border-b hdx_border-line hdx_flex hdx_flex-col hdx_sm_flex-row hdx_gap-3 hdx_sm_items-center">
          <div className="hdx_relative hdx_flex-1 hdx_max-w-xs">
            <Search size={16} className="hdx_absolute hdx_left-3.5 hdx_top-1/2 hdx_transform hdx_translate-y--1/2 hdx_text-ink-secondary" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search scans…" className="input hdx_pl-10" aria-label="Search scans" />
          </div>
          <div className="hdx_flex hdx_gap-2.5 hdx_ml-auto">
            {scanTypes.map((t) => (
              <button key={t} onClick={() => setType(type === t ? '' : t)} className={`hdx_px-3 hdx_h-9 hdx_rounded-input hdx_text-small hdx_font-medium hdx_transition-colors ${type === t ? 'hdx_bg-primary hdx_text-white' : 'hdx_text-ink-secondary hdx_border hdx_border-line hdx_hover_bg-slate-50'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="hdx_overflow-x-auto scrollbar-thin">
          <table className="hdx_w-full hdx_min-w-900px">
            <thead>
              <tr className="hdx_border-b hdx_border-line hdx_bg-slate-50-50">
                <th className="th">Scan</th>
                <th className="th">Patient</th>
                <th className="th">Date</th>
                <th className="th">Requested By</th>
                <th className="th">Performed By</th>
                <th className="th">Findings</th>
                <th className="th">Status</th>
                <th className="th hdx_text-right">Action</th>
              </tr>
            </thead>
            <tbody className="hdx_divide-y hdx_divide-line">
              {filtered.map((s) => (
                <tr key={s.id} className="hdx_hover_bg-slate-50-60 hdx_transition-colors">
                  <td className="td">
                    <span className="hdx_inline-flex hdx_items-center hdx_gap-2"><Badge color="info"><ScanLine size={12} /> {s.type}</Badge><span className="hdx_text-ink-secondary">{s.id}</span></span>
                  </td>
                  <td className="td hdx_font-medium">{s.patient}</td>
                  <td className="td hdx_text-ink-secondary">{s.date}</td>
                  <td className="td hdx_text-ink-secondary">{s.requestedBy}</td>
                  <td className="td hdx_text-ink-secondary">{s.performedBy}</td>
                  <td className="td hdx_text-ink-secondary hdx_max-w-220px hdx_truncate">{s.findings}</td>
                  <td className="td"><Badge color={statusColor(s.status)} dot>{s.status}</Badge></td>
                  <td className="td hdx_text-right">
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
    <div className="hdx_fixed hdx_inset-0 hdx_z-50 hdx_flex hdx_items-center hdx_justify-center hdx_bg-slate-900-80 hdx_p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={containerRef} className="hdx_w-full hdx_max-w-4xl card hdx_overflow-hidden hdx_bg-white hdx_flex hdx_flex-col hdx_animate-slide-up">
        <div className="hdx_px-5 hdx_py-3.5 hdx_flex hdx_items-center hdx_justify-between hdx_border-b hdx_border-line hdx_bg-slate-50">
          <div className="hdx_flex hdx_items-center hdx_gap-3">
            <Badge color="info">{scan.type}</Badge>
            <div>
              <p className="hdx_text-body hdx_font-semibold hdx_text-ink">{scan.id} · {scan.patient}</p>
              <p className="hdx_text-small hdx_text-ink-secondary">{scan.date} · {scan.performedBy}</p>
            </div>
          </div>
          <div className="hdx_flex hdx_items-center hdx_gap-1">
            <button onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.25).toFixed(2)))} className="hdx_p-2 hdx_rounded-input hdx_text-ink-secondary hdx_hover_bg-slate-100" aria-label="Zoom out"><ZoomOut size={18} /></button>
            <span className="hdx_text-small hdx_text-ink-secondary hdx_w-10 hdx_text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)))} className="hdx_p-2 hdx_rounded-input hdx_text-ink-secondary hdx_hover_bg-slate-100" aria-label="Zoom in"><ZoomIn size={18} /></button>
            <button onClick={toggleFullscreen} className="hdx_p-2 hdx_rounded-input hdx_text-ink-secondary hdx_hover_bg-slate-100" aria-label="Toggle fullscreen">{full ? <Minimize size={18} /> : <Maximize size={18} />}</button>
            <button onClick={onClose} className="hdx_p-2 hdx_rounded-input hdx_text-ink-secondary hdx_hover_bg-slate-100 hdx_ml-1" aria-label="Close"><X size={18} /></button>
          </div>
        </div>
        <div
          className="hdx_h-420px hdx_chart-grid hdx_relative hdx_overflow-auto scrollbar-thin"
          style={{ cursor: 'grab' }}
        >
          <div className="hdx_absolute hdx_left-1/2 hdx_top-1/2" style={{ transform: `translate(-50%,-50%) scale(${zoom})`, transition: 'transform 0.15s ease' }}>
            <div className="hdx_w-320px hdx_h-320px hdx_rounded-full hdx_glow-circle hdx_border-4 hdx_border-white hdx_shadow-dropdown hdx_relative">
              <span className="hdx_absolute hdx_inset-x-0 hdx_top-1/2 hdx_h-0.5 hdx_bg-white-50" />
              <span className="hdx_absolute hdx_inset-y-0 hdx_left-1/2 hdx_w-0.5 hdx_bg-white-50" />
            </div>
          </div>
        </div>
        <div className="hdx_px-5 hdx_py-4 hdx_border-t hdx_border-line">
          <p className="hdx_text-small hdx_font-semibold hdx_text-ink hdx_mb-1">Findings</p>
          <p className="hdx_text-body hdx_text-ink-secondary hdx_leading-relaxed">{scan.findings}</p>
        </div>
      </div>
    </div>
  );
}
