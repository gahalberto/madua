"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, Mail, User, Eye, EyeOff, Phone, Calendar, CheckCircle } from "lucide-react";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import './phone-input.css';

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          name, 
          email, 
          password,
          phone: phone || undefined,
          birthDate: birthDate || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erro ao criar conta");
      } else {
        setSuccess(true);
        // Não redireciona imediatamente, mostra mensagem de verificação
      }
    } catch {
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

        {/* Register Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Criar Conta</h2>

          {success ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">
                Conta Criada com Sucesso!
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Enviamos um e-mail de verificação para{" "}
                <span className="text-[#D4AF37] font-semibold">{email}</span>.
                <br />
                <br />
                Verifique sua caixa de entrada (e spam) e clique no link para
                ativar sua conta na Madua.
              </p>
              <Link
                href="/login"
                className="inline-block px-6 py-3 bg-[#D4AF37] hover:bg-[#C4A037] text-black font-bold rounded-lg transition-colors"
              >
                Ir para Login
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Nome
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-gray-500 focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 transition-colors"
                />
              </div>
            </div>

            {/* Phone Input */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                Telefone (WhatsApp)
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600 z-10 pointer-events-none" />
                <PhoneInput
                  international
                  defaultCountry="BR"
                  value={phone}
                  onChange={(value) => setPhone(value || "")}
                  placeholder="(11) 98765-4321"
                  className="phone-input"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Opcional - Para contato via WhatsApp</p>
            </div>

            {/* Birth Date Input */}
            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-gray-300 mb-2">
                Data de Nascimento
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600" />
                <input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-gray-500 focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 transition-colors"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Opcional</p>
            </div>

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
                  minLength={6}
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
              <p className="mt-1 text-xs text-gray-500">Mínimo de 6 caracteres</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#D4AF37] hover:bg-[#C4A037] text-black font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? "Criando conta..." : "Criar Conta"}
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

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-gray-400">
              Já tem uma conta?{" "}
              <a href="/login" className="text-[#D4AF37] hover:text-[#C4A037] font-semibold transition-colors">
                Entrar
              </a>
            </p>
          </div>
          </>
          )}
        </div>
      </div>
    </div>
  );
}
