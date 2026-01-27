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

    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT priority, COUNT(*) as count 
       FROM tickets 
       WHERE status NOT IN ('Selesai', 'Ditutup')
       GROUP BY priority`
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Priority stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}