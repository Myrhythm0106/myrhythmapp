import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Sparkles, Crown, Mountain, Target } from 'lucide-react';
import { useThemeHierarchy } from '@/hooks/useThemeHierarchy';

interface YearlyThemeCustomizerProps {
  currentYear?: number;
}

const suggestedYearlyThemes = [
  "Abundance", "Growth", "Transformation", "Resilience", "Discovery",
  "Breakthrough", "Healing", "Mastery", "Freedom", "Connection",
  "Purpose", "Excellence", "Innovation", "Courage", "Wisdom"
];

export function YearlyThemeCustomizer({ currentYear = new Date().getFullYear() }: YearlyThemeCustomizerProps) {
  const { themes, updateYearlyTheme, isLoading } = useThemeHierarchy();
  const [customTheme, setCustomTheme] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSaveTheme = async (theme: string) => {
    if (!theme.trim()) return;
    
    const success = await updateYearlyTheme(theme.trim());
    if (success) {
      setIsOpen(false);
      setCustomTheme('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 px-2 text-brand-teal-600 hover:text-brand-teal-700 hover:bg-brand-teal-100"
        >
          <Crown className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-primary" />
            Set Your {currentYear} Theme
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2 text-muted-foreground">Current Year Theme</h4>
            <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="font-medium">{currentYear}: Year of {themes.yearlyTheme}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2 text-muted-foreground">Create Custom Theme</h4>
            <div className="flex gap-2">
              <Input
                placeholder="Enter your yearly theme..."
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
              {suggestedYearlyThemes.map((theme) => (
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
                <Mountain className="h-4 w-4 text-brain-health-600 mt-0.5" />
                <div>
                  <p className="text-xs text-brain-health-700 font-medium">
                    Your Year Compass
                  </p>
                  <p className="text-xs text-brain-health-600">
                    This theme will guide your monthly focuses and daily choices throughout {currentYear}
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