import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type Customer } from "@shared/schema";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export function useAuth() {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: user, isLoading, error } = useQuery<Customer | null>({
    queryKey: [api.auth.me.path],
    queryFn: async () => {
      const res = await fetch(api.auth.me.path, { credentials: "include" });
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      // Handle potential date parsing issues
      return { ...data, expirationDate: new Date(data.expirationDate) };
    },
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async (customerCode: string) => {
      const res = await fetch(api.auth.login.path, {
        method: api.auth.login.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerCode }),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 401) throw new Error("Código de cliente inválido.");
        throw new Error("Erro ao realizar login.");
      }
      
      const data = await res.json();
      return { ...data, expirationDate: new Date(data.expirationDate) };
    },
    onSuccess: (data) => {
      queryClient.setQueryData([api.auth.me.path], data);
      toast({ title: "Bem-vindo de volta!", description: `Olá, ${data.name}.` });
      if (data.isAdmin) {
        setLocation("/admin");
      } else {
        setLocation("/");
      }
    },
    onError: (err: Error) => {
      toast({ title: "Erro de Acesso", description: err.message, variant: "destructive" });
    }
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await fetch(api.auth.logout.path, { method: api.auth.logout.method, credentials: "include" });
    },
    onSuccess: () => {
      queryClient.setQueryData([api.auth.me.path], null);
      setLocation("/login");
    }
  });

  return {
    user,
    isLoading,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
}
