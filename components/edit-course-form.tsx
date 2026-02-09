'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save } from 'lucide-react';
import { updateCourse } from '@/app/actions/courses';

interface EditCourseFormProps {
  course: {
    id: string;
    title: string;
    description: string | null;
    category: string | null;
    thumbnail: string | null;
    type: string;
    isPublished: boolean;
    isPremium: boolean;
    isInClub: boolean;
    isStandalone: boolean;
    price: number | null;
  };
}

export function EditCourseForm({ course }: EditCourseFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(course.title);
  const [description, setDescription] = useState(course.description || '');
  const [category, setCategory] = useState(course.category || '');
  const [thumbnail, setThumbnail] = useState(course.thumbnail || '');
  const [type, setType] = useState(course.type);
  const [isPublished, setIsPublished] = useState(course.isPublished);
  const [isPremium, setIsPremium] = useState(course.isPremium);
  const [isInClub, setIsInClub] = useState(course.isInClub);
  const [isStandalone, setIsStandalone] = useState(course.isStandalone);
  const [price, setPrice] = useState(course.price?.toString() || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await updateCourse(course.id, {
        title,
        description,
        category,
        thumbnail,
        type,
        isPublished,
        isPremium,
        isInClub,
        isStandalone,
        price: price ? parseFloat(price) : null,
      });

      if (result.success) {
        router.refresh();
      } else {
        setError(result.error || 'Erro ao atualizar curso');
      }
    } catch {
      setError('Erro ao atualizar curso');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#1A1F2E] rounded-xl p-6 border border-zinc-800">
      <h2 className="text-xl font-bold text-white mb-6">Informações do Curso</h2>

      {error && (
        <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Título do Curso <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-3 bg-[#0A0A0A] border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Descrição
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 bg-[#0A0A0A] border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        {/* Category & Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Categoria
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-[#0A0A0A] border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="">Selecione uma categoria</option>
              <option value="Protontropia">Protontropia</option>
              <option value="Neantropia">Neantropia</option>
              <option value="Dieta">Dieta</option>
              <option value="Treino">Treino</option>
              <option value="Mindset">Mindset</option>
              <option value="Biohacking">Biohacking</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Tipo de Conteúdo
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-3 bg-[#0A0A0A] border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="COURSE">Curso</option>
              <option value="VLOG">Vlog</option>
              <option value="WORKSHOP">Workshop</option>
            </select>
          </div>
        </div>

        {/* Thumbnail */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            URL da Thumbnail
          </label>
          <input
            type="url"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            className="w-full px-4 py-3 bg-[#0A0A0A] border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
          />
          {thumbnail && (
            <div className="mt-3">
              <p className="text-xs text-zinc-500 mb-2">Preview:</p>
              <img
                src={thumbnail}
                alt="Preview"
                className="w-48 h-27 rounded-lg object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        {/* Toggles */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between p-4 bg-[#0A0A0A] border border-zinc-800 rounded-lg">
              <div>
                <p className="text-sm font-medium text-white">Publicar</p>
                <p className="text-xs text-zinc-500">Tornar visível para usuários</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#D4AF37] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#0A0A0A] border border-zinc-800 rounded-lg">
              <div>
                <p className="text-sm font-medium text-white">Premium</p>
                <p className="text-xs text-zinc-500">Requer assinatura ativa</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPremium}
                  onChange={(e) => setIsPremium(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#D4AF37] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>
          </div>

          {/* Acesso Section */}
          {isPremium && (
            <div className="p-4 bg-[#0A0A0A] border border-zinc-800 rounded-lg">
              <h3 className="text-sm font-medium text-white mb-4">Tipo de Acesso</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-white">Clube Madua</p>
                    <p className="text-xs text-zinc-500">Incluído na assinatura</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isInClub}
                      onChange={(e) => setIsInClub(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#D4AF37] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-white">Venda Individual</p>
                    <p className="text-xs text-zinc-500">Pode ser comprado separadamente</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isStandalone}
                      onChange={(e) => setIsStandalone(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#D4AF37] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                  </label>
                </div>
              </div>

              {isStandalone && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-white mb-2">
                    Preço (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Ex: 97.00"
                    className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              )}

              {/* Aviso de Acesso */}
              <div className="p-3 bg-zinc-900/50 border border-zinc-700 rounded-lg">
                <p className="text-xs text-zinc-400">
                  {isInClub && isStandalone && (
                    <span className="text-[#D4AF37]">
                      ✓ Membros do Clube têm acesso + Disponível para venda individual
                    </span>
                  )}
                  {isInClub && !isStandalone && (
                    <span className="text-[#D4AF37]">
                      ✓ Exclusivo para membros do Clube
                    </span>
                  )}
                  {!isInClub && isStandalone && (
                    <span className="text-blue-400">
                      ✓ Apenas venda individual (não incluído no Clube)
                    </span>
                  )}
                  {!isInClub && !isStandalone && (
                    <span className="text-orange-400">
                      ⚠ Nenhuma forma de acesso configurada
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-[#D4AF37] hover:bg-[#C5A028] text-black font-medium rounded-lg transition-colors disabled:opacity-50 inline-flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
}
