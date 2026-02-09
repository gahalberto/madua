'use server';

import { prisma } from '@/lib/prisma';
import { differenceInYears } from 'date-fns';

export async function getUserAnalytics() {
  try {
    const users = await prisma.user.findMany({
      select: {
        birthDate: true,
        gender: true,
        phone: true,
        subscriptionStatus: true,
        createdAt: true,
        _count: {
          select: {
            progress: true,
            comments: true,
          },
        },
      },
    });

    // Distribuição por faixa etária
    const ageGroups = {
      '18-24': 0,
      '25-34': 0,
      '35-44': 0,
      '45-54': 0,
      '55+': 0,
      'Não informado': 0,
    };

    users.forEach((user) => {
      if (user.birthDate) {
        const age = differenceInYears(new Date(), new Date(user.birthDate));
        if (age >= 18 && age <= 24) ageGroups['18-24']++;
        else if (age >= 25 && age <= 34) ageGroups['25-34']++;
        else if (age >= 35 && age <= 44) ageGroups['35-44']++;
        else if (age >= 45 && age <= 54) ageGroups['45-54']++;
        else if (age >= 55) ageGroups['55+']++;
      } else {
        ageGroups['Não informado']++;
      }
    });

    // Distribuição por gênero
    const genderDistribution = {
      MALE: 0,
      FEMALE: 0,
      PREFER_NOT_TO_SAY: 0,
      'Não informado': 0,
    };

    users.forEach((user) => {
      if (user.gender) {
        genderDistribution[user.gender]++;
      } else {
        genderDistribution['Não informado']++;
      }
    });

    // Distribuição por status de assinatura
    const subscriptionDistribution = {
      ACTIVE: 0,
      INACTIVE: 0,
      CANCELED: 0,
      PAST_DUE: 0,
    };

    users.forEach((user) => {
      subscriptionDistribution[user.subscriptionStatus]++;
    });

    // Região baseada no código do telefone
    const regionDistribution: Record<string, number> = {};
    
    users.forEach((user) => {
      if (user.phone) {
        // Extrair código de área brasileiro (DDD)
        const dddMatch = user.phone.match(/\+55(\d{2})/);
        if (dddMatch) {
          const ddd = dddMatch[1];
          const region = getRegionFromDDD(ddd);
          regionDistribution[region] = (regionDistribution[region] || 0) + 1;
        }
      }
    });

    // Média de idade
    const usersWithAge = users.filter((u) => u.birthDate);
    const avgAge = usersWithAge.length > 0
      ? Math.round(
          usersWithAge.reduce((sum, u) => {
            return sum + differenceInYears(new Date(), new Date(u.birthDate!));
          }, 0) / usersWithAge.length
        )
      : 0;

    // Taxa de engajamento
    const usersWithActivity = users.filter(
      (u) => u._count.progress > 0 || u._count.comments > 0
    ).length;
    const engagementRate = users.length > 0
      ? Math.round((usersWithActivity / users.length) * 100)
      : 0;

    // Crescimento mensal (últimos 6 meses)
    const now = new Date();
    const monthlyGrowth = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonthDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      
      const count = users.filter((u) => {
        const createdAt = new Date(u.createdAt);
        return createdAt >= monthDate && createdAt < nextMonthDate;
      }).length;

      monthlyGrowth.push({
        month: monthDate.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
        users: count,
      });
    }

    return {
      totalUsers: users.length,
      avgAge,
      engagementRate,
      ageGroups: Object.entries(ageGroups).map(([name, value]) => ({ name, value })),
      genderDistribution: Object.entries(genderDistribution)
        .filter(([, value]) => value > 0)
        .map(([name, value]) => ({ 
          name: getGenderLabel(name), 
          value 
        })),
      subscriptionDistribution: Object.entries(subscriptionDistribution)
        .filter(([, value]) => value > 0)
        .map(([name, value]) => ({ 
          name: getSubscriptionLabel(name), 
          value 
        })),
      regionDistribution: Object.entries(regionDistribution).map(([name, value]) => ({ name, value })),
      monthlyGrowth,
    };
  } catch (error) {
    console.error('Erro ao buscar analytics:', error);
    return {
      totalUsers: 0,
      avgAge: 0,
      engagementRate: 0,
      ageGroups: [],
      genderDistribution: [],
      subscriptionDistribution: [],
      regionDistribution: [],
      monthlyGrowth: [],
    };
  }
}

function getRegionFromDDD(ddd: string): string {
  const regions: Record<string, string> = {
    '11': 'São Paulo (SP)',
    '12': 'São Paulo (SP)',
    '13': 'São Paulo (SP)',
    '14': 'São Paulo (SP)',
    '15': 'São Paulo (SP)',
    '16': 'São Paulo (SP)',
    '17': 'São Paulo (SP)',
    '18': 'São Paulo (SP)',
    '19': 'São Paulo (SP)',
    '21': 'Rio de Janeiro (RJ)',
    '22': 'Rio de Janeiro (RJ)',
    '24': 'Rio de Janeiro (RJ)',
    '27': 'Espírito Santo (ES)',
    '28': 'Espírito Santo (ES)',
    '31': 'Minas Gerais (MG)',
    '32': 'Minas Gerais (MG)',
    '33': 'Minas Gerais (MG)',
    '34': 'Minas Gerais (MG)',
    '35': 'Minas Gerais (MG)',
    '37': 'Minas Gerais (MG)',
    '38': 'Minas Gerais (MG)',
    '41': 'Paraná (PR)',
    '42': 'Paraná (PR)',
    '43': 'Paraná (PR)',
    '44': 'Paraná (PR)',
    '45': 'Paraná (PR)',
    '46': 'Paraná (PR)',
    '47': 'Santa Catarina (SC)',
    '48': 'Santa Catarina (SC)',
    '49': 'Santa Catarina (SC)',
    '51': 'Rio Grande do Sul (RS)',
    '53': 'Rio Grande do Sul (RS)',
    '54': 'Rio Grande do Sul (RS)',
    '55': 'Rio Grande do Sul (RS)',
    '61': 'Distrito Federal (DF)',
    '62': 'Goiás (GO)',
    '63': 'Tocantins (TO)',
    '64': 'Goiás (GO)',
    '65': 'Mato Grosso (MT)',
    '66': 'Mato Grosso (MT)',
    '67': 'Mato Grosso do Sul (MS)',
    '68': 'Acre (AC)',
    '69': 'Rondônia (RO)',
    '71': 'Bahia (BA)',
    '73': 'Bahia (BA)',
    '74': 'Bahia (BA)',
    '75': 'Bahia (BA)',
    '77': 'Bahia (BA)',
    '79': 'Sergipe (SE)',
    '81': 'Pernambuco (PE)',
    '82': 'Alagoas (AL)',
    '83': 'Paraíba (PB)',
    '84': 'Rio Grande do Norte (RN)',
    '85': 'Ceará (CE)',
    '86': 'Piauí (PI)',
    '87': 'Pernambuco (PE)',
    '88': 'Ceará (CE)',
    '89': 'Piauí (PI)',
    '91': 'Pará (PA)',
    '92': 'Amazonas (AM)',
    '93': 'Pará (PA)',
    '94': 'Pará (PA)',
    '95': 'Roraima (RR)',
    '96': 'Amapá (AP)',
    '97': 'Amazonas (AM)',
    '98': 'Maranhão (MA)',
    '99': 'Maranhão (MA)',
  };

  return regions[ddd] || 'Outras regiões';
}

function getGenderLabel(gender: string): string {
  const labels: Record<string, string> = {
    MALE: 'Masculino',
    FEMALE: 'Feminino',
    PREFER_NOT_TO_SAY: 'Prefiro não dizer',
    'Não informado': 'Não informado',
  };
  return labels[gender] || gender;
}

function getSubscriptionLabel(status: string): string {
  const labels: Record<string, string> = {
    ACTIVE: 'Ativo',
    INACTIVE: 'Inativo',
    CANCELED: 'Cancelado',
    PAST_DUE: 'Vencido',
  };
  return labels[status] || status;
}
