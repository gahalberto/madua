import { getAdminStats } from '@/app/actions/admin';
import { 
  Users, 
  UserCheck, 
  GraduationCap, 
  DollarSign,
  TrendingUp,
  BookOpen
} from 'lucide-react';

export default async function AdminDashboard() {
  const stats = await getAdminStats();

  const statCards = [
    {
      title: 'Total de Usuários',
      value: stats.totalUsers,
      icon: Users,
      description: 'Usuários registados',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Assinantes Ativos',
      value: stats.activeSubscribers,
      icon: UserCheck,
      description: 'Subscrições ativas',
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      title: 'Total de Aulas',
      value: stats.totalLessons,
      icon: GraduationCap,
      description: 'Aulas publicadas',
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Faturamento Estimado',
      value: `R$ ${stats.estimatedRevenue.toFixed(2)}`,
      icon: DollarSign,
      description: 'Receita mensal',
      color: 'from-amber-500 to-amber-600',
    },
  ];

  const additionalStats = [
    {
      label: 'Total de Cursos',
      value: stats.totalCourses,
      icon: BookOpen,
    },
    {
      label: 'Total de Comentários',
      value: stats.totalComments,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Administrativo</h1>
        <p className="text-zinc-400">Visão geral da plataforma MADUA</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="bg-[#1A1F2E] rounded-xl p-6 border border-zinc-800 hover:border-zinc-700 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-zinc-400 text-sm mb-1">{stat.title}</p>
              <p className="text-3xl font-bold text-white mb-2">{stat.value}</p>
              <p className="text-zinc-500 text-xs">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {additionalStats.map((stat) => (
          <div
            key={stat.label}
            className="bg-[#1A1F2E] rounded-xl p-6 border border-zinc-800 hover:border-zinc-700 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-zinc-800">
                <stat.icon className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-zinc-400 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-[#1A1F2E] rounded-xl p-6 border border-zinc-800">
        <h2 className="text-xl font-bold text-white mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors text-left">
            <div className="font-medium mb-1">Criar Novo Curso</div>
            <div className="text-sm text-zinc-400">Adicionar conteúdo</div>
          </button>
          <button className="px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors text-left">
            <div className="font-medium mb-1">Gerir Usuários</div>
            <div className="text-sm text-zinc-400">Ver todos os usuários</div>
          </button>
          <button className="px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors text-left">
            <div className="font-medium mb-1">Ver Relatórios</div>
            <div className="text-sm text-zinc-400">Análise detalhada</div>
          </button>
        </div>
      </div>
    </div>
  );
}
