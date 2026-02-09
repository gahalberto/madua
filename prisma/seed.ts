import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Definição da estrutura para facilitar a importação
interface SeedRecipe {
  title: string;
  slug: string;
  category: string;
  excerpt: string; // O que vai aparecer no Google (Meta Description)
  content: string; // Texto introdutório / História da receita
  image: string;
  ingredients: string[];
  instructions: string[]; // Passo a passo
  prepTime: number; // Em minutos
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
}

const recipes: SeedRecipe[] = [
  // --- CAPÍTULO 1 & 2: FUNDAMENTOS & LATICÍNIOS ---
  {
    title: "Caldo de Ossos Ancestral (Bone Broth)",
    slug: "caldo-de-ossos-ancestral",
    category: "Fundamentos",
    excerpt: "Aprenda a fazer o verdadeiro 'ouro líquido'. Rico em colágeno, aminoácidos e minerais essenciais para recuperar a barreira intestinal.",
    content: "<p>O caldo de ossos não é apenas uma sopa; é um elixir de cura. Nossos ancestrais sabiam que a força do animal residia em seus ossos. Ao cozinhá-los lentamente, extraímos a medula, o colágeno e a glicina necessários para reparar o nosso corpo moderno.</p>",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=800", 
    ingredients: [
      "2kg de ossos bovinos (fêmur, joelho, mocotó) com medula",
      "4 litros de água filtrada",
      "2 colheres de sopa de vinagre de maçã (essencial para extrair minerais)",
      "1 cebola grande com casca",
      "2 cenouras picadas",
      "Ervas a gosto (louro, tomilho)"
    ],
    instructions: [
      "Asse os ossos no forno a 200°C por 30 minutos para liberar sabor.",
      "Coloque os ossos em uma panela grande (ou Slow Cooker) e cubra com água e o vinagre.",
      "Deixe descansar por 30 minutos antes de ligar o fogo (ajuda na extração).",
      "Adicione os vegetais e leve à fervura. Assim que ferver, reduza para o fogo mínimo.",
      "Cozinhe por 12 a 24 horas (quanto mais tempo, mais colágeno).",
      "Coe e armazene em potes de vidro. A camada de gordura que se forma em cima protege o caldo."
    ],
    prepTime: 1440, 
    difficulty: "Fácil"
  },
  {
    title: "Iogurte Natural Infinito",
    slug: "iogurte-natural-caseiro",
    category: "Laticínios Fermentados",
    excerpt: "Recupere a flora intestinal com este probiótico potente. Uma receita que se perpetua por gerações.",
    content: "<p>Esqueça os iogurtes de mercado cheios de espessantes. O verdadeiro iogurte é leite vivo. Esta receita ensina a técnica de 'back-slopping', onde o iogurte de hoje gera o de amanhã.</p>",
    image: "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?q=80&w=800",
    ingredients: [
      "1 litro de leite integral cru (ou pasteurizado tipo A)",
      "1 pote de iogurte natural (apenas leite e fermento) ou isca da leva anterior"
    ],
    instructions: [
      "Aqueça o leite até quase ferver (85°C) para desnaturar as proteínas.",
      "Deixe esfriar até ficar morno ao toque (cerca de 43°C - teste do dedo mindinho: você deve aguentar 10 segundos).",
      "Misture a isca de iogurte com um pouco do leite morno e devolva à panela.",
      "Embrulhe a panela em toalhas grossas e deixe em local fechado (como o forno desligado) por 8 a 12 horas.",
      "Leve à geladeira para firmar."
    ],
    prepTime: 720,
    difficulty: "Fácil"
  },
  {
    title: "Kefir de Leite: O Rei dos Probióticos",
    slug: "kefir-de-leite-guia",
    category: "Laticínios Fermentados",
    excerpt: "Mais poderoso que qualquer suplemento. Aprenda a cuidar da sua colônia de Kefir.",
    content: "<p>O Kefir é uma colônia simbiótica de bactérias e leveduras (SCOBY). Ele digere a lactose do leite e cria uma bebida ácida, efervescente e carregada de vida.</p>",
    image: "https://images.unsplash.com/photo-1598155523122-38423bb4d693?q=80&w=800",
    ingredients: [
      "1 colher de sopa de grãos de Kefir de Leite",
      "500ml de leite integral"
    ],
    instructions: [
      "Coloque os grãos em um pote de vidro limpo.",
      "Adicione o leite em temperatura ambiente.",
      "Cubra com um pano voal ou papel toalha e prenda com elástico (precisa respirar, mas evita insetos).",
      "Deixe fermentar por 24h em local escuro.",
      "Coe os grãos (use peneira de plástico, não metal) e reinicie o processo."
    ],
    prepTime: 10,
    difficulty: "Fácil"
  },
  {
    title: "Queijo Labane Cremoso",
    slug: "queijo-labane-cremoso",
    category: "Laticínios Fermentados",
    excerpt: "Transforme seu iogurte natural em um queijo probiótico cremoso, similar ao Cream Cheese, mas vivo.",
    content: "<p>O Labane (ou Labneh) é um dos segredos da longevidade do Oriente Médio. Ao dessorar o iogurte, concentramos a gordura e a proteína, criando um alimento denso e saciante.</p>",
    image: "https://images.unsplash.com/photo-1577906096429-f73c2c312435?q=80&w=800",
    ingredients: [
      "500ml de Iogurte Natural (da receita anterior)",
      "1 colher de chá de sal integral",
      "Azeite de oliva e Zaatar para finalizar"
    ],
    instructions: [
      "Misture o sal no iogurte já pronto.",
      "Coloque um pano de algodão limpo (ou filtro de café grande) sobre uma peneira apoiada em uma tigela.",
      "Despeje o iogurte no pano.",
      "Deixe drenar na geladeira por 12 a 24 horas. O líquido que sai é o Soro de Leite (guarde para usar em fermentados!).",
      "O que sobra no pano é o Labane. Faça bolinhas e conserve no azeite."
    ],
    prepTime: 1440,
    difficulty: "Fácil"
  },

  // --- CAPÍTULO 3: VEGETAIS FERMENTADOS ---
  {
    title: "Chucrute Tradicional (Sauerkraut)",
    slug: "chucrute-fermentado",
    category: "Vegetais Fermentados",
    excerpt: "A fonte suprema de Vitamina K2 e probióticos. Apenas repolho, sal e tempo.",
    content: "<p>O chucrute salvou marinheiros do escorbuto e populações inteiras durante invernos rigorosos. É a forma mais simples de preservar vegetais e potencializar seus nutrientes.</p>",
    image: "https://images.unsplash.com/photo-1615485404112-a2538cb3c0b0?q=80&w=800",
    ingredients: [
      "1 repolho verde médio (aprox. 1kg)",
      "20g de sal marinho (aprox. 2% do peso do repolho)"
    ],
    instructions: [
      "Fatie o repolho bem fino.",
      "Em uma tigela grande, adicione o sal e massageie o repolho com as mãos por 10 minutos até soltar bastante líquido (salmoura).",
      "Soque o repolho dentro de um pote de vidro esterilizado, garantindo que não fiquem bolhas de ar.",
      "Certifique-se de que o líquido cubra totalmente o vegetal (use um peso se necessário).",
      "Tampe levemente e deixe fermentar em temperatura ambiente por 1 a 4 semanas."
    ],
    prepTime: 40,
    difficulty: "Médio"
  },
  {
    title: "Cenouras Fermentadas com Gengibre",
    slug: "cenouras-fermentadas-gengibre",
    category: "Vegetais Fermentados",
    excerpt: "Um snack crocante, probiótico e anti-inflamatório. Perfeito para substituir salgadinhos.",
    content: "<p>A doçura natural da cenoura combina perfeitamente com a fermentação lática, criando um sabor agridoce complexo. O gengibre adiciona propriedades digestivas extras.</p>",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=800",
    ingredients: [
      "500g de cenouras descascadas e cortadas em palitos",
      "1 pedaço de gengibre (3cm) fatiado",
      "500ml de água filtrada",
      "1 colher de sopa de sal integral"
    ],
    instructions: [
      "Dissolva o sal na água para fazer a salmoura.",
      "Coloque os palitos de cenoura e o gengibre em um pote de vidro, apertando bem.",
      "Despeje a salmoura até cobrir tudo.",
      "Use um peso para manter as cenouras submersas.",
      "Fermente por 5 a 7 dias em temperatura ambiente."
    ],
    prepTime: 20,
    difficulty: "Fácil"
  },
  {
    title: "Pepinos Fermentados (Picles Reais)",
    slug: "pepinos-fermentados-reais",
    category: "Vegetais Fermentados",
    excerpt: "Esqueça o vinagre. Estes picles são feitos na salmoura, gerando probióticos vivos.",
    content: "<p>Os picles de mercado são feitos com vinagre pasteurizado (mortos). Estes são fermentados vivos, crocantes e cheios de enzimas digestivas.</p>",
    image: "https://images.unsplash.com/photo-1529310706213-92f7d6a591e0?q=80&w=800",
    ingredients: [
      "Pepinos pequenos para conserva",
      "Alho, Endro (Dill) e pimenta do reino",
      "Folhas de uva ou carvalho (para manter a crocância - segredo ancestral)",
      "Salmoura (1 colher de sopa de sal para cada xícara de água)"
    ],
    instructions: [
      "Lave bem os pepinos e corte as pontinhas (onde ficam as enzimas que amolecem o picles).",
      "Coloque os temperos e as folhas no fundo do pote.",
      "Acomode os pepinos bem apertados.",
      "Cubra com a salmoura.",
      "Deixe fermentar por 3 a 5 dias para 'Half Sours' ou mais para sabor intenso."
    ],
    prepTime: 20,
    difficulty: "Médio"
  },
  {
    title: "Conserva de Beterrabas (Kvass Sólido)",
    slug: "conserva-beterrabas-fermentadas",
    category: "Vegetais Fermentados",
    excerpt: "Um tônico para o sangue e para o fígado. A fermentação quebra o açúcar da beterraba.",
    content: "<p>A beterraba fermentada é terrosa, ácida e profundamente nutritiva. Excelente para acompanhar carnes gordas.</p>",
    image: "https://images.unsplash.com/photo-1543364195-077a16c30ff3?q=80&w=800",
    ingredients: [
      "Beterrabas descascadas e cubadas",
      "Sementes de cominho ou coentro",
      "Salmoura (2% de sal)"
    ],
    instructions: [
      "Coloque as beterrabas no pote com as especiarias.",
      "Cubra com a salmoura.",
      "Fermente por 7 a 14 dias.",
      "O líquido resultante é um tônico sanguíneo poderoso (Kvass) que pode ser bebido."
    ],
    prepTime: 20,
    difficulty: "Fácil"
  },
  {
    title: "Mostarda Caseira Fermentada",
    slug: "mostarda-caseira-fermentada",
    category: "Condimentos Ancestrais",
    excerpt: "Nunca mais compre mostarda industrial cheia de corantes. Esta versão é picante e viva.",
    content: "<p>A semente de mostarda é medicinal. Ao fermentá-la, potencializamos seus compostos anti-inflamatórios e criamos um molho complexo.</p>",
    image: "https://images.unsplash.com/photo-1518559902380-08c358897269?q=80&w=800",
    ingredients: [
      "1/2 xícara de sementes de mostarda (amarela e preta misturadas)",
      "1/2 xícara de água filtrada",
      "2 colheres de sopa de soro de leite (do Labane) ou suco de chucrute",
      "1 colher de chá de sal",
      "Mel e cúrcuma a gosto"
    ],
    instructions: [
      "Misture as sementes, água, soro e sal.",
      "Deixe fermentar em pote fechado por 3 dias em temperatura ambiente (vai absorver a água).",
      "Bata no processador com o mel e cúrcuma até a textura desejada.",
      "Guarde na geladeira (o sabor apura com o tempo)."
    ],
    prepTime: 15,
    difficulty: "Médio"
  },
  {
    title: "Ketchup Caseiro Fermentado",
    slug: "ketchup-caseiro-fermentado",
    category: "Condimentos Ancestrais",
    excerpt: "Sem xarope de milho ou açúcar refinado. Um ketchup rico em licopeno e probióticos.",
    content: "<p>A versão ancestral do condimento favorito do mundo. O sabor é mais adulto, menos doce e muito mais complexo.</p>",
    image: "https://images.unsplash.com/photo-1606138673324-f7b59367290f?q=80&w=800",
    ingredients: [
      "2 latas de pasta de tomate pura (sem açúcar)",
      "1/4 xícara de soro de leite ou suco de chucrute (starter)",
      "1 colher de sopa de mel cru ou xarope de bordo",
      "Cravo, canela e pimenta da jamaica em pó",
      "Sal e vinagre de maçã"
    ],
    instructions: [
      "Misture todos os ingredientes em uma tigela.",
      "Transfira para um pote de vidro.",
      "Deixe fermentar por 2 a 3 dias em temperatura ambiente (veja se formam bolhinhas).",
      "Refrigere. Dura meses."
    ],
    prepTime: 15,
    difficulty: "Fácil"
  },
  {
    title: "Chutney de Abacaxi com Especiarias",
    slug: "chutney-abacaxi-fermentado",
    category: "Frutas Fermentadas",
    excerpt: "Acompanhamento perfeito para carnes de porco. A fermentação consome o açúcar da fruta.",
    content: "<p>Chutneys são uma forma deliciosa de preservar frutas tropicais. O abacaxi contém bromelina, que ajuda na digestão das proteínas.</p>",
    image: "https://images.unsplash.com/photo-1506802913710-40e2e66339c9?q=80&w=800",
    ingredients: [
      "1 abacaxi maduro picado em cubos pequenos",
      "Gengibre ralado, pimenta dedo de moça e hortelã",
      "Suco de 2 limões",
      "1 colher de sopa de soro de leite (opcional para acelerar)"
    ],
    instructions: [
      "Misture o abacaxi com as especiarias e o suco de limão.",
      "Aperte bem dentro de um pote de vidro.",
      "Deixe fermentar por 24 a 48 horas (frutas fermentam rápido e viram álcool se passar do ponto).",
      "Leve à geladeira imediatamente."
    ],
    prepTime: 20,
    difficulty: "Fácil"
  },

  // --- CAPÍTULO 4: CARNES (Exemplo Adicional) ---
  {
    title: "Fígado Acebolado Ancestral",
    slug: "figado-bovino-acebolado",
    category: "Carnes e Órgãos",
    excerpt: "O multivitamínico da natureza. Como preparar fígado para que fique macio e saboroso.",
    content: "<p>Muitos evitam o fígado pelo sabor forte, mas o segredo está no preparo. Rico em Retinol (Vit A), Ferro Heme e B12, é indispensável na dieta da selva.</p>",
    image: "https://images.unsplash.com/photo-1549421267-210196886e00?q=80&w=800",
    ingredients: [
      "500g de bifes de fígado bovino fresco",
      "Suco de 1 limão ou leite (para deixar de molho)",
      "2 cebolas grandes fatiadas",
      "Banha de porco ou manteiga para fritar",
      "Sal e pimenta a gosto"
    ],
    instructions: [
      "Limpe bem o fígado, retirando a membrana externa.",
      "Deixe de molho no leite ou água com limão por 30 min (suaviza o sabor).",
      "Seque bem os bifes com papel toalha.",
      "Aqueça a banha na frigideira de ferro até fumegar.",
      "Sele o fígado rapidamente (1 a 2 min de cada lado). Não deixe passar do ponto para não endurecer.",
      "Reserve o fígado, adicione as cebolas na mesma frigideira e caramelize.",
      "Volte o fígado apenas para aquecer e sirva."
    ],
    prepTime: 45,
    difficulty: "Médio"
  }
];

async function main() {
  console.log('� Iniciando seed do banco de dados...');

  // 1. Criar usuários de teste
  const hashedPassword = await bcrypt.hash('demo123', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@madua.com' },
    update: {
      password: hashedPassword,
      role: 'ADMIN',
      subscriptionStatus: 'ACTIVE',
    },
    create: {
      email: 'admin@madua.com',
      name: 'Admin Madua',
      password: hashedPassword,
      role: 'ADMIN',
      subscriptionStatus: 'ACTIVE',
    },
  });
  console.log('✅ Usuário admin@madua.com criado/atualizado');

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@madua.com' },
    update: {
      password: hashedPassword,
      role: 'USER',
      subscriptionStatus: 'ACTIVE',
    },
    create: {
      email: 'demo@madua.com',
      name: 'Demo User',
      password: hashedPassword,
      role: 'USER',
      subscriptionStatus: 'ACTIVE',
    },
  });
  console.log('✅ Usuário demo@madua.com criado/atualizado');

  const freeUser = await prisma.user.upsert({
    where: { email: 'free@madua.com' },
    update: {
      password: hashedPassword,
      role: 'USER',
      subscriptionStatus: 'INACTIVE',
    },
    create: {
      email: 'free@madua.com',
      name: 'Free User',
      password: hashedPassword,
      role: 'USER',
      subscriptionStatus: 'INACTIVE',
    },
  });
  console.log('✅ Usuário free@madua.com criado/atualizado');

  console.log('');
  console.log('📝 Credenciais de teste:');
  console.log('  Admin: admin@madua.com / demo123 (ACTIVE)');
  console.log('  Demo: demo@madua.com / demo123 (ACTIVE)');
  console.log('  Free: free@madua.com / demo123 (INACTIVE)');
  console.log('');

  // 2. Seed de receitas (código existente)
  console.log('�🍖 Iniciando Seed de Receitas Ancestrais (Lote Laticínios & Fermentados)...');

  for (const recipe of recipes) {
    // 1. Gera slug da categoria
    const categorySlug = recipe.category
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // 2. Cria o Post (Blog Entry)
    const post = await prisma.post.upsert({
      where: { slug: recipe.slug },
      update: {},
      create: {
        title: recipe.title,
        slug: recipe.slug,
        excerpt: recipe.excerpt,
        content: recipe.content,
        image: recipe.image,
        category: {
          connectOrCreate: {
            where: { slug: categorySlug },
            create: {
              name: recipe.category,
              slug: categorySlug,
            },
          },
        },
        isPublished: true,
        isPremium: false, // Estratégia Isca de SEO
        // Metadados de SEO
        metaTitle: `${recipe.title} | Receita Madua`,
        metaDescription: recipe.excerpt,
      },
    });

    // 2. Cria a Receita vinculada (Structured Data)
    await prisma.recipe.upsert({
      where: { postId: post.id },
      update: {},
      create: {
        postId: post.id,
        ingredients: JSON.stringify(recipe.ingredients),
        instructions: JSON.stringify(recipe.instructions),
        prepTime: recipe.prepTime,
        difficulty: recipe.difficulty,
      },
    });

    console.log(`✅ Receita criada: ${recipe.title}`);
  }

  console.log('🚀 Seed de Receitas concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
