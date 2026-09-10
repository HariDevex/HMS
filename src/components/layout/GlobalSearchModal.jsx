import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, User, Calendar, FlaskConical, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function GlobalSearchModal() {
  const { globalSearchOpen, setGlobalSearchOpen, patients, appointments, labOrders, setSelectedPatientId } = useApp();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setGlobalSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape' && globalSearchOpen) {
        setGlobalSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [globalSearchOpen, setGlobalSearchOpen]);

  if (!globalSearchOpen) return null;

  const q = query.toLowerCase().trim();

  const matchingPatients = q
    ? patients.filter(p => p.name.toLowerCase().includes(q) || p.mrn.toLowerCase().includes(q) || p.diagnosis.toLowerCase().includes(q))
    : patients.slice(0, 3);

  const matchingAppointments = q
    ? appointments.filter(a => a.patientName.toLowerCase().includes(q) || a.doctor.toLowerCase().includes(q) || a.tokenNumber.toLowerCase().includes(q))
    : appointments.slice(0, 2);

  const matchingLabOrders = q
    ? labOrders.filter(l => l.testName.toLowerCase().includes(q) || l.patientName.toLowerCase().includes(q) || l.orderNumber.toLowerCase().includes(q))
    : labOrders.slice(0, 2);

  const handleSelectPatient = (patientId) => {
    setSelectedPatientId(patientId);
    setGlobalSearchOpen(false);
    navigate(`/patients/${patientId}`);
  };

  const handleSelectAppointment = () => {
    setGlobalSearchOpen(false);
    navigate('/appointments');
  };

  const handleSelectLab = () => {
    setGlobalSearchOpen(false);
    navigate('/laboratory');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 pt-16 sm:pt-24 animate-fade-in">
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setGlobalSearchOpen(false)} />

      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
          <Search className="w-5 h-5 text-primary shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search patients, staff, appointments, reports, lab orders..."
            className="w-full bg-transparent text-slate-900 placeholder_text-slate-400 text-sm sm:text-base focus:outline-none"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-700 p-1">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold text-slate-500 bg-slate-200/80 rounded border border-slate-300">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto grow space-y-4 scrollbar-thin">
          {/* Patients Section */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-2 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Patients ({matchingPatients.length})
            </div>
            {matchingPatients.length === 0 ? (
              <p className="text-xs text-slate-400 px-2 py-1">No matching patients</p>
            ) : (
              <div className="space-y-1">
                {matchingPatients.map(p => (
                  <div
                    key={p.id}
                    onClick={() => handleSelectPatient(p.id)}
                    className="p-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                        {p.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-900 group-hover:text-primary transition-colors">{p.name}</span>
                          <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{p.mrn}</span>
                          <span className="text-xs text-slate-400">{p.age}y, {p.gender}</span>
                        </div>
                        <p className="text-xs text-slate-500 truncate max-w-md mt-0.5">{p.diagnosis}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Appointments Section */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Appointments ({matchingAppointments.length})
            </div>
            {matchingAppointments.length === 0 ? (
              <p className="text-xs text-slate-400 px-2 py-1">No matching appointments</p>
            ) : (
              <div className="space-y-1">
                {matchingAppointments.map(a => (
                  <div
                    key={a.id}
                    onClick={handleSelectAppointment}
                    className="p-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center shrink-0">
                        {a.tokenNumber}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-900">{a.patientName}</span>
                          <span className="text-xs text-slate-500">with {a.doctor}</span>
                        </div>
                        <p className="text-xs text-slate-400">{a.date} at {a.time} • {a.status}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Lab Orders Section */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-2 flex items-center gap-1.5">
              <FlaskConical className="w-3.5 h-3.5" /> Laboratory Tests ({matchingLabOrders.length})
            </div>
            {matchingLabOrders.length === 0 ? (
              <p className="text-xs text-slate-400 px-2 py-1">No matching lab tests</p>
            ) : (
              <div className="space-y-1">
                {matchingLabOrders.map(l => (
                  <div
                    key={l.id}
                    onClick={handleSelectLab}
                    className="p-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-violet-100 text-violet-700 font-bold text-xs flex items-center justify-center shrink-0">
                        LAB
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-900">{l.testName}</span>
                          <span className="text-xs text-slate-500">for {l.patientName}</span>
                        </div>
                        <p className="text-xs text-slate-400">{l.orderNumber} • Status: {l.status}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Press <strong>ESC</strong> to close</span>
          <span>MediCore Global Medical Search</span>
        </div>
      </div>
    </div>
  );
}
