'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Heart } from 'lucide-react';
import { deleteQuote, toggleQuoteLike } from '@/app/actions/quotes';

interface QuoteItemProps {
  quote: {
    id: string;
    text: string;
    _count: {
      likes: number;
    };
  };
  userId: string;
  hasLiked: boolean;
}

export function QuoteItem({ quote, userId, hasLiked }: QuoteItemProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [liked, setLiked] = useState(hasLiked);
  const [likeCount, setLikeCount] = useState(quote._count.likes);

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir esta frase?')) return;

    setIsDeleting(true);
    const result = await deleteQuote(quote.id);

    if (result.success) {
      router.refresh();
    } else {
      alert(result.error || 'Erro ao excluir frase');
    }
    setIsDeleting(false);
  };

  const handleLike = async () => {
    setIsLiking(true);
    
    // Atualização otimista
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);

    const result = await toggleQuoteLike(quote.id, userId);

    if (!result.success) {
      // Reverter em caso de erro
      setLiked(liked);
      setLikeCount(quote._count.likes);
      alert(result.error || 'Erro ao processar like');
    }
    
    setIsLiking(false);
    router.refresh();
  };

  return (
    <div className="flex items-start gap-4 p-4 bg-[#0A0A0A] border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors">
      <div className="flex-1">
        <p className="text-white leading-relaxed">{quote.text}</p>
        <div className="flex items-center gap-4 mt-3">
          <button
            onClick={handleLike}
            disabled={isLiking}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all disabled:opacity-50 ${
              liked
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">{likeCount}</span>
          </button>
        </div>
      </div>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="p-2 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 flex-shrink-0"
        title="Excluir frase"
      >
        <Trash2 className="w-4 h-4 text-red-400" />
      </button>
    </div>
  );
}
