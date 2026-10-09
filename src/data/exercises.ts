import { Exercise } from '../types';

export const EXERCISE_DATABASE: Exercise[] = [
  // --- PEITO ---
  {
    id: 'supino_reto_barra',
    name: 'Supino Reto com Barra',
    category: 'peito',
    primaryMuscles: ['Peitoral Maior', 'Porção Esternal'],
    secondaryMuscles: ['Tríceps Braquial', 'Deltoide Anterior'],
    equipment: 'barra',
    difficulty: 'intermediario',
    instructions: [
      'Deite no banco mantendo 5 pontos de contato: pés no chão, glúteos, costas e cabeça no banco.',
      'Abaixe as escápulas e aduza firmemente (retração escapular).',
      'Desça a barra de forma controlada até a linha média do esterno (logo abaixo dos mamilos).',
      'Empurre a barra verticalmente sem perder a retração das escápulas.'
    ],
    commonMistakes: [
      'Bater a barra no peito',
      'Tirar os glúteos do banco',
      'Abrir os cotovelos em 90 graus (risco ao ombro)'
    ],
    safetyNotes: 'Mantenha os cotovelos em torno de 45° a 70° em relação ao tronco para proteger os ombros.',
    defaultRepRange: '8-10',
    defaultRestSeconds: 120,
    alternatives: ['supino_reto_halteres', 'supino_maquina', 'flexao_solo']
  },
  {
    id: 'supino_inclinado_halteres',
    name: 'Supino Inclinado com Halteres',
    category: 'peito',
    primaryMuscles: ['Peitoral Maior (Porção Clavicular)'],
    secondaryMuscles: ['Deltoide Anterior', 'Tríceps'],
    equipment: 'halteres',
    difficulty: 'iniciante',
    instructions: [
      'Ajuste o banco em inclinação de 30° a 45°.',
      'Posicione os halteres acima do peito com escápulas travadas.',
      'Desça controlando até a altura do peito superior sentindo o alongamento da musculatura.',
      'Empurre convergindo suavemente no topo sem bater os halteres.'
    ],
    commonMistakes: [
      'Inclinação excessiva do banco (> 45° recruta muito ombro)',
      'Perder a estabilidade dos pés'
    ],
    safetyNotes: 'Excelente para quem sente incômodo articular no supino com barra, pois permite rotação natural dos punhos.',
    defaultRepRange: '8-12',
    defaultRestSeconds: 90,
    alternatives: ['supino_inclinado_barra', 'supino_reto_halteres', 'crossover_polia_baixa']
  },
  {
    id: 'crossover_polia_media',
    name: 'Crucifixo / Crossover na Polia',
    category: 'peito',
    primaryMuscles: ['Peitoral Maior'],
    secondaryMuscles: ['Deltoide Anterior'],
    equipment: 'polia',
    difficulty: 'iniciante',
    instructions: [
      'Posicione as polias na altura do peito, segure as manoplas e dê um passo à frente com base estável.',
      'Mantenha cotovelos levemente flexionados (sem dobrar ou esticar durante o movimento).',
      'Aproxime as mãos à frente do peito apertando a musculatura no pico de contração.'
    ],
    commonMistakes: ['Transformar o crucifixo em supino dobrando os cotovelos', 'Usar impulso do tronco'],
    safetyNotes: 'Tensão contínua do início ao fim sem impacto nas articulações.',
    defaultRepRange: '10-15',
    defaultRestSeconds: 60,
    alternatives: ['peck_deck_voador', 'crucifixo_halteres']
  },
  {
    id: 'peck_deck_voador',
    name: 'Peck Deck / Voador',
    category: 'peito',
    primaryMuscles: ['Peitoral Maior'],
    secondaryMuscles: ['Deltoide Anterior'],
    equipment: 'maquina',
    difficulty: 'iniciante',
    instructions: [
      'Ajuste o banco para que as mãos fiquem na linha do meio do peito.',
      'Mantenha as escápulas apoiadas e peito estufado.',
      'Feche os braços concentrando a força no peito, segure 1 segundo no meio e retorne devagar.'
    ],
    commonMistakes: ['Projetar os ombros para frente no fechamento', 'Descer além do limite de amplitude segura'],
    safetyNotes: 'Ótimo para isolamento e seguro para treinar até a falha.',
    defaultRepRange: '10-15',
    defaultRestSeconds: 60,
    alternatives: ['crossover_polia_media', 'crucifixo_halteres']
  },
  {
    id: 'flexao_solo',
    name: 'Flexão de Braço no Solo',
    category: 'peito',
    primaryMuscles: ['Peitoral Maior'],
    secondaryMuscles: ['Tríceps', 'Core', 'Deltoide Anterior'],
    equipment: 'peso_corporal',
    difficulty: 'iniciante',
    instructions: [
      'Mãos no solo com largura ligeiramente maior que os ombros.',
      'Corpo alinhado em linha reta da cabeça aos calcanhares com glúteo e abdômen contraídos.',
      'Desça até o peito quase tocar o solo e suba com explosão controlada.'
    ],
    commonMistakes: ['Deixar o quadril cair', 'Cotovelos abertos demais em T'],
    safetyNotes: 'Pode ser feita com joelhos no solo para iniciantes ou com pés elevados para avançados.',
    defaultRepRange: '10-20',
    defaultRestSeconds: 60,
    alternatives: ['supino_reto_halteres', 'supino_maquina']
  },

  // --- COSTAS ---
  {
    id: 'puxada_alta_frente',
    name: 'Puxada Alta Frontal (Pulldown)',
    category: 'costas',
    primaryMuscles: ['Latíssimo do Dorso (Dorsal)'],
    secondaryMuscles: ['Bíceps Braquial', 'Braquial', 'Redondo Maior', 'Romboides'],
    equipment: 'polia',
    difficulty: 'iniciante',
    instructions: [
      'Sente no aparelho com as almofadas firmes sobre as coxas.',
      'Pegada pronada com largura um pouco maior que os ombros.',
      'Puxe a barra em direção à parte superior do peito puxando os cotovelos para baixo e para trás.',
      'Estique os braços controlando a subida sentindo a dorsal alongar.'
    ],
    commonMistakes: [
      'Puxar a barra atrás do pescoço (risco cervical e de manguito)',
      'Balançar o tronco excessivamente para trás'
    ],
    safetyNotes: 'Puxada frontal é sempre superior em segurança biomecânica comparada à puxada nuca.',
    defaultRepRange: '8-12',
    defaultRestSeconds: 90,
    alternatives: ['barra_fixa', 'puxada_triangulo', 'puxada_articulada']
  },
  {
    id: 'remada_curvada_barra',
    name: 'Remada Curvada com Barra',
    category: 'costas',
    primaryMuscles: ['Dorsal', 'Romboides', 'Trapézio Médio/Inferior'],
    secondaryMuscles: ['Bíceps', 'Eretores da Espinha', 'Posterior de Ombro'],
    equipment: 'barra',
    difficulty: 'intermediario',
    instructions: [
      'Pés na largura dos ombros, incline o tronco para frente a cerca de 45° mantendo a coluna neutra.',
      'Segure a barra com pegada pronada ou supinada.',
      'Puxe a barra em direção ao umbigo direcionando os cotovelos para trás.',
      'Segure 1 segundo na contração e desça controlando o peso.'
    ],
    commonMistakes: ['Arredondar a lombar', 'Usar impulso das pernas para levantar a barra'],
    safetyNotes: 'Se tiver dor na lombar, substitua pela Remada Baixa ou Remada no Banco com Halteres.',
    defaultRepRange: '8-10',
    defaultRestSeconds: 90,
    alternatives: ['remada_baixa_triangulo', 'remada_halteres_banco', 'remada_cavalinho']
  },
  {
    id: 'remada_baixa_triangulo',
    name: 'Remada Baixa no Triângulo',
    category: 'costas',
    primaryMuscles: ['Dorsal', 'Romboides', 'Trapézio'],
    secondaryMuscles: ['Bíceps', 'Braquiorradial'],
    equipment: 'polia',
    difficulty: 'iniciante',
    instructions: [
      'Sente com os pés firmes nos apoios e joelhos levemente flexionados.',
      'Mantenha a coluna ereta e puxe o triângulo até a altura do abdômen.',
      'Aperte as escápulas no final da puxada.',
      'Retorne estendendo os braços sem deixar o tronco ser projetado para a frente.'
    ],
    commonMistakes: ['Flexionar e estender a coluna como se fosse um remo de barco olímpico'],
    safetyNotes: 'Exercício de baixíssimo impacto na coluna lombar quando mantida a postura correta.',
    defaultRepRange: '10-12',
    defaultRestSeconds: 75,
    alternatives: ['remada_curvada_barra', 'remada_articulada_maquina']
  },
  {
    id: 'barra_fixa',
    name: 'Barra Fixa (Pull-up)',
    category: 'costas',
    primaryMuscles: ['Latíssimo do Dorso'],
    secondaryMuscles: ['Bíceps', 'Core', 'Antebraço'],
    equipment: 'peso_corporal',
    difficulty: 'avancado',
    instructions: [
      'Pendure-se com pegada pronada afastada.',
      'Inicie ativando as escápulas puxando-as para baixo.',
      'Puxe o corpo para cima até o queixo passar da barra.',
      'Desça sob controle até a extensão quase completa dos braços.'
    ],
    commonMistakes: ['Fazer o movimento com impulsos ("kipping") em treino de hipertrofia'],
    safetyNotes: 'Use elástico de assistência ou gravíton se ainda não conseguir realizar repetições livres.',
    defaultRepRange: '6-10',
    defaultRestSeconds: 120,
    alternatives: ['puxada_alta_frente', 'graviton']
  },

  // --- PERNAS & GLÚTEOS ---
  {
    id: 'agachamento_livre_barra',
    name: 'Agachamento Livre com Barra',
    category: 'pernas',
    primaryMuscles: ['Quadríceps', 'Glúteo Máximo'],
    secondaryMuscles: ['Posteriores de Coxa', 'Eretores da Espinha', 'Core'],
    equipment: 'barra',
    difficulty: 'avancado',
    instructions: [
      'Barra apoiada no trapézio (costas superiores), pés afastados na largura dos ombros.',
      'Inspire e faça o "brace" abdominal (trave o core).',
      'Desça flexionando quadril e joelhos simultaneamente até as coxas ficarem paralelas ao chão.',
      'Empurre o chão com os calcanhares e meio do pé para subir mantendo o peito aberto.'
    ],
    commonMistakes: ['Valgo dinâmico (joelhos caindo para dentro)', 'Tirar os calcanhares do chão', 'Arredondar a lombar no fundo'],
    safetyNotes: 'Ajuste a profundidade conforme a mobilidade do tornozelo e quadril.',
    defaultRepRange: '6-10',
    defaultRestSeconds: 150,
    alternatives: ['leg_press_45', 'agachamento_goblet', 'agachamento_hack']
  },
  {
    id: 'leg_press_45',
    name: 'Leg Press 45º',
    category: 'pernas',
    primaryMuscles: ['Quadríceps', 'Glúteos'],
    secondaryMuscles: ['Posteriores de Coxa'],
    equipment: 'maquina',
    difficulty: 'iniciante',
    instructions: [
      'Apoie as costas e o quadril completamente no encosto.',
      'Posicione os pés na plataforma na largura dos ombros.',
      'Destrave a máquina e desça a plataforma controlando a carga até ~90° nos joelhos sem tirar a lombar do banco.',
      'Empurre estendendo as pernas sem hiperestender/travar os joelhos no topo.'
    ],
    commonMistakes: ['Tirar a lombar/glúteo do encosto no final da descida (retroversão)', 'Estalar os joelhos esticando 100%'],
    safetyNotes: 'Excelente para sobrecarga com segurança lombar guiada.',
    defaultRepRange: '8-12',
    defaultRestSeconds: 90,
    alternatives: ['agachamento_hack', 'agachamento_livre_barra', 'passada_afundo']
  },
  {
    id: 'cadeira_extensora',
    name: 'Cadeira Extensora',
    category: 'pernas',
    primaryMuscles: ['Quadríceps (Reto Femoral e Vastos)'],
    secondaryMuscles: [],
    equipment: 'maquina',
    difficulty: 'iniciante',
    instructions: [
      'Ajuste o encosto para que o eixo do joelho coincida exatamente com o eixo de rotação da máquina.',
      'Almofada logo acima do tornozelo.',
      'Estenda os joelhos até a contração máxima, pause 1 segundo e desça devagar.'
    ],
    commonMistakes: ['Chutar o peso com velocidade excessiva', 'Quadril descolando do assento'],
    safetyNotes: 'Isolador puro de quadríceps, ótimo para pré ou pós-exaustão.',
    defaultRepRange: '10-15',
    defaultRestSeconds: 60,
    alternatives: ['agachamento_sissy', 'passada_afundo']
  },
  {
    id: 'mesa_flexora',
    name: 'Mesa Flexora (Leg Curl)',
    category: 'pernas',
    primaryMuscles: ['Posteriores de Coxa (Isquiotibiais)'],
    secondaryMuscles: ['Gastrocnêmio'],
    equipment: 'maquina',
    difficulty: 'iniciante',
    instructions: [
      'Deite de bruços com a almofada posicionada logo abaixo da panturrilha.',
      'Mantenha o quadril pressionado contra o banco durante todo o exercício.',
      'Flexione os joelhos puxando os calcanhares em direção ao glúteo.',
      'Desça sob controle mantendo a tensão.'
    ],
    commonMistakes: ['Levantar o quadril do banco para ajudar no movimento'],
    safetyNotes: 'Fundamental para equilíbrio muscular entre quadríceps e posteriores.',
    defaultRepRange: '10-12',
    defaultRestSeconds: 75,
    alternatives: ['cadeira_flexora', 'stiff_halteres']
  },
  {
    id: 'stiff_halteres',
    name: 'Stiff com Halteres',
    category: 'pernas',
    primaryMuscles: ['Posteriores de Coxa', 'Glúteo Máximo'],
    secondaryMuscles: ['Eretores da Espinha'],
    equipment: 'halteres',
    difficulty: 'intermediario',
    instructions: [
      'Pés na largura do quadril, joelhos levemente semi-flexionados e travados nesse ângulo.',
      'Empurre o quadril para trás como se quisesse tocar a parede com os glúteos.',
      'Desça os halteres rentes às pernas sentindo o alongamento intenso dos posteriores.',
      'Retorne contraindo glúteos e posteriores sem jogar o quadril além da linha reta no topo.'
    ],
    commonMistakes: ['Arredondar a coluna lombar', 'Dobrar os joelhos em excesso transformando em agachamento'],
    safetyNotes: 'Mantenha a barra ou halteres o mais próximo possível das pernas.',
    defaultRepRange: '8-12',
    defaultRestSeconds: 90,
    alternatives: ['mesa_flexora', 'elevacao_pelvica', 'bom_dia']
  },
  {
    id: 'elevacao_pelvica',
    name: 'Elevação Pélvica com Barra',
    category: 'pernas',
    primaryMuscles: ['Glúteo Máximo'],
    secondaryMuscles: ['Posteriores de Coxa', 'Core'],
    equipment: 'barra',
    difficulty: 'intermediario',
    instructions: [
      'Apoie as escápulas em um banco estável.',
      'Posicione a barra com protetor sobre o quadril.',
      'Pés afastados na largura dos ombros, empurre o chão pelos calcanhares até o quadril alinhar com o tronco.',
      'Aperte os glúteos no topo por 1 a 2 segundos antes de descer.'
    ],
    commonMistakes: ['Hiperestender a coluna lombar em vez de mover o quadril'],
    safetyNotes: 'Use sempre almofada na barra para evitar compressão dolorosa no osso do quadril.',
    defaultRepRange: '8-12',
    defaultRestSeconds: 90,
    alternatives: ['stiff_halteres', 'gluteo_quatro_apoios_cabo']
  },
  {
    id: 'panturrilha_em_pe',
    name: 'Panturrilha em Pé na Máquina / Degrau',
    category: 'pernas',
    primaryMuscles: ['Gastrocnêmio', 'Sóleo'],
    secondaryMuscles: [],
    equipment: 'maquina',
    difficulty: 'iniciante',
    instructions: [
      'Apoie a ponta dos pés na borda da plataforma.',
      'Desça os calcanhares sentindo o alongamento completo da panturrilha por 1 segundo.',
      'Suba na ponta dos pés o mais alto possível e segure a contração máxima por 1 segundo.'
    ],
    commonMistakes: ['Ficar quicando rapidamente sem pausar no ponto de estiramento'],
    safetyNotes: 'A pausa no ponto inferior elimina o reflexo miotático elástico, forçando o músculo a trabalhar.',
    defaultRepRange: '12-15',
    defaultRestSeconds: 60,
    alternatives: ['panturrilha_sentado', 'panturrilha_leg_press']
  },

  // --- OMBROS ---
  {
    id: 'desenvolvimento_halteres',
    name: 'Desenvolvimento com Halteres',
    category: 'ombros',
    primaryMuscles: ['Deltoide Anterior', 'Deltoide Lateral'],
    secondaryMuscles: ['Tríceps', 'Trapézio'],
    equipment: 'halteres',
    difficulty: 'iniciante',
    instructions: [
      'Sente no banco com encosto a ~80°.',
      'Halteres na altura das orelhas com cotovelos ligeiramente à frente do corpo (plano escapular).',
      'Empurre os halteres para cima sem bater no topo.',
      'Desça controlando até a altura das orelhas.'
    ],
    commonMistakes: ['Arquear a lombar para compensar excesso de peso', 'Bater os halteres no alto'],
    safetyNotes: 'Empurrar no plano escapular (cotovelos ~30° à frente da linha do ombro) previne impacto subacromial.',
    defaultRepRange: '8-12',
    defaultRestSeconds: 90,
    alternatives: ['desenvolvimento_maquina', 'desenvolvimento_barra_militar']
  },
  {
    id: 'elevacao_lateral_halteres',
    name: 'Elevação Lateral com Halteres',
    category: 'ombros',
    primaryMuscles: ['Deltoide Lateral (Medial)'],
    secondaryMuscles: ['Trapézio Superior'],
    equipment: 'halteres',
    difficulty: 'iniciante',
    instructions: [
      'Em pé, tronco ligeiramente inclinado para frente (5° a 10°).',
      'Eleve os braços pelos lados até a altura dos ombros, mantendo cotovelos levemente flexionados.',
      'Pense em afastar os halteres das suas paredes laterais, não apenas erguer para cima.',
      'Desça de forma controlada.'
    ],
    commonMistakes: ['Dar impulso com os joelhos/tronco', 'Elevar os braços acima da linha dos ombros recrutando trapézio'],
    safetyNotes: 'Mantenha os polegares levemente apontados para baixo ou neutros, nunca rodando externamente se houver dor.',
    defaultRepRange: '12-15',
    defaultRestSeconds: 60,
    alternatives: ['elevacao_lateral_polia', 'elevacao_lateral_maquina']
  },
  {
    id: 'elevacao_lateral_polia',
    name: 'Elevação Lateral na Polia',
    category: 'ombros',
    primaryMuscles: ['Deltoide Lateral'],
    secondaryMuscles: ['Trapézio'],
    equipment: 'polia',
    difficulty: 'iniciante',
    instructions: [
      'Posicione a polia na altura do joelho ou punho.',
      'Passe o cabo por trás do corpo ou pela frente e segure com a mão oposta.',
      'Eleve o braço até a altura do ombro com tensão constante em todo o arco.',
      'Desça devagar controlando a fase excêntrica.'
    ],
    commonMistakes: ['Girar o tronco durante a subida'],
    safetyNotes: 'Oferece resistência contínua mesmo no início do movimento, onde os halteres perdem alavanca.',
    defaultRepRange: '12-15',
    defaultRestSeconds: 60,
    alternatives: ['elevacao_lateral_halteres']
  },
  {
    id: 'crucifixo_inverso_peck_deck',
    name: 'Crucifixo Inverso no Peck Deck',
    category: 'ombros',
    primaryMuscles: ['Deltoide Posterior'],
    secondaryMuscles: ['Romboides', 'Trapézio Médio'],
    equipment: 'maquina',
    difficulty: 'iniciante',
    instructions: [
      'Sente de frente para o encosto do voador.',
      'Ajuste os pegadores para ficarem na altura dos ombros.',
      'Abra os braços em arco para trás focando na contração da parte de trás dos ombros.',
      'Retorne devagar sem deixar as placas de peso baterem.'
    ],
    commonMistakes: ['Encolher os ombros ativando o trapézio superior'],
    safetyNotes: 'Fundamental para a saúde postural e equilíbrio articular do ombro.',
    defaultRepRange: '12-15',
    defaultRestSeconds: 60,
    alternatives: ['crucifixo_inverso_halteres', 'face_pull_corda']
  },
  {
    id: 'face_pull_corda',
    name: 'Face Pull na Polia com Corda',
    category: 'ombros',
    primaryMuscles: ['Deltoide Posterior', 'Manguito Rotador (Infraspinhal)'],
    secondaryMuscles: ['Trapézio Médio/Inferior'],
    equipment: 'polia',
    difficulty: 'iniciante',
    instructions: [
      'Polia posicionada na altura dos olhos com a corda instalada.',
      'Puxe a corda em direção aos olhos/testa afastando as pontas da corda.',
      'Faça rotação externa no final, com punhos terminando mais altos que os cotovelos.',
      'Segure 1 segundo e retorne controlando.'
    ],
    commonMistakes: ['Puxar para o queixo ou peito', 'Usar carga excessiva perdendo a rotação'],
    safetyNotes: 'O melhor exercício para blindagem e prevenção de dores nos ombros.',
    defaultRepRange: '12-15',
    defaultRestSeconds: 60,
    alternatives: ['crucifixo_inverso_peck_deck']
  },

  // --- BRAÇOS: BÍCEPS & TRÍCEPS ---
  {
    id: 'rosca_direta_barra_w',
    name: 'Rosca Direta com Barra W',
    category: 'biceps',
    primaryMuscles: ['Bíceps Braquial'],
    secondaryMuscles: ['Braquial', 'Braquiorradial'],
    equipment: 'barra',
    difficulty: 'iniciante',
    instructions: [
      'Segure a barra W nas pegadas anguladas.',
      'Cotovelos colados ao lado do tronco.',
      'Flexione os braços levando a barra até o topo sem projetar os cotovelos para frente.',
      'Desça até a extensão quase completa do cotovelo de forma controlada.'
    ],
    commonMistakes: ['Jogar o quadril para frente para dar impulso', 'Mover os cotovelos para a frente no topo'],
    safetyNotes: 'A curvatura da barra W alivia o estresse nos punhos em relação à barra reta.',
    defaultRepRange: '8-12',
    defaultRestSeconds: 75,
    alternatives: ['rosca_alternada_halteres', 'rosca_polia_barra']
  },
  {
    id: 'rosca_martelo_halteres',
    name: 'Rosca Martelo com Halteres',
    category: 'biceps',
    primaryMuscles: ['Braquiorradial', 'Braquial'],
    secondaryMuscles: ['Bíceps Braquial'],
    equipment: 'halteres',
    difficulty: 'iniciante',
    instructions: [
      'Em pé ou sentado, segure os halteres com pegada neutra (palmas voltadas uma para a outra).',
      'Flexione os cotovelos mantendo os punhos neutros até a contração máxima.',
      'Desça devagar controlando a descida.'
    ],
    commonMistakes: ['Balançar o corpo'],
    safetyNotes: 'Desenvolve a espessura do braço e fortalece os antebraços e tendões do cotovelo.',
    defaultRepRange: '10-12',
    defaultRestSeconds: 60,
    alternatives: ['rosca_martelo_corda_polia', 'rosca_inversa']
  },
  {
    id: 'rosca_scott_maquina',
    name: 'Rosca Scott na Máquina / Banco',
    category: 'biceps',
    primaryMuscles: ['Bíceps Braquial (Cabeça Curta)'],
    secondaryMuscles: ['Braquial'],
    equipment: 'maquina',
    difficulty: 'iniciante',
    instructions: [
      'Apoie os braços e o peito no encosto inclinado.',
      'Segure as manoplas e puxe concentrando toda a força no bíceps.',
      'Desça devagar sem hiperestender bruscamente o cotovelo no ponto mais baixo.'
    ],
    commonMistakes: ['Esticar bruscamente o braço na descida (risco ao tendão do bíceps)'],
    safetyNotes: 'Elimina completamente qualquer chance de roubo do tronco.',
    defaultRepRange: '10-12',
    defaultRestSeconds: 60,
    alternatives: ['rosca_direta_barra_w', 'rosca_concentrada']
  },
  {
    id: 'triceps_polia_corda',
    name: 'Tríceps na Polia com Corda',
    category: 'triceps',
    primaryMuscles: ['Tríceps Braquial (Cabeça Lateral)'],
    secondaryMuscles: ['Cabeça Medial'],
    equipment: 'polia',
    difficulty: 'iniciante',
    instructions: [
      'Posicione a polia alta e segure a corda.',
      'Cotovelos fixos ao lado das costelas.',
      'Empurre a corda para baixo estendendo os cotovelos e abra as pontas da corda no final.',
      'Retorne até formar um ângulo de 90° nos cotovelos sem deixá-los subir.'
    ],
    commonMistakes: ['Deixar os cotovelos subirem e descerem com a carga', 'Curvar o tronco sobre a corda'],
    safetyNotes: 'Articulação do cotovelo é protegida quando mantida a posição fixa do braço.',
    defaultRepRange: '10-15',
    defaultRestSeconds: 60,
    alternatives: ['triceps_polia_barra_reta', 'triceps_frances_polia']
  },
  {
    id: 'triceps_testa_barra_w',
    name: 'Tríceps Testa com Barra W',
    category: 'triceps',
    primaryMuscles: ['Tríceps Braquial (Cabeça Longa e Medial)'],
    secondaryMuscles: [],
    equipment: 'barra',
    difficulty: 'intermediario',
    instructions: [
      'Deitado no banco reto, segure a barra W com os braços estendidos e levemente inclinados para trás.',
      'Flexione apenas os cotovelos trazendo a barra em direção ao topo da cabeça ou logo atrás dela.',
      'Estenda os cotovelos retornando à posição inicial.'
    ],
    commonMistakes: ['Abrir os cotovelos excessivamente para fora', 'Bater a barra na testa'],
    safetyNotes: 'Inclinar os braços ligeiramente para trás (não 90° perpendiculares) mantém tensão contínua e protege o cotovelo.',
    defaultRepRange: '8-12',
    defaultRestSeconds: 75,
    alternatives: ['triceps_frances_halteres', 'triceps_polia_corda']
  },
  {
    id: 'triceps_frances_halteres',
    name: 'Tríceps Francês com Halter',
    category: 'triceps',
    primaryMuscles: ['Tríceps Braquial (Cabeça Longa)'],
    secondaryMuscles: [],
    equipment: 'halteres',
    difficulty: 'iniciante',
    instructions: [
      'Sentado com a coluna ereta, segure o halter com as duas mãos acima da cabeça.',
      'Desça o halter por trás da cabeça flexionando os cotovelos.',
      'Estenda os braços para cima sentindo o trabalho na cabeça longa do tríceps.'
    ],
    commonMistakes: ['Arquear excessivamente a lombar', 'Cotovelos excessivamente abertos'],
    safetyNotes: 'Excelente para trabalhar a cabeça longa do tríceps em posição de alongamento.',
    defaultRepRange: '10-12',
    defaultRestSeconds: 60,
    alternatives: ['triceps_polia_corda', 'triceps_testa_barra_w']
  },

  // --- CORE & ABDÔMEN ---
  {
    id: 'abdominal_infra_paralela',
    name: 'Elevação de Pernas na Paralela / Barra',
    category: 'core',
    primaryMuscles: ['Reto Abdominal (Porção Infra)'],
    secondaryMuscles: ['Flexores do Quadril', 'Oblíquos'],
    equipment: 'peso_corporal',
    difficulty: 'intermediario',
    instructions: [
      'Apoie os antebraços nas almofadas da paralela com as costas retas.',
      'Eleve os joelhos ou pernas em direção ao peito, flexionando a bacia para cima.',
      'Desça de forma controlada sem balançar o corpo.'
    ],
    commonMistakes: ['Apenas mexer as coxas sem enrolar o quadril (ativa só flexor do quadril)', 'Balançar o corpo'],
    safetyNotes: 'Enrole a pelve no final do movimento para contração abdominal verdadeira.',
    defaultRepRange: '12-15',
    defaultRestSeconds: 60,
    alternatives: ['abdominal_infra_solo', 'prancha_isometrica']
  },
  {
    id: 'prancha_isometrica',
    name: 'Prancha Isométrica no Solo',
    category: 'core',
    primaryMuscles: ['Transverso do Abdômen', 'Reto Abdominal'],
    secondaryMuscles: ['Glúteos', 'Eretores da Espinha'],
    equipment: 'peso_corporal',
    difficulty: 'iniciante',
    instructions: [
      'Apoie os antebraços e as pontas dos pés no chão.',
      'Mantenha o corpo em uma linha reta da cabeça aos calcanhares.',
      'Contraia o abdômen e os glúteos com força e respire de forma controlada.'
    ],
    commonMistakes: ['Deixar o quadril cair em direção ao chão', 'Elevar o quadril em formato de V'],
    safetyNotes: 'Segurança absoluta para a coluna e fortalecimento da estabilidade central.',
    defaultRepRange: '30-60 seg',
    defaultRestSeconds: 60,
    alternatives: ['abdominal_infra_solo', 'abdominal_supra_solo']
  },
  {
    id: 'abdominal_supra_polia',
    name: 'Abdominal Supra na Polia (Crunch na Corda)',
    category: 'core',
    primaryMuscles: ['Reto Abdominal'],
    secondaryMuscles: ['Oblíquos'],
    equipment: 'polia',
    difficulty: 'iniciante',
    instructions: [
      'Ajoelhe-se em frente à polia alta segurando a corda junto às orelhas.',
      'Flexione a coluna enrolando o tronco para baixo em direção aos joelhos.',
      'Mantenha os quadris fixos; mova apenas o tronco.',
      'Retorne devagar sentindo o alongamento do abdômen.'
    ],
    commonMistakes: ['Sentar nos calcanhares em vez de flexionar a coluna'],
    safetyNotes: 'Permite sobrecarga progressiva no abdômen com precisão de peso.',
    defaultRepRange: '12-15',
    defaultRestSeconds: 60,
    alternatives: ['prancha_isometrica', 'abdominal_infra_paralela']
  }
];

export const getExerciseById = (id: string): Exercise | undefined => {
  return EXERCISE_DATABASE.find(ex => ex.id === id);
};

export const getExercisesByCategory = (category: string): Exercise[] => {
  return EXERCISE_DATABASE.filter(ex => ex.category === category);
};
