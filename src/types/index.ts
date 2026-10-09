export type FitnessGoal = 
  | 'hipertrofia' 
  | 'forca' 
  | 'emagrecimento' 
  | 'recomposicao' 
  | 'condicionamento' 
  | 'saude_geral';

export type ExperienceLevel = 'iniciante' | 'intermediario' | 'avancado';

export type SplitType = 'ABC' | 'ABCD' | 'ABCDE' | 'UPPER_LOWER' | 'FULL_BODY' | 'CUSTOM';

export type GymType = 'academia_completa' | 'academia_basica' | 'treino_em_casa';

export type MuscleGroup = 
  | 'peito' 
  | 'costas' 
  | 'pernas' 
  | 'quadriceps'
  | 'posterior'
  | 'panturrilha'
  | 'ombros' 
  | 'biceps' 
  | 'triceps' 
  | 'core';

export interface UserProfile {
  id: string;
  name: string;
  birthDate?: string;
  age?: number;
  gender?: 'masculino' | 'feminino' | 'outro' | 'nao_informar';
  heightCm: number;
  currentWeightKg: number;
  targetWeightKg?: number;
  goal: FitnessGoal;
  experienceLevel: ExperienceLevel;
  daysPerWeek: number;
  sessionDurationMinutes: number;
  gymType: GymType;
  availableEquipment: string[];
  injuries: string[];
  limitationsNotes?: string;
  preferredSplit: SplitType;
  soundAlertsEnabled: boolean;
  vibrationEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Exercise {
  id: string;
  name: string;
  category: MuscleGroup;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  equipment: 'barra' | 'halteres' | 'polia' | 'maquina' | 'peso_corporal';
  difficulty: ExperienceLevel;
  instructions: string[];
  commonMistakes: string[];
  safetyNotes: string;
  defaultRepRange: string; // e.g. "8-12"
  defaultRestSeconds: number; // e.g. 90
  alternatives: string[]; // Exercise names or IDs
}

export interface WorkoutExercise {
  exerciseId: string;
  exerciseName: string;
  targetSets: number;
  repRange: string; // e.g. "8-12"
  suggestedLoadKg: number;
  restSeconds: number;
  notes?: string;
  alternatives?: string[];
}

export interface WorkoutRoutine {
  id: string;
  name: string; // e.g. "Treino A - Peito & Tríceps"
  tag: string; // e.g. "A"
  splitType: SplitType;
  description: string;
  targetMuscles: string[];
  exercises: WorkoutExercise[];
}

export interface WorkoutPlan {
  id: string;
  name: string;
  splitType: SplitType;
  description: string;
  routines: WorkoutRoutine[];
  active: boolean;
  createdAt: string;
}

export interface LiveSet {
  id: string;
  setNumber: number;
  previousLoadKg?: number;
  previousReps?: number;
  targetReps: string;
  plannedLoadKg: number;
  actualLoadKg: number;
  actualReps: number;
  rpe?: number; // 6 to 10
  completed: boolean;
  completedAt?: string;
}

export interface LiveExerciseState {
  exerciseId: string;
  exerciseName: string;
  category: MuscleGroup;
  restSeconds: number;
  notes?: string;
  alternatives: string[];
  sets: LiveSet[];
  currentSetIndex: number;
}

export interface ActiveWorkoutSession {
  id: string;
  routineId?: string;
  routineName: string;
  splitType?: SplitType;
  startTime: string; // ISO
  elapsedSeconds: number;
  exercises: LiveExerciseState[];
  currentExerciseIndex: number;
  isPaused: boolean;
  totalVolumeKg: number;
}

export interface LoggedSet {
  setNumber: number;
  targetReps: string;
  loadKg: number;
  reps: number;
  rpe?: number;
  timestamp: string;
}

export interface LoggedExercise {
  exerciseId: string;
  exerciseName: string;
  category: MuscleGroup;
  sets: LoggedSet[];
  notes?: string;
}

export interface CompletedWorkoutSession {
  id: string;
  routineId?: string;
  routineName: string;
  splitType?: SplitType;
  startTime: string;
  endTime: string;
  durationSeconds: number;
  exercises: LoggedExercise[];
  totalVolumeKg: number;
  notes?: string;
  userPerceivedEffort?: number;
  painReported?: string;
}

export interface ProgressionRecommendation {
  exerciseId: string;
  exerciseName: string;
  previousLoadKg: number;
  previousReps: number[];
  targetRepRange: string;
  suggestedNextLoadKg: number;
  suggestedNextRepRange: string;
  reason: string;
  status: 'READY_FOR_LOAD_INCREASE' | 'PROGRESS_REPS' | 'MAINTAIN' | 'FATIGUE_DELOAD';
  confidence: 'alta' | 'moderada';
}

export interface BodyMeasurement {
  id: string;
  date: string; // YYYY-MM-DD
  weightKg?: number;
  chestCm?: number;
  waistCm?: number;
  rightArmCm?: number;
  leftArmCm?: number;
  hipsCm?: number;
  rightThighCm?: number;
  leftThighCm?: number;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestions?: string[];
}
