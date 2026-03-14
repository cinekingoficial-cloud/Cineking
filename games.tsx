import { useState, useRef } from "react";
import { useGames, useCreateGame, useUpdateGame, useDeleteGame, useUploadGameBanner } from "@/hooks/use-games";
import { format } from "date-fns";
import { Trophy, Plus, Edit2, Trash2, ImagePlus, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { type Game } from "@shared/schema";

export default function AdminGames() {
  const { data: games, isLoading } = useGames();
  const { mutate: remove } = useDeleteGame();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white flex items-center gap-2">
            <Trophy className="text-primary w-8 h-8" />
            Jogos do Dia
          </h1>
          <p className="text-white/60 mt-1">Publique partidas para os clientes.</p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-black font-bold">
              <Plus className="w-5 h-5 mr-2" /> Adicionar Jogo
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border border-white/10 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white text-xl">Novo Jogo</DialogTitle>
            </DialogHeader>
            <GameForm onSuccess={() => setIsCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : games?.length === 0 ? (
        <div className="glass-card p-12 text-center text-white/40 rounded-3xl border-dashed">
          <Trophy className="w-10 h-10 mx-auto mb-3 opacity-30" />
          Nenhum jogo cadastrado ainda.
        </div>
      ) : (
        <div className="grid gap-4">
          {games?.map(game => (
            <GameCard key={game.id} game={game} onDelete={() => {
              if (confirm("Excluir este jogo?")) remove(game.id);
            }} />
          ))}
        </div>
      )}
    </div>
  );
}

function GameCard({ game, onDelete }: { game: Game; onDelete: () => void }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { mutate: uploadBanner, isPending: isUploading } = useUploadGameBanner();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      uploadBanner({ id: game.id, bannerUrl: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-white/10 group">
      {game.bannerUrl && (
        <div className="h-28 overflow-hidden">
          <img src={game.bannerUrl} alt="banner" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-5 flex items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded font-bold">{game.championship}</span>
            <span className="text-xs text-white/40">{game.gameDate} • {game.matchTime}</span>
          </div>
          <p className="font-bold text-white text-lg">
            {game.homeTeam} <span className="text-primary mx-2">×</span> {game.awayTeam}
          </p>
          <p className="text-sm text-white/50 mt-1">📺 {game.channel}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleBannerChange} />
          <Button 
            variant="ghost" size="icon" 
            className="h-9 w-9 text-white/40 hover:text-primary hover:bg-primary/10"
            onClick={() => fileRef.current?.click()}
            title="Upload Banner"
            disabled={isUploading}
          >
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
          </Button>

          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-white/40 hover:text-primary hover:bg-primary/10">
                <Edit2 className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border border-white/10 max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white text-xl">Editar Jogo</DialogTitle>
              </DialogHeader>
              <GameForm game={game} onSuccess={() => setIsEditOpen(false)} />
            </DialogContent>
          </Dialog>

          <Button variant="ghost" size="icon" className="h-9 w-9 text-white/40 hover:text-red-400 hover:bg-red-400/10" onClick={onDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function GameForm({ game, onSuccess }: { game?: Game; onSuccess: () => void }) {
  const { mutate: create, isPending: isCreating } = useCreateGame();
  const { mutate: update, isPending: isUpdating } = useUpdateGame();
  const isEdit = !!game;

  const today = new Date().toLocaleDateString('pt-BR');

  const { register, handleSubmit } = useForm({
    defaultValues: game ? {
      homeTeam: game.homeTeam,
      awayTeam: game.awayTeam,
      matchTime: game.matchTime,
      championship: game.championship,
      channel: game.channel,
      gameDate: game.gameDate,
    } : { gameDate: today }
  });

  const onSubmit = (data: any) => {
    if (isEdit) {
      update({ id: game!.id, ...data }, { onSuccess });
    } else {
      create(data, { onSuccess });
    }
  };

  const pending = isCreating || isUpdating;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-2">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-white/50 block mb-1">Time da Casa</label>
          <input {...register("homeTeam", { required: true })} className="form-input-dark" placeholder="Ex: Flamengo" />
        </div>
        <div>
          <label className="text-xs text-white/50 block mb-1">Time Visitante</label>
          <input {...register("awayTeam", { required: true })} className="form-input-dark" placeholder="Ex: Corinthians" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-white/50 block mb-1">Horário</label>
          <input {...register("matchTime", { required: true })} className="form-input-dark" placeholder="Ex: 20:00" />
        </div>
        <div>
          <label className="text-xs text-white/50 block mb-1">Data (DD/MM/AAAA)</label>
          <input {...register("gameDate", { required: true })} className="form-input-dark" placeholder="Ex: 15/03/2025" />
        </div>
      </div>

      <div>
        <label className="text-xs text-white/50 block mb-1">Campeonato</label>
        <input {...register("championship", { required: true })} className="form-input-dark" placeholder="Ex: Brasileirão Série A" />
      </div>

      <div>
        <label className="text-xs text-white/50 block mb-1">Canal / Onde Assistir</label>
        <input {...register("channel", { required: true })} className="form-input-dark" placeholder="Ex: Globo / SporTV" />
      </div>

      <Button type="submit" disabled={pending} className="w-full bg-primary text-black font-bold h-11">
        {pending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Salvando...</> : 'Salvar Jogo'}
      </Button>

      <style>{`
        .form-input-dark {
          width: 100%;
          background: rgba(0,0,0,0.5);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 0.5rem;
          padding: 0.625rem 0.75rem;
          color: white;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .form-input-dark:focus {
          border-color: hsl(48 100% 50%);
        }
        .form-input-dark::placeholder {
          color: rgba(255,255,255,0.3);
        }
      `}</style>
    </form>
  );
}
