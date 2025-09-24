import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings, Sparkles, Heart, Target, Brain, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface MonthlyThemeCustomizerProps {
  currentTheme: string;
  onThemeUpdate: (theme: string) => void;
}

const suggestedThemes = [
  "New Beginnings", "Heart & Connection", "Growth & Renewal", 
  "Clarity & Focus", "Strength & Resilience", "Balance & Harmony",
  "Freedom & Expression", "Reflection & Wisdom", "Preparation & Planning",
  "Gratitude & Abundance", "Community & Support", "Reflection & Renewal",
  "Breakthrough & Progress", "Healing & Recovery", "Joy & Celebration",
  "Mindfulness & Presence", "Courage & Adventure", "Purpose & Meaning"
];

export function MonthlyThemeCustomizer({ currentTheme, onThemeUpdate }: MonthlyThemeCustomizerProps) {
  const { user } = useAuth();
  const [customTheme, setCustomTheme] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveTheme = async (theme: string) => {
    if (!user || !theme.trim()) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('notes')
        .insert({
          user_id: user.id,
          title: 'Monthly Theme Setting',
          content: JSON.stringify({
            theme: theme.trim(),
            month: new Date().getMonth(),
            year: new Date().getFullYear(),
            setAt: new Date().toISOString()
          })
        });

      if (error) throw error;
      
      onThemeUpdate(theme.trim());
      setIsOpen(false);
      setCustomTheme('');
      
      toast.success("Monthly theme updated! 🌟", {
        description: `Your focus is now on: ${theme.trim()}`
      });
    } catch (error) {
      console.error('Error saving theme:', error);
      toast.error('Failed to save theme');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-6 w-6 p-0 text-sunrise-amber-600 hover:text-sunrise-amber-700 hover:bg-sunrise-amber-100"
        >
          <Settings className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Customize Your Monthly Focus
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2 text-muted-foreground">Current Theme</h4>
            <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-primary" />
                  <span className="font-medium">{currentTheme}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2 text-muted-foreground">Create Custom Theme</h4>
            <div className="flex gap-2">
              <Input
                placeholder="Enter your monthly focus..."
                value={customTheme}
                onChange={(e) => setCustomTheme(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && customTheme.trim()) {
                    handleSaveTheme(customTheme);
                  }
                }}
              />
              <Button 
                onClick={() => handleSaveTheme(customTheme)}
                disabled={!customTheme.trim() || isLoading}
                size="sm"
              >
                Set
              </Button>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2 text-muted-foreground">Suggested Themes</h4>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {suggestedThemes.map((theme) => (
                <Badge
                  key={theme}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary/10 justify-start text-xs p-2 h-auto"
                  onClick={() => handleSaveTheme(theme)}
                >
                  {theme}
                </Badge>
              ))}
            </div>
          </div>

          <Card className="bg-gradient-to-r from-brain-health-50 to-clarity-teal-50 border-brain-health-200">
            <CardContent className="p-3">
              <div className="flex items-start gap-2">
                <Brain className="h-4 w-4 text-brain-health-600 mt-0.5" />
                <div>
                  <p className="text-xs text-brain-health-700 font-medium">
                    Pro Tip for Recovery
                  </p>
                  <p className="text-xs text-brain-health-600">
                    Choose themes that align with your healing journey and make daily #IChoose statements more meaningful
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}