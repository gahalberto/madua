'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Flame } from 'lucide-react';

export default function ManifestoPage() {
  const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set());
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-section') || '0');
            setVisibleSections((prev) => new Set(prev).add(index));
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '-50px',
      }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-black min-h-screen">
      {/* Hero Section */}
      <section
        ref={(el) => {
          sectionRefs.current[0] = el;
        }}
        data-section="0"
        className={`min-h-screen flex items-center justify-center relative overflow-hidden transition-all duration-1000 ${
          visibleSections.has(0) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-black to-black" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="mb-8 flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-amber-600" />
            <Flame className="text-amber-600" size={28} />
            <div className="h-px w-16 bg-amber-600" />
          </div>
          <h1 className="text-6xl md:text-8xl font-serif text-white mb-8 leading-tight">
            Manifesto <span className="text-amber-600">MADUA</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 font-serif leading-relaxed">
            A Reconquista da Soberania Biológica
          </p>
        </div>
      </section>

      {/* Parallax Image 1 */}
      <div
        className="h-[60vh] bg-cover bg-center bg-fixed relative"
        style={{
          backgroundImage:
            'linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1532550907401-a500c9a57435?q=80&w=2000)',
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-4xl md:text-6xl font-serif text-white text-center px-6">
            &quot;Somos o que comemos&quot;
          </h2>
        </div>
      </div>

      {/* Introdução */}
      <section
        ref={(el) => {
          sectionRefs.current[1] = el;
        }}
        data-section="1"
        className={`py-32 relative transition-all duration-1000 ${
          visibleSections.has(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-xl md:text-2xl text-gray-300 font-serif leading-relaxed mb-8">
            Durante milhões de anos, nossos ancestrais evoluíram em harmonia com a natureza,
            alimentando-se de comida real: carne, órgãos, medula óssea, frutas selvagens e raízes.
          </p>
          <p className="text-xl md:text-2xl text-gray-300 font-serif leading-relaxed mb-8">
            Seus corpos eram fortes, seus dentes perfeitos, suas mentes afiadas. Não existiam
            doenças crônicas, obesidade ou depressão epidêmica.
          </p>
          <p className="text-xl md:text-2xl text-amber-600 font-serif leading-relaxed font-semibold">
            Mas algo mudou nos últimos 100 anos.
          </p>
        </div>
      </section>

      {/* Parallax Image 2 */}
      <div
        className="h-[60vh] bg-cover bg-center bg-fixed relative"
        style={{
          backgroundImage:
            'linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?q=80&w=2000)',
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-4xl md:text-6xl font-serif text-white text-center px-6">
            A Grande Traição Alimentar
          </h2>
        </div>
      </div>

      {/* Capítulo 1: Soberania Biológica */}
      <section
        ref={(el) => {
          sectionRefs.current[2] = el;
        }}
        data-section="2"
        className={`py-32 relative transition-all duration-1000 ${
          visibleSections.has(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-3xl mx-auto px-6">
          <div className="mb-8">
            <span className="text-amber-600 uppercase tracking-widest text-sm font-bold">
              Capítulo I
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-serif text-white mb-12">
            Soberania Biológica
          </h2>
          <p className="text-xl text-gray-300 font-serif leading-relaxed mb-8">
            A indústria alimentar moderna nos transformou em consumidores dóceis de ultraprocessados
            cheios de químicos, óleos vegetais inflamatórios e açúcar viciante.
          </p>
          <p className="text-xl text-gray-300 font-serif leading-relaxed mb-8">
            Perdemos nossa <span className="text-amber-600 font-semibold">soberania biológica</span>
            : o direito sagrado de alimentar nosso corpo com aquilo que ele foi projetado para
            consumir ao longo de milhões de anos de evolução.
          </p>
          <p className="text-xl text-gray-300 font-serif leading-relaxed">
            A reconquista começa aqui: recusando o veneno disfarçado de comida e voltando às nossas
            raízes ancestrais.
          </p>
        </div>
      </section>

      {/* Parallax Image 3 */}
      <div
        className="h-[60vh] bg-cover bg-center bg-fixed relative"
        style={{
          backgroundImage:
            'linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2000)',
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-4xl md:text-6xl font-serif text-white text-center px-6">
            Mentalidade Clássica
          </h2>
        </div>
      </div>

      {/* Capítulo 2: Mentalidade Clássica */}
      <section
        ref={(el) => {
          sectionRefs.current[3] = el;
        }}
        data-section="3"
        className={`py-32 relative transition-all duration-1000 ${
          visibleSections.has(3) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-3xl mx-auto px-6">
          <div className="mb-8">
            <span className="text-amber-600 uppercase tracking-widest text-sm font-bold">
              Capítulo II
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-serif text-white mb-12">
            Mentalidade Clássica
          </h2>
          <p className="text-xl text-gray-300 font-serif leading-relaxed mb-8">
            Os antigos gregos e romanos sabiam: <em>Mens sana in corpore sano</em> - uma mente sã
            em um corpo são.
          </p>
          <p className="text-xl text-gray-300 font-serif leading-relaxed mb-8">
            A nutrição ancestral não é apenas sobre saúde física. É sobre{' '}
            <span className="text-amber-600 font-semibold">clareza mental</span>,{' '}
            <span className="text-amber-600 font-semibold">força de vontade</span> e{' '}
            <span className="text-amber-600 font-semibold">disciplina</span>.
          </p>
          <p className="text-xl text-gray-300 font-serif leading-relaxed">
            Cultivamos uma mentalidade que rejeita o caminho fácil dos processados e abraça a
            excelência através da alimentação consciente.
          </p>
        </div>
      </section>

      {/* Capítulo 3: Clã e Honra */}
      <section
        ref={(el) => {
          sectionRefs.current[4] = el;
        }}
        data-section="4"
        className={`py-32 relative transition-all duration-1000 ${
          visibleSections.has(4) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-3xl mx-auto px-6">
          <div className="mb-8">
            <span className="text-amber-600 uppercase tracking-widest text-sm font-bold">
              Capítulo III
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-serif text-white mb-12">Clã e Honra</h2>
          <p className="text-xl text-gray-300 font-serif leading-relaxed mb-8">
            Nossos ancestrais viviam em tribos. A refeição era um{' '}
            <span className="text-amber-600 font-semibold">ritual sagrado</span> de conexão, não um
            ato solitário de consumo distraído.
          </p>
          <p className="text-xl text-gray-300 font-serif leading-relaxed mb-8">
            Na MADUA, você não está sozinho. Faz parte de uma{' '}
            <span className="text-amber-600 font-semibold">irmandade</span> de homens e mulheres
            que escolheram a excelência, que honram seus corpos e respeitam a sabedoria ancestral.
          </p>
          <p className="text-xl text-gray-300 font-serif leading-relaxed">
            Juntos, reconquistamos nossa força primordial.
          </p>
        </div>
      </section>

      {/* Capítulo 4: O Chamado */}
      <section
        ref={(el) => {
          sectionRefs.current[5] = el;
        }}
        data-section="5"
        className={`py-32 relative transition-all duration-1000 ${
          visibleSections.has(5) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-3xl mx-auto px-6">
          <div className="mb-8">
            <span className="text-amber-600 uppercase tracking-widest text-sm font-bold">
              Capítulo IV
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-serif text-white mb-12">O Chamado</h2>
          <p className="text-xl text-gray-300 font-serif leading-relaxed mb-8">
            Este não é um convite casual. É um chamado para aqueles que sentem, no fundo de sua
            alma, que algo está errado com o mundo moderno.
          </p>
          <p className="text-xl text-gray-300 font-serif leading-relaxed mb-8">
            Para aqueles que se recusam a ser mais um número nas estatísticas de obesidade,
            diabetes e depressão.
          </p>
          <p className="text-xl text-gray-300 font-serif leading-relaxed mb-8">
            Para aqueles que querem <span className="text-amber-600 font-semibold">recuperar</span>{' '}
            sua vitalidade, <span className="text-amber-600 font-semibold">reconquistar</span> sua
            força e <span className="text-amber-600 font-semibold">renascer</span> como a melhor
            versão de si mesmos.
          </p>
          <p className="text-2xl text-amber-600 font-serif leading-relaxed font-bold">
            O caminho é árduo, mas a recompensa é eterna.
          </p>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-32 relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-7xl font-serif text-white mb-8">
            Você está pronto?
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 font-serif mb-12 leading-relaxed">
            A jornada começa com uma única escolha consciente.
            <br />
            Juntar-se à irmandade dos que escolheram a excelência.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-3 px-12 py-6 bg-amber-600 text-black font-bold text-xl rounded-lg hover:bg-amber-500 transition-all shadow-2xl shadow-amber-600/50 hover:shadow-amber-600/70 hover:scale-105"
          >
            EU ACEITO O CHAMADO
            <Flame size={24} />
          </Link>
        </div>
      </section>
    </div>
  );
}
