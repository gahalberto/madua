'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { createQuote } from '@/app/actions/quotes';

export function AddQuoteForm() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!text.trim()) {
      setError('Digite uma frase');
      return;
    }

    setIsLoading(true);
    const result = await createQuote(text);

    if (result.success) {
      setText('');
      router.refresh();
    } else {
      setError(result.error || 'Erro ao adicionar frase');
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#1A1F2E] rounded-xl p-6 border border-zinc-800">
      <h2 className="text-lg font-semibold text-white mb-4">Nova Frase de Sabedoria</h2>
      <div className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setError('');
          }}
          placeholder="Digite uma frase de sabedoria ancestral..."
          rows={3}
          className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-[#D4AF37] resize-none"
        />
        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-3 bg-[#D4AF37] hover:bg-[#C5A028] text-black font-medium rounded-lg transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          {isLoading ? 'Adicionando...' : 'Adicionar Frase'}
        </button>
      </div>
    </form>
  );
}
