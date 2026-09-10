import React from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Volume2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function QueueManagement() {
  const { appointments, updateAppointmentStatus, addToast } = useApp();
  const navigate = useNavigate();

  const handleCallToken = (apt) => {
    addToast({
      title: `Calling Token #${apt.tokenNumber}`,
      message: `Audio broadcast: "Token ${apt.tokenNumber}, ${apt.patientName}, please proceed to ${apt.room}."`,
      type: 'info',
    });
  };

  const handleStartInConsult = (apt) => {
    updateAppointmentStatus(apt.id, 'In Consultation');
  };

  const handleComplete = (apt) => {
    updateAppointmentStatus(apt.id, 'Completed');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => navigate('/reception')}>
            Back
          </Button>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Outpatient Live Queue Board
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Electronic token allocation and waiting room display monitor.
            </p>
          </div>
        </div>
        <Badge variant="success">Waiting Room Display Synced</Badge>
      </div>

      {/* Main Queue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {appointments.map((apt) => {
          const isWaiting = apt.status === 'Waiting';
          const isConsulting = apt.status === 'In Consultation';
          const isCompleted = apt.status === 'Completed';

          return (
            <Card
              key={apt.id}
              className={`p-5 flex flex-col justify-between border-2 transition-all ${
                isConsulting
                  ? 'border-primary shadow-md bg-blue-50/20'
                  : isWaiting
                  ? 'border-amber-300 bg-amber-50/10'
                  : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white font-black text-base flex flex-col items-center justify-center shrink-0 shadow-sm">
                    <span className="text-[8px] text-slate-400 font-normal tracking-wider">TOKEN</span>
                    <span className="leading-none">{apt.tokenNumber}</span>
                  </div>
                  <Badge
                    size="sm"
                    dot
                    variant={isConsulting ? 'purple' : isWaiting ? 'warning' : isCompleted ? 'success' : 'neutral'}
                  >
                    {apt.status}
                  </Badge>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">{apt.patientName}</h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{apt.patientMrn}</p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Physician:</span>
                    <span className="font-semibold text-slate-800">{apt.doctor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Department:</span>
                    <span>{apt.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Room:</span>
                    <span className="font-semibold text-slate-800">{apt.room}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Wait Duration:</span>
                    <span className="font-mono font-bold text-slate-700">{apt.waitingTime || '0 min'}</span>
                  </div>
                </div>
              </div>

              {/* Action Controls */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                {isWaiting && (
                  <>
                    <Button
                      size="sm"
                      variant="soft"
                      icon={Volume2}
                      className="grow"
                      onClick={() => handleCallToken(apt)}
                    >
                      Call Audio
                    </Button>
                    <Button
                      size="sm"
                      variant="primary"
                      className="grow"
                      onClick={() => handleStartInConsult(apt)}
                    >
                      Enter Room
                    </Button>
                  </>
                )}

                {isConsulting && (
                  <Button
                    size="sm"
                    variant="success"
                    icon={CheckCircle2}
                    className="w-full"
                    onClick={() => handleComplete(apt)}
                  >
                    Complete Encounter
                  </Button>
                )}

                {apt.status === 'Scheduled' && (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="w-full"
                    onClick={() => updateAppointmentStatus(apt.id, 'Waiting')}
                  >
                    Call into Queue
                  </Button>
                )}

                {isCompleted && (
                  <span className="text-xs text-emerald-700 font-medium text-center w-full py-1">
                    Encounter Completed
                  </span>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
