import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Card, { CardHeader, CardBody } from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import RupeeIcon from '../../components/ui/RupeeIcon';
import {
  Download,
  Filter,
  Activity,
  BedDouble,
  FlaskConical,
  } from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const departmentThroughputData = [
  { department: 'Cardiology', visits: 142, labOrders: 230, scans: 84 },
  { department: 'Pulmonology', visits: 98, labOrders: 160, scans: 92 },
  { department: 'Orthopedics', visits: 110, labOrders: 85, scans: 140 },
  { department: 'Emergency', visits: 280, labOrders: 420, scans: 190 },
  { department: 'ICU Care', visits: 45, labOrders: 310, scans: 65 },
];

const revenueMonthlyData = [
  { month: 'Apr', revenue: 980000, expenses: 620000 },
  { month: 'May', revenue: 1050000, expenses: 640000 },
  { month: 'Jun', revenue: 1120000, expenses: 670000 },
  { month: 'Jul', revenue: 1190000, expenses: 710000 },
  { month: 'Aug', revenue: 1240000, expenses: 730000 },
  { month: 'Sep', revenue: 1280400, expenses: 750000 },
];

const bedDistributionData = [
  { name: 'ICU Beds', value: 10, color: '#DC2626' },
  { name: 'General Medical', value: 16, color: '#2563EB' },
  { name: 'Surgical Wards', value: 11, color: '#7C3AED' },
  { name: 'Orthopedic Wards', value: 12, color: '#0891B2' },
  { name: 'Available Vacant', value: 24, color: '#16A34A' },
];

export default function ReportsDashboard() {
  const { metrics, addToast } = useApp();
  const [dateRange, setDateRange] = useState('Month to Date (Sep 2026)');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  const handleExport = (format) => {
    addToast({
      title: `Exporting ${format.toUpperCase()}`,
      message: `Generated official hospital analytics report in ${format.toUpperCase()} format.`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Hospital Operational & Financial Analytics
            </h2>
            <Badge variant="primary">Q3 Executive Intelligence</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Clinical turnaround metrics, departmental caseload, diagnostic throughput, and revenue cycle reporting.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" icon={Download} onClick={() => handleExport('csv')}>
            Export CSV
          </Button>
          <Button variant="primary" size="sm" icon={Download} onClick={() => handleExport('pdf')}>
            Export Board PDF
          </Button>
        </div>
      </div>

      {/* Filter Ribbon */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-700">Date Range:</span>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="h-9 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
            >
              <option value="Today">Today (Sep 10, 2026)</option>
              <option value="Week to Date">Week to Date (Sep 4 - 10)</option>
              <option value="Month to Date (Sep 2026)">Month to Date (Sep 2026)</option>
              <option value="Q3 2026">Q3 Full Quarter</option>
            </select>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="font-semibold text-slate-700">Department:</span>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="h-9 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
            >
              <option value="All">All Hospital Services</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Pulmonology">Pulmonology</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Emergency">Emergency</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Average Inpatient LOS"
          value="3.8 Days"
          subtitle="Length of Stay Benchmark"
          trend="-0.4d vs standard"
          trendType="up"
          icon={Activity}
          iconBg="bg-blue-50 text-primary"
        />
        <StatCard
          title="Bed Occupancy Rate"
          value={metrics.occupancyRate}
          subtitle="60 / 84 Beds Occupied"
          trend="Peak: 86% in ICU"
          trendType="neutral"
          icon={BedDouble}
          iconBg="bg-amber-50 text-amber-600"
        />
        <StatCard
          title="Average Lab TAT"
          value="42 Mins"
          subtitle="Sample to Verification"
          trend="99.2% in SLA"
          trendType="up"
          icon={FlaskConical}
          iconBg="bg-violet-50 text-violet-600"
        />
        <StatCard
          title="Net Hospital Margin"
          value="41.4%"
          subtitle="Revenue vs Operating Exp"
          trend="+3.2% YoY"
          trendType="up"
          icon={RupeeIcon}
          iconBg="bg-emerald-50 text-emerald-600"
        />
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Volume Chart */}
        <Card className="p-5">
          <CardHeader
            title="Departmental Patient & Diagnostic Caseload"
            subtitle="Encounter volume, laboratory panels, and imaging requests"
          />
          <CardBody className="pt-4">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentThroughputData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="department" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Bar dataKey="visits" name="Clinical Visits" fill="#2563EB" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="labOrders" name="Lab Tests" fill="#7C3AED" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="scans" name="Imaging Scans" fill="#0891B2" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-3 text-xs text-slate-500">
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary" /> Encounters</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-600" /> Lab Tests</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-600" /> Imaging</div>
            </div>
          </CardBody>
        </Card>

        {/* Financial Growth Trends */}
        <Card className="p-5">
          <CardHeader
            title="Monthly Revenue vs Operating Expenditure"
            subtitle="Trailing 6-month hospital financial performance"
          />
          <CardBody className="pt-4">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueMonthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip
                    formatter={(v) => [`$${Number(v).toLocaleString()}`, '']}
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Line type="monotone" dataKey="revenue" name="Gross Revenue" stroke="#16A34A" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="expenses" name="Operating Costs" stroke="#64748B" strokeWidth={2} strokeDasharray="4 4" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-3 text-xs text-slate-500">
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-success" /> Gross Revenue</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-500" /> Operating Costs</div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Bed Distribution Pie Chart */}
      <Card className="p-5">
        <CardHeader
          title="Hospital Bed Capacity Breakdown"
          subtitle="Current distribution of occupied and available licensed inpatient beds"
        />
        <CardBody className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6">
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bedDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {bedDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val, name) => [`${val} Beds`, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2.5 text-xs">
              {bedDistributionData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-md" style={{ backgroundColor: item.color }} />
                    <span className="font-semibold text-slate-800">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-900 font-mono">{item.value} Beds</span>
                </div>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
