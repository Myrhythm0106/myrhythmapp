
import React, { useState } from 'react';
import { MemoryEffectsContainer } from '@/components/ui/memory-effects';
import { BrainFriendlyGoalCreator } from '@/components/goals/BrainFriendlyGoalCreator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Target, Plus } from 'lucide-react';

export default function Goals() {
  const [showGoalCreator, setShowGoalCreator] = useState(false);

  const handleGoalCreated = (goal: any) => {
    console.log('Goal created:', goal);
    setShowGoalCreator(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-memory-emerald-50/30 via-white to-clarity-teal-50/30">
      <MemoryEffectsContainer nodeCount={8} className="relative">
        <div className="container mx-auto px-4 py-6 space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-6 py-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-memory-emerald-400 to-clarity-teal-400 rounded-full flex items-center justify-center animate-memory-pulse">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-memory-emerald-600 to-clarity-teal-600 bg-clip-text text-transparent">
                Your Goal Journey
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Create meaningful goals that work with your brain, building neural pathways step by step.
            </p>
            <div className="flex gap-4 justify-center">
              <Badge variant="outline" className="bg-memory-emerald-50 text-memory-emerald-700 border-memory-emerald-200">
                Memory1st Approach
              </Badge>
              <Badge variant="outline" className="bg-brain-health-50 text-brain-health-700 border-brain-health-200">
                Brain-Friendly Planning
              </Badge>
            </div>
          </div>

          {/* Goal Creation CTA */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-memory-emerald-50/50 to-white p-8 rounded-xl border border-memory-emerald-200">
              <div className="text-center space-y-4">
                <Target className="h-16 w-16 mx-auto text-memory-emerald-500" />
                <h2 className="text-2xl font-semibold text-memory-emerald-800">
                  Ready to Create Your First Goal?
                </h2>
                <p className="text-brain-base text-gray-600">
                  Our brain-friendly approach breaks down goals into manageable steps that build lasting habits and neural pathways.
                </p>
                <Button
                  onClick={() => setShowGoalCreator(true)}
                  className="bg-gradient-to-r from-memory-emerald-500 to-memory-emerald-600 hover:from-memory-emerald-600 hover:to-memory-emerald-700 text-white font-medium px-8 py-3 text-lg"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your Goal
                </Button>
              </div>
            </div>
          </div>

          {/* Educational Content */}
          <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-2">
            <div className="bg-white/80 p-6 rounded-lg border border-clarity-teal-200">
              <h3 className="text-brain-lg font-semibold text-clarity-teal-800 mb-3">
                Why Our Approach Works
              </h3>
              <ul className="space-y-2 text-brain-sm text-gray-600">
                <li>• Breaks complex goals into brain-friendly steps</li>
                <li>• Reduces cognitive overwhelm</li>
                <li>• Builds on neuroplasticity principles</li>
                <li>• Celebrates small wins to maintain motivation</li>
              </ul>
            </div>
            
            <div className="bg-white/80 p-6 rounded-lg border border-brain-health-200">
              <h3 className="text-brain-lg font-semibold text-brain-health-800 mb-3">
                Memory1st Benefits
              </h3>
              <ul className="space-y-2 text-brain-sm text-gray-600">
                <li>• Strengthens memory formation</li>
                <li>• Improves executive function</li>
                <li>• Builds confidence through achievable steps</li>
                <li>• Creates lasting behavioral changes</li>
              </ul>
            </div>
          </div>
        </div>
      </MemoryEffectsContainer>

      <BrainFriendlyGoalCreator
        open={showGoalCreator}
        onOpenChange={setShowGoalCreator}
        onGoalCreated={handleGoalCreated}
      />
    </div>
  );
}
