import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  ActiveWorkoutSession,
  BodyMeasurement,
  CompletedWorkoutSession,
  Exercise,
  LiveExerciseState,
  LiveSet,
  UserProfile,
  WorkoutPlan,
  WorkoutRoutine
} from '../types';
import { DEFAULT_WORKOUT_PLANS } from '../data/workoutTemplates';
import { EXERCISE_DATABASE, getExerciseById } from '../data/exercises';
import { INITIAL_BODY_MEASUREMENTS, INITIAL_USER_PROFILE, INITIAL_WORKOUT_HISTORY } from '../data/mockSeedData';
import { calculateWorkoutVolume } from '../utils/progressionEngine';
import { soundService } from '../utils/audioAlerts';

export interface RestTimerState {
  isActive: boolean;
  isPaused: boolean;
  totalSeconds: number;
  remainingSeconds: number;
  targetEndTime: number | null;
  exerciseName?: string;
  nextSetNumber?: number;
  totalSets?: number;
  isFinishedAlertOpen: boolean;
}

interface AppContextType {
  // Profile
  userProfile: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => void;
  isOnboardingCompleted: boolean;
  setIsOnboardingCompleted: (val: boolean) => void;

  // Plans & Routines
  workoutPlans: WorkoutPlan[];
  activePlan: WorkoutPlan;
  setActivePlanId: (planId: string) => void;
  saveCustomPlan: (plan: WorkoutPlan) => void;
  deletePlan: (planId: string) => void;

  // Active Live Workout
  activeSession: ActiveWorkoutSession | null;
  startWorkout: (routine: WorkoutRoutine) => void;
  updateActiveSet: (exerciseIndex: number, setIndex: number, changes: Partial<LiveSet>) => void;
  completeSet: (exerciseIndex: number, setIndex: number) => void;
  addSetToExercise: (exerciseIndex: number) => void;
  replaceExerciseInActiveSession: (exerciseIndex: number, newExerciseId: string) => void;
  finishActiveWorkout: (notes?: string, userEffort?: number, painReported?: string) => CompletedWorkoutSession | null;
  cancelActiveWorkout: () => void;
  hasRecoveredSession: boolean;
  dismissRecoveredSession: () => void;

  // Rest Timer
  restTimer: RestTimerState;
  startRestTimer: (seconds: number, exerciseName?: string, nextSetNumber?: number, totalSets?: number) => void;
  adjustRestTimer: (deltaSeconds: number) => void;
  skipRestTimer: () => void;
  pauseRestTimer: () => void;
  resumeRestTimer: () => void;
  dismissRestFinishedAlert: () => void;

  // History & Progress
  history: CompletedWorkoutSession[];
  deleteHistorySession: (sessionId: string) => void;
  getPreviousPerformance: (exerciseId: string) => { loadKg: number; reps: number } | null;

  // Body Measurements
  measurements: BodyMeasurement[];
  addMeasurement: (measurement: Omit<BodyMeasurement, 'id'>) => void;
  deleteMeasurement: (id: string) => void;

  // Backup & Reset
  exportData: () => string;
  importData: (jsonData: string) => boolean;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROFILE: 'ironflow_profile',
  ONBOARDING: 'ironflow_onboarding_done',
  PLANS: 'ironflow_workout_plans',
  ACTIVE_PLAN_ID: 'ironflow_active_plan_id',
  HISTORY: 'ironflow_history',
  MEASUREMENTS: 'ironflow_measurements',
  ACTIVE_SESSION: 'ironflow_active_session',
  REST_TIMER: 'ironflow_rest_timer'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
  });

  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.ONBOARDING) === 'true';
  });

  // 2. Plans State
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PLANS);
    return saved ? JSON.parse(saved) : DEFAULT_WORKOUT_PLANS;
  });

  const [activePlanId, setActivePlanIdState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_PLAN_ID) || 'plan_abcd_hipertrofia';
  });

  const activePlan = workoutPlans.find(p => p.id === activePlanId) || workoutPlans[0] || DEFAULT_WORKOUT_PLANS[0];

  // 3. History State
  const [history, setHistory] = useState<CompletedWorkoutSession[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return saved ? JSON.parse(saved) : INITIAL_WORKOUT_HISTORY;
  });

  // 4. Body Measurements State
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MEASUREMENTS);
    return saved ? JSON.parse(saved) : INITIAL_BODY_MEASUREMENTS;
  });

  // 5. Active Live Workout Session
  const [activeSession, setActiveSession] = useState<ActiveWorkoutSession | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION);
    return saved ? JSON.parse(saved) : null;
  });

  const [hasRecoveredSession, setHasRecoveredSession] = useState<boolean>(() => {
    return !!localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION);
  });

  // 6. Rest Timer State
  const [restTimer, setRestTimer] = useState<RestTimerState>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REST_TIMER);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.targetEndTime && parsed.targetEndTime > Date.now()) {
          const remaining = Math.max(0, Math.round((parsed.targetEndTime - Date.now()) / 1000));
          return {
            ...parsed,
            remainingSeconds: remaining,
            isActive: remaining > 0,
            isFinishedAlertOpen: false
          };
        }
      } catch {
        // Fallback
      }
    }
    return {
      isActive: false,
      isPaused: false,
      totalSeconds: 90,
      remainingSeconds: 0,
      targetEndTime: null,
      isFinishedAlertOpen: false
    };
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ONBOARDING, isOnboardingCompleted ? 'true' : 'false');
  }, [isOnboardingCompleted]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(workoutPlans));
  }, [workoutPlans]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PLAN_ID, activePlanId);
  }, [activePlanId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEASUREMENTS, JSON.stringify(measurements));
  }, [measurements]);

  useEffect(() => {
    if (activeSession) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(activeSession));
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
    }
  }, [activeSession]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REST_TIMER, JSON.stringify(restTimer));
  }, [restTimer]);

  // Rest Timer Interval with background recovery
  const timerIntervalRef = useRef<any>(null);

  useEffect(() => {
    if (!restTimer.isActive || restTimer.isPaused || !restTimer.targetEndTime) {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      return;
    }

    timerIntervalRef.current = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.round((restTimer.targetEndTime! - now) / 1000));

      if (remaining === 3 || remaining === 2 || remaining === 1) {
        if (userProfile.soundAlertsEnabled) {
          soundService.playCountdownPip(remaining === 1 ? 800 : 660);
        }
      }

      if (remaining <= 0) {
        clearInterval(timerIntervalRef.current);
        if (userProfile.soundAlertsEnabled) {
          soundService.playRestCompleteChime();
        }
        if (userProfile.vibrationEnabled) {
          soundService.vibrate([300, 150, 400]);
        }
        setRestTimer(prev => ({
          ...prev,
          isActive: false,
          remainingSeconds: 0,
          targetEndTime: null,
          isFinishedAlertOpen: true
        }));
      } else {
        setRestTimer(prev => ({
          ...prev,
          remainingSeconds: remaining
        }));
      }
    }, 500);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [restTimer.isActive, restTimer.isPaused, restTimer.targetEndTime, userProfile.soundAlertsEnabled, userProfile.vibrationEnabled]);

  // Workout Session elapsed time ticker
  useEffect(() => {
    if (!activeSession || activeSession.isPaused) return;

    const interval = setInterval(() => {
      setActiveSession(prev => {
        if (!prev) return null;
        return {
          ...prev,
          elapsedSeconds: prev.elapsedSeconds + 1
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeSession?.isPaused, activeSession !== null]);

  // Helper to query previous performance for an exercise
  const getPreviousPerformance = (exerciseId: string) => {
    for (const session of history) {
      const ex = session.exercises.find(e => e.exerciseId === exerciseId);
      if (ex && ex.sets && ex.sets.length > 0) {
        const completedSets = ex.sets.filter(s => s.loadKg > 0 && s.reps > 0);
        if (completedSets.length > 0) {
          const maxLoad = Math.max(...completedSets.map(s => s.loadKg));
          const matchSet = completedSets.find(s => s.loadKg === maxLoad) || completedSets[0];
          return { loadKg: matchSet.loadKg, reps: matchSet.reps };
        }
      }
    }
    return null;
  };

  // --- Profile Actions ---
  const updateProfile = (profileChanges: Partial<UserProfile>) => {
    setUserProfile(prev => ({
      ...prev,
      ...profileChanges,
      updatedAt: new Date().toISOString()
    }));
  };

  // --- Plans Actions ---
  const setActivePlanId = (id: string) => {
    setActivePlanIdState(id);
    setWorkoutPlans(prev => prev.map(p => ({ ...p, active: p.id === id })));
  };

  const saveCustomPlan = (newPlan: WorkoutPlan) => {
    setWorkoutPlans(prev => {
      const exists = prev.some(p => p.id === newPlan.id);
      if (exists) {
        return prev.map(p => p.id === newPlan.id ? newPlan : p);
      }
      return [newPlan, ...prev];
    });
    setActivePlanId(newPlan.id);
  };

  const deletePlan = (planId: string) => {
    setWorkoutPlans(prev => prev.filter(p => p.id !== planId));
    if (activePlanId === planId) {
      const remaining = workoutPlans.filter(p => p.id !== planId);
      if (remaining.length > 0) {
        setActivePlanId(remaining[0].id);
      }
    }
  };

  // --- Active Workout Actions ---
  const startWorkout = (routine: WorkoutRoutine) => {
    const liveExercises: LiveExerciseState[] = routine.exercises.map(we => {
      const dbEx = getExerciseById(we.exerciseId);
      const prev = getPreviousPerformance(we.exerciseId);
      const targetLoad = prev ? prev.loadKg : we.suggestedLoadKg;
      const sets: LiveSet[] = Array.from({ length: we.targetSets }, (_, idx) => ({
        id: `set_${we.exerciseId}_${idx + 1}_${Date.now()}`,
        setNumber: idx + 1,
        previousLoadKg: prev?.loadKg,
        previousReps: prev?.reps,
        targetReps: we.repRange,
        plannedLoadKg: targetLoad,
        actualLoadKg: targetLoad,
        actualReps: parseInt(we.repRange.split('-')[0], 10) || 10,
        rpe: 8,
        completed: false
      }));

      return {
        exerciseId: we.exerciseId,
        exerciseName: we.exerciseName,
        category: dbEx?.category || 'peito',
        restSeconds: we.restSeconds,
        notes: we.notes,
        alternatives: we.alternatives || dbEx?.alternatives || [],
        sets,
        currentSetIndex: 0
      };
    });

    const newSession: ActiveWorkoutSession = {
      id: `session_${Date.now()}`,
      routineId: routine.id,
      routineName: routine.name,
      splitType: routine.splitType,
      startTime: new Date().toISOString(),
      elapsedSeconds: 0,
      exercises: liveExercises,
      currentExerciseIndex: 0,
      isPaused: false,
      totalVolumeKg: 0
    };

    setActiveSession(newSession);
    setHasRecoveredSession(false);
  };

  const updateActiveSet = (exerciseIndex: number, setIndex: number, changes: Partial<LiveSet>) => {
    setActiveSession(prev => {
      if (!prev) return null;
      const updatedExercises = [...prev.exercises];
      const targetEx = { ...updatedExercises[exerciseIndex] };
      const updatedSets = [...targetEx.sets];
      
      updatedSets[setIndex] = {
        ...updatedSets[setIndex],
        ...changes
      };
      targetEx.sets = updatedSets;
      updatedExercises[exerciseIndex] = targetEx;

      // Recalculate estimated total volume
      let volume = 0;
      for (const ex of updatedExercises) {
        for (const s of ex.sets) {
          if (s.completed && s.actualLoadKg > 0 && s.actualReps > 0) {
            volume += s.actualLoadKg * s.actualReps;
          }
        }
      }

      return {
        ...prev,
        exercises: updatedExercises,
        totalVolumeKg: volume
      };
    });
  };

  const completeSet = (exerciseIndex: number, setIndex: number) => {
    if (!activeSession) return;
    const currentEx = activeSession.exercises[exerciseIndex];
    const targetSet = currentEx.sets[setIndex];
    const isNowCompleted = !targetSet.completed;

    updateActiveSet(exerciseIndex, setIndex, {
      completed: isNowCompleted,
      completedAt: isNowCompleted ? new Date().toISOString() : undefined
    });

    // If marked as completed, trigger rest timer
    if (isNowCompleted) {
      soundService.unlockAudio();
      startRestTimer(
        currentEx.restSeconds || 90,
        currentEx.exerciseName,
        setIndex + 2,
        currentEx.sets.length
      );
    }
  };

  const addSetToExercise = (exerciseIndex: number) => {
    setActiveSession(prev => {
      if (!prev) return null;
      const updatedExercises = [...prev.exercises];
      const targetEx = { ...updatedExercises[exerciseIndex] };
      const lastSet = targetEx.sets[targetEx.sets.length - 1];
      const newSetNumber = targetEx.sets.length + 1;

      const newSet: LiveSet = {
        id: `set_${targetEx.exerciseId}_${newSetNumber}_${Date.now()}`,
        setNumber: newSetNumber,
        previousLoadKg: lastSet?.previousLoadKg,
        previousReps: lastSet?.previousReps,
        targetReps: lastSet?.targetReps || '8-12',
        plannedLoadKg: lastSet?.actualLoadKg || 20,
        actualLoadKg: lastSet?.actualLoadKg || 20,
        actualReps: lastSet?.actualReps || 10,
        rpe: 8,
        completed: false
      };

      targetEx.sets = [...targetEx.sets, newSet];
      updatedExercises[exerciseIndex] = targetEx;

      return {
        ...prev,
        exercises: updatedExercises
      };
    });
  };

  const replaceExerciseInActiveSession = (exerciseIndex: number, newExerciseId: string) => {
    const newEx = getExerciseById(newExerciseId);
    if (!newEx) return;

    const prev = getPreviousPerformance(newExerciseId);
    const suggestedLoad = prev ? prev.loadKg : 20;

    setActiveSession(prevSession => {
      if (!prevSession) return null;
      const updatedExercises = [...prevSession.exercises];
      const oldEx = updatedExercises[exerciseIndex];

      const newSets: LiveSet[] = oldEx.sets.map((s, idx) => ({
        id: `set_${newExerciseId}_${idx + 1}_${Date.now()}`,
        setNumber: idx + 1,
        previousLoadKg: prev?.loadKg,
        previousReps: prev?.reps,
        targetReps: newEx.defaultRepRange || '8-12',
        plannedLoadKg: suggestedLoad,
        actualLoadKg: suggestedLoad,
        actualReps: 10,
        rpe: 8,
        completed: false
      }));

      updatedExercises[exerciseIndex] = {
        exerciseId: newEx.id,
        exerciseName: newEx.name,
        category: newEx.category,
        restSeconds: newEx.defaultRestSeconds || 90,
        notes: `Substituto de ${oldEx.exerciseName}`,
        alternatives: newEx.alternatives,
        sets: newSets,
        currentSetIndex: 0
      };

      return {
        ...prevSession,
        exercises: updatedExercises
      };
    });
  };

  const finishActiveWorkout = (notes?: string, userEffort?: number, painReported?: string): CompletedWorkoutSession | null => {
    if (!activeSession) return null;

    const loggedExercises = activeSession.exercises
      .map(ex => ({
        exerciseId: ex.exerciseId,
        exerciseName: ex.exerciseName,
        category: ex.category,
        notes: ex.notes,
        sets: ex.sets
          .filter(s => s.completed && s.actualReps > 0)
          .map(s => ({
            setNumber: s.setNumber,
            targetReps: s.targetReps,
            loadKg: s.actualLoadKg,
            reps: s.actualReps,
            rpe: s.rpe || 8,
            timestamp: s.completedAt || new Date().toISOString()
          }))
      }))
      .filter(ex => ex.sets.length > 0);

    const totalVolume = calculateWorkoutVolume(loggedExercises);
    const completedSession: CompletedWorkoutSession = {
      id: `completed_${Date.now()}`,
      routineId: activeSession.routineId,
      routineName: activeSession.routineName,
      splitType: activeSession.splitType,
      startTime: activeSession.startTime,
      endTime: new Date().toISOString(),
      durationSeconds: Math.max(60, activeSession.elapsedSeconds),
      exercises: loggedExercises,
      totalVolumeKg: totalVolume,
      notes: notes || undefined,
      userPerceivedEffort: userEffort || 8,
      painReported: painReported || undefined
    };

    setHistory(prev => [completedSession, ...prev]);
    setActiveSession(null);
    setHasRecoveredSession(false);
    skipRestTimer();

    return completedSession;
  };

  const cancelActiveWorkout = () => {
    setActiveSession(null);
    setHasRecoveredSession(false);
    skipRestTimer();
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
  };

  const dismissRecoveredSession = () => {
    setHasRecoveredSession(false);
  };

  // --- Rest Timer Actions ---
  const startRestTimer = (seconds: number, exerciseName?: string, nextSetNumber?: number, totalSets?: number) => {
    soundService.unlockAudio();
    const targetEndTime = Date.now() + seconds * 1000;
    setRestTimer({
      isActive: true,
      isPaused: false,
      totalSeconds: seconds,
      remainingSeconds: seconds,
      targetEndTime,
      exerciseName,
      nextSetNumber,
      totalSets,
      isFinishedAlertOpen: false
    });
  };

  const adjustRestTimer = (deltaSeconds: number) => {
    setRestTimer(prev => {
      if (!prev.isActive || !prev.targetEndTime) return prev;
      const newRemaining = Math.max(5, prev.remainingSeconds + deltaSeconds);
      const newTarget = Date.now() + newRemaining * 1000;
      return {
        ...prev,
        totalSeconds: Math.max(prev.totalSeconds, newRemaining),
        remainingSeconds: newRemaining,
        targetEndTime: newTarget
      };
    });
  };

  const skipRestTimer = () => {
    setRestTimer(prev => ({
      ...prev,
      isActive: false,
      isPaused: false,
      totalSeconds: 90,
      remainingSeconds: 0,
      targetEndTime: null,
      isFinishedAlertOpen: false
    }));
    localStorage.removeItem(STORAGE_KEYS.REST_TIMER);
  };

  const pauseRestTimer = () => {
    setRestTimer(prev => ({
      ...prev,
      isPaused: true
    }));
  };

  const resumeRestTimer = () => {
    setRestTimer(prev => {
      if (!prev.isPaused) return prev;
      const targetEndTime = Date.now() + prev.remainingSeconds * 1000;
      return {
        ...prev,
        isPaused: false,
        targetEndTime
      };
    });
  };

  const dismissRestFinishedAlert = () => {
    setRestTimer(prev => ({
      ...prev,
      isFinishedAlertOpen: false
    }));
  };

  // --- History & Measurements Actions ---
  const deleteHistorySession = (sessionId: string) => {
    setHistory(prev => prev.filter(s => s.id !== sessionId));
  };

  const addMeasurement = (data: Omit<BodyMeasurement, 'id'>) => {
    const newEntry: BodyMeasurement = {
      ...data,
      id: `bm_${Date.now()}`
    };
    setMeasurements(prev => [newEntry, ...prev]);

    // Also update current weight on userProfile if provided
    if (data.weightKg) {
      updateProfile({ currentWeightKg: data.weightKg });
    }
  };

  const deleteMeasurement = (id: string) => {
    setMeasurements(prev => prev.filter(m => m.id !== id));
  };

  // --- Backup & Data Management ---
  const exportData = () => {
    const payload = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      userProfile,
      workoutPlans,
      history,
      measurements
    };
    return JSON.stringify(payload, null, 2);
  };

  const importData = (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      if (data.userProfile) setUserProfile(data.userProfile);
      if (Array.isArray(data.workoutPlans)) setWorkoutPlans(data.workoutPlans);
      if (Array.isArray(data.history)) setHistory(data.history);
      if (Array.isArray(data.measurements)) setMeasurements(data.measurements);
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  };

  const resetAllData = () => {
    setUserProfile(INITIAL_USER_PROFILE);
    setWorkoutPlans(DEFAULT_WORKOUT_PLANS);
    setHistory([]);
    setMeasurements([]);
    setActiveSession(null);
    skipRestTimer();
    setIsOnboardingCompleted(false);
    localStorage.clear();
  };

  return (
    <AppContext.Provider
      value={{
        userProfile,
        updateProfile,
        isOnboardingCompleted,
        setIsOnboardingCompleted,
        workoutPlans,
        activePlan,
        setActivePlanId,
        saveCustomPlan,
        deletePlan,
        activeSession,
        startWorkout,
        updateActiveSet,
        completeSet,
        addSetToExercise,
        replaceExerciseInActiveSession,
        finishActiveWorkout,
        cancelActiveWorkout,
        hasRecoveredSession,
        dismissRecoveredSession,
        restTimer,
        startRestTimer,
        adjustRestTimer,
        skipRestTimer,
        pauseRestTimer,
        resumeRestTimer,
        dismissRestFinishedAlert,
        history,
        deleteHistorySession,
        getPreviousPerformance,
        measurements,
        addMeasurement,
        deleteMeasurement,
        exportData,
        importData,
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
