import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { AdminSidebar } from '@/components/admin-sidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Verifica se está autenticado
  if (!session) {
    redirect('/login');
  }

  // Verifica se é admin
  if (session.user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  return (
    <div className="h-screen flex overflow-hidden dark">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0">
        <AdminSidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#0A0A0A]">
        {children}
      </main>
    </div>
  );
}
