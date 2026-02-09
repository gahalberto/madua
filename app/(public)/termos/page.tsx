export default function TermosPage() {
  return (
    <div className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-bold text-foreground mb-8">
          Termos de Uso
        </h1>
        
        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">1. Aceitação dos Termos</h2>
            <p className="text-foreground-muted">
              Ao acessar e usar a plataforma MADUA, você concorda com estes Termos de Uso. 
              Se você não concorda com qualquer parte destes termos, não deve usar nossos serviços.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">2. Uso da Plataforma</h2>
            <p className="text-foreground-muted mb-4">
              A plataforma MADUA destina-se ao uso pessoal e não comercial. Você concorda em:
            </p>
            <ul className="space-y-2 text-foreground-muted">
              <li className="flex items-start">
                <span className="text-accent mr-2">•</span>
                Fornecer informações precisas e atualizadas durante o registro
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-2">•</span>
                Manter a confidencialidade de suas credenciais de acesso
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-2">•</span>
                Não compartilhar ou revender acesso ao conteúdo da plataforma
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-2">•</span>
                Usar a plataforma de forma legal e respeitosa
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">3. Conteúdo</h2>
            <p className="text-foreground-muted">
              Todo o conteúdo disponibilizado na plataforma MADUA, incluindo receitas, artigos, 
              vídeos e materiais didáticos, é protegido por direitos autorais e propriedade intelectual. 
              É proibida a reprodução, distribuição ou uso comercial sem autorização prévia.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">4. Assinaturas e Pagamentos</h2>
            <p className="text-foreground-muted">
              As assinaturas são cobradas de acordo com o plano escolhido. Os pagamentos são processados 
              através de plataformas seguras de terceiros. O cancelamento pode ser feito a qualquer momento, 
              mas não haverá reembolso proporcional do período já pago.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">5. Isenção de Responsabilidade Médica</h2>
            <p className="text-foreground-muted">
              As informações fornecidas na plataforma MADUA são apenas para fins educacionais e não 
              substituem orientação médica profissional. Consulte sempre um profissional de saúde 
              qualificado antes de fazer mudanças significativas em sua dieta ou estilo de vida.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">6. Privacidade</h2>
            <p className="text-foreground-muted">
              Respeitamos sua privacidade e protegemos seus dados pessoais de acordo com as leis aplicáveis. 
              Consulte nossa Política de Privacidade para mais informações sobre como coletamos, usamos e 
              protegemos suas informações.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">7. Modificações dos Termos</h2>
            <p className="text-foreground-muted">
              Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão 
              em vigor imediatamente após a publicação na plataforma. O uso continuado dos serviços após 
              as modificações constitui aceitação dos novos termos.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">8. Contato</h2>
            <p className="text-foreground-muted">
              Para questões sobre estes Termos de Uso, entre em contato conosco através do email: 
              <span className="text-accent"> contato@madua.com</span>
            </p>
          </section>

          <div className="mt-12 pt-8 border-t border-[#1F1F1F]">
            <p className="text-foreground-muted text-sm">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
