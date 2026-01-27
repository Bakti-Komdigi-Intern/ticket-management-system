export function calculateDeadline(
  createdAt: Date,
  minutes: number
): Date {
  const deadline = new Date(createdAt);
  deadline.setMinutes(deadline.getMinutes() + minutes);
  return deadline;
}

export function getSLAStatus(
  deadline: Date | null,
  resolvedAt: Date | null,
  status: string
): 'on-time' | 'overdue' | 'met' | 'breached' {
  if (!deadline) return 'on-time';
  
  const now = new Date();
  
  if (resolvedAt) {
    return resolvedAt <= deadline ? 'met' : 'breached';
  }
  
  if (status === 'Selesai' || status === 'Ditutup') {
    return 'met';
  }
  
  return now > deadline ? 'overdue' : 'on-time';
}

export function getTimeRemaining(deadline: Date | null): string {
  if (!deadline) return '-';
  
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  
  if (diff < 0) {
    const overdue = Math.abs(diff);
    const hours = Math.floor(overdue / (1000 * 60 * 60));
    const minutes = Math.floor((overdue % (1000 * 60 * 60)) / (1000 * 60));
    return `Terlewat ${hours}j ${minutes}m`;
  }
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}j ${minutes}m lagi`;
}