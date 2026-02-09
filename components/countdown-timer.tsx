'use client';

import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  hours?: number;
}

export function CountdownTimer({ hours = 24 }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: hours,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetTime = new Date().getTime() + hours * 60 * 60 * 1000;
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetTime - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [hours]);

  return (
    <div className="flex gap-2 justify-center">
      <TimeUnit value={timeLeft.hours} label="Horas" />
      <span className="text-2xl font-bold text-[#D4AF37]">:</span>
      <TimeUnit value={timeLeft.minutes} label="Minutos" />
      <span className="text-2xl font-bold text-[#D4AF37]">:</span>
      <TimeUnit value={timeLeft.seconds} label="Segundos" />
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-[#0A0A0A] border-2 border-[#D4AF37]/30 rounded-lg px-4 py-2 min-w-[70px]">
        <span className="text-3xl font-bold text-[#D4AF37] tabular-nums">
          {value.toString().padStart(2, '0')}
        </span>
      </div>
      <span className="text-xs text-zinc-500 mt-1 uppercase">{label}</span>
    </div>
  );
}
