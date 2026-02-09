'use client';

import { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  Maximize2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Type workaround for ReactPlayer
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Player = ReactPlayer as any;

interface VideoPlayerProps {
  url: string;
  onTheaterModeChange?: (isTheaterMode: boolean) => void;
  autoPlay?: boolean;
  className?: string;
}

export function VideoPlayer({
  url,
  onTheaterModeChange,
  autoPlay = false,
  className,
}: VideoPlayerProps) {
  const [playing, setPlaying] = useState(autoPlay);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // Auto-hide controls
  const resetControlsTimeout = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    setShowControls(true);
    
    if (playing) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
        setShowSettings(false);
      }, 3000);
    }
  };

  useEffect(() => {
    resetControlsTimeout();
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [playing]);

  // Handle theater mode
  const toggleTheaterMode = () => {
    const newTheaterMode = !isTheaterMode;
    setIsTheaterMode(newTheaterMode);
    onTheaterModeChange?.(newTheaterMode);
  };

  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Handle play/pause
  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  // Handle progress
  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    if (!seeking) {
      setPlayed(state.played);
    }
  };

  // Handle seek
  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayed(parseFloat(e.target.value));
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
    setSeeking(false);
    playerRef.current?.seekTo(parseFloat((e.target as HTMLInputElement).value));
  };

  // Handle volume
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setMuted(newVolume === 0);
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  // Format time
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = ('0' + date.getUTCSeconds()).slice(-2);
    if (hh) {
      return `${hh}:${('0' + mm).slice(-2)}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore keyboard shortcuts when user is typing in input or textarea
      if (
        e.target instanceof HTMLInputElement || 
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          handlePlayPause();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 't':
          e.preventDefault();
          toggleTheaterMode();
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'arrowleft':
          e.preventDefault();
          playerRef.current?.seekTo(Math.max(0, played - 0.05));
          break;
        case 'arrowright':
          e.preventDefault();
          playerRef.current?.seekTo(Math.min(1, played + 0.05));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [playing, played, isTheaterMode]);

  const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative bg-black group',
        isTheaterMode ? 'w-full' : 'aspect-video',
        className
      )}
      onMouseMove={resetControlsTimeout}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      {/* Video Player */}
      <Player
        ref={playerRef}
        url={url}
        playing={playing}
        volume={volume}
        muted={muted}
        playbackRate={playbackRate}
        width="100%"
        height="100%"
        onProgress={handleProgress}
        onDuration={setDuration}
        onEnded={() => setPlaying(false)}
      />

      {/* Play/Pause Overlay */}
      <div
        className="absolute inset-0 flex items-center justify-center cursor-pointer"
        onClick={handlePlayPause}
      >
        {!playing && (
          <div className="w-20 h-20 rounded-full bg-[#D4AF37]/90 flex items-center justify-center transform transition-transform hover:scale-110">
            <Play className="w-10 h-10 text-black fill-black ml-1" />
          </div>
        )}
      </div>

      {/* Controls */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-opacity duration-300 p-4 pb-2',
          showControls ? 'opacity-100' : 'opacity-0'
        )}
      >
        {/* Progress Bar */}
        <div className="mb-3">
          <input
            type="range"
            min={0}
            max={0.999999}
            step="any"
            value={played}
            onMouseDown={handleSeekMouseDown}
            onChange={handleSeekChange}
            onMouseUp={handleSeekMouseUp}
            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer progress-bar"
            style={{
              background: `linear-gradient(to right, #D4AF37 0%, #D4AF37 ${
                played * 100
              }%, #4B5563 ${played * 100}%, #4B5563 100%)`,
            }}
          />
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between text-white">
          {/* Left Controls */}
          <div className="flex items-center gap-3">
            {/* Play/Pause */}
            <button
              onClick={handlePlayPause}
              className="hover:text-[#D4AF37] transition-colors"
            >
              {playing ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 fill-white" />
              )}
            </button>

            {/* Volume */}
            <div className="flex items-center gap-2 group/volume">
              <button
                onClick={toggleMute}
                className="hover:text-[#D4AF37] transition-colors"
              >
                {muted || volume === 0 ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={muted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-0 group-hover/volume:w-20 transition-all duration-200 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #D4AF37 0%, #D4AF37 ${
                    (muted ? 0 : volume) * 100
                  }%, #4B5563 ${(muted ? 0 : volume) * 100}%, #4B5563 100%)`,
                }}
              />
            </div>

            {/* Time */}
            <div className="text-sm">
              <span className="text-white">{formatTime(played * duration)}</span>
              <span className="text-gray-400"> / {formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Settings */}
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="hover:text-[#D4AF37] transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>

              {/* Settings Menu */}
              {showSettings && (
                <div className="absolute bottom-full right-0 mb-2 bg-black/95 rounded-lg p-2 min-w-[120px] shadow-xl border border-gray-700">
                  <div className="text-xs text-gray-400 px-2 py-1">Velocidade</div>
                  {playbackRates.map((rate) => (
                    <button
                      key={rate}
                      onClick={() => {
                        setPlaybackRate(rate);
                        setShowSettings(false);
                      }}
                      className={cn(
                        'w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-800 transition-colors',
                        playbackRate === rate
                          ? 'text-[#D4AF37] bg-gray-800'
                          : 'text-white'
                      )}
                    >
                      {rate === 1 ? 'Normal' : `${rate}x`}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theater Mode */}
            <button
              onClick={toggleTheaterMode}
              className="hover:text-[#D4AF37] transition-colors"
              title="Teatro (T)"
            >
              <Maximize2 className="w-5 h-5" />
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="hover:text-[#D4AF37] transition-colors"
              title="Tela cheia (F)"
            >
              {isFullscreen ? (
                <Minimize className="w-5 h-5" />
              ) : (
                <Maximize className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .progress-bar::-webkit-slider-thumb {
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #d4af37;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .progress-bar:hover::-webkit-slider-thumb {
          opacity: 1;
        }

        .progress-bar::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #d4af37;
          cursor: pointer;
          border: none;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .progress-bar:hover::-moz-range-thumb {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
