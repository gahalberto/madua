'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Image as ImageIcon, Play } from 'lucide-react';
import Link from 'next/link';
import { createVlog } from '@/app/actions/vlogs';

export default function NewVlogPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [isPremium, setIsPremium] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !videoUrl.trim()) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    setIsLoading(true);
    const result = await createVlog({
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
      alert(result.error || 'Erro ao criar vlog');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin/vlogs"
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-zinc-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Novo Vlog</h1>
            <p className="text-zinc-400">Crie um novo vlog para a plataforma</p>
          </div>
        </div>

        {/* Form */}
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
                placeholder="Ex: Como implementar Protontropia na prática"
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
                placeholder="Descreva o conteúdo do vlog..."
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
                placeholder="https://vimeo.com/... ou https://youtube.com/... ou https://stream.mux.com/..."
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
                required
              />
              <p className="mt-2 text-xs text-zinc-500">
                Suporta Mux, Vimeo, YouTube e outros players de vídeo
              </p>
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
                placeholder="https://exemplo.com/thumbnail.jpg"
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
                  <p className="text-xs text-zinc-400 mt-1">
                    Tornar visível na plataforma
                  </p>
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
                  <p className="text-xs text-zinc-400 mt-1">
                    Requer assinatura ativa
                  </p>
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
              <Link
                href="/admin/vlogs"
                className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-[#D4AF37] hover:bg-[#C5A028] text-black font-medium rounded-lg transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  'Criando...'
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Criar Vlog
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
