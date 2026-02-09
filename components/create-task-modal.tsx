'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Sword, Sparkles, Plus } from 'lucide-react';
import { Archetype } from '@prisma/client';
import { createRoutineTask } from '@/app/actions/routine';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: () => void;
}

const archetypeConfig = {
  KING: {
    icon: Crown,
    color: '#D4AF37',
    label: 'Rei',
    description: 'Ordem, planejamento e presença',
  },
  WARRIOR: {
    icon: Sword,
    color: '#DC2626',
    label: 'Guerreiro',
    description: 'Disciplina física e ação',
  },
  MAGE: {
    icon: Sparkles,
    color: '#7C3AED',
    label: 'Mago',
    description: 'Foco, estudo e criação',
  },
};

export default function CreateTaskModal({
  isOpen,
  onClose,
  onTaskCreated,
}: CreateTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [archetype, setArchetype] = useState<Archetype>(Archetype.WARRIOR);
  const [beforeRitual, setBeforeRitual] = useState('');
  const [afterRitual, setAfterRitual] = useState('');
  const [points, setPoints] = useState(20);
  const [order, setOrder] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createRoutineTask({
        title,
        description,
        archetype,
        beforeRitual,
        afterRitual,
        points,
        order,
      });

      // Reset form
      setTitle('');
      setDescription('');
      setArchetype(Archetype.WARRIOR);
      setBeforeRitual('');
      setAfterRitual('');
      setPoints(20);
      setOrder(1);

      onTaskCreated();
      onClose();
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      alert('Erro ao criar tarefa. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-[#0a0a0a] border border-[#D4AF37]/20 rounded-lg p-6 md:p-8 overflow-y-auto max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif text-[#D4AF37]">
                Nova Tarefa de Rotina
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Título */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Título da Tarefa *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Ex: Treino Matinal"
                  className="w-full bg-black/50 border border-[#D4AF37]/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]/50"
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descrição
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detalhes sobre a tarefa..."
                  rows={3}
                  className="w-full bg-black/50 border border-[#D4AF37]/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]/50 resize-none"
                />
              </div>

              {/* Arquétipo */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Arquétipo *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(archetypeConfig).map(([key, config]) => {
                    const Icon = config.icon;
                    const isSelected = archetype === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setArchetype(key as Archetype)}
                        className={`relative p-4 rounded-lg border-2 transition-all ${
                          isSelected
                            ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                            : 'border-[#D4AF37]/20 hover:border-[#D4AF37]/40'
                        }`}
                      >
                        <Icon
                          size={24}
                          className="mx-auto mb-2"
                          style={{ color: config.color }}
                        />
                        <div className="text-sm font-medium text-white">
                          {config.label}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {config.description}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ritual Antes */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ritual Antes (Preparação Mental)
                </label>
                <textarea
                  value={beforeRitual}
                  onChange={(e) => setBeforeRitual(e.target.value)}
                  placeholder="O que você deve refletir antes de começar..."
                  rows={2}
                  className="w-full bg-black/50 border border-[#D4AF37]/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]/50 resize-none"
                />
              </div>

              {/* Ritual Depois */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ritual Depois (Fechamento)
                </label>
                <textarea
                  value={afterRitual}
                  onChange={(e) => setAfterRitual(e.target.value)}
                  placeholder="Como você sela esta conquista..."
                  rows={2}
                  className="w-full bg-black/50 border border-[#D4AF37]/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]/50 resize-none"
                />
              </div>

              {/* Pontos e Ordem */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Pontos *
                  </label>
                  <input
                    type="number"
                    value={points}
                    onChange={(e) => setPoints(Number(e.target.value))}
                    required
                    min={1}
                    max={100}
                    className="w-full bg-black/50 border border-[#D4AF37]/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Ordem
                  </label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    min={1}
                    className="w-full bg-black/50 border border-[#D4AF37]/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]/50"
                  />
                </div>
              </div>

              {/* Botões */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !title}
                  className="flex-1 px-6 py-3 bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    'Criando...'
                  ) : (
                    <>
                      <Plus size={20} />
                      Criar Tarefa
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
