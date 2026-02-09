"use client";

import { motion } from "framer-motion";
import { 
  Check, 
  Shield, 
  Flame, 
  Skull, 
  Crown, 
  Swords,
  Trophy,
  Lock,
  TrendingUp,
  Users,
  BookOpen,
  ChefHat,
  Zap
} from "lucide-react";
export default function AssinaturaPage() {
  const fadeUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-[#050505] z-10" />
        
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#D4AF37_1px,_transparent_1px)] bg-[length:50px_50px]" />
        </div>

        <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center mb-6">
              <Flame className="w-16 h-16 text-[#D4AF37]" />
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold mb-6 tracking-tight leading-none">
              RECUPERE A<br />
              <span className="text-[#D4AF37]">SOBERANIA</span><br />
              DO SEU SANGUE.
            </h1>

            <p className="text-xl sm:text-2xl md:text-3xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              A plataforma definitiva para homens e mulheres que{" "}
              <span className="text-[#D4AF37] font-semibold">recusam a fragilidade moderna</span>.
              <br className="hidden sm:block" />
              Acesso total a protocolos de testosterona, nutrição ancestral e a comunidade Madua.
            </p>

            <motion.a
              href="#oferta"
              className="inline-flex items-center gap-3 bg-[#D4AF37] hover:bg-[#C19F2F] text-black font-bold text-lg sm:text-xl px-8 sm:px-12 py-5 sm:py-6 rounded-lg transition-all duration-300 shadow-2xl hover:shadow-[#D4AF37]/50 hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Crown className="w-6 h-6" />
              Garantir Acesso Antecipado
            </motion.a>

            <p className="mt-6 text-gray-500 text-sm">
              <Shield className="w-4 h-4 inline mr-2" />
              7 dias de garantia incondicional
            </p>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 border-2 border-[#D4AF37] rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-[#D4AF37] rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* O ARSENAL - O QUE ESTÁ INCLUSO */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#050505] to-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            {...fadeUp}
            className="text-center mb-16"
          >
            <Swords className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold mb-6">
              O ARSENAL
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Tudo o que você precisa para reconquistar sua biologia.
              <br />Um valor absurdamente maior que o preço.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: TrendingUp,
                title: "Curso: Testo 1K",
                description: "Protocolo completo para aumentar naturalmente sua testosterona e virilidade. Descubra os segredos que a indústria farmacêutica esconde.",
                value: "R$ 497"
              },
              {
                icon: Flame,
                title: "Protocolo Vida Ancestral",
                description: "Saia da inflamação crônica. Recupere sua energia, clareza mental e vitalidade ancestral em 30 dias.",
                value: "R$ 397"
              },
              {
                icon: ChefHat,
                title: "+200 Receitas Ancestrais",
                description: "O livro digital definitivo da culinária Neantrópica. De café da manhã a jantar, tudo que você precisa saber.",
                value: "R$ 197"
              },
              {
                icon: BookOpen,
                title: "Guia Alimentação Ancestral",
                description: "O que comer, o que evitar, quando jejuar. O manual de guerra biológica completo.",
                value: "R$ 147"
              },
              {
                icon: Users,
                title: "Acesso à Comunidade",
                description: "Junte-se ao Clã. Homens e mulheres comprometidos com a excelência biológica. Suporte 24/7.",
                value: "Inestimável"
              },
              {
                icon: Trophy,
                title: "Atualizações Mensais",
                description: "Novos protocolos, receitas e conteúdos exclusivos todo mês. Evolução contínua garantida.",
                value: "Incluso"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 hover:border-[#D4AF37] p-8 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#D4AF37]/20"
              >
                <item.icon className="w-12 h-12 text-[#D4AF37] mb-4" />
                <h3 className="text-2xl font-serif font-bold mb-3">{item.title}</h3>
                <p className="text-gray-400 mb-4 leading-relaxed">{item.description}</p>
                <div className="text-[#D4AF37] font-bold text-lg border-t border-zinc-800 pt-4">
                  Valor: {item.value}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <div className="inline-block bg-zinc-900 border-2 border-[#D4AF37] px-8 py-4 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">VALOR TOTAL DO ARSENAL:</p>
              <p className="text-4xl font-serif font-bold text-[#D4AF37]">
                Mais de R$ 1.200
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* A DOR - O INIMIGO */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_#D4AF37_0%,_transparent_50%)] opacity-5" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            {...fadeUp}
            className="text-center mb-16"
          >
            <Skull className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold mb-6">
              O SISTEMA QUER VOCÊ FRACO
            </h2>
            <p className="text-2xl text-gray-400 max-w-3xl mx-auto italic">
              &ldquo;Não estamos doentes. Estamos envenenados.&rdquo;
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mt-16">
            {/* VIDA MODERNA (ENTROPIA) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-red-950/20 border-2 border-red-800 p-8 rounded-xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-900 rounded-full flex items-center justify-center">
                  <Skull className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-red-400">VIDA MODERNA</h3>
              </div>
              
              <ul className="space-y-3">
                {[
                  "Testosterona em queda livre",
                  "Inflamação crônica e dor constante",
                  "Dependência de remédios",
                  "Obesidade e diabetes tipo 2",
                  "Depressão e ansiedade epidêmica",
                  "Fragilidade mental e física",
                  "Impotência e libido zero",
                  "Envelhecimento acelerado"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300">
                    <span className="text-red-500 mt-1">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* VIDA MADUA (NEANTROPIA) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#D4AF37]/10 border-2 border-[#D4AF37] p-8 rounded-xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center">
                  <Flame className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-[#D4AF37]">VIDA MADUA</h3>
              </div>
              
              <ul className="space-y-3">
                {[
                  "Testosterona naturalmente otimizada",
                  "Corpo anti-inflamatório e resiliente",
                  "Zero dependência química",
                  "Corpo enxuto e metabolismo de fogo",
                  "Clareza mental e foco inabalável",
                  "Força física e mental dominante",
                  "Virilidade e magnetismo sexual",
                  "Longevidade com qualidade"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300">
                    <Check className="text-[#D4AF37] mt-1 flex-shrink-0" size={20} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-2xl text-gray-300 mt-12 font-serif"
          >
            A Madua é a sua saída. <span className="text-[#D4AF37]">A escolha é sua.</span>
          </motion.p>
        </div>
      </section>

      {/* A OFERTA - PRICING */}
      <section id="oferta" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-[#050505]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            {...fadeUp}
            className="text-center mb-16"
          >
            <Crown className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold mb-6">
              ESCOLHA SEU CAMINHO
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Menos de R$ 1 por dia para transformar completamente sua biologia.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* PLANO MENSAL */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 relative"
            >
              <div className="mb-8">
                <h3 className="text-2xl font-serif font-bold mb-2">Mensal</h3>
                <p className="text-gray-400">O básico para começar</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-bold">R$ 39</span>
                  <span className="text-2xl text-gray-400">,90</span>
                  <span className="text-gray-500">/mês</span>
                </div>
                <p className="text-sm text-gray-500">Cobrado mensalmente</p>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  "Acesso a todos os cursos",
                  "200+ Receitas Ancestrais",
                  "Guia de Alimentação",
                  "Comunidade Madua",
                  "Atualizações mensais",
                  "Suporte prioritário"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="text-[#D4AF37] mt-1 flex-shrink-0" size={20} />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>

              <a
                href="https://pay.kiwify.com.br/jm0otJD"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-lg py-4 rounded-lg transition-all duration-300 text-center"
              >
                Assinar Mensal
              </a>
            </motion.div>

            {/* PLANO ANUAL - DESTAQUE */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#D4AF37]/20 to-black border-2 border-[#D4AF37] rounded-2xl p-8 relative shadow-2xl shadow-[#D4AF37]/30 md:scale-105"
            >
              {/* Badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-[#D4AF37] text-black font-bold px-6 py-2 rounded-full text-sm whitespace-nowrap flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  MAIS ESCOLHIDO PELA COMUNIDADE
                </div>
              </div>

              <div className="mb-8 mt-4">
                <h3 className="text-2xl font-serif font-bold mb-2 text-[#D4AF37]">
                  Anual - A Escolha da Honra
                </h3>
                <p className="text-gray-400">Compromisso total com a transformação</p>
              </div>

              <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-gray-500 line-through text-xl">R$ 478,80</span>
                  <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                    -39%
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-6xl font-bold text-[#D4AF37]">R$ 290</span>
                  <span className="text-gray-400">/ano</span>
                </div>
                <p className="text-[#D4AF37] font-semibold">
                  Equivalente a R$ 24,16/mês
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  <Zap className="w-4 h-4 inline mr-1" />
                  Menos de R$ 1 por dia
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  "✨ Tudo do plano mensal",
                  "🔥 Economia de quase 40%",
                  "👑 Badge exclusivo na comunidade",
                  "⚡ Acesso prioritário a novos cursos",
                  "🎯 Sessão de análise personalizada",
                  "💎 Conteúdos VIP exclusivos"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>

              <a
                href="https://pay.kiwify.com.br/Gz4KLbl"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-[#D4AF37] hover:bg-[#C19F2F] text-black font-bold text-xl py-5 rounded-lg transition-all duration-300 text-center shadow-lg hover:shadow-[#D4AF37]/50 hover:scale-105 flex items-center justify-center gap-3"
              >
                <Crown className="w-6 h-6" />
                Entrar para a Madua (Anual)
              </a>

              <p className="text-center text-sm text-gray-400 mt-4 italic">
                &ldquo;Menos de 1 real por dia para salvar sua biologia.&rdquo;
              </p>
            </motion.div>
          </div>

          {/* Garantia */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <div className="inline-flex items-center gap-3 bg-green-950/30 border border-green-700 px-8 py-4 rounded-lg">
              <Shield className="w-8 h-8 text-green-500" />
              <div className="text-left">
                <p className="font-bold text-green-400">Garantia de 7 Dias</p>
                <p className="text-sm text-gray-400">Risco zero. Testou e não gostou? Devolvemos 100% do seu dinheiro.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-4xl mx-auto">
          <motion.div
            {...fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-serif font-bold mb-6">
              Perguntas Frequentes
            </h2>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                q: "A Madua serve para mulheres?",
                a: "Absolutamente. Os protocolos ancestrais funcionam para ambos os sexos. Mulheres também sofrem com a modernidade tóxica - inflamação, desequilíbrio hormonal, fadiga. A Madua oferece o caminho de volta à saúde feminina ancestral."
              },
              {
                q: "Preciso saber cozinhar?",
                a: "Não. As 200+ receitas são extremamente simples e diretas. Se você consegue fritar um ovo, consegue fazer qualquer receita Madua. Simplicidade ancestral é o nosso lema."
              },
              {
                q: "Como acesso o conteúdo após o pagamento?",
                a: "Imediatamente após a confirmação do pagamento, você recebe um email com suas credenciais de acesso. Entre na plataforma e todo o arsenal estará disponível instantaneamente."
              },
              {
                q: "Posso cancelar quando quiser?",
                a: "Sim. Sem contratos, sem pegadinhas. Cancele quando quiser diretamente na plataforma. Mas duvido que você queira sair depois de sentir a transformação."
              },
              {
                q: "É seguro? Como funciona o pagamento?",
                a: "100% seguro. Processamos pagamentos via Kiwify, uma das maiores plataformas de pagamento do Brasil. Seus dados estão protegidos com criptografia de nível bancário."
              },
              {
                q: "Qual a diferença entre os planos?",
                a: "Ambos oferecem acesso completo a todo o arsenal Madua. A diferença está no compromisso: o plano anual oferece economia de 39% e benefícios VIP exclusivos para quem está 100% comprometido com a transformação."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg"
              >
                <h3 className="text-xl font-bold mb-3 text-[#D4AF37]">{faq.q}</h3>
                <p className="text-gray-400 leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-t from-black to-[#050505]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Flame className="w-16 h-16 text-[#D4AF37] mx-auto mb-6" />
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold mb-6">
              A ESCOLHA É SUA
            </h2>
            <p className="text-2xl text-gray-400 mb-12 leading-relaxed">
              Continue na espiral descendente da modernidade.<br />
              Ou recupere o que é seu por direito ancestral.
            </p>

            <a
              href="https://pay.kiwify.com.br/Gz4KLbl"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#D4AF37] hover:bg-[#C19F2F] text-black font-bold text-xl px-12 py-6 rounded-lg transition-all duration-300 shadow-2xl hover:shadow-[#D4AF37]/50 hover:scale-105"
            >
              <Crown className="w-6 h-6" />
              Entrar para a Madua Agora
            </a>

            <p className="mt-8 text-gray-500 text-sm">
              <Lock className="w-4 h-4 inline mr-2" />
              Pagamento 100% seguro via Kiwify
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
