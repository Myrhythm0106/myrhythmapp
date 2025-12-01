import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarPlus, Mic, Target, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CalendarEmptyStateProps {
  onAddEvent: () => void;
}

export function CalendarEmptyState({ onAddEvent }: CalendarEmptyStateProps) {
  const navigate = useNavigate();

  return (
    <Card className="p-8 text-center bg-gradient-to-br from-brain-health-50/50 to-clarity-teal-50/50 border-brain-health-200/50">
      <div className="max-w-md mx-auto space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-brain-health-500 to-clarity-teal-500 flex items-center justify-center">
          <CalendarPlus className="h-8 w-8 text-white" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-brain-health-900">
            Your Calendar Awaits
          </h3>
          <p className="text-brain-health-700">
            Start building your rhythm by adding events or recording conversations that create commitments.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={onAddEvent}
            className="bg-gradient-to-r from-brain-health-500 to-clarity-teal-500 hover:from-brain-health-600 hover:to-clarity-teal-600 text-white"
          >
            <CalendarPlus className="h-4 w-4 mr-2" />
            Add Your First Event
          </Button>
          
          <Button
            variant="outline"
            onClick={() => navigate('/memory-bridge')}
            className="border-memory-emerald-300 text-memory-emerald-700 hover:bg-memory-emerald-50"
          >
            <Mic className="h-4 w-4 mr-2" />
            Record a Conversation
          </Button>
        </div>

        <div className="pt-4 border-t border-brain-health-200/50">
          <p className="text-sm text-brain-health-600 mb-3">
            Pro tip: Set your yearly priorities to cascade goals through your schedule
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              // Switch to year tab
              const yearTab = document.querySelector('[value="year"]') as HTMLElement;
              yearTab?.click();
            }}
            className="text-brain-health-600 hover:text-brain-health-800"
          >
            <Target className="h-4 w-4 mr-2" />
            Set 2025 Priorities
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
