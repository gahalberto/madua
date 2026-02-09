'use server';

import { prisma } from '@/lib/prisma';

/**
 * Buscar todas as compras realizadas
 */
export async function getAllPurchases() {
  try {
    const purchases = await prisma.purchase.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            thumbnail: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return purchases;
  } catch (error) {
    console.error('Erro ao buscar compras:', error);
    return [];
  }
}

/**
 * Buscar estatísticas de vendas
 */
export async function getSalesStats() {
  try {
    const purchases = await prisma.purchase.findMany({
      where: {
        status: 'completed',
      },
    });

    const totalSales = purchases.length;
    const totalRevenue = purchases.reduce((sum, p) => sum + p.amount, 0);
    const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

    // Vendas por mês (últimos 6 meses)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const recentPurchases = await prisma.purchase.findMany({
      where: {
        createdAt: {
          gte: sixMonthsAgo,
        },
        status: 'completed',
      },
    });

    return {
      totalSales,
      totalRevenue,
      averageOrderValue,
      recentSalesCount: recentPurchases.length,
    };
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return {
      totalSales: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
      recentSalesCount: 0,
    };
  }
}
