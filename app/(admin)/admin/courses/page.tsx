import { getAllCourses } from '@/app/actions/courses';
import { BookOpen, Plus, Eye, EyeOff, Layers, Lock, Unlock } from 'lucide-react';
import Link from 'next/link';
import { CourseActions } from '@/components/course-actions';

export const dynamic = 'force-dynamic';

export default async function CoursesPage() {
  const courses = await getAllCourses();

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Gerenciamento de Cursos</h1>
          <p className="text-zinc-400">
            Total de {courses.length} curso{courses.length !== 1 ? 's' : ''} cadastrado{courses.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/admin/courses/new"
          className="flex items-center gap-2 px-4 py-3 bg-[#D4AF37] hover:bg-[#C5A028] text-black font-medium rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Novo Curso
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#1A1F2E] rounded-xl p-6 border border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-blue-500/10">
              <BookOpen className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-zinc-400 text-sm">Total de Cursos</p>
              <p className="text-2xl font-bold text-white">{courses.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#1A1F2E] rounded-xl p-6 border border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-emerald-500/10">
              <Eye className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-zinc-400 text-sm">Publicados</p>
              <p className="text-2xl font-bold text-white">
                {courses.filter((c) => c.isPublished).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#1A1F2E] rounded-xl p-6 border border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-amber-500/10">
              <Lock className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-zinc-400 text-sm">Premium</p>
              <p className="text-2xl font-bold text-white">
                {courses.filter((c) => c.isPremium).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#1A1F2E] rounded-xl p-6 border border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-purple-500/10">
              <Layers className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-zinc-400 text-sm">Total de Módulos</p>
              <p className="text-2xl font-bold text-white">
                {courses.reduce((sum, c) => sum + c._count.modules, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-[#1A1F2E] rounded-xl border border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-900">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Curso
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Acesso
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Módulos
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-zinc-900/50 transition-colors">
                  {/* Course Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-zinc-800 flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-zinc-600" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-white">{course.title}</div>
                        {course.description && (
                          <div className="text-sm text-zinc-400 line-clamp-1">
                            {course.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-zinc-300">
                      {course.category || '-'}
                    </span>
                  </td>

                  {/* Type */}
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300">
                      {course.type}
                    </span>
                  </td>

                  {/* Access Type */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {course.isInClub && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium w-fit bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20">
                          🏛️ Clube
                        </span>
                      )}
                      {course.isStandalone && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium w-fit bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          💰 Venda {course.price ? `€${course.price}` : ''}
                        </span>
                      )}
                      {!course.isInClub && !course.isStandalone && (
                        <span className="text-xs text-zinc-500">-</span>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium w-fit ${
                          course.isPublished
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                        }`}
                      >
                        {course.isPublished ? (
                          <Eye className="w-3 h-3" />
                        ) : (
                          <EyeOff className="w-3 h-3" />
                        )}
                        {course.isPublished ? 'Publicado' : 'Rascunho'}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium w-fit ${
                          course.isPremium
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        }`}
                      >
                        {course.isPremium ? (
                          <Lock className="w-3 h-3" />
                        ) : (
                          <Unlock className="w-3 h-3" />
                        )}
                        {course.isPremium ? 'Premium' : 'Gratuito'}
                      </span>
                    </div>
                  </td>

                  {/* Modules Count */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-zinc-300">
                      <Layers className="w-4 h-4" />
                      <span>{course._count.modules}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <CourseActions courseId={course.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {courses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-400">Nenhum curso cadastrado</p>
            <Link
              href="/admin/courses/new"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Criar Primeiro Curso
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
