import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getExerciseById, EXERCISE_DATABASE } from '../../data/exercises';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Flame,
  Info,
  Plus,
  RefreshCw,
  AlertTriangle,
  StopCircle,
  Clock,
  Dumbbell,
  Sparkles,
  X,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LiveWorkoutViewProps {
  onClose: () => void;
}

export const LiveWorkoutView: React.FC<LiveWorkoutViewProps> = ({ onClose }) => {
  const {
    activeSession,
    updateActiveSet,
    completeSet,
    addSetToExercise,
    replaceExerciseInActiveSession,
    finishActiveWorkout,
    cancelActiveWorkout,
    startRestTimer
  } = useApp();

  const [activeExIdx, setActiveExIdx] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [showDiscomfortModal, setShowDiscomfortModal] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [workoutNotes, setWorkoutNotes] = useState('');
  const [userRpeOverall, setUserRpeOverall] = useState(8);
  const [discomfortNote, setDiscomfortNote] = useState('');

  if (!activeSession) return null;

  const currentExercise = activeSession.exercises[activeExIdx] || activeSession.exercises[0];
  const dbEx = getExerciseById(currentExercise.exerciseId);

  // Format elapsed time (MM:SS or HH:MM:SS)
  const formatElapsed = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    if (hrs > 0) {
      return `${hrs}h ${mins < 10 ? '0' : ''}${mins}m`;
    }
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const completedSetsCount = activeSession.exercises.reduce(
    (acc, ex) => acc + ex.sets.filter(s => s.completed).length,
    0
  );
  const totalSetsCount = activeSession.exercises.reduce(
    (acc, ex) => acc + ex.sets.length,
    0
  );

  const handleFinishConfirm = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignore if confetti fails
    }

    finishActiveWorkout(workoutNotes, userRpeOverall, discomfortNote);
    setShowFinishModal(false);
    onClose();
  };

  const handleCancelWorkout = () => {
    if (confirm('Tem certeza que deseja cancelar e descartar a sessão em andamento?')) {
      cancelActiveWorkout();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0d] flex flex-col overflow-hidden text-white">
      {/* Top Bar */}
      <header className="bg-[#121218] border-b border-zinc-800/80 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 flex items-center justify-center text-zinc-300 active:scale-95 transition-all"
            title="Minimizar tela (continua em segundo plano)"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#CCFF00]">
                AO VIVO
              </span>
            </div>
            <h1 className="text-sm font-bold text-white truncate max-w-[180px] sm:max-w-xs">
              {activeSession.routineName}
            </h1>
          </div>
        </div>

        {/* Live Metrics */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="flex items-center gap-1 text-zinc-400 text-[11px] justify-end">
              <Clock size={12} />
              <span className="font-mono-numbers text-zinc-200 font-bold">
                {formatElapsed(activeSession.elapsedSeconds)}
              </span>
            </div>
            <div className="text-[10px] text-zinc-400 font-mono-numbers">
              {activeSession.totalVolumeKg.toLocaleString()} kg total
            </div>
          </div>

          <button
            onClick={() => setShowFinishModal(true)}
            className="bg-[#CCFF00] hover:bg-[#b8e600] active:scale-95 text-black font-extrabold text-xs px-3.5 py-2 rounded-xl transition-all shadow-md shadow-[#CCFF00]/20 flex items-center gap-1.5"
          >
            <Check size={16} strokeWidth={3} />
            <span className="hidden sm:inline">Finalizar</span>
          </button>
        </div>
      </header>

      {/* Exercise Navigation Carousel / Tabs */}
      <div className="bg-[#15151e] border-b border-zinc-800 px-3 py-2 overflow-x-auto flex items-center gap-2 shrink-0 no-scrollbar">
        {activeSession.exercises.map((ex, idx) => {
          const isCurrent = idx === activeExIdx;
          const completedCount = ex.sets.filter(s => s.completed).length;
          const isDone = completedCount === ex.sets.length && ex.sets.length > 0;

          return (
            <button
              key={`${ex.exerciseId}_${idx}`}
              onClick={() => setActiveExIdx(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                isCurrent
                  ? 'bg-[#CCFF00] text-black font-bold shadow-md shadow-[#CCFF00]/15'
                  : isDone
                  ? 'bg-zinc-800/90 text-zinc-300 border border-emerald-500/30'
                  : 'bg-zinc-900/60 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
              }`}
            >
              <span>{idx + 1}.</span>
              <span className="truncate max-w-[120px]">{ex.exerciseName}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono-numbers ${
                  isCurrent
                    ? 'bg-black/20 text-black'
                    : isDone
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {completedCount}/{ex.sets.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Exercise View Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-xl mx-auto w-full pb-28">
        {/* Exercise Header Card */}
        <div className="bg-[#13131a] border border-zinc-800 rounded-3xl p-4.5 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-zinc-800 text-[#CCFF00] border border-zinc-700">
                  {currentExercise.category}
                </span>
                <span className="text-xs text-zinc-400">
                  Exercício {activeExIdx + 1} de {activeSession.exercises.length}
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                {currentExercise.exerciseName}
              </h2>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowInstructions(!showInstructions)}
                className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
                  showInstructions
                    ? 'border-[#CCFF00] bg-[#CCFF00]/15 text-[#CCFF00]'
                    : 'border-zinc-700 bg-zinc-800 text-zinc-300 hover:text-white'
                }`}
                title="Instruções biomecânicas"
              >
                <Info size={17} />
              </button>
              <button
                onClick={() => setShowReplaceModal(true)}
                className="w-9 h-9 rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center active:scale-95 transition-all"
                title="Substituir exercício"
              >
                <RefreshCw size={16} />
              </button>
            </div>
          </div>

          {/* Biomechanical instructions toggle */}
          {showInstructions && dbEx && (
            <div className="p-3.5 bg-zinc-900/90 border border-zinc-700/60 rounded-2xl text-xs space-y-2 animate-in fade-in duration-200">
              <div className="font-bold text-[#CCFF00] flex items-center gap-1.5">
                <Sparkles size={14} /> Dicas de Execução & Postura:
              </div>
              <ul className="list-disc pl-4 space-y-1 text-zinc-300">
                {dbEx.instructions.map((ins, i) => (
                  <li key={i}>{ins}</li>
                ))}
              </ul>
              {dbEx.safetyNotes && (
                <div className="text-[11px] text-amber-300/90 pt-1 border-t border-zinc-800">
                  💡 {dbEx.safetyNotes}
                </div>
              )}
            </div>
          )}

          {/* Target rep range & rest badge */}
          <div className="flex items-center justify-between text-xs text-zinc-400 pt-1 border-t border-zinc-800/80">
            <span>
              Alvo: <strong className="text-white">{currentExercise.sets[0]?.targetReps || '8-12'} reps</strong>
            </span>
            <span className="flex items-center gap-1">
              Descanso padrão: <strong className="text-white">{currentExercise.restSeconds}s</strong>
            </span>
          </div>
        </div>

        {/* Sets Table */}
        <div className="bg-[#13131a] border border-zinc-800 rounded-3xl overflow-hidden">
          <div className="p-3.5 bg-[#171722] border-b border-zinc-800 flex items-center justify-between text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
            <div className="w-10 text-center">Série</div>
            <div className="w-24 text-center">Anterior</div>
            <div className="flex-1 text-center">Carga (kg)</div>
            <div className="w-20 text-center">Reps</div>
            <div className="w-12 text-center">Check</div>
          </div>

          <div className="divide-y divide-zinc-800/60">
            {currentExercise.sets.map((set, setIdx) => {
              return (
                <div
                  key={set.id}
                  className={`p-3 flex items-center gap-2 transition-all ${
                    set.completed ? 'bg-emerald-950/15' : 'hover:bg-zinc-800/20'
                  }`}
                >
                  {/* Set Number */}
                  <div className="w-10 text-center font-bold text-sm text-zinc-300">
                    #{set.setNumber}
                  </div>

                  {/* Previous session reference */}
                  <div className="w-24 text-center text-[11px] text-zinc-400 font-mono-numbers">
                    {set.previousLoadKg !== undefined ? (
                      <span className="text-zinc-300 bg-zinc-800/60 px-2 py-1 rounded-lg">
                        {set.previousLoadKg}kg × {set.previousReps}
                      </span>
                    ) : (
                      <span className="text-zinc-600">—</span>
                    )}
                  </div>

                  {/* Weight Input (kg) with stepper */}
                  <div className="flex-1 flex items-center justify-center gap-1">
                    <button
                      onClick={() =>
                        updateActiveSet(activeExIdx, setIdx, {
                          actualLoadKg: Math.max(0, set.actualLoadKg - 1)
                        })
                      }
                      className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold active:scale-95 flex items-center justify-center"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      step="0.5"
                      value={set.actualLoadKg}
                      onChange={e =>
                        updateActiveSet(activeExIdx, setIdx, {
                          actualLoadKg: parseFloat(e.target.value) || 0
                        })
                      }
                      className="w-14 bg-zinc-900 border border-zinc-700 text-center font-mono-numbers font-bold text-sm py-1 rounded-lg text-white focus:outline-none focus:border-[#CCFF00]"
                    />
                    <button
                      onClick={() =>
                        updateActiveSet(activeExIdx, setIdx, {
                          actualLoadKg: set.actualLoadKg + 1
                        })
                      }
                      className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold active:scale-95 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>

                  {/* Reps Input with stepper */}
                  <div className="w-20 flex items-center justify-center gap-1">
                    <button
                      onClick={() =>
                        updateActiveSet(activeExIdx, setIdx, {
                          actualReps: Math.max(1, set.actualReps - 1)
                        })
                      }
                      className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold active:scale-95 flex items-center justify-center"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={set.actualReps}
                      onChange={e =>
                        updateActiveSet(activeExIdx, setIdx, {
                          actualReps: parseInt(e.target.value, 10) || 0
                        })
                      }
                      className="w-10 bg-zinc-900 border border-zinc-700 text-center font-mono-numbers font-bold text-sm py-1 rounded-lg text-white focus:outline-none focus:border-[#CCFF00]"
                    />
                    <button
                      onClick={() =>
                        updateActiveSet(activeExIdx, setIdx, {
                          actualReps: set.actualReps + 1
                        })
                      }
                      className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold active:scale-95 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>

                  {/* Complete Set Checkmark */}
                  <div className="w-12 flex justify-center">
                    <button
                      onClick={() => completeSet(activeExIdx, setIdx)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90 ${
                        set.completed
                          ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30'
                          : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-500 hover:text-zinc-200 border border-zinc-700'
                      }`}
                      title={set.completed ? 'Série concluída' : 'Marcar série concluída'}
                    >
                      <Check size={18} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Set Button */}
          <div className="p-3 bg-[#151520] border-t border-zinc-800 flex justify-between items-center">
            <button
              onClick={() => addSetToExercise(activeExIdx)}
              className="text-xs text-[#CCFF00] hover:text-[#b8e600] font-bold flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-zinc-800/60 active:scale-95 transition-all"
            >
              <Plus size={15} /> Adicionar Série
            </button>

            <button
              onClick={() => startRestTimer(currentExercise.restSeconds, currentExercise.exerciseName)}
              className="text-xs text-zinc-300 hover:text-white font-medium flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-zinc-800 transition-all"
            >
              <Clock size={14} className="text-zinc-400" /> Iniciar Descanso ({currentExercise.restSeconds}s)
            </button>
          </div>
        </div>

        {/* Health & Safety / Pain Flag Button */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            onClick={() => setShowDiscomfortModal(true)}
            className="flex-1 py-2.5 px-3 rounded-2xl bg-zinc-900 border border-amber-500/30 hover:border-amber-500/60 text-amber-300 text-xs font-semibold flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <AlertTriangle size={15} />
            Sinalizar Dor ou Desconforto
          </button>

          <button
            onClick={handleCancelWorkout}
            className="py-2.5 px-3 rounded-2xl bg-zinc-900 border border-red-500/30 hover:border-red-500/60 text-red-400 text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <StopCircle size={15} />
            Descartar
          </button>
        </div>

        {/* Previous / Next Exercise Navigation */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            disabled={activeExIdx === 0}
            onClick={() => setActiveExIdx(prev => Math.max(0, prev - 1))}
            className="flex-1 py-3 px-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold text-xs flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-800 transition-all"
          >
            <ChevronLeft size={16} /> Anterior
          </button>

          <button
            disabled={activeExIdx === activeSession.exercises.length - 1}
            onClick={() => setActiveExIdx(prev => Math.min(activeSession.exercises.length - 1, prev + 1))}
            className="flex-1 py-3 px-4 rounded-2xl bg-[#CCFF00] text-black font-extrabold text-xs flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#b8e600] transition-all shadow-md shadow-[#CCFF00]/15"
          >
            Próximo <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* MODAL 1: Substituir Exercício */}
      {showReplaceModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121218] border border-zinc-800 rounded-3xl w-full max-w-md p-5 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-white">Substituir Exercício</h3>
                <p className="text-xs text-zinc-400">
                  Aparelho ocupado? Escolha uma alternativa para {currentExercise.exerciseName}:
                </p>
              </div>
              <button
                onClick={() => setShowReplaceModal(false)}
                className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>

            <div className="overflow-y-auto space-y-2 flex-1 pr-1">
              {EXERCISE_DATABASE.filter(
                ex => ex.id !== currentExercise.exerciseId && (ex.category === currentExercise.category || currentExercise.alternatives?.includes(ex.id))
              ).map(alt => (
                <button
                  key={alt.id}
                  onClick={() => {
                    replaceExerciseInActiveSession(activeExIdx, alt.id);
                    setShowReplaceModal(false);
                  }}
                  className="w-full p-3 rounded-2xl bg-[#191924] border border-zinc-800 hover:border-[#CCFF00] text-left transition-all flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-xs text-white">{alt.name}</div>
                    <div className="text-[10px] text-zinc-400 capitalize">
                      {alt.equipment} • {alt.difficulty}
                    </div>
                  </div>
                  <RefreshCw size={14} className="text-zinc-500" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Sinalizar Dor / Desconforto (Safety requirement 10) */}
      {showDiscomfortModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14141c] border border-amber-500/40 rounded-3xl w-full max-w-md p-5 space-y-4">
            <div className="flex items-center gap-2 text-amber-400">
              <AlertTriangle size={22} />
              <h3 className="font-bold text-base text-white">Segurança Articular</h3>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Dor em articulações, tendões ou desconforto anormal não é sinal de ganho muscular.
              Ao sinal de dor aguda ou pinçamento, suspenda imediatamente o exercício.
            </p>

            <div>
              <label className="text-xs font-semibold text-zinc-300 mb-1 block">
                Onde você sentiu desconforto?
              </label>
              <input
                type="text"
                placeholder="Ex: Fisgada no ombro direito na descida"
                value={discomfortNote}
                onChange={e => setDiscomfortNote(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  setShowDiscomfortModal(false);
                  setShowReplaceModal(true);
                }}
                className="w-full py-2.5 rounded-xl bg-amber-400/20 border border-amber-400 text-amber-200 text-xs font-bold transition-all"
              >
                Trocar por exercício de menor impacto articular
              </button>
              <button
                onClick={() => {
                  setShowDiscomfortModal(false);
                  // advance to next exercise if available
                  if (activeExIdx < activeSession.exercises.length - 1) {
                    setActiveExIdx(activeExIdx + 1);
                  }
                }}
                className="w-full py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-semibold"
              >
                Pular este exercício hoje
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Finalizar Treino & Resumo */}
      {showFinishModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#12121a] border border-zinc-800 rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#CCFF00]/20 text-[#CCFF00] flex items-center justify-center mx-auto border border-[#CCFF00]/40">
                <Flame size={26} />
              </div>
              <h3 className="font-extrabold text-xl text-white">Treino Concluído!</h3>
              <p className="text-xs text-zinc-400">
                Excelente trabalho. Seus dados de carga e repetições foram persistidos.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2.5 bg-zinc-900/90 border border-zinc-800 p-3 rounded-2xl text-center">
              <div>
                <div className="text-[10px] text-zinc-400 uppercase font-semibold">Volume</div>
                <div className="font-mono-numbers font-black text-sm text-[#CCFF00]">
                  {activeSession.totalVolumeKg.toLocaleString()} kg
                </div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-400 uppercase font-semibold">Duração</div>
                <div className="font-mono-numbers font-black text-sm text-white">
                  {formatElapsed(activeSession.elapsedSeconds)}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-400 uppercase font-semibold">Séries Feitas</div>
                <div className="font-mono-numbers font-black text-sm text-emerald-400">
                  {completedSetsCount}/{totalSetsCount}
                </div>
              </div>
            </div>

            {/* Perceived Effort (RPE) */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-zinc-300 mb-1.5">
                <span>Esforço Percebido Geral (RPE)</span>
                <span className="font-mono-numbers font-bold text-[#CCFF00]">
                  {userRpeOverall} / 10
                </span>
              </div>
              <div className="flex gap-1.5">
                {[6, 7, 8, 9, 10].map(rpe => (
                  <button
                    key={rpe}
                    onClick={() => setUserRpeOverall(rpe)}
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-mono-numbers font-bold transition-all ${
                      userRpeOverall === rpe
                        ? 'border-[#CCFF00] bg-[#CCFF00] text-black'
                        : 'border-zinc-800 bg-zinc-900 text-zinc-400'
                    }`}
                  >
                    {rpe}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs font-semibold text-zinc-300 mb-1 block">
                Notas do treino (opcional)
              </label>
              <textarea
                rows={2}
                value={workoutNotes}
                onChange={e => setWorkoutNotes(e.target.value)}
                placeholder="Ex: Excelente pump no peitoral superior. Sentimento de força elevado no supino."
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#CCFF00]"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowFinishModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 text-xs font-semibold hover:bg-zinc-800"
              >
                Voltar
              </button>
              <button
                onClick={handleFinishConfirm}
                className="flex-1 py-2.5 rounded-xl bg-[#CCFF00] hover:bg-[#b8e600] text-black font-extrabold text-xs shadow-lg shadow-[#CCFF00]/30 transition-all"
              >
                Salvar & Finalizar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
