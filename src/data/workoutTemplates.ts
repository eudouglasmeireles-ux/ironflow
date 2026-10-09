import { WorkoutPlan } from '../types';

export const DEFAULT_WORKOUT_PLANS: WorkoutPlan[] = [
  // --- PROGRAMA PADRÃO ABCD (4 DIAS) ---
  {
    id: 'plan_abcd_hipertrofia',
    name: 'IRONFLOW — ABCD Hipertrofia & Força',
    splitType: 'ABCD',
    description: 'Divisão clássica e altamente eficaz de 4 dias. Permite excelente recuperação e foco elevado por grupamento muscular.',
    active: true,
    createdAt: '2026-10-01',
    routines: [
      {
        id: 'routine_abcd_a',
        name: 'Treino A — Peitoral & Tríceps',
        tag: 'A',
        splitType: 'ABCD',
        description: 'Foco no desenvolvimento peitoral completo e tríceps com sobrecarga controlada.',
        targetMuscles: ['Peitoral', 'Tríceps', 'Deltoide Anterior'],
        exercises: [
          {
            exerciseId: 'supino_reto_barra',
            exerciseName: 'Supino Reto com Barra',
            targetSets: 4,
            repRange: '8-10',
            suggestedLoadKg: 50,
            restSeconds: 120,
            notes: 'Composto principal. Mantenha as escápulas em retração.',
            alternatives: ['supino_inclinado_halteres', 'peck_deck_voador']
          },
          {
            exerciseId: 'supino_inclinado_halteres',
            exerciseName: 'Supino Inclinado com Halteres',
            targetSets: 3,
            repRange: '8-12',
            suggestedLoadKg: 22,
            restSeconds: 90,
            notes: 'Foco na porção superior do peitoral.',
            alternatives: ['crossover_polia_media']
          },
          {
            exerciseId: 'peck_deck_voador',
            exerciseName: 'Peck Deck / Voador',
            targetSets: 3,
            repRange: '10-12',
            suggestedLoadKg: 45,
            restSeconds: 60,
            notes: 'Aperte 1 segundo no pico de contração.',
            alternatives: ['crossover_polia_media']
          },
          {
            exerciseId: 'triceps_polia_corda',
            exerciseName: 'Tríceps na Polia com Corda',
            targetSets: 4,
            repRange: '10-12',
            suggestedLoadKg: 30,
            restSeconds: 60,
            notes: 'Abra as pontas da corda na base do movimento.',
            alternatives: ['triceps_frances_halteres']
          },
          {
            exerciseId: 'triceps_testa_barra_w',
            exerciseName: 'Tríceps Testa com Barra W',
            targetSets: 3,
            repRange: '8-10',
            suggestedLoadKg: 20,
            restSeconds: 75,
            notes: 'Cotovelos fechados apontando para o teto.',
            alternatives: ['triceps_frances_halteres']
          }
        ]
      },
      {
        id: 'routine_abcd_b',
        name: 'Treino B — Dorsal & Bíceps',
        tag: 'B',
        splitType: 'ABCD',
        description: 'Construção de largura e densidade de costas aliada ao estímulo dos flexores de cotovelo.',
        targetMuscles: ['Dorsal', 'Romboides', 'Bíceps', 'Trapézio'],
        exercises: [
          {
            exerciseId: 'puxada_alta_frente',
            exerciseName: 'Puxada Alta Frontal (Pulldown)',
            targetSets: 4,
            repRange: '8-12',
            suggestedLoadKg: 55,
            restSeconds: 90,
            notes: 'Puxe com os cotovelos, não com as mãos.',
            alternatives: ['barra_fixa', 'remada_baixa_triangulo']
          },
          {
            exerciseId: 'remada_curvada_barra',
            exerciseName: 'Remada Curvada com Barra',
            targetSets: 4,
            repRange: '8-10',
            suggestedLoadKg: 45,
            restSeconds: 90,
            notes: 'Tronco firme em 45°, coluna neutra.',
            alternatives: ['remada_baixa_triangulo']
          },
          {
            exerciseId: 'remada_baixa_triangulo',
            exerciseName: 'Remada Baixa no Triângulo',
            targetSets: 3,
            repRange: '10-12',
            suggestedLoadKg: 50,
            restSeconds: 75,
            notes: 'Retração escapular firme.',
            alternatives: ['puxada_alta_frente']
          },
          {
            exerciseId: 'rosca_direta_barra_w',
            exerciseName: 'Rosca Direta com Barra W',
            targetSets: 3,
            repRange: '8-10',
            suggestedLoadKg: 22,
            restSeconds: 75,
            notes: 'Cotovelos fixos ao lado do corpo.',
            alternatives: ['rosca_martelo_halteres']
          },
          {
            exerciseId: 'rosca_martelo_halteres',
            exerciseName: 'Rosca Martelo com Halteres',
            targetSets: 3,
            repRange: '10-12',
            suggestedLoadKg: 12,
            restSeconds: 60,
            notes: 'Foco no braquiorradial e espessura do braço.',
            alternatives: ['rosca_scott_maquina']
          }
        ]
      },
      {
        id: 'routine_abcd_c',
        name: 'Treino C — Pernas Completo',
        tag: 'C',
        splitType: 'ABCD',
        description: 'Sessão completa de membros inferiores: quadríceps, isquiotibiais, glúteos e panturrilhas.',
        targetMuscles: ['Quadríceps', 'Posteriores', 'Glúteos', 'Panturrilhas'],
        exercises: [
          {
            exerciseId: 'agachamento_livre_barra',
            exerciseName: 'Agachamento Livre com Barra',
            targetSets: 4,
            repRange: '6-8',
            suggestedLoadKg: 70,
            restSeconds: 150,
            notes: 'Base forte e profundidade segura até 90°.',
            alternatives: ['leg_press_45']
          },
          {
            exerciseId: 'leg_press_45',
            exerciseName: 'Leg Press 45º',
            targetSets: 4,
            repRange: '10-12',
            suggestedLoadKg: 160,
            restSeconds: 90,
            notes: 'Sem tirar a lombar do encosto.',
            alternatives: ['cadeira_extensora']
          },
          {
            exerciseId: 'cadeira_extensora',
            exerciseName: 'Cadeira Extensora',
            targetSets: 3,
            repRange: '12-15',
            suggestedLoadKg: 40,
            restSeconds: 60,
            notes: 'Pausa isométrica de 1 segundo na extensão.',
            alternatives: ['leg_press_45']
          },
          {
            exerciseId: 'mesa_flexora',
            exerciseName: 'Mesa Flexora (Leg Curl)',
            targetSets: 4,
            repRange: '10-12',
            suggestedLoadKg: 35,
            restSeconds: 75,
            notes: 'Controle na descida (fase excêntrica).',
            alternatives: ['stiff_halteres']
          },
          {
            exerciseId: 'stiff_halteres',
            exerciseName: 'Stiff com Halteres',
            targetSets: 3,
            repRange: '10-12',
            suggestedLoadKg: 18,
            restSeconds: 90,
            notes: 'Quadril para trás com joelhos semi-flexionados.',
            alternatives: ['elevacao_pelvica']
          },
          {
            exerciseId: 'panturrilha_em_pe',
            exerciseName: 'Panturrilha em Pé na Máquina / Degrau',
            targetSets: 4,
            repRange: '12-15',
            suggestedLoadKg: 60,
            restSeconds: 60,
            notes: 'Alongamento máximo no fundo com pausa de 1s.',
            alternatives: []
          }
        ]
      },
      {
        id: 'routine_abcd_d',
        name: 'Treino D — Ombros & Abdômen',
        tag: 'D',
        splitType: 'ABCD',
        description: 'Construção da silhueta em V, deltoides 3D e fortalecimento integral do core.',
        targetMuscles: ['Deltoides', 'Trapézio', 'Abdômen'],
        exercises: [
          {
            exerciseId: 'desenvolvimento_halteres',
            exerciseName: 'Desenvolvimento com Halteres',
            targetSets: 4,
            repRange: '8-10',
            suggestedLoadKg: 18,
            restSeconds: 90,
            notes: 'Mantenha os cotovelos no plano escapular.',
            alternatives: ['elevacao_lateral_halteres']
          },
          {
            exerciseId: 'elevacao_lateral_halteres',
            exerciseName: 'Elevação Lateral com Halteres',
            targetSets: 4,
            repRange: '12-15',
            suggestedLoadKg: 10,
            restSeconds: 60,
            notes: 'Braços afastando para as laterais, sem impulso.',
            alternatives: ['elevacao_lateral_polia']
          },
          {
            exerciseId: 'crucifixo_inverso_peck_deck',
            exerciseName: 'Crucifixo Inverso no Peck Deck',
            targetSets: 3,
            repRange: '12-15',
            suggestedLoadKg: 35,
            restSeconds: 60,
            notes: 'Foco na porção posterior do deltoide.',
            alternatives: ['face_pull_corda']
          },
          {
            exerciseId: 'face_pull_corda',
            exerciseName: 'Face Pull na Polia com Corda',
            targetSets: 3,
            repRange: '12-15',
            suggestedLoadKg: 25,
            restSeconds: 60,
            notes: 'Rotação externa com as mãos mais altas que cotovelos.',
            alternatives: ['crucifixo_inverso_peck_deck']
          },
          {
            exerciseId: 'abdominal_supra_polia',
            exerciseName: 'Abdominal Supra na Polia (Crunch na Corda)',
            targetSets: 3,
            repRange: '12-15',
            suggestedLoadKg: 40,
            restSeconds: 60,
            notes: 'Enrole o tronco em direção aos joelhos.',
            alternatives: ['prancha_isometrica']
          },
          {
            exerciseId: 'prancha_isometrica',
            exerciseName: 'Prancha Isométrica no Solo',
            targetSets: 3,
            repRange: '45-60 seg',
            suggestedLoadKg: 0,
            restSeconds: 60,
            notes: 'Glúteos e abdômen travados em linha reta.',
            alternatives: ['abdominal_infra_paralela']
          }
        ]
      }
    ]
  },

  // --- PROGRAMA ABC (3 DIAS PUSH / PULL / LEGS) ---
  {
    id: 'plan_abc_push_pull_legs',
    name: 'IRONFLOW — ABC Push / Pull / Legs',
    splitType: 'ABC',
    description: 'Divisão clássica de empurrar, puxar e pernas. Altamente adaptável para 3 dias ou 6 dias por semana.',
    active: false,
    createdAt: '2026-10-01',
    routines: [
      {
        id: 'routine_abc_a',
        name: 'Treino A — Empurrar (Peito, Ombros, Tríceps)',
        tag: 'A',
        splitType: 'ABC',
        description: 'Músculos de empurrar da cadeia anterior e superior.',
        targetMuscles: ['Peitoral', 'Deltoides', 'Tríceps'],
        exercises: [
          {
            exerciseId: 'supino_reto_barra',
            exerciseName: 'Supino Reto com Barra',
            targetSets: 4,
            repRange: '8-10',
            suggestedLoadKg: 50,
            restSeconds: 120,
            notes: 'Foco na carga progressiva.'
          },
          {
            exerciseId: 'supino_inclinado_halteres',
            exerciseName: 'Supino Inclinado com Halteres',
            targetSets: 3,
            repRange: '10-12',
            suggestedLoadKg: 20,
            restSeconds: 90
          },
          {
            exerciseId: 'desenvolvimento_halteres',
            exerciseName: 'Desenvolvimento com Halteres',
            targetSets: 3,
            repRange: '8-12',
            suggestedLoadKg: 16,
            restSeconds: 90
          },
          {
            exerciseId: 'elevacao_lateral_halteres',
            exerciseName: 'Elevação Lateral com Halteres',
            targetSets: 4,
            repRange: '12-15',
            suggestedLoadKg: 10,
            restSeconds: 60
          },
          {
            exerciseId: 'triceps_polia_corda',
            exerciseName: 'Tríceps na Polia com Corda',
            targetSets: 4,
            repRange: '10-12',
            suggestedLoadKg: 25,
            restSeconds: 60
          }
        ]
      },
      {
        id: 'routine_abc_b',
        name: 'Treino B — Puxar (Costas, Bíceps, Posterior de Ombro)',
        tag: 'B',
        splitType: 'ABC',
        description: 'Músculos de puxar da cadeia posterior.',
        targetMuscles: ['Dorsal', 'Romboides', 'Bíceps', 'Trapézio'],
        exercises: [
          {
            exerciseId: 'puxada_alta_frente',
            exerciseName: 'Puxada Alta Frontal (Pulldown)',
            targetSets: 4,
            repRange: '8-10',
            suggestedLoadKg: 55,
            restSeconds: 90
          },
          {
            exerciseId: 'remada_baixa_triangulo',
            exerciseName: 'Remada Baixa no Triângulo',
            targetSets: 4,
            repRange: '10-12',
            suggestedLoadKg: 50,
            restSeconds: 75
          },
          {
            exerciseId: 'face_pull_corda',
            exerciseName: 'Face Pull na Polia com Corda',
            targetSets: 3,
            repRange: '12-15',
            suggestedLoadKg: 20,
            restSeconds: 60
          },
          {
            exerciseId: 'rosca_direta_barra_w',
            exerciseName: 'Rosca Direta com Barra W',
            targetSets: 3,
            repRange: '8-10',
            suggestedLoadKg: 22,
            restSeconds: 75
          },
          {
            exerciseId: 'rosca_martelo_halteres',
            exerciseName: 'Rosca Martelo com Halteres',
            targetSets: 3,
            repRange: '10-12',
            suggestedLoadKg: 12,
            restSeconds: 60
          }
        ]
      },
      {
        id: 'routine_abc_c',
        name: 'Treino C — Pernas & Abdômen',
        tag: 'C',
        splitType: 'ABC',
        description: 'Membros inferiores completos e core.',
        targetMuscles: ['Quadríceps', 'Posteriores', 'Glúteos', 'Panturrilhas', 'Core'],
        exercises: [
          {
            exerciseId: 'agachamento_livre_barra',
            exerciseName: 'Agachamento Livre com Barra',
            targetSets: 4,
            repRange: '8-10',
            suggestedLoadKg: 60,
            restSeconds: 120
          },
          {
            exerciseId: 'leg_press_45',
            exerciseName: 'Leg Press 45º',
            targetSets: 3,
            repRange: '10-12',
            suggestedLoadKg: 150,
            restSeconds: 90
          },
          {
            exerciseId: 'mesa_flexora',
            exerciseName: 'Mesa Flexora (Leg Curl)',
            targetSets: 4,
            repRange: '10-12',
            suggestedLoadKg: 35,
            restSeconds: 75
          },
          {
            exerciseId: 'panturrilha_em_pe',
            exerciseName: 'Panturrilha em Pé na Máquina / Degrau',
            targetSets: 4,
            repRange: '12-15',
            suggestedLoadKg: 55,
            restSeconds: 60
          },
          {
            exerciseId: 'prancha_isometrica',
            exerciseName: 'Prancha Isométrica no Solo',
            targetSets: 3,
            repRange: '45-60 seg',
            suggestedLoadKg: 0,
            restSeconds: 60
          }
        ]
      }
    ]
  },

  // --- PROGRAMA UPPER / LOWER (4 DIAS) ---
  {
    id: 'plan_upper_lower',
    name: 'IRONFLOW — Superior / Inferior (Upper / Lower)',
    splitType: 'UPPER_LOWER',
    description: 'Frequência 2x por grupo muscular por semana com volume moderado e alta intensidade.',
    active: false,
    createdAt: '2026-10-01',
    routines: [
      {
        id: 'routine_ul_u1',
        name: 'Treino A — Superior (Upper)',
        tag: 'A',
        splitType: 'UPPER_LOWER',
        description: 'Peito, Costas, Ombros e Braços',
        targetMuscles: ['Peito', 'Costas', 'Ombros', 'Braços'],
        exercises: [
          {
            exerciseId: 'supino_reto_barra',
            exerciseName: 'Supino Reto com Barra',
            targetSets: 4,
            repRange: '6-8',
            suggestedLoadKg: 55,
            restSeconds: 120
          },
          {
            exerciseId: 'remada_curvada_barra',
            exerciseName: 'Remada Curvada com Barra',
            targetSets: 4,
            repRange: '8-10',
            suggestedLoadKg: 45,
            restSeconds: 90
          },
          {
            exerciseId: 'desenvolvimento_halteres',
            exerciseName: 'Desenvolvimento com Halteres',
            targetSets: 3,
            repRange: '8-10',
            suggestedLoadKg: 18,
            restSeconds: 90
          },
          {
            exerciseId: 'puxada_alta_frente',
            exerciseName: 'Puxada Alta Frontal (Pulldown)',
            targetSets: 3,
            repRange: '10-12',
            suggestedLoadKg: 50,
            restSeconds: 75
          },
          {
            exerciseId: 'triceps_polia_corda',
            exerciseName: 'Tríceps na Polia com Corda',
            targetSets: 3,
            repRange: '10-12',
            suggestedLoadKg: 25,
            restSeconds: 60
          },
          {
            exerciseId: 'rosca_direta_barra_w',
            exerciseName: 'Rosca Direta com Barra W',
            targetSets: 3,
            repRange: '10-12',
            suggestedLoadKg: 20,
            restSeconds: 60
          }
        ]
      },
      {
        id: 'routine_ul_l1',
        name: 'Treino B — Inferior (Lower)',
        tag: 'B',
        splitType: 'UPPER_LOWER',
        description: 'Membros Inferiores & Core',
        targetMuscles: ['Quadríceps', 'Isquiotibiais', 'Glúteos', 'Panturrilhas', 'Core'],
        exercises: [
          {
            exerciseId: 'agachamento_livre_barra',
            exerciseName: 'Agachamento Livre com Barra',
            targetSets: 4,
            repRange: '6-8',
            suggestedLoadKg: 70,
            restSeconds: 120
          },
          {
            exerciseId: 'leg_press_45',
            exerciseName: 'Leg Press 45º',
            targetSets: 3,
            repRange: '10-12',
            suggestedLoadKg: 160,
            restSeconds: 90
          },
          {
            exerciseId: 'stiff_halteres',
            exerciseName: 'Stiff com Halteres',
            targetSets: 4,
            repRange: '8-10',
            suggestedLoadKg: 20,
            restSeconds: 90
          },
          {
            exerciseId: 'mesa_flexora',
            exerciseName: 'Mesa Flexora (Leg Curl)',
            targetSets: 3,
            repRange: '10-12',
            suggestedLoadKg: 35,
            restSeconds: 75
          },
          {
            exerciseId: 'panturrilha_em_pe',
            exerciseName: 'Panturrilha em Pé na Máquina / Degrau',
            targetSets: 4,
            repRange: '12-15',
            suggestedLoadKg: 60,
            restSeconds: 60
          },
          {
            exerciseId: 'prancha_isometrica',
            exerciseName: 'Prancha Isométrica no Solo',
            targetSets: 3,
            repRange: '45-60 seg',
            suggestedLoadKg: 0,
            restSeconds: 60
          }
        ]
      }
    ]
  }
];
