import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import * as React from "react";

interface WelcomeMaduaEmailProps {
  userEmail: string;
  verificationUrl: string;
  userName?: string;
}

export const WelcomeMaduaEmail = ({
  userEmail,
  verificationUrl,
  userName,
}: WelcomeMaduaEmailProps) => {
  const previewText = "A desordem recuou. O seu lugar na resistência aguarda.";

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-[#050505] font-sans">
          <Container className="mx-auto py-12 px-4 max-w-[600px]">
            {/* Logo */}
            <Section className="text-center mb-12">
              <Img
                src={`${process.env.NEXT_PUBLIC_APP_URL}/logo/logo-madua.png`}
                alt="Madua"
                className="mx-auto"
                width="120"
                height="120"
              />
            </Section>

            {/* Linha Decorativa Superior */}
            <Section className="mb-8">
              <div
                style={{
                  borderTop: "2px solid #D4AF37",
                  width: "60px",
                  margin: "0 auto",
                }}
              />
            </Section>

            {/* Título Principal */}
            <Heading
              className="text-[#D4AF37] text-center text-4xl font-serif font-bold mb-8 leading-tight tracking-wide"
              style={{
                fontFamily: "'Georgia', 'Times New Roman', serif",
              }}
            >
              BEM-VINDO À RESISTÊNCIA
            </Heading>

            {/* Saudação Personalizada */}
            {userName && (
              <Text className="text-[#F5F5F5] text-center text-xl mb-6">
                {userName},
              </Text>
            )}

            {/* Corpo do E-mail */}
            <Text className="text-[#F5F5F5] text-base leading-relaxed mb-6 text-center px-4">
              Você deu o primeiro passo para sair do sistema e recuperar a sua
              soberania biológica.
            </Text>

            <Text className="text-[#F5F5F5] text-base leading-relaxed mb-6 text-center px-4">
              A sociedade moderna quer você fraco, inflamado e dependente. Ao
              criar esta conta, você escolheu o caminho oposto:{" "}
              <span className="text-[#D4AF37] font-bold">a Neantropia</span>.
            </Text>

            <Text className="text-[#F5F5F5] text-base leading-relaxed mb-8 text-center px-4">
              Para ativar o seu acesso ao Comando e começar a consumir os
              protocolos, confirme que este canal de comunicação é seguro.
            </Text>

            {/* Botão CTA */}
            <Section className="text-center mb-8">
              <Button
                href={verificationUrl}
                className="bg-[#D4AF37] text-black font-bold text-base px-12 py-4 rounded-lg no-underline inline-block"
                style={{
                  backgroundColor: "#D4AF37",
                  color: "#000000",
                  padding: "16px 48px",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  fontSize: "16px",
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                ATIVAR MINHA CONTA AGORA
              </Button>
            </Section>

            {/* Link alternativo (caso o botão não funcione) */}
            <Text className="text-[#888888] text-sm text-center mb-8 px-4">
              Se o botão não funcionar, copie e cole este link no navegador:
              <br />
              <a
                href={verificationUrl}
                className="text-[#D4AF37] underline break-all"
                style={{ color: "#D4AF37" }}
              >
                {verificationUrl}
              </a>
            </Text>

            {/* Linha Decorativa Inferior */}
            <Section className="mb-8">
              <div
                style={{
                  borderTop: "1px solid #333333",
                  width: "100%",
                  margin: "0 auto",
                }}
              />
            </Section>

            {/* Rodapé */}
            <Text className="text-[#888888] text-sm text-center leading-relaxed px-4 mb-4">
              Se você não solicitou este acesso, ignore este e-mail.
              <br />
              O sistema continuará a sua busca por outros.
            </Text>

            <Text className="text-[#666666] text-xs text-center px-4 mb-4">
              Este link é válido por 24 horas e expirará após o uso.
            </Text>

            {/* Assinatura */}
            <Section className="text-center mt-8">
              <Text className="text-[#D4AF37] text-sm font-bold mb-2">
                MADUA
              </Text>
              <Text className="text-[#888888] text-xs">
                Soberania Biológica · Neantropia · Resistência
              </Text>
            </Section>

            {/* Informação Legal */}
            <Section className="mt-12 pt-8 border-t border-[#333333]">
              <Text className="text-[#666666] text-xs text-center px-4">
                Este e-mail foi enviado para{" "}
                <span className="text-[#888888]">{userEmail}</span>
                <br />
                Madua © 2026 · Todos os direitos reservados
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default WelcomeMaduaEmail;
