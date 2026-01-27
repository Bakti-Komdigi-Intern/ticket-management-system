import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'next/navigation';

interface LoginCredentials {
  email: string;
  password: string;
}

export function useAuth() {
  const router = useRouter();
  const { user, setAuth, clearAuth, isAuthenticated } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Login failed');
      }

      return res.json();
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      setTimeout(() => {
        router.push('/admin/dashboard');
        router.refresh();
      }, 100);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await fetch('/api/auth/logout', { method: 'POST' });
    },
    onSuccess: () => {
      clearAuth();
      router.push('/login');
      router.refresh();
    },
  });

  const { data: currentUser, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const res = await fetch('/api/auth/me');
      if (!res.ok) throw new Error('Failed to fetch user');
      return res.json();
    },
    enabled: isAuthenticated(),
    retry: false,
  });

  return {
    user: currentUser || user,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoading: loginMutation.isPending || isLoading,
    isAuthenticated: isAuthenticated(),
    error: loginMutation.error?.message,
  };
}