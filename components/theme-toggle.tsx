'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from './theme-provider';
import { useState, useEffect } from 'react';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-10 w-10 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-gray-100 dark:bg-[#1A1F2E]" />
    );
  }

  return <ThemeToggleButton />;
}

function ThemeToggleButton() {
  const { toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#1A1F2E] text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-[#252b3d] transition-all duration-200"
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </button>
  );
}
