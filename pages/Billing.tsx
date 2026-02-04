
import React from 'react';
import { Construction, Sparkles } from 'lucide-react';

const Billing: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in duration-500">
      <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center mb-8 text-primary shadow-inner">
        <Construction size={48} />
      </div>
      <div className="bg-white p-10 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 max-w-md text-center">
        <div className="flex justify-center mb-4">
          <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
            <Sparkles size={12} /> Em Breve
          </span>
        </div>
        <h2 className="text-3xl font-bold text-primary mb-4">Módulo de Faturamento</h2>
        <p className="text-gray-500 leading-relaxed">
          Estamos preparando um sistema completo de faturamento integrado para que você possa gerar cobranças, boletos e notas fiscais diretamente por aqui.
        </p>
        <div className="mt-8 space-y-3">
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-secondary w-3/4 animate-pulse"></div>
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase">Progresso do Desenvolvimento: 75%</p>
        </div>
      </div>
    </div>
  );
};

export default Billing;
