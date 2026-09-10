import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Card, { CardHeader } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import CriticalAlert from '../../components/ui/CriticalAlert';
import { CheckCircle2, Clock } from 'lucide-react';

export default function NurseWorkstation() {
  const { medications, recordMARAdministration, patients, currentUser } = useApp();
  const [selectedMed, setSelectedMed] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [filterPatient, setFilterPatient] = useState('All');

  const filteredMeds = filterPatient === 'All'
    ? medications
    : medications.filter((m) => m.patientId === filterPatient);

  const handleAdminister = () => {
    if (!selectedMed) return;
    recordMARAdministration(selectedMed.id, adminNotes);
    setSelectedMed(null);
    setAdminNotes('');
  };

  const columns = [
    {
      key: 'name',
      label: 'Medication Order',
      sortable: true,
      render: (val, row) => (
        <div>
          <div className="font-bold text-slate-900">{val} <span className="text-primary font-semibold">({row.dose})</span></div>
          <div className="text-xs text-slate-500">{row.route} • {row.frequency}</div>
        </div>
      ),
    },
    {
      key: 'patientId',
      label: 'Patient',
      render: (val) => {
        const pt = patients.find((p) => p.id === val);
        return pt ? (
          <div>
            <div className="font-semibold text-slate-900">{pt.name}</div>
            <div className="text-xs text-slate-500 font-mono">Bed: {pt.bed || 'OP'}</div>
          </div>
        ) : val;
      },
    },
    {
      key: 'indication',
      label: 'Indication & Prescriber',
      render: (val, row) => (
        <div className="text-xs">
          <span className="text-slate-800 font-medium block">{val}</span>
          <span className="text-slate-400">Ordered by {row.prescribedBy}</span>
        </div>
      ),
    },
    {
      key: 'scheduleStatus',
      label: 'MAR Status',
      render: (val) => (
        <Badge
          dot
          variant={val === 'Administered' ? 'success' : val === 'PRN Available' ? 'info' : 'warning'}
        >
          {val}
        </Badge>
      ),
    },
    {
      key: 'nextDue',
      label: 'Schedule Timing',
      render: (val, row) => (
        <div className="text-xs">
          <div className="font-semibold text-slate-800 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" /> Due: {val}
          </div>
          {row.lastAdministered && (
            <div className="text-[11px] text-slate-400 mt-0.5">{row.lastAdministered}</div>
          )}
        </div>
      ),
    },
    {
      key: 'action',
      label: 'Action',
      render: (_, row) => {
        if (row.scheduleStatus === 'Administered') {
          return (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" /> Given
            </span>
          );
        }
        return (
          <Button
            size="sm"
            variant="primary"
            className="!h-8 !text-xs !px-3"
            onClick={() => setSelectedMed(row)}
          >
            Administer (MAR)
          </Button>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Medication Administration Record (e-MAR)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Barcode electronic medication verification, dosage checks, and nursing sign-off.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-500">Filter Inpatient:</span>
          <select
            value={filterPatient}
            onChange={(e) => setFilterPatient(e.target.value)}
            className="h-9 px-3 text-xs bg-slate-50 rounded-lg border border-slate-300 font-medium"
          >
            <option value="All">All Inpatients</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.bed || 'OP'})
              </option>
            ))}
          </select>
        </div>
      </div>

      <CriticalAlert
        title="Five Rights of Medication Administration Enforced"
        message="Right Patient • Right Drug • Right Dose • Right Route • Right Time. Dual authentication required for high-risk cardiac & anticoagulant medications."
        type="info"
      />

      <Card>
        <CardHeader
          title={`Scheduled Doses (${filteredMeds.length})`}
          subtitle="Showing active inpatient pharmaceutical orders"
        />
        <Table
          columns={columns}
          data={filteredMeds}
          emptyTitle="No medications scheduled"
          emptyDescription="There are currently no active medication administration tasks for this filter."
        />
      </Card>

      {/* Administer Verification Modal */}
      {selectedMed && (
        <Modal
          isOpen={Boolean(selectedMed)}
          onClose={() => setSelectedMed(null)}
          title="Verify & Document Medication Administration"
          subtitle={`Patient safety check for ${selectedMed.name}`}
          footer={
            <>
              <Button variant="secondary" onClick={() => setSelectedMed(null)}>
                Cancel
              </Button>
              <Button variant="success" icon={CheckCircle2} onClick={handleAdminister}>
                Verify & Mark Administered
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 bg-blue-50/80 rounded-xl border border-blue-200">
              <span className="text-[10px] uppercase font-bold text-blue-800 tracking-wider block">Medication Details</span>
              <h4 className="text-base font-bold text-slate-900 mt-0.5">{selectedMed.name} {selectedMed.dose}</h4>
              <p className="text-slate-600 mt-1">Route: <strong>{selectedMed.route}</strong> • Frequency: <strong>{selectedMed.frequency}</strong></p>
              <p className="text-slate-500 mt-0.5">Indication: {selectedMed.indication}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Administering Nurse</span>
              <p className="font-semibold text-slate-900">{currentUser.name} ({currentUser.role})</p>
              <p className="text-slate-400">Timestamp: {new Date().toLocaleTimeString()} on {new Date().toLocaleDateString()}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Bedside Observation Notes / Pulse / BP Check
              </label>
              <input
                type="text"
                placeholder="e.g. Apical pulse 78 bpm, BP 138/84 prior to dose. Patient swallowed with water."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full h-10 px-3 text-xs bg-slate-50 rounded-lg border border-slate-300 focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
