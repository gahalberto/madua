'use client';

import { useEffect, useState } from 'react';
import { getAllUsers } from '@/app/actions/admin';
import { 
  Shield, 
  User, 
  CheckCircle, 
  XCircle, 
  MessageSquare,
  BookOpen,
  Calendar,
  Search
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatPhoneNumberIntl } from 'react-phone-number-input';
import { differenceInYears } from 'date-fns';
import { EditUserModal } from '@/components/edit-user-modal';

type UserData = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  birthDate: Date | null;
  gender: string | null;
  role: string;
  subscriptionStatus: string;
  createdAt: Date;
  _count: {
    progress: number;
    comments: number;
  };
};

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);

  const loadUsers = async () => {
    const data = await getAllUsers();
    setUsers(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Filtrar usuários pela busca
  const filteredUsers = users.filter((user) => {
    const search = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      user.phone?.toLowerCase().includes(search)
    );
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-zinc-400">Carregando usuários...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Gerenciamento de Usuários</h1>
        <p className="text-zinc-400">
          Total de {users.length} usuário{users.length !== 1 ? 's' : ''} registrado{users.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar por nome, email ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#1A1F2E] border border-zinc-800 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#D4AF37] transition-colors"
          />
        </div>
        {searchTerm && (
          <p className="mt-2 text-sm text-zinc-400">
            {filteredUsers.length} resultado{filteredUsers.length !== 1 ? 's' : ''} encontrado{filteredUsers.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#1A1F2E] rounded-xl p-6 border border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-blue-500/10">
              <User className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-zinc-400 text-sm">Total de Usuários</p>
              <p className="text-2xl font-bold text-white">{users.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#1A1F2E] rounded-xl p-6 border border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-emerald-500/10">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-zinc-400 text-sm">Assinantes Ativos</p>
              <p className="text-2xl font-bold text-white">
                {users.filter(u => u.subscriptionStatus === 'ACTIVE').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#1A1F2E] rounded-xl p-6 border border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-amber-500/10">
              <Shield className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-zinc-400 text-sm">Administradores</p>
              <p className="text-2xl font-bold text-white">
                {users.filter(u => u.role === 'ADMIN').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#1A1F2E] rounded-xl border border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-900">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Telefone
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Idade
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Subscrição
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Atividade
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Data de Registro
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-zinc-900/50 transition-colors">
                  {/* User Info */}
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-white">{user.name}</div>
                      <div className="text-sm text-zinc-400">{user.email}</div>
                    </div>
                  </td>

                  {/* Phone */}
                  <td className="px-6 py-4">
                    <div className="text-sm text-zinc-300">
                      {user.phone ? formatPhoneNumberIntl(user.phone) : (
                        <span className="text-zinc-500">-</span>
                      )}
                    </div>
                  </td>

                  {/* Age */}
                  <td className="px-6 py-4">
                    <div className="text-sm text-zinc-300">
                      {user.birthDate ? (
                        <span>{differenceInYears(new Date(), new Date(user.birthDate))} anos</span>
                      ) : (
                        <span className="text-zinc-500">-</span>
                      )}
                    </div>
                  </td>

                  {/* Role Badge */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === 'ADMIN'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                      }`}
                    >
                      {user.role === 'ADMIN' ? (
                        <Shield className="w-3 h-3" />
                      ) : (
                        <User className="w-3 h-3" />
                      )}
                      {user.role}
                    </span>
                  </td>

                  {/* Subscription Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                        user.subscriptionStatus === 'ACTIVE'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : user.subscriptionStatus === 'DEMO'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                      }`}
                    >
                      {user.subscriptionStatus === 'ACTIVE' ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      {user.subscriptionStatus}
                    </span>
                  </td>

                  {/* Activity Stats */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4 text-sm text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4" />
                        <span>{user._count.progress} aulas</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="w-4 h-4" />
                        <span>{user._count.comments}</span>
                      </div>
                    </div>
                  </td>

                  {/* Created At */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(user.createdAt), "dd 'de' MMM, yyyy", { locale: ptBR })}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => setEditingUser(user)}
                      className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-sm rounded-lg transition-colors"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-400">
              {searchTerm ? 'Nenhum usuário encontrado com esses critérios' : 'Nenhum usuário encontrado'}
            </p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSuccess={loadUsers}
        />
      )}
    </div>
  );
}
