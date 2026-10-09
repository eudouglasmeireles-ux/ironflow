import React from 'react';
import { useApp } from '../../context/AppContext';
import { Play, Pause, FastForward, Plus, Minus, Timer, BellRing, Check } from 'lucide-react';

interface FloatingRestTimerProps {
  onOpenLiveWorkout?: () => void;
}

export const FloatingRestTimer: React.FC<FloatingRestTimerProps> = ({ onOpenLiveWorkout }) => {
  const {
    restTimer,
    adjustRestTimer,
    skipRestTimer,
    pauseRestTimer,
    resumeRestTimer,
    dismissRestFinishedAlert
  } = useApp();

  // If finished alert is open and timer is not active
  if (restTimer.isFinishedAlertOpen) {
    return (
      <div className="fixed bottom-20 left-4 right-4 z-50 max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-200">
        <div className="bg-[#121218] border-2 border-[#CCFF00] rounded-2xl p-3.5 shadow-2xl shadow-[#CCFF00]/20 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#CCFF00]/20 text-[#CCFF00] flex items-center justify-center shrink-0 border border-[#CCFF00]">
              <BellRing size={20} className="animate-bounce" />
            </div>
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#CCFF00]">
                DESCANSO CONCLUÍDO!
              </div>
              <div className="text-xs font-bold text-white">
                Hora da próxima série {restTimer.nextSetNumber ? `(#${restTimer.nextSetNumber})` : ''}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenLiveWorkout && (
              <button
                onClick={() => {
                  dismissRestFinishedAlert();
                  onOpenLiveWorkout();
                }}
                className="px-3 py-1.5 rounded-xl bg-[#CCFF00] text-black font-extrabold text-xs shadow-md shadow-[#CCFF00]/30 active:scale-95 transition-all"
              >
                Ir pro Treino
              </button>
            )}
            <button
              onClick={dismissRestFinishedAlert}
              className="w-8 h-8 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center text-xs"
            >
              <Check size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!restTimer.isActive) return null;

  const total = Math.max(1, restTimer.totalSeconds);
  const remaining = Math.max(0, restTimer.remainingSeconds);
  const progressPercent = Math.min(100, Math.max(0, ((total - remaining) / total) * 100));

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="bg-[#121218]/95 backdrop-blur-xl border border-[#CCFF00]/40 rounded-2xl p-3 shadow-2xl shadow-black/80 flex items-center justify-between gap-3">
        {/* Timer Ring & Digits */}
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
            {/* SVG Progress Circle */}
            <svg className="w-12 h-12 -rotate-90 transform" viewBox="0 0 44 44">
              <circle
                cx="22"
                cy="22"
                r="18"
                className="stroke-zinc-800"
                strokeWidth="3.5"
                fill="none"
              />
              <circle
                cx="22"
                cy="22"
                r="18"
                className="stroke-[#CCFF00] transition-all duration-300 ease-linear"
                strokeWidth="3.5"
                strokeDasharray={113}
                strokeDashoffset={113 - (113 * progressPercent) / 100}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <Timer size={16} className="absolute text-[#CCFF00]" />
          </div>

          <div>
            <div className="text-[11px] font-medium text-zinc-400 flex items-center gap-1.5 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] animate-ping" />
              Descanso {restTimer.exerciseName ? `• ${restTimer.exerciseName}` : ''}
            </div>
            <div className="font-mono-numbers text-2xl font-black text-white tracking-tight flex items-baseline gap-1">
              {formattedTime}
              <span className="text-xs text-zinc-400 font-normal">rest</span>
            </div>
          </div>
        </div>

        {/* Quick Stepper Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => adjustRestTimer(-15)}
            className="w-8 h-8 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 active:scale-95 text-zinc-300 flex items-center justify-center text-xs font-semibold"
            title="Reduzir 15 segundos"
          >
            <Minus size={14} />
          </button>

          <button
            onClick={() => adjustRestTimer(15)}
            className="w-8 h-8 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 active:scale-95 text-zinc-300 flex items-center justify-center text-xs font-semibold"
            title="Adicionar 15 segundos"
          >
            <Plus size={14} />
          </button>

          {restTimer.isPaused ? (
            <button
              onClick={resumeRestTimer}
              className="w-9 h-9 rounded-lg bg-[#CCFF00] text-black font-bold flex items-center justify-center active:scale-95 shadow-md shadow-[#CCFF00]/20"
              title="Retomar"
            >
              <Play size={16} fill="black" />
            </button>
          ) : (
            <button
              onClick={pauseRestTimer}
              className="w-9 h-9 rounded-lg bg-zinc-800 text-zinc-200 hover:bg-zinc-700 active:scale-95 flex items-center justify-center"
              title="Pausar"
            >
              <Pause size={16} />
            </button>
          )}

          <button
            onClick={skipRestTimer}
            className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700/60 hover:bg-zinc-800 active:scale-95 text-zinc-400 hover:text-white flex items-center justify-center"
            title="Pular Descanso"
          >
            <FastForward size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
