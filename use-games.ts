import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type Game, type InsertGame } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useGames() {
  return useQuery<Game[]>({
    queryKey: [api.games.list.path],
    queryFn: async () => {
      const res = await fetch(api.games.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch games");
      const data = await res.json();
      return data.map((g: any) => ({ ...g, createdAt: new Date(g.createdAt) }));
    }
  });
}

export function useCreateGame() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertGame) => {
      const res = await fetch(api.games.create.path, {
        method: api.games.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create game");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.games.list.path] });
      toast({ title: "Jogo adicionado!", description: "O jogo foi publicado com sucesso.", variant: "success" });
    },
    onError: (err: Error) => {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    }
  });
}

export function useUpdateGame() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<InsertGame> & { id: number }) => {
      const url = buildUrl(api.games.update.path, { id });
      const res = await fetch(url, {
        method: api.games.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update game");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.games.list.path] });
      toast({ title: "Jogo atualizado!", description: "As alterações foram salvas." });
    }
  });
}

export function useDeleteGame() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.games.delete.path, { id });
      const res = await fetch(url, { method: api.games.delete.method, credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete game");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.games.list.path] });
      toast({ title: "Jogo removido", description: "O jogo foi excluído." });
    }
  });
}

export function useUploadGameBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, bannerUrl }: { id: number; bannerUrl: string }) => {
      const res = await fetch(`/api/games/${id}/banner`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bannerUrl }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to upload banner");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.games.list.path] });
    }
  });
}
