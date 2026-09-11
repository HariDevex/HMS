import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import Badge from './Badge';
import VerifiedBadge from './VerifiedBadge';
import {
  Download,
  Printer,
  ZoomIn,
  ZoomOut,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function PdfViewerModal({
  isOpen,
  onClose,
  report,
  type = 'lab', // 'lab' | 'radiology'
}) {
  const { addToast } = useApp();
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [rotation, setRotation] = useState(0);

  if (!report) return null;

  const totalPages = report.pdfReport?.pages || 2;
  const fileName =
    report.pdfReport?.fileName ||
    (type === 'lab'
      ? `Lab_Report_${report.orderNumber || report.id}.pdf`
      : `Radiology_Study_${report.requestNumber || report.id}.pdf`);
  const fileSize = report.pdfReport?.fileSize || '1.4 MB';

  const handleDownload = () => {
    addToast({
      title: 'PDF Download Started',
      message: `Saved ${fileName} (${fileSize}) to local downloads.`,
      type: 'success',
    });
  };

  const handlePrint = () => {
    addToast({
      title: 'Printing PDF Report',
      message: `Sent ${fileName} to default hospital printer.`,
      type: 'info',
    });
    window.print();
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      maxWidth="max-w-5xl"
      className="p-0 overflow-hidden"
      footer={null}
    >
      <div className="flex flex-col h-[85vh] bg-slate-800 text-slate-100 select-none">
        {/* 1. PDF Viewer Top Navigation Toolbar */}
        <div className="bg-slate-900 border-b border-slate-700/80 px-4 py-2.5 flex items-center justify-between flex-wrap gap-2 shrink-0">
          {/* File Name & Document Badge */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600/90 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              PDF
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-white truncate max-w-xs sm:max-w-md">
                  {fileName}
                </span>
                <Badge size="sm" variant="neutral" className="bg-slate-800 text-slate-300 border-slate-700">
                  {fileSize}
                </Badge>
              </div>
              <span className="text-[10px] text-slate-400 block font-mono">
                {type === 'lab' ? 'CLIA Certified Pathology Report' : 'Diagnostic Radiology PACS Export'} • {report.patientName} ({report.patientMrn})
              </span>
            </div>
          </div>

          {/* Viewer Tools (Page, Zoom, Rotate, Print, Download) */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Page Navigation */}
            <div className="flex items-center bg-slate-800 rounded-lg border border-slate-700 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300"
                title="Previous Page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 font-mono text-[11px] text-slate-300">
                Page {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1 rounded hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300"
                title="Next Page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center bg-slate-800 rounded-lg border border-slate-700 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(70, z - 15))}
                className="p-1 rounded hover:bg-slate-700 text-slate-300"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 font-mono text-[11px] text-slate-300 min-w-10 text-center">
                {zoomLevel}%
              </span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(150, z + 15))}
                className="p-1 rounded hover:bg-slate-700 text-slate-300"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Rotate */}
            <button
              type="button"
              onClick={handleRotate}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 text-slate-300"
              title="Rotate 90° Clockwise"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>

            {/* Download Button */}
            <Button
              size="xs"
              variant="secondary"
              icon={Download}
              onClick={handleDownload}
              className="bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
            >
              Download
            </Button>

            {/* Print Button */}
            <Button
              size="xs"
              variant="primary"
              icon={Printer}
              onClick={handlePrint}
            >
              Print
            </Button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Close Preview"
            >
              ✕
            </button>
          </div>
        </div>

        {/* 2. PDF Document Canvas Viewport */}
        <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center bg-slate-900/90 scrollbar-thin">
          <div
            className="transition-all duration-200 origin-top shadow-2xl bg-white text-slate-900 rounded-sm w-[760px] max-w-full min-h-[980px] p-8 sm:p-12 relative flex flex-col justify-between"
            style={{
              transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
            }}
          >
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
              <span className="text-8xl font-black rotate-[-35deg] tracking-widest text-slate-900 uppercase">
                MEDICORE CLINICAL
              </span>
            </div>

            {/* PAGE 1 CONTENT */}
            {currentPage === 1 && (
              <div className="space-y-6 relative">
                {/* Official Masthead */}
                <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary text-white font-black text-sm flex items-center justify-center">
                        M
                      </div>
                      <div>
                        <h2 className="text-base font-black tracking-tight text-slate-900 uppercase">
                          MediCore University Health System
                        </h2>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {type === 'lab'
                            ? 'Department of Clinical Pathology & Laboratory Medicine'
                            : 'Department of Diagnostic Radiology & Molecular Imaging'}
                        </p>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      100 Medical Parkway, Building C • Springfield, IL • CLIA ID #14D099281 • CAP Accredited
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                      {type === 'lab' ? 'PATHOLOGY REPORT' : 'RADIOLOGY REPORT'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono block mt-1">
                      Accession: <strong>{report.orderNumber || report.requestNumber || 'ORD-98201'}</strong>
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono block">
                      Date: {report.verifiedAt || report.reportedAt || report.orderDate}
                    </span>
                  </div>
                </div>

                {/* Patient Information Grid */}
                <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Patient Name</span>
                    <span className="font-bold text-slate-900">{report.patientName}</span>
                    <span className="text-[11px] text-slate-500 font-mono block mt-0.5">MRN: {report.patientMrn}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Demographics</span>
                    <span className="font-medium text-slate-800">{report.age || '58'} yrs • {report.gender || 'Male'}</span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">Location: Inpatient / Bed 03</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Ordering Physician</span>
                    <span className="font-bold text-slate-900">{report.orderedBy || 'Dr. Sarah Jenkins, MD'}</span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">Priority: {report.priority || 'Routine'}</span>
                  </div>
                </div>

                {/* Clinical Indication */}
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs">
                  <span className="font-bold text-slate-700 uppercase text-[10px] block">
                    Clinical Indication / Diagnostic Request:
                  </span>
                  <p className="text-slate-800 mt-0.5">
                    {report.clinicalIndication || report.notes || 'Inpatient diagnostic workup and continuous monitoring protocol.'}
                  </p>
                </div>

                {/* TYPE SPECIFIC: LABORATORY REPORT TABLE */}
                {type === 'lab' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-black text-sm text-slate-900">{report.testName}</h3>
                      <span className="text-[11px] text-slate-500 font-mono">
                        Specimen: {report.sampleType || report.specimenType || 'Venous Blood'}
                      </span>
                    </div>

                    <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                      <table className="w-full text-left">
                        <thead className="bg-slate-100 text-[10px] font-bold uppercase text-slate-600">
                          <tr>
                            <th className="p-2.5">Analyte / Component</th>
                            <th className="p-2.5">Observed Value</th>
                            <th className="p-2.5">Units</th>
                            <th className="p-2.5">Reference Interval</th>
                            <th className="p-2.5">Flag</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {report.parameters && report.parameters.length > 0 ? (
                            report.parameters.map((p, idx) => (
                              <tr key={idx} className={p.flag.includes('Critical') ? 'bg-red-50/60' : ''}>
                                <td className="p-2 font-medium text-slate-900">{p.name}</td>
                                <td className="p-2 font-bold font-mono text-slate-900">{p.value}</td>
                                <td className="p-2 text-slate-500 font-mono">{p.unit || '—'}</td>
                                <td className="p-2 text-slate-500 font-mono">{p.refRange}</td>
                                <td className="p-2">
                                  <span
                                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                      p.flag.includes('Critical')
                                        ? 'bg-red-100 text-error'
                                        : p.flag.includes('High') || p.flag.includes('Low')
                                        ? 'bg-amber-100 text-amber-800'
                                        : 'bg-emerald-50 text-emerald-700'
                                    }`}
                                  >
                                    {p.flag}
                                  </span>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={5} className="p-4 text-center text-slate-400">
                                Parameters verified and filed in electronic chart.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {report.technicianComment && (
                      <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                        <span className="font-bold text-slate-700 uppercase text-[10px]">Technologist Note:</span>
                        <p className="text-slate-600 mt-0.5">{report.technicianComment}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* TYPE SPECIFIC: RADIOLOGY REPORT FINDINGS */}
                {type === 'radiology' && (
                  <div className="space-y-4 text-xs">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                      <h3 className="font-black text-sm text-slate-900">
                        {report.modality} {report.studyName ? `— ${report.studyName}` : ''}
                      </h3>
                      <span className="text-[11px] text-slate-500 font-mono">
                        Protocol: {report.studyCode || 'DIAG-SCAN-SERIES'}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="font-bold text-slate-800 uppercase text-[10px] block">
                          Technique & Acquisition Protocol:
                        </span>
                        <p className="text-slate-700 mt-0.5">
                          Standard volumetric multi-slice examination acquired with 1.5mm collimation. Tube voltage 120 kVp, 250 mAs. Reconstructed in standard soft tissue and bone algorithm windows without intravenous adverse reaction.
                        </p>
                      </div>

                      <div>
                        <span className="font-bold text-slate-800 uppercase text-[10px] block">
                          Radiological Findings:
                        </span>
                        <p className="text-slate-800 mt-0.5 whitespace-pre-line leading-relaxed">
                          {report.findings ||
                            'Visualized anatomical boundaries demonstrate clear aeration and physiological contours. No focal alveolar consolidation, pneumothorax, or large pleural effusion. Mediastinal structures within normal limits. Cardiothoracic ratio stable. Visualized osseous structures intact.'}
                        </p>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="font-bold text-slate-900 uppercase text-[10px] block">
                          Impression & Conclusion:
                        </span>
                        <p className="text-slate-900 font-bold mt-0.5 whitespace-pre-line leading-relaxed">
                          {report.impression ||
                            '1. No acute diagnostic abnormality or acute traumatic injury identified on current imaging series.\n2. Stable baseline cardiopulmonary findings.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* PAGE 2 CONTENT: QUALITY CONTROL & OFFICIAL CERTIFICATION */}
            {currentPage === 2 && (
              <div className="space-y-6 relative text-xs">
                {/* Header Sub-page */}
                <div className="border-b border-slate-200 pb-3 flex justify-between items-center text-slate-500 text-[11px]">
                  <span>
                    MediCore Clinical Health • Report #{report.orderNumber || report.requestNumber || '98201'}
                  </span>
                  <span>Patient: {report.patientName} ({report.patientMrn})</span>
                  <span>Page 2 of 2</span>
                </div>

                {/* Analytical Quality Assurance */}
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider text-xs">
                    1. Instrumentation & Quality Assurance Controls
                  </h4>
                  <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block">Analyzer / Instrument</span>
                      <span className="font-bold text-slate-800">
                        {type === 'lab' ? 'Sysmex XN-9100 / Roche Cobas 8000' : 'Siemens SOMATOM Force Dual-Source CT / 3.0T Skyra MRI'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block">Calibration Verification</span>
                      <span className="font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 2-SD Multi-Level Controls In Range
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block">Specimen Collection Integrity</span>
                      <span className="text-slate-700">Non-hemolyzed, adequate volume, verified barcoded accession</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block">Regulatory Accreditation</span>
                      <span className="text-slate-700">CAP Certified #719201 / CLIA #14D099281</span>
                    </div>
                  </div>
                </div>

                {/* Clinical Notes & Diagnostic Interpretation */}
                <div className="space-y-2">
                  <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider text-xs">
                    2. Clinical Interpretation & Recommendations
                  </h4>
                  <p className="text-slate-700 leading-relaxed">
                    Diagnostic values and radiological observations must be interpreted in conjunction with the patient's complete clinical evaluation, presenting symptoms, and relevant concurrent medication regimen. Questions regarding critical alerts or repeat testing should be directed to the attending service.
                  </p>
                </div>

                {/* Cryptographic Verification Seal & Doctor Signature */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Certified Electronic Signature</span>
                      <div className="font-serif italic text-lg font-bold text-slate-900">
                        {report.verifiedBy || report.radiologist || 'Dr. David Miller, MD / Dr. R. Patel, MD'}
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono block">
                        Medical Director • State Medical License: MD-59821
                      </span>
                    </div>

                    <div className="text-right">
                      <VerifiedBadge
                        title="AUTHENTICATED RECORD"
                        verifiedBy={report.verifiedBy || report.radiologist}
                        verifiedAt={report.verifiedAt || report.reportedAt || 'Today'}
                      />
                      <span className="text-[10px] font-mono text-slate-400 block mt-1">
                        SHA-256: 7f0a1c...e892d4b
                      </span>
                    </div>
                  </div>
                </div>

                {/* HIPAA Privacy Footer */}
                <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-400 text-center leading-relaxed">
                  CONFIDENTIAL HEALTHCARE RECORD — This electronic diagnostic document contains privileged patient medical information protected under the Health Insurance Portability and Accountability Act (HIPAA) and applicable state statutes. Unauthorized review, dissemination, or distribution is strictly prohibited.
                </div>
              </div>
            )}

            {/* Page Bottom Footer */}
            <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-mono">
              <span>MediCore Hospital EHR • Generated: {new Date().toLocaleDateString()}</span>
              <span>Document ID: DOC-PDF-{report.orderNumber || report.requestNumber || '98201'}</span>
              <span>Page {currentPage} of {totalPages}</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
