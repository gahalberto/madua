import { getVlog } from '@/app/actions/vlogs';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { EditVlogForm } from '@/components/edit-vlog-form';

interface EditVlogPageProps {
  params: {
    id: string;
  };
}

export default async function EditVlogPage({ params }: EditVlogPageProps) {
  const vlog = await getVlog(params.id);

  if (!vlog) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin/vlogs"
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-zinc-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Editar Vlog</h1>
            <p className="text-zinc-400">{vlog.title}</p>
          </div>
        </div>

        {/* Edit Form */}
        <EditVlogForm vlog={vlog} />
      </div>
    </div>
  );
}
