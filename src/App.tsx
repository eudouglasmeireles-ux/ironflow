import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { BottomNav, NavTab } from './components/navigation/BottomNav';
import { HomeView } from './components/home/HomeView';
import { WorkoutListView } from './components/workout/WorkoutListView';
import { ProgressView } from './components/progress/ProgressView';
import { PersonalTrainerChat } from './components/ai/PersonalTrainerChat';
import { ProfileView } from './components/profile/ProfileView';
import { LiveWorkoutView } from './components/workout/LiveWorkoutView';
import { FloatingRestTimer } from './components/timer/FloatingRestTimer';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { WorkoutRoutine } from './types';
import { Dumbbell, Sparkles } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { isOnboardingCompleted, activeSession, startWorkout } = useApp();

  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [isLiveWorkoutOpen, setIsLiveWorkoutOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(!isOnboardingCompleted);

  const handleStartRoutine = (routine: WorkoutRoutine) => {
    startWorkout(routine);
    setIsLiveWorkoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col selection:bg-[#CCFF00] selection:text-black">
      {/* Top Brand Header (hidden when live workout is in full screen mode) */}
      {!isLiveWorkoutOpen && (
        <header className="sticky top-0 z-30 bg-[#0a0a0c]/90 backdrop-blur-md border-b border-zinc-900/80 px-4 py-3">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#CCFF00] flex items-center justify-center text-black font-black shadow-md shadow-[#CCFF00]/30">
                <Dumbbell size={18} strokeWidth={2.8} />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-base tracking-tighter text-white flex items-center gap-1">
                  IRON<span className="text-[#CCFF00]">FLOW</span>
                </span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 -mt-1">
                  Intelligent Training
                </span>
              </div>
            </div>

            {/* Quick Live Workout Badge indicator if session is running in background */}
            {activeSession && (
              <button
                onClick={() => setIsLiveWorkoutOpen(true)}
                className="px-2.5 py-1 rounded-full bg-[#CCFF00]/15 border border-[#CCFF00]/40 text-[#CCFF00] text-[11px] font-bold flex items-center gap-1.5 animate-pulse"
              >
                <span className="w-2 h-2 rounded-full bg-[#CCFF00]" />
                Em Treino
              </button>
            )}
          </div>
        </header>
      )}

      {/* Main View Area */}
      <main className="flex-1 max-w-md mx-auto w-full px-4 pt-2">
        {activeTab === 'home' && (
          <HomeView
            onStartRoutine={handleStartRoutine}
            onNavigateToTab={tab => setActiveTab(tab)}
            onOpenLiveWorkout={() => setIsLiveWorkoutOpen(true)}
          />
        )}

        {activeTab === 'workouts' && (
          <WorkoutListView
            onStartRoutine={handleStartRoutine}
            onOpenLiveWorkout={() => setIsLiveWorkoutOpen(true)}
          />
        )}

        {activeTab === 'progress' && <ProgressView />}

        {activeTab === 'ai' && <PersonalTrainerChat />}

        {activeTab === 'profile' && (
          <ProfileView onOpenOnboarding={() => setShowOnboarding(true)} />
        )}
      </main>

      {/* Floating Rest Timer (persists across all non-live screens if active) */}
      {!isLiveWorkoutOpen && (
        <FloatingRestTimer onOpenLiveWorkout={() => setIsLiveWorkoutOpen(true)} />
      )}

      {/* Bottom Navigation */}
      {!isLiveWorkoutOpen && (
        <BottomNav activeTab={activeTab} onTabChange={tab => setActiveTab(tab)} />
      )}

      {/* Fullscreen Live Workout Session Modal */}
      {isLiveWorkoutOpen && (
        <LiveWorkoutView onClose={() => setIsLiveWorkoutOpen(false)} />
      )}

      {/* Onboarding Wizard Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
