import { Resend } from "resend";
import { render } from "@react-email/render";
import { WelcomeMaduaEmail } from "@/emails/WelcomeMadua";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not defined in environment variables");
}

const resend = new Resend(process.env.RESEND_API_KEY);

// Função para criar token de verificação
export async function createVerificationToken(email: string) {
  // Deletar tokens antigos para este e-mail
  await prisma.verificationToken.deleteMany({
    where: { identifier: email },
  });

  // Gerar token único
  const token = crypto.randomBytes(32).toString("hex");

  // Token expira em 24 horas
  const expires = new Date();
  expires.setHours(expires.getHours() + 24);

  // Criar novo token
  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  });

  return token;
}

interface SendVerificationEmailParams {
  email: string;
  verificationUrl: string;
  userName?: string;
}

export async function sendVerificationEmail({
  email,
  verificationUrl,
  userName,
}: SendVerificationEmailParams) {
  try {
    const html = render(
      WelcomeMaduaEmail({
        userEmail: email,
        verificationUrl,
        userName,
      })
    );

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Madua <onboarding@madua.com>",
      to: email,
      subject: "Convocatória Madua: Confirme a sua Lealdade.",
      html,
    });

    if (error) {
      console.error("Error sending verification email:", error);
      return { success: false, error };
    }

    console.log("Verification email sent successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send verification email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

interface SendWelcomeEmailParams {
  email: string;
  userName?: string;
}

export async function sendWelcomeEmail({
  email,
  userName,
}: SendWelcomeEmailParams) {
  try {
    const html = render(
      WelcomeMaduaEmail({
        userEmail: email,
        verificationUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
        userName,
      })
    );

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Madua <welcome@madua.com>",
      to: email,
      subject: "Bem-vindo ao Comando Madua",
      html,
    });

    if (error) {
      console.error("Error sending welcome email:", error);
      return { success: false, error };
    }

    console.log("Welcome email sent successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send welcome email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

interface SendPasswordResetEmailParams {
  email: string;
  resetUrl: string;
  userName?: string;
}

export async function sendPasswordResetEmail({
  email,
  resetUrl,
  userName,
}: SendPasswordResetEmailParams) {
  try {
    // Você pode criar um template separado para reset de senha
    // Por enquanto, usando o template de welcome adaptado
    const html = render(
      WelcomeMaduaEmail({
        userEmail: email,
        verificationUrl: resetUrl,
        userName,
      })
    );

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Madua <security@madua.com>",
      to: email,
      subject: "Madua: Recuperação de Acesso",
      html,
    });

    if (error) {
      console.error("Error sending password reset email:", error);
      return { success: false, error };
    }

    console.log("Password reset email sent successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
