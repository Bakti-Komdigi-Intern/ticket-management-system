import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface TicketFilters {
  priority?: string;
  status?: string;
  category?: string;
  search?: string;
}

interface CreateTicketData {
  subject: string;
  description: string;
  category_id: string;
  priority: string;
  assigned_to?: string;
}

export function useTickets(filters?: TicketFilters) {
  const queryClient = useQueryClient();

  const { data: tickets, isLoading, error, refetch } = useQuery({
    queryKey: ['tickets', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.priority) params.append('priority', filters.priority);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.category) params.append('category', filters.category);
      if (filters?.search) params.append('search', filters.search);

      const res = await fetch(`/api/tickets?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch tickets');
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: CreateTicketData) => {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create ticket');
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  return {
    tickets: tickets || [],
    isLoading,
    error,
    refetch,
    createTicket: createMutation.mutate,
    isCreating: createMutation.isPending,
  };
}