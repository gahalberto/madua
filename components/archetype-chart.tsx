'use client';

import { motion } from 'framer-motion';
import { Crown, Sword, Sparkles } from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface ArchetypeChartProps {
  stats: {
    KING: number;
    WARRIOR: number;
    MAGE: number;
  };
}

export default function ArchetypeChart({ stats }: ArchetypeChartProps) {
  // Transformar dados para o formato do Recharts
  const data = [
    { subject: 'SOBERANIA', archetype: 'REI', value: stats.KING, fullMark: 100 },
    { subject: 'AÇÃO', archetype: 'GUERREIRO', value: stats.WARRIOR, fullMark: 100 },
    { subject: 'DOMÍNIO', archetype: 'MAGO', value: stats.MAGE, fullMark: 100 },
  ];

  // Lógica de equilíbrio
  const total = stats.KING + stats.WARRIOR + stats.MAGE;
  const average = total / 3;
  const maxDiff = Math.max(
    Math.abs(stats.KING - average),
    Math.abs(stats.WARRIOR - average),
    Math.abs(stats.MAGE - average)
  );

  let balanceMessage = '';
  let balanceColor = '';
  let balanceIcon = null;

  if (total === 0) {
    balanceMessage = 'Inicie sua jornada. Sele suas primeiras ações.';
    balanceColor = 'text-gray-500';
  } else if (maxDiff <= 20 && total >= 90) {
    balanceMessage = 'SOBERANIA ALCANÇADA. Os três pilares estão em harmonia.';
    balanceColor = 'text-[#D4AF37]';
    balanceIcon = <Crown size={20} className="text-[#D4AF37]" />;
  } else if (stats.WARRIOR > stats.KING + 30 && stats.WARRIOR > stats.MAGE + 30) {
    balanceMessage = 'EXCESSO DE ESFORÇO. O Guerreiro domina, mas onde está a ordem?';
    balanceColor = 'text-red-400';
    balanceIcon = <Sword size={20} className="text-red-400" />;
  } else if (stats.KING > stats.WARRIOR + 30 && stats.KING > stats.MAGE + 30) {
    balanceMessage = 'PLANEJAMENTO SEM AÇÃO. O Rei governa, mas a batalha aguarda.';
    balanceColor = 'text-yellow-400';
    balanceIcon = <Crown size={20} className="text-yellow-400" />;
  } else if (stats.MAGE > stats.KING + 30 && stats.MAGE > stats.WARRIOR + 30) {
    balanceMessage = 'SABEDORIA SEM MOVIMENTO. O Mago estuda, mas precisa executar.';
    balanceColor = 'text-purple-400';
    balanceIcon = <Sparkles size={20} className="text-purple-400" />;
  } else if (maxDiff <= 30) {
    balanceMessage = 'EQUILÍBRIO EM PROGRESSO. Continue selando suas ações.';
    balanceColor = 'text-blue-400';
  } else {
    balanceMessage = 'DESBALANCEADO. Um arquétipo precisa de atenção.';
    balanceColor = 'text-orange-400';
  }

  // Tooltip customizado
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { archetype: string; subject: string }; value: number }> }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0a0a0a] border border-[#D4AF37]/30 rounded-lg p-3 shadow-xl">
          <p className="text-sm font-bold text-[#D4AF37] mb-1">
            {payload[0].payload.archetype}
          </p>
          <p className="text-xs text-gray-300">
            {payload[0].payload.subject}: <span className="font-bold">{payload[0].value}</span> pontos
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] border border-[#D4AF37]/20 rounded-xl p-6 md:p-8"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-serif text-[#D4AF37] mb-2">Arquétipos da Soberania</h2>
        <p className="text-sm text-gray-400">
          Total de pontos hoje: <span className="text-white font-bold">{total}</span>
        </p>
      </div>

      {/* Radar Chart */}
      <div className="w-full h-[400px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid stroke="#D4AF37" strokeOpacity={0.2} />
            <PolarAngleAxis
              dataKey="subject"
              tick={{
                fill: '#D4AF37',
                fontSize: 12,
                fontWeight: 'bold',
              }}
              tickLine={false}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: '#666', fontSize: 10 }}
              tickCount={6}
            />
            <Radar
              name="Pontos"
              dataKey="value"
              stroke="#D4AF37"
              fill="#D4AF37"
              fillOpacity={0.4}
              strokeWidth={2}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Balance Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 flex items-center justify-center gap-2 text-center"
      >
        {balanceIcon}
        <p className={`text-sm font-bold uppercase tracking-wider ${balanceColor}`}>
          {balanceMessage}
        </p>
      </motion.div>

      {/* Legend */}
      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div className="flex flex-col items-center gap-2">
          <Crown size={20} style={{ color: '#D4AF37' }} />
          <div className="text-xs text-gray-400 uppercase tracking-wider">Rei</div>
          <div className="text-lg font-bold text-white">{stats.KING}</div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Sword size={20} style={{ color: '#DC2626' }} />
          <div className="text-xs text-gray-400 uppercase tracking-wider">Guerreiro</div>
          <div className="text-lg font-bold text-white">{stats.WARRIOR}</div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Sparkles size={20} style={{ color: '#7C3AED' }} />
          <div className="text-xs text-gray-400 uppercase tracking-wider">Mago</div>
          <div className="text-lg font-bold text-white">{stats.MAGE}</div>
        </div>
      </div>
    </motion.div>
  );
}
