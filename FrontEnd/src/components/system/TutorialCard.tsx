"use client";

import { useEffect, useState } from "react";
import { BookOpen, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TutorialCard() {
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);

const slides = [
  {
    title: "Painel / Estatísticas",
    img: "/images/tutorial1.png",
    desc: "Este é o dashboard, onde são listados os computadores e impressoras ativos e inativos."
  },
  {
    title: "Tela de Adicionar Computador",
    img: "/images/tutorial2.png",
    desc: "Nesta tela são exibidos os computadores que você cadastrou no sistema."
  },
  {
    title: "Como Adicionar um Novo Computador",
    img: "/images/tutorial3.png",
    desc: "Aqui você pode adicionar um novo computador e descrever o problema identificado."
  },
  {
    title: "Tela de Adicionar Impressora",
    img: "/images/tutorial4.png",
    desc: "Nesta tela são exibidas as impressoras que você cadastrou no sistema."
  },
  {
    title: "Como Adicionar uma Nova Impressora",
    img: "/images/tutorial5.png",
    desc: "Aqui você pode adicionar uma nova impressora e descrever o problema identificado."
  },
  {
    title: "Usuários",
    img: "/images/tutorial6.png",
    desc: "Nesta tela são listados os usuários ativos e desativados para uso do sistema de gerenciamento."
  },
  {
    title: "Como Adicionar um Usuário",
    img: "/images/tutorial7.png",
    desc: "Nesta tela é possível criar ou editar usuários. Apenas administradores têm permissão para realizar essas ações."
  },
  {
    title: "Máquinas na Rede",
    img: "/images/tutorial8.png",
    desc: "Aqui são exibidas as máquinas — computadores e impressoras — que estão conectadas à rede no momento."
  },
  {
    title: "Histórico de Ações dos Usuários",
    img: "/images/tutorial9.png",
    desc: "Esta tela exibe o histórico de ações, mostrando quais usuários realizaram alterações ou exclusões no sistema."
  },
];

  useEffect(() => {
    const seen = sessionStorage.getItem("homeTutorialSeen");
    if (!seen) setVisible(true);
  }, []);

  const handleClose = () => {
    sessionStorage.setItem("homeTutorialSeen", "true");
    setVisible(false);
  };

  const handleNext = () => setIndex((i) => (i + 1) % slides.length);
  const handlePrev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);
  const handleStart = () => {
    sessionStorage.setItem("homeTutorialSeen", "true");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="mb-6 bg-white border rounded-xl shadow-md p-5 max-w-7xl mx-auto"
        >
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Tutorial rápido</h3>
                  <p className="text-sm text-slate-600 mt-1">Veja imagens e explicações de onde estão as principais ações do sistema.</p>
                </div>
              </div>

              <div className="rounded-md overflow-hidden border">
                <div className="relative bg-slate-50">
                  <img
                    src={slides[index].img}
                    alt={slides[index].title}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/default.jpg'; }}
                    className="w-full h-80 md:h-96 object-cover bg-white"
                  />
                  <div className="absolute inset-0 flex items-start justify-between p-4">
                    <div className="flex gap-2">
                      <button onClick={handlePrev} className="p-2 bg-white/80 backdrop-blur rounded-full shadow-sm">
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button onClick={handleNext} className="p-2 bg-white/80 backdrop-blur rounded-full shadow-sm">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                    <button onClick={handleClose} className="p-2 bg-white/80 rounded-full shadow-sm">✕</button>
                  </div>
                </div>
                <div className="p-4 bg-white">
                  <h4 className="font-semibold text-slate-800">{slides[index].title}</h4>
                </div>
              </div>
            </div>

            <div className="w-44 flex flex-col items-stretch gap-3">
              <div className="flex-1">
                <h5 className="text-sm font-medium text-slate-700 mb-2">Slides</h5>
                <ul className="space-y-2">
                  {slides.map((s, i) => (
                    <li key={s.title}>
                      <button
                        onClick={() => setIndex(i)}
                        className={`w-full text-left px-3 py-2 rounded-md ${i === index ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-50'}`}>
                        <div className="text-sm font-medium text-slate-800">{s.title}</div>
                        
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2">
                <button onClick={handleClose} className="flex-1 px-3 py-2 bg-white text-slate-700 border rounded-lg">Fechar</button>
                <button onClick={handleStart} className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg">
                  Começar <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
