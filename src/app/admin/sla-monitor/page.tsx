'use client';

import { Clock, AlertCircle } from 'lucide-react';

export default function SLAMonitorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">SLA Monitor</h1>
        <p className="text-gray-600 mt-1">Pantau performa SLA tiket secara real-time</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">SLA Monitor</h2>
        <p className="text-gray-600">Halaman ini akan menampilkan monitoring SLA secara detail</p>
        <AlertCircle />
      </div>
    </div>
  );
}