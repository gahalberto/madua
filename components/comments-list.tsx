'use client';

import { useState, useTransition } from 'react';
import { useSession } from 'next-auth/react';
import { Crown, Shield, Trash2, Send } from 'lucide-react';
import { createComment, deleteComment, type CommentWithUser } from '@/app/actions/comments';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface CommentsListProps {
  lessonId: string;
  initialComments: CommentWithUser[];
}

function UserAvatar({ user }: { user: CommentWithUser['user'] }) {
  if (user.image) {
    return (
      <Image
        src={user.image}
        alt={user.name || 'Usuário'}
        width={40}
        height={40}
        className="rounded-full"
      />
    );
  }

  // Avatar padrão com iniciais
  const initials = user.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '??';

  return (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F4D03F] flex items-center justify-center">
      <span className="text-sm font-bold text-black">{initials}</span>
    </div>
  );
}

function UserBadge({ role, subscriptionStatus }: { role: string; subscriptionStatus: string }) {
  if (role === 'ADMIN') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-500/20 text-red-400 text-xs font-medium">
        <Shield className="w-3 h-3" />
        Admin
      </span>
    );
  }

  if (subscriptionStatus === 'ACTIVE') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-medium">
        <Crown className="w-3 h-3" />
        Membro Premium
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-700/50 text-gray-400 text-xs font-medium">
      Membro
    </span>
  );
}

function CommentItem({
  comment,
  currentUserId,
  onDelete,
}: {
  comment: CommentWithUser;
  currentUserId?: string;
  onDelete: (id: string) => void;
}) {
  const [isDeleting, startDelete] = useTransition();
  const canDelete = currentUserId === comment.user.id;

  const handleDelete = () => {
    if (confirm('Tem certeza que deseja deletar este comentário?')) {
      startDelete(async () => {
        try {
          await deleteComment(comment.id);
          onDelete(comment.id);
        } catch (error) {
          alert(error instanceof Error ? error.message : 'Erro ao deletar comentário');
        }
      });
    }
  };

  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' anos atrás';

    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' meses atrás';

    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' dias atrás';

    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' horas atrás';

    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutos atrás';

    return 'agora mesmo';
  };

  return (
    <div className="bg-[#1A1F2E] rounded-lg p-4 border border-[#2A3441] hover:border-[#374151] transition-colors">
      <div className="flex gap-3">
        <UserAvatar user={comment.user} />

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-white text-sm">
                  {comment.user.name || 'Usuário'}
                </span>
                <UserBadge
                  role={comment.user.role}
                  subscriptionStatus={comment.user.subscriptionStatus}
                />
              </div>
              <span className="text-xs text-gray-500">{timeAgo(comment.createdAt)}</span>
            </div>

            {canDelete && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-gray-500 hover:text-red-400 transition-colors p-1 rounded hover:bg-red-500/10 disabled:opacity-50"
                title="Deletar comentário"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Content */}
          <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap break-words">
            {comment.content}
          </p>
        </div>
      </div>
    </div>
  );
}

export function CommentsList({ lessonId, initialComments }: CommentsListProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<CommentWithUser[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    startTransition(async () => {
      try {
        const result = await createComment(lessonId, newComment);
        if (result.success && result.comment) {
          setComments([result.comment, ...comments]);
          setNewComment('');
        }
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Erro ao enviar comentário');
      }
    });
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(comments.filter((c) => c.id !== commentId));
  };

  return (
    <div className="space-y-6">
      {/* Comment Form */}
      {session?.user ? (
        <form onSubmit={handleSubmit} className="bg-[#1A1F2E] rounded-lg p-4 border border-[#2A3441]">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <UserAvatar
                user={{
                  id: session.user.id,
                  name: session.user.name || null,
                  image: session.user.image || null,
                  role: session.user.role,
                  subscriptionStatus: session.user.subscriptionStatus,
                }}
              />
            </div>

            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Adicione um comentário..."
                disabled={isPending}
                maxLength={1000}
                rows={3}
                className={cn(
                  'w-full bg-[#0F1419] text-white rounded-lg px-4 py-3 text-sm',
                  'border border-[#2A3441] focus:border-[#D4AF37] focus:outline-none',
                  'placeholder:text-gray-500 resize-none transition-colors',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              />

              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-gray-500">
                  {newComment.length}/1000 caracteres
                </span>

                <button
                  type="submit"
                  disabled={isPending || !newComment.trim()}
                  className={cn(
                    'inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm',
                    'bg-[#D4AF37] hover:bg-[#C19B2F] text-black transition-colors',
                    'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#D4AF37]'
                  )}
                >
                  {isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Comentar
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-[#1A1F2E] rounded-lg p-6 border border-[#2A3441] text-center">
          <p className="text-gray-400 mb-3">Faça login para comentar</p>
          <a
            href="/login"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D4AF37] hover:bg-[#C19B2F] text-black font-medium text-sm transition-colors"
          >
            Fazer Login
          </a>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-3">
        {comments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm">
              Nenhum comentário ainda. Seja o primeiro a comentar!
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={session?.user?.id}
              onDelete={handleDeleteComment}
            />
          ))
        )}
      </div>
    </div>
  );
}
