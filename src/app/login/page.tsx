import { login } from '@/app/actions';
import { Lock, Mail } from 'lucide-react';

// Ambil searchParams untuk cek apakah ada error
export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const isInvalid = searchParams.error === 'invalid';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      {/* Logo Section */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-[#0F4C75] rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">IT Helpdesk</h1>
        <p className="text-gray-500 text-sm">Bakti Komdigi</p>
      </div>

      {/* Card Form */}
      <div className="bg-white p-8 rounded-2xl shadow-sm w-full max-w-md border border-gray-100">
        <h2 className="text-xl font-semibold text-center text-gray-800 mb-1">Selamat Datang</h2>
        <p className="text-center text-gray-500 text-sm mb-6">Masuk akun bakti untuk melaporkan masalah IT</p>

     
        {isInvalid && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center">
            Email atau Password salah! Silakan coba lagi.
          </div>
        )}

        
        <form action={login} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400">
                <Mail size={18} />
              </span>
              <input 
                name="email"
                type="email" 
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F4C75] bg-gray-50 text-black"
              
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400">
                <Lock size={18} />
              </span>
              <input 
                name="password"
                type="password" 
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F4C75] bg-gray-50 text-black"
      
              />
            </div>
          </div>

          <button type="submit" className="block w-full bg-[#0F4C75] text-white text-center py-2.5 rounded-lg font-medium hover:bg-[#0b3a59] transition mt-6">
            Masuk
          </button>
        </form>
      </div>

      <p className="mt-8 text-xs text-gray-400">© 2026 IT Helpdesk Bakti Komdigi. All rights reserved.</p>
    </div>
  );
}