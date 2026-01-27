import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ticketing_system',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export async function generateTicketId(date: Date = new Date()): Promise<string> {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const yyyy = date.getFullYear();
    const yy = yyyy.toString().slice(-2);
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const today = `${yyyy}-${mm}-${dd}`;

    // Lock row untuk tanggal hari ini
    const [rows]: any = await conn.query(
      `SELECT last_number FROM ticket_counters WHERE date = ? FOR UPDATE`,
      [today]
    );

    let nextNumber = 1;

    if (rows.length === 0) {
      await conn.query(
        `INSERT INTO ticket_counters (date, last_number) VALUES (?, 1)`,
        [today]
      );
    } else {
      nextNumber = rows[0].last_number + 1;
      await conn.query(
        `UPDATE ticket_counters SET last_number = ? WHERE date = ?`,
        [nextNumber, today]
      );
    }

    await conn.commit();

    return `TKT-${yy}${mm}${dd}-${String(nextNumber).padStart(4, '0')}`;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

// export function generateTicketId(date: Date = new Date()): string {
//   const year = date.getFullYear().toString().slice(-2);
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const day = String(date.getDate()).padStart(2, '0');
//   const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
//   return `TKT-${year}${month}${day}-${random}`;
// }