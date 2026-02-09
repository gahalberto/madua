import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendVerificationEmail, createVerificationToken } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const { name, email, password, phone, birthDate } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nome, email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "A senha deve ter no mínimo 6 caracteres" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email já cadastrado" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        birthDate: birthDate ? new Date(birthDate) : null,
      },
    });

    // Criar token de verificação
    const token = await createVerificationToken(email);

    // Criar URL de verificação
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

    // Enviar e-mail de verificação
    const emailResult = await sendVerificationEmail({
      email,
      verificationUrl,
      userName: name,
    });

    if (!emailResult.success) {
      console.error("Failed to send verification email:", emailResult.error);
      // Não falhar o registro se o e-mail não for enviado
    }

    return NextResponse.json(
      { 
        message: "Usuário criado com sucesso. Verifique seu e-mail para ativar a conta.",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        emailSent: emailResult.success,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Erro ao criar usuário" },
      { status: 500 }
    );
  }
}
