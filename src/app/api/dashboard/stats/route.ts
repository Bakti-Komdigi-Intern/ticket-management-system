import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Total tickets
    const [totalResult] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM tickets'
    );
    const totalTickets = totalResult[0].count;

    // Today's tickets
    const [todayResult] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM tickets WHERE DATE(created_at) = CURDATE()'
    );
    const todayTickets = todayResult[0].count;

    // In progress tickets
    const [inProgressResult] = await pool.query<RowDataPacket[]>(
      "SELECT COUNT(*) as count FROM tickets WHERE status = 'Dalam Proses'"
    );
    const inProgressTickets = inProgressResult[0].count;

    // Resolved tickets
    const [resolvedResult] = await pool.query<RowDataPacket[]>(
      "SELECT COUNT(*) as count FROM tickets WHERE status = 'Selesai'"
    );
    const resolvedTickets = resolvedResult[0].count;

    // Overdue tickets
    const [overdueResult] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) as count FROM tickets 
       WHERE status NOT IN ('Selesai', 'Ditutup') 
       AND resolution_deadline < NOW()`
    );
    const overdueTickets = overdueResult[0].count;

    return NextResponse.json({
      totalTickets,
      todayTickets,
      inProgressTickets,
      resolvedTickets,
      overdueTickets,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}