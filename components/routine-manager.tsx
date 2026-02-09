'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RoutineTask } from '@prisma/client';
import ActivationCard from './activation-card';
import QuantumTimer from './quantum-timer';
import ArchetypeChart from './archetype-chart';
import CreateTaskModal from './create-task-modal';
import { Clock, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface RoutineManagerProps {
  initialTasks: RoutineTask[];
  initialStats: {
    KING: number;
    WARRIOR: number;
    MAGE: number;
  };
}

export default function RoutineManager({ initialTasks, initialStats }: RoutineManagerProps) {
  const router = useRouter();
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleTaskCreated = () => {
    router.refresh();
  };

  // Separar tarefas completadas e pendentes
  const completedTasks = initialTasks.filter((task) => {
    if (!task.completedAt) return false;
    const completedDate = new Date(task.completedAt);
    const today = new Date();
    return completedDate.toDateString() === today.toDateString();
  });

  const pendingTasks = initialTasks.filter((task) => {
    if (!task.completedAt) return true;
    const completedDate = new Date(task.completedAt);
    const today = new Date();
    return completedDate.toDateString() !== today.toDateString();
  });

  return (
    <div className="space-y-8">
      {/* Archetype Chart */}
      <ArchetypeChart stats={initialStats} />

      {/* Timer Button */}
      <div className="flex justify-center">
        <button
          onClick={() => setIsTimerOpen(true)}
          className="inline-flex items-center gap-3 px-8 py-4 bg-blue-400/10 border border-blue-400/30 text-blue-400 font-bold rounded-xl hover:bg-blue-400/20 hover:border-blue-400/50 transition-all"
        >
          <Clock size={20} />
          ATIVAR O SOLTAR
        </button>
      </div>

      {/* A Ordem do Dia */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-serif text-[#F5F5F5] mb-2">A Ordem do Dia</h2>
            <p className="text-gray-400">
              {pendingTasks.length} {pendingTasks.length === 1 ? 'ação' : 'ações'} pendente
              {pendingTasks.length !== 1 ? 's' : ''} • {completedTasks.length} selada
              {completedTasks.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black font-bold rounded-lg transition-all"
          >
            <Plus size={20} />
            Nova Tarefa
          </button>
        </div>

        {/* Tasks Grid */}
        <div className="space-y-4">
          {/* Pending Tasks */}
          {pendingTasks.length > 0 && (
            <div className="space-y-4">
              {pendingTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ActivationCard task={task} />
                </motion.div>
              ))}
            </div>
          )}

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-bold text-gray-500 mb-4 uppercase tracking-wider">
                Ações Seladas Hoje
              </h3>
              <div className="space-y-4">
                {completedTasks.map((task) => (
                  <ActivationCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {initialTasks.length === 0 && (
            <div className="text-center py-16">
              <div className="mb-4 text-gray-600">
                <Plus size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-gray-400 mb-2">
                Nenhuma tarefa de rotina configurada
              </h3>
              <p className="text-gray-500 mb-6">
                Crie suas primeiras ações para ativar seus arquétipos
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center gap-2 px-8 py-3 bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black font-bold rounded-lg transition-all"
              >
                <Plus size={20} />
                Criar Primeira Tarefa
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <QuantumTimer isOpen={isTimerOpen} onClose={() => setIsTimerOpen(false)} />
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onTaskCreated={handleTaskCreated}
      />
    </div>
  );
}
