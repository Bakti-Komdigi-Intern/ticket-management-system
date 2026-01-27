export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  avatar?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface SLAPriority {
  id: string;
  priority: 'P1' | 'P2' | 'P3' | 'P4';
  name: string;
  description?: string;
  response_time_minutes: number;
  resolution_time_minutes: number;
  color?: string;
}

export interface Ticket {
  id: string;
  subject: string;
  description?: string;
  category_id?: string;
  category_name?: string;
  priority: 'P1' | 'P2' | 'P3' | 'P4';
  status: 'Dalam Proses' | 'Terbuka' | 'Selesai' | 'Ditutup' | 'Terlewat';
  reporter_id: string;
  reporter_name?: string;
  assigned_to?: string;
  assigned_name?: string;
  created_at: Date;
  updated_at: Date;
  resolved_at?: Date;
  response_deadline?: Date;
  resolution_deadline?: Date;
  first_response_at?: Date;
}

export interface DashboardStats {
  totalTickets: number;
  todayTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  overdueTickets: number;
}

export interface Notification {
  id: string;
  user_id: string;
  ticket_id?: string;
  title: string;
  message?: string;
  is_read: boolean;
  created_at: Date;
}