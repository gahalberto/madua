'use client';

import { useEffect, useState } from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { getRandomQuote, toggleQuoteLike, hasUserLikedQuote } from '@/app/actions/quotes';
import { useSession } from 'next-auth/react';

interface AncestralQuoteProps {
  className?: string;
  showIcon?: boolean;
}

export function AncestralQuote({ className = '', showIcon = true }: AncestralQuoteProps) {
  const { data: session } = useSession();
  const [quote, setQuote] = useState<{ id: string; text: string; _count: { likes: number } } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    async function loadQuote() {
      try {
        setIsLoading(true);
        console.log('🔍 Buscando frase...');
        const data = await getRandomQuote();
        console.log('✅ Frase recebida:', data);
        
        if (data?.text) {
          setQuote(data);
          setLikeCount(data._count.likes);
          
          // Verificar se o usuário deu like
          if (session?.user?.id) {
            const liked = await hasUserLikedQuote(data.id, session.user.id);
            setHasLiked(liked);
          }
          
          // Pequeno delay para animação de fade-in
          setTimeout(() => setIsVisible(true), 100);
        } else {
          console.warn('⚠️ Nenhuma frase retornada');
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('❌ Erro ao carregar frase:', error);
        setIsLoading(false);
      }
    }

    loadQuote();
  }, [session?.user?.id]);

  const handleLike = async () => {
    if (!session?.user?.id || !quote) return;
    
    setIsLiking(true);
    
    // Atualização otimista
    setHasLiked(!hasLiked);
    setLikeCount(hasLiked ? likeCount - 1 : likeCount + 1);

    const result = await toggleQuoteLike(quote.id, session.user.id);

    if (!result.success) {
      // Reverter em caso de erro
      setHasLiked(hasLiked);
      setLikeCount(quote._count.likes);
    }
    
    setIsLiking(false);
  };

  // Mostrar skeleton enquanto carrega
  if (isLoading) {
    return (
      <div className={`p-6 bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-[#2A2A2A] rounded-lg ${className}`}>
        <div className="flex items-start gap-3">
          {showIcon && (
            <div className="flex-shrink-0 mt-1">
              <Sparkles className="h-5 w-5 text-[#D4AF37] animate-pulse" />
            </div>
          )}
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-zinc-800 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-zinc-800 rounded animate-pulse w-full"></div>
            <div className="h-4 bg-zinc-800 rounded animate-pulse w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!quote) {
    return null;
  }

  return (
    <div
      className={`
        flex items-start gap-3 p-6 
        bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A]
        border border-[#2A2A2A] rounded-lg
        transition-all duration-700 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        ${className}
      `}
    >
      {showIcon && (
        <div className="flex-shrink-0 mt-1">
          <Sparkles className="h-5 w-5 text-[#D4AF37]" />
        </div>
      )}
      
      <div className="flex-1">
        <p className="text-[#A1A1AA] italic text-sm md:text-base leading-relaxed">
          &quot;{quote.text}&quot;
        </p>
        <div className="flex items-center justify-between mt-3">
          <p className="text-[#D4AF37] text-xs font-medium tracking-wide">
            — SABEDORIA ANCESTRAL
          </p>
          
          {session?.user && (
            <button
              onClick={handleLike}
              disabled={isLiking}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all disabled:opacity-50 ${
                hasLiked
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current' : ''}`} />
              <span className="text-xs font-medium">{likeCount}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Componente específico para loading states
export function AncestralQuoteLoader({ message = 'Carregando...' }: { message?: string }) {
  const { data: session } = useSession();
  const [quote, setQuote] = useState<{ id: string; text: string; _count: { likes: number } } | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    async function loadQuote() {
      const data = await getRandomQuote();
      
      if (data?.text) {
        setQuote(data);
        setLikeCount(data._count.likes);
        
        if (session?.user?.id) {
          const liked = await hasUserLikedQuote(data.id, session.user.id);
          setHasLiked(liked);
        }
        
        setTimeout(() => setIsVisible(true), 100);
      }
    }

    loadQuote();
  }, [session?.user?.id]);

  const handleLike = async () => {
    if (!session?.user?.id || !quote) return;
    
    setIsLiking(true);
    
    setHasLiked(!hasLiked);
    setLikeCount(hasLiked ? likeCount - 1 : likeCount + 1);

    const result = await toggleQuoteLike(quote.id, session.user.id);

    if (!result.success) {
      setHasLiked(hasLiked);
      setLikeCount(quote._count.likes);
    }
    
    setIsLiking(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="max-w-2xl w-full space-y-8">
        {/* Loading spinner */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-[#2A2A2A] border-t-[#D4AF37] rounded-full animate-spin" />
            <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-[#D4AF37] animate-pulse" />
          </div>
        </div>

        {/* Loading message */}
        <p className="text-center text-gray-500 text-sm">{message}</p>

        {/* Quote */}
        {quote && (
          <div
            className={`
              transition-all duration-700 ease-out
              ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
            `}
          >
            <div className="p-6 bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-[#2A2A2A] rounded-lg">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-[#D4AF37] flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <p className="text-[#A1A1AA] italic text-base leading-relaxed">
                    &quot;{quote.text}&quot;
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-[#D4AF37] text-xs font-medium tracking-wide">
                      — SABEDORIA ANCESTRAL
                    </p>
                    
                    {session?.user && (
                      <button
                        onClick={handleLike}
                        disabled={isLiking}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all disabled:opacity-50 ${
                          hasLiked
                            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                            : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current' : ''}`} />
                        <span className="text-xs font-medium">{likeCount}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
