import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getVolumeByMuscleGroup, calculateEstimated1RM } from '../../utils/progressionEngine';
import { EXERCISE_DATABASE } from '../../data/exercises';
import {
  TrendingUp,
  Award,
  Calendar,
  Scale,
  Dumbbell,
  Clock,
  Sparkles,
  Plus,
  Trash2,
  ChevronRight,
  BarChart2
} from 'lucide-react';

export const ProgressView: React.FC = () => {
  const { history, userProfile, measurements, addMeasurement, deleteMeasurement } = useApp();

  const [periodDays, setPeriodDays] = useState<number>(30);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('supino_reto_barra');
  const [showAddMeasurementModal, setShowAddMeasurementModal] = useState(false);

  // New measurement form state
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newWeight, setNewWeight] = useState(userProfile.currentWeightKg.toString());
  const [newChest, setNewChest] = useState('');
  const [newWaist, setNewWaist] = useState('');
  const [newArm, setNewArm] = useState('');
  const [newHips, setNewHips] = useState('');
  const [newThigh, setNewThigh] = useState('');

  // Filter history by period
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - periodDays);
  const filteredSessions = history.filter(s => new Date(s.startTime) >= cutoff);

  // Aggregate metrics
  const totalVolume = filteredSessions.reduce((acc, s) => acc + s.totalVolumeKg, 0);
  const totalDurationMinutes = filteredSessions.reduce(
    (acc, s) => acc + Math.round(s.durationSeconds / 60),
    0
  );
  const avgDuration = filteredSessions.length > 0 ? Math.round(totalDurationMinutes / filteredSessions.length) : 0;
  const volumeByMuscle = getVolumeByMuscleGroup(filteredSessions, periodDays);

  // Find max volume muscle
  const maxMuscleVol = Math.max(...Object.values(volumeByMuscle), 1);

  // Exercise Load Progression Data Points
  const exerciseDataPoints: { date: string; maxLoadKg: number; totalReps: number; est1RM: number }[] = [];
  for (const session of history) {
    const exLog = session.exercises.find(e => e.exerciseId === selectedExerciseId);
    if (exLog && exLog.sets && exLog.sets.length > 0) {
      const validSets = exLog.sets.filter(s => s.loadKg > 0 && s.reps > 0);
      if (validSets.length > 0) {
        const maxLoad = Math.max(...validSets.map(s => s.loadKg));
        const maxSet = validSets.find(s => s.loadKg === maxLoad) || validSets[0];
        const est1RM = calculateEstimated1RM(maxSet.loadKg, maxSet.reps);
        const totalReps = validSets.reduce((acc, s) => acc + s.reps, 0);

        exerciseDataPoints.push({
          date: new Date(session.startTime).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
          maxLoadKg: maxLoad,
          totalReps,
          est1RM
        });
      }
    }
  }

  // Reverse so chronological from left to right
  exerciseDataPoints.reverse();

  // Personal Records (PRs) calculation across all history
  const personalRecords: { name: string; maxLoad: number; best1RM: number }[] = [];
  const exerciseTracker: Record<string, { name: string; maxLoad: number; best1RM: number }> = {};

  for (const session of history) {
    for (const ex of session.exercises) {
      for (const s of ex.sets) {
        if (s.loadKg > 0 && s.reps > 0) {
          const current1RM = calculateEstimated1RM(s.loadKg, s.reps);
          if (!exerciseTracker[ex.exerciseId]) {
            exerciseTracker[ex.exerciseId] = {
              name: ex.exerciseName,
              maxLoad: s.loadKg,
              best1RM: current1RM
            };
          } else {
            exerciseTracker[ex.exerciseId].maxLoad = Math.max(exerciseTracker[ex.exerciseId].maxLoad, s.loadKg);
            exerciseTracker[ex.exerciseId].best1RM = Math.max(exerciseTracker[ex.exerciseId].best1RM, current1RM);
          }
        }
      }
    }
  }

  const topPrs = Object.values(exerciseTracker).slice(0, 5);

  const handleSaveMeasurement = () => {
    addMeasurement({
      date: newDate,
      weightKg: newWeight ? parseFloat(newWeight) : undefined,
      chestCm: newChest ? parseFloat(newChest) : undefined,
      waistCm: newWaist ? parseFloat(newWaist) : undefined,
      rightArmCm: newArm ? parseFloat(newArm) : undefined,
      hipsCm: newHips ? parseFloat(newHips) : undefined,
      rightThighCm: newThigh ? parseFloat(newThigh) : undefined
    });
    setShowAddMeasurementModal(false);
  };

  // Nutritional estimation guidelines
  const estimatedProteinGrams = Math.round(userProfile.currentWeightKg * 2.0); // 2.0g/kg
  const estimatedMaintenanceCalories = Math.round(userProfile.currentWeightKg * 33);

  return (
    <div className="space-y-5 pb-28 pt-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            ANÁLISE DE PERFORMANCE
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Evolução & Métricas
          </h1>
        </div>

        {/* Period Selector */}
        <div className="bg-[#14141c] border border-zinc-800 p-1 rounded-2xl flex items-center gap-1">
          {[
            { days: 7, label: '7d' },
            { days: 30, label: '30d' },
            { days: 90, label: '90d' },
            { days: 365, label: 'Tudo' }
          ].map(p => (
            <button
              key={p.days}
              onClick={() => setPeriodDays(p.days)}
              className={`px-2.5 py-1 rounded-xl text-xs font-mono-numbers font-bold transition-all ${
                periodDays === p.days
                  ? 'bg-[#CCFF00] text-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-[#14141c] border border-zinc-800 p-3.5 rounded-3xl">
          <div className="text-[10px] uppercase font-bold text-zinc-400 mb-1">
            Treinos Feitos
          </div>
          <div className="font-mono-numbers font-black text-xl text-white">
            {filteredSessions.length}
          </div>
          <div className="text-[10px] text-zinc-400 mt-0.5">
            no período
          </div>
        </div>

        <div className="bg-[#14141c] border border-zinc-800 p-3.5 rounded-3xl">
          <div className="text-[10px] uppercase font-bold text-zinc-400 mb-1">
            Volume Total
          </div>
          <div className="font-mono-numbers font-black text-xl text-[#CCFF00]">
            {(totalVolume / 1000).toFixed(1)}k <span className="text-xs font-normal text-zinc-400">kg</span>
          </div>
          <div className="text-[10px] text-zinc-400 mt-0.5">
            Σ séries×reps×kg
          </div>
        </div>

        <div className="bg-[#14141c] border border-zinc-800 p-3.5 rounded-3xl">
          <div className="text-[10px] uppercase font-bold text-zinc-400 mb-1">
            Tempo Médio
          </div>
          <div className="font-mono-numbers font-black text-xl text-white">
            {avgDuration} <span className="text-xs font-normal text-zinc-400">min</span>
          </div>
          <div className="text-[10px] text-zinc-400 mt-0.5">
            por sessão
          </div>
        </div>
      </div>

      {/* 1. Load Progression Chart for Chosen Exercise */}
      <div className="bg-[#14141c] border border-zinc-800 rounded-3xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-[#CCFF00]" />
            <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">
              Evolução de Cargas & 1RM
            </h3>
          </div>

          {/* Exercise Dropdown */}
          <select
            value={selectedExerciseId}
            onChange={e => setSelectedExerciseId(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#CCFF00]"
          >
            {EXERCISE_DATABASE.map(ex => (
              <option key={ex.id} value={ex.id}>
                {ex.name}
              </option>
            ))}
          </select>
        </div>

        {/* Visual Bar / Point Chart */}
        {exerciseDataPoints.length > 0 ? (
          <div className="space-y-3">
            <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-zinc-800">
              {exerciseDataPoints.map((pt, idx) => {
                const maxInChart = Math.max(...exerciseDataPoints.map(p => p.maxLoadKg), 1);
                const heightPercent = Math.max(15, (pt.maxLoadKg / maxInChart) * 100);

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[10px] font-mono-numbers font-bold text-zinc-300 opacity-80 group-hover:opacity-100 group-hover:text-[#CCFF00]">
                      {pt.maxLoadKg}kg
                    </span>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full max-w-[36px] bg-gradient-to-t from-zinc-800 to-[#CCFF00] rounded-t-xl group-hover:brightness-125 transition-all shadow-md"
                    />
                    <span className="text-[10px] font-mono-numbers text-zinc-500">
                      {pt.date}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
              <span>
                Última carga:{' '}
                <strong className="text-white font-mono-numbers">
                  {exerciseDataPoints[exerciseDataPoints.length - 1].maxLoadKg} kg
                </strong>
              </span>
              <span>
                1RM Estimado (Epley):{' '}
                <strong className="text-[#CCFF00] font-mono-numbers">
                  {exerciseDataPoints[exerciseDataPoints.length - 1].est1RM} kg
                </strong>
              </span>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-zinc-500">
            Nenhuma sessão registrada para este exercício ainda. Execute o treino ao vivo para gerar dados no gráfico.
          </div>
        )}
      </div>

      {/* 2. Volume by Muscle Group */}
      <div className="bg-[#14141c] border border-zinc-800 rounded-3xl p-5 space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart2 size={18} className="text-[#CCFF00]" />
            <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">
              Volume por Grupamento (kg)
            </h3>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono-numbers">
            Últimos {periodDays} dias
          </span>
        </div>

        <div className="space-y-2.5">
          {Object.entries(volumeByMuscle).map(([muscle, vol]) => {
            const pct = Math.round((vol / maxMuscleVol) * 100);
            return (
              <div key={muscle} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="capitalize font-semibold text-zinc-300">
                    {muscle}
                  </span>
                  <span className="font-mono-numbers text-zinc-400">
                    {vol.toLocaleString()} kg
                  </span>
                </div>
                <div className="w-full bg-zinc-800/80 h-2 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${pct}%` }}
                    className="h-full bg-[#CCFF00] rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Personal Records (PRs) */}
      <div className="bg-[#14141c] border border-zinc-800 rounded-3xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Award size={18} className="text-[#CCFF00]" />
          <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">
            Recordes Pessoais (PR)
          </h3>
        </div>

        <div className="divide-y divide-zinc-800">
          {topPrs.map((pr, i) => (
            <div key={i} className="py-2.5 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-white">{pr.name}</div>
                <div className="text-[10px] text-zinc-400">
                  Melhor carga absoluta: {pr.maxLoad} kg
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-zinc-500 uppercase">1RM Estimado</div>
                <div className="font-mono-numbers font-black text-sm text-[#CCFF00]">
                  {pr.best1RM} kg
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Medidas Corporais & Peso */}
      <div className="bg-[#14141c] border border-zinc-800 rounded-3xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale size={18} className="text-[#CCFF00]" />
            <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">
              Medidas Corporais & Peso
            </h3>
          </div>

          <button
            onClick={() => setShowAddMeasurementModal(true)}
            className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white flex items-center gap-1.5 transition-all"
          >
            <Plus size={14} /> Registrar
          </button>
        </div>

        {/* Current Weight vs Goal */}
        <div className="grid grid-cols-2 gap-3 bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-800">
          <div>
            <div className="text-[10px] uppercase font-semibold text-zinc-500">
              Peso Atual
            </div>
            <div className="font-mono-numbers font-black text-xl text-white">
              {userProfile.currentWeightKg} <span className="text-xs text-zinc-400 font-normal">kg</span>
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-semibold text-zinc-500">
              Peso Alvo
            </div>
            <div className="font-mono-numbers font-black text-xl text-[#CCFF00]">
              {userProfile.targetWeightKg || '—'} <span className="text-xs text-zinc-400 font-normal">kg</span>
            </div>
          </div>
        </div>

        {/* Nutritional Estimates Disclaimer Card */}
        <div className="p-3 bg-zinc-900/50 border border-zinc-800/80 rounded-2xl text-xs space-y-1">
          <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
            Estimativas Nutricionais Sugeridas
          </div>
          <div className="flex justify-between text-zinc-300">
            <span>Meta de Proteína (~2.0g/kg):</span>
            <strong className="text-white font-mono-numbers">{estimatedProteinGrams} g/dia</strong>
          </div>
          <div className="flex justify-between text-zinc-300">
            <span>Calorias Basais Estimadas:</span>
            <strong className="text-white font-mono-numbers">~{estimatedMaintenanceCalories} kcal</strong>
          </div>
          <p className="text-[10px] text-zinc-400 pt-1">
            * Valores meramente estimativos. Não impõe restrições alimentares.
          </p>
        </div>

        {/* Measurement History Table */}
        {measurements.length > 0 && (
          <div className="space-y-2 pt-1">
            <div className="text-xs font-bold text-zinc-400">Histórico de Registros:</div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {measurements.map(m => (
                <div
                  key={m.id}
                  className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs flex items-center justify-between"
                >
                  <div>
                    <div className="font-mono-numbers font-bold text-white">
                      {m.date}: {m.weightKg} kg
                    </div>
                    <div className="text-[10px] text-zinc-400">
                      {m.chestCm ? `Tórax: ${m.chestCm}cm ` : ''}
                      {m.waistCm ? `Cintura: ${m.waistCm}cm ` : ''}
                      {m.rightArmCm ? `Braço: ${m.rightArmCm}cm` : ''}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteMeasurement(m.id)}
                    className="text-zinc-500 hover:text-red-400 p-1"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: Adicionar Medição */}
      {showAddMeasurementModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#12121a] border border-zinc-800 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-lg text-white">
              Nova Medição Física
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-zinc-300 mb-1 block">
                  Data
                </label>
                <input
                  type="date"
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#CCFF00]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 mb-1 block">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newWeight}
                  onChange={e => setNewWeight(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white font-mono-numbers focus:outline-none focus:border-[#CCFF00]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 mb-1 block">
                  Tórax (cm)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={newChest}
                  onChange={e => setNewChest(e.target.value)}
                  placeholder="Ex: 104"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white font-mono-numbers focus:outline-none focus:border-[#CCFF00]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 mb-1 block">
                  Cintura (cm)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={newWaist}
                  onChange={e => setNewWaist(e.target.value)}
                  placeholder="Ex: 82"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white font-mono-numbers focus:outline-none focus:border-[#CCFF00]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 mb-1 block">
                  Braço (cm)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={newArm}
                  onChange={e => setNewArm(e.target.value)}
                  placeholder="Ex: 38"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white font-mono-numbers focus:outline-none focus:border-[#CCFF00]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 mb-1 block">
                  Coxa (cm)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={newThigh}
                  onChange={e => setNewThigh(e.target.value)}
                  placeholder="Ex: 59"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white font-mono-numbers focus:outline-none focus:border-[#CCFF00]"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => setShowAddMeasurementModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveMeasurement}
                className="flex-1 py-2.5 rounded-xl bg-[#CCFF00] hover:bg-[#b8e600] text-black font-extrabold text-xs shadow-lg shadow-[#CCFF00]/20"
              >
                Salvar Medidas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
