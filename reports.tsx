import { useContentRequests, useProblemReports } from "@/hooks/use-requests";
import { format } from "date-fns";
import { Film, AlertTriangle, MessageSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminReports() {
  const { data: requests, isLoading: isLoadingReqs } = useContentRequests();
  const { data: problems, isLoading: isLoadingProbs } = useProblemReports();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-white flex items-center gap-2">
          <MessageSquare className="text-primary w-8 h-8" />
          Caixa de Entrada
        </h1>
        <p className="text-white/60 mt-1">Pedidos de conteúdo e chamados de suporte dos clientes.</p>
      </div>

      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-black/40 p-1 rounded-xl mb-6">
          <TabsTrigger value="requests" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-black font-semibold">
            Pedidos de Conteúdo
          </TabsTrigger>
          <TabsTrigger value="problems" className="rounded-lg data-[state=active]:bg-red-500 data-[state=active]:text-white font-semibold">
            Relatos de Problemas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          {isLoadingReqs ? <p className="text-white/50">Carregando...</p> : 
           requests?.length === 0 ? <p className="text-white/50 p-8 text-center glass-card rounded-2xl">Nenhum pedido recebido.</p> :
           requests?.map(req => (
             <div key={req.id} className="glass-card p-6 rounded-2xl border-l-4 border-l-primary flex flex-col sm:flex-row gap-4 justify-between">
               <div>
                 <div className="flex items-center gap-3 mb-2">
                   <span className="px-2 py-1 bg-white/10 text-xs font-bold rounded uppercase text-white/70">
                     {req.contentType}
                   </span>
                   <span className="text-xs text-white/40">
                     {format(new Date(req.createdAt), "dd/MM/yyyy HH:mm")}
                   </span>
                   <span className="text-xs text-primary font-mono bg-primary/10 px-2 py-1 rounded">
                     App: {req.appUsed}
                   </span>
                 </div>
                 
                 <div className="bg-black/30 p-3 rounded-lg border border-white/5 mb-2">
                   {req.contentType === 'Filme' && <p className="text-white"><span className="text-white/50">Nome:</span> {req.details.name} {req.details.year && `(${req.details.year})`}</p>}
                   {req.contentType === 'Série' && <p className="text-white"><span className="text-white/50">Série:</span> {req.details.name} - Temp: {req.details.season} Ep: {req.details.episode}</p>}
                   {req.contentType === 'Canal' && <p className="text-white"><span className="text-white/50">Canal:</span> {req.details.name} ({req.details.category})</p>}
                 </div>

                 {req.notes && <p className="text-sm text-white/60 italic">Obs: "{req.notes}"</p>}
               </div>
               <div className="text-right sm:min-w-[120px]">
                 <p className="text-xs text-white/40 uppercase font-bold mb-1">Cliente ID</p>
                 <p className="text-xl font-bold text-white">#{req.customerId}</p>
               </div>
             </div>
           ))
          }
        </TabsContent>

        <TabsContent value="problems" className="space-y-4">
          {isLoadingProbs ? <p className="text-white/50">Carregando...</p> : 
           problems?.length === 0 ? <p className="text-white/50 p-8 text-center glass-card rounded-2xl">Nenhum problema reportado.</p> :
           problems?.map(prob => (
             <div key={prob.id} className="glass-card p-6 rounded-2xl border-l-4 border-l-red-500 flex flex-col sm:flex-row gap-4 justify-between">
               <div>
                 <div className="flex items-center gap-3 mb-2">
                   <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded uppercase">
                     {prob.problemType}
                   </span>
                   <span className="text-xs text-white/40">
                     {format(new Date(prob.createdAt), "dd/MM/yyyy HH:mm")}
                   </span>
                   <span className="text-xs text-red-400 font-mono bg-red-500/10 px-2 py-1 rounded">
                     App: {prob.appUsed}
                   </span>
                 </div>
                 
                 <h4 className="text-lg font-bold text-white mb-2">{prob.contentName}</h4>
                 <p className="text-sm text-white/70 bg-black/30 p-3 rounded-lg border border-white/5">
                   {prob.description}
                 </p>
               </div>
               <div className="text-right sm:min-w-[120px]">
                 <p className="text-xs text-white/40 uppercase font-bold mb-1">Cliente ID</p>
                 <p className="text-xl font-bold text-white">#{prob.customerId}</p>
               </div>
             </div>
           ))
          }
        </TabsContent>
      </Tabs>
    </div>
  );
}
