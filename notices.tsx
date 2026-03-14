import { useState } from "react";
import { useNotices, useCreateNotice, useDeleteNotice } from "@/hooks/use-notices";
import { format } from "date-fns";
import { Megaphone, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";

export default function AdminNotices() {
  const { data: notices, isLoading } = useNotices();
  const { mutate: remove } = useDeleteNotice();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-white flex items-center gap-2">
            <Megaphone className="text-primary w-8 h-8" />
            Avisos do Sistema
          </h1>
          <p className="text-white/60 mt-1">Publique comunicados para os clientes.</p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-black font-bold">
              <Plus className="w-5 h-5 mr-2" /> Novo Aviso
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white">Publicar Aviso</DialogTitle>
            </DialogHeader>
            <NoticeForm onSuccess={() => setIsOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <p className="text-white/50">Carregando...</p>
        ) : notices?.length === 0 ? (
          <div className="glass-card p-8 text-center text-white/50 rounded-2xl border-dashed">
            Nenhum aviso publicado.
          </div>
        ) : (
          notices?.map(notice => (
            <div key={notice.id} className="glass-card p-6 rounded-2xl flex justify-between items-start group">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-1 bg-white/10 text-xs font-bold rounded uppercase text-white/70">
                    {notice.noticeType}
                  </span>
                  <span className="text-xs text-white/40">
                    {format(new Date(notice.createdAt), "dd/MM/yyyy HH:mm")}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{notice.title}</h3>
                <p className="text-white/60">{notice.message}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-400/10"
                onClick={() => { if(confirm("Apagar aviso?")) remove(notice.id); }}
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function NoticeForm({ onSuccess }: { onSuccess: () => void }) {
  const { mutate, isPending } = useCreateNotice();
  const { register, handleSubmit } = useForm({
    defaultValues: { noticeType: 'Informativo' }
  });

  const onSubmit = (data: any) => {
    mutate(data, { onSuccess });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="text-sm text-white/70 block mb-1">Tipo de Aviso</label>
        <select {...register("noticeType")} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white">
          <option value="Informativo">Informativo</option>
          <option value="Manutenção">Manutenção</option>
          <option value="Atualização">Atualização</option>
          <option value="Novidade">Novidade</option>
        </select>
      </div>
      <div>
        <label className="text-sm text-white/70 block mb-1">Título</label>
        <input {...register("title", { required: true })} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white" placeholder="Ex: Sistema em Manutenção" />
      </div>
      <div>
        <label className="text-sm text-white/70 block mb-1">Mensagem</label>
        <textarea {...register("message", { required: true })} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white min-h-[100px]" placeholder="Escreva o aviso detalhado..." />
      </div>
      <Button type="submit" disabled={isPending} className="w-full bg-primary text-black font-bold">
        {isPending ? 'Publicando...' : 'Publicar'}
      </Button>
    </form>
  );
}
