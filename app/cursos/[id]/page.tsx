import { CourseAccessGuard } from '@/components/course-access-guard';
import { getCourseWithModules } from '@/app/actions/courses';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Lock, Play, Unlock } from 'lucide-react';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function CursoPage({ params }: PageProps) {
  const course = await getCourseWithModules(params.id);

  if (!course) {
    notFound();
  }

  // Calcular estatísticas do curso
  const totalModules = course.modules.length;
  const totalLessons = course.modules.reduce(
    (sum, module) => sum + module.lessons.length,
    0
  );
  const freeLessons = course.modules.reduce(
    (sum, module) =>
      sum + module.lessons.filter((lesson) => lesson.isFree).length,
    0
  );

  return (
    <CourseAccessGuard courseId={params.id}>
      <div className="min-h-screen bg-[#0A0A0A]">
        {/* Header */}
        <div className="bg-gradient-to-b from-[#1A1F2E] to-[#0A0A0A] border-b border-zinc-800">
          <div className="container mx-auto px-6 py-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Dashboard
            </Link>

            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-4">
                {course.isPremium && (
                  <span className="px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full text-xs font-medium text-[#D4AF37]">
                    Premium
                  </span>
                )}
                {course.category && (
                  <span className="px-3 py-1 bg-zinc-800/50 border border-zinc-700 rounded-full text-xs font-medium text-zinc-400">
                    {course.category || 'Curso'}
                  </span>
                )}
              </div>

              <h1 className="text-4xl font-bold text-white mb-4">
                {course.title}
              </h1>

              {course.description && (
                <p className="text-lg text-zinc-400 mb-6">{course.description}</p>
              )}

              {/* Stats */}
              <div className="flex flex-wrap gap-6 text-sm text-zinc-400">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>
                    {totalModules} módulo{totalModules !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  <span>
                    {totalLessons} aula{totalLessons !== 1 ? 's' : ''}
                  </span>
                </div>
                {freeLessons > 0 && (
                  <div className="flex items-center gap-2">
                    <Unlock className="w-4 h-4 text-green-400" />
                    <span className="text-green-400">
                      {freeLessons} aula{freeLessons !== 1 ? 's' : ''} grátis
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold text-white mb-6">
              Conteúdo do Curso
            </h2>

            {/* Modules */}
            <div className="space-y-4">
              {course.modules.map((module, moduleIndex) => (
                <div
                  key={module.id}
                  className="bg-[#1A1F2E] rounded-xl border border-zinc-800 overflow-hidden"
                >
                  {/* Module Header */}
                  <div className="p-6 border-b border-zinc-800">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-sm font-bold">
                            {moduleIndex + 1}
                          </span>
                          <h3 className="text-xl font-bold text-white">
                            {module.title}
                          </h3>
                        </div>
                        {module.description && (
                          <p className="text-sm text-zinc-400 ml-11">
                            {module.description}
                          </p>
                        )}
                      </div>
                      <div className="text-sm text-zinc-500">
                        {module.lessons.length} aula
                        {module.lessons.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>

                  {/* Lessons */}
                  <div className="divide-y divide-zinc-800">
                    {module.lessons.map((lesson, lessonIndex) => (
                      <Link
                        key={lesson.id}
                        href={`/cursos/${params.id}/aulas/${lesson.id}`}
                        className="flex items-center gap-4 p-4 hover:bg-zinc-900/50 transition-colors group"
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 text-xs group-hover:bg-[#D4AF37]/10 group-hover:text-[#D4AF37] transition-colors">
                          {lessonIndex + 1}
                        </div>

                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-white group-hover:text-[#D4AF37] transition-colors">
                            {lesson.title}
                          </h4>
                          {lesson.description && (
                            <p className="text-xs text-zinc-500 mt-1 line-clamp-1">
                              {lesson.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          {lesson.isFree && (
                            <span className="flex items-center gap-1 px-2 py-1 bg-green-500/10 border border-green-500/20 rounded text-xs font-medium text-green-400">
                              <Unlock className="w-3 h-3" />
                              Grátis
                            </span>
                          )}
                          {!lesson.isFree && (
                            <Lock className="w-4 h-4 text-zinc-600" />
                          )}
                          <Play className="w-4 h-4 text-zinc-600 group-hover:text-[#D4AF37] transition-colors" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {course.modules.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-zinc-400 mb-2">
                  Nenhum módulo disponível
                </h3>
                <p className="text-sm text-zinc-500">
                  O conteúdo deste curso ainda está sendo preparado.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </CourseAccessGuard>
  );
}
