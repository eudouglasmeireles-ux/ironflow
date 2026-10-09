import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WorkoutRoutine, WorkoutExercise, Exercise, SplitType, WorkoutPlan } from '../../types';
import { EXERCISE_DATABASE, getExerciseById } from '../../data/exercises';
import {
  Play,
  Plus,
  Trash2,
  Edit2,
  ChevronRight,
  Dumbbell,
  Search,
  Sparkles,
  Info,
  Clock,
  Layers,
  Check,
  X,
  AlertCircle
} from 'lucide-react';

interface WorkoutListViewProps {
  onStartRoutine: (routine: WorkoutRoutine) => void;
  onOpenLiveWorkout: () => void;
}

export const WorkoutListView: React.FC<WorkoutListViewProps> = ({
  onStartRoutine,
  onOpenLiveWorkout
}) => {
  const {
    workoutPlans,
    activePlan,
    setActivePlanId,
    saveCustomPlan,
    deletePlan,
    userProfile
  } = useApp();

  const [selectedRoutine, setSelectedRoutine] = useState<WorkoutRoutine | null>(null);
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [showGeneratorModal, setShowGeneratorModal] = useState(false);
  const [exerciseDetails, setExerciseDetails] = useState<Exercise | null>(null);

  // Exercise Library filter states
  const [libraryCategory, setLibraryCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  // AI Generator local state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatorSplit, setGeneratorSplit] = useState<SplitType>(userProfile.preferredSplit || 'ABCD');
  const [generatorDays, setGeneratorDays] = useState(userProfile.daysPerWeek || 4);

  const categories = [
    { id: 'todos', label: 'Todos' },
    { id: 'peito', label: 'Peito' },
    { id: 'costas', label: 'Costas' },
    { id: 'pernas', label: 'Pernas' },
    { id: 'ombros', label: 'Ombros' },
    { id: 'biceps', label: 'Bíceps' },
    { id: 'triceps', label: 'Tríceps' },
    { id: 'core', label: 'Core / Abd' }
  ];

  const filteredExercises = EXERCISE_DATABASE.filter(ex => {
    const matchesCat = libraryCategory === 'todos' || ex.category === libraryCategory;
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.primaryMuscles.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  // Handle adding exercise to selected routine
  const handleAddExerciseToRoutine = (ex: Exercise) => {
    if (!selectedRoutine) return;

    const newEx: WorkoutExercise = {
      exerciseId: ex.id,
      exerciseName: ex.name,
      targetSets: 3,
      repRange: ex.defaultRepRange || '8-12',
      suggestedLoadKg: 20,
      restSeconds: ex.defaultRestSeconds || 90,
      notes: ''
    };

    const updatedRoutines = activePlan.routines.map(r => {
      if (r.id === selectedRoutine.id) {
        return {
          ...r,
          exercises: [...r.exercises, newEx]
        };
      }
      return r;
    });

    const updatedPlan: WorkoutPlan = {
      ...activePlan,
      routines: updatedRoutines
    };

    saveCustomPlan(updatedPlan);
    setSelectedRoutine({
      ...selectedRoutine,
      exercises: [...selectedRoutine.exercises, newEx]
    });
    setShowLibraryModal(false);
  };

  // Remove exercise from selected routine
  const handleRemoveExercise = (idx: number) => {
    if (!selectedRoutine) return;
    const updatedExercises = selectedRoutine.exercises.filter((_, i) => i !== idx);

    const updatedRoutines = activePlan.routines.map(r => {
      if (r.id === selectedRoutine.id) {
        return {
          ...r,
          exercises: updatedExercises
        };
      }
      return r;
    });

    const updatedPlan: WorkoutPlan = {
      ...activePlan,
      routines: updatedRoutines
    };

    saveCustomPlan(updatedPlan);
    setSelectedRoutine({
      ...selectedRoutine,
      exercises: updatedExercises
    });
  };

  // Call Server Gemini API or Heuristic to generate workout
  const handleGenerateWorkout = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/gemini/generate-workout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile: {
            ...userProfile,
            preferredSplit: generatorSplit,
            daysPerWeek: generatorDays
          }
        })
      });

      if (res.ok) {
        const generated = await res.json();
        if (generated && generated.routines && generated.routines.length > 0) {
          const newPlan: WorkoutPlan = {
            id: `plan_ai_${Date.now()}`,
            name: generated.name || `IRONFLOW — ${generatorSplit} Personalizado`,
            splitType: generatorSplit,
            description: generated.description || 'Programa montado e calibrado individualmente.',
            routines: generated.routines.map((r: any, idx: number) => ({
              id: `routine_ai_${idx}_${Date.now()}`,
              name: r.name,
              tag: r.tag || String.fromCharCode(65 + idx),
              splitType: generatorSplit,
              description: r.description || '',
              targetMuscles: r.targetMuscles || [],
              exercises: r.exercises || []
            })),
            active: true,
            createdAt: new Date().toISOString()
          };

          saveCustomPlan(newPlan);
          setActivePlanId(newPlan.id);
          setShowGeneratorModal(false);
        }
      } else {
        alert('Serviço de IA indisponível no momento. Você pode selecionar um dos programas padrão como ABCD ou ABC.');
      }
    } catch {
      alert('Erro de conexão com o servidor.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-5 pb-28 pt-2">
      {/* Header & Plan Selection */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            PROGRAMAS DE TREINO
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Fichas & Rotinas
          </h1>
        </div>

        <button
          onClick={() => setShowGeneratorModal(true)}
          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#CCFF00] to-[#99cc00] hover:opacity-90 active:scale-95 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-[#CCFF00]/15 transition-all"
        >
          <Sparkles size={15} />
          Nova Ficha
        </button>
      </div>

      {/* Plan Selector Carousel */}
      <div className="overflow-x-auto flex gap-2 pb-1 no-scrollbar">
        {workoutPlans.map(plan => {
          const isActive = plan.id === activePlan.id;
          return (
            <button
              key={plan.id}
              onClick={() => setActivePlanId(plan.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-2 ${
                isActive
                  ? 'border-[#CCFF00] bg-[#CCFF00]/10 text-white shadow-md'
                  : 'border-zinc-800 bg-[#14141c] text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <Layers size={14} className={isActive ? 'text-[#CCFF00]' : 'text-zinc-500'} />
              <span>{plan.name}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Active Plan Description */}
      <div className="bg-[#12121a] border border-zinc-800/80 rounded-2xl p-3.5 text-xs text-zinc-400 flex items-center justify-between">
        <span className="line-clamp-1">{activePlan.description}</span>
        <span className="font-mono-numbers text-[11px] text-zinc-500 shrink-0 ml-2">
          {activePlan.routines.length} divisões
        </span>
      </div>

      {/* Routine Cards Grid */}
      <div className="space-y-3">
        {activePlan.routines.map((routine, idx) => {
          return (
            <div
              key={routine.id}
              className="bg-[#14141c] border border-zinc-800/80 hover:border-zinc-700/80 rounded-3xl p-4.5 transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#CCFF00]/15 text-[#CCFF00] font-black font-mono-numbers text-lg flex items-center justify-center border border-[#CCFF00]/30 shrink-0">
                    {routine.tag}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-white tracking-tight">
                      {routine.name}
                    </h3>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {routine.targetMuscles.map((m, mIdx) => (
                        <span
                          key={mIdx}
                          className="text-[10px] text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded-md"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedRoutine(routine)}
                  className="w-9 h-9 rounded-xl bg-zinc-800/60 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-all shrink-0"
                  title="Ver detalhes e editar exercícios"
                >
                  <Edit2 size={16} />
                </button>
              </div>

              {/* Exercises summary line */}
              <div className="text-xs text-zinc-400 pt-1 border-t border-zinc-800 flex items-center justify-between">
                <span>{routine.exercises.length} exercícios planejados</span>
                <span className="text-[11px] text-zinc-500">
                  {routine.exercises.reduce((a, b) => a + b.targetSets, 0)} séries no total
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => {
                    onStartRoutine(routine);
                    onOpenLiveWorkout();
                  }}
                  className="flex-1 py-3 rounded-2xl bg-[#CCFF00] hover:bg-[#b8e600] active:scale-[0.98] text-black font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#CCFF00]/15"
                >
                  <Play size={16} fill="black" />
                  Iniciar Treino {routine.tag}
                </button>
                <button
                  onClick={() => setSelectedRoutine(routine)}
                  className="py-3 px-4 rounded-2xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 font-bold text-xs flex items-center justify-center transition-all"
                >
                  Ver Ficha
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Access to Full Exercise Library */}
      <button
        onClick={() => {
          setSelectedRoutine(null);
          setShowLibraryModal(true);
        }}
        className="w-full p-4 rounded-3xl bg-[#14141c] border border-zinc-800 hover:border-zinc-700 text-left transition-all flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-zinc-800 text-[#CCFF00] flex items-center justify-center">
            <Dumbbell size={20} />
          </div>
          <div>
            <div className="font-bold text-sm text-white">Biblioteca Completa de Exercícios</div>
            <div className="text-xs text-zinc-400">
              Biometria, instruções passo a passo e alternativas
            </div>
          </div>
        </div>
        <ChevronRight size={18} className="text-zinc-500" />
      </button>

      {/* MODAL 1: Detalhes & Edição da Rotina */}
      {selectedRoutine && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#12121a] border border-zinc-800 rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="p-4.5 border-b border-zinc-800 bg-[#161622] flex items-center justify-between shrink-0">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#CCFF00] tracking-wider">
                  Divisão {selectedRoutine.tag}
                </span>
                <h3 className="font-black text-lg text-white">
                  {selectedRoutine.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRoutine(null)}
                className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>

            {/* Exercise List */}
            <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
              {selectedRoutine.exercises.map((ex, exIdx) => {
                return (
                  <div
                    key={`${ex.exerciseId}_${exIdx}`}
                    className="p-3.5 rounded-2xl bg-[#181824] border border-zinc-800/80 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono-numbers font-extrabold text-sm text-zinc-500 w-5">
                        #{exIdx + 1}
                      </span>
                      <div>
                        <div className="font-bold text-sm text-white">{ex.exerciseName}</div>
                        <div className="text-xs text-zinc-400 flex items-center gap-2 mt-0.5">
                          <span>{ex.targetSets} séries</span>
                          <span>•</span>
                          <span>{ex.repRange} reps</span>
                          <span>•</span>
                          <span>{ex.restSeconds}s rest</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          const db = getExerciseById(ex.exerciseId);
                          if (db) setExerciseDetails(db);
                        }}
                        className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center"
                        title="Ver instruções"
                      >
                        <Info size={15} />
                      </button>
                      <button
                        onClick={() => handleRemoveExercise(exIdx)}
                        className="w-8 h-8 rounded-lg bg-zinc-800/60 hover:bg-red-950/60 text-zinc-500 hover:text-red-400 flex items-center justify-center"
                        title="Remover exercício da ficha"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Add Exercise to Routine Button */}
              <button
                onClick={() => setShowLibraryModal(true)}
                className="w-full py-3 rounded-2xl border-2 border-dashed border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-[#CCFF00] font-bold text-xs flex items-center justify-center gap-2 transition-all mt-3"
              >
                <Plus size={16} /> Adicionar Exercício da Biblioteca
              </button>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-zinc-800 bg-[#161622] flex items-center justify-between gap-3 shrink-0">
              <button
                onClick={() => setSelectedRoutine(null)}
                className="px-4 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 text-xs font-semibold"
              >
                Fechar
              </button>

              <button
                onClick={() => {
                  onStartRoutine(selectedRoutine);
                  setSelectedRoutine(null);
                  onOpenLiveWorkout();
                }}
                className="px-6 py-2.5 rounded-xl bg-[#CCFF00] hover:bg-[#b8e600] text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-[#CCFF00]/20"
              >
                <Play size={15} fill="black" />
                Iniciar Treino Agora
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Biblioteca de Exercícios */}
      {showLibraryModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#12121a] border border-zinc-800 rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            {/* Header */}
            <div className="p-4.5 border-b border-zinc-800 bg-[#161622] space-y-3 shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-lg text-white">
                    Biblioteca de Exercícios
                  </h3>
                  <p className="text-xs text-zinc-400">
                    {selectedRoutine ? `Adicionar a ${selectedRoutine.name}` : 'Explore biomecânica e instruções'}
                  </p>
                </div>
                <button
                  onClick={() => setShowLibraryModal(false)}
                  className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Buscar exercício ou músculo..."
                  className="w-full bg-[#1c1c28] border border-zinc-700/80 rounded-xl pl-10 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#CCFF00]"
                />
              </div>

              {/* Category Pills */}
              <div className="overflow-x-auto flex gap-1.5 pb-0.5 no-scrollbar">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setLibraryCategory(cat.id)}
                    className={`px-3 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all ${
                      libraryCategory === cat.id
                        ? 'bg-[#CCFF00] text-black'
                        : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="p-4 overflow-y-auto space-y-2 flex-1">
              {filteredExercises.map(ex => (
                <div
                  key={ex.id}
                  className="p-3.5 rounded-2xl bg-[#181824] border border-zinc-800 hover:border-zinc-700 transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex-1 cursor-pointer" onClick={() => setExerciseDetails(ex)}>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white hover:text-[#CCFF00] transition-colors">
                        {ex.name}
                      </span>
                      <span className="text-[10px] uppercase font-semibold text-[#CCFF00] bg-zinc-900 px-2 py-0.2 rounded-md">
                        {ex.category}
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-1 capitalize">
                      {ex.equipment} • {ex.difficulty} • Faixa: {ex.defaultRepRange} reps
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setExerciseDetails(ex)}
                      className="w-8 h-8 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center"
                      title="Ver detalhes biomecânicos"
                    >
                      <Info size={15} />
                    </button>
                    {selectedRoutine && (
                      <button
                        onClick={() => handleAddExerciseToRoutine(ex)}
                        className="px-3 py-1.5 rounded-lg bg-[#CCFF00] text-black font-extrabold text-xs flex items-center gap-1 hover:bg-[#b8e600] active:scale-95 transition-all"
                      >
                        <Plus size={14} /> Adicionar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Detalhes Biomecânicos do Exercício */}
      {exerciseDetails && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#12121a] border border-zinc-800 rounded-3xl w-full max-w-md p-5 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#CCFF00] tracking-wider px-2 py-0.5 rounded-full bg-zinc-800">
                  {exerciseDetails.category}
                </span>
                <h3 className="font-extrabold text-lg text-white mt-1">
                  {exerciseDetails.name}
                </h3>
              </div>
              <button
                onClick={() => setExerciseDetails(null)}
                className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>

            {/* Muscles recruitment */}
            <div className="text-xs space-y-1">
              <div className="text-zinc-400">
                Músculos Primários: <strong className="text-white">{exerciseDetails.primaryMuscles.join(', ')}</strong>
              </div>
              {exerciseDetails.secondaryMuscles.length > 0 && (
                <div className="text-zinc-500">
                  Secundários: {exerciseDetails.secondaryMuscles.join(', ')}
                </div>
              )}
            </div>

            {/* Instructions list */}
            <div className="space-y-2 pt-2 border-t border-zinc-800">
              <div className="font-bold text-xs text-[#CCFF00]">
                Execução Passo a Passo:
              </div>
              <ul className="list-disc pl-4 space-y-1.5 text-xs text-zinc-300">
                {exerciseDetails.instructions.map((ins, i) => (
                  <li key={i}>{ins}</li>
                ))}
              </ul>
            </div>

            {/* Common Mistakes */}
            {exerciseDetails.commonMistakes.length > 0 && (
              <div className="space-y-1 pt-2 border-t border-zinc-800">
                <div className="font-bold text-xs text-amber-400">
                  Erros Comuns a Evitar:
                </div>
                <ul className="list-disc pl-4 space-y-1 text-xs text-zinc-400">
                  {exerciseDetails.commonMistakes.map((mis, i) => (
                    <li key={i}>{mis}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Safety note */}
            {exerciseDetails.safetyNotes && (
              <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-[11px] text-zinc-300">
                🛡️ <strong className="text-zinc-100">Segurança Articular:</strong> {exerciseDetails.safetyNotes}
              </div>
            )}

            <button
              onClick={() => setExerciseDetails(null)}
              className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-all"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* MODAL 4: Gerador de Ficha com IA */}
      {showGeneratorModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#12121a] border border-zinc-800 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2.5 text-[#CCFF00]">
              <Sparkles size={22} />
              <h3 className="font-black text-lg text-white">
                Gerador Inteligente de Fichas
              </h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Cria um programa sob medida calibrando volume semanal, grupos musculares
              e compatibilidade com seus equipamentos.
            </p>

            <div>
              <label className="text-xs font-semibold text-zinc-300 mb-1.5 block">
                Divisão Desejada
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'ABCD' as SplitType, label: 'ABCD' },
                  { id: 'ABC' as SplitType, label: 'ABC (Push/Pull/Legs)' },
                  { id: 'UPPER_LOWER' as SplitType, label: 'Upper / Lower' },
                  { id: 'FULL_BODY' as SplitType, label: 'Full Body' }
                ].map(sp => (
                  <button
                    key={sp.id}
                    onClick={() => setGeneratorSplit(sp.id)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      generatorSplit === sp.id
                        ? 'border-[#CCFF00] bg-[#CCFF00]/15 text-[#CCFF00]'
                        : 'border-zinc-800 bg-zinc-900 text-zinc-400'
                    }`}
                  >
                    {sp.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 mb-1.5 block">
                Dias por semana
              </label>
              <div className="flex gap-2">
                {[3, 4, 5, 6].map(d => (
                  <button
                    key={d}
                    onClick={() => setGeneratorDays(d)}
                    className={`flex-1 py-1.5 rounded-xl border text-xs font-mono-numbers font-bold transition-all ${
                      generatorDays === d
                        ? 'border-[#CCFF00] bg-[#CCFF00] text-black'
                        : 'border-zinc-800 bg-zinc-900 text-zinc-400'
                    }`}
                  >
                    {d}x
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                disabled={isGenerating}
                onClick={() => setShowGeneratorModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                disabled={isGenerating}
                onClick={handleGenerateWorkout}
                className="flex-1 py-2.5 rounded-xl bg-[#CCFF00] hover:bg-[#b8e600] text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#CCFF00]/20 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Sparkles size={15} />
                    Gerar Ficha
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
