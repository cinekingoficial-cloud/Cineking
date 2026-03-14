import { useAuth } from "@/hooks/use-auth";
import { useNotices } from "@/hooks/use-notices";
import { format, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AlertCircle, Calendar, CheckCircle2, Copy, Crown, Loader2, MessageSquare, ShieldAlert, UploadCloud, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: notices } = useNotices();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  if (!user) return null;

  const daysUntilExp = differenceInDays(new Date(user.expirationDate), new Date());
  const isExpiring = daysUntilExp <= 5 && daysUntilExp >= 0;
  const isExpired = daysUntilExp < 0 || user.status === 'Vencido';

  const copyPix = () => {
    navigator.clipboard.writeText("75983734675");
    toast({ title: "Chave PIX copiada!", description: "Cole no app do seu banco." });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("receipt", file);
      
      const res = await fetch("/api/receipts/upload", {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) throw new Error("Falha no envio");
      
      toast({ title: "Comprovante enviado!", description: "Analisaremos em breve." });
    } catch (err) {
      toast({ title: "Erro no envio", description: "Tente novamente ou envie via WhatsApp.", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Greeting */}
      <div>
        <h1 className="text-3xl font-display font-bold text-white">Olá, <span className="text-primary">{user.name.split(' ')[0]}</span></h1>
        <p className="text-white/60 mt-1">Bem-vindo ao seu painel CINEKING+</p>
      </div>

      {/* Expiration Warning */}
      {(isExpiring || isExpired) && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-4 rounded-2xl border flex gap-4 items-start ${
            isExpired 
              ? 'bg-red-500/10 border-red-500/30 text-red-400' 
              : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
          }`}
        >
          <ShieldAlert className="w-6 h-6 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-lg mb-1">
              {isExpired ? 'Plano Vencido' : 'Plano Vencendo em Breve'}
            </h3>
            <p className="text-sm opacity-90 leading-relaxed">
              {isExpired 
                ? 'Seu acesso foi suspenso. Renove agora para continuar aproveitando o melhor conteúdo.' 
                : `Seu plano vence em ${daysUntilExp} dia${daysUntilExp === 1 ? '' : 's'}. Não deixe para a última hora!`}
            </p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Plan Card */}
        <div className="glass-card-gold p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
            <Crown className="w-32 h-32 text-primary" />
          </div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-white/50 text-sm font-medium uppercase tracking-wider mb-1">Seu Plano</p>
                <h2 className="text-2xl font-bold text-white">{user.planType}</h2>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                user.status === 'Ativo' && !isExpired ? 'bg-green-500/20 text-green-400 border border-green-500/20' : 'bg-red-500/20 text-red-400 border border-red-500/20'
              }`}>
                {user.status === 'Ativo' && !isExpired ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                {isExpired ? 'Vencido' : user.status}
              </div>
            </div>

            <div className="flex items-center gap-3 text-white/80 mb-8 bg-black/20 p-4 rounded-xl border border-white/5">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-white/40">Vencimento</p>
                <p className="font-semibold">{format(new Date(user.expirationDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
              </div>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full bg-primary hover:bg-primary/90 text-black font-bold text-base h-12 rounded-xl shadow-[0_0_15px_rgba(255,215,0,0.2)]">
                  Renovar Plano Agora
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border border-white/10 sm:max-w-md rounded-3xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-display text-center text-white pt-4">Renovação via PIX</DialogTitle>
                </DialogHeader>
                <div className="p-4 space-y-6">
                  <div className="bg-black/50 p-6 rounded-2xl border border-white/5 space-y-4 text-center">
                    <div>
                      <p className="text-sm text-white/50">Valor da Renovação</p>
                      <p className="text-4xl font-bold text-primary">R$ 30,00</p>
                    </div>
                    <div className="w-full h-px bg-white/10 my-4" />
                    <div className="space-y-2 text-left">
                      <p className="text-sm text-white/80"><span className="text-white/40">Recebedor:</span> Ed Carlos B. S. Junior</p>
                      <p className="text-sm text-white/80"><span className="text-white/40">Chave PIX:</span> Celular</p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <code className="flex-1 bg-black p-3 rounded-lg text-primary font-mono text-center border border-primary/20">
                          75983734675
                        </code>
                        <Button size="icon" variant="outline" className="h-[46px] w-[46px] border-primary/20 text-primary hover:bg-primary/10" onClick={copyPix}>
                          <Copy className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm text-center text-white/60 font-medium">Já pagou? Envie o comprovante:</p>
                    <div className="relative">
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleUpload}
                        disabled={isUploading}
                      />
                      <Button variant="outline" className="w-full h-12 border-dashed border-white/20 bg-white/5 hover:bg-white/10 text-white gap-2 rounded-xl" disabled={isUploading}>
                        {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
                        {isUploading ? 'Enviando...' : 'Anexar Comprovante (Galeria/Câmera)'}
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Support Card */}
        <div className="glass-card p-6 rounded-3xl flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Precisa de Ajuda?</h3>
            <p className="text-white/50 leading-relaxed mb-6">
              Nosso suporte está pronto para te atender. Se tiver dúvidas, problemas ou quiser relatar algo, chame no WhatsApp.
            </p>
          </div>
          <a 
            href="https://wa.me/message/LAAKUUII3T6LA1" 
            target="_blank" 
            rel="noreferrer"
            className="w-full py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl text-center shadow-lg shadow-[#25D366]/20 transition-all hover:-translate-y-0.5"
          >
            Falar no WhatsApp
          </a>
        </div>
      </div>

      {/* Notices Feed */}
      <div className="pt-4">
        <h3 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-primary" />
          Avisos do Sistema
        </h3>
        
        {(!notices || notices.length === 0) ? (
          <div className="glass-card p-8 rounded-3xl text-center border-dashed border-white/10">
            <p className="text-white/40">Nenhum aviso no momento.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {notices.map((notice) => (
              <div key={notice.id} className="glass-card p-5 rounded-2xl border-l-4 border-l-primary flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-white text-lg">{notice.title}</h4>
                  <span className="text-xs text-white/30 font-medium">
                    {format(new Date(notice.createdAt), "dd/MM/yyyy")}
                  </span>
                </div>
                <p className="text-white/70 text-sm leading-relaxed">{notice.message}</p>
                <span className="inline-block mt-2 px-2 py-1 bg-white/5 rounded text-[10px] uppercase font-bold text-white/40 w-fit">
                  {notice.noticeType}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
