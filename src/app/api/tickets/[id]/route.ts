import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

// GET single ticket by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT 
        t.*,
        c.name as category_name,
        u1.name as reporter_name,
        u1.email as reporter_email,
        u2.name as assigned_name,
        u2.email as assigned_email
      FROM tickets t
      LEFT JOIN categories c ON t.category_id = c.id
      LEFT JOIN users u1 ON t.reporter_id = u1.id
      LEFT JOIN users u2 ON t.assigned_to = u2.id
      WHERE t.id = ?`,
      [params.id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Get ticket error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// UPDATE ticket
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if ticket exists and get current status
    const [existingRows] = await pool.query<RowDataPacket[]>(
      'SELECT status FROM tickets WHERE id = ?',
      [params.id]
    );

    if (existingRows.length === 0) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const currentStatus = existingRows[0].status;

    // Prevent editing if status is "Ditutup"
    if (currentStatus === 'Ditutup') {
      return NextResponse.json(
        { error: 'Cannot edit ticket that is closed' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { status, assigned_to, subject, description, category_id, priority } = body;

    // Build update query dynamically based on provided fields
    const updates: string[] = [];
    const values: any[] = [];

    if (status !== undefined) {
      updates.push('status = ?');
      values.push(status);

      // If status is changed to "Selesai" or "Ditutup", set resolved_at
      if ((status === 'Selesai' || status === 'Ditutup') && currentStatus !== 'Selesai' && currentStatus !== 'Ditutup') {
        updates.push('resolved_at = NOW()');
      }
    }

    if (assigned_to !== undefined) {
      updates.push('assigned_to = ?');
      values.push(assigned_to || null);
    }

    if (subject !== undefined) {
      updates.push('subject = ?');
      values.push(subject);
    }

    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }

    if (category_id !== undefined) {
      updates.push('category_id = ?');
      values.push(category_id);
    }

    if (priority !== undefined) {
      updates.push('priority = ?');
      values.push(priority);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    updates.push('updated_at = NOW()');
    values.push(params.id);

    await pool.query(
      `UPDATE tickets SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return NextResponse.json({ success: true, message: 'Ticket updated successfully' });
  } catch (error) {
    console.error('Update ticket error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE ticket
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if ticket exists and get current status
    const [existingRows] = await pool.query<RowDataPacket[]>(
      'SELECT status FROM tickets WHERE id = ?',
      [params.id]
    );

    if (existingRows.length === 0) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const currentStatus = existingRows[0].status;

    // Prevent deleting if status is "Ditutup"
    if (currentStatus === 'Ditutup') {
      return NextResponse.json(
        { error: 'Cannot delete ticket that is closed' },
        { status: 403 }
      );
    }

    await pool.query('DELETE FROM tickets WHERE id = ?', [params.id]);

    return NextResponse.json({ success: true, message: 'Ticket deleted successfully' });
  } catch (error) {
    console.error('Delete ticket error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}