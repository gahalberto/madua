'use client';

import { Search, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export function RecipeSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') || '');

  useEffect(() => {
    setSearch(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    
    if (search.trim()) {
      params.set('q', search.trim());
    } else {
      params.delete('q');
    }
    
    // Reset para primeira página ao buscar
    params.delete('page');
    
    const path = window.location.pathname;
    router.push(`${path}?${params.toString()}`);
  };

  const clearSearch = () => {
    setSearch('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('q');
    params.delete('page');
    
    const path = window.location.pathname;
    router.push(`${path}?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 dark:text-zinc-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pesquisar receitas..."
          className="w-full pl-12 pr-12 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-[#D4AF37] bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
        />
        {search && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </form>
  );
}
