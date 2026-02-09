'use client';

import { useState } from 'react';
import { RoutineTask } from '@prisma/client';
import { Crown, Sword, Sparkles, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { completeRoutineTask, uncompleteRoutineTask } from '@/app/actions/routine';
import { motion, AnimatePresence } from 'framer-motion';

interface ActivationCardProps {
  task: RoutineTask;
}

const archetypeConfig = {
  KING: {
    icon: Crown,
    color: 'text-[#D4AF37]',
    bgColor: 'bg-[#D4AF37]/10',
    borderColor: 'border-[#D4AF37]/30',
    hoverBorder: 'hover:border-[#D4AF37]/60',
    label: 'REI',
    description: 'Ordem, planejamento e presença',
  },
  WARRIOR: {
    icon: Sword,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    hoverBorder: 'hover:border-red-500/60',
    label: 'GUERREIRO',
    description: 'Atividades físicas e disciplina',
  },
  MAGE: {
    icon: Sparkles,
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    borderColor: 'border-blue-400/30',
    hoverBorder: 'hover:border-blue-400/60',
    label: 'MAGO',
    description: 'Produção técnica, estudo e foco',
  },
};

export default function ActivationCard({ task }: ActivationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const config = archetypeConfig[task.archetype];
  const Icon = config.icon;
  const isCompleted = !!task.completedAt;
  const isToday =
    task.completedAt && new Date(task.completedAt).toDateString() === new Date().toDateString();

  const handleSeal = async () => {
    setIsCompleting(true);
    try {
      if (isCompleted && isToday) {
        await uncompleteRoutineTask(task.id);
      } else {
        await completeRoutineTask(task.id);
      }
    } catch (error) {
      console.error('Erro ao selar ação:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`relative bg-zinc-900 border ${config.borderColor} ${config.hoverBorder} rounded-xl p-6 transition-all duration-300 ${
        isCompleted && isToday ? 'opacity-60' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4 flex-1">
          {/* Ícone do Arquétipo */}
          <div className={`p-3 ${config.bgColor} rounded-lg`}>
            <Icon className={config.color} size={24} />
          </div>

          {/* Conteúdo */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-bold uppercase tracking-wider ${config.color}`}>
                {config.label}
              </span>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-gray-500">{task.points} pts</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">{task.title}</h3>
            {task.description && <p className="text-sm text-gray-400">{task.description}</p>}
          </div>
        </div>

        {/* Botão Expandir */}
        {(task.beforeRitual || task.afterRitual) && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="text-gray-400" size={20} />
            ) : (
              <ChevronDown className="text-gray-400" size={20} />
            )}
          </button>
        )}
      </div>

      {/* Rituais (Expansível) */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-4 mb-4 pt-2 border-t border-zinc-800">
              {task.beforeRitual && (
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Ritual de Início
                  </h4>
                  <p className="text-sm text-gray-300 italic leading-relaxed">
                    &quot;{task.beforeRitual}&quot;
                  </p>
                </div>
              )}
              {task.afterRitual && (
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Ritual de Fechamento
                  </h4>
                  <p className="text-sm text-gray-300 italic leading-relaxed">
                    &quot;{task.afterRitual}&quot;
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botão Selar Ação */}
      <button
        onClick={handleSeal}
        disabled={isCompleting}
        className={`w-full py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${
          isCompleted && isToday
            ? `${config.bgColor} ${config.color} border ${config.borderColor}`
            : `bg-[#D4AF37] text-black hover:bg-[#C4A037]`
        } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
      >
        {isCompleting ? (
          'Selando...'
        ) : isCompleted && isToday ? (
          <>
            <Check size={16} />
            SELADO
          </>
        ) : (
          'SELAR AÇÃO'
        )}
      </button>
    </motion.div>
  );
}
