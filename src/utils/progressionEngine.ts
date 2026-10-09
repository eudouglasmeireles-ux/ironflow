import { CompletedWorkoutSession, LoggedExercise, ProgressionRecommendation } from '../types';

/**
 * Parses a rep range string like "8-12", "6-8", "12-15", "10"
 */
export function parseRepRange(rangeStr: string): { min: number; max: number } {
  if (!rangeStr) return { min: 8, max: 12 };
  const parts = rangeStr.split('-').map(p => parseInt(p.trim(), 10)).filter(n => !isNaN(n));
  if (parts.length >= 2) {
    return { min: parts[0], max: parts[1] };
  } else if (parts.length === 1) {
    return { min: parts[0], max: parts[0] };
  }
  return { min: 8, max: 12 };
}

/**
 * Evaluates double progression for a specific exercise based on previous sessions
 */
export function evaluateDoubleProgression(
  exerciseId: string,
  exerciseName: string,
  targetRepRange: string,
  history: CompletedWorkoutSession[]
): ProgressionRecommendation | null {
  // Find all past occurrences of this exercise in history, sorted by session date descending
  const relevantSessions: { session: CompletedWorkoutSession; exerciseLog: LoggedExercise }[] = [];

  for (const session of history) {
    const exLog = session.exercises.find(e => e.exerciseId === exerciseId);
    if (exLog && exLog.sets && exLog.sets.length > 0) {
      relevantSessions.push({ session, exerciseLog: exLog });
    }
  }

  if (relevantSessions.length === 0) {
    return null;
  }

  const latest = relevantSessions[0].exerciseLog;
  const latestSets = latest.sets.filter(s => s.reps > 0);
  if (latestSets.length === 0) return null;

  const { min, max } = parseRepRange(targetRepRange || '8-12');
  
  // Find common or average load used in the latest session
  const maxLoad = Math.max(...latestSets.map(s => s.loadKg));
  const minLoad = Math.min(...latestSets.map(s => s.loadKg));
  const currentLoad = maxLoad > 0 ? maxLoad : (minLoad > 0 ? minLoad : 20);

  const repsArray = latestSets.map(s => s.reps);
  const avgRpe = latestSets.reduce((acc, s) => acc + (s.rpe || 8), 0) / latestSets.length;
  
  // Check if all completed sets hit or exceeded the top of the rep range (e.g. 12 reps)
  const hitMaxRepsAllSets = latestSets.every(s => s.reps >= max);
  const hitAtLeastMinReps = latestSets.every(s => s.reps >= min);
  const avgReps = latestSets.reduce((acc, s) => acc + s.reps, 0) / latestSets.length;

  // Check if load increment is small and safe:
  // For small isolation exercises (< 25kg): +1kg to +2kg (halteres/polia)
  // For compound / legs (> 60kg): +2.5kg to +5kg
  let increment = 2.5;
  if (currentLoad <= 15) {
    increment = 1;
  } else if (currentLoad <= 35) {
    increment = 2;
  } else if (currentLoad >= 80) {
    increment = 5;
  } else {
    increment = 2.5;
  }

  // 1. Ready for load progression
  if (hitMaxRepsAllSets && avgRpe <= 9) {
    const nextLoad = currentLoad + increment;
    return {
      exerciseId,
      exerciseName,
      previousLoadKg: currentLoad,
      previousReps: repsArray,
      targetRepRange,
      suggestedNextLoadKg: nextLoad,
      suggestedNextRepRange: `${min}-${max}`,
      reason: `Você completou com sucesso ${max} repetições em todas as séries com esforço controlado (RPE médio ${avgRpe.toFixed(1)}). A regra de progressão dupla indica aumento de carga de +${increment} kg para continuar estimulando adaptação muscular.`,
      status: 'READY_FOR_LOAD_INCREASE',
      confidence: 'alta'
    };
  }

  // 2. High fatigue or dropped below min reps
  if (!hitAtLeastMinReps || avgRpe >= 9.8) {
    return {
      exerciseId,
      exerciseName,
      previousLoadKg: currentLoad,
      previousReps: repsArray,
      targetRepRange,
      suggestedNextLoadKg: currentLoad,
      suggestedNextRepRange: `${min}-${max}`,
      reason: `Rendimento exigente detectado (repetições: [${repsArray.join(', ')}]). Mantenha a carga de ${currentLoad} kg na próxima sessão para consolidar a técnica e atingir a faixa mínima de ${min} repetições antes de qualquer aumento.`,
      status: 'MAINTAIN',
      confidence: 'alta'
    };
  }

  // 3. Normal progress in reps (Double progression step 1)
  const targetRepsNext = Math.min(max, Math.round(avgReps + 1));
  return {
    exerciseId,
    exerciseName,
    previousLoadKg: currentLoad,
    previousReps: repsArray,
    targetRepRange,
    suggestedNextLoadKg: currentLoad,
    suggestedNextRepRange: `${targetRepsNext}-${max}`,
    reason: `Você atingiu em média ${avgReps.toFixed(1)} reps com ${currentLoad} kg. Mantenha a carga e busque alcançar ${targetRepsNext} a ${max} repetições com boa cadência na próxima sessão.`,
    status: 'PROGRESS_REPS',
    confidence: 'moderada'
  };
}

/**
 * Calculates Estimated 1RM using Epley formula: Load * (1 + Reps / 30)
 */
export function calculateEstimated1RM(loadKg: number, reps: number): number {
  if (loadKg <= 0 || reps <= 0) return 0;
  if (reps === 1) return loadKg;
  // Standard Epley formula
  const oneRm = loadKg * (1 + reps / 30);
  return Math.round(oneRm * 10) / 10;
}

/**
 * Calculates total volume in kg = sum(load * reps)
 */
export function calculateWorkoutVolume(exercises: LoggedExercise[]): number {
  let total = 0;
  for (const ex of exercises) {
    for (const set of ex.sets) {
      if (set.loadKg > 0 && set.reps > 0) {
        total += set.loadKg * set.reps;
      }
    }
  }
  return Math.round(total);
}

/**
 * Aggregates volume lifted per muscle group from workout history
 */
export function getVolumeByMuscleGroup(
  sessions: CompletedWorkoutSession[],
  daysLimit = 30
): Record<string, number> {
  const result: Record<string, number> = {
    peito: 0,
    costas: 0,
    pernas: 0,
    ombros: 0,
    biceps: 0,
    triceps: 0,
    core: 0
  };

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - daysLimit);

  for (const session of sessions) {
    const sessionDate = new Date(session.startTime);
    if (sessionDate >= cutoff) {
      for (const ex of session.exercises) {
        const cat = ex.category || 'peito';
        let exVol = 0;
        for (const s of ex.sets) {
          exVol += (s.loadKg || 0) * (s.reps || 0);
        }
        if (result[cat] !== undefined) {
          result[cat] += exVol;
        } else {
          result[cat] = exVol;
        }
      }
    }
  }

  return result;
}
