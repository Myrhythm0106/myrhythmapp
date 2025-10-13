import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Briefcase } from 'lucide-react';
import { usePersona, PersonaMode } from '@/hooks/usePersona';
import { toast } from 'sonner';

export function PersonaSwitcher() {
  const { personaMode, updatePersonaMode, isLoading } = usePersona();

  const handleSwitch = async (mode: PersonaMode) => {
    await updatePersonaMode(mode);
    toast.success(`Switched to ${mode === 'recovery' ? 'Recovery' : 'Executive'} Mode`);
  };

  if (isLoading) return null;

  return (
    <Card className="border-2 border-primary/20">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-sm font-medium mb-1">Experience Mode</h3>
            <p className="text-xs text-muted-foreground">
              {personaMode === 'recovery' 
                ? 'Therapeutic language focused on care and wellness' 
                : 'Professional language focused on accountability'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={personaMode === 'recovery' ? 'default' : 'outline'}
              onClick={() => handleSwitch('recovery')}
              className="gap-2"
            >
              <Heart className="h-4 w-4" />
              Recovery
            </Button>
            <Button
              size="sm"
              variant={personaMode === 'executive' ? 'default' : 'outline'}
              onClick={() => handleSwitch('executive')}
              className="gap-2"
            >
              <Briefcase className="h-4 w-4" />
              Executive
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
