import { getTickets } from '@/app/actions';
import { Ticket } from '@/types';
import Link from 'next/link';
import SearchInput from '@/components/SearchInput';
import FilterDropdown from '@/components/FilterDropdown';
import { Filter, SlidersHorizontal, ChevronRight, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function TicketListPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; status?: string; priority?: string }>;
}) {
  const params = await searchParams;
  const query = params?.q || '';
  const status = params?.status || '';
  const priority = params?.priority || '';

  // 1. Ambil Data dari Database
  const tickets = (await getTickets(query, status, priority)) as Ticket[];

  // 2. Opsi Dropdown
  const statusOptions = [
    { label: 'Terbuka', value: 'OPEN' },
    { label: 'Dalam Proses', value: 'IN_PROGRESS' },
    { label: 'Selesai', value: 'RESOLVED' },
    { label: 'Ditutup', value: 'CLOSED' },
  ];

  const priorityOptions = [
    { label: 'Critical (P1)', value: 'P1 - Critical' },
    { label: 'High (P2)', value: 'P2 - High' },
    { label: 'Medium (P3)', value: 'P3 - Medium' },
    { label: 'Low (P4)', value: 'P4 - Low' },
  ];

  // 3. Helper Styling
  const getPriorityStyle = (p: string) => {
    if (p.includes('P1')) return 'bg-red-50 text-red-600 border border-red-100';
    if (p.includes('P2')) return 'bg-orange-50 text-orange-600 border border-orange-100';
    if (p.includes('P3')) return 'bg-yellow-50 text-yellow-600 border border-yellow-100';
    return 'bg-green-50 text-green-600 border border-green-100';
  };

  const getStatusStyle = (s: string) => {
    switch (s) {
      case 'OPEN': return 'bg-blue-50 text-blue-600 border border-blue-100';
      case 'IN_PROGRESS': return 'bg-orange-50 text-orange-600 border border-orange-100';
      case 'RESOLVED': return 'bg-green-50 text-green-600 border border-green-100';
      case 'CLOSED': return 'bg-gray-100 text-gray-500 border border-gray-200';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  const translateStatus = (s: string) => {
    const map: Record<string, string> = {
      'OPEN': 'Terbuka',
      'IN_PROGRESS': 'Dalam Proses',
      'RESOLVED': 'Selesai',
      'CLOSED': 'Ditutup'
    };
    return map[s] || s;
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-2xl font-bold text-gray-800">Tiket Saya</h1>
           <p className="text-gray-500 text-sm">Pantau status dan histori tiket yang Anda buat</p>
        </div>
        <Link href="/dashboard/tickets/create" className="bg-[#0F4C75] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#0b3a59] transition shadow-sm flex items-center gap-2">
          + Buat Tiket Baru
        </Link>
      </div>

      {/* Toolbar Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 z-20 relative">
        <SearchInput />
        
        <div className="flex gap-3">
          <FilterDropdown 
            label="Status" 
            icon={<Filter size={16} />} 
            paramKey="status" 
            options={statusOptions} 
          />
          <FilterDropdown 
            label="Filter" 
            icon={<SlidersHorizontal size={16} />} 
            paramKey="priority" 
            options={priorityOptions} 
          />
        </div>
      </div>

      {/* List Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden z-10 relative">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
           <h3 className="font-bold text-gray-800 text-sm">Daftar Tiket</h3>
           <span className="text-xs text-gray-500 font-medium bg-gray-50 px-2.5 py-1 rounded border border-gray-100">
             {tickets.length} tiket
           </span>
        </div>

        <div className="divide-y divide-gray-100">
          {tickets.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
               {query || status || priority 
                 ? 'Tidak ditemukan tiket yang sesuai pencarian/filter.' 
                 : 'Belum ada tiket yang dibuat.'}
            </div>
          ) : (
            tickets.map((t) => (
              <Link key={t.id} href={`/dashboard/tickets/${t.id}`} className="block p-6 hover:bg-gray-50 transition group cursor-pointer">
                 <div className="flex justify-between items-center">
                   
                   {/* KIRI: Informasi Utama */}
                   <div className="flex-1 pr-6">
                     
                     {/* Baris 1: ID - Badge Prioritas - Badge Kategori */}
                     <div className="flex items-center gap-3 mb-2">
                       <span className="text-[#0F4C75] font-bold text-xs bg-blue-50 px-2.5 py-1 rounded border border-blue-100">
                         {t.ticket_no}
                       </span>
                       
                       {/* Badge P1/P2/P3 */}
                       <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wide ${getPriorityStyle(t.priority)}`}>
                         {t.priority.split(' - ')[0]}
                       </span>

                       {/* Badge Kategori */}
                       <span className="bg-gray-100 text-gray-600 border border-gray-200 text-[10px] px-2 py-0.5 rounded font-medium">
                         {t.category}
                       </span>
                     </div>
                     
                     {/* Baris 2: Subjek (Judul) */}
                     <h4 className="font-bold text-gray-900 text-base mb-2 group-hover:text-[#0F4C75] transition">
                       {t.subject}
                     </h4>
                     
                     {/* Baris 3: Tanggal Dibuat & Update */}
                     <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
                       <span className="flex items-center gap-1.5">
                         <Clock size={14} /> 
                         Dibuat: {new Date(t.created_at).toLocaleDateString('id-ID', {
                           day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit', timeZone: 'Asia/Jakarta'
                         })}
                       </span>
                       {t.updated_at && (
                         <span className="hidden sm:inline-block border-l border-gray-200 pl-4">
                           Update: {new Date(t.updated_at).toLocaleDateString('id-ID', {
                             day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit', timeZone: 'Asia/Jakarta'
                           })}
                         </span>
                       )}
                     </div>
                   </div>
                   
                   {/* KANAN: Status & Panah */}
                   <div className="flex items-center gap-4">
                     <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${getStatusStyle(t.status)}`}>
                       {translateStatus(t.status)}
                     </span>
                     <ChevronRight size={20} className="text-gray-300 group-hover:text-[#0F4C75] transition-transform group-hover:translate-x-1" />
                   </div>

                 </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}