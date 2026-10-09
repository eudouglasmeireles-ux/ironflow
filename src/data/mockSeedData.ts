import { CompletedWorkoutSession, UserProfile, BodyMeasurement } from '../types';

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'usr_main_user',
  name: 'Alex Silva',
  birthDate: '1996-05-14',
  age: 30,
  gender: 'masculino',
  heightCm: 178,
  currentWeightKg: 78.5,
  targetWeightKg: 82.0,
  goal: 'hipertrofia',
  experienceLevel: 'intermediario',
  daysPerWeek: 4,
  sessionDurationMinutes: 60,
  gymType: 'academia_completa',
  availableEquipment: ['barra', 'halteres', 'polia', 'maquina'],
  injuries: [],
  limitationsNotes: 'Sem limitações ou dores prévias.',
  preferredSplit: 'ABCD',
  soundAlertsEnabled: true,
  vibrationEnabled: true,
  createdAt: '2026-09-15T10:00:00.000Z',
  updatedAt: '2026-10-01T10:00:00.000Z'
};

export const INITIAL_BODY_MEASUREMENTS: BodyMeasurement[] = [
  { id: 'bm_1', date: '2026-09-01', weightKg: 77.2, chestCm: 102, waistCm: 83, rightArmCm: 37.0, leftArmCm: 36.8, hipsCm: 99, rightThighCm: 58, leftThighCm: 58 },
  { id: 'bm_2', date: '2026-09-15', weightKg: 77.8, chestCm: 103, waistCm: 83, rightArmCm: 37.5, leftArmCm: 37.2, hipsCm: 99, rightThighCm: 58.5, leftThighCm: 58.5 },
  { id: 'bm_3', date: '2026-10-01', weightKg: 78.5, chestCm: 104, waistCm: 82.5, rightArmCm: 38.0, leftArmCm: 37.8, hipsCm: 100, rightThighCm: 59.2, leftThighCm: 59.0 }
];

export const INITIAL_WORKOUT_HISTORY: CompletedWorkoutSession[] = [
  {
    id: 'sess_prev_1',
    routineId: 'routine_abcd_a',
    routineName: 'Treino A — Peitoral & Tríceps',
    splitType: 'ABCD',
    startTime: '2026-10-03T18:00:00.000Z',
    endTime: '2026-10-03T19:02:00.000Z',
    durationSeconds: 3720,
    totalVolumeKg: 6840,
    exercises: [
      {
        exerciseId: 'supino_reto_barra',
        exerciseName: 'Supino Reto com Barra',
        category: 'peito',
        sets: [
          { setNumber: 1, targetReps: '8-10', loadKg: 50, reps: 10, rpe: 8, timestamp: '2026-10-03T18:10:00.000Z' },
          { setNumber: 2, targetReps: '8-10', loadKg: 50, reps: 10, rpe: 8, timestamp: '2026-10-03T18:14:00.000Z' },
          { setNumber: 3, targetReps: '8-10', loadKg: 50, reps: 10, rpe: 8.5, timestamp: '2026-10-03T18:18:00.000Z' },
          { setNumber: 4, targetReps: '8-10', loadKg: 50, reps: 10, rpe: 9, timestamp: '2026-10-03T18:22:00.000Z' }
        ]
      },
      {
        exerciseId: 'supino_inclinado_halteres',
        exerciseName: 'Supino Inclinado com Halteres',
        category: 'peito',
        sets: [
          { setNumber: 1, targetReps: '8-12', loadKg: 22, reps: 12, rpe: 8, timestamp: '2026-10-03T18:28:00.000Z' },
          { setNumber: 2, targetReps: '8-12', loadKg: 22, reps: 12, rpe: 8.5, timestamp: '2026-10-03T18:32:00.000Z' },
          { setNumber: 3, targetReps: '8-12', loadKg: 22, reps: 12, rpe: 9, timestamp: '2026-10-03T18:36:00.000Z' }
        ]
      },
      {
        exerciseId: 'peck_deck_voador',
        exerciseName: 'Peck Deck / Voador',
        category: 'peito',
        sets: [
          { setNumber: 1, targetReps: '10-12', loadKg: 45, reps: 12, rpe: 8, timestamp: '2026-10-03T18:42:00.000Z' },
          { setNumber: 2, targetReps: '10-12', loadKg: 45, reps: 12, rpe: 8.5, timestamp: '2026-10-03T18:45:00.000Z' },
          { setNumber: 3, targetReps: '10-12', loadKg: 45, reps: 11, rpe: 9, timestamp: '2026-10-03T18:48:00.000Z' }
        ]
      },
      {
        exerciseId: 'triceps_polia_corda',
        exerciseName: 'Tríceps na Polia com Corda',
        category: 'triceps',
        sets: [
          { setNumber: 1, targetReps: '10-12', loadKg: 30, reps: 12, rpe: 7.5, timestamp: '2026-10-03T18:52:00.000Z' },
          { setNumber: 2, targetReps: '10-12', loadKg: 30, reps: 12, rpe: 8, timestamp: '2026-10-03T18:55:00.000Z' },
          { setNumber: 3, targetReps: '10-12', loadKg: 30, reps: 12, rpe: 8.5, timestamp: '2026-10-03T18:58:00.000Z' }
        ]
      }
    ]
  },
  {
    id: 'sess_prev_2',
    routineId: 'routine_abcd_b',
    routineName: 'Treino B — Dorsal & Bíceps',
    splitType: 'ABCD',
    startTime: '2026-10-05T18:30:00.000Z',
    endTime: '2026-10-05T19:25:00.000Z',
    durationSeconds: 3300,
    totalVolumeKg: 7200,
    exercises: [
      {
        exerciseId: 'puxada_alta_frente',
        exerciseName: 'Puxada Alta Frontal (Pulldown)',
        category: 'costas',
        sets: [
          { setNumber: 1, targetReps: '8-12', loadKg: 55, reps: 12, rpe: 8, timestamp: '2026-10-05T18:38:00.000Z' },
          { setNumber: 2, targetReps: '8-12', loadKg: 55, reps: 12, rpe: 8.5, timestamp: '2026-10-05T18:42:00.000Z' },
          { setNumber: 3, targetReps: '8-12', loadKg: 55, reps: 12, rpe: 9, timestamp: '2026-10-05T18:46:00.000Z' }
        ]
      },
      {
        exerciseId: 'remada_curvada_barra',
        exerciseName: 'Remada Curvada com Barra',
        category: 'costas',
        sets: [
          { setNumber: 1, targetReps: '8-10', loadKg: 45, reps: 10, rpe: 8, timestamp: '2026-10-05T18:52:00.000Z' },
          { setNumber: 2, targetReps: '8-10', loadKg: 45, reps: 10, rpe: 8.5, timestamp: '2026-10-05T18:56:00.000Z' },
          { setNumber: 3, targetReps: '8-10', loadKg: 45, reps: 9, rpe: 9, timestamp: '2026-10-05T19:00:00.000Z' }
        ]
      },
      {
        exerciseId: 'rosca_direta_barra_w',
        exerciseName: 'Rosca Direta com Barra W',
        category: 'biceps',
        sets: [
          { setNumber: 1, targetReps: '8-10', loadKg: 22, reps: 10, rpe: 8, timestamp: '2026-10-05T19:12:00.000Z' },
          { setNumber: 2, targetReps: '8-10', loadKg: 22, reps: 10, rpe: 8.5, timestamp: '2026-10-05T19:16:00.000Z' },
          { setNumber: 3, targetReps: '8-10', loadKg: 22, reps: 10, rpe: 9, timestamp: '2026-10-05T19:20:00.000Z' }
        ]
      }
    ]
  },
  {
    id: 'sess_prev_3',
    routineId: 'routine_abcd_c',
    routineName: 'Treino C — Pernas Completo',
    splitType: 'ABCD',
    startTime: '2026-10-07T17:45:00.000Z',
    endTime: '2026-10-07T18:50:00.000Z',
    durationSeconds: 3900,
    totalVolumeKg: 10800,
    exercises: [
      {
        exerciseId: 'agachamento_livre_barra',
        exerciseName: 'Agachamento Livre com Barra',
        category: 'pernas',
        sets: [
          { setNumber: 1, targetReps: '6-8', loadKg: 70, reps: 8, rpe: 8, timestamp: '2026-10-07T17:55:00.000Z' },
          { setNumber: 2, targetReps: '6-8', loadKg: 70, reps: 8, rpe: 8.5, timestamp: '2026-10-07T18:02:00.000Z' },
          { setNumber: 3, targetReps: '6-8', loadKg: 70, reps: 8, rpe: 9, timestamp: '2026-10-07T18:10:00.000Z' },
          { setNumber: 4, targetReps: '6-8', loadKg: 70, reps: 8, rpe: 9, timestamp: '2026-10-07T18:18:00.000Z' }
        ]
      },
      {
        exerciseId: 'leg_press_45',
        exerciseName: 'Leg Press 45º',
        category: 'pernas',
        sets: [
          { setNumber: 1, targetReps: '10-12', loadKg: 160, reps: 12, rpe: 8, timestamp: '2026-10-07T18:25:00.000Z' },
          { setNumber: 2, targetReps: '10-12', loadKg: 160, reps: 12, rpe: 8.5, timestamp: '2026-10-07T18:30:00.000Z' },
          { setNumber: 3, targetReps: '10-12', loadKg: 160, reps: 12, rpe: 9, timestamp: '2026-10-07T18:35:00.000Z' }
        ]
      }
    ]
  }
];
