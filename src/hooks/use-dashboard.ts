import { useQuery } from '@tanstack/react-query';

export function useDashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const res = await fetch('/api/dashboard/stats');
      if (!res.ok) throw new Error('Failed to fetch stats');
      return res.json();
    },
  });

  const { data: priorityStats, isLoading: priorityLoading } = useQuery({
    queryKey: ['dashboard', 'priority-stats'],
    queryFn: async () => {
      const res = await fetch('/api/dashboard/priority-stats');
      if (!res.ok) throw new Error('Failed to fetch priority stats');
      return res.json();
    },
  });

  const { data: slaConfig } = useQuery({
    queryKey: ['sla'],
    queryFn: async () => {
      const res = await fetch('/api/sla');
      if (!res.ok) throw new Error('Failed to fetch SLA');
      return res.json();
    },
  });

  const { data: recentTickets } = useQuery({
    queryKey: ['tickets', 'recent'],
    queryFn: async () => {
      const res = await fetch('/api/tickets?limit=5');
      if (!res.ok) throw new Error('Failed to fetch recent tickets');
      const data = await res.json();
      return data.slice(0, 5);
    },
  });

  return {
    stats,
    priorityStats,
    slaConfig,
    recentTickets,
    isLoading: statsLoading || priorityLoading,
  };
}