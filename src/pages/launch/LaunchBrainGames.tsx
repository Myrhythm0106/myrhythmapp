import React, { useState } from 'react';
import { LaunchLayout } from '@/components/launch/LaunchLayout';
import { LaunchCard } from '@/components/launch/LaunchCard';
import { LaunchButton } from '@/components/launch/LaunchButton';
import { CompletionCelebration } from '@/components/launch/CompletionCelebration';
import { Gamepad2, Brain, Zap, Target, Clock, Lock, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LaunchBrainGames() {
  const [showCelebration, setShowCelebration] = useState(false);
  const streak = 7;
  const gamesPlayed = 2;
  const freeGamesLeft = 3 - gamesPlayed;

  const games = [
    { 
      id: 'memory-match', 
      title: 'Memory Match', 
      description: 'Find matching pairs', 
      icon: Brain,
      color: 'from-purple-400 to-purple-600',
      free: true 
    },
    { 
      id: 'word-recall', 
      title: 'Word Recall', 
      description: 'Remember the words', 
      icon: Zap,
      color: 'from-blue-400 to-blue-600',
      free: true 
    },
    { 
      id: 'sequence', 
      title: 'Sequence', 
      description: 'Follow the pattern', 
      icon: Target,
      color: 'from-emerald-400 to-emerald-600',
      free: true 
    },
    { 
      id: 'speed-math', 
      title: 'Speed Math', 
      description: 'Quick calculations', 
      icon: Clock,
      color: 'from-amber-400 to-amber-600',
      free: false 
    },
  ];

  const handlePlayGame = (gameId: string) => {
    // Would navigate to actual game
    // For demo, show celebration after "playing"
    setTimeout(() => setShowCelebration(true), 500);
  };

  return (
    <LaunchLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Brain Games</h1>
          <p className="text-gray-600">Keep your mind sharp</p>
        </div>
        <div className="flex items-center gap-2 bg-orange-100 px-3 py-1.5 rounded-full">
          <span className="text-lg">🔥</span>
          <span className="font-bold text-orange-600">{streak} day streak</span>
        </div>
      </div>

      {/* Free Games Indicator */}
      <LaunchCard variant="glass" className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-emerald-100 flex items-center justify-center">
              <Gamepad2 className="h-5 w-5 text-brand-emerald-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{freeGamesLeft} free games today</p>
              <p className="text-xs text-gray-500">Resets at midnight</p>
            </div>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  "w-3 h-3 rounded-full",
                  i <= freeGamesLeft ? "bg-brand-emerald-500" : "bg-gray-200"
                )}
              />
            ))}
          </div>
        </div>
      </LaunchCard>

      {/* Games Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {games.map((game) => (
          <LaunchCard 
            key={game.id}
            variant={game.free ? 'default' : 'glass'}
            className={cn(
              "relative overflow-hidden",
              !game.free && "opacity-75"
            )}
            onClick={() => game.free && handlePlayGame(game.id)}
          >
            <div className={cn(
              "absolute inset-0 opacity-10 bg-gradient-to-br",
              game.color
            )} />
            
            <div className="relative">
              <div className={cn(
                "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3",
                game.color
              )}>
                {game.free ? (
                  <game.icon className="h-6 w-6 text-white" />
                ) : (
                  <Lock className="h-6 w-6 text-white" />
                )}
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-1">{game.title}</h3>
              <p className="text-xs text-gray-500">{game.description}</p>
              
              {!game.free && (
                <span className="mt-2 inline-block text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  Premium
                </span>
              )}
            </div>
          </LaunchCard>
        ))}
      </div>

      {/* Stats */}
      <h2 className="font-semibold text-gray-900 mb-3">Your Progress</h2>
      <LaunchCard className="mb-24">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="w-12 h-12 mx-auto mb-2 bg-purple-100 rounded-xl flex items-center justify-center">
              <Trophy className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-xl font-bold text-gray-900">42</p>
            <p className="text-xs text-gray-500">Games played</p>
          </div>
          <div>
            <div className="w-12 h-12 mx-auto mb-2 bg-orange-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">🔥</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{streak}</p>
            <p className="text-xs text-gray-500">Day streak</p>
          </div>
          <div>
            <div className="w-12 h-12 mx-auto mb-2 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Brain className="h-6 w-6 text-emerald-600" />
            </div>
            <p className="text-xl font-bold text-gray-900">85%</p>
            <p className="text-xs text-gray-500">Accuracy</p>
          </div>
        </div>
      </LaunchCard>

      {/* Celebration */}
      <CompletionCelebration
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        actionTitle="Brain Game session"
        streakCount={streak}
        isPersonalBest={streak === 7}
        onNotifySupport={() => console.log('Notifying support of game completion')}
      />
    </LaunchLayout>
  );
}
