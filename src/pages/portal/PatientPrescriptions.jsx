import React from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Pill, RefreshCw } from 'lucide-react';

export default function PatientPrescriptions() {
  const { selectedPatient, medications, addToast } = useApp();

  const myMeds = medications.filter((m) => m.patientId === selectedPatient.id);

  const handleRefill = (medName) => {
    addToast({
      title: 'Refill Request Transmitted',
      message: `Refill authorization request sent to ${selectedPatient.assignedDoctor} for ${medName}.`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Prescriptions & Medications</h2>
        <p className="text-xs text-slate-500">Active outpatient and hospital drug regimens</p>
      </div>

      <div className="space-y-3">
        {myMeds.map((med) => (
          <Card key={med.id} className="p-4 border-slate-200 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{med.name} {med.dose}</h4>
                  <p className="text-xs text-slate-500">{med.route} • {med.frequency}</p>
                </div>
              </div>
              <Badge variant="success">Active</Badge>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 text-slate-600">
              <p><strong>Clinical Reason:</strong> {med.indication}</p>
              <p><strong>Prescribed By:</strong> {med.prescribedBy}</p>
              <p className="text-slate-400">Duration: {med.startDate} to {med.endDate}</p>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400">Refills available: 2</span>
              <Button
                size="sm"
                variant="secondary"
                icon={RefreshCw}
                onClick={() => handleRefill(med.name)}
              >
                Request Refill
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
