import { config } from 'dotenv';
import { PrismaClient, Archetype } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Carrega variáveis de ambiente
config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Definição da estrutura para facilitar a importação
interface SeedTask {
  title: string;
  description: string;
  archetype: Archetype;
  beforeRitual: string;
  afterRitual: string;
  points: number;
  order: number;
}

const tasks: SeedTask[] = [
  // --- GUERREIRO: Atividades físicas e disciplina ---
  {
    title: 'Treino de Força Matinal',
    description: 'Sessão de treino funcional ou musculação',
    archetype: Archetype.WARRIOR,
    beforeRitual:
      'Antes de pegar os pesos, pergunte: O que o Guerreiro defende hoje? Qual batalha enfrento?',
    afterRitual: 'Agradeça ao seu corpo pela força. Ele é sua primeira arma.',
    points: 30,
    order: 1,
  },
  {
    title: 'Caminhada em Jejum',
    description: '30 minutos de caminhada antes do café da manhã',
    archetype: Archetype.WARRIOR,
    beforeRitual: 'Respire fundo 3 vezes. Sinta o chão sob seus pés.',
    afterRitual: 'Você dominou o desconforto. A disciplina é sua aliada.',
    points: 20,
    order: 2,
  },
  {
    title: 'Banho Frio (2 minutos)',
    description: 'Ducha fria completa ao final do banho',
    archetype: Archetype.WARRIOR,
    beforeRitual: 'O desconforto voluntário forja o caráter. Entre sem hesitar.',
    afterRitual: 'Você venceu a resistência da mente. Mais um dia de vitória.',
    points: 15,
    order: 3,
  },

  // --- REI: Ordem, planejamento e presença ---
  {
    title: 'Planejamento do Dia',
    description: 'Definir as 3 prioridades máximas do dia',
    archetype: Archetype.KING,
    beforeRitual: 'Um Rei não reage, ele comanda. Qual é a sua ordem para hoje?',
    afterRitual: 'O plano está traçado. A execução é inevitável.',
    points: 20,
    order: 4,
  },
  {
    title: 'Organização do Espaço',
    description: 'Limpar e organizar mesa de trabalho ou quarto',
    archetype: Archetype.KING,
    beforeRitual: 'O caos externo reflete o caos interno. Restaure a ordem.',
    afterRitual: 'Seu reino está em ordem. A clareza retorna.',
    points: 15,
    order: 5,
  },
  {
    title: 'Revisão Financeira Semanal',
    description: 'Verificar contas, investimentos e despesas',
    archetype: Archetype.KING,
    beforeRitual: 'Um Rei conhece seus recursos. Nenhuma surpresa é aceitável.',
    afterRitual: 'Você governa seu tesouro. A soberania econômica é sua.',
    points: 25,
    order: 6,
  },

  // --- MAGO: Produção técnica, estudo e foco ---
  {
    title: 'Bloco de Foco Profundo (90min)',
    description: 'Trabalho intelectual sem distrações',
    archetype: Archetype.MAGE,
    beforeRitual:
      'Desligue todas as notificações. O Mago entra no laboratório. Nada existe além da obra.',
    afterRitual: 'Você materializou ideias. A magia aconteceu.',
    points: 40,
    order: 7,
  },
  {
    title: 'Leitura de Conhecimento',
    description: '30 minutos de leitura técnica ou filosófica',
    archetype: Archetype.MAGE,
    beforeRitual: 'Abra o livro como quem abre um grimório. O conhecimento é poder.',
    afterRitual: 'Mais uma página no seu codex pessoal.',
    points: 20,
    order: 8,
  },
  {
    title: 'Prática de Habilidade',
    description: 'Treinar uma skill específica (código, escrita, etc)',
    archetype: Archetype.MAGE,
    beforeRitual: 'A maestria exige repetição consciente. Foque no processo, não no resultado.',
    afterRitual: 'Você evoluiu. O Mago está mais forte.',
    points: 30,
    order: 9,
  },
];

async function main() {
  console.log('🎯 Iniciando Seed de Tarefas de Rotina (Arquétipos)...');

  // Buscar ou criar um usuário admin para as tasks de exemplo
  let adminUser = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
  });

  if (!adminUser) {
    console.log('⚠️  Nenhum usuário ADMIN encontrado. Criando usuário de exemplo...');
    adminUser = await prisma.user.create({
      data: {
        email: 'admin@madua.com',
        name: 'Admin Madua',
        role: 'ADMIN',
        password: 'change-this-password', // Em produção, usar hash
      },
    });
    console.log('✅ Usuário admin criado');
  }

  console.log(`📝 Processando tarefas para o usuário: ${adminUser.email}`);

  for (const task of tasks) {
    // Usar upsert baseado em uma combinação única (userId + title + archetype)
    // Como não temos unique constraint, vamos buscar primeiro
    const existingTask = await prisma.routineTask.findFirst({
      where: {
        userId: adminUser.id,
        title: task.title,
        archetype: task.archetype,
      },
    });

    if (existingTask) {
      // Atualiza se já existe
      await prisma.routineTask.update({
        where: { id: existingTask.id },
        data: {
          description: task.description,
          beforeRitual: task.beforeRitual,
          afterRitual: task.afterRitual,
          points: task.points,
          order: task.order,
        },
      });
      console.log(`🔄 Tarefa atualizada: ${task.title} (${task.archetype})`);
    } else {
      // Cria se não existe
      await prisma.routineTask.create({
        data: {
          ...task,
          userId: adminUser.id,
        },
      });
      console.log(`✅ Tarefa criada: ${task.title} (${task.archetype})`);
    }
  }

  console.log('🚀 Seed de Tarefas concluído com sucesso!');
  console.log(`📊 Total: ${tasks.length} tarefas processadas para ${adminUser.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
    await prisma.$disconnect();
  });
