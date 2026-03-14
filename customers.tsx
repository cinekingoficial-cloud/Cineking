import { useState } from "react";
import { useCustomers, useCreateCustomer, useUpdateCustomer, useDeleteCustomer } from "@/hooks/use-customers";
import { format } from "date-fns";
import { Plus, Search, Edit2, Trash2, Power, Crown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

export default function AdminCustomers() {
  const { data: customers, isLoading } = useCustomers();
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filtered = customers?.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.customerCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white flex items-center gap-2">
            <Crown className="text-primary w-8 h-8" />
            Gestão de Clientes
          </h1>
          <p className="text-white/60 mt-1">Gerencie acessos, planos e vencimentos.</p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-black font-bold">
              <Plus className="w-5 h-5 mr-2" /> Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white text-xl">Adicionar Cliente</DialogTitle>
            </DialogHeader>
            <CustomerForm onSuccess={() => setIsCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="glass-card p-2 rounded-2xl flex items-center gap-2 border-white/10 mb-6 focus-within:border-primary/50 transition-colors">
        <Search className="w-5 h-5 text-white/40 ml-3" />
        <input 
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nome ou código..."
          className="bg-transparent border-none w-full text-white placeholder:text-white/30 focus:outline-none p-2"
        />
      </div>

      <div className="glass-card rounded-2xl overflow-hidden border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-white/50 text-sm">
                <th className="p-4 font-medium">Código</th>
                <th className="p-4 font-medium">Nome</th>
                <th className="p-4 font-medium">Plano</th>
                <th className="p-4 font-medium">Vencimento</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr><td colSpan={6} className="p-8 text-center text-white/40">Carregando...</td></tr>
              ) : filtered?.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-white/40">Nenhum cliente encontrado.</td></tr>
              ) : (
                filtered?.map(customer => (
                  <tr key={customer.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4 font-mono text-primary text-sm">{customer.customerCode}</td>
                    <td className="p-4 text-white font-medium">
                      {customer.name}
                      {customer.isAdmin && <span className="ml-2 text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded uppercase font-bold">Admin</span>}
                    </td>
                    <td className="p-4 text-white/70 text-sm">{customer.planType}</td>
                    <td className="p-4 text-white/70 text-sm">{format(new Date(customer.expirationDate), "dd/MM/yyyy")}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${customer.status === 'Ativo' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <CustomerActions customer={customer} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CustomerForm({ customer, onSuccess }: { customer?: any, onSuccess: () => void }) {
  const { mutate: create, isPending: isCreating } = useCreateCustomer();
  const { mutate: update, isPending: isUpdating } = useUpdateCustomer();
  
  const isEdit = !!customer;
  const { register, handleSubmit } = useForm({
    defaultValues: customer ? {
      ...customer,
      expirationDate: new Date(customer.expirationDate).toISOString().split('T')[0]
    } : { status: 'Ativo', planType: 'Mensal' }
  });

  const onSubmit = (data: any) => {
    const payload = {
      ...data,
      expirationDate: new Date(data.expirationDate).toISOString(),
      isAdmin: data.isAdmin === 'true' || data.isAdmin === true
    };

    if (isEdit) {
      update({ id: customer.id, ...payload }, { onSuccess });
    } else {
      create(payload, { onSuccess });
    }
  };

  const pending = isCreating || isUpdating;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-2">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-white/50 block mb-1">Código</label>
          <input {...register("customerCode", { required: true })} className="form-input-dark uppercase" placeholder="CINE-123" />
        </div>
        <div>
          <label className="text-xs text-white/50 block mb-1">Nome Completo</label>
          <input {...register("name", { required: true })} className="form-input-dark" placeholder="João Silva" />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-white/50 block mb-1">WhatsApp / Telefone</label>
          <input {...register("phone", { required: true })} className="form-input-dark" placeholder="11999999999" />
        </div>
        <div>
          <label className="text-xs text-white/50 block mb-1">Data de Vencimento</label>
          <input type="date" {...register("expirationDate", { required: true })} className="form-input-dark" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-white/50 block mb-1">Tipo de Plano</label>
          <input {...register("planType", { required: true })} className="form-input-dark" placeholder="Ex: Mensal Básico" />
        </div>
        <div>
          <label className="text-xs text-white/50 block mb-1">Status</label>
          <select {...register("status")} className="form-input-dark">
            <option value="Ativo">Ativo</option>
            <option value="Vencido">Vencido</option>
          </select>
        </div>
      </div>

      <Button type="submit" disabled={pending} className="w-full bg-primary text-black font-bold">
        {pending ? 'Salvando...' : 'Salvar Cliente'}
      </Button>

      <style>{`
        .form-input-dark {
          @apply w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 text-sm;
        }
      `}</style>
    </form>
  );
}

function CustomerActions({ customer }: { customer: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: updateStatus } = useUpdateCustomer();
  const { mutate: remove } = useDeleteCustomer();

  const toggleStatus = () => {
    updateStatus({ 
      id: customer.id, 
      status: customer.status === 'Ativo' ? 'Vencido' : 'Ativo' 
    });
  };

  const handleDelete = () => {
    if(confirm("Tem certeza que deseja remover este cliente?")) {
      remove(customer.id);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/10" onClick={toggleStatus} title={customer.status === 'Ativo' ? 'Desativar' : 'Ativar'}>
        <Power className={`w-4 h-4 ${customer.status === 'Ativo' ? 'text-green-400' : 'text-red-400'}`} />
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-primary hover:bg-primary/10">
            <Edit2 className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-card border border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">Editar Cliente</DialogTitle>
          </DialogHeader>
          <CustomerForm customer={customer} onSuccess={() => setIsOpen(false)} />
        </DialogContent>
      </Dialog>

      <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-red-400 hover:bg-red-400/10" onClick={handleDelete}>
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
