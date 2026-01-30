'use client';

import { createTicket } from '@/app/actions'; // Import dari file actions tadi

export default function CreatePage() {
  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border">
      <h1 className="text-2xl font-bold text-black">Buat Tiket Baru</h1>


      
      {/* Action mengarah ke fungsi server */}
      <form action={createTicket} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-black">Subjek</label>
          <input name="subject" required className="w-full border p-2 rounded bg-gray-50 text-black" placeholder="Contoh: Wifi Mati" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-black">Kategori</label>
            <select name="category" className="w-full border p-2 rounded bg-gray-50 text-black">
              <option value="Hardware">Hardware</option>
              <option value="Software">Software</option>
              <option value="Jaringan">Jaringan</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-black">Prioritas</label>
            <select name="priority" className="w-full border p-2 rounded bg-gray-50 text-black">
              <option value="P1 - Critical">P1 - Critical</option>
              <option value="P2 - High">P2 - High</option>
              <option value="P3 - Medium">P3 - Medium</option>
              <option value="P4 - Low">P4 - Low</option>
            </select>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-xs text-gray-600 space-y-1">
            <p className="font-semibold text-gray-800 mb-2">ℹ️ Panduan Prioritas</p>
            <div className="grid grid-cols-2 gap-2">
              <p><span className="text-red-600 font-bold">P1:</span> Sistem down, seluruh perusahaan terdampak</p>
              <p><span className="text-orange-600 font-bold">P2:</span> Departemen terdampak, pekerjaan terhambat</p>
              <p><span className="text-yellow-600 font-bold">P3:</span> User individu terdampak</p>
              <p><span className="text-green-600 font-bold">P4:</span> Gangguan minor, ada workaround</p>
            </div>
          </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-black">Deskripsi</label>
          <textarea name="description" required rows={4} className="w-full border p-2 rounded bg-gray-50 text-black"></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-black">Lokasi</label>
            <input name="location" className="w-full border p-2 rounded bg-gray-50 text-black" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-black">No HP</label>
            <input name="phone" className="w-full border p-2 rounded bg-gray-50 text-black" />
          </div>
        </div>

        <button type="submit" className="w-full bg-[#0F4C75] text-white py-2 rounded hover:bg-[#0b3a59]">
          Kirim Tiket
        </button>
      </form>
    </div>
  );
}