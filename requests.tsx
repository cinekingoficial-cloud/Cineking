import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useCreateContentRequest, useCreateProblemReport } from "@/hooks/use-requests";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Film, AlertTriangle, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

const APPS = ["Brasil IPTV", "KPLAY", "KRATOS", "GHOST", "OUTROS"];
const PROBLEM_TYPES = ["Canal fora do ar", "Filme não abre", "Travando", "Problema de login"];

export default function RequestsPage() {
  const { user } = useAuth();
  
  if (!user) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-display font-bold text-white">Central de Pedidos</h1>
        <p className="text-white/60 mt-1">Peça novos conteúdos ou reporte instabilidades.</p>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-black/40 p-1 rounded-xl mb-6">
          <TabsTrigger value="content" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-black font-semibold">
            <Film className="w-4 h-4 mr-2" /> Pedir Conteúdo
          </TabsTrigger>
          <TabsTrigger value="problem" className="rounded-lg data-[state=active]:bg-red-500 data-[state=active]:text-white font-semibold">
            <AlertTriangle className="w-4 h-4 mr-2" /> Reportar Problema
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="content">
          <ContentRequestForm customerId={user.id} />
        </TabsContent>
        
        <TabsContent value="problem">
          <ProblemReportForm customerId={user.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ContentRequestForm({ customerId }: { customerId: number }) {
  const [type, setType] = useState("Filme");
  const { mutate, isPending } = useCreateContentRequest();
  const { register, handleSubmit, reset, watch } = useForm();
  
  const appUsed = watch("appUsed");

  const onSubmit = (data: any) => {
    const details: any = {};
    if (type === "Filme") {
      details.name = data.movieName;
      details.year = data.movieYear;
    } else if (type === "Série") {
      details.name = data.seriesName;
      details.season = data.seriesSeason;
      details.episode = data.seriesEpisode;
    } else {
      details.name = data.channelName;
      details.category = data.channelCategory;
    }

    mutate({
      customerId,
      contentType: type,
      appUsed: data.appUsed === "OUTROS" ? data.appUsedOther : data.appUsed,
      notes: data.notes || null,
      details
    }, {
      onSuccess: () => reset()
    });
  };

  return (
    <div className="glass-card p-6 rounded-3xl border-t-4 border-t-primary">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        <div className="space-y-3">
          <label className="text-sm font-medium text-white/80">O que você quer pedir?</label>
          <div className="grid grid-cols-3 gap-2">
            {["Filme", "Série", "Canal"].map(t => (
              <button
                type="button"
                key={t}
                onClick={() => setType(t)}
                className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                  type === t 
                    ? 'bg-primary/20 border-primary text-primary' 
                    : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 bg-black/30 p-5 rounded-2xl border border-white/5">
          {type === "Filme" && (
            <>
              <div>
                <label className="text-xs text-white/50 mb-1 block">Nome do Filme</label>
                <input {...register("movieName", { required: true })} className="form-input" placeholder="Ex: Vingadores" />
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1 block">Ano (Opcional)</label>
                <input {...register("movieYear")} className="form-input" placeholder="Ex: 2012" />
              </div>
            </>
          )}

          {type === "Série" && (
            <>
              <div>
                <label className="text-xs text-white/50 mb-1 block">Nome da Série</label>
                <input {...register("seriesName", { required: true })} className="form-input" placeholder="Ex: Breaking Bad" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Temporada</label>
                  <input {...register("seriesSeason")} className="form-input" placeholder="Ex: 1" />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Episódio</label>
                  <input {...register("seriesEpisode")} className="form-input" placeholder="Ex: 5" />
                </div>
              </div>
            </>
          )}

          {type === "Canal" && (
            <>
              <div>
                <label className="text-xs text-white/50 mb-1 block">Nome do Canal</label>
                <input {...register("channelName", { required: true })} className="form-input" placeholder="Ex: HBO" />
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1 block">Categoria</label>
                <input {...register("channelCategory")} className="form-input" placeholder="Ex: Filmes e Séries" />
              </div>
            </>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-white/80 mb-2 block">Qual aplicativo você usa?</label>
          <select {...register("appUsed", { required: true })} className="form-input">
            <option value="">Selecione...</option>
            {APPS.map(app => <option key={app} value={app}>{app}</option>)}
          </select>
        </div>

        {appUsed === "OUTROS" && (
          <div>
            <label className="text-xs text-white/50 mb-1 block">Qual?</label>
            <input {...register("appUsedOther", { required: true })} className="form-input" placeholder="Nome do app" />
          </div>
        )}

        <div>
          <label className="text-sm font-medium text-white/80 mb-2 block">Observações Adicionais</label>
          <textarea {...register("notes")} className="form-input min-h-[100px] resize-none" placeholder="Algo mais a adicionar?" />
        </div>

        <Button type="submit" disabled={isPending} className="w-full bg-primary hover:bg-primary/90 text-black font-bold h-12 rounded-xl">
          <Send className="w-5 h-5 mr-2" />
          {isPending ? 'Enviando...' : 'Enviar Pedido'}
        </Button>
      </form>
    </div>
  );
}

function ProblemReportForm({ customerId }: { customerId: number }) {
  const { mutate, isPending } = useCreateProblemReport();
  const { register, handleSubmit, reset, watch } = useForm();
  const appUsed = watch("appUsed");

  const onSubmit = (data: any) => {
    mutate({
      customerId,
      problemType: data.problemType,
      contentName: data.contentName,
      appUsed: data.appUsed === "OUTROS" ? data.appUsedOther : data.appUsed,
      description: data.description,
    }, {
      onSuccess: () => reset()
    });
  };

  return (
    <div className="glass-card p-6 rounded-3xl border-t-4 border-t-red-500">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="text-sm font-medium text-white/80 mb-2 block">Tipo de Problema</label>
          <select {...register("problemType", { required: true })} className="form-input focus:border-red-500 focus:ring-red-500/20">
            <option value="">Selecione...</option>
            {PROBLEM_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-white/80 mb-2 block">Nome do Canal, Filme ou Série</label>
          <input {...register("contentName", { required: true })} className="form-input focus:border-red-500 focus:ring-red-500/20" placeholder="Ex: Globo ou Vingadores" />
        </div>

        <div>
          <label className="text-sm font-medium text-white/80 mb-2 block">Qual aplicativo você usa?</label>
          <select {...register("appUsed", { required: true })} className="form-input focus:border-red-500 focus:ring-red-500/20">
            <option value="">Selecione...</option>
            {APPS.map(app => <option key={app} value={app}>{app}</option>)}
          </select>
        </div>

        {appUsed === "OUTROS" && (
          <div>
            <label className="text-xs text-white/50 mb-1 block">Qual?</label>
            <input {...register("appUsedOther", { required: true })} className="form-input focus:border-red-500 focus:ring-red-500/20" placeholder="Nome do app" />
          </div>
        )}

        <div>
          <label className="text-sm font-medium text-white/80 mb-2 block">Descrição do Problema</label>
          <textarea {...register("description", { required: true })} className="form-input min-h-[100px] resize-none focus:border-red-500 focus:ring-red-500/20" placeholder="Detalhe o que está acontecendo..." />
        </div>

        <Button type="submit" disabled={isPending} className="w-full bg-red-500 hover:bg-red-600 text-white font-bold h-12 rounded-xl">
          <Send className="w-5 h-5 mr-2" />
          {isPending ? 'Enviando...' : 'Enviar Relatório'}
        </Button>
      </form>

      {/* Basic form styles mixed with tailwind */}
      <style>{`
        .form-input {
          @apply w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all;
        }
      `}</style>
    </div>
  );
}
