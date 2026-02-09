import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Play, Clock, ChefHat, TrendingUp, ArrowRight } from "lucide-react";
import Image from "next/image";
import { AncestralQuote } from "@/components/ancestral-quote";

async function getGreeting(name: string) {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return `A Caçada Começa, ${name}.`;
  } else if (hour >= 12 && hour < 18) {
    return `O Sol no Zênite, ${name}. Hora da Execução.`;
  } else if (hour >= 18 && hour < 22) {
    return `O Crepúsculo Chegou, ${name}. Recupere-se.`;
  } else {
    return `A Noite É Sua, ${name}. Descanse ou Domine.`;
  }
}

async function getUserProgress() {
  // Calcular progresso geral baseado em conteúdos consumidos
  const totalCourses = await prisma.course.count();
  const totalRecipes = await prisma.recipe.count();
  const totalPosts = await prisma.post.count({ where: { isPublished: true } });
  
  // Aqui você pode implementar lógica de progresso real
  // Por enquanto, retornamos valores simulados
  const progress = Math.floor(Math.random() * 100);
  const level = Math.floor(progress / 10) + 1;
  
  return { progress, level, totalCourses, totalRecipes, totalPosts };
}

async function getFeaturedRecipe() {
  const recipes = await prisma.recipe.findMany({
    include: { post: true },
    take: 10,
  });
  
  if (recipes.length === 0) return null;
  
  const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];
  return randomRecipe;
}

async function getCourses() {
  return await prisma.course.findMany({
    where: { isPublished: true },
    take: 6,
    orderBy: { createdAt: 'desc' },
  });
}

async function getVlogs() {
  return await prisma.post.findMany({
    where: { 
      isPublished: true,
      category: {
        slug: 'vlogs'
      }
    },
    take: 6,
    orderBy: { createdAt: 'desc' },
    include: {
      category: true
    }
  });
}

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
  });

  if (!user) {
    redirect('/login');
  }

  const greeting = await getGreeting(user.name || 'Guerreiro');
  const progress = await getUserProgress();
  const featuredRecipe = await getFeaturedRecipe();
  const courses = await getCourses();
  const vlogs = await getVlogs();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* A. O ORÁCULO (Header) */}
        <div className="space-y-4">
          <AncestralQuote />
          <h1 className="text-3xl font-bold tracking-wider text-gray-900 dark:text-white">
            {greeting}
          </h1>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* B. STATUS DE NEANTROPIA */}
          <div className="lg:col-span-2 bg-white dark:bg-[#0F0F0F] border border-zinc-200 dark:border-white/5 rounded-lg p-6 hover:border-[#D4AF37]/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold tracking-wide text-[#D4AF37] uppercase">
                Nível de Ordem Biológica
              </h2>
              <TrendingUp className="text-[#D4AF37]" size={24} />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-bold text-gray-900 dark:text-white">NÍVEL {progress.level}</span>
                <span className="text-gray-400 dark:text-gray-500">/ 10</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Progresso Geral</span>
                  <span>{progress.progress}%</span>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-black/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#D4AF37] to-yellow-600 transition-all duration-1000"
                    style={{ width: `${progress.progress}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-zinc-200 dark:border-white/5">
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{progress.totalCourses}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-500 uppercase tracking-wide">Cursos</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{progress.totalRecipes}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-500 uppercase tracking-wide">Receitas</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{progress.totalPosts}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-500 uppercase tracking-wide">Posts</p>
                </div>
              </div>
            </div>
          </div>

          {/* D. O ARSENAL (Receita Destaque) */}
          {featuredRecipe ? (
            <Link
              href={`/receitas/${featuredRecipe.post.slug}`}
              className="bg-white dark:bg-[#0F0F0F] border border-zinc-200 dark:border-white/5 rounded-lg overflow-hidden hover:border-[#D4AF37]/30 transition-all group"
            >
              <div className="relative h-48">
                {featuredRecipe.post.image && (
                  <Image
                    src={featuredRecipe.post.image}
                    alt={featuredRecipe.post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute top-3 right-3 bg-[#D4AF37] text-black px-3 py-1 rounded-full text-xs font-bold uppercase">
                  Arsenal
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {featuredRecipe.post.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    {featuredRecipe.prepTime} min
                  </div>
                  <div className="px-2 py-1 bg-white/5 rounded">
                    {featuredRecipe.difficulty}
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-[#D4AF37] text-sm font-bold">
                  <ChefHat size={16} />
                  PREPARAR ALIMENTO
                </div>
              </div>
            </Link>
          ) : (
            <div className="bg-white dark:bg-[#0F0F0F] border border-zinc-200 dark:border-white/5 rounded-lg p-6 flex items-center justify-center">
              <div className="text-center text-gray-400 dark:text-gray-500">
                <ChefHat size={48} className="mx-auto mb-3 opacity-20" />
                <p className="text-sm">Nenhuma receita disponível</p>
              </div>
            </div>
          )}
        </div>

        {/* C. CONTINUAR A JORNADA */}
        <div className="bg-white dark:bg-[#0F0F0F] border border-zinc-200 dark:border-white/5 rounded-lg p-6 hover:border-[#D4AF37]/30 transition-all">
          <h2 className="text-xl font-bold tracking-wide text-gray-900 dark:text-white uppercase mb-4">
            Continuar a Jornada
          </h2>
          <div className="text-center py-12 text-gray-500 dark:text-gray-500">
            <Play size={48} className="mx-auto mb-3 opacity-20" />
            <p>Sua jornada começa agora. Assista a primeira aula.</p>
            <Link
              href="/aulas"
              className="inline-flex items-center gap-2 mt-4 text-[#D4AF37] hover:text-[#D4AF37]/80 font-bold"
            >
              Explorar Academia <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* E. TRILHAS DE CONHECIMENTO */}
        <div className="space-y-8">
          {/* Fundamentos da Selva */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold tracking-wide text-[#D4AF37] uppercase">
                Fundamentos da Selva
              </h2>
              <Link
                href="/aulas"
                className="text-sm text-gray-400 hover:text-[#D4AF37] transition-colors"
              >
                Ver todos →
              </Link>
            </div>
            
            {courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map((course) => (
                  <Link
                    key={course.id}
                    href={`/cursos/${course.id}`}
                    className="bg-white dark:bg-[#0F0F0F] border border-zinc-200 dark:border-white/5 rounded-lg p-4 hover:border-[#D4AF37]/30 transition-all group"
                  >
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2 group-hover:text-[#D4AF37] transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-500 line-clamp-2">
                      {course.description}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 bg-[#0F0F0F] border border-white/5 rounded-lg">
                <p className="text-sm">Nenhum curso disponível no momento</p>
              </div>
            )}
          </div>

          {/* Práticas de Campo */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold tracking-wide text-[#D4AF37] uppercase">
                Práticas de Campo
              </h2>
              <Link
                href="/vlogs"
                className="text-sm text-gray-400 hover:text-[#D4AF37] transition-colors"
              >
                Ver todos →
              </Link>
            </div>
            
            {vlogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vlogs.map((vlog) => (
                  <div
                    key={vlog.id}
                    className="bg-white dark:bg-[#0F0F0F] border border-zinc-200 dark:border-white/5 rounded-lg p-4 hover:border-[#D4AF37]/30 transition-all"
                  >
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                      {vlog.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-500 line-clamp-2">
                      {vlog.excerpt || 'Sem descrição'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 bg-white dark:bg-[#0F0F0F] border border-zinc-200 dark:border-white/5 rounded-lg">
                <p className="text-sm">Nenhum vlog disponível no momento</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

