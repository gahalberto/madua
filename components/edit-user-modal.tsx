'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { updateUser } from '@/app/actions/users';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

interface EditUserModalProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    phone: string | null;
    birthDate: Date | null;
    gender: string | null;
    role: string;
    subscriptionStatus: string;
  };
  onClose: () => void;
  onSuccess: () => void;
}

export function EditUserModal({ user, onClose, onSuccess }: EditUserModalProps) {
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || '');
  const [birthDate, setBirthDate] = useState(
    user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : ''
  );
  const [gender, setGender] = useState(user.gender || '');
  const [role, setRole] = useState(user.role);
  const [subscriptionStatus, setSubscriptionStatus] = useState(user.subscriptionStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await updateUser(user.id, {
        name,
        email,
        phone: phone || null,
        birthDate: birthDate || null,
        gender: gender || null,
        role,
        subscriptionStatus,
      });

      if (result.success) {
        onSuccess();
        onClose();
      } else {
        setError(result.error || 'Erro ao atualizar usuário');
      }
    } catch {
      setError('Erro ao atualizar usuário');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-[#1A1F2E] rounded-xl border border-zinc-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <h2 className="text-2xl font-bold text-white">Editar Usuário</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Nome
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#0A0A0A] border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#0A0A0A] border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Telefone (WhatsApp)
            </label>
            <PhoneInput
              international
              defaultCountry="BR"
              value={phone}
              onChange={(value) => setPhone(value || '')}
              className="phone-input-modal"
            />
          </div>

          {/* Birth Date */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Data de Nascimento
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 bg-[#0A0A0A] border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Gênero
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-4 py-3 bg-[#0A0A0A] border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="">Não informado</option>
              <option value="MALE">Masculino</option>
              <option value="FEMALE">Feminino</option>
              <option value="PREFER_NOT_TO_SAY">Prefiro não dizer</option>
            </select>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Permissão
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 bg-[#0A0A0A] border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="USER">Usuário</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>

          {/* Subscription Status */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Status de Assinatura
            </label>
            <select
              value={subscriptionStatus}
              onChange={(e) => setSubscriptionStatus(e.target.value)}
              className="w-full px-4 py-3 bg-[#0A0A0A] border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="ACTIVE">Ativo</option>
              <option value="INACTIVE">Inativo</option>
              <option value="CANCELED">Cancelado</option>
              <option value="PAST_DUE">Vencido</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-[#D4AF37] hover:bg-[#C5A028] text-black font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>

        {/* CSS for PhoneInput in Modal */}
        <style jsx global>{`
          .phone-input-modal .PhoneInputInput {
            width: 100%;
            padding: 0.75rem 1rem;
            background-color: #0A0A0A;
            border: 1px solid #27272A;
            border-radius: 0.5rem;
            color: #FFFFFF;
            font-size: 1rem;
          }

          .phone-input-modal .PhoneInputInput:focus {
            outline: none;
            border-color: #D4AF37;
          }

          .phone-input-modal .PhoneInputCountry {
            margin-right: 0.5rem;
          }

          .phone-input-modal .PhoneInputCountrySelect {
            background-color: transparent;
            border: none;
            color: #FFFFFF;
          }
        `}</style>
      </div>
    </div>
  );
}
