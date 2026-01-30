'use server'

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { cookies } from 'next/headers';

// FUNGSI 1: AMBIL DATA TIKET
export async function getTickets(
  query: string = '', 
  status: string = '', 
  priority: string = ''
) {
  try {
    let sql = 'SELECT * FROM tickets WHERE 1=1'; 
    const params: any[] = [];

    // 1. Filter Search
    if (query) {
      sql += ' AND (ticket_no LIKE ? OR subject LIKE ? OR category LIKE ?)';
      const term = `%${query}%`;
      params.push(term, term, term);
    }

    // 2. Filter Status (Aktif jika user memilih dropdown Status)
    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }

    // 3. Filter Priority (Aktif jika user memilih dropdown Filter)
    if (priority) {
      sql += ' AND priority = ?'; 
      params.push(priority);
    }

    sql += ' ORDER BY created_at DESC';

    const [rows] = (await db.query(sql, params)) as [RowDataPacket[], any];
    return rows;
  } catch (error) {
    console.error("Database Error:", error);
    return [];
  }
}

// FUNGSI 2: BUAT TIKET BARU
export async function createTicket(formData: FormData) {
  const subject = formData.get('subject') as string;
  const category = formData.get('category') as string;
  const priority = formData.get('priority') as string;
  const description = formData.get('description') as string;
  const location = formData.get('location') as string;
  const phone = formData.get('phone') as string;
  

  // Generate Nomor Tiket Manual (Hitung jumlah data + 1)
  const [countRows] = await db.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM tickets');
  const count = countRows[0].count;
  const ticketNo = `TKT-2026-${String(count + 1).padStart(4, '0')}`;

  // Insert ke MySQL
  await db.query<ResultSetHeader>(
    `INSERT INTO tickets (ticket_no, user_email, subject, category, priority, description, location, phone) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [ticketNo, subject, category, priority, description, location, phone]
  );

  // Refresh halaman list tiket & pindah halaman
  revalidatePath('/dashboard/tickets');
  redirect('/dashboard/tickets');
}

// FUNGSI 3: AMBIL 3 TIKET TERBARU UNTUK DASHBOARD
export async function getRecentTickets() {
  try {
    const query = 'SELECT * FROM tickets ORDER BY created_at DESC LIMIT 3';
    
    // Gunakan teknik casting 'as' agar tidak error TypeScript
    const [rows] = (await db.query(query)) as [RowDataPacket[], any];
    
    return rows;
  } catch (error) {
    console.error("Gagal ambil tiket dashboard:", error);
    return [];
  }
}

// FUNGSI 4: LOGIN USER
export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const [rows] = (await db.query(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email, password]
    )) as [RowDataPacket[], any];

    if (rows.length > 0) {
      const user = rows[0];
      

      const cookieStore = await cookies(); 
      
      cookieStore.set('user_session', JSON.stringify({
        name: user.name,
        email: user.email,
        role: user.role
      }), { expires: Date.now() + 86400000 });

      redirect('/dashboard');
    } else {
      redirect('/login?error=invalid');
    }
  } catch (error) {
    if ((error as Error).message.includes('NEXT_REDIRECT')) throw error;
    console.error("Login Error:", error);
    redirect('/login?error=server');
  }
}

// FUNGSI 5: LOGOUT USER
export async function logout() {
  // ✅ PERBAIKAN DI SINI (Pakai await)
  (await cookies()).delete('user_session');
  
  redirect('/login');
}


// FUNGSI 6: AMBIL DETAIL TIKET BERDASARKAN ID
export async function getTicketById(ticketId: string) {
  try {
    const query = 'SELECT * FROM tickets WHERE id = ?';
    
    const [rows] = (await db.query(query, [ticketId])) as [RowDataPacket[], any];
    
    if (rows.length === 0) return null;
    return rows[0];
  } catch (error) {
    console.error("Gagal ambil detail tiket:", error);
    return null;
  }
}

// FUNGSI 7: AMBIL KOMENTAR TIKET
export async function getTicketComments(ticketId: number) {
  try {
    const query = 'SELECT * FROM comments WHERE ticket_id = ? ORDER BY created_at ASC';
    const [rows] = (await db.query(query, [ticketId])) as [RowDataPacket[], any];
    return rows;
  } catch (error) {
    console.error("Gagal ambil komentar:", error);
    return [];
  }
}

// FUNGSI 8: KIRIM KOMENTAR BARU
export async function addComment(formData: FormData) {
  const ticketId = formData.get('ticket_id');
  const message = formData.get('message') as string;
  
  // Ambil data user dari Cookies
  const cookieStore = await cookies();
  const session = cookieStore.get('user_session');
  const user = session ? JSON.parse(session.value) : { name: 'Tamu', role: 'Guest' };

  if (!message || !ticketId) return;

  try {
    await db.query(
      `INSERT INTO comments (ticket_id, user_name, user_role, message, type) VALUES (?, ?, ?, ?, 'COMMENT')`,
      [ticketId, user.name, user.role, message]
    );

    revalidatePath(`/dashboard/tickets/${ticketId}`); // Refresh halaman otomatis
  } catch (error) {
    console.error("Gagal kirim komentar:", error);
  }
}

// FUNGSI 9: AMBIL POLICY SLA (Untuk hitung deadline)
export async function getSLAPolicy(priority: string) {
  try {
    const query = 'SELECT * FROM sla_policies WHERE priority = ?';
    const [rows] = (await db.query(query, [priority])) as [RowDataPacket[], any];
    return rows[0] || null;
  } catch (error) {
    return null;
  }
}