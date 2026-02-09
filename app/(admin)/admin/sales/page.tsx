import { getAllPurchases, getSalesStats } from '@/app/actions/purchases';
import {
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Calendar,
  User,
  BookOpen,
} from 'lucide-react';
import Link from 'next/link';

export default async function SalesPage() {
  const [purchases, stats] = await Promise.all([
    getAllPurchases(),
    getSalesStats(),
  ]);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Vendas Individuais</h1>
        <p className="text-zinc-400">
          Histórico de compras e estatísticas de vendas
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#1A1F2E] rounded-xl p-6 border border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-blue-500/10">
              <ShoppingCart className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-zinc-400 text-sm">Total de Vendas</p>
              <p className="text-2xl font-bold text-white">{stats.totalSales}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#1A1F2E] rounded-xl p-6 border border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-emerald-500/10">
              <DollarSign className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-zinc-400 text-sm">Receita Total</p>
              <p className="text-2xl font-bold text-white">
                €{stats.totalRevenue.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#1A1F2E] rounded-xl p-6 border border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-purple-500/10">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-zinc-400 text-sm">Ticket Médio</p>
              <p className="text-2xl font-bold text-white">
                €{stats.averageOrderValue.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#1A1F2E] rounded-xl p-6 border border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-amber-500/10">
              <Calendar className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-zinc-400 text-sm">Últimos 6 Meses</p>
              <p className="text-2xl font-bold text-white">
                {stats.recentSalesCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Purchases Table */}
      <div className="bg-[#1A1F2E] rounded-xl border border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-900">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Utilizador
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Curso
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Data
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {purchases.map((purchase) => (
                <tr key={purchase.id} className="hover:bg-zinc-900/50 transition-colors">
                  {/* User Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {purchase.user.image ? (
                        <img
                          src={purchase.user.image}
                          alt={purchase.user.name || 'User'}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                          <User className="w-5 h-5 text-zinc-600" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-white">
                          {purchase.user.name || 'Sem nome'}
                        </div>
                        <div className="text-sm text-zinc-400">
                          {purchase.user.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Course Info */}
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/courses/${purchase.course.id}`}
                      className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                    >
                      {purchase.course.thumbnail ? (
                        <img
                          src={purchase.course.thumbnail}
                          alt={purchase.course.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-zinc-600" />
                        </div>
                      )}
                      <span className="font-medium text-white">
                        {purchase.course.title}
                      </span>
                    </Link>
                  </td>

                  {/* Amount */}
                  <td className="px-6 py-4">
                    <span className="text-lg font-bold text-emerald-400">
                      €{purchase.amount.toFixed(2)}
                    </span>
                    <div className="text-xs text-zinc-500">{purchase.currency}</div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        purchase.status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : purchase.status === 'pending'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}
                    >
                      {purchase.status === 'completed' && '✓ Concluído'}
                      {purchase.status === 'pending' && '⏳ Pendente'}
                      {purchase.status === 'failed' && '✕ Falhou'}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4">
                    <div className="text-sm text-zinc-300">
                      {new Date(purchase.createdAt).toLocaleDateString('pt-PT', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </div>
                    <div className="text-xs text-zinc-500">
                      {new Date(purchase.createdAt).toLocaleTimeString('pt-PT', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {purchases.length === 0 && (
          <div className="text-center py-12">
            <ShoppingCart className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-400">Nenhuma venda realizada ainda</p>
            <p className="text-sm text-zinc-500 mt-2">
              As compras individuais aparecerão aqui
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
