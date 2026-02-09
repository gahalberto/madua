import { Suspense } from 'react';
import { AncestralQuoteLoader } from '@/components/ancestral-quote';

// Exemplo de página que usa o loading state com sabedoria ancestral
async function SlowContent() {
  // Simular carregamento lento
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-foreground mb-4">
        Conteúdo Carregado
      </h1>
      <p className="text-gray-400">
        Este conteúdo demorou a carregar, mas o utilizador viu uma mensagem inspiradora enquanto esperava.
      </p>
    </div>
  );
}

export default function ExampleLoadingPage() {
  return (
    <Suspense fallback={<AncestralQuoteLoader message="A preparar o teu conhecimento..." />}>
      <SlowContent />
    </Suspense>
  );
}
