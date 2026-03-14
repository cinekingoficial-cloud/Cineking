import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type Notice, type InsertNotice } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useNotices() {
  return useQuery<Notice[]>({
    queryKey: [api.notices.list.path],
    queryFn: async () => {
      const res = await fetch(api.notices.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch notices");
      const data = await res.json();
      return data.map((d: any) => ({ ...d, createdAt: new Date(d.createdAt) }));
    }
  });
}

export function useCreateNotice() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertNotice) => {
      const res = await fetch(api.notices.create.path, {
        method: api.notices.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create notice");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.notices.list.path] });
      toast({ title: "Aviso Publicado", description: "O aviso agora está visível para os clientes." });
    }
  });
}

export function useDeleteNotice() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.notices.delete.path, { id });
      const res = await fetch(url, { method: api.notices.delete.method, credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete notice");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.notices.list.path] });
      toast({ title: "Aviso Removido", description: "O aviso foi apagado com sucesso." });
    }
  });
}
