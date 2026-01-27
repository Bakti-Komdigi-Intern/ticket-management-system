import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'Terbuka': 'bg-blue-100 text-blue-800',
    'Dalam Proses': 'bg-yellow-100 text-yellow-800',
    'Selesai': 'bg-green-100 text-green-800',
    'Ditutup': 'bg-gray-100 text-gray-800',
    'Terlewat': 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    'P1': 'bg-red-100 text-red-800 border-red-200',
    'P2': 'bg-orange-100 text-orange-800 border-orange-200',
    'P3': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'P4': 'bg-green-100 text-green-800 border-green-200',
  };
  return colors[priority] || 'bg-gray-100 text-gray-800';
}