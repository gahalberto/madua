'use client';

import Link from 'next/link';
import { Edit, Trash2 } from 'lucide-react';
import { deleteCourse } from '@/app/actions/courses';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface CourseActionsProps {
  courseId: string;
}

export function CourseActions({ courseId }: CourseActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este curso? Esta ação não pode ser desfeita.')) {
      return;
    }

    setIsDeleting(true);
    const result = await deleteCourse(courseId);
    
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error || 'Erro ao excluir curso');
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/admin/courses/${courseId}`}
        className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-sm rounded-lg transition-colors inline-flex items-center gap-1.5"
      >
        <Edit className="w-4 h-4" />
        Editar
      </Link>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm rounded-lg transition-colors inline-flex items-center gap-1.5 disabled:opacity-50"
      >
        <Trash2 className="w-4 h-4" />
        {isDeleting ? 'Excluindo...' : 'Excluir'}
      </button>
    </div>
  );
}
