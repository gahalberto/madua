'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuantumTimerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuantumTimer({ isOpen, onClose }: QuantumTimerProps) {
  const [duration, setDuration] = useState(5); // 5 ou 10 minutos
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setTimeLeft(duration * 60);
  }, [duration]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            setIsComplete(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft]);

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(duration * 60);
    setIsComplete(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-md w-full relative"
        >
          {/* Botão Fechar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="text-gray-400" size={20} />
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">O Soltar</h2>
            <p className="text-sm text-gray-400">Timer Quântico de Descompressão</p>
          </div>

          {/* Seletor de Duração */}
          {!isActive && !isComplete && (
            <div className="flex gap-4 mb-8">
              <button
                onClick={() => setDuration(5)}
                className={`flex-1 py-3 rounded-lg font-bold transition-all ${
                  duration === 5
                    ? 'bg-[#D4AF37] text-black'
                    : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
                }`}
              >
                5 MIN
              </button>
              <button
                onClick={() => setDuration(10)}
                className={`flex-1 py-3 rounded-lg font-bold transition-all ${
                  duration === 10
                    ? 'bg-[#D4AF37] text-black'
                    : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
                }`}
              >
                10 MIN
              </button>
            </div>
          )}

          {/* Timer Display */}
          <div className="relative mb-8">
            {/* Círculo de Progresso */}
            <svg className="w-full h-auto" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="4"
              />
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="#D4AF37"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 90}`}
                strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
                transform="rotate(-90 100 100)"
                className="transition-all duration-1000 ease-linear"
              />
            </svg>

            {/* Tempo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-bold text-white mb-2">{formatTime(timeLeft)}</div>
                {isComplete && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[#D4AF37] font-semibold"
                  >
                    Completo
                  </motion.p>
                )}
              </div>
            </div>
          </div>

          {/* Instruções */}
          {isActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 mb-6"
            >
              <p className="text-sm text-gray-300 text-center leading-relaxed italic">
                {timeLeft > duration * 30
                  ? '"Solte a resistência. Deixe a mente esvaziar."'
                  : '"Observe o silêncio entre os pensamentos."'}
              </p>
            </motion.div>
          )}

          {/* Controles */}
          <div className="flex gap-3">
            <button
              onClick={() => setIsActive(!isActive)}
              disabled={isComplete}
              className="flex-1 py-4 bg-[#D4AF37] text-black font-bold rounded-lg hover:bg-[#C4A037] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isActive ? (
                <>
                  <Pause size={20} />
                  PAUSAR
                </>
              ) : (
                <>
                  <Play size={20} />
                  {timeLeft === duration * 60 ? 'INICIAR' : 'RETOMAR'}
                </>
              )}
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-4 bg-zinc-800 text-gray-400 rounded-lg hover:bg-zinc-700 transition-all"
            >
              <RotateCcw size={20} />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
