// Script simples para criar tarefas de exemplo
// Execute com: node --loader ts-node/esm create-sample-tasks.mjs

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🎯 Criando tarefas de exemplo...');

  // Buscar primeiro usuário
  const user = await prisma.user.findFirst();

  if (!user) {
    console.error('❌ Nenhum usuário encontrado. Crie um usuário primeiro.');
    return;
  }

  console.log(`✅ Usando usuário: ${user.email}`);

  // Limpar tarefas antigas
  await prisma.routineTask.deleteMany({ where: { userId: user.id } });

  // Criar tarefas
  const tasks = [
    {
      title: 'Treino de Força Matinal',
      archetype: 'WARRIOR',
      beforeRitual: 'O que o Guerreiro defende hoje?',
      points: 30,
      order: 1,
      userId: user.id,
    },
    {
      title: 'Planejamento do Dia',
      archetype: 'KING',
      beforeRitual: 'Um Rei não reage, ele comanda.',
      points: 20,
      order: 2,
      userId: user.id,
    },
    {
      title: 'Bloco de Foco Profundo',
      archetype: 'MAGE',
      beforeRitual: 'O Mago entra no laboratório.',
      points: 40,
      order: 3,
      userId: user.id,
    },
  ];

  for (const task of tasks) {
    await prisma.routineTask.create({ data: task });
    console.log(`✅ ${task.title} (${task.archetype})`);
  }

  console.log('🚀 Concluído!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
