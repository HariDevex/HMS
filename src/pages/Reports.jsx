import { useState } from 'react';
import {
  Plus,
  Search,
  Download,
  Eye,
  FileText,
  ImageIcon,
  X,
  Maximize,
  FileDown,
  SlidersHorizontal,
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { reports, statusColor } from '../data/mock';
import { useApp } from '../context/AppContext';

export default function Reports() {
  const { pushToast } = useApp();
  const [query, setQuery] = useState('');
  const [preview, setPreview] = useState(null);
  const [openUpload, setOpenUpload] = useState(false);

  const filtered = reports.filter(
    (r) => !query || r.report.toLowerCase().includes(query.toLowerCase()) || r.patient.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Medical Reports"
        subtitle="Search, review and manage laboratory & imaging reports."
        actions={
          <button className="btn-primary" onClick={() => setOpenUpload(true)}>
            <Plus size={16} /> Upload Report
          </button>
        }
      />

      <div className="card">
        <div className="p-4 border-b border-line flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="relative flex-1 max-w-xs">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-secondary" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search reports…" className="input pl-10" aria-label="Search reports" />
          </div>
          <div className="flex gap-2.5 ml-auto">
            <div className="input !w-44 !bg-white cursor-pointer flex items-center justify-between">
              <span className="text-ink-secondary">Report type</span><SlidersHorizontal size={15} className="text-ink-secondary" />
            </div>
            <div className="input !w-40 !bg-white cursor-pointer flex items-center justify-between">
              <span className="text-ink-secondary">Date range</span><SlidersHorizontal size={15} className="text-ink-secondary" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[860px]">
            <thead>
              <tr className="border-b border-line bg-slate-50/50">
                <th className="th">Report</th>
                <th className="th">Patient</th>
                <th className="th">Type</th>
                <th className="th">Date</th>
                <th className="th">Uploaded By</th>
                <th className="th">Status</th>
                <th className="th text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="td">
                    <div className="flex items-center gap-2.5">
                      <span className={`h-9 w-9 rounded-[8px] flex items-center justify-center ${r.fileType === 'PDF' ? 'bg-red-50 text-error' : 'bg-blue-50 text-primary'}`}>
                        {r.fileType === 'PDF' ? <FileText size={17} /> : <ImageIcon size={17} />}
                      </span>
                      <span className="font-medium">{r.report}</span>
                    </div>
                  </td>
                  <td className="td text-ink-secondary">{r.patient}</td>
                  <td className="td text-ink-secondary">{r.type}</td>
                  <td className="td text-ink-secondary">{r.date}</td>
                  <td className="td text-ink-secondary">{r.uploadedBy}</td>
                  <td className="td"><Badge color={statusColor(r.status)} dot>{r.status}</Badge></td>
                  <td className="td text-right">
                    <div className="inline-flex gap-1.5">
                      <button onClick={() => setPreview(r)} className="p-1.5 rounded-input text-primary hover:bg-primary-light" aria-label="Preview"><Eye size={17} /></button>
                      <button onClick={() => pushToast('Report downloaded', 'success')} className="p-1.5 rounded-input text-ink-secondary hover:bg-slate-100" aria-label="Download"><Download size={17} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <PreviewModal report={preview} onClose={() => setPreview(null)} />
      <UploadModal open={openUpload} onClose={() => setOpenUpload(false)} />
    </div>
  );
}

function PreviewModal({ report, onClose }) {
  const { pushToast } = useApp();
  if (!report) return null;
  return (
    <Modal open onClose={onClose} title={report.report} subtitle={`${report.id} · ${report.date} · Uploaded by ${report.uploadedBy}`} size="lg"
      footer={<>
        <button className="btn-secondary" onClick={onClose}>Close</button>
        <button className="btn-primary" onClick={() => pushToast('Report downloaded', 'success')}><FileDown size={16} /> Download</button>
      </>}>
      <div className="rounded-card border border-line overflow-hidden">
        <div className="bg-slate-800 px-4 py-2.5 flex items-center justify-between">
          <span className="text-small text-slate-300">{report.report}.{report.fileType === 'PDF' ? 'pdf' : 'png'}</span>
          <div className="flex items-center gap-1">
            <button className="p-1 text-slate-300 hover:text-white" aria-label="Fullscreen"><Maximize size={15} /></button>
            <button className="p-1 text-slate-300 hover:text-white" onClick={onClose} aria-label="Close preview"><X size={15} /></button>
          </div>
        </div>
        <div className="h-80 bg-[repeating-linear-gradient(0deg,#f8fafc,#f8fafc_24px,#eef2f7_24px,#eef2f7_25px)] flex items-center justify-center">
          {report.fileType === 'PDF' ? (
            <div className="text-center">
              <FileText size={48} className="mx-auto text-slate-300" />
              <p className="text-body text-ink-secondary mt-3">Secure PDF preview — {report.report}</p>
              <p className="text-small text-ink-secondary">Encrypted document · viewable by authorized staff</p>
            </div>
          ) : (
            <div className="text-center">
              <ImageIcon size={48} className="mx-auto text-slate-300" />
              <p className="text-body text-ink-secondary mt-3">Imaging file preview</p>
              <p className="text-small text-ink-secondary">Open the scan viewer for full resolution</p>
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <Badge color={statusColor(report.status)} dot>{report.status}</Badge>
        <span className="text-small text-ink-secondary">Shared securely — {report.patient} (HIPAA protected)</span>
      </div>
    </Modal>
  );
}

function UploadModal({ open, onClose }) {
  const { pushToast } = useApp();
  const [drag, setDrag] = useState(false);
  return (
    <Modal open={open} onClose={onClose} title="Upload Report" subtitle="Attach a lab report or imaging document" size="md"
      footer={<>
        <button className="btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn-primary" onClick={() => { pushToast('Report uploaded for review', 'success'); onClose(); }}>Upload</button>
      </>}>
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="label">Patient</label><input className="input" placeholder="Select patient" /></div>
          <div><label className="label">Report type</label><input className="input" placeholder="Laboratory / Imaging" /></div>
        </div>
        <div
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); pushToast('File attached', 'success'); }}
          className={`border-2 border-dashed rounded-card p-8 text-center transition-colors ${drag ? 'border-primary bg-primary-light' : 'border-line'}`}
        >
          <FileText size={28} className="mx-auto text-primary" />
          <p className="text-body font-medium text-ink mt-3">Drop files here or click to browse</p>
          <p className="text-small text-ink-secondary mt-1">PDF, JPG, PNG, DICOM · Max 50MB</p>
        </div>
      </div>
    </Modal>
  );
}
