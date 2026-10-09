import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { evaluateDoubleProgression } from '../../utils/progressionEngine';
import {
  Play,
  Flame,
  TrendingUp,
  Award,
  ChevronRight,
  Sparkles,
  Calendar,
  AlertCircle,
  Dumbbell,
  CheckCircle2,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { WorkoutRoutine } from '../../types';

interface HomeViewProps {
  onStartRoutine: (routine: WorkoutRoutine) => void;
  onNavigateToTab: (tab: 'workouts' | 'progress' | 'ai' | 'profile') => void;
  onOpenLiveWorkout: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onStartRoutine,
  onNavigateToTab,
  onOpenLiveWorkout
}) => {
  const {
    userProfile,
    activePlan,
    activeSession,
    history,
    hasRecoveredSession,
    cancelActiveWorkout
  } = useApp();

  // Find next workout routine in sequence
  // If last finished routine was A, suggest B; if B, suggest C...
  const lastCompleted = history[0];
  let nextRoutineIdx = 0;
  if (lastCompleted && activePlan.routines.length > 0) {
    const lastIdx = activePlan.routines.findIndex(r => r.id === lastCompleted.routineId);
    if (lastIdx !== -1) {
      nextRoutineIdx = (lastIdx + 1) % activePlan.routines.length;
    }
  }
  const nextRoutine = activePlan.routines[nextRoutineIdx] || activePlan.routines[0];

  // Evaluate double progression recommendations across active plan's exercises
  const progressionCards = (nextRoutine?.exercises || [])
    .map(we => evaluateDoubleProgression(we.exerciseId, we.exerciseName, we.repRange, history))
    .filter(Boolean);

  // Quick weekly metrics
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const recentSessions = history.filter(s => new Date(s.startTime) >= oneWeekAgo);
  const weeklyVolume = recentSessions.reduce((acc, s) => acc + s.totalVolumeKg, 0);

  return (
    <div className="space-y-5 pb-28 pt-2">
      {/* 1. Recovery Banner if active session was interrupted */}
      {activeSession && (
        <div className="bg-gradient-to-r from-amber-950/40 via-amber-900/30 to-zinc-900 border border-amber-500/40 rounded-3xl p-4 shadow-xl animate-in fade-in duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-500/30">
                <AlertCircle size={22} />
              </div>
              <div>
                <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  Sessão em Andamento Recuperada
                </div>
                <h4 className="text-sm font-bold text-white mt-0.5">
                  {activeSession.routineName}
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {activeSession.exercises.reduce((a, b) => a + b.sets.filter(s => s.completed).length, 0)} séries salvas
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 shrink-0">
              <button
                onClick={onOpenLiveWorkout}
                className="px-4 py-2 rounded-xl bg-[#CCFF00] text-black font-extrabold text-xs shadow-md shadow-[#CCFF00]/20 active:scale-95 transition-all"
              >
                Continuar
              </button>
              <button
                onClick={cancelActiveWorkout}
                className="px-3 py-1 rounded-xl bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-[11px] font-medium text-center"
              >
                Descartar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Athlete Header Card */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
            <span>Foco:</span>
            <span className="text-[#CCFF00] font-bold uppercase tracking-wider">
              {userProfile.goal}
            </span>
            <span>•</span>
            <span className="text-zinc-300 capitalize">{userProfile.experienceLevel}</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-0.5">
            Fala, {userProfile.name.split(' ')[0]} 👋
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-[#15151e] border border-zinc-800 px-3 py-1.5 rounded-2xl flex items-center gap-1.5">
            <Flame size={16} className="text-[#CCFF00]" />
            <span className="font-mono-numbers text-xs font-bold text-white">
              {history.length}
            </span>
            <span className="text-[10px] text-zinc-400 uppercase font-semibold">treinos</span>
          </div>
        </div>
      </div>

      {/* 3. Next Workout Hero Card */}
      {nextRoutine && (
        <div className="relative overflow-hidden bg-gradient-to-br from-[#181824] via-[#12121a] to-[#0c0c10] border border-zinc-800/90 rounded-3xl p-5 shadow-2xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#CCFF00]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between mb-3">
            <span className="px-3 py-1 rounded-full bg-[#CCFF00]/15 border border-[#CCFF00]/30 text-[#CCFF00] text-[11px] font-extrabold uppercase tracking-wider">
              PRÓXIMO NA ROTINA ({nextRoutine.tag})
            </span>
            <span className="text-xs text-zinc-400 flex items-center gap-1">
              <Clock size={13} /> ~{userProfile.sessionDurationMinutes} min
            </span>
          </div>

          <h2 className="text-xl font-extrabold text-white tracking-tight mb-1">
            {nextRoutine.name}
          </h2>
          <p className="text-xs text-zinc-400 line-clamp-1 mb-4">
            {nextRoutine.description}
          </p>

          {/* Muscle Focus Pills */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {nextRoutine.targetMuscles.map((m, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2.5 py-0.5 rounded-lg bg-zinc-800/80 text-zinc-300 font-medium"
              >
                {m}
              </span>
            ))}
            <span className="text-[11px] px-2.5 py-0.5 rounded-lg bg-zinc-800/40 text-zinc-500 font-mono-numbers">
              {nextRoutine.exercises.length} exercícios
            </span>
          </div>

          {/* Start Workout Button */}
          <button
            onClick={() => {
              onStartRoutine(nextRoutine);
              onOpenLiveWorkout();
            }}
            className="w-full py-4 rounded-2xl bg-[#CCFF00] hover:bg-[#b8e600] active:scale-[0.98] text-black font-black text-sm tracking-wide uppercase flex items-center justify-center gap-2 transition-all shadow-xl shadow-[#CCFF00]/20"
          >
            <Play size={18} fill="black" />
            Iniciar Treino Agora
          </button>
        </div>
      )}

      {/* 4. Active Progression Recommendations (Double Progression System) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-[#CCFF00]" />
            <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">
              Progressão Dupla Ativa
            </h3>
          </div>
          <span className="text-[11px] text-zinc-400 font-semibold">
            Sobrecarga calculada
          </span>
        </div>

        {progressionCards.length > 0 ? (
          <div className="space-y-2.5">
            {progressionCards.map((rec, i) => {
              if (!rec) return null;
              const isIncrease = rec.status === 'READY_FOR_LOAD_INCREASE';

              return (
                <div
                  key={i}
                  className={`p-4 rounded-2xl border transition-all ${
                    isIncrease
                      ? 'bg-gradient-to-r from-emerald-950/30 via-[#151520] to-[#121218] border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                      : 'bg-[#14141c] border-zinc-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                            isIncrease
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          {isIncrease ? '🔥 Subir Carga Sugerido' : '⚡ Meta de Repetições'}
                        </span>
                        <span className="text-xs font-bold text-white">
                          {rec.exerciseName}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-[10px] text-zinc-500 uppercase font-semibold">
                        Anterior ➡️ Meta
                      </div>
                      <div className="font-mono-numbers text-xs font-extrabold text-white">
                        {rec.previousLoadKg}kg ➡️{' '}
                        <span className="text-[#CCFF00]">
                          {rec.suggestedNextLoadKg}kg
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {rec.reason}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
                    <span>
                      Reps anteriores: [{rec.previousReps.join(', ')}]
                    </span>
                    <span className="font-semibold text-zinc-300">
                      Faixa: {rec.targetRepRange}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-[#14141c] border border-zinc-800/80 rounded-2xl p-4 text-center text-xs text-zinc-400">
            Complete suas primeiras séries no treino ao vivo para calibrar o motor de progressão dupla de cargas.
          </div>
        )}
      </div>

      {/* 5. Quick Analytics KPIs */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-[#14141c] border border-zinc-800 p-3 rounded-2xl">
          <div className="text-[10px] uppercase font-bold text-zinc-500 mb-1">
            Volume (7d)
          </div>
          <div className="font-mono-numbers font-extrabold text-base text-white">
            {(weeklyVolume / 1000).toFixed(1)}k <span className="text-xs text-zinc-500 font-normal">kg</span>
          </div>
          <div className="text-[10px] text-emerald-400 mt-0.5">
            {recentSessions.length} sessões
          </div>
        </div>

        <div className="bg-[#14141c] border border-zinc-800 p-3 rounded-2xl">
          <div className="text-[10px] uppercase font-bold text-zinc-500 mb-1">
            Divisão Ativa
          </div>
          <div className="font-extrabold text-base text-[#CCFF00] truncate">
            {activePlan.splitType}
          </div>
          <div className="text-[10px] text-zinc-400 mt-0.5">
            {activePlan.routines.length} treinos
          </div>
        </div>

        <div className="bg-[#14141c] border border-zinc-800 p-3 rounded-2xl">
          <div className="text-[10px] uppercase font-bold text-zinc-500 mb-1">
            Meta Frequência
          </div>
          <div className="font-mono-numbers font-extrabold text-base text-white">
            {userProfile.daysPerWeek}x <span className="text-xs text-zinc-500 font-normal">/sem</span>
          </div>
          <div className="text-[10px] text-zinc-400 mt-0.5">
            Consistente
          </div>
        </div>
      </div>

      {/* 6. Shortcuts row */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onNavigateToTab('workouts')}
          className="p-3.5 rounded-2xl bg-[#14141c] border border-zinc-800 hover:border-zinc-700 text-left transition-all active:scale-98 flex items-center justify-between"
        >
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <Dumbbell size={15} className="text-[#CCFF00]" />
              Ver Fichas
            </div>
            <div className="text-[10px] text-zinc-400 mt-0.5">
              Editar ordem ou adicionar
            </div>
          </div>
          <ChevronRight size={16} className="text-zinc-500" />
        </button>

        <button
          onClick={() => onNavigateToTab('ai')}
          className="p-3.5 rounded-2xl bg-[#14141c] border border-zinc-800 hover:border-zinc-700 text-left transition-all active:scale-98 flex items-center justify-between"
        >
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sparkles size={15} className="text-[#CCFF00]" />
              Personal IA
            </div>
            <div className="text-[10px] text-zinc-400 mt-0.5">
              Dúvidas & Biomecânica
            </div>
          </div>
          <ChevronRight size={16} className="text-zinc-500" />
        </button>
      </div>
    </div>
  );
};
