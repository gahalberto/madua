'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, GripVertical, Edit, Trash2, PlayCircle, Unlock } from 'lucide-react';
import { createLesson, updateLesson, deleteLesson, reorderLessons } from '@/app/actions/lessons';

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string;
  order: number;
  isFree: boolean;
}

interface LessonsManagerProps {
  moduleId: string;
  lessons: Lesson[];
}

export function LessonsManager({ moduleId, lessons: initialLessons }: LessonsManagerProps) {
  const router = useRouter();
  const [lessons, setLessons] = useState(initialLessons);
  const [isAddingLesson, setIsAddingLesson] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonDescription, setNewLessonDescription] = useState('');
  const [newLessonVideoUrl, setNewLessonVideoUrl] = useState('');
  const [newLessonIsFree, setNewLessonIsFree] = useState(false);
  const [editLessonTitle, setEditLessonTitle] = useState('');
  const [editLessonDescription, setEditLessonDescription] = useState('');
  const [editLessonVideoUrl, setEditLessonVideoUrl] = useState('');
  const [editLessonIsFree, setEditLessonIsFree] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateLesson = async () => {
    if (!newLessonTitle.trim() || !newLessonVideoUrl.trim()) return;

    setIsLoading(true);
    const result = await createLesson({
      title: newLessonTitle,
      description: newLessonDescription,
      videoUrl: newLessonVideoUrl,
      isFree: newLessonIsFree,
      moduleId,
    });

    if (result.success) {
      setNewLessonTitle('');
      setNewLessonDescription('');
      setNewLessonVideoUrl('');
      setNewLessonIsFree(false);
      setIsAddingLesson(false);
      router.refresh();
    }
    setIsLoading(false);
  };

  const handleUpdateLesson = async (lessonId: string) => {
    if (!editLessonTitle.trim() || !editLessonVideoUrl.trim()) return;

    setIsLoading(true);
    const result = await updateLesson(lessonId, {
      title: editLessonTitle,
      description: editLessonDescription,
      videoUrl: editLessonVideoUrl,
      isFree: editLessonIsFree,
    });

    if (result.success) {
      setEditingLessonId(null);
      router.refresh();
    }
    setIsLoading(false);
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta aula?')) return;

    setIsLoading(true);
    const result = await deleteLesson(lessonId);

    if (result.success) {
      router.refresh();
    }
    setIsLoading(false);
  };

  const startEditing = (lesson: Lesson) => {
    setEditingLessonId(lesson.id);
    setEditLessonTitle(lesson.title);
    setEditLessonDescription(lesson.description || '');
    setEditLessonVideoUrl(lesson.videoUrl);
    setEditLessonIsFree(lesson.isFree);
  };

  const moveLesson = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === lessons.length - 1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newLessons = [...lessons];
    const [movedLesson] = newLessons.splice(index, 1);
    newLessons.splice(newIndex, 0, movedLesson);

    setLessons(newLessons);

    await reorderLessons(
      moduleId,
      newLessons.map((l) => l.id)
    );
  };

  return (
    <div className="mt-4 pl-8">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-zinc-400">Aulas</h4>
        <button
          onClick={() => setIsAddingLesson(true)}
          className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-sm rounded-lg transition-colors inline-flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Nova Aula
        </button>
      </div>

      {/* New Lesson Form */}
      {isAddingLesson && (
        <div className="mb-3 p-3 bg-zinc-950 border border-zinc-800 rounded-lg">
          <h5 className="text-xs font-medium text-white mb-2">Nova Aula</h5>
          <div className="space-y-2">
            <input
              type="text"
              value={newLessonTitle}
              onChange={(e) => setNewLessonTitle(e.target.value)}
              placeholder="Título da aula"
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-[#D4AF37]"
            />
            <input
              type="url"
              value={newLessonVideoUrl}
              onChange={(e) => setNewLessonVideoUrl(e.target.value)}
              placeholder="URL do vídeo (Mux/Vimeo/YouTube)"
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-[#D4AF37]"
            />
            <textarea
              value={newLessonDescription}
              onChange={(e) => setNewLessonDescription(e.target.value)}
              placeholder="Descrição (opcional)"
              rows={2}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-[#D4AF37]"
            />
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newLessonIsFree}
                onChange={(e) => setNewLessonIsFree(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-[#D4AF37] focus:ring-[#D4AF37] focus:ring-offset-0"
              />
              <span className="text-sm text-zinc-300">Aula gratuita (acessível sem assinatura)</span>
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setIsAddingLesson(false)}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-sm rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateLesson}
                disabled={isLoading}
                className="px-3 py-1.5 bg-[#D4AF37] hover:bg-[#C5A028] text-black text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Criando...' : 'Criar Aula'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lessons List */}
      <div className="space-y-2">
        {lessons.map((lesson, index) => (
          <div
            key={lesson.id}
            className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors"
          >
            {editingLessonId === lesson.id ? (
              // Edit Mode
              <div className="space-y-2">
                <input
                  type="text"
                  value={editLessonTitle}
                  onChange={(e) => setEditLessonTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                />
                <input
                  type="url"
                  value={editLessonVideoUrl}
                  onChange={(e) => setEditLessonVideoUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                />
                <textarea
                  value={editLessonDescription}
                  onChange={(e) => setEditLessonDescription(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editLessonIsFree}
                    onChange={(e) => setEditLessonIsFree(e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-[#D4AF37] focus:ring-[#D4AF37] focus:ring-offset-0"
                  />
                  <span className="text-sm text-zinc-300">Aula gratuita</span>
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingLessonId(null)}
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-sm rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => handleUpdateLesson(lesson.id)}
                    disabled={isLoading}
                    className="px-3 py-1.5 bg-[#D4AF37] hover:bg-[#C5A028] text-black text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <div className="flex items-start gap-2">
                <div className="flex flex-col gap-1 pt-0.5">
                  <button
                    onClick={() => moveLesson(index, 'up')}
                    disabled={index === 0}
                    className="text-zinc-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <GripVertical className="w-3 h-3 rotate-90" />
                  </button>
                  <button
                    onClick={() => moveLesson(index, 'down')}
                    disabled={index === lessons.length - 1}
                    className="text-zinc-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <GripVertical className="w-3 h-3 -rotate-90" />
                  </button>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-zinc-500">Aula {lesson.order}</span>
                    <h5 className="text-sm font-medium text-white">{lesson.title}</h5>
                    {lesson.isFree && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-500/10 text-green-400 text-xs rounded-full">
                        <Unlock className="w-3 h-3" />
                        Grátis
                      </span>
                    )}
                  </div>
                  {lesson.description && (
                    <p className="text-xs text-zinc-400 mb-1">{lesson.description}</p>
                  )}
                  <div className="flex items-center gap-1 text-xs text-zinc-500">
                    <PlayCircle className="w-3 h-3" />
                    <span className="truncate max-w-xs">{lesson.videoUrl}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => startEditing(lesson)}
                    className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5 text-zinc-400" />
                  </button>
                  <button
                    onClick={() => handleDeleteLesson(lesson.id)}
                    disabled={isLoading}
                    className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {lessons.length === 0 && !isAddingLesson && (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center mx-auto mb-3">
              <PlayCircle className="w-6 h-6 text-zinc-600" />
            </div>
            <p className="text-zinc-500 text-sm mb-3">Nenhuma aula cadastrada</p>
            <button
              onClick={() => setIsAddingLesson(true)}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-sm rounded-lg transition-colors inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Criar Primeira Aula
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
