'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  GraduationCap,
  CreditCard,
  Settings,
  LogOut,
  Shield,
  BarChart3,
  Lightbulb,
  Play,
  ShoppingCart,
  FileText,
  UtensilsCrossed,
  FolderKanban
} from 'lucide-react';
import { signOut } from 'next-auth/react';

const routes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/admin',
  },
  {
    label: 'Usuários',
    icon: Users,
    href: '/admin/users',
  },
  {
    label: 'Relatórios',
    icon: BarChart3,
    href: '/admin/reports',
  },
  {
    label: 'Cursos',
    icon: BookOpen,
    href: '/admin/courses',
  },
  {
    label: 'Vlogs',
    icon: Play,
    href: '/admin/vlogs',
  },
  {
    label: 'Aulas',
    icon: GraduationCap,
    href: '/admin/lessons',
  },
  {
    label: 'Blog',
    icon: FileText,
    href: '/admin/posts',
  },
  {
    label: 'Receitas',
    icon: UtensilsCrossed,
    href: '/admin/receitas',
  },
  {
    label: 'Categorias',
    icon: FolderKanban,
    href: '/admin/categorias',
  },
  {
    label: 'Sabedoria',
    icon: Lightbulb,
    href: '/admin/quotes',
  },
  {
    label: 'Vendas',
    icon: ShoppingCart,
    href: '/admin/sales',
  },
  {
    label: 'Pagamentos',
    icon: CreditCard,
    href: '/admin/payments',
  },
  {
    label: 'Configurações',
    icon: Settings,
    href: '/admin/settings',
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="h-full bg-[#0A0A0A] border-r border-zinc-800 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <img
            src="/logo/logo-somente-simbolo.png"
            alt="MADUA Logo"
            className="w-12 h-12"
          />
          <div>
            <h1 className="text-lg font-bold text-white">MADUA Admin</h1>
            <p className="text-xs text-zinc-500">Painel de Controlo</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {routes.map((route) => {
          const isActive = pathname === route.href;
          return (
            <Link
              key={route.href}
              href={route.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                ${isActive 
                  ? 'bg-[#D4AF37] text-black font-medium' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }
              `}
            >
              <route.icon className="w-5 h-5" />
              <span className="text-sm">{route.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-zinc-800">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Sair</span>
        </button>
      </div>
    </div>
  );
}
