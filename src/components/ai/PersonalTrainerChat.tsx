import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ChatMessage } from '../../types';
import {
  Send,
  Sparkles,
  Bot,
  User,
  ShieldAlert,
  Dumbbell,
  RefreshCw,
  TrendingUp,
  HelpCircle,
  Activity
} from 'lucide-react';

export const PersonalTrainerChat: React.FC = () => {
  const { userProfile, activePlan, history } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'assistant',
      text: `Olá, **${userProfile.name.split(' ')[0]}**! Sou seu Personal Trainer IA IRONFLOW.\n\nEstou conectado ao seu histórico real de treinos na divisão **${activePlan.splitType}**. Posso te explicar a execução de qualquer exercício, sugerir substituições caso um aparelho esteja ocupado na academia, ou analisar sua progressão de cargas.\n\nComo posso te ajudar hoje?`,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        'Como aplicar a progressão dupla no supino?',
        'O que fazer se o pulley estiver ocupado?',
        'Analise minha evolução nos treinos recentes',
        'Sinto dor no ombro na elevação lateral'
      ]
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (userText: string) => {
    const textToSend = userText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Build summary of recent sessions
      const historySummary = history.slice(0, 3).map(s => {
        const exSummary = s.exercises.map(e => {
          const maxLoad = Math.max(...e.sets.map(x => x.loadKg));
          const totalReps = e.sets.reduce((acc, x) => acc + x.reps, 0);
          return `${e.exerciseName} (${maxLoad}kg, ${e.sets.length} séries, ${totalReps} reps)`;
        }).join('; ');
        return `${s.routineName} em ${s.startTime.split('T')[0]}: [${exSummary}]`;
      }).join(' | ');

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          userProfile,
          currentSplit: activePlan.splitType,
          historySummary: historySummary || 'Nenhum treino anterior registrado ainda.'
        })
      });

      if (res.ok) {
        const data = await res.json();
        const aiMsg: ChatMessage = {
          id: `msg_a_${Date.now()}`,
          sender: 'assistant',
          text: data.reply || 'Certo! Foque na execução correta e na sobrecarga progressiva.',
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        const errorData = await res.json();
        const errorMsg: ChatMessage = {
          id: `msg_err_${Date.now()}`,
          sender: 'assistant',
          text: `⚠️ ${errorData.error || 'Não foi possível se comunicar com o Personal IA no momento.'}`,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, errorMsg]);
      }
    } catch {
      const offlineMsg: ChatMessage = {
        id: `msg_off_${Date.now()}`,
        sender: 'assistant',
        text: 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, offlineMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-xl mx-auto w-full pb-4">
      {/* Safety & Medical Disclaimer Banner */}
      <div className="bg-[#14141c] border border-zinc-800 rounded-2xl p-3 mb-3 flex items-start gap-2.5 shrink-0">
        <ShieldAlert size={16} className="text-amber-400 shrink-0 mt-0.5" />
        <div className="text-[11px] text-zinc-400 leading-tight">
          As orientações fornecidas utilizam dados reais registrados e princípios de
          biomecânica. Elas <strong className="text-zinc-200">não substituem</strong> avaliação
          médica ou diagnóstico profissional.
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map(msg => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-[#CCFF00] text-black shadow-md shadow-[#CCFF00]/20'
                    : 'bg-zinc-800 border border-zinc-700 text-[#CCFF00]'
                }`}
              >
                {isUser ? <User size={16} /> : <Bot size={16} />}
              </div>

              {/* Message Content */}
              <div className={`max-w-[85%] space-y-2`}>
                <div
                  className={`p-4 rounded-3xl text-xs leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? 'bg-[#CCFF00] text-black font-medium rounded-tr-none shadow-md shadow-[#CCFF00]/10'
                      : 'bg-[#151520] border border-zinc-800 text-zinc-200 rounded-tl-none shadow-lg'
                  }`}
                >
                  {msg.text}
                </div>

                <div
                  className={`text-[10px] text-zinc-500 font-mono-numbers px-1 ${
                    isUser ? 'text-right' : 'text-left'
                  }`}
                >
                  {msg.timestamp}
                </div>

                {/* Suggestions Pills if present */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.suggestions.map((sug, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(sug)}
                        className="text-[11px] px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-[#CCFF00] hover:text-[#CCFF00] transition-all text-left"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-zinc-500 text-xs py-2 pl-10">
            <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-bounce [animation-delay:0.2s]" />
            <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-bounce [animation-delay:0.4s]" />
            <span className="text-[11px] ml-1 text-zinc-400">Personal IA analisando histórico...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Bar */}
      <div className="pt-3 shrink-0">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage(inputMessage);
          }}
          className="relative flex items-center gap-2 bg-[#14141c] border border-zinc-800 rounded-2xl p-1.5 focus-within:border-[#CCFF00] transition-colors"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            placeholder="Pergunte sobre técnica, carga ou substituição..."
            className="flex-1 bg-transparent px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="w-10 h-10 rounded-xl bg-[#CCFF00] hover:bg-[#b8e600] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed text-black flex items-center justify-center transition-all shadow-md shadow-[#CCFF00]/20"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};
