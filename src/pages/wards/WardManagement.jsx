import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { can } from '../../config/permissions';
import Card, { CardHeader } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Field, { Select, Input } from '../../components/ui/Field';
import {
  BedDouble,
  Sparkles,
  Wrench,
  UserPlus,
  ArrowRightLeft,
  LogOut,
} from 'lucide-react';

export default function WardManagement() {
  const { wards, patients, assignBed, dischargeBed, addToast, currentRole } = useApp();

  const [selectedWardId, setSelectedWardId] = useState(wards[0].id);
  const [assignModalBed, setAssignModalBed] = useState(null); // Bed object for admission
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0].id);
  const [transferModalBed, setTransferModalBed] = useState(null);
  const [targetTransferWard, setTargetTransferWard] = useState(wards[1].id);

  const canBeds = can(currentRole, 'canManageBeds');
  const activeWard = wards.find((w) => w.id === selectedWardId) || wards[0];

  const handleAssignPatient = () => {
    if (!assignModalBed) return;
    if (!canBeds) {
      addToast({
        title: 'Permission Denied',
        message: 'Only authorized ward administration and nursing staff can assign beds.',
        type: 'error',
      });
      return;
    }
    const patientObj = patients.find((p) => p.id === selectedPatientId) || patients[0];
    assignBed(selectedWardId, assignModalBed.bedId, patientObj);
    setAssignModalBed(null);
  };

  const handleDischarge = (bed) => {
    if (!canBeds) {
      addToast({
        title: 'Permission Denied',
        message: 'Only authorized ward administration and nursing staff can process bed discharges.',
        type: 'error',
      });
      return;
    }
    dischargeBed(selectedWardId, bed.bedId, bed.patientName);
  };

  const handleTransfer = () => {
    if (!transferModalBed) return;
    if (!canBeds) {
      addToast({
        title: 'Permission Denied',
        message: 'Only authorized ward administration and nursing staff can transfer inpatients.',
        type: 'error',
      });
      return;
    }
    addToast({
      title: 'Transfer Completed',
      message: `Transferred ${transferModalBed.patientName} from ${transferModalBed.bedId} to ${targetTransferWard}.`,
      type: 'success',
    });
    setTransferModalBed(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Inpatient Ward & Bed Census Management
            </h2>
            <Badge variant="primary">Real-time Telemetry Grid</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage bed occupancy, terminal disinfection cycles, patient admissions, and transfers.
          </p>
        </div>

        {/* Ward Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-100 rounded-xl">
          {wards.map((w) => (
            <button
              key={w.id}
              onClick={() => setSelectedWardId(w.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedWardId === w.id
                  ? 'bg-white text-primary shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {w.name} ({w.occupiedBeds}/{w.totalBeds})
            </button>
          ))}
        </div>
      </div>

      {/* Ward Metric Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-blue-50/50 border-blue-200">
          <div className="text-xs text-blue-700 font-semibold uppercase">Total Ward Capacity</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{activeWard.totalBeds} Beds</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{activeWard.floor}</div>
        </Card>

        <Card className="p-4 bg-emerald-50/50 border-emerald-200">
          <div className="text-xs text-emerald-700 font-semibold uppercase">Available Beds</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{activeWard.availableBeds} Ready</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Cleaned & sanitized</div>
        </Card>

        <Card className="p-4 bg-red-50/50 border-red-200">
          <div className="text-xs text-red-700 font-semibold uppercase">Occupied Beds</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{activeWard.occupiedBeds} Inpatients</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Nurse: {activeWard.nurseInCharge}</div>
        </Card>

        <Card className="p-4 bg-amber-50/50 border-amber-200">
          <div className="text-xs text-amber-700 font-semibold uppercase">Occupancy Rate</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {Math.round((activeWard.occupiedBeds / activeWard.totalBeds) * 100)}%
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Census Status</div>
        </Card>
      </div>

      {/* Interactive Bed Grid (Master Prompt Section 18) */}
      <Card className="p-6">
        <CardHeader
          title={`${activeWard.name} Bed Grid`}
          subtitle="Click on any bed card to admit, transfer, or release"
          action={
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Available</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Occupied</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Cleaning</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Reserved</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-slate-400" /> Maintenance</span>
            </div>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-6">
          {activeWard.beds.map((bed) => {
            const isOccupied = bed.status === 'Occupied';
            const isAvailable = bed.status === 'Available';
            const isCleaning = bed.status === 'Cleaning';
            const isReserved = bed.status === 'Reserved';
            const isMaint = bed.status === 'Maintenance';

            const borderColors = {
              Occupied: 'border-blue-300 bg-blue-50/20',
              Available: 'border-emerald-300 bg-emerald-50/20',
              Cleaning: 'border-amber-300 bg-amber-50/20',
              Reserved: 'border-purple-300 bg-purple-50/20',
              Maintenance: 'border-slate-300 bg-slate-50/50',
            };

            const badgeVariants = {
              Occupied: 'primary',
              Available: 'success',
              Cleaning: 'warning',
              Reserved: 'purple',
              Maintenance: 'neutral',
            };

            return (
              <div
                key={bed.bedId}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                  borderColors[bed.status] || 'border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <BedDouble className="w-4 h-4 text-slate-700" />
                      <span className="font-mono font-bold text-sm text-slate-900">{bed.bedId}</span>
                    </div>
                    <Badge size="sm" dot variant={badgeVariants[bed.status] || 'neutral'}>
                      {bed.status}
                    </Badge>
                  </div>

                  {isOccupied && (
                    <div className="mt-3 text-xs space-y-1">
                      <span className="font-bold text-slate-900 block truncate">{bed.patientName}</span>
                      <p className="text-slate-500">{bed.gender} • {bed.age}y</p>
                      <p className="text-[11px] text-slate-400">Admitted: {bed.admittedDate || '2026-09-08'}</p>
                    </div>
                  )}

                  {isAvailable && (
                    <div className="mt-4 text-center py-2 text-xs text-emerald-700 font-medium">
                      Bed ready for immediate patient admission
                    </div>
                  )}

                  {isCleaning && (
                    <div className="mt-4 text-center py-2 text-xs text-amber-700 flex items-center justify-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Terminal sanitization in progress
                    </div>
                  )}

                  {isReserved && (
                    <div className="mt-3 text-xs text-purple-800 font-medium">
                      Reserved for: {bed.patientName}
                    </div>
                  )}

                  {isMaint && (
                    <div className="mt-4 text-center py-2 text-xs text-slate-500 flex items-center justify-center gap-1">
                      <Wrench className="w-3.5 h-3.5" /> Sensor calibration
                    </div>
                  )}
                </div>

                {/* Bed Actions */}
                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center gap-1.5">
                  {!canBeds ? (
                    <span className="text-xs text-slate-400 italic text-center w-full py-1">Ward management restricted</span>
                  ) : (
                    <>
                      {isAvailable && (
                        <Button
                          size="sm"
                          variant="primary"
                          className="w-full !h-8 !text-xs"
                          icon={UserPlus}
                          onClick={() => setAssignModalBed(bed)}
                        >
                          Admit Patient
                        </Button>
                      )}

                      {isOccupied && (
                        <>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="grow !h-8 !text-xs"
                            icon={ArrowRightLeft}
                            onClick={() => setTransferModalBed(bed)}
                          >
                            Transfer
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            className="grow !h-8 !text-xs"
                            icon={LogOut}
                            onClick={() => handleDischarge(bed)}
                          >
                            Discharge
                          </Button>
                        </>
                      )}

                      {isCleaning && (
                        <Button
                          size="sm"
                          variant="secondary"
                          className="w-full !h-8 !text-xs"
                          onClick={() => {
                            addToast({
                              title: 'Bed Ready',
                              message: `${bed.bedId} marked as cleaned and ready for admission.`,
                              type: 'success',
                            });
                          }}
                        >
                          Mark Cleaned
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Bed Admission Modal */}
      {assignModalBed && (
        <Modal
          isOpen={Boolean(assignModalBed)}
          onClose={() => setAssignModalBed(null)}
          title={`Admit Patient to ${assignModalBed.bedId}`}
          subtitle={`Assigning room in ${activeWard.name}`}
          footer={
            <>
              <Button variant="secondary" onClick={() => setAssignModalBed(null)}>Cancel</Button>
              <Button variant="primary" disabled={!canBeds} onClick={handleAssignPatient}>Confirm Admission</Button>
            </>
          }
        >
          <div className="space-y-4">
            <Field label="Select Patient for Inpatient Admission" required>
              <Select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                options={patients.map((p) => ({
                  value: p.id,
                  label: `${p.name} (${p.mrn}) - Current: ${p.status}`,
                }))}
              />
            </Field>

            <div className="p-3 bg-blue-50 rounded-xl text-xs text-blue-900 border border-blue-200">
              Admission will assign bed telemetry sensors, register patient on nursing shift handover roster, and initiate Q4H vitals protocol.
            </div>
          </div>
        </Modal>
      )}

      {/* Transfer Bed Modal */}
      {transferModalBed && (
        <Modal
          isOpen={Boolean(transferModalBed)}
          onClose={() => setTransferModalBed(null)}
          title={`Transfer Patient: ${transferModalBed.patientName}`}
          subtitle={`Currently in ${transferModalBed.bedId}`}
          footer={
            <>
              <Button variant="secondary" onClick={() => setTransferModalBed(null)}>Cancel</Button>
              <Button variant="primary" disabled={!canBeds} onClick={handleTransfer}>Authorize Transfer</Button>
            </>
          }
        >
          <div className="space-y-4">
            <Field label="Destination Inpatient Ward" required>
              <Select
                value={targetTransferWard}
                onChange={(e) => setTargetTransferWard(e.target.value)}
                options={wards
                  .filter((w) => w.id !== selectedWardId)
                  .map((w) => ({ value: w.id, label: `${w.name} (${w.availableBeds} beds available)` }))}
              />
            </Field>

            <Field label="Clinical Reason for Transfer">
              <Input placeholder="e.g. Patient stabilized post-NSTEMI, transfer from ICU to step-down telemetry" />
            </Field>
          </div>
        </Modal>
      )}
    </div>
  );
}
