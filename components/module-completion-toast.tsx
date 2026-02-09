'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';

interface ModuleCompletionToastProps {
  show: boolean;
  onClose: () => void;
  moduleName?: string;
}

export function ModuleCompletionToast({ show, onClose, moduleName }: ModuleCompletionToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Espera a animação de saída
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
      <div
        className={`
          pointer-events-auto max-w-md w-full
          bg-gradient-to-br from-[#1A1F2E] to-[#0F1419] 
          border-2 border-[#D4AF37]/50
          rounded-2xl shadow-2xl
          p-6 space-y-4
          transform transition-all duration-300
          ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        `}
      >
        {/* Efeito de brilho */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/10 via-transparent to-[#D4AF37]/10 rounded-2xl animate-pulse" />

        {/* Ícone e título */}
        <div className="relative flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-[#D4AF37]/20 rounded-full blur-xl" />
              <CheckCircle2 className="relative h-12 w-12 text-[#D4AF37]" />
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#D4AF37] animate-pulse" />
              <h3 className="text-lg font-bold text-foreground">Módulo Concluído!</h3>
            </div>
            
            {moduleName && (
              <p className="text-sm text-gray-400">
                {moduleName}
              </p>
            )}
          </div>
        </div>

        {/* Mensagem motivacional */}
        <div className="relative bg-black/30 rounded-xl p-4 border border-[#D4AF37]/20">
          <p className="text-foreground text-center leading-relaxed italic">
            &quot;A desordem recuou. Mais um pilar da tua <span className="text-[#D4AF37] font-semibold">Protontropia</span> foi restaurado.&quot;
          </p>
        </div>

        {/* Barra de progresso decorativa */}
        <div className="relative h-1 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] rounded-full animate-[shimmer_2s_ease-in-out_infinite]"
            style={{ width: '100%' }}
          />
        </div>

        {/* Botão de fechar */}
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="w-full py-2 px-4 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] rounded-lg transition-colors font-medium"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}

// Hook para usar o toast
export function useModuleCompletion() {
  const [showToast, setShowToast] = useState(false);
  const [moduleName, setModuleName] = useState<string>('');

  const celebrate = (name: string) => {
    setModuleName(name);
    setShowToast(true);
  };

  const closeToast = () => {
    setShowToast(false);
  };

  return {
    showToast,
    moduleName,
    celebrate,
    closeToast,
  };
}
