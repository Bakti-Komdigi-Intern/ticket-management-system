import Link from 'next/link';
import { Monitor, AppWindow, Wifi, Shield, ArrowRight } from 'lucide-react';
import { getRecentTickets } from '@/app/actions'; 
import { Ticket } from '@/types'; 

export default async function DashboardPage() {
  // 1. Ambil data dari database
  const recentTickets = (await getRecentTickets()) as Ticket[];

  return (
    <div>
      {/* Welcome Banner */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 mb-8 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Selamat Datang!</h1>
          <p className="text-gray-500 mt-1">Portal IT Helpdesk - Laporkan masalah IT Anda dengan mudah</p>
        </div>
        <Link href="/dashboard/tickets/create" className="bg-[#0F4C75] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#0b3a59] transition">
          + Buat Tiket Baru
        </Link>
      </div>

      {/* Category Cards (Statis) */}
      <h2 className="text-lg font-bold text-gray-800 mb-4">Butuh Bantuan IT?</h2>
      <div className="grid grid-cols-4 gap-6 mb-8">
        {[
          { icon: Monitor, label: 'Hardware', desc: 'Laptop, PC, Printer', color: 'text-blue-600 bg-blue-50' },
          { icon: AppWindow, label: 'Software', desc: 'Aplikasi, Email, VPN', color: 'text-green-600 bg-green-50' },
          { icon: Wifi, label: 'Jaringan', desc: 'Internet, WiFi, LAN', color: 'text-purple-600 bg-purple-50' },
          { icon: Shield, label: 'Keamanan', desc: 'Akun, Password, Akses', color: 'text-red-600 bg-red-50' },
        ].map((item, idx) => (
          <div key={idx} className="bg-gray-50 p-5 rounded-xl border border-gray-250 hover:shadow-md transition cursor-pointer">
            <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center mb-3`}>
              <item.icon size={20} />
            </div>
            <h3 className="font-semibold text-gray-800">{item.label}</h3>
            <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Bagian Tiket Terbaru (DINAMIS) */}
      <div className="flex justify-between items-end mb-4">
        <h2 className="text-lg font-bold text-gray-800">Tiket Terbaru Anda</h2>
        <Link href="/dashboard/tickets" className="text-sm text-[#0F4C75] font-medium flex items-center gap-1 hover:underline">
          Lihat Semua <ArrowRight size={16} />
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y">
         {/* Jika tidak ada tiket */}
         {recentTickets.length === 0 && (
            <div className="p-8 text-center text-gray-400 text-sm">
              Belum ada tiket yang dibuat.
            </div>
         )}

         {/* Mapping Data Database */}
         {recentTickets.map((ticket) => (
           <div key={ticket.id} className="p-5 flex justify-between items-start hover:bg-gray-50 transition">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[#0F4C75] font-semibold text-xs">{ticket.ticket_no}</span>
                  
                  {/* Logic Warna Badge Prioritas */}
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                    ticket.priority.includes('P1') ? 'bg-red-100 text-red-700 border-red-200' :
                    ticket.priority.includes('P2') ? 'bg-orange-100 text-orange-700 border-orange-200' :
                    ticket.priority.includes('P3') ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                    'bg-green-100 text-green-700 border-green-200'
                  }`}>
                    {ticket.priority.split(' - ')[0]} {/* Ambil kode depannya saja (P1/P2/etc) */}
                  </span>

                  <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded">
                    {ticket.category}
                  </span>
                </div>
                
                <h3 className="font-medium text-gray-900">{ticket.subject}</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Dibuat: {new Date(ticket.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta'
                  })}
                </p>
              </div>
              
              {/* Logic Warna Status */}
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                 ticket.status === 'OPEN' ? 'bg-blue-100 text-blue-700' :
                 ticket.status === 'RESOLVED' ? 'bg-green-100 text-green-700' :
                 'bg-gray-100 text-gray-600'
              }`}>
                {ticket.status}
              </span>
           </div>
         ))}
      </div>
    </div>
  );
}