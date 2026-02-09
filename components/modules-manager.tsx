'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, GripVertical, Edit, Trash2, GraduationCap, ChevronDown, ChevronUp } from 'lucide-react';
import { createModule, updateModule, deleteModule, reorderModules } from '@/app/actions/courses';
import { LessonsManager } from './lessons-manager';

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string;
  order: number;
  isFree: boolean;
}

interface Module {
  id: string;
  title: string;
  description: string | null;
  order: number;
  lessons: Lesson[];
  _count: {
    lessons: number;
  };
}

interface ModulesManagerProps {
  courseId: string;
  modules: Module[];
}

export function ModulesManager({ courseId, modules: initialModules }: ModulesManagerProps) {
  const router = useRouter();
  const [modules, setModules] = useState(initialModules);
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newModuleDescription, setNewModuleDescription] = useState('');
  const [editModuleTitle, setEditModuleTitle] = useState('');
  const [editModuleDescription, setEditModuleDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateModule = async () => {
    if (!newModuleTitle.trim()) return;

    setIsLoading(true);
    const result = await createModule({
      title: newModuleTitle,
      description: newModuleDescription,
      courseId,
    });

    if (result.success) {
      setNewModuleTitle('');
      setNewModuleDescription('');
      setIsAddingModule(false);
      router.refresh();
    }
    setIsLoading(false);
  };

  const handleUpdateModule = async (moduleId: string) => {
    if (!editModuleTitle.trim()) return;

    setIsLoading(true);
    const result = await updateModule(moduleId, {
      title: editModuleTitle,
      description: editModuleDescription,
    });

    if (result.success) {
      setEditingModuleId(null);
      router.refresh();
    }
    setIsLoading(false);
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm('Tem certeza que deseja excluir este módulo?')) return;

    setIsLoading(true);
    const result = await deleteModule(moduleId);

    if (result.success) {
      router.refresh();
    }
    setIsLoading(false);
  };

  const startEditing = (module: Module) => {
    setEditingModuleId(module.id);
    setEditModuleTitle(module.title);
    setEditModuleDescription(module.description || '');
  };

  const moveModule = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === modules.length - 1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newModules = [...modules];
    const [movedModule] = newModules.splice(index, 1);
    newModules.splice(newIndex, 0, movedModule);

    setModules(newModules);

    // Atualizar ordem no banco
    await reorderModules(
      courseId,
      newModules.map((m) => m.id)
    );
  };

  return (
    <div className="bg-[#1A1F2E] rounded-xl p-6 border border-zinc-800">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Módulos do Curso</h2>
          <p className="text-sm text-zinc-400 mt-1">
            {modules.length} módulo{modules.length !== 1 ? 's' : ''} cadastrado{modules.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setIsAddingModule(true)}
          className="px-4 py-2 bg-[#D4AF37] hover:bg-[#C5A028] text-black font-medium rounded-lg transition-colors inline-flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Novo Módulo
        </button>
      </div>

      {/* New Module Form */}
      {isAddingModule && (
        <div className="mb-4 p-4 bg-[#0A0A0A] border border-zinc-800 rounded-lg">
          <h3 className="text-sm font-medium text-white mb-3">Novo Módulo</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={newModuleTitle}
              onChange={(e) => setNewModuleTitle(e.target.value)}
              placeholder="Título do módulo"
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-[#D4AF37]"
            />
            <textarea
              value={newModuleDescription}
              onChange={(e) => setNewModuleDescription(e.target.value)}
              placeholder="Descrição (opcional)"
              rows={2}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-[#D4AF37]"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setIsAddingModule(false)}
                className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateModule}
                disabled={isLoading}
                className="px-3 py-2 bg-[#D4AF37] hover:bg-[#C5A028] text-black text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Criando...' : 'Criar Módulo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modules List */}
      <div className="space-y-3">
        {modules.map((module, index) => (
          <div
            key={module.id}
            className="p-4 bg-[#0A0A0A] border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors"
          >
            {editingModuleId === module.id ? (
              // Edit Mode
              <div className="space-y-3">
                <input
                  type="text"
                  value={editModuleTitle}
                  onChange={(e) => setEditModuleTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                />
                <textarea
                  value={editModuleDescription}
                  onChange={(e) => setEditModuleDescription(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingModuleId(null)}
                    className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => handleUpdateModule(module.id)}
                    disabled={isLoading}
                    className="px-3 py-2 bg-[#D4AF37] hover:bg-[#C5A028] text-black text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <div>
                <div className="flex items-start gap-3">
                  <div className="flex flex-col gap-1 pt-1">
                    <button
                      onClick={() => moveModule(index, 'up')}
                      disabled={index === 0}
                      className="text-zinc-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <GripVertical className="w-4 h-4 rotate-90" />
                    </button>
                    <button
                      onClick={() => moveModule(index, 'down')}
                      disabled={index === modules.length - 1}
                      className="text-zinc-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <GripVertical className="w-4 h-4 -rotate-90" />
                    </button>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-zinc-500">
                        Módulo {module.order}
                      </span>
                      <h3 className="text-base font-semibold text-white">
                        {module.title}
                      </h3>
                    </div>
                    {module.description && (
                      <p className="text-sm text-zinc-400 mb-2">{module.description}</p>
                    )}
                    <div className="flex items-center gap-1 text-xs text-zinc-500">
                      <GraduationCap className="w-4 h-4" />
                      <span>{module._count.lessons} aula{module._count.lessons !== 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setExpandedModuleId(expandedModuleId === module.id ? null : module.id)}
                      className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                      title={expandedModuleId === module.id ? "Ocultar aulas" : "Ver aulas"}
                    >
                      {expandedModuleId === module.id ? (
                        <ChevronUp className="w-4 h-4 text-zinc-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-zinc-400" />
                      )}
                    </button>
                    <button
                      onClick={() => startEditing(module)}
                      className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4 text-zinc-400" />
                    </button>
                    <button
                      onClick={() => handleDeleteModule(module.id)}
                      disabled={isLoading}
                      className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>

                {/* Lessons Manager */}
                {expandedModuleId === module.id && (
                  <LessonsManager moduleId={module.id} lessons={module.lessons} />
                )}
              </div>
            )}
          </div>
        ))}

        {modules.length === 0 && !isAddingModule && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-zinc-600" />
            </div>
            <p className="text-zinc-400 mb-4">Nenhum módulo cadastrado</p>
            <button
              onClick={() => setIsAddingModule(true)}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Criar Primeiro Módulo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
