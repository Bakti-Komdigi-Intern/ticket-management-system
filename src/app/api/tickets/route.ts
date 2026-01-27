import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { generateTicketId } from '@/lib/ticket-id';
import { calculateDeadline } from '@/lib/sla';
import { RowDataPacket } from 'mysql2';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const priority = searchParams.get('priority');
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let query = `
      SELECT 
        t.*,
        c.name as category_name,
        u1.name as reporter_name,
        u2.name as assigned_name
      FROM tickets t
      LEFT JOIN categories c ON t.category_id = c.id
      LEFT JOIN users u1 ON t.reporter_id = u1.id
      LEFT JOIN users u2 ON t.assigned_to = u2.id
      WHERE 1=1
    `;

    const params: any[] = [];

    if (priority) {
      query += ' AND t.priority = ?';
      params.push(priority);
    }

    if (status) {
      query += ' AND t.status = ?';
      params.push(status);
    }

    if (category) {
      query += ' AND t.category_id = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (t.subject LIKE ? OR t.id LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY t.created_at DESC';

    const [rows] = await pool.query<RowDataPacket[]>(query, params);

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Get tickets error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    const payload = verifyToken(token || '');
    
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      subject,
      description,
      category_id,
      priority,
      assigned_to,
    } = body;

    // Get SLA times
    const [slaRows] = await pool.query<RowDataPacket[]>(
      'SELECT response_time_minutes, resolution_time_minutes FROM sla_priorities WHERE priority = ?',
      [priority]
    );

    const sla = slaRows[0];
    const ticketId = generateTicketId();
    const createdAt = new Date();
    const responseDeadline = calculateDeadline(createdAt, sla.response_time_minutes);
    const resolutionDeadline = calculateDeadline(createdAt, sla.resolution_time_minutes);

    await pool.query(
      `INSERT INTO tickets (
        id, subject, description, category_id, priority, status,
        reporter_id, assigned_to, response_deadline, resolution_deadline
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        ticketId,
        subject,
        description,
        category_id,
        priority,
        'Terbuka',
        payload.userId,
        assigned_to || null,
        responseDeadline,
        resolutionDeadline,
      ]
    );

    return NextResponse.json({ id: ticketId }, { status: 201 });
  } catch (error) {
    console.error('Create ticket error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}