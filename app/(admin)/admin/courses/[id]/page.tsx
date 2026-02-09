import { getCourseWithModules } from '@/app/actions/courses';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { EditCourseForm } from '@/components/edit-course-form';
import { ModulesManager } from '@/components/modules-manager';

export default async function EditCoursePage({ params }: { params: { id: string } }) {
  const course = await getCourseWithModules(params.id);

  if (!course) {
    notFound();
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/courses"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Cursos
        </Link>
        <h1 className="text-3xl font-bold text-white mb-2">Editar Curso</h1>
        <p className="text-zinc-400">Gerencie as informações e módulos do curso</p>
      </div>

      {/* Course Form */}
      <div className="mb-8">
        <EditCourseForm course={course} />
      </div>

      {/* Modules Manager */}
      <ModulesManager courseId={params.id} modules={course.modules} />
    </div>
  );
}
