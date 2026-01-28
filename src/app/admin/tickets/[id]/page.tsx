'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Ticket, 
  Clock, 
  User, 
  Calendar,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Edit
} from 'lucide-react';
import { formatDate, getPriorityColor, getStatusColor } from '@/lib/utils';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

interface TicketDetail {
  id: string;
  subject: string;
  description: string;
  category_id: string;
  category_name: string;
  priority: string;
  status: string;
  reporter_id: string;
  reporter_name: string;
  reporter_email?: string;
  assigned_to: string;
  assigned_name: string;
  assigned_email?: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  response_deadline: string;
  resolution_deadline: string;
  first_response_at?: string;
}

interface SLAConfig {
  priority: string;
  name: string;
  description: string;
  response_time_minutes: number;
  resolution_time_minutes: number;
}

export default function TicketDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [slaConfig, setSlaConfig] = useState<SLAConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTicketDetail = async () => {
      try {
        setIsLoading(true);
        
        // Fetch ticket detail
        const ticketRes = await fetch(`/api/tickets/${params.id}`);
        if (!ticketRes.ok) {
          throw new Error('Ticket not found');
        }
        const ticketData = await ticketRes.json();
        
        // Fetch SLA config
        const slaRes = await fetch('/api/sla');
        const slaData = await slaRes.json();
        const slaForPriority = slaData.find((s: SLAConfig) => s.priority === ticketData.priority);
        
        setTicket(ticketData);
        setSlaConfig(slaForPriority);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTicketDetail();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tiket Tidak Ditemukan</h2>
        <p className="text-gray-600 mb-6">{error || 'Tiket yang Anda cari tidak ada.'}</p>
        <button
          onClick={() => router.push('/admin/tickets')}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition"
        >
          Kembali ke Daftar Tiket
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/admin/tickets')}
            className="p-2 hover:bg-gray-100 hover:underline rounded-lg transition"
          >
            {/* <ArrowLeft className="w-5 h-5 text-gray-600" /> */}
            ←&ensp; Kembali ke Daftar Tiket
          </button>
          
        </div>

        <button
          onClick={() => router.push(`/admin/tickets?edit=${ticket.id}`)}
          disabled={ticket.status === 'Ditutup'}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Edit className="w-4 h-4" />
          Edit Tiket
        </button>
      </div>

      {/* Main Content - 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1 - Main Info (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Information Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Ticket className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Detail Ticket</h2>
            </div>

            <div className="space-y-4">
              {/* ID Ticket */}
              <div>
                {/* <label className="block text-sm font-medium text-gray-500 mb-1">
                  ID Tiket
                </label> */}
                <p className="text-lg font-semibold text-gray-900">{ticket.id}</p>
                <p className="text-lg text-gray-900">{ticket.subject}</p>
              </div>

              {/* Subject */}
              <div>
                {/* <label className="block text-sm font-medium text-gray-500 mb-1">
                  Subjek
                </label> */}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Deskripsi
                </label>
                <p className="text-base text-gray-700 whitespace-pre-wrap">
                  {ticket.description || '-'}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Kategori
                  </label>
                  <span className="inline-block px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-800 rounded-lg">
                    {ticket.category_name}
                  </span>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Prioritas
                  </label>
                  <span className={`inline-block px-3 py-1.5 text-sm font-medium rounded-lg ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority} - {slaConfig?.name}
                  </span>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Status
                  </label>
                  <span className={`inline-block px-3 py-1.5 text-sm font-medium rounded-lg ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2 - Side Info (1/3 width) */}
        <div className="space-y-6">
          {/* SLA Information Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900">SLA Information</h3>
            </div>

            <div className="space-y-4">
              {/* Target Response */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Target Respon
                </label>
                <p className="text-sm font-semibold text-gray-900">
                  {slaConfig && formatMinutesToTime(slaConfig.response_time_minutes)}
                </p>
              </div>

              {/* Target Resolution */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Target Resolusi
                </label>
                <p className="text-sm font-semibold text-gray-900">
                  {slaConfig && formatMinutesToTime(slaConfig.resolution_time_minutes)}
                </p>
              </div>

              <div className="border-t border-gray-200 pt-4">
                {/* Deadline Response */}
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Deadline Respon
                  </label>
                  <div className="flex items-center gap-2">
                    {ticket.first_response_at ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <p className="text-sm text-green-700 font-medium">Terpenuhi</p>
                      </>
                    ) : (
                      <>
                        <SLADeadlineStatus deadline={ticket.response_deadline} />
                      </>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {formatDate(ticket.response_deadline)}
                  </p>
                </div>

                {/* Deadline Resolution */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Deadline Resolusi
                  </label>
                  <div className="flex items-center gap-2">
                    {ticket.resolved_at ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <p className="text-sm text-green-700 font-medium">Terpenuhi</p>
                      </>
                    ) : (
                      <>
                        <SLADeadlineStatus deadline={ticket.resolution_deadline} />
                      </>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {formatDate(ticket.resolution_deadline)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Reporter Information Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Informasi Pelapor</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {ticket.reporter_name}
                  </p>
                  <p className="text-xs text-gray-600">
                    {ticket.reporter_email || 'Email tidak tersedia'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Assigned To Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Ditugaskan Kepada</h3>
            </div>

            <div className="space-y-3">
              {ticket.assigned_to ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {ticket.assigned_name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {ticket.assigned_email || 'Email tidak tersedia'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <User className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Belum ditugaskan</p>
                </div>
              )}
            </div>
          </div>

          {/* Timeline Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Timeline</h3>
            </div>

            <div className="space-y-4">
              {/* Created */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Tanggal Dibuat
                </label>
                <p className="text-sm text-gray-900">
                  {formatDate(ticket.created_at)}
                </p>
                <p className="text-xs text-gray-600 mt-0.5">
                  {formatRelativeTime(ticket.created_at)}
                </p>
              </div>

              {/* Updated */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Terakhir Diupdate
                </label>
                <p className="text-sm text-gray-900">
                  {formatDate(ticket.updated_at)}
                </p>
                <p className="text-xs text-gray-600 mt-0.5">
                  {formatRelativeTime(ticket.updated_at)}
                </p>
              </div>

              {/* Resolved */}
              {ticket.resolved_at && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Diselesaikan
                  </label>
                  <p className="text-sm text-gray-900">
                    {formatDate(ticket.resolved_at)}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {formatRelativeTime(ticket.resolved_at)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components and Functions

function SLADeadlineStatus({ deadline }: { deadline: string }) {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diff = deadlineDate.getTime() - now.getTime();
  
  if (diff < 0) {
    const overdueDays = Math.floor(Math.abs(diff) / (1000 * 60 * 60 * 24));
    const overdueHours = Math.floor((Math.abs(diff) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return (
      <>
        <XCircle className="w-4 h-4 text-red-600" />
        <p className="text-sm text-red-700 font-medium">
          Terlewat {overdueDays > 0 ? `${overdueDays}h ` : ''}{overdueHours}j
        </p>
      </>
    );
  }
  
  const remainingHours = Math.floor(diff / (1000 * 60 * 60));
  const remainingMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return (
    <>
      <Clock className="w-4 h-4 text-blue-600" />
      <p className="text-sm text-blue-700 font-medium">
        {remainingHours}j {remainingMinutes}m
      </p>
    </>
  );
}

function formatMinutesToTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} menit`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} jam`;
  }
  
  return `${hours} jam ${remainingMinutes} menit`;
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (minutes < 60) {
    return `${minutes} menit yang lalu`;
  } else if (hours < 24) {
    return `${hours} jam yang lalu`;
  } else if (days < 7) {
    return `${days} hari yang lalu`;
  } else {
    return format(date, 'd MMMM yyyy', { locale: localeId });
  }
}