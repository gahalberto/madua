import { getAllQuotes, hasUserLikedQuote } from '@/app/actions/quotes';
import { Lightbulb, Sparkles, TrendingUp } from 'lucide-react';
import { AddQuoteForm } from '@/components/add-quote-form';
import { QuoteItem } from '@/components/quote-item';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function QuotesPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/login');
  }

  const quotes = await getAllQuotes();

  // Verificar quais quotes o usuário curtiu
  const quotesWithLikes = await Promise.all(
    quotes.map(async (quote) => ({
      ...quote,
      hasLiked: await hasUserLikedQuote(quote.id, session.user.id),
    }))
  );

  // Ordenar por número de likes (mais curtidas primeiro)
  const sortedQuotes = [...quotesWithLikes].sort((a, b) => b._count.likes - a._count.likes);

  // Calcular total de likes
  const totalLikes = quotes.reduce((acc, quote) => acc + quote._count.likes, 0);

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Sabedoria Ancestral</h1>
          <p className="text-zinc-400">Gerencie as frases de sabedoria da plataforma</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-r from-[#D4AF37]/20 to-[#D4AF37]/5 rounded-xl p-6 border border-[#D4AF37]/30">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-sm text-zinc-400 mb-1">Frases Vivas no Sistema</p>
                <p className="text-4xl font-bold text-white">{quotes.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-500/20 to-red-500/5 rounded-xl p-6 border border-red-500/30">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-red-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-400 mb-1">Total de Likes dos Usuários</p>
                <p className="text-4xl font-bold text-white">{totalLikes}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Add Form */}
          <div className="lg:col-span-1">
            <AddQuoteForm />
          </div>

          {/* Quotes List */}
          <div className="lg:col-span-2">
            <div className="bg-[#1A1F2E] rounded-xl p-6 border border-zinc-800">
              <div className="flex items-center gap-2 mb-6">
                <Lightbulb className="w-5 h-5 text-[#D4AF37]" />
                <h2 className="text-lg font-semibold text-white">
                  Todas as Frases ({quotes.length})
                </h2>
                <span className="text-xs text-zinc-500 ml-auto">Ordenadas por popularidade</span>
              </div>

              {sortedQuotes.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mx-auto mb-4">
                    <Lightbulb className="w-8 h-8 text-zinc-600" />
                  </div>
                  <p className="text-zinc-400">Nenhuma frase cadastrada ainda</p>
                  <p className="text-sm text-zinc-500 mt-2">
                    Adicione a primeira frase de sabedoria →
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {sortedQuotes.map((quote) => (
                    <QuoteItem 
                      key={quote.id} 
                      quote={quote} 
                      userId={session.user.id}
                      hasLiked={quote.hasLiked}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
