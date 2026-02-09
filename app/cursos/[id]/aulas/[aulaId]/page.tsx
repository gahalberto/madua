import { CourseAccessGuard } from '@/components/course-access-guard';
import { getCourseWithModules } from '@/app/actions/courses';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Play,
  Lock,
  CheckCircle2,
} from 'lucide-react';
import { VideoPlayer } from '@/components/video-player';

interface PageProps {
  params: {
    id: string;
    aulaId: string;
  };
}

export default async function AulaPage({ params }: PageProps) {
  const course = await getCourseWithModules(params.id);

  if (!course) {
    notFound();
  }

  // Encontrar a aula atual
  type LessonWithModule = typeof course.modules[0]['lessons'][0] & { moduleTitle: string };
  let currentLesson: LessonWithModule | null = null;
  let currentModule: typeof course.modules[0] | null = null;
  const allLessons: LessonWithModule[] = [];

  for (const courseModule of course.modules) {
    for (const lesson of courseModule.lessons) {
      allLessons.push({ ...lesson, moduleTitle: courseModule.title });
      if (lesson.id === params.aulaId) {
        currentLesson = { ...lesson, moduleTitle: courseModule.title };
        currentModule = courseModule;
      }
    }
  }

  if (!currentLesson) {
    notFound();
  }

  // Encontrar aula anterior e próxima
  const currentIndex = allLessons.findIndex((l) => l.id === params.aulaId);
  const previousLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return (
    <CourseAccessGuard courseId={params.id}>
      <div className="min-h-screen bg-[#0A0A0A]">
        {/* Video Player Section */}
        <div className="bg-black">
          <div className="container mx-auto px-6 py-4">
            <Link
              href={`/cursos/${params.id}`}
              className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Curso
            </Link>
          </div>

          {currentLesson.videoUrl ? (
            <VideoPlayer
              url={currentLesson.videoUrl}
            />
          ) : (
            <div className="aspect-video bg-zinc-900 flex items-center justify-center">
              <div className="text-center">
                <Play className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-500">Vídeo não disponível</p>
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-zinc-500 mb-4">
              <Link
                href="/dashboard"
                className="hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link
                href={`/cursos/${params.id}`}
                className="hover:text-white transition-colors"
              >
                {course.title}
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">{currentLesson.title}</span>
            </div>

            {/* Lesson Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                {currentModule && (
                  <span className="px-3 py-1 bg-zinc-800/50 border border-zinc-700 rounded-full text-xs font-medium text-zinc-400">
                    {currentModule.title}
                  </span>
                )}
                {currentLesson.isFree && (
                  <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-xs font-medium text-green-400">
                    Grátis
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-bold text-white mb-4">
                {currentLesson.title}
              </h1>

              {currentLesson.description && (
                <p className="text-lg text-zinc-400">{currentLesson.description}</p>
              )}
            </div>

            {/* Navigation */}
            <div className="flex gap-4 mb-8">
              {previousLesson ? (
                <Link
                  href={`/cursos/${params.id}/aulas/${previousLesson.id}`}
                  className="flex-1 flex items-center gap-3 p-4 bg-[#1A1F2E] border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors group"
                >
                  <ChevronLeft className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-zinc-500 mb-1">Anterior</p>
                    <p className="text-sm text-white font-medium truncate">
                      {previousLesson.title}
                    </p>
                  </div>
                </Link>
              ) : (
                <div className="flex-1" />
              )}

              {nextLesson ? (
                <Link
                  href={`/cursos/${params.id}/aulas/${nextLesson.id}`}
                  className="flex-1 flex items-center gap-3 p-4 bg-[#1A1F2E] border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors group"
                >
                  <div className="flex-1 min-w-0 text-right">
                    <p className="text-xs text-zinc-500 mb-1">Próxima</p>
                    <p className="text-sm text-white font-medium truncate">
                      {nextLesson.title}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" />
                </Link>
              ) : (
                <div className="flex-1" />
              )}
            </div>

            {/* Course Progress Sidebar */}
            <div className="bg-[#1A1F2E] rounded-xl border border-zinc-800 p-6">
              <h2 className="text-lg font-bold text-white mb-4">
                Conteúdo do Curso
              </h2>

              <div className="space-y-4">
                {course.modules.map((module) => (
                  <div key={module.id}>
                    <h3 className="text-sm font-semibold text-zinc-300 mb-2">
                      {module.title}
                    </h3>
                    <div className="space-y-1">
                      {module.lessons.map((lesson) => (
                        <Link
                          key={lesson.id}
                          href={`/cursos/${params.id}/aulas/${lesson.id}`}
                          className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                            lesson.id === params.aulaId
                              ? 'bg-[#D4AF37]/10 border border-[#D4AF37]/20'
                              : 'hover:bg-zinc-900/50'
                          }`}
                        >
                          <div className="flex-shrink-0">
                            {lesson.id === params.aulaId ? (
                              <Play className="w-4 h-4 text-[#D4AF37]" />
                            ) : lesson.isFree ? (
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                            ) : (
                              <Lock className="w-4 h-4 text-zinc-600" />
                            )}
                          </div>
                          <span
                            className={`text-sm flex-1 ${
                              lesson.id === params.aulaId
                                ? 'text-[#D4AF37] font-medium'
                                : 'text-zinc-400'
                            }`}
                          >
                            {lesson.title}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </CourseAccessGuard>
  );
}
