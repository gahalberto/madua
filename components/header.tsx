"use client";

import { Search, User, LogOut } from "lucide-react";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { ThemeToggle } from "./theme-toggle";
import { NotificationCenter } from "./notification-center";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <header className="fixed right-0 top-0 z-30 h-16 w-full border-b border-zinc-200 dark:border-[#1F1F1F] bg-white dark:bg-[#121212] lg:w-[calc(100%-16rem)]">
      <div className="flex h-full items-center justify-between px-6">
        {/* Search Bar */}
        <div className="flex flex-1 items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Pesquisar cursos, aulas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 dark:border-[#1F1F1F] bg-white dark:bg-[#1F1F1F] py-2 pl-10 pr-4 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>

        {/* Right side - Theme Toggle, Notifications & Profile */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* Notifications */}
          <NotificationCenter />
          
          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 rounded-lg border border-zinc-200 dark:border-[#1F1F1F] bg-gray-50 dark:bg-[#1F1F1F] px-3 py-2 transition-colors hover:border-accent"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white dark:text-background">
                {session?.user?.name ? (
                  <span className="text-sm font-bold">{session.user.name.charAt(0).toUpperCase()}</span>
                ) : (
                  <User className="h-4 w-4" />
                )}
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-medium text-gray-900 dark:text-foreground">
                  {session?.user?.name || "Utilizador"}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {session?.user?.role?.toLowerCase() || "User"}
                </p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-zinc-200 dark:border-[#1F1F1F] bg-white dark:bg-[#121212] py-2 shadow-xl z-20">
                  <div className="px-4 py-2 border-b border-zinc-200 dark:border-[#1F1F1F]">
                    <p className="text-sm font-medium text-gray-900 dark:text-foreground">{session?.user?.name}</p>
                    <p className="text-xs text-gray-500">{session?.user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-900 dark:text-foreground hover:bg-gray-100 dark:hover:bg-[#1F1F1F] transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
