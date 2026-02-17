import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest, getQueryFn } from "@/lib/queryClient";
import { getApiBaseUrl } from "@/config/api";
import { setAuthToken, clearAuthToken } from "@/lib/authToken";

interface User {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
  authProvider?: string;
  isAdmin?: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
}

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading, error } = useQuery<User | null>({
    queryKey: ["/api/auth/mobile/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const res = await fetch(`${getApiBaseUrl()}/api/auth/mobile/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(credentials),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }
      return data;
    },
    onSuccess: (data) => {
      if (data?.token) {
        setAuthToken(data.token);
        console.log('[AUTH] Token stored successfully');
      }
      if (data?.user) {
        queryClient.setQueryData(["/api/auth/mobile/user"], data.user);
      }
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      const res = await fetch(`${getApiBaseUrl()}/api/auth/mobile/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(credentials),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }
      return data;
    },
    onSuccess: (data) => {
      if (data?.token) {
        setAuthToken(data.token);
        console.log('[AUTH] Token stored successfully');
      }
      if (data?.user) {
        queryClient.setQueryData(["/api/auth/mobile/user"], data.user);
      }
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/auth/mobile/logout", {});
      if (!res.ok) {
        throw new Error("Logout failed");
      }
      return res.json();
    },
    onSuccess: () => {
      clearAuthToken();
      queryClient.invalidateQueries({ queryKey: ["/api/auth/mobile/user"] });
      queryClient.clear();
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !error,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    loginError: loginMutation.error?.message,
    registerError: registerMutation.error?.message,
  };
}
