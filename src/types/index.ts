export interface Ticket {
  id: number;
  ticket_no: string;
  user_email: string;
  subject: string;
  category: string;
  priority: string;
  description: string;
  location: string;
  phone: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface Comment {
  id: number;
  ticket_id: number;
  user_name: string;
  user_role: string;
  message: string;
  type: 'COMMENT' | 'LOG';
  created_at: Date;
}

export interface SLAPolicy {
  priority: string;
  response_time_minutes: number;
  resolution_time_hours: number;
}