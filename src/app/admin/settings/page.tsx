'use client';

import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pengaturan</h1>
        <p className="text-gray-600 mt-1">Kelola pengaturan sistem</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Pengaturan</h2>
        <p className="text-gray-600">Halaman ini akan menampilkan berbagai pengaturan sistem</p>
      </div>
    </div>
  );
}