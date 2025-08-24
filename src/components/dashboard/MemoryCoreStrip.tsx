import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  FileText, 
  TrendingUp, 
  Zap,
  Plus,
  Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MemoryFirstMotivation } from './MemoryFirstMotivation';
import { useQuickActionStats } from '@/hooks/useQuickActionStats';

interface InteractionModeToggleProps {
  mode: 'guided' | 'discovery';
  onModeChange: (mode: 'guided' | 'discovery') => void;
}

function InteractionModeToggle({ mode, onModeChange }: InteractionModeToggleProps) {
  return (
    <div className="flex items-center gap-2 p-1 bg-white/80 backdrop-blur-sm rounded-lg border border-white/40">
      <Button
        variant={mode === 'guided' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onModeChange('guided')}
        className="text-xs px-3 py-1.5 h-auto"
      >
        Guided
      </Button>
      <Button
        variant={mode === 'discovery' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onModeChange('discovery')}
        className="text-xs px-3 py-1.5 h-auto"
      >
        Discovery
      </Button>
    </div>
  );
}

interface MemoryCoreStripProps {
  interactionMode: 'guided' | 'discovery';
  onInteractionModeChange: (mode: 'guided' | 'discovery') => void;
}

export function MemoryCoreStrip({ interactionMode, onInteractionModeChange }: MemoryCoreStripProps) {
  const navigate = useNavigate();
  const stats = useQuickActionStats();

  const memoryActions = [
    {
      id: 'capture',
      title: 'Quick Capture',
      icon: FileText,
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-100',
      badge: stats.capture.badge,
      hasNew: stats.capture.count > 0,
      action: () => navigate('/memory-bridge')
    },
    {
      id: 'memory-bank',
      title: 'Memory Bank',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-100',
      badge: stats.memoryBank.badge,
      hasNew: stats.memoryBank.count > 0,
      action: () => navigate('/memory-bank')
    },
    {
      id: 'quick-add',
      title: 'Quick Add',
      icon: Plus,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-100',
      badge: 'Fast',
      hasNew: false,
      action: () => navigate('/calendar')
    }
  ];

  return (
    <div className="space-y-4">
      {/* Header with Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-memory-emerald-500" />
            <h2 className="text-xl font-bold bg-gradient-to-r from-memory-emerald-600 to-clarity-teal-600 bg-clip-text text-transparent">
              Memory Core
            </h2>
          </div>
          <Badge variant="secondary" className="text-xs bg-memory-emerald-100 text-memory-emerald-700 border-memory-emerald-200">
            Memory First
          </Badge>
        </div>
        
        <InteractionModeToggle 
          mode={interactionMode} 
          onModeChange={onInteractionModeChange} 
        />
      </div>

      {/* Memory Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Memory First Motivation */}
        <div className="md:col-span-1">
          <MemoryFirstMotivation streak={7} todayScore={8} />
        </div>

        {/* Quick Memory Actions */}
        <div className="md:col-span-2">
          <div className="grid grid-cols-3 gap-3 h-full">
            {memoryActions.map((action) => {
              const IconComponent = action.icon;
              return (
                <Card
                  key={action.id}
                  className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 bg-gradient-to-br from-white to-gray-50 hover:shadow-xl"
                  onClick={action.action}
                >
                  <CardContent className="p-4 text-center space-y-2 relative">
                    <div className="relative">
                      <div className={`w-10 h-10 ${action.bgColor} rounded-lg flex items-center justify-center mx-auto`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      {action.hasNew && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-gray-800">{action.title}</h3>
                      <Badge 
                        variant="secondary" 
                        className="text-xs px-2 py-0.5 bg-white/90 text-gray-600 border mt-1"
                      >
                        {action.badge}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}