import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { can } from '../../config/permissions';
import Card, { CardHeader } from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import VerifiedBadge from '../../components/ui/VerifiedBadge';
import Modal from '../../components/ui/Modal';
import {
  Search,
  Lock,
  Download,
  Eye,
} from 'lucide-react';

export default function AuditLogs() {
  const { auditLogs, addToast, currentRole } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [selectedLog, setSelectedLog] = useState(null);

  const canViewLogs = can(currentRole, 'canViewAuditLogs');

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchesSearch =
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'All' || log.role === roleFilter;
      const matchesSeverity = severityFilter === 'All' || log.severity === severityFilter;
      return matchesSearch && matchesRole && matchesSeverity;
    });
  }, [auditLogs, searchTerm, roleFilter, severityFilter]);

  const columns = [
    {
      key: 'id',
      label: 'Log ID',
      sortable: true,
      render: (val) => <span className="font-mono text-xs font-bold text-slate-500">{val}</span>,
    },
    {
      key: 'user',
      label: 'Staff User',
      sortable: true,
      render: (val, row) => (
        <div>
          <div className="font-semibold text-slate-900">{val}</div>
          <div className="text-[11px] text-slate-400 font-mono">IP: {row.ipAddress}</div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (val) => <Badge variant="neutral">{val}</Badge>,
    },
    {
      key: 'action',
      label: 'Action Performed',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-semibold text-slate-800">{val}</span>
          <p className="text-xs text-slate-500 truncate max-w-xs">{row.details}</p>
        </div>
      ),
    },
    {
      key: 'patient',
      label: 'Patient / Context',
      render: (val) => <span className="text-slate-700 font-medium">{val}</span>,
    },
    {
      key: 'timestamp',
      label: 'Timestamp',
      sortable: true,
      render: (_, row) => (
        <div className="text-xs">
          <div className="font-semibold text-slate-800">{row.time}</div>
          <div className="text-[11px] text-slate-400">{row.date}</div>
        </div>
      ),
    },
    {
      key: 'severity',
      label: 'Status / Level',
      render: (val) => {
        const variants = {
          Info: 'primary',
          Success: 'success',
          Warning: 'warning',
          Critical: 'error',
        };
        return <Badge dot variant={variants[val] || 'neutral'}>{val}</Badge>;
      },
    },
    {
      key: 'view',
      label: 'Inspect',
      render: (_, row) => (
        <Button
          size="sm"
          variant="ghost"
          icon={Eye}
          onClick={() => setSelectedLog(row)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner with Read-Only Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">System Audit & Compliance Log</h2>
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <Lock className="w-3 h-3 text-emerald-600" /> Immutable Read-Only Ledger
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tamper-proof chronological trail of all clinical consultations, lab verifications, medication administrations, and security events.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          icon={Download}
          disabled={!canViewLogs}
          onClick={() => {
            if (!canViewLogs) return;
            addToast({
              title: 'Audit Report Exported',
              message: 'CSV export downloaded with cryptographic compliance checksum.',
              type: 'success',
            });
          }}
        >
          Export Compliance CSV
        </Button>
      </div>

      {/* Filter Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="sm:col-span-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search audit trail by user, action, patient, or details..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 pl-9 pr-3 text-sm bg-slate-50 rounded-lg border border-slate-300 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full h-10 px-3 text-sm bg-slate-50 rounded-lg border border-slate-300 focus:outline-none"
            >
              <option value="All">All Roles</option>
              <option value="Doctor">Doctor</option>
              <option value="Nurse">Nurse</option>
              <option value="Lab Technician">Lab Technician</option>
              <option value="Radiology Technician">Radiology Technician</option>
              <option value="Receptionist">Receptionist</option>
              <option value="Administrator">Administrator</option>
            </select>
          </div>

          <div>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full h-10 px-3 text-sm bg-slate-50 rounded-lg border border-slate-300 focus:outline-none"
            >
              <option value="All">All Status Levels</option>
              <option value="Info">Info</option>
              <option value="Success">Success</option>
              <option value="Warning">Warning</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader
          title={`Audit Events (${filteredLogs.length})`}
          subtitle="Showing latest verified activities recorded in hospital ledger"
        />
        <Table
          columns={columns}
          data={filteredLogs}
          emptyTitle="No audit logs matched"
          emptyDescription="Change your filter terms to view more audit items."
        />
      </Card>

      {/* Detailed Read-Only Event Inspector Modal */}
      {selectedLog && (
        <Modal
          isOpen={Boolean(selectedLog)}
          onClose={() => setSelectedLog(null)}
          title={`Audit Record: ${selectedLog.id}`}
          subtitle="Cryptographically sealed activity snapshot"
          footer={
            <Button variant="secondary" onClick={() => setSelectedLog(null)}>
              Close Inspector
            </Button>
          }
        >
          <div className="space-y-4 text-xs">
            <VerifiedBadge
              title="Verified Audit Entry"
              verifiedBy={`System SHA-256 Engine`}
              verifiedAt={`${selectedLog.date} ${selectedLog.time}`}
            />

            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 block uppercase font-bold text-[10px]">Staff Actor</span>
                <span className="font-semibold text-slate-900 text-sm">{selectedLog.user}</span>
                <span className="text-slate-500 block">Role: {selectedLog.role}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase font-bold text-[10px]">Client Workstation</span>
                <span className="font-mono text-slate-800 text-sm">{selectedLog.ipAddress}</span>
                <span className="text-slate-500 block">Status: {selectedLog.severity}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-slate-400 block uppercase font-bold text-[10px] mb-1">Action Performed</span>
              <span className="font-bold text-slate-900 text-sm">{selectedLog.action}</span>
              <p className="text-slate-700 mt-2 text-xs leading-relaxed">{selectedLog.details}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-slate-400 block uppercase font-bold text-[10px] mb-1">Target Subject</span>
              <span className="font-semibold text-slate-900">{selectedLog.patient}</span>
            </div>

            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-800 text-[11px] flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>
                This audit log is strictly read-only and cannot be altered, deleted, or purged under federal HIPAA & CFR Part 11 requirements.
              </span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
