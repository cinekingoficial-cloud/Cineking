import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type InsertContentRequest, type InsertProblemReport, type ContentRequest, type ProblemReport } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useContentRequests() {
  return useQuery<ContentRequest[]>({
    queryKey: [api.contentRequests.list.path],
    queryFn: async () => {
      const res = await fetch(api.contentRequests.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch requests");
      const data = await res.json();
      return data.map((d: any) => ({ ...d, createdAt: new Date(d.createdAt) }));
    }
  });
}

export function useCreateContentRequest() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertContentRequest) => {
      const res = await fetch(api.contentRequests.create.path, {
        method: api.contentRequests.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create request");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.contentRequests.list.path] });
      toast({ 
        title: "Pedido Enviado!", 
        description: "Seu pedido de conteúdo foi registrado. Prazo: 48 Horas",
        variant: "success"
      });
    },
    onError: (err: Error) => {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    }
  });
}

export function useProblemReports() {
  return useQuery<ProblemReport[]>({
    queryKey: [api.problemReports.list.path],
    queryFn: async () => {
      const res = await fetch(api.problemReports.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch reports");
      const data = await res.json();
      return data.map((d: any) => ({ ...d, createdAt: new Date(d.createdAt) }));
    }
  });
}

export function useCreateProblemReport() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertProblemReport) => {
      const res = await fetch(api.problemReports.create.path, {
        method: api.problemReports.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to report problem");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.problemReports.list.path] });
      toast({ title: "Relatório Enviado!", description: "Recebemos seu aviso de problema e iremos verificar." });
    },
    onError: (err: Error) => {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    }
  });
}
