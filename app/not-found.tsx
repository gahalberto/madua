import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-900 text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-2xl mb-8">Página não encontrada</p>
        <p className="text-zinc-400 mb-8">A página que você está procurando não existe.</p>
        <Link 
          href="/" 
          className="inline-block px-8 py-3 bg-amber-600 hover:bg-amber-700 rounded-lg font-semibold transition-colors"
        >
          Voltar para a página inicial
        </Link>
      </div>
    </div>
  );
}
