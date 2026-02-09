import { getUserAnalytics } from '@/app/actions/analytics';
import { BarChart3, Users, TrendingUp, Activity, PieChart } from 'lucide-react';
import { AnalyticsCharts } from '@/components/analytics-charts';

export default async function ReportsPage() {
  const analytics = await getUserAnalytics();

  const statCards = [
    {
      title: 'Total de Usuários',
      value: analytics.totalUsers,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Idade Média',
      value: `${analytics.avgAge} anos`,
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Taxa de Engajamento',
      value: `${analytics.engagementRate}%`,
      icon: Activity,
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      title: 'Análises Disponíveis',
      value: 6,
      icon: BarChart3,
      color: 'from-amber-500 to-amber-600',
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Relatórios e Analytics</h1>
        <p className="text-zinc-400">
          Análise detalhada do público e comportamento dos usuários
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="bg-[#1A1F2E] rounded-xl p-6 border border-zinc-800"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-zinc-400 text-sm mb-1">{stat.title}</p>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="bg-[#1A1F2E] rounded-xl p-6 border border-zinc-800 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <PieChart className="w-6 h-6 text-[#D4AF37]" />
          <h2 className="text-xl font-bold text-white">Gráficos e Distribuições</h2>
        </div>
        <AnalyticsCharts analytics={analytics} />
      </div>

      {/* Insights */}
      <div className="bg-[#1A1F2E] rounded-xl p-6 border border-zinc-800">
        <h2 className="text-xl font-bold text-white mb-4">Insights do Público</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-zinc-900 rounded-lg">
            <h3 className="text-sm font-medium text-zinc-400 mb-2">Faixa Etária Predominante</h3>
            <p className="text-lg font-bold text-white">
              {analytics.ageGroups.reduce((prev, current) => 
                current.value > prev.value ? current : prev, 
                analytics.ageGroups[0] || { name: 'N/A', value: 0 }
              ).name}
            </p>
          </div>
          
          <div className="p-4 bg-zinc-900 rounded-lg">
            <h3 className="text-sm font-medium text-zinc-400 mb-2">Gênero Predominante</h3>
            <p className="text-lg font-bold text-white">
              {analytics.genderDistribution.reduce((prev, current) => 
                current.value > prev.value ? current : prev, 
                analytics.genderDistribution[0] || { name: 'N/A', value: 0 }
              ).name}
            </p>
          </div>

          <div className="p-4 bg-zinc-900 rounded-lg">
            <h3 className="text-sm font-medium text-zinc-400 mb-2">Região com Mais Usuários</h3>
            <p className="text-lg font-bold text-white">
              {analytics.regionDistribution.length > 0
                ? analytics.regionDistribution.reduce((prev, current) => 
                    current.value > prev.value ? current : prev
                  ).name
                : 'Dados insuficientes'}
            </p>
          </div>

          <div className="p-4 bg-zinc-900 rounded-lg">
            <h3 className="text-sm font-medium text-zinc-400 mb-2">Status de Assinatura</h3>
            <p className="text-lg font-bold text-white">
              {analytics.subscriptionDistribution.reduce((prev, current) => 
                current.value > prev.value ? current : prev, 
                analytics.subscriptionDistribution[0] || { name: 'N/A', value: 0 }
              ).name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
