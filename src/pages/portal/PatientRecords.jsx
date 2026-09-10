import React from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import VerifiedBadge from '../../components/ui/VerifiedBadge';
import { FlaskConical, Scan, Download } from 'lucide-react';

export default function PatientRecords() {
  const { selectedPatient, labOrders, radiologyOrders, addToast } = useApp();

  const myLabs = labOrders.filter((l) => l.patientId === selectedPatient.id);
  const myScans = radiologyOrders.filter((r) => r.patientId === selectedPatient.id);

  const handleDownload = (name) => {
    addToast({
      title: 'Downloading PDF',
      message: `Downloaded official clinical report: ${name}`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Diagnostic Reports & Results</h2>
        <p className="text-xs text-slate-500">Verified laboratory panels and medical imaging findings</p>
      </div>

      {/* Lab Results */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <FlaskConical className="w-4 h-4 text-primary" /> Laboratory Blood & Pathology Reports
        </h3>

        {myLabs.map((lab) => (
          <Card key={lab.id} className="p-4 border-slate-200 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">{lab.testName}</h4>
                <p className="text-xs text-slate-400">{lab.orderDate} • Ordered by {lab.orderedBy}</p>
              </div>
              <VerifiedBadge
                title="VERIFIED"
                verifiedBy={lab.verifiedBy}
                verifiedAt={lab.verifiedAt}
              />
            </div>

            {lab.parameters.length > 0 && (
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs bg-slate-50/50">
                <table className="w-full text-left">
                  <thead className="bg-slate-100/80 text-[10px] font-bold uppercase text-slate-500">
                    <tr>
                      <th className="p-2">Test Component</th>
                      <th className="p-2">Your Value</th>
                      <th className="p-2">Standard Range</th>
                      <th className="p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {lab.parameters.map((p, idx) => (
                      <tr key={idx}>
                        <td className="p-2 font-medium">{p.name}</td>
                        <td className="p-2 font-bold font-mono text-slate-900">{p.value} {p.unit}</td>
                        <td className="p-2 text-slate-500 font-mono">{p.refRange}</td>
                        <td className="p-2">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            p.flag.includes('Critical') ? 'bg-red-100 text-error' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {p.flag}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex justify-end pt-1">
              <Button
                size="sm"
                variant="secondary"
                icon={Download}
                onClick={() => handleDownload(lab.testName)}
              >
                Download PDF
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Radiology Studies */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Scan className="w-4 h-4 text-purple-600" /> Medical Imaging & Scans
        </h3>

        {myScans.map((scan) => (
          <Card key={scan.id} className="p-4 border-slate-200 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">{scan.modality}</h4>
                <p className="text-xs text-slate-400">{scan.orderDate}</p>
              </div>
              <VerifiedBadge
                title="FINAL CERTIFIED"
                verifiedBy={scan.radiologist}
                verifiedAt={scan.reportedAt}
              />
            </div>

            {scan.impression && (
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 text-xs">
                <span className="font-bold text-slate-800 uppercase text-[10px] block">Doctor's Impression Summary:</span>
                <p className="text-slate-800 mt-1 whitespace-pre-line leading-relaxed">{scan.impression}</p>
              </div>
            )}

            <div className="flex justify-end pt-1">
              <Button
                size="sm"
                variant="secondary"
                icon={Download}
                onClick={() => handleDownload(scan.modality)}
              >
                Download Imaging Report
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
