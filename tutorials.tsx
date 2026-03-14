import { Tv, Smartphone, Box, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const tutorials = [
  {
    title: "Como instalar na TV Smart",
    icon: Tv,
    color: "from-blue-500 to-blue-700",
    steps: [
      "Abra a loja de aplicativos da sua TV (LG Content Store, Smart Hub Samsung, etc).",
      "Busque por aplicativos como 'IBO Player', 'DuplexPlay' ou 'Smart IPTV'.",
      "Instale o aplicativo escolhido e abra-o.",
      "Anote o 'Device ID' e 'Device Key' que aparecerem na tela.",
      "Envie esses dados para nosso suporte configurar seu acesso."
    ]
  },
  {
    title: "Como instalar no Celular",
    icon: Smartphone,
    color: "from-green-500 to-green-700",
    steps: [
      "Acesse a Google Play Store (Android) ou App Store (iOS).",
      "Procure por 'KPLAY', 'GHOST' ou 'IPTV Smarters'.",
      "Faça o download e abra o aplicativo.",
      "Insira o código de cliente ou usuário/senha fornecidos pelo nosso suporte.",
      "Aguarde o carregamento da lista de canais."
    ]
  },
  {
    title: "Como usar em TV Box",
    icon: Box,
    color: "from-purple-500 to-purple-700",
    steps: [
      "Ligue sua TV Box e acesse a tela inicial.",
      "Abra a Google Play Store ou o navegador de internet (Google Chrome).",
      "Baixe nosso app exclusivo CINEKING+ através do link fornecido pelo suporte.",
      "Instale o APK após o download (permita fontes desconhecidas se solicitado).",
      "Abra o app e faça login com seu código."
    ]
  }
];

export default function TutorialsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-display font-bold text-white">Tutoriais e Guias</h1>
        <p className="text-white/60 mt-1">Aprenda a configurar nosso serviço em seus dispositivos.</p>
      </div>

      <div className="grid gap-6">
        {tutorials.map((tut, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-3xl overflow-hidden group"
          >
            <div className={`bg-gradient-to-r ${tut.color} p-4 flex items-center gap-4`}>
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                <tut.icon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white font-display">{tut.title}</h2>
            </div>
            
            <div className="p-6">
              <ul className="space-y-4">
                {tut.steps.map((step, stepIdx) => (
                  <li key={stepIdx} className="flex gap-3 text-white/80">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white mt-0.5">
                      {stepIdx + 1}
                    </span>
                    <p className="leading-relaxed text-sm">{step}</p>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
