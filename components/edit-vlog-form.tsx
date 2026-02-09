'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Image as ImageIcon, Save } from 'lucide-react';
import { updateVlog } from '@/app/actions/vlogs';

interface EditVlogFormProps {
  vlog: {
    id: string;
    title: string;
    description: string | null;
    thumbnail: string | null;
    isPublished: boolean;
    isPremium: boolean;
    modules: Array<{
      lessons: Array<{
        videoUrl: string;
      }>;
    }>;
  };
}

export function EditVlogForm({ vlog }: EditVlogFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(vlog.title);
  const [description, setDescription] = useState(vlog.description || '');
  const [videoUrl, setVideoUrl] = useState(vlog.modules[0]?.lessons[0]?.videoUrl || '');
  const [thumbnail, setThumbnail] = useState(vlog.thumbnail || '');
  const [isPublished, setIsPublished] = useState(vlog.isPublished);
  const [isPremium, setIsPremium] = useState(vlog.isPremium);
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !videoUrl.trim()) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    setIsLoading(true);
    const result = await updateVlog(vlog.id, {
      title,
      description,
      videoUrl,
      thumbnail,
      isPublished,
      isPremium,
    });

    if (result.success) {
      router.push('/admin/vlogs');
      router.refresh();
    } else {
      alert(result.error || 'Erro ao atualizar vlog');
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#1A1F2E] rounded-xl p-8 border border-zinc-800">
      <div className="space-y-6">
        {/* Título */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Título <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
            required
          />
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Descrição</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        {/* URL do Vídeo */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            URL do Vídeo <span className="text-red-400">*</span>
          </label>
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
            required
          />
        </div>

        {/* Thumbnail */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Thumbnail (URL)</label>
          <input
            type="url"
            value={thumbnail}
            onChange={(e) => {
              setThumbnail(e.target.value);
              setThumbnailError(false);
            }}
            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
          />
          {thumbnail && (
            <div className="mt-4">
              {!thumbnailError ? (
                <img
                  src={thumbnail}
                  alt="Preview"
                  onError={() => setThumbnailError(true)}
                  className="w-full max-w-md h-48 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full max-w-md h-48 bg-zinc-900 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <ImageIcon className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                    <p className="text-sm text-zinc-500">URL inválida</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-2 gap-6 pt-4 border-t border-zinc-800">
          {/* Publicar */}
          <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg">
            <div>
              <p className="text-sm font-medium text-white">Publicar Vlog</p>
              <p className="text-xs text-zinc-400 mt-1">Tornar visível na plataforma</p>
            </div>
            <button
              type="button"
              onClick={() => setIsPublished(!isPublished)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isPublished ? 'bg-[#D4AF37]' : 'bg-zinc-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isPublished ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Premium */}
          <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg">
            <div>
              <p className="text-sm font-medium text-white">Premium</p>
              <p className="text-xs text-zinc-400 mt-1">Requer assinatura ativa</p>
            </div>
            <button
              type="button"
              onClick={() => setIsPremium(!isPremium)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isPremium ? 'bg-[#D4AF37]' : 'bg-zinc-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isPremium ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-[#D4AF37] hover:bg-[#C5A028] text-black font-medium rounded-lg transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
          >
            {isLoading ? (
              'Salvando...'
            ) : (
              <>
                <Save className="w-5 h-5" />
                Salvar Alterações
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
