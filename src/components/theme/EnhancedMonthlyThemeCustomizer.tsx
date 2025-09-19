import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings, Sparkles, Heart, Target, Calendar } from 'lucide-react';
import { useThemeHierarchy } from '@/hooks/useThemeHierarchy';

interface EnhancedMonthlyThemeCustomizerProps {
  currentMonth?: number;
  currentYear?: number;
}

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const suggestedThemes = [
  "New Beginnings", "Persistence", "Growth & Renewal", 
  "Clarity & Focus", "Strength & Resilience", "Balance & Harmony",
  "Freedom & Expression", "Reflection & Wisdom", "Preparation & Planning",
  "Gratitude & Abundance", "Community & Support", "Reflection & Renewal",
  "Breakthrough & Progress", "Healing & Recovery", "Joy & Celebration",
  "Mindfulness & Presence", "Courage & Adventure", "Purpose & Meaning"
];

export function EnhancedMonthlyThemeCustomizer({ 
  currentMonth = new Date().getMonth(),
  currentYear = new Date().getFullYear()
}: EnhancedMonthlyThemeCustomizerProps) {
  const { themes, updateMonthlyTheme, getThemeHierarchy, isLoading } = useThemeHierarchy();
  const [customTheme, setCustomTheme] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const currentTheme = themes.monthlyThemes[currentMonth.toString()] || "Focus";
  const hierarchy = getThemeHierarchy();

  const handleSaveTheme = async (theme: string) => {
    if (!theme.trim()) return;
    
    const success = await updateMonthlyTheme(currentMonth, theme.trim());
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
          className="h-6 w-6 p-0 text-brand-orange-600 hover:text-brand-orange-700 hover:bg-brand-orange-100"
        >
          <Settings className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            {monthNames[currentMonth]} {currentYear} Theme
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Show Year Context */}
          <div className="bg-gradient-to-r from-brain-health-50 to-clarity-teal-50 p-3 rounded-lg border border-brain-health-200">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-brain-health-600" />
              <span className="text-sm font-medium text-brain-health-700">Year Context</span>
            </div>
            <p className="text-xs text-brain-health-600">
              {hierarchy.yearly} → <span className="font-medium">{monthNames[currentMonth]} Theme</span>
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2 text-muted-foreground">Current {monthNames[currentMonth]} Theme</h4>
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
                placeholder="Enter monthly focus..."
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
                <Target className="h-4 w-4 text-brain-health-600 mt-0.5" />
                <div>
                  <p className="text-xs text-brain-health-700 font-medium">
                    Monthly Focus Guide
                  </p>
                  <p className="text-xs text-brain-health-600">
                    This theme supports your yearly journey and guides your daily "I Choose" statements
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