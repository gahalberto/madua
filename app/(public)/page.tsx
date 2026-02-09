'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Flame, Zap, Shield, Users, Book, Video, Utensils, MessageCircle } from 'lucide-react';

export default function HomePage() {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.65, 0, 0.35, 1] as const } },
  };

  const stagger = {
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="bg-[#050505] overflow-hidden">
      {/* SEÇÃO A: HERO */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Background Image com Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=2000"
            alt="Hero Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-[#050505]" />
        </div>

        {/* Conteúdo */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center"
        >
          <motion.h1
            variants={fadeUp}
            className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-[#F5F5F5] mb-6 sm:mb-8 leading-tight tracking-tight"
          >
            NÓS NÃO ESTAMOS DOENTES.
            <br />
            <span className="text-[#D4AF37]">ESTAMOS ENVENENADOS.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-10 sm:mb-12 leading-relaxed"
          >
            Recupere sua soberania biológica, sua clareza mental e a honra do seu clã.
            <br />
            <span className="text-[#D4AF37] font-semibold">Bem-vindo à Neantropia.</span>
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
            <Link
              href="/register"
              className="group w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-[#D4AF37] text-black font-bold text-base sm:text-lg rounded-lg hover:bg-[#C4A037] transition-all shadow-2xl shadow-[#D4AF37]/50 hover:shadow-[#D4AF37]/70 hover:scale-105 text-center"
            >
              JUNTE-SE À RESISTÊNCIA
            </Link>
            <Link
              href="/sobre"
              className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-transparent border-2 border-[#D4AF37] text-[#D4AF37] font-bold text-base sm:text-lg rounded-lg hover:bg-[#D4AF37]/10 transition-all text-center"
            >
              LER O MANIFESTO
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-px h-16 bg-gradient-to-b from-[#D4AF37] to-transparent" />
        </motion.div>
      </section>

      {/* SEÇÃO B: O PROBLEMA (ENTROPIA) */}
      <section className="py-20 sm:py-24 lg:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Texto */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeUp}
            >
              <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#F5F5F5] mb-6 sm:mb-8 leading-tight">
                A modernidade prometeu conforto,
                <br />
                <span className="text-red-600">mas entregou fragilidade.</span>
              </h2>
              <div className="space-y-5 sm:space-y-6 text-base sm:text-lg text-gray-400 leading-relaxed">
                <p>
                  Dopamina barata de redes sociais. Comida ultraprocessada disfarçada de nutrição.
                  Corpos fracos viciados em açúcar e conforto.
                </p>
                <p>
                  Homens sem propósito. Mulheres sem proteção. Crianças sem raízes. Famílias
                  desintegradas.
                </p>
                <p className="text-[#D4AF37] font-semibold text-lg sm:text-xl">
                  Esta é a entropia: a dissolução lenta e silenciosa da ordem humana.
                </p>
              </div>
            </motion.div>

            {/* Imagem */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative h-[320px] sm:h-[420px] lg:h-[600px] rounded-2xl overflow-hidden"
            >
              <Image
                src="https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?q=80&w=1000"
                alt="Entropia Moderna"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/60 to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* SEÇÃO C: OS TRÊS PILARES */}
      <section className="py-20 sm:py-24 lg:py-32 relative bg-gradient-to-b from-[#050505] via-zinc-950 to-[#050505]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-12 sm:mb-16 lg:mb-20"
          >
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#F5F5F5] mb-4 sm:mb-6">
              Os Três <span className="text-[#D4AF37]">Pilares</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
              A fundação da Neantropia: o caminho de volta à ordem.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
          >
            {/* Pilar 1 */}
            <motion.div
              variants={fadeUp}
              className="group relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 lg:p-10 hover:border-[#D4AF37]/50 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="mb-6 inline-flex p-4 bg-[#D4AF37]/10 rounded-xl">
                  <Flame className="text-[#D4AF37]" size={40} />
                </div>
                <h3 className="font-serif text-3xl text-[#F5F5F5] mb-4">
                  A Soberania
                  <br />
                  Biológica
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  O corpo é instrumento de ação. Jejum, Nutrição Ancestral e Força. Recupere seu
                  direito de decidir o que entra no seu organismo.
                </p>
              </div>
            </motion.div>

            {/* Pilar 2 */}
            <motion.div
              variants={fadeUp}
              className="group relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 lg:p-10 hover:border-[#D4AF37]/50 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="mb-6 inline-flex p-4 bg-[#D4AF37]/10 rounded-xl">
                  <Shield className="text-[#D4AF37]" size={40} />
                </div>
                <h3 className="font-serif text-3xl text-[#F5F5F5] mb-4">
                  A Mentalidade
                  <br />
                  Clássica
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Foco, Silêncio e Estoicismo. O domínio das emoções para liderar. Cultive a
                  disciplina dos antigos filósofos.
                </p>
              </div>
            </motion.div>

            {/* Pilar 3 */}
            <motion.div
              variants={fadeUp}
              className="group relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 lg:p-10 hover:border-[#D4AF37]/50 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="mb-6 inline-flex p-4 bg-[#D4AF37]/10 rounded-xl">
                  <Users className="text-[#D4AF37]" size={40} />
                </div>
                <h3 className="font-serif text-3xl text-[#F5F5F5] mb-4">
                  O Clã e
                  <br />a Honra
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Homens que protegem, Mulheres que nutrem. A família como unidade blindada. Reconstrua
                  o tecido social.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SEÇÃO D: O ARSENAL (FERRAMENTAS) */}
      <section className="py-20 sm:py-24 lg:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-12 sm:mb-16 lg:mb-20"
          >
            <div className="mb-6 inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full">
              <Zap className="text-[#D4AF37]" size={20} />
              <span className="text-[#D4AF37] font-bold text-sm uppercase tracking-wider">
                As Armas da Ordem
              </span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#F5F5F5] mb-4 sm:mb-6">
              O <span className="text-[#D4AF37]">Arsenal</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
              Ferramentas práticas para reconquistar seu corpo, mente e família.
            </p>
          </motion.div>

          {/* Bento Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6"
          >
            {/* Card 1 - Grande */}
            <motion.div
              variants={fadeUp}
              className="lg:col-span-2 lg:row-span-2 relative group bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-[#D4AF37]/50 transition-all"
            >
              <div className="relative h-full min-h-[320px] sm:min-h-[400px]">
                <Image
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000"
                  alt="Receitas Ancestrais"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <Utensils className="text-[#D4AF37] mb-4" size={40} />
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#F5F5F5] mb-3">
                    100+ Receitas Ancestrais
                  </h3>
                  <p className="text-gray-400">
                    Caldo de ossos, fermentados, vísceras. Comida real que reconstrói seu corpo.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              variants={fadeUp}
              className="relative group bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-[#D4AF37]/50 transition-all min-h-[160px] sm:min-h-[180px]"
            >
              <div className="p-6 sm:p-8">
                <Book className="text-[#D4AF37] mb-4" size={32} />
                <h3 className="text-xl font-bold text-[#F5F5F5] mb-2">Cursos Completos</h3>
                <p className="text-sm text-gray-400">Protocolos passo a passo</p>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              variants={fadeUp}
              className="relative group bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-[#D4AF37]/50 transition-all min-h-[160px] sm:min-h-[180px]"
            >
              <div className="p-6 sm:p-8">
                <Video className="text-[#D4AF37] mb-4" size={32} />
                <h3 className="text-xl font-bold text-[#F5F5F5] mb-2">Vlogs da Selva</h3>
                <p className="text-sm text-gray-400">Conteúdo sem filtro</p>
              </div>
            </motion.div>

            {/* Card 4 */}
            <motion.div
              variants={fadeUp}
              className="lg:col-span-2 relative group bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-[#D4AF37]/50 transition-all min-h-[160px] sm:min-h-[180px]"
            >
              <div className="p-6 sm:p-8">
                <MessageCircle className="text-[#D4AF37] mb-4" size={32} />
                <h3 className="text-2xl font-bold text-[#F5F5F5] mb-2">Comunidade Exclusiva</h3>
                <p className="text-gray-400">
                  Junte-se a homens e mulheres na mesma missão. Apoio, trocas e accountability.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SEÇÃO E: SOCIAL PROOF */}
      <section className="py-20 sm:py-24 lg:py-32 relative bg-gradient-to-b from-[#050505] via-zinc-950 to-[#050505]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-12 sm:mb-16 lg:mb-20"
          >
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#F5F5F5] mb-4 sm:mb-6">
              Quem já saiu <span className="text-[#D4AF37]">do Sistema</span>
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
          >
            {[
              {
                text: 'Recuperei minha testosterona naturalmente. Me sinto um homem de verdade novamente.',
                author: 'Paulo R.',
                role: '38 anos',
              },
              {
                text: 'Minha família parou de adoecer. As crianças nunca tiveram tanta energia.',
                author: 'Mariana S.',
                role: 'Mãe de 3',
              },
              {
                text: 'Perdi 25kg sem contar calorias. A clareza mental é assustadora.',
                author: 'Ricardo L.',
                role: '42 anos',
              },
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8"
              >
                <p className="text-base sm:text-lg text-gray-300 mb-6 italic leading-relaxed">
                  &quot;{testimonial.text}&quot;
                </p>
                <div className="border-t border-zinc-800 pt-4">
                  <p className="text-[#F5F5F5] font-bold">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SEÇÃO F: FOOTER CTA */}
      <section className="py-24 sm:py-32 lg:py-40 relative bg-black">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="max-w-4xl mx-auto px-4 sm:px-6 text-center"
        >
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#F5F5F5] mb-6 sm:mb-8 leading-tight">
            A Selva não perdoa a fraqueza.
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-400 mb-10 sm:mb-12">
            Você vai continuar negociando com a mediocridade?
          </p>
          <Link
            href="/register"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-3 px-8 sm:px-10 md:px-12 py-5 sm:py-6 bg-[#D4AF37] text-black font-black text-base sm:text-lg md:text-xl uppercase tracking-wider rounded-lg hover:bg-[#C4A037] transition-all shadow-2xl shadow-[#D4AF37]/50 hover:shadow-[#D4AF37]/70 hover:scale-105"
          >
            INICIAR A RECONQUISTA AGORA
            <Flame size={28} />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
