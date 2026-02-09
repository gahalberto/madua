'use client';

import { Crown, Lock } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface PremiumBadgeProps {
  isPremium: boolean;
  className?: string;
}

export function PremiumBadge({ isPremium, className = '' }: PremiumBadgeProps) {
  if (!isPremium) {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md bg-green-500/20 text-green-400 text-xs font-medium ${className}`}>
        Gratuito
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-medium ${className}`}>
      <Crown className="w-3 h-3" />
      Premium
    </span>
  );
}

interface ContentTypeBadgeProps {
  type: 'COURSE' | 'VLOG' | 'WORKSHOP';
  className?: string;
}

export function ContentTypeBadge({ type, className = '' }: ContentTypeBadgeProps) {
  const labels = {
    COURSE: 'Curso',
    VLOG: 'Vlog',
    WORKSHOP: 'Workshop',
  };

  const colors = {
    COURSE: 'bg-blue-500/20 text-blue-400',
    VLOG: 'bg-purple-500/20 text-purple-400',
    WORKSHOP: 'bg-orange-500/20 text-orange-400',
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${colors[type]} ${className}`}>
      {labels[type]}
    </span>
  );
}

interface AccessGateProps {
  isPremium: boolean;
  children: React.ReactNode;
  courseId: string;
  courseName?: string;
}

export function AccessGate({ isPremium, children, courseId, courseName }: AccessGateProps) {
  const { data: session } = useSession();
  
  // Conteúdo gratuito - sempre acessível
  if (!isPremium) {
    return <>{children}</>;
  }

  // Conteúdo premium - verificar assinatura
  const hasActiveSubscription = session?.user?.subscriptionStatus === 'ACTIVE';

  if (!hasActiveSubscription) {
    return (
      <div className="relative">
        {/* Blur overlay */}
        <div className="pointer-events-none select-none blur-sm">
          {children}
        </div>
        
        {/* Lock overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="text-center p-8 max-w-md">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#D4AF37]/20 mb-4">
              <Lock className="w-8 h-8 text-[#D4AF37]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Conteúdo Premium
            </h3>
            <p className="text-gray-400 mb-6">
              Este conteúdo é exclusivo para membros Premium. Faça upgrade para desbloquear.
            </p>
            <a
              href={`/upgrade?courseId=${courseId}&courseName=${encodeURIComponent(courseName || '')}`}
              className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#C19B2F] text-black font-bold py-3 px-6 rounded-lg transition-colors"
            >
              <Crown className="w-5 h-5" />
              Fazer Upgrade
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
