import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Shield,
  Volume2,
  Smartphone,
  Download,
  Upload,
  RotateCcw,
  Watch,
  Check,
  AlertTriangle,
  HeartPulse,
  Settings
} from 'lucide-react';

interface ProfileViewProps {
  onOpenOnboarding: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onOpenOnboarding }) => {
  const {
    userProfile,
    updateProfile,
    exportData,
    importData,
    resetAllData
  } = useApp();

  const [importText, setImportText] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [exportNotice, setExportNotice] = useState(false);

  const handleExport = () => {
    const jsonStr = exportData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ironflow_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3000);
  };

  const handleImportSubmit = () => {
    if (!importText.trim()) return;
    const ok = importData(importText.trim());
    if (ok) {
      alert('Dados importados com sucesso!');
      setShowImportModal(false);
      setImportText('');
    } else {
      alert('Formato JSON inválido. Verifique o arquivo de backup.');
    }
  };

  const handleResetConfirm = () => {
    if (confirm('Tem certeza que deseja redefinir o aplicativo? Todos os dados locais serão apagados.')) {
      resetAllData();
      alert('Aplicativo restaurado para o estado inicial.');
    }
  };

  return (
    <div className="space-y-5 pb-28 pt-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            CONFIGURAÇÕES & CONTA
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Perfil & Saúde
          </h1>
        </div>

        <button
          onClick={onOpenOnboarding}
          className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-[#CCFF00] border border-[#CCFF00]/30 transition-all"
        >
          Editar Perfil
        </button>
      </div>

      {/* User Physical Profile Card */}
      <div className="bg-[#14141c] border border-zinc-800 rounded-3xl p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-[#CCFF00]/15 text-[#CCFF00] border border-[#CCFF00]/30 font-black text-xl flex items-center justify-center">
            {userProfile.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-lg font-black text-white">{userProfile.name}</h2>
            <div className="text-xs text-zinc-400">
              {userProfile.age} anos • {userProfile.currentWeightKg} kg • {userProfile.heightCm} cm
            </div>
            <div className="text-[10px] text-[#CCFF00] font-extrabold uppercase mt-0.5">
              Foco: {userProfile.goal} ({userProfile.experienceLevel})
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-zinc-800">
          <div className="bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800/80">
            <span className="text-[10px] text-zinc-500 uppercase font-semibold block">Frequência</span>
            <span className="font-bold text-white font-mono-numbers">{userProfile.daysPerWeek} dias/semana</span>
          </div>
          <div className="bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800/80">
            <span className="text-[10px] text-zinc-500 uppercase font-semibold block">Divisão</span>
            <span className="font-bold text-[#CCFF00]">{userProfile.preferredSplit}</span>
          </div>
        </div>
      </div>

      {/* Health Profile & Injuries */}
      <div className="bg-[#14141c] border border-zinc-800 rounded-3xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Shield size={18} className="text-[#CCFF00]" />
          <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">
            Perfil de Saúde & Lesões
          </h3>
        </div>

        <p className="text-xs text-zinc-400">
          Restrições articulares declaradas voluntariamente para personalização de segurança:
        </p>

        {userProfile.injuries && userProfile.injuries.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {userProfile.injuries.map((inj, idx) => (
              <span
                key={idx}
                className="text-xs px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 font-medium flex items-center gap-1"
              >
                ⚠️ {inj}
              </span>
            ))}
          </div>
        ) : (
          <div className="text-xs text-emerald-400 bg-emerald-950/20 border border-emerald-500/20 p-2.5 rounded-xl">
            ✓ Nenhuma lesão ou restrição informada.
          </div>
        )}

        {userProfile.limitationsNotes && (
          <div className="text-xs text-zinc-300 bg-zinc-900 p-3 rounded-xl border border-zinc-800">
            <span className="font-bold text-zinc-400 block mb-0.5">Observações:</span>
            {userProfile.limitationsNotes}
          </div>
        )}
      </div>

      {/* Device & Sound Preferences */}
      <div className="bg-[#14141c] border border-zinc-800 rounded-3xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Volume2 size={18} className="text-[#CCFF00]" />
          <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">
            Cronômetro & Alertas
          </h3>
        </div>

        <div className="space-y-2">
          {/* Sound Alert Toggle */}
          <div className="flex items-center justify-between p-3 bg-zinc-900/60 border border-zinc-800 rounded-2xl">
            <div>
              <div className="text-xs font-bold text-white">Alerta Sonoro no Descanso</div>
              <div className="text-[10px] text-zinc-400">Beep sintetizado nos últimos 3 segundos</div>
            </div>
            <button
              onClick={() => updateProfile({ soundAlertsEnabled: !userProfile.soundAlertsEnabled })}
              className={`w-12 h-6.5 rounded-full transition-colors p-1 flex items-center ${
                userProfile.soundAlertsEnabled ? 'bg-[#CCFF00] justify-end' : 'bg-zinc-800 justify-start'
              }`}
            >
              <div className="w-4.5 h-4.5 rounded-full bg-black shadow-md" />
            </button>
          </div>

          {/* Vibration Alert Toggle */}
          <div className="flex items-center justify-between p-3 bg-zinc-900/60 border border-zinc-800 rounded-2xl">
            <div>
              <div className="text-xs font-bold text-white">Vibração no Dispositivo</div>
              <div className="text-[10px] text-zinc-400">Vibrar ao término da contagem (mobile)</div>
            </div>
            <button
              onClick={() => updateProfile({ vibrationEnabled: !userProfile.vibrationEnabled })}
              className={`w-12 h-6.5 rounded-full transition-colors p-1 flex items-center ${
                userProfile.vibrationEnabled ? 'bg-[#CCFF00] justify-end' : 'bg-zinc-800 justify-start'
              }`}
            >
              <div className="w-4.5 h-4.5 rounded-full bg-black shadow-md" />
            </button>
          </div>
        </div>
      </div>

      {/* Wear OS & Health Connect Roadmap Card (Explicit Requirement 13) */}
      <div className="bg-[#14141c] border border-zinc-800 rounded-3xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Watch size={18} className="text-[#CCFF00]" />
          <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">
            Integração com Relógios & Sensores
          </h3>
        </div>

        <div className="p-3.5 bg-zinc-900/90 border border-zinc-800 rounded-2xl text-xs space-y-2">
          <div className="flex items-center gap-1.5 text-zinc-300 font-bold">
            <Smartphone size={14} className="text-[#CCFF00]" />
            Status das Etapas de Integração:
          </div>
          <ul className="space-y-1.5 text-zinc-400 text-[11px]">
            <li className="flex items-center gap-2 text-emerald-400 font-medium">
              ✓ <strong>Etapa 1 (Ativa):</strong> Cronômetro com persistência em segundo plano, áudio e vibração.
            </li>
            <li className="flex items-center gap-2">
              ⏳ <strong>Etapa 2 (Planejada):</strong> Sincronização Health Connect para peso e frequência cardíaca.
            </li>
            <li className="flex items-center gap-2">
              ⏳ <strong>Etapa 3 (Planejada):</strong> Aplicativo complementar Wear OS para controle de séries no pulso.
            </li>
          </ul>
          <p className="text-[10px] text-zinc-500 pt-1">
            * Em conformidade com as diretrizes IRONFLOW, não simulamos conexão falsa com o relógio.
          </p>
        </div>
      </div>

      {/* Data Backup & Privacy (Requirement 14) */}
      <div className="bg-[#14141c] border border-zinc-800 rounded-3xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Download size={18} className="text-[#CCFF00]" />
          <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">
            Privacidade & Backup Local
          </h3>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          Seus dados de séries e medidas são armazenados localmente e criptografados no navegador.
          Você pode fazer backup e restaurar a qualquer momento.
        </p>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleExport}
            className="py-2.5 px-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Download size={15} /> Exportar Backup
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            className="py-2.5 px-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Upload size={15} /> Restaurar Backup
          </button>
        </div>

        {exportNotice && (
          <div className="text-[11px] text-[#CCFF00] text-center font-semibold animate-in fade-in duration-200">
            ✓ Arquivo JSON de backup baixado com sucesso!
          </div>
        )}

        <div className="pt-2 border-t border-zinc-800">
          <button
            onClick={handleResetConfirm}
            className="w-full py-2.5 rounded-2xl border border-red-500/30 hover:border-red-500/60 text-red-400 hover:bg-red-950/20 text-xs font-bold flex items-center justify-center gap-2 transition-all"
          >
            <RotateCcw size={14} /> Redefinir Dados do Aplicativo
          </button>
        </div>
      </div>

      {/* MODAL: Importar JSON */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#12121a] border border-zinc-800 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-lg text-white">
              Restaurar Backup (JSON)
            </h3>
            <p className="text-xs text-zinc-400">
              Cole o conteúdo do arquivo de backup exportado anteriormente:
            </p>

            <textarea
              rows={6}
              value={importText}
              onChange={e => setImportText(e.target.value)}
              placeholder="Cole o código JSON aqui..."
              className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl p-3 font-mono-numbers text-xs text-white focus:outline-none focus:border-[#CCFF00]"
            />

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowImportModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleImportSubmit}
                className="flex-1 py-2.5 rounded-xl bg-[#CCFF00] hover:bg-[#b8e600] text-black font-extrabold text-xs shadow-lg shadow-[#CCFF00]/20"
              >
                Importar Dados
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
