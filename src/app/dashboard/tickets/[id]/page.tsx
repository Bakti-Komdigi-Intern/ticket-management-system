import { getTicketById, getTicketComments, addComment, getSLAPolicy } from '@/app/actions';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Clock, User, Phone, Building, 
  Send, AlertCircle, MoreHorizontal 
} from 'lucide-react';
import { Ticket, Comment, SLAPolicy } from '@/types';

interface PageProps {
  params: { id: string };
}

export default async function TicketDetailPage({ params }: PageProps) {
  const { id } = await params;
  
  // 1. Ambil Data Tiket
  const ticket = (await getTicketById(id)) as Ticket;
  if (!ticket) return notFound();

  // 2. Ambil Data Komentar & SLA secara paralel
  const commentsData = getTicketComments(ticket.id);
  const slaData = getSLAPolicy(ticket.priority);
  
  const [comments, sla] = await Promise.all([commentsData, slaData]) as [Comment[], SLAPolicy];

  // Hitung Deadline Resolusi (Created Time + SLA Hours)
  let deadlineDate = null;
  if (sla) {
    const createdTime = new Date(ticket.created_at).getTime();
    deadlineDate = new Date(createdTime + sla.resolution_time_hours * 60 * 60 * 1000);
  }

  // --- Helper Functions ---
  const getPriorityStyle = (p: string) => {
    if (p.includes('P1')) return 'bg-red-50 text-red-600 border border-red-200';
    if (p.includes('P2')) return 'bg-orange-50 text-orange-600 border border-orange-200';
    if (p.includes('P3')) return 'bg-yellow-50 text-yellow-600 border border-yellow-200';
    return 'bg-green-50 text-green-600 border border-green-200';
  };

  return (
    <div className="max-w-7xl mx-auto pb-10">
      {/* Header*/}
      <div className="mb-6">
        <Link href="/dashboard/tickets" className="text-gray-500 hover:text-[#0F4C75] flex items-center gap-2 text-sm font-medium">
          <ArrowLeft size={16} /> Kembali ke Daftar Tiket
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[#0F4C75] font-bold text-lg">{ticket.ticket_no}</span>
            <span className={`px-2 py-0.5 rounded text-xs font-bold ${getPriorityStyle(ticket.priority)}`}>
              {ticket.priority}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{ticket.subject}</h1>
        </div>
        <span className="px-4 py-1.5 rounded-full text-sm font-bold bg-blue-100 text-blue-700">
          {ticket.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- KOLOM KIRI --- */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Deskripsi */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-sm text-gray-500 font-semibold uppercase mb-3">Deskripsi</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
          </div>

          {/* Aktivitas & Komentar DINAMIS */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
             <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                <MoreHorizontal size={18} className="text-gray-500"/>
                <h3 className="font-bold text-gray-800">Aktivitas & Komentar</h3>
             </div>
             
             <div className="p-6 space-y-8">
                {/* Default Log: Tiket Dibuat */}
                <div className="flex gap-4">
                   <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                      <User size={14} />
                   </div>
                   <div>
                      <div className="flex items-center gap-2">
                         <span className="font-bold text-sm text-[#0F4C75]">{ticket.user_email}</span>
                         <span className="text-xs text-gray-400">
                            {new Date(ticket.created_at).toLocaleString('id-ID')}
                         </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Tiket berhasil dibuat.</p>
                   </div>
                </div>

                {/* Looping Komentar dari Database */}
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4">
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                       comment.user_role === 'ADMIN' ? 'bg-orange-100 text-orange-600' : 'bg-gray-200 text-gray-600'
                     }`}>
                        <User size={14} />
                     </div>
                     <div className="w-full">
                        <div className="flex items-center gap-2 mb-1">
                           <span className="font-bold text-sm text-gray-900">{comment.user_name}</span>
                           <span className="text-xs text-gray-500 bg-gray-100 px-1.5 rounded">{comment.user_role}</span>
                           <span className="text-xs text-gray-400">
                             {new Date(comment.created_at).toLocaleString('id-ID')}
                           </span>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg rounded-tl-none border border-gray-100 text-sm text-gray-700">
                           {comment.message}
                        </div>
                     </div>
                  </div>
                ))}
             </div>

             {/* Form Input Komentar (Server Action) */}
             <div className="p-4 border-t border-gray-100 bg-gray-50">
                <form action={addComment} className="relative">
                   <input type="hidden" name="ticket_id" value={ticket.id} />
                   <textarea 
                      name="message"
                      rows={3} 
                      required
                      className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#0F4C75] outline-none"
                      placeholder="Tulis balasan..."
                   ></textarea>
                   <button type="submit" className="absolute bottom-3 right-3 bg-[#0F4C75] text-white px-4 py-1.5 rounded-md text-xs font-medium hover:bg-[#0b3a59] flex items-center gap-2">
                      <Send size={12} /> Kirim
                   </button>
                </form>
             </div>
          </div>
        </div>

        {/* --- KOLOM KANAN (SLA DINAMIS) --- */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
             <h4 className="text-xs font-bold text-red-500 uppercase flex items-center gap-2 mb-4">
                <AlertCircle size={14} /> SLA Information
             </h4>
             <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-gray-50 pb-2">
                   <span className="text-gray-500">Target Respon</span>
                   {/* Data dari DB SLA */}
                   <span className="font-medium text-gray-900">{sla ? sla.response_time_minutes + ' Menit' : '-'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                   <span className="text-gray-500">Target Resolusi</span>
                   {/* Data dari DB SLA */}
                   <span className="font-medium text-gray-900">{sla ? sla.resolution_time_hours + ' Jam' : '-'}</span>
                </div>
                <div className="pt-1">
                   <span className="text-gray-500 text-xs block mb-1">Deadline Resolusi</span>
                   <span className="font-medium text-gray-900 flex items-center gap-2">
                      <Clock size={14} className="text-red-500"/> 
                      {/* Kalkulasi Otomatis */}
                      {deadlineDate 
                        ? deadlineDate.toLocaleTimeString('id-ID', {day: 'numeric', month:'short', hour: '2-digit', minute:'2-digit'}) + ' WIB'
                        : 'Belum ditentukan'}
                   </span>
                </div>
             </div>
          </div>

          {/* Info Pelapor */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
             <h4 className="text-xs font-bold text-gray-900 uppercase mb-4">Informasi Pelapor</h4>
             <div className="space-y-4">
                <div className="flex items-start gap-3">
                   <User size={16} className="text-gray-400 mt-0.5" />
                   <div>
                      <p className="text-sm font-semibold text-gray-900">{ticket.user_email}</p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <Building size={16} className="text-gray-400" />
                   <div>
                      <p className="text-sm text-gray-700">{ticket.location || '-'}</p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <Phone size={16} className="text-gray-400" />
                   <div>
                      <p className="text-sm text-gray-700">{ticket.phone || '-'}</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}