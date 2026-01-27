'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/admin/sidebar';
import { Header } from '@/components/admin/header';
import { useUIStore } from '@/store/ui-store';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { sidebarCollapsed } = useUIStore();
  const [ isChecking, setIsChecking ] = useState(true);
  const [ isAuthenticated, setIsAuthenticated ] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const authStorage = localStorage.getItem('auth-storage');
        
        if (authStorage) {
          const { state } = JSON.parse(authStorage);
          if (state?.token) {
            setIsAuthenticated(true);
            setIsChecking(false);
            return;
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
      
      // No valid auth, redirect to login
      router.push('/login');
    };

    checkAuth();
  }, [router]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Memeriksa autentikasi...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <div
        className={`transition-all duration-300 ${
          sidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}