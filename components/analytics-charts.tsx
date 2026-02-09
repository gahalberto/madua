'use client';

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const COLORS = ['#D4AF37', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

interface AnalyticsChartsProps {
  analytics: {
    ageGroups: Array<{ name: string; value: number }>;
    genderDistribution: Array<{ name: string; value: number }>;
    subscriptionDistribution: Array<{ name: string; value: number }>;
    regionDistribution: Array<{ name: string; value: number }>;
    monthlyGrowth: Array<{ month: string; users: number }>;
  };
}

export function AnalyticsCharts({ analytics }: AnalyticsChartsProps) {
  return (
    <div className="space-y-8">
      {/* Age Distribution */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Distribuição por Faixa Etária</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analytics.ageGroups}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F1F1F" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1A1F2E',
                border: '1px solid #374151',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#FFFFFF' }}
            />
            <Bar dataKey="value" fill="#D4AF37" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gender Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Distribuição por Gênero</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.genderDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {analytics.genderDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1A1F2E',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Subscription Distribution */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Status de Assinatura</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.subscriptionDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {analytics.subscriptionDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1A1F2E',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Region Distribution */}
      {analytics.regionDistribution.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Distribuição por Região</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.regionDistribution} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1F1F1F" />
              <XAxis type="number" stroke="#9CA3AF" />
              <YAxis dataKey="name" type="category" stroke="#9CA3AF" width={150} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1A1F2E',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#FFFFFF' }}
              />
              <Bar dataKey="value" fill="#10B981" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Monthly Growth */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Crescimento Mensal de Usuários</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analytics.monthlyGrowth}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F1F1F" />
            <XAxis dataKey="month" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1A1F2E',
                border: '1px solid #374151',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#FFFFFF' }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="users"
              stroke="#D4AF37"
              strokeWidth={2}
              name="Novos Usuários"
              dot={{ fill: '#D4AF37', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
