// src/lib/db.ts
import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: process.env.DB_HOST || '192.168.1.238',
  user: process.env.DB_USER || 'ticket_user',     
  password: process.env.DB_PASSWORD || 'Bakti2025!',
  database: process.env.DB_NAME || 'it_helpdesk_user',
  timezone: '+07:00',
  dateStrings: true,
});