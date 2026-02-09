"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sword, Flame, Scroll, Users, Shield, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

const routes = [
  {
    label: "COMANDO",
    icon: Home,
    href: "/dashboard",
  },
  {
    label: "O TRONO",
    icon: Crown,
    href: "/trono",
  },
  {
    label: "A FORJA",
    icon: Sword,
    href: "/forja",
  },
  {
    label: "NUTRIÇÃO ANCESTRAL",
    icon: Flame,
    href: "/nutricao",
  },
  {
    label: "ACADEMIA",
    icon: Scroll,
    href: "/aulas",
  },
  {
    label: "O CLÃ",
    icon: Users,
    href: "/comunidade",
  },
];

const adminRoute = {
  label: "ADMIN",
  icon: Shield,
  href: "/admin",
};

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-zinc-200 dark:border-white/5 bg-white dark:bg-[#050505] transition-transform lg:translate-x-0">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-zinc-200 dark:border-white/5 px-6">
          <Link href="/" className="flex items-center">
            <img
              src="/logo/logo-somente-simbolo.png"
              alt="MADUA Logo"
              className="w-14 h-14"
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {routes.map((route) => {
            const isActive = pathname === route.href;
            const Icon = route.icon;

            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "group flex items-center gap-x-3 rounded-lg px-3 py-3 text-sm font-bold tracking-wide transition-all hover:bg-gray-100 dark:hover:bg-[#0F0F0F] hover:border-[#D4AF37]/30 border border-transparent",
                  isActive
                    ? "bg-gray-100 dark:bg-[#0F0F0F] text-[#D4AF37] border-[#D4AF37]/50"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-colors",
                    isActive ? "text-[#D4AF37]" : "text-gray-400 dark:text-gray-500 group-hover:text-[#D4AF37]"
                  )}
                />
                {route.label}
              </Link>
            );
          })}

          {/* Admin Route */}
          {isAdmin && (
            <>
              <div className="my-4 border-t border-zinc-200 dark:border-white/5" />
              <Link
                href={adminRoute.href}
                className={cn(
                  "group flex items-center gap-x-3 rounded-lg px-3 py-3 text-sm font-bold tracking-wide transition-all hover:bg-gray-100 dark:hover:bg-[#0F0F0F] hover:border-[#D4AF37]/30 border border-transparent",
                  pathname.startsWith(adminRoute.href)
                    ? "bg-gray-100 dark:bg-[#0F0F0F] text-[#D4AF37] border-[#D4AF37]/50"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                <adminRoute.icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-colors",
                    pathname.startsWith(adminRoute.href) ? "text-[#D4AF37]" : "text-gray-400 dark:text-gray-500 group-hover:text-[#D4AF37]"
                  )}
                />
                {adminRoute.label}
              </Link>
            </>
          )}
        </nav>

        {/* Footer info */}
        <div className="border-t border-zinc-200 dark:border-white/5 p-4">
          <p className="text-xs text-gray-500 dark:text-gray-700 tracking-wider">© 2026 MADUA</p>
          <p className="text-xs text-gray-400 dark:text-gray-800 mt-1">COMANDO NEANTRÓPICO</p>
        </div>
      </div>
    </aside>
  );
}
