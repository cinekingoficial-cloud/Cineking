import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Crown, KeyRound, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const { user, login, isLoggingIn } = useAuth();
  const [code, setCode] = useState("");

  if (user) {
    return <Redirect to={user.isAdmin ? "/admin" : "/"} />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    login(code.trim());
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8 rounded-3xl border border-white/10 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 mb-4 transform rotate-3">
              <Crown className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">CINEKING<span className="text-primary">+</span></h1>
            <p className="text-white/50 mt-2 text-center">Acesse sua área exclusiva de cliente</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80 ml-1">Código de Acesso</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-white/40" />
                </div>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Ex: CINE-12345"
                  className="w-full pl-11 pr-4 py-4 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all uppercase"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn || !code}
              className="w-full py-4 px-4 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 text-black font-bold rounded-xl shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:shadow-[0_0_25px_rgba(255,215,0,0.5)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isLoggingIn ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Entrar no Painel"
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-white/40">
            <p>Problemas para acessar?</p>
            <a 
              href="https://wa.me/message/LAAKUUII3T6LA1" 
              target="_blank" 
              rel="noreferrer"
              className="text-primary hover:underline mt-1 inline-block"
            >
              Fale com o suporte
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
