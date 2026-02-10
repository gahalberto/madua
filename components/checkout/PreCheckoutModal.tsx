'use client';

import { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { createLeadAndCheckout } from '@/app/actions/checkout';

interface PreCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  destinationUrl: string | null;
}

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length === 0) return '';
  if (digits.length < 3) return `(${digits}`;
  if (digits.length < 8) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

export function PreCheckoutModal({ isOpen, onClose, destinationUrl }: PreCheckoutModalProps) {
  const searchParams = useSearchParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const utmParams = useMemo(() => {
    const params: Record<string, string> = {};
    if (!searchParams) return params;
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }, [searchParams]);

  if (!isOpen) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!destinationUrl) {
      setError('Destino de pagamento inválido.');
      return;
    }

    setSubmitting(true);
    const result = await createLeadAndCheckout({
      name,
      email,
      phone,
      destinationUrl,
      utm: utmParams,
    });

    if (result?.success && result.redirectUrl) {
      window.location.href = result.redirectUrl;
      return;
    }

    setError(result?.error || 'Não foi possível continuar.');
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-[#D4AF37] bg-[#050505] p-6 text-white shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">Pré-checkout</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-zinc-400 transition hover:text-white"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-zinc-300">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-black/60 px-4 py-3 text-white placeholder:text-zinc-500 focus:border-[#D4AF37] focus:outline-none"
              placeholder="Seu nome completo"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-black/60 px-4 py-3 text-white placeholder:text-zinc-500 focus:border-[#D4AF37] focus:outline-none"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">WhatsApp</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              className="w-full rounded-lg border border-zinc-700 bg-black/60 px-4 py-3 text-white placeholder:text-zinc-500 focus:border-[#D4AF37] focus:outline-none"
              placeholder="(11) 99999-9999"
              required
            />
          </div>

          {error && (
            <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full rounded-lg bg-[#D4AF37] px-4 py-3 text-center text-sm font-bold text-black transition hover:bg-[#C19F2F] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? 'Processando...' : 'IR PARA PAGAMENTO SEGURO'}
          </button>

          <p className="text-center text-xs text-zinc-500">
            Ao continuar, você concorda com nossos{' '}
            <a
              href="/termos"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D4AF37] hover:underline"
            >
              Termos de Uso
            </a>{' '}
            e{' '}
            <a
              href="/termos#privacidade"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D4AF37] hover:underline"
            >
              Política de Privacidade
            </a>.
            {' '}Seus dados estão protegidos pela honra do Clã.
          </p>
        </form>
      </div>
    </div>
  );
}
