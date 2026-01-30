import Link from 'next/link';
import { Home, PlusCircle, List, Search, Bell } from 'lucide-react';
import { cookies } from 'next/headers'; // Import cookies
import UserProfile from '@/components/UserProfile'; // Import komponen baru

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // 1. Ambil data user dari Cookies
  const cookieStore = await cookies();
  const userSession = cookieStore.get('user_session');
  
  // Default data jika tidak ada sesi (atau redirect ke login)
  let user = { name: 'Tamu', role: 'Guest' };
  
  if (userSession) {
    try {
      user = JSON.parse(userSession.value);
    } catch (e) {
      console.error("Gagal parsing sesi user");
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0F4C75] text-white flex flex-col fixed h-full z-10">
        <div className="p-6">
          <h1 className="font-bold text-xl">IT Helpdesk</h1>
          <p className="text-xs text-gray-300">Bakti Komdigi</p>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10">
            <Home size={20} /> Beranda
          </Link>
          <Link href="/dashboard/tickets/create" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10">
            <PlusCircle size={20} /> Buat Tiket
          </Link>
          <Link href="/dashboard/tickets" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10">
            <List size={20} /> Tiket Saya
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col">
        
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-20">
          <div className="flex-1 max-w-lg">
           
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative text-gray-500 hover:text-gray-700">
              <Bell size={20} />
            </button>
            
           
            <UserProfile name={user.name} role={user.role} />
            
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}