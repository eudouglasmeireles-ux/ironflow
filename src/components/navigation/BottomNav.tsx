import React from 'react';
import { Home, Dumbbell, TrendingUp, Sparkles, User } from 'lucide-react';

export type NavTab = 'home' | 'workouts' | 'progress' | 'ai' | 'profile';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home' as NavTab, label: 'Início', icon: Home },
    { id: 'workouts' as NavTab, label: 'Treinos', icon: Dumbbell },
    { id: 'progress' as NavTab, label: 'Progresso', icon: TrendingUp },
    { id: 'ai' as NavTab, label: 'Personal IA', icon: Sparkles },
    { id: 'profile' as NavTab, label: 'Perfil', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0d0d12]/95 backdrop-blur-md border-t border-[#22222c] pb-[env(safe-area-inset-bottom,0px)]">
      <div className="max-w-md mx-auto px-3 py-2 flex items-center justify-between">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-[#CCFF00]'
                  : 'text-zinc-400 hover:text-zinc-200 active:scale-95'
              }`}
            >
              <div className="relative">
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.6 : 2}
                  className={`transition-transform duration-200 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(204,255,0,0.5)]' : ''}`}
                />
                {tab.id === 'ai' && (
                  <span className="absolute -top-1 -right-1.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#CCFF00] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#CCFF00]"></span>
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 font-semibold tracking-tight ${isActive ? 'text-[#CCFF00] font-bold' : 'text-zinc-400'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
