import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Compass, Target } from 'lucide-react';
import { usePersona, PersonaMode } from '@/hooks/usePersona';
import { toast } from 'sonner';

export function PersonaSwitcher() {
  const { personaMode, updatePersonaMode, isLoading } = usePersona();

  const handleSwitch = async (mode: PersonaMode) => {
    await updatePersonaMode(mode);
    toast.success(`Switched to ${mode === 'recovery' ? 'Pathfinder' : 'Operator'} Mode`);
  };

  if (isLoading) return null;

  const isPathfinder = personaMode === 'recovery';

  return (
    <Card className="border-2 border-primary/20">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-sm font-medium mb-1">
              {isPathfinder ? 'Pathfinder Mode' : 'Operator Mode'}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isPathfinder
                ? 'Rebuilding cognitive ground — language tuned for steady progress and protected energy.'
                : 'High-output focus — language tuned for accountability, leverage, and signal over noise.'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={isPathfinder ? 'default' : 'outline'}
              onClick={() => handleSwitch('recovery')}
              className="gap-2"
            >
              <Compass className="h-4 w-4" />
              Pathfinder
            </Button>
            <Button
              size="sm"
              variant={!isPathfinder ? 'default' : 'outline'}
              onClick={() => handleSwitch('executive')}
              className="gap-2"
            >
              <Target className="h-4 w-4" />
              Operator
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
