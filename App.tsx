import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { Layout } from "@/components/layout";
import { ProtectedRoute } from "@/components/protected-route";

// Pages
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import RequestsPage from "@/pages/requests";
import GamesPage from "@/pages/games";
import AdminCustomers from "@/pages/admin/customers";
import AdminNotices from "@/pages/admin/notices";
import AdminReports from "@/pages/admin/reports";
import AdminGames from "@/pages/admin/games";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/login" component={Login} />

        <Route path="/">
          {() => <ProtectedRoute><Dashboard /></ProtectedRoute>}
        </Route>
        <Route path="/jogos">
          {() => <ProtectedRoute><GamesPage /></ProtectedRoute>}
        </Route>
        <Route path="/solicitacoes">
          {() => <ProtectedRoute><RequestsPage /></ProtectedRoute>}
        </Route>

        {/* Admin Routes */}
        <Route path="/admin">
          {() => <ProtectedRoute requireAdmin><AdminCustomers /></ProtectedRoute>}
        </Route>
        <Route path="/admin/clientes">
          {() => <ProtectedRoute requireAdmin><AdminCustomers /></ProtectedRoute>}
        </Route>
        <Route path="/admin/jogos">
          {() => <ProtectedRoute requireAdmin><AdminGames /></ProtectedRoute>}
        </Route>
        <Route path="/admin/avisos">
          {() => <ProtectedRoute requireAdmin><AdminNotices /></ProtectedRoute>}
        </Route>
        <Route path="/admin/relatorios">
          {() => <ProtectedRoute requireAdmin><AdminReports /></ProtectedRoute>}
        </Route>

        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
