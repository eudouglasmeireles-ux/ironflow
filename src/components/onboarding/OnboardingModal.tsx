import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FitnessGoal, ExperienceLevel, GymType, SplitType } from '../../types';
import { Check, ChevronRight, ChevronLeft, Dumbbell, ShieldAlert, Sparkles, User, Target, Calendar } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const { userProfile, updateProfile, setIsOnboardingCompleted, setActivePlanId, workoutPlans } = useApp();

  const [step, setStep] = useState(1);

  // Form local state
  const [name, setName] = useState(userProfile.name || '');
  const [birthDate, setBirthDate] = useState(userProfile.birthDate || '1998-05-20');
  const [gender, setGender] = useState<'masculino' | 'feminino' | 'outro' | 'nao_informar'>(userProfile.gender || 'nao_informar');
  const [heightCm, setHeightCm] = useState(userProfile.heightCm || 175);
  const [currentWeightKg, setCurrentWeightKg] = useState(userProfile.currentWeightKg || 75);
  const [targetWeightKg, setTargetWeightKg] = useState<number | undefined>(userProfile.targetWeightKg || 78);

  const [goal, setGoal] = useState<FitnessGoal>(userProfile.goal || 'hipertrofia');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(userProfile.experienceLevel || 'intermediario');
  const [daysPerWeek, setDaysPerWeek] = useState(userProfile.daysPerWeek || 4);
  const [sessionDurationMinutes, setSessionDurationMinutes] = useState(userProfile.sessionDurationMinutes || 60);

  const [gymType, setGymType] = useState<GymType>(userProfile.gymType || 'academia_completa');
  const [availableEquipment, setAvailableEquipment] = useState<string[]>(
    userProfile.availableEquipment || ['barra', 'halteres', 'polia', 'maquina']
  );

  const [selectedInjuries, setSelectedInjuries] = useState<string[]>(userProfile.injuries || []);
  const [limitationsNotes, setLimitationsNotes] = useState(userProfile.limitationsNotes || '');
  const [preferredSplit, setPreferredSplit] = useState<SplitType>(userProfile.preferredSplit || 'ABCD');

  if (!isOpen) return null;

  // Calculate age safely
  const calculateAge = (dateStr: string) => {
    if (!dateStr) return 25;
    const birth = new Date(dateStr);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
      age--;
    }
    return Math.max(14, isNaN(age) ? 25 : age);
  };

  const currentAge = calculateAge(birthDate);

  const toggleEquipment = (item: string) => {
    if (availableEquipment.includes(item)) {
      setAvailableEquipment(availableEquipment.filter(x => x !== item));
    } else {
      setAvailableEquipment([...availableEquipment, item]);
    }
  };

  const toggleInjury = (injury: string) => {
    if (selectedInjuries.includes(injury)) {
      setSelectedInjuries(selectedInjuries.filter(x => x !== injury));
    } else {
      setSelectedInjuries([...selectedInjuries, injury]);
    }
  };

  const handleFinish = () => {
    updateProfile({
      name: name.trim() || 'Atleta IRONFLOW',
      birthDate,
      age: currentAge,
      gender,
      heightCm,
      currentWeightKg,
      targetWeightKg,
      goal,
      experienceLevel,
      daysPerWeek,
      sessionDurationMinutes,
      gymType,
      availableEquipment,
      injuries: selectedInjuries,
      limitationsNotes,
      preferredSplit
    });

    // Auto-select corresponding default plan if available
    if (preferredSplit === 'ABCD') {
      const p = workoutPlans.find(pl => pl.splitType === 'ABCD');
      if (p) setActivePlanId(p.id);
    } else if (preferredSplit === 'ABC') {
      const p = workoutPlans.find(pl => pl.splitType === 'ABC');
      if (p) setActivePlanId(p.id);
    } else if (preferredSplit === 'UPPER_LOWER') {
      const p = workoutPlans.find(pl => pl.splitType === 'UPPER_LOWER');
      if (p) setActivePlanId(p.id);
    }

    setIsOnboardingCompleted(true);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#101015] border border-zinc-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header with Progress Steps */}
        <div className="p-5 border-b border-zinc-800/80 bg-[#14141c]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#CCFF00]" />
              <span className="font-extrabold text-sm uppercase tracking-widest text-[#CCFF00]">
                IRONFLOW SETUP
              </span>
            </div>
            <span className="text-xs text-zinc-400 font-mono-numbers">
              Etapa {step} de 5
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#CCFF00] h-full transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* STEP 1: Dados Pessoais & Físicos */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-white font-bold text-lg">
                <User size={20} className="text-[#CCFF00]" />
                <h3>Quem é você?</h3>
              </div>
              <p className="text-xs text-zinc-400">
                Informações para calibrar os cálculos de volume e intensidade individual.
              </p>

              <div>
                <label className="text-xs font-semibold text-zinc-300 mb-1 block">
                  Nome ou Apelido
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ex: Alex Silva"
                  className="w-full bg-[#181822] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#CCFF00]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 mb-1 block">
                    Data de Nascimento
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={e => setBirthDate(e.target.value)}
                    className="w-full bg-[#181822] border border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#CCFF00]"
                  />
                  <span className="text-[11px] text-zinc-400 mt-0.5 block">
                    Idade: {currentAge} anos
                  </span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 mb-1 block">
                    Sexo biológico (opcional)
                  </label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value as any)}
                    className="w-full bg-[#181822] border border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#CCFF00]"
                  >
                    <option value="masculino">Masculino</option>
                    <option value="feminino">Feminino</option>
                    <option value="outro">Outro</option>
                    <option value="nao_informar">Prefiro não informar</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 mb-1 block">
                    Altura (cm)
                  </label>
                  <input
                    type="number"
                    value={heightCm}
                    onChange={e => setHeightCm(Number(e.target.value))}
                    className="w-full bg-[#181822] border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white font-mono-numbers focus:outline-none focus:border-[#CCFF00]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-300 mb-1 block">
                    Peso Atual (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={currentWeightKg}
                    onChange={e => setCurrentWeightKg(Number(e.target.value))}
                    className="w-full bg-[#181822] border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white font-mono-numbers focus:outline-none focus:border-[#CCFF00]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-300 mb-1 block">
                    Peso-meta (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={targetWeightKg || ''}
                    onChange={e => setTargetWeightKg(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Opcional"
                    className="w-full bg-[#181822] border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white font-mono-numbers focus:outline-none focus:border-[#CCFF00]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Objetivo & Experiência */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-white font-bold text-lg">
                <Target size={20} className="text-[#CCFF00]" />
                <h3>Qual seu objetivo principal?</h3>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'hipertrofia' as FitnessGoal, label: 'Hipertrofia', desc: 'Ganho de massa muscular e volume' },
                  { id: 'forca' as FitnessGoal, label: 'Força Pura', desc: 'Aumento de 1RM e potência' },
                  { id: 'emagrecimento' as FitnessGoal, label: 'Emagrecimento', desc: 'Déficit calórico com retenção muscular' },
                  { id: 'recomposicao' as FitnessGoal, label: 'Recomposição', desc: 'Ganhar massa e perder gordura' },
                  { id: 'condicionamento' as FitnessGoal, label: 'Condicionamento', desc: 'Resistência aeróbica e muscular' },
                  { id: 'saude_geral' as FitnessGoal, label: 'Saúde & Longevidade', desc: 'Bem-estar, postura e mobilidade' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setGoal(item.id)}
                    className={`p-3 rounded-2xl text-left border transition-all ${
                      goal === item.id
                        ? 'border-[#CCFF00] bg-[#CCFF00]/10 text-white'
                        : 'border-zinc-800 bg-[#161620] text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center justify-between">
                      {item.label}
                      {goal === item.id && <Check size={14} className="text-[#CCFF00]" />}
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-1 leading-tight">{item.desc}</div>
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <label className="text-xs font-semibold text-zinc-300 mb-2 block">
                  Nível de Experiência na Musculação
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'iniciante' as ExperienceLevel, label: 'Iniciante', sub: '< 1 ano' },
                    { id: 'intermediario' as ExperienceLevel, label: 'Intermediário', sub: '1 a 3 anos' },
                    { id: 'avancado' as ExperienceLevel, label: 'Avançado', sub: '> 3 anos' }
                  ].map(lvl => (
                    <button
                      key={lvl.id}
                      onClick={() => setExperienceLevel(lvl.id)}
                      className={`py-2.5 px-2 rounded-xl text-center border text-xs font-bold transition-all ${
                        experienceLevel === lvl.id
                          ? 'border-[#CCFF00] bg-[#CCFF00] text-black font-extrabold'
                          : 'border-zinc-800 bg-[#161620] text-zinc-300'
                      }`}
                    >
                      <div>{lvl.label}</div>
                      <div className={`text-[10px] font-normal ${experienceLevel === lvl.id ? 'text-black/80' : 'text-zinc-500'}`}>
                        {lvl.sub}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Disponibilidade & Academia */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-white font-bold text-lg">
                <Calendar size={20} className="text-[#CCFF00]" />
                <h3>Rotina & Equipamentos</h3>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-zinc-300">
                    Dias de treino por semana
                  </label>
                  <span className="font-mono-numbers text-sm font-black text-[#CCFF00]">
                    {daysPerWeek} dias
                  </span>
                </div>
                <div className="flex gap-2">
                  {[2, 3, 4, 5, 6].map(d => (
                    <button
                      key={d}
                      onClick={() => setDaysPerWeek(d)}
                      className={`flex-1 py-2 rounded-xl border text-xs font-bold font-mono-numbers transition-all ${
                        daysPerWeek === d
                          ? 'border-[#CCFF00] bg-[#CCFF00] text-black'
                          : 'border-zinc-800 bg-[#161620] text-zinc-300'
                      }`}
                    >
                      {d}x
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 mb-1.5 block">
                  Duração média desejada por sessão
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[45, 60, 75, 90].map(mins => (
                    <button
                      key={mins}
                      onClick={() => setSessionDurationMinutes(mins)}
                      className={`py-2 rounded-xl border text-xs font-semibold font-mono-numbers transition-all ${
                        sessionDurationMinutes === mins
                          ? 'border-[#CCFF00] bg-[#CCFF00]/15 text-[#CCFF00] font-bold'
                          : 'border-zinc-800 bg-[#161620] text-zinc-400'
                      }`}
                    >
                      {mins} min
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 mb-1.5 block">
                  Ambiente de Treino
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'academia_completa' as GymType, label: 'Academia Completa' },
                    { id: 'academia_basica' as GymType, label: 'Academia Básica' },
                    { id: 'treino_em_casa' as GymType, label: 'Treino em Casa' }
                  ].map(g => (
                    <button
                      key={g.id}
                      onClick={() => setGymType(g.id)}
                      className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all ${
                        gymType === g.id
                          ? 'border-[#CCFF00] bg-[#CCFF00]/10 text-white'
                          : 'border-zinc-800 bg-[#161620] text-zinc-400'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 mb-1.5 block">
                  Equipamentos Disponíveis
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'barra', label: 'Barras & Anilhas' },
                    { id: 'halteres', label: 'Halteres' },
                    { id: 'polia', label: 'Polias / Cabos' },
                    { id: 'maquina', label: 'Máquinas Guiadas' },
                    { id: 'peso_corporal', label: 'Barras / Paralelas' }
                  ].map(eq => {
                    const active = availableEquipment.includes(eq.id);
                    return (
                      <button
                        key={eq.id}
                        onClick={() => toggleEquipment(eq.id)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                          active
                            ? 'border-[#CCFF00] bg-[#CCFF00]/20 text-[#CCFF00] font-bold'
                            : 'border-zinc-800 bg-zinc-900 text-zinc-500'
                        }`}
                      >
                        {active && '✓ '}
                        {eq.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Saúde, Lesões & Limitações */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-white font-bold text-lg">
                <ShieldAlert size={20} className="text-[#CCFF00]" />
                <h3>Saúde & Limitações Físicas</h3>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Informe voluntariamente dores ou lesões articulares prévias. O IRONFLOW
                irá adaptar a seleção de exercícios para proteger suas articulações.
              </p>

              <div>
                <label className="text-xs font-semibold text-zinc-300 mb-2 block">
                  Regiões sensíveis ou com histórico de dor:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Ombro / Manguito',
                    'Coluna Lombar',
                    'Joelhos',
                    'Cotovelos / Tendinite',
                    'Punhos',
                    'Cervical'
                  ].map(injury => {
                    const isSelected = selectedInjuries.includes(injury);
                    return (
                      <button
                        key={injury}
                        onClick={() => toggleInjury(injury)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                          isSelected
                            ? 'border-amber-400/80 bg-amber-400/10 text-amber-200 font-bold'
                            : 'border-zinc-800 bg-[#161620] text-zinc-400'
                        }`}
                      >
                        {isSelected ? '⚠️ ' : ''}
                        {injury}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 mb-1 block">
                  Observações adicionais de saúde (opcional)
                </label>
                <textarea
                  rows={2}
                  value={limitationsNotes}
                  onChange={e => setLimitationsNotes(e.target.value)}
                  placeholder="Ex: Evitar supino com pegada muito aberta; foco em mobilidade de quadril."
                  className="w-full bg-[#181822] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#CCFF00]"
                />
              </div>

              <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-2xl text-[11px] text-zinc-400">
                ⚠️ As recomendações do aplicativo não substituem diagnóstico médico ou liberação profissional para a prática desportiva.
              </div>
            </div>
          )}

          {/* STEP 5: Divisão Preferida & Revisão Final */}
          {step === 5 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-white font-bold text-lg">
                <Sparkles size={20} className="text-[#CCFF00]" />
                <h3>Divisão Recomendada & Revisão</h3>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 mb-2 block">
                  Estrutura de Divisão Sugerida
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'ABCD' as SplitType, label: 'ABCD (Recomendada)', desc: '4 treinos: Peito/Tríceps, Costas/Bíceps, Pernas, Ombros' },
                    { id: 'ABC' as SplitType, label: 'ABC (Push/Pull/Legs)', desc: '3 a 6 treinos: Empurrar, Puxar, Pernas' },
                    { id: 'UPPER_LOWER' as SplitType, label: 'Upper / Lower', desc: '4 treinos: Superior e Inferior 2x na semana' },
                    { id: 'FULL_BODY' as SplitType, label: 'Full Body', desc: '3 treinos de corpo inteiro por semana' }
                  ].map(sp => (
                    <button
                      key={sp.id}
                      onClick={() => setPreferredSplit(sp.id)}
                      className={`p-3 rounded-2xl text-left border transition-all ${
                        preferredSplit === sp.id
                          ? 'border-[#CCFF00] bg-[#CCFF00]/10 text-white'
                          : 'border-zinc-800 bg-[#161620] text-zinc-400'
                      }`}
                    >
                      <div className="font-bold text-xs flex items-center justify-between text-white">
                        {sp.label}
                        {preferredSplit === sp.id && <Check size={14} className="text-[#CCFF00]" />}
                      </div>
                      <div className="text-[10px] text-zinc-400 mt-1 leading-tight">{sp.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary Card */}
              <div className="bg-[#181822] border border-zinc-700/80 rounded-2xl p-4 text-xs space-y-2">
                <div className="text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
                  Resumo do seu Perfil
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-zinc-300">
                  <div>Atleta: <span className="font-bold text-white">{name || 'Alex'}</span></div>
                  <div>Idade: <span className="font-bold text-white">{currentAge} anos</span></div>
                  <div>Peso / Altura: <span className="font-bold text-white">{currentWeightKg}kg / {heightCm}cm</span></div>
                  <div>Objetivo: <span className="font-bold text-[#CCFF00] uppercase">{goal}</span></div>
                  <div>Nível: <span className="font-bold text-white">{experienceLevel}</span></div>
                  <div>Frequência: <span className="font-bold text-white">{daysPerWeek} dias/sem</span></div>
                  <div>Divisão: <span className="font-bold text-[#CCFF00]">{preferredSplit}</span></div>
                  <div>Limitações: <span className="font-bold text-amber-300">{selectedInjuries.length ? selectedInjuries.join(', ') : 'Nenhuma'}</span></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="p-4 border-t border-zinc-800 bg-[#14141c] flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800 font-semibold text-xs flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <ChevronLeft size={16} />
              Voltar
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-zinc-400 hover:text-white text-xs font-semibold"
            >
              Pular por agora
            </button>
          )}

          {step < 5 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="ml-auto px-5 py-2.5 rounded-xl bg-[#CCFF00] hover:bg-[#b8e600] active:scale-95 text-black font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-[#CCFF00]/20"
            >
              Avançar
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="ml-auto px-6 py-2.5 rounded-xl bg-[#CCFF00] hover:bg-[#b8e600] active:scale-95 text-black font-extrabold text-xs flex items-center gap-2 transition-all shadow-lg shadow-[#CCFF00]/30"
            >
              <Check size={16} strokeWidth={3} />
              Salvar & Gerar Ficha
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
