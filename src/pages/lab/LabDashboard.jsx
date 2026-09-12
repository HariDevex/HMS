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
import CriticalAlert from '../../components/ui/CriticalAlert';
import {
  CheckCircle2,
  Printer,
  Edit3,
  Search,
  Barcode,
  Eye,
  FileText,
  UploadCloud,
  Trash2,
} from 'lucide-react';
import PdfViewerModal from '../../components/ui/PdfViewerModal';

export default function LabDashboard() {
  const { labOrders, verifyLabOrder, addToast, currentRole } = useApp();

  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null); // For Result Entry / Verification Drawer
  const [reportModalOrder, setReportModalOrder] = useState(null); // For Printable Report Preview
  const [activePdfOrder, setActivePdfOrder] = useState(null); // For On-Site Popup PDF Viewer
  const [attachedPdf, setAttachedPdf] = useState(null); // Attached PDF state in Drawer

  // Result entry form state
  const [paramValues, setParamValues] = useState({});
  const [techComments, setTechComments] = useState('');

  const canVerify = can(currentRole, 'canVerifyLab');

  const statusTabs = [
    { id: 'All', label: 'All Orders', count: labOrders.length },
    { id: 'Ordered', label: 'Ordered', count: labOrders.filter((l) => l.status === 'Ordered').length },
    { id: 'Sample Pending', label: 'Sample Pending', count: labOrders.filter((l) => l.status === 'Sample Pending').length },
    { id: 'Processing', label: 'Processing', count: labOrders.filter((l) => l.status === 'Processing').length },
    { id: 'Result Ready', label: 'Result Ready', count: labOrders.filter((l) => l.status === 'Result Ready').length },
    { id: 'Verified', label: 'Verified', count: labOrders.filter((l) => l.status === 'Verified').length },
    { id: 'Published', label: 'Published', count: labOrders.filter((l) => l.status === 'Published').length },
  ];

  const filteredOrders = labOrders.filter((order) => {
    const matchesTab = activeTab === 'All' || order.status === activeTab;
    const matchesSearch =
      order.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.sampleBarcode && order.sampleBarcode.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const handleOpenResultEntry = (order) => {
    setSelectedOrder(order);
    const initial = {};
    order.parameters.forEach((p, idx) => {
      initial[idx] = p.value;
    });
    setParamValues(initial);
    setTechComments(order.technicianComment || '');
    setAttachedPdf(order.pdfReport || null);
  };

  const handleVerify = (order) => {
    if (!canVerify) {
      addToast({
        title: 'Permission Denied',
        message: 'Only certified laboratory technologists are authorized to verify and publish diagnostic lab results.',
        type: 'error',
      });
      return;
    }
    const updatedParameters = order.parameters.map((p, idx) => ({
      ...p,
      value: paramValues[idx] || p.value,
    }));
    const finalPdf = attachedPdf || order.pdfReport || {
      fileName: `Certified_Lab_Report_${order.orderNumber || order.id}.pdf`,
      fileSize: '1.4 MB',
      pages: 2,
      uploadedAt: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      uploadedBy: 'Clinical Laboratory Tech',
    };
    verifyLabOrder(order.id, updatedParameters, techComments, finalPdf);
    setSelectedOrder(null);
  };

  const columns = [
    {
      key: 'orderNumber',
      label: 'Order / Barcode',
      sortable: true,
      render: (val, row) => (
        <div>
          <div className="font-mono text-xs font-bold text-slate-800">{val}</div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono mt-0.5">
            <Barcode className="w-3 h-3" /> {row.sampleBarcode || 'Barcode Pending'}
          </div>
        </div>
      ),
    },
    {
      key: 'testName',
      label: 'Diagnostic Test',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-bold text-slate-900">{val}</span>
          <span className="text-xs text-slate-500 block">{row.department}</span>
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
      key: 'priority',
      label: 'Priority',
      render: (val) => (
        <Badge
          dot
          variant={val.includes('STAT') ? 'critical' : val === 'Urgent' ? 'warning' : 'neutral'}
        >
          {val}
        </Badge>
      ),
    },
    {
      key: 'status',
      label: 'Queue Status',
      render: (val) => {
        const variants = {
          Ordered: 'neutral',
          'Sample Pending': 'warning',
          Processing: 'info',
          'Result Ready': 'purple',
          Verified: 'success',
          Published: 'success',
        };
        return <Badge variant={variants[val] || 'neutral'}>{val}</Badge>;
      },
    },
    {
      key: 'orderDate',
      label: 'Order Timing',
      render: (val) => <span className="text-xs text-slate-500">{val}</span>,
    },
    {
      key: 'actions',
      label: 'Worklist Action',
      render: (_, row) => {
        const isVerified = row.status === 'Verified' || row.status === 'Published';
        return (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={isVerified ? 'secondary' : 'primary'}
              icon={isVerified ? Eye : Edit3}
              onClick={() => handleOpenResultEntry(row)}
            >
              {isVerified ? 'View Result' : canVerify ? 'Enter / Verify' : 'View Order'}
            </Button>
            {(isVerified || row.pdfReport) && (
              <Button
                size="sm"
                variant="outline"
                icon={FileText}
                onClick={() => setActivePdfOrder(row)}
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
                onClick={() => setReportModalOrder(row)}
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
              Clinical Pathology & Laboratory Workstation
            </h2>
            <Badge variant="primary">Automated Analyzer Interface</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            STAT Troponin, Hematology CBC, Chemistry Panels, and Molecular Diagnostics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={Barcode}
            onClick={() => {
              addToast({
                title: 'Barcode Scanner Ready',
                message: 'Awaiting laboratory specimen barcode scan...',
                type: 'info',
              });
            }}
          >
            Scan Specimen
          </Button>
        </div>
      </div>

      {/* Critical Alert */}
      <CriticalAlert
        title="STAT Panic Value Alert: Elevated hs-cTnI"
        message="Order ORD-LAB-4401 (James Wilson) Troponin I is 0.142 ng/mL (Ref: 0.000 - 0.034 ng/mL). Critical result confirmed and telephoned to Dr. Sarah Jenkins."
        type="critical"
      />

      {/* Work Queue Tabs */}
      <Card className="p-4 space-y-4">
        <Tabs tabs={statusTabs} activeTab={activeTab} onChange={setActiveTab} variant="pills" />

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search work queue by test name, patient, order number, or tube barcode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-9 pr-3 text-sm bg-slate-50 rounded-lg border border-slate-300 focus:outline-none focus:border-primary"
          />
        </div>
      </Card>

      {/* Laboratory Worklist Table */}
      <Card>
        <CardHeader
          title={`Laboratory Worklist Queue (${filteredOrders.length})`}
          subtitle="Showing active specimens, pending analyses, and finalized clinical reports"
        />
        <Table
          columns={columns}
          data={filteredOrders}
          emptyTitle="No laboratory orders found"
          emptyDescription="No orders currently match the selected stage filter."
        />
      </Card>

      {/* Result Entry & Verification Drawer */}
      {selectedOrder && (
        <Drawer
          isOpen={Boolean(selectedOrder)}
          onClose={() => setSelectedOrder(null)}
          title={`Lab Order: ${selectedOrder.orderNumber}`}
          subtitle={`${selectedOrder.testName} • ${selectedOrder.patientName}`}
          width="max-w-xl"
          footer={
            selectedOrder.status === 'Verified' || selectedOrder.status === 'Published' ? (
              <Button variant="secondary" onClick={() => setSelectedOrder(null)}>
                Close Viewer
              </Button>
            ) : (
              <>
                <Button variant="secondary" onClick={() => setSelectedOrder(null)}>
                  Cancel
                </Button>
                <Button
                  variant="success"
                  icon={CheckCircle2}
                  disabled={!canVerify}
                  onClick={() => handleVerify(selectedOrder)}
                >
                  Verify & Commit Result
                </Button>
              </>
            )
          }
        >
          {/* Read-Only Banner if Verified (Master prompt requirement section 10 & 29) */}
          {(selectedOrder.status === 'Verified' || selectedOrder.status === 'Published') && (
            <div className="space-y-3">
              <VerifiedBadge
                title="Verified Laboratory Result"
                verifiedBy={selectedOrder.verifiedBy}
                verifiedAt={selectedOrder.verifiedAt}
              />
              <div className="p-3 bg-slate-100 rounded-lg text-xs text-slate-600 border border-slate-200">
                This diagnostic record has been formally verified and published to the patient's medical chart. Results are locked and read-only.
              </div>
            </div>
          )}

          {/* Patient Header Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
            <div className="flex justify-between font-bold text-slate-900">
              <span>{selectedOrder.patientName}</span>
              <span className="font-mono text-slate-500">{selectedOrder.patientMrn}</span>
            </div>
            <p className="text-slate-500">
              Age: {selectedOrder.age}y • Gender: {selectedOrder.gender} • Priority: <strong className="text-slate-800">{selectedOrder.priority}</strong>
            </p>
            <p className="text-slate-500">
              Specimen: <strong className="text-slate-700">{selectedOrder.sampleType}</strong>
            </p>
            <p className="text-slate-500 font-mono">
              Barcode: {selectedOrder.sampleBarcode || 'Assigned upon draw'}
            </p>
          </div>

          {/* Test Parameters & Reference Ranges Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Analyte Values & Reference Intervals
            </h4>

            {selectedOrder.parameters.length === 0 ? (
              <div className="p-6 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                Sample currently pending collection or instrument run. No raw values ingested yet.
              </div>
            ) : (
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase text-slate-500">
                    <tr>
                      <th className="p-2.5">Analyte</th>
                      <th className="p-2.5">Value</th>
                      <th className="p-2.5">Units</th>
                      <th className="p-2.5">Reference Range</th>
                      <th className="p-2.5">Flag</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedOrder.parameters.map((param, idx) => {
                      const isVerified = selectedOrder.status === 'Verified' || selectedOrder.status === 'Published';
                      const isCritical = param.flag.includes('Critical');
                      const isAbnormal = param.flag === 'High' || param.flag === 'Low';
                      return (
                        <tr key={idx} className={isCritical ? 'bg-red-50/50' : ''}>
                          <td className="p-2.5 font-semibold text-slate-900">{param.name}</td>
                          <td className="p-2.5">
                            {isVerified || !canVerify ? (
                              <span className={`font-mono font-bold ${isCritical ? 'text-error text-sm' : 'text-slate-900'}`}>
                                {param.value}
                              </span>
                            ) : (
                              <input
                                type="text"
                                value={paramValues[idx] || param.value}
                                onChange={(e) => setParamValues({ ...paramValues, [idx]: e.target.value })}
                                className="w-20 h-7 px-2 font-mono font-bold text-xs bg-white border border-slate-300 rounded focus:border-primary"
                              />
                            )}
                          </td>
                          <td className="p-2.5 text-slate-500 font-mono">{param.unit}</td>
                          <td className="p-2.5 text-slate-500 font-mono">{param.refRange}</td>
                          <td className="p-2.5">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                isCritical
                                  ? 'bg-red-100 text-error'
                                  : isAbnormal
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {param.flag}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Technician Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Technologist Comment & Instrument Log
            </label>
            <textarea
              rows={3}
              disabled={!canVerify || selectedOrder.status === 'Verified' || selectedOrder.status === 'Published'}
              value={techComments}
              onChange={(e) => setTechComments(e.target.value)}
              className="w-full text-xs p-3 rounded-lg border border-slate-300 bg-slate-50 disabled:bg-slate-100 focus:outline-none focus:border-primary"
              placeholder="e.g. Non-hemolyzed serum sample. Controls in 2SD range."
            />
          </div>

          {/* Official Diagnostic PDF Report Attachment */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Certified PDF Diagnostic Report
              </label>
              <span className="text-[11px] text-slate-400">CLIA Accredited Document</span>
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
                      {attachedPdf.fileSize} • {attachedPdf.pages || 2} Pages • {attachedPdf.uploadedAt || 'Ready for publishing'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    icon={Eye}
                    onClick={() =>
                      setActivePdfOrder({
                        ...selectedOrder,
                        parameters: selectedOrder.parameters.map((p, idx) => ({
                          ...p,
                          value: paramValues[idx] || p.value,
                        })),
                        technicianComment: techComments,
                        pdfReport: attachedPdf,
                      })
                    }
                  >
                    Preview PDF
                  </Button>
                  {selectedOrder.status !== 'Verified' && selectedOrder.status !== 'Published' && (
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
              selectedOrder.status !== 'Verified' && selectedOrder.status !== 'Published' ? (
                <div className="p-4 border-2 border-dashed border-slate-200 hover:border-primary/50 rounded-xl bg-slate-50/60 hover:bg-blue-50/20 transition-colors text-center space-y-2.5">
                  <UploadCloud className="w-8 h-8 text-slate-400 mx-auto" />
                  <div>
                    <label className="cursor-pointer text-xs font-bold text-primary hover:underline block">
                      Attach or Upload Certified Laboratory PDF
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
                              uploadedBy: 'Clinical Laboratory Tech',
                            });
                            addToast({
                              title: 'PDF Report Attached',
                              message: `Attached ${file.name} to laboratory order.`,
                              type: 'success',
                            });
                          }
                        }}
                      />
                    </label>
                    <p className="text-[11px] text-slate-400 mt-0.5">Drag and drop signed pathology PDF or click to browse (up to 25MB)</p>
                  </div>
                  <div className="pt-1">
                    <Button
                      type="button"
                      size="xs"
                      variant="secondary"
                      onClick={() => {
                        setAttachedPdf({
                          fileName: `Report_${selectedOrder.orderNumber}_${selectedOrder.testName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
                          fileSize: '1.4 MB',
                          pages: 2,
                          uploadedAt: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                          uploadedBy: 'Automated Analyzer Core',
                        });
                        addToast({
                          title: 'Standard Lab PDF Generated',
                          message: 'Standard CLIA laboratory PDF report generated with current analytes.',
                          type: 'info',
                        });
                      }}
                    >
                      ⚡ Auto-Generate Standard Laboratory PDF
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-400 border border-slate-200">
                  No external PDF report attached for this order.
                </div>
              )
            )}
          </div>
        </Drawer>
      )}

      {/* Printable Report Preview Modal */}
      {reportModalOrder && (
        <Modal
          isOpen={Boolean(reportModalOrder)}
          onClose={() => setReportModalOrder(null)}
          title="Official Laboratory Diagnostic Report"
          subtitle={`Report #${reportModalOrder.orderNumber} • MediCore Clinical Pathology`}
          footer={
            <>
              <Button variant="secondary" onClick={() => setReportModalOrder(null)}>Close</Button>
              <Button
                variant="outline"
                icon={FileText}
                onClick={() => {
                  setActivePdfOrder(reportModalOrder);
                  setReportModalOrder(null);
                }}
              >
                On-Site PDF Preview
              </Button>
              <Button
                variant="primary"
                icon={Printer}
                onClick={() => {
                  window.print();
                }}
              >
                Print Official Copy
              </Button>
            </>
          }
        >
          <div className="space-y-6 text-xs p-2">
            <div className="flex justify-between items-start border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">MediCore Health Laboratories</h3>
                <p className="text-slate-500 text-[11px]">CLIA #14D099281 • College of American Pathologists Accredited</p>
                <p className="text-slate-500 text-[11px]">100 Medical Parkway, Springfield, IL</p>
              </div>
              <VerifiedBadge
                title="FINAL CERTIFIED"
                verifiedBy={reportModalOrder.verifiedBy}
                verifiedAt={reportModalOrder.verifiedAt}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <p><strong>Patient Name:</strong> {reportModalOrder.patientName}</p>
                <p><strong>MRN:</strong> {reportModalOrder.patientMrn}</p>
                <p><strong>Age/Gender:</strong> {reportModalOrder.age}y / {reportModalOrder.gender}</p>
              </div>
              <div>
                <p><strong>Ordering Physician:</strong> {reportModalOrder.orderedBy}</p>
                <p><strong>Collected:</strong> {reportModalOrder.collectedAt || '07:30 AM'}</p>
                <p><strong>Reported:</strong> {reportModalOrder.verifiedAt}</p>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-sm text-slate-900 mb-2">{reportModalOrder.testName}</h4>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-[10px] font-bold uppercase text-slate-600">
                    <tr>
                      <th className="p-2">Test Component</th>
                      <th className="p-2">Observed Value</th>
                      <th className="p-2">Units</th>
                      <th className="p-2">Reference Range</th>
                      <th className="p-2">Flag</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reportModalOrder.parameters.map((p, idx) => (
                      <tr key={idx}>
                        <td className="p-2 font-medium">{p.name}</td>
                        <td className="p-2 font-bold font-mono">{p.value}</td>
                        <td className="p-2 text-slate-500">{p.unit}</td>
                        <td className="p-2 text-slate-500 font-mono">{p.refRange}</td>
                        <td className="p-2">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            p.flag.includes('Critical') ? 'bg-red-100 text-error' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {p.flag}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {reportModalOrder.technicianComment && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold block text-slate-700">Technologist Interpretation & Notes:</span>
                <p className="text-slate-600 mt-0.5">{reportModalOrder.technicianComment}</p>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* On-Site Popup PDF Viewer Modal */}
      {activePdfOrder && (
        <PdfViewerModal
          isOpen={Boolean(activePdfOrder)}
          onClose={() => setActivePdfOrder(null)}
          report={activePdfOrder}
          type="lab"
        />
      )}
    </div>
  );
}
