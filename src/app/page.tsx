'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const authStorage = localStorage.getItem('auth-storage');
        
        if (authStorage) {
          const { state } = JSON.parse(authStorage);
          if (state?.token) {
            router.push('/admin/dashboard');
            return;
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
      
      // No valid token, redirect to login
      router.push('/login');
    };

    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}