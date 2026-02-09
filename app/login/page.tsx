"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setError] = useState("");
  const [successMsg, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Verificar mensagens de URL
  useEffect(() => {
    const verified = searchParams.get("verified");
    const error = searchParams.get("error");

    if (verified === "true") {
      setSuccess("E-mail verificado com sucesso! Faça login para continuar.");
    } else if (error === "invalid_token") {
      setError("Link de verificação inválido.");
    } else if (error === "token_expired") {
      setError("Link de verificação expirado. Solicite um novo link.");
    } else if (error === "verification_failed") {
      setError("Erro ao verificar e-mail. Tente novamente.");
    } else if (error === "invalid_verification_link") {
      setError("Link de verificação inválido.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error === "EMAIL_NOT_VERIFIED") {
          setError("Confirme seu e-mail antes de entrar. Verifique a caixa de entrada e o spam.");
        } else {
          setError("Email ou senha inválidos");
        }
      } else if (result?.ok) {
        // Adicionar um pequeno delay para garantir que a sessão foi criada
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Verificar se a sessão foi criada com sucesso
        const sessionCheckRetries = 3;
        let sessionVerified = false;
        
        for (let i = 0; i < sessionCheckRetries; i++) {
          try {
            const sessionResponse = await fetch("/api/auth/session");
            if (sessionResponse.ok) {
              const session = await sessionResponse.json();
              if (session?.user?.email) {
                sessionVerified = true;
                break;
              }
            }
          } catch (err) {
            console.error("Session check failed:", err);
          }
          
          if (i < sessionCheckRetries - 1) {
            await new Promise(resolve => setTimeout(resolve, 300));
          }
        }
        
        if (sessionVerified) {
          // Usar router.push com refresh para forçar a atualização em produção
          await router.push("/dashboard");
          router.refresh();
        } else {
          setError("Falha ao criar sessão. Por favor, tente novamente.");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Ocorreu um erro. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#D4AF37] via-transparent to-transparent" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo e Branding */}
        <div className="text-center mb-10 sm:mb-12">
          <Link href="/" className="flex justify-center mb-6">
            <img
              src="/logo/logo-somente-simbolo.png"
              alt="MADUA Logo"
              className="w-48 sm:w-56 h-48 sm:h-56"
            />
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#D4AF37] mb-2">MADUA</h1>
          <p className="text-gray-400 text-sm sm:text-base">Reconquista da Neantropia</p>
        </div>

        {/* Login Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Entrar</h2>

          {successMsg && (
            <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-400">{successMsg}</p>
            </div>
          )}

          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-2">
              <XCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-gray-500 focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 transition-colors"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-12 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-gray-500 focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#D4AF37] hover:bg-[#C4A037] text-black font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-zinc-900 text-gray-500">ou</span>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-sm text-gray-400">
              Não tem uma conta?{" "}
              <a href="/register" className="text-[#D4AF37] hover:text-[#C4A037] font-semibold transition-colors">
                Criar conta
              </a>
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
          <p className="text-xs font-semibold text-gray-400 mb-2">Credenciais de Demo:</p>
          <p className="text-xs text-gray-500">Email: demo@madua.com</p>
          <p className="text-xs text-gray-500">Senha: demo123</p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505] flex items-center justify-center"><p className="text-white">Carregando...</p></div>}>
      <LoginForm />
    </Suspense>
  );
}
