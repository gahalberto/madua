'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Edit, Trash2 } from 'lucide-react';
import { deleteVlog } from '@/app/actions/vlogs';
import Link from 'next/link';

interface VlogActionsProps {
  vlogId: string;
}

export function VlogActions({ vlogId }: VlogActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este vlog?')) return;

    setIsDeleting(true);
    const result = await deleteVlog(vlogId);

    if (result.success) {
      router.refresh();
    } else {
      alert(result.error || 'Erro ao excluir vlog');
    }
    setIsDeleting(false);
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Link
        href={`/admin/vlogs/${vlogId}`}
        className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
      >
        <Edit className="w-4 h-4 text-zinc-400" />
      </Link>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="p-2 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
      >
        <Trash2 className="w-4 h-4 text-red-400" />
      </button>
    </div>
  );
}
