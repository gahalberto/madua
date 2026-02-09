import { getAllVlogs } from '@/app/actions/vlogs';
import { Play, Plus, Calendar, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { VlogActions } from '@/components/vlog-actions';

export default async function VlogsPage() {
  const vlogs = await getAllVlogs();

  const stats = {
    total: vlogs.length,
    published: vlogs.filter((v) => v.isPublished).length,
    premium: vlogs.filter((v) => v.isPremium).length,
    free: vlogs.filter((v) => !v.isPremium).length,
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Vlogs</h1>
            <p className="text-zinc-400">Gerencie os vlogs da plataforma</p>
          </div>
          <Link
            href="/admin/vlogs/new"
            className="px-4 py-2 bg-[#D4AF37] hover:bg-[#C5A028] text-black font-medium rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Novo Vlog
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-[#1A1F2E] rounded-xl p-6 border border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-zinc-400">Total de Vlogs</span>
              <Play className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
          </div>

          <div className="bg-[#1A1F2E] rounded-xl p-6 border border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-zinc-400">Publicados</span>
              <Eye className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-white">{stats.published}</p>
          </div>

          <div className="bg-[#1A1F2E] rounded-xl p-6 border border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-zinc-400">Premium</span>
              <span className="text-2xl">💎</span>
            </div>
            <p className="text-3xl font-bold text-white">{stats.premium}</p>
          </div>

          <div className="bg-[#1A1F2E] rounded-xl p-6 border border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-zinc-400">Gratuitos</span>
              <span className="text-2xl">🎁</span>
            </div>
            <p className="text-3xl font-bold text-white">{stats.free}</p>
          </div>
        </div>

        {/* Vlogs Table */}
        <div className="bg-[#1A1F2E] rounded-xl border border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0A0A0A] border-b border-zinc-800">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-zinc-400">Thumbnail</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-zinc-400">Título</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-zinc-400">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-zinc-400">Tipo</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-zinc-400">Data</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-zinc-400">Ações</th>
                </tr>
              </thead>
              <tbody>
                {vlogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center">
                          <Play className="w-8 h-8 text-zinc-600" />
                        </div>
                        <p className="text-zinc-400">Nenhum vlog cadastrado</p>
                        <Link
                          href="/admin/vlogs/new"
                          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors inline-flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Criar Primeiro Vlog
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : (
                  vlogs.map((vlog) => (
                    <tr key={vlog.id} className="border-b border-zinc-800 hover:bg-[#0A0A0A] transition-colors">
                      <td className="px-6 py-4">
                        {vlog.thumbnail ? (
                          <img
                            src={vlog.thumbnail}
                            alt={vlog.title}
                            className="w-24 h-14 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-24 h-14 bg-zinc-800 rounded-lg flex items-center justify-center">
                            <Play className="w-6 h-6 text-zinc-600" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-white font-medium">{vlog.title}</p>
                          {vlog.description && (
                            <p className="text-sm text-zinc-400 line-clamp-1 mt-1">
                              {vlog.description}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {vlog.isPublished ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 text-green-400 text-xs font-medium rounded-full">
                            <Eye className="w-3 h-3" />
                            Publicado
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-800 text-zinc-400 text-xs font-medium rounded-full">
                            <EyeOff className="w-3 h-3" />
                            Rascunho
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {vlog.isPremium ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-medium rounded-full">
                            💎 Premium
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 text-blue-400 text-xs font-medium rounded-full">
                            🎁 Grátis
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-zinc-400">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(vlog.createdAt), "dd 'de' MMM, yyyy", { locale: ptBR })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <VlogActions vlogId={vlog.id} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
