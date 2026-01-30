'use client';

import { useState } from 'react';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { logout } from '@/app/actions';

interface UserProfileProps {
  name: string;
  role: string;
}

export default function UserProfile({ name, role }: UserProfileProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Tombol Profil */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 border-l pl-6 focus:outline-none"
      >
        <div className="text-right hidden md:block">
          <div className="text-sm font-medium text-gray-700">{name}</div>
          <div className="text-xs text-gray-500">{role}</div>
        </div>
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-300 transition">
          <User size={16} />
        </div>
        <ChevronDown size={14} className="text-gray-400" />
      </button>

      {/* Dropdown Menu (Muncul saat diklik) */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
          <div className="px-4 py-2 border-b border-gray-50 md:hidden">
            <p className="text-sm font-medium text-gray-900">{name}</p>
            <p className="text-xs text-gray-500">{role}</p>
          </div>
          
          <form action={logout}>
            <button 
              type="submit"
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
            >
              <LogOut size={16} />
              Keluar (Logout)
            </button>
          </form>
        </div>
      )}
    </div>
  );
}