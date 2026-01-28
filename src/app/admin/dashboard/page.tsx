'use client';

import { useDashboard } from '@/hooks/use-dashboard';
import { 
  Ticket, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp 
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import Link from 'next/link';
import { formatDate, getPriorityColor, getStatusColor } from '@/lib/utils';

const COLORS = {
  P1: '#FF4D4F',
  P2: '#FFA940',
  P3: '#FFC53D',
  P4: '#52C41A',
};

const PRIORITY_NAMES: Record<string, string> = {
  'P1': 'Critical',
  'P2': 'High',
  'P3': 'Medium',
  'P4': 'Low',
};

export default function DashboardPage() {
  const { stats, priorityStats, slaConfig, recentTickets, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const chartData = priorityStats?.map((item: any) => ({
    name: item.priority,
    value: item.count,
  })) || [];

  const totalActiveTickets = chartData.reduce((sum: number, item: any) => sum + item.value, 0);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Selamat datang di IT Helpdesk Trouble Ticketing System</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Tiket"
          value={stats?.totalTickets || 0}
          icon={Ticket}
          color="blue"
        />
        <StatCard
          title="Tiket Masuk Hari Ini"
          value={stats?.todayTickets || 0}
          icon={TrendingUp}
          color="blue"
        />
        <StatCard
          title="Dalam Proses"
          value={stats?.inProgressTickets || 0}
          icon={Clock}
          color="yellow"
        />
        <StatCard
          title="Tiket Selesai"
          value={stats?.resolvedTickets || 0}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Tiket Terlewat"
          value={stats?.overdueTickets || 0}
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* SLA Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Service Level Agreement (SLA)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {slaConfig?.map((sla: any) => (
            <SLACard key={sla.id} sla={sla} />
          ))}
        </div>
      </div>

      {/* Charts and Recent Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tiket Aktif per Prioritas</h3>
          
          {chartData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              <div className="text-center mt-4">
                <p className="text-3xl font-bold text-gray-900">{totalActiveTickets}</p>
                <p className="text-sm text-gray-600">Total Tiket Aktif</p>
              </div>
            </>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              Tidak ada tiket aktif
            </div>
          )}
        </div>

        {/* Recent Tickets */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Tiket Terbaru</h3>
            <Link 
              href="/admin/tickets"
              className="text-sm text-primary hover:underline font-medium"
            >
              Lihat Semua →
            </Link>
          </div>

          <div className="space-y-3">
            {recentTickets && recentTickets.length > 0 ? (
              recentTickets.map((ticket: any) => (
                <div
                  key={ticket.id}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <Link 
                        href={`/admin/tickets/${ticket.id}`}
                        className="text-sm font-medium text-blue-600 hover:underline"
                      >
                        {ticket.id}
                      </Link>
                      <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-900 mb-1">{ticket.subject}</p>
                  <p className="text-xs text-gray-500">
                    {ticket.reporter_name} • {formatDate(ticket.created_at)}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                Belum ada tiket
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Stats Card Component
function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  color 
}: { 
  title: string; 
  value: number; 
  icon: any; 
  color: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-600 mt-1">{title}</p>
    </div>
  );
}

// SLA Card Component
function SLACard({ sla }: { sla: any }) {
  const bgColors: Record<string, string> = {
    P1: 'bg-red-50 border-red-200',
    P2: 'bg-orange-100 border-orange-200',
    P3: 'bg-yellow-50 border-yellow-200',
    P4: 'bg-green-50 border-green-200',
  };

  const textColors: Record<string, string> = {
    P1: 'text-red-900',
    P2: 'text-orange-900',
    P3: 'text-yellow-900',
    P4: 'text-green-900',
  };

  return (
    <div className={`p-4 rounded-lg border ${bgColors[sla.priority]}`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-lg font-bold ${textColors[sla.priority]}`}>
          {sla.priority}
        </span>
        <span className={`text-sm font-medium ${textColors[sla.priority]}`}>
          {sla.name}
        </span>
      </div>
      <p className={`text-xs ${textColors[sla.priority]} mb-3`}>
        {sla.description}
      </p>
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className={textColors[sla.priority]}>Respon:</span>
          <span className={`font-medium ${textColors[sla.priority]}`}>
            {sla.response_time_minutes >= 60 
              ? `${Math.floor(sla.response_time_minutes / 60)} jam`
              : `${sla.response_time_minutes} menit`}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className={textColors[sla.priority]}>Resolusi:</span>
          <span className={`font-medium ${textColors[sla.priority]}`}>
            {sla.resolution_time_minutes >= 60 
              ? `${Math.floor(sla.resolution_time_minutes / 60)} jam`
              : `${sla.resolution_time_minutes} menit`}
          </span>
        </div>
      </div>
    </div>
  );
}