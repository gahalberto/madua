import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST() {
  try {
    // Criar usuário demo se não existir
    const demoEmail = "demo@madua.com";
    
    const existingUser = await prisma.user.findUnique({
      where: { email: demoEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Usuário demo já existe" },
        { status: 200 }
      );
    }

    const hashedPassword = await bcrypt.hash("demo123", 10);

    const user = await prisma.user.create({
      data: {
        name: "Demo User",
        email: demoEmail,
        password: hashedPassword,
        role: "USER",
        emailVerified: new Date(),
      },
    });

    return NextResponse.json(
      { 
        message: "Usuário demo criado com sucesso",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Erro ao criar usuário demo" },
      { status: 500 }
    );
  }
}
