'use client';

import { FileText } from 'lucide-react';

export default function ReportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Laporan</h1>
        <p className="text-gray-600 mt-1">Generate dan export laporan tiket</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Laporan</h2>
        <p className="text-gray-600">Halaman ini akan menampilkan berbagai laporan dan analytics</p>
      </div>
    </div>
  );
}