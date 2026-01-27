import { useQuery } from '@tanstack/react-query';

export function useUsers() {
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('Failed to fetch users');
      return res.json();
    },
  });

  return {
    users: users || [],
    isLoading,
  };
}