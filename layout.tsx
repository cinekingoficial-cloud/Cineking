import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Home, Film, AlertTriangle, Trophy, Crown, LogOut, Settings, Gamepad2, Megaphone, FileText } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/hooks/use-notifications";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const { user, logout, isLoggingOut } = useAuth();
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);

  useNotifications(user);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowInstall(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') setShowInstall(false);
  };

  if (!user) return <>{children}</>;

  const customerNav = [
    { href: "/", icon: Home, label: "Início" },
    { href: "/jogos", icon: Trophy, label: "Jogos" },
    { href: "/solicitacoes", icon: Film, label: "Pedidos" },
  ];

  const adminNav = [
    { href: "/admin/clientes", icon: Crown, label: "Clientes" },
    { href: "/admin/jogos", icon: Trophy, label: "Jogos" },
    { href: "/admin/avisos", icon: Megaphone, label: "Avisos" },
    { href: "/admin/relatorios", icon: FileText, label: "Relatórios" },
  ];

  const navItems = user.isAdmin ? adminNav : customerNav;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Top Header */}
      <header className="sticky top-0 z-50 glass-card border-b-0 border-white/5 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Crown className="w-6 h-6 text-primary" />
          <span className="font-display font-bold text-xl tracking-tight text-white">
            CINEKING<span className="text-primary">+</span>
          </span>
          {user.isAdmin && (
            <span className="hidden sm:inline text-[10px] bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded-full font-bold ml-1">
              ADMIN
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {showInstall && (
            <Button
              size="sm"
              onClick={handleInstall}
              className="bg-primary/10 border border-primary/30 text-primary text-xs h-8 px-3 hidden sm:flex"
            >
              Instalar App
            </Button>
          )}
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
              <span className="font-bold text-primary text-sm">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-sm font-medium text-white/80">{user.name}</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white/60 hover:text-white hover:bg-white/10"
            onClick={() => logout()}
            disabled={isLoggingOut}
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Install Banner (mobile) */}
      {showInstall && (
        <div className="md:hidden bg-primary/10 border-b border-primary/20 px-4 py-2 flex items-center justify-between">
          <span className="text-primary text-xs font-medium">Instale o CINEKING+ no seu celular</span>
          <Button size="sm" onClick={handleInstall} className="bg-primary text-black text-xs h-7 px-3 font-bold">
            Instalar
          </Button>
        </div>
      )}

      {/* Main Layout Area */}
      <div className="flex flex-1 overflow-hidden pb-16 md:pb-0">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-64 flex-col glass-card border-r-0 border-y-0 p-4 gap-2">
          {navItems.map((item) => {
            const isActive = location === item.href || (item.href !== '/' && location.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive 
                  ? 'bg-primary/10 text-primary font-semibold border border-primary/20 shadow-[0_0_15px_rgba(255,215,0,0.1)]' 
                  : 'text-white/60 hover:bg-white/5 hover:text-white'}
              `}>
                <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
                {item.label}
              </Link>
            );
          })}
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 w-full glass-card border-t border-white/5 flex items-center justify-around px-2 py-3 z-50">
        {navItems.map((item) => {
          const isActive = location === item.href || (item.href !== '/' && location.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} className={`
              flex flex-col items-center justify-center w-16 gap-1 transition-colors
              ${isActive ? 'text-primary' : 'text-white/50 hover:text-white/80'}
            `}>
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
