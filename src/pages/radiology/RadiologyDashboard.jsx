import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { can } from '../../config/permissions';
import Card, { CardHeader } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Tabs from '../../components/ui/Tabs';
import Modal from '../../components/ui/Modal';
import Drawer from '../../components/ui/Drawer';
import VerifiedBadge from '../../components/ui/VerifiedBadge';
import Field, { Select, Textarea } from '../../components/ui/Field';
import {
  CheckCircle2, Printer,
  FileText,
  Search,
  Eye, Maximize2,
  Calendar,
  UploadCloud,
  Trash2,
} from 'lucide-react';
import PdfViewerModal from '../../components/ui/PdfViewerModal';

export default function RadiologyDashboard() {
  const { radiologyOrders, verifyRadiologyReport, addToast, currentRole } = useApp();

  const [activeTab, setActiveTab] = useState('All');
  const [modalityFilter, setModalityFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedScan, setSelectedScan] = useState(null); // For Report Writing / Reading Drawer
  const [previewScan, setPreviewScan] = useState(null); // Printable report modal
  const [activePdfScan, setActivePdfScan] = useState(null); // On-Site Popup PDF Viewer
  const [attachedPdf, setAttachedPdf] = useState(null); // PDF report attachment

  // Report writing form state
  const [findings, setFindings] = useState('');
  const [impression, setImpression] = useState('');

  const canVerify = can(currentRole, 'canVerifyRadiology');

  const statusTabs = [
    { id: 'All', label: 'All Requests', count: radiologyOrders.length },
    { id: 'New Requests', label: 'New Requests', count: radiologyOrders.filter((r) => r.status === 'New Requests').length },
    { id: 'Scheduled', label: 'Scheduled', count: radiologyOrders.filter((r) => r.status === 'Scheduled').length },
    { id: 'Report Draft', label: 'Report Draft', count: radiologyOrders.filter((r) => r.status === 'Report Draft').length },
    { id: 'Verified', label: 'Verified', count: radiologyOrders.filter((r) => r.status === 'Verified').length },
    { id: 'Published', label: 'Published', count: radiologyOrders.filter((r) => r.status === 'Published').length },
  ];

  const filteredScans = radiologyOrders.filter((scan) => {
    const matchesTab = activeTab === 'All' || scan.status === activeTab;
    const matchesModality = modalityFilter === 'All' || scan.modality.includes(modalityFilter);
    const matchesSearch =
      scan.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scan.requestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scan.clinicalIndication.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesModality && matchesSearch;
  });

  const handleOpenScan = (scan) => {
    setSelectedScan(scan);
    setFindings(scan.findings || '');
    setImpression(scan.impression || '');
    setAttachedPdf(scan.pdfReport || null);
  };

  const handleVerifyReport = (scan) => {
    if (!canVerify) {
      addToast({
        title: 'Permission Denied',
        message: 'Only certified radiologists are authorized to verify and sign diagnostic imaging reports.',
        type: 'error',
      });
      return;
    }
    const finalPdf = attachedPdf || scan.pdfReport || {
      fileName: `Certified_Radiology_Report_${scan.requestNumber || scan.id}.pdf`,
      fileSize: '2.8 MB',
      pages: 2,
      uploadedAt: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      uploadedBy: 'Consultant Radiologist',
    };
    verifyRadiologyReport(scan.id, findings, impression, finalPdf);
    setSelectedScan(null);
  };

  const columns = [
    {
      key: 'requestNumber',
      label: 'Request #',
      sortable: true,
      render: (val) => <span className="font-mono text-xs font-bold text-slate-800">{val}</span>,
    },
    {
      key: 'modality',
      label: 'Modality & Exam',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-bold text-slate-900">{val}</span>
          <span className="text-xs text-slate-500 block font-mono">{row.studyCode}</span>
        </div>
      ),
    },
    {
      key: 'patientName',
      label: 'Patient',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-semibold text-slate-900">{val}</span>
          <span className="text-xs text-slate-400 block">{row.patientMrn} • {row.age}y {row.gender}</span>
        </div>
      ),
    },
    {
      key: 'clinicalIndication',
      label: 'Clinical Indication',
      render: (val) => <span className="text-xs text-slate-600 truncate max-w-xs block">{val}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => {
        const variants = {
          'New Requests': 'warning',
          Scheduled: 'info',
          'Report Draft': 'purple',
          Verified: 'success',
          Published: 'success',
        };
        return <Badge variant={variants[val] || 'neutral'}>{val}</Badge>;
      },
    },
    {
      key: 'priority',
      label: 'Priority',
      render: (val) => (
        <Badge dot variant={val.includes('STAT') ? 'critical' : 'neutral'}>
          {val}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Action',
      render: (_, row) => {
        const isVerified = row.status === 'Verified' || row.status === 'Published';
        return (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={isVerified ? 'secondary' : 'primary'}
              icon={isVerified ? Eye : FileText}
              onClick={() => handleOpenScan(row)}
            >
              {isVerified ? 'View Report' : canVerify ? 'Dictate / Report' : 'View Study'}
            </Button>
            {(isVerified || row.pdfReport) && (
              <Button
                size="sm"
                variant="outline"
                icon={FileText}
                onClick={() => setActivePdfScan(row)}
                title="Open On-Site PDF Report Preview"
              >
                PDF
              </Button>
            )}
            {isVerified && (
              <Button
                size="sm"
                variant="ghost"
                icon={Printer}
                onClick={() => setPreviewScan(row)}
                title="Print Report"
              />
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Diagnostic Radiology & Medical Imaging
            </h2>
            <Badge variant="purple">PACS / DICOM Interface Active</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            X-Ray, Multi-Slice CT, 3.0T MRI, Echocardiography, and Color Doppler Ultrasound worklist.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Calendar}
          onClick={() => {
            addToast({
              title: 'Radiology Scheduler',
              message: 'Modality slot reservation opened.',
              type: 'info',
            });
          }}
        >
          Schedule Scan Slot
        </Button>
      </div>

      {/* Tabs & Filter Bar */}
      <Card className="p-4 space-y-4">
        <Tabs tabs={statusTabs} activeTab={activeTab} onChange={setActiveTab} variant="pills" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by patient, exam number, or clinical indication..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-9 pr-3 text-sm bg-slate-50 rounded-lg border border-slate-300 focus:outline-none focus:border-primary"
            />
          </div>

          <Select
            value={modalityFilter}
            onChange={(e) => setModalityFilter(e.target.value)}
            options={[
              { value: 'All', label: 'All Modalities' },
              { value: 'X-Ray', label: 'X-Ray (Radiography)' },
              { value: 'CT', label: 'Computed Tomography (CT)' },
              { value: 'MRI', label: 'Magnetic Resonance (MRI)' },
              { value: 'Echocardiogram', label: 'Ultrasound / Echo' },
            ]}
          />
        </div>
      </Card>

      {/* Scans Table */}
      <Card>
        <CardHeader
          title={`Radiology Worklist (${filteredScans.length})`}
          subtitle="Showing scheduled examinations and radiologist reading queue"
        />
        <Table
          columns={columns}
          data={filteredScans}
          emptyTitle="No imaging requests found"
          emptyDescription="No scan orders match the selected stage and modality."
        />
      </Card>

      {/* Scan Details & Report Drawer */}
      {selectedScan && (
        <Drawer
          isOpen={Boolean(selectedScan)}
          onClose={() => setSelectedScan(null)}
          title={`Imaging Study: ${selectedScan.modality}`}
          subtitle={`${selectedScan.requestNumber} • ${selectedScan.patientName}`}
          width="max-w-2xl"
          footer={
            selectedScan.status === 'Verified' || selectedScan.status === 'Published' ? (
              <Button variant="secondary" onClick={() => setSelectedScan(null)}>
                Close Viewer
              </Button>
            ) : (
              <>
                <Button variant="secondary" disabled={!canVerify} onClick={() => setSelectedScan(null)}>
                  Save Draft
                </Button>
                <Button
                  variant="success"
                  icon={CheckCircle2}
                  disabled={!canVerify}
                  onClick={() => handleVerifyReport(selectedScan)}
                >
                  Verify & Sign Diagnostic Report
                </Button>
              </>
            )
          }
        >
          {/* Read-Only Banner if Verified (Master Prompt section 11 & 29) */}
          {(selectedScan.status === 'Verified' || selectedScan.status === 'Published') && (
            <div className="space-y-3">
              <VerifiedBadge
                title="Verified Radiology Report"
                verifiedBy={selectedScan.radiologist}
                verifiedAt={selectedScan.reportedAt}
              />
              <div className="p-3 bg-slate-100 rounded-lg text-xs text-slate-600 border border-slate-200">
                This imaging report has been certified by the Consultant Radiologist. The findings and impression are permanently archived in the clinical timeline.
              </div>
            </div>
          )}

          {/* Patient Header Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
            <div className="flex justify-between font-bold text-slate-900">
              <span>{selectedScan.patientName}</span>
              <span className="font-mono text-slate-500">{selectedScan.patientMrn}</span>
            </div>
            <p className="text-slate-600">
              Clinical Indication: <strong>{selectedScan.clinicalIndication}</strong>
            </p>
            <p className="text-slate-500">
              Ordering Clinician: {selectedScan.orderedBy} • Priority: <strong className="text-slate-800">{selectedScan.priority}</strong>
            </p>
          </div>

          {/* Simulated DICOM / Scan Viewer Mockup */}
          {selectedScan.imageMock && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                  PACS DICOM Preview ({selectedScan.dicomSeries} Series • {selectedScan.dicomImages} Slices)
                </span>
                <span className="flex items-center gap-1 text-primary cursor-pointer hover:underline">
                  <Maximize2 className="w-3.5 h-3.5" /> Fullscreen PACS
                </span>
              </div>
              <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-800 aspect-video flex items-center justify-center group">
                <img
                  src={selectedScan.imageMock}
                  alt={selectedScan.modality}
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-1 rounded">
                  WW: 400 WL: 40 • Zoom 100%
                </div>
                <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-1 rounded">
                  KV 120 • mAs 250
                </div>
              </div>
            </div>
          )}

          {/* Radiologist Findings & Impression Forms */}
          <div className="space-y-4">
            <Field label="Technique & Radiological Findings" required>
              <Textarea
                rows={4}
                disabled={!canVerify || selectedScan.status === 'Verified' || selectedScan.status === 'Published'}
                value={findings}
                onChange={(e) => setFindings(e.target.value)}
                placeholder="Describe anatomical observations, lung fields, mediastinum, bone architecture, or focal lesions..."
              />
            </Field>

            <Field label="Impression & Conclusion" required>
              <Textarea
                rows={3}
                disabled={!canVerify || selectedScan.status === 'Verified' || selectedScan.status === 'Published'}
                value={impression}
                onChange={(e) => setImpression(e.target.value)}
                placeholder="1. Summary diagnosis\n2. Comparison with prior studies"
              />
            </Field>
          </div>

          {/* Official Signed Diagnostic Radiology PDF Report Attachment */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Certified Radiology PDF Report / PACS Export
              </label>
              <span className="text-[11px] text-slate-400">ACR Standard Document</span>
            </div>

            {attachedPdf ? (
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{attachedPdf.fileName}</p>
                    <p className="text-[11px] text-slate-500">
                      {attachedPdf.fileSize} • {attachedPdf.pages || 2} Pages • {attachedPdf.uploadedAt || 'Ready for signing'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    icon={Eye}
                    onClick={() =>
                      setActivePdfScan({
                        ...selectedScan,
                        findings,
                        impression,
                        pdfReport: attachedPdf,
                      })
                    }
                  >
                    Preview PDF
                  </Button>
                  {selectedScan.status !== 'Verified' && selectedScan.status !== 'Published' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      icon={Trash2}
                      onClick={() => setAttachedPdf(null)}
                      title="Remove PDF"
                    />
                  )}
                </div>
              </div>
            ) : (
              selectedScan.status !== 'Verified' && selectedScan.status !== 'Published' ? (
                <div className="p-4 border-2 border-dashed border-slate-200 hover:border-primary/50 rounded-xl bg-slate-50/60 hover:bg-purple-50/20 transition-colors text-center space-y-2.5">
                  <UploadCloud className="w-8 h-8 text-slate-400 mx-auto" />
                  <div>
                    <label className="cursor-pointer text-xs font-bold text-primary hover:underline block">
                      Attach or Upload Certified Radiology PDF
                      <input
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setAttachedPdf({
                              fileName: file.name,
                              fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                              pages: 2,
                              uploadedAt: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                              uploadedBy: 'Radiology PACS Tech',
                            });
                            addToast({
                              title: 'PDF Report Attached',
                              message: `Attached ${file.name} to imaging study.`,
                              type: 'success',
                            });
                          }
                        }}
                      />
                    </label>
                    <p className="text-[11px] text-slate-400 mt-0.5">Drag and drop signed PACS imaging PDF (up to 25MB)</p>
                  </div>
                  <div className="pt-1">
                    <Button
                      type="button"
                      size="xs"
                      variant="secondary"
                      onClick={() => {
                        setAttachedPdf({
                          fileName: `ScanReport_${selectedScan.requestNumber}_${selectedScan.modality}.pdf`,
                          fileSize: '2.8 MB',
                          pages: 2,
                          uploadedAt: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                          uploadedBy: 'Consultant Radiologist',
                        });
                        addToast({
                          title: 'Standard Radiology PDF Generated',
                          message: 'Standard ACR certified PDF imaging report generated.',
                          type: 'info',
                        });
                      }}
                    >
                      ⚡ Auto-Generate Certified Radiology PDF
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-400 border border-slate-200">
                  No external PDF report attached for this study.
                </div>
              )
            )}
          </div>
        </Drawer>
      )}

      {/* Printable Radiology Report Modal */}
      {previewScan && (
        <Modal
          isOpen={Boolean(previewScan)}
          onClose={() => setPreviewScan(null)}
          title="Official Diagnostic Radiology Report"
          subtitle={`Report #${previewScan.requestNumber} • Department of Diagnostic Imaging`}
          footer={
            <>
              <Button variant="secondary" onClick={() => setPreviewScan(null)}>Close</Button>
              <Button
                variant="outline"
                icon={FileText}
                onClick={() => {
                  setActivePdfScan(previewScan);
                  setPreviewScan(null);
                }}
              >
                On-Site PDF Preview
              </Button>
              <Button variant="primary" icon={Printer} onClick={() => window.print()}>
                Print Certified Report
              </Button>
            </>
          }
        >
          <div className="space-y-6 text-xs p-2">
            <div className="flex justify-between items-start border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">MediCore Diagnostic Imaging</h3>
                <p className="text-slate-500 text-[11px]">American College of Radiology (ACR) Accredited Facility</p>
              </div>
              <VerifiedBadge
                title="CERTIFIED REPORT"
                verifiedBy={previewScan.radiologist}
                verifiedAt={previewScan.reportedAt}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <p><strong>Patient:</strong> {previewScan.patientName}</p>
                <p><strong>MRN:</strong> {previewScan.patientMrn}</p>
                <p><strong>Age/Gender:</strong> {previewScan.age}y / {previewScan.gender}</p>
              </div>
              <div>
                <p><strong>Exam:</strong> {previewScan.modality}</p>
                <p><strong>Ordering MD:</strong> {previewScan.orderedBy}</p>
                <p><strong>Completed:</strong> {previewScan.completedAt || '09:30 AM'}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h5 className="font-bold text-slate-900 uppercase text-[11px] mb-1">Clinical Indication</h5>
                <p className="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  {previewScan.clinicalIndication}
                </p>
              </div>

              <div>
                <h5 className="font-bold text-slate-900 uppercase text-[11px] mb-1">Radiological Findings</h5>
                <p className="text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {previewScan.findings}
                </p>
              </div>

              <div>
                <h5 className="font-bold text-slate-900 uppercase text-[11px] mb-1">Impression</h5>
                <p className="text-slate-800 font-semibold leading-relaxed whitespace-pre-line bg-blue-50/60 p-3 rounded-lg border border-blue-200">
                  {previewScan.impression}
                </p>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* On-Site Popup PDF Viewer Modal */}
      {activePdfScan && (
        <PdfViewerModal
          isOpen={Boolean(activePdfScan)}
          onClose={() => setActivePdfScan(null)}
          report={activePdfScan}
          type="radiology"
        />
      )}
    </div>
  );
}
