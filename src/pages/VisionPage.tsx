import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sparkles, Target, Calendar, Edit2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function VisionPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const currentWeek = Math.ceil((new Date().getTime() - new Date(currentYear, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));

  const [yearlyDialogOpen, setYearlyDialogOpen] = useState(false);
  const [yearlyTheme, setYearlyTheme] = useState('');
  const [visionStatement, setVisionStatement] = useState('');

  // Fetch yearly vision
  const { data: annualPriority } = useQuery({
    queryKey: ['annual-priority', currentYear],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('annual_priorities')
        .select('*')
        .eq('user_id', user.id)
        .eq('year', currentYear)
        .maybeSingle();

      if (error) throw error;
      return data;
    }
  });

  // Fetch monthly themes
  const { data: monthlyThemes = [] } = useQuery({
    queryKey: ['monthly-themes', currentYear],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('monthly_themes')
        .select('*')
        .eq('user_id', user.id)
        .eq('year', currentYear)
        .order('month', { ascending: true });

      if (error) throw error;
      return data;
    }
  });

  // Fetch weekly affirmation
  const { data: weeklyAffirmation } = useQuery({
    queryKey: ['weekly-affirmation', currentYear, currentWeek],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('weekly_affirmations')
        .select('*')
        .eq('user_id', user.id)
        .eq('year', currentYear)
        .eq('week_number', currentWeek)
        .maybeSingle();

      if (error) throw error;
      return data;
    }
  });

  const saveYearlyVisionMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('annual_priorities')
        .upsert({
          user_id: user.id,
          year: currentYear,
          yearly_theme: yearlyTheme,
          vision_statement: visionStatement
        }, {
          onConflict: 'user_id,year'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['annual-priority'] });
      setYearlyDialogOpen(false);
      toast({ title: 'Yearly Vision Saved', description: 'Your vision for the year has been updated' });
    }
  });

  const generateAffirmationMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('generate-weekly-affirmation', {
        body: { year: currentYear, weekNumber: currentWeek }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weekly-affirmation'] });
      toast({ title: 'Affirmation Generated', description: 'Your weekly affirmation is ready' });
    }
  });

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Vision Framework</h1>
        <p className="text-muted-foreground">Define your yearly vision, monthly themes, and weekly affirmations</p>
      </div>

      {/* Yearly Vision Section */}
      <Card className="p-6 mb-8 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Target className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-2xl font-bold">{currentYear} Vision</h2>
              <p className="text-sm text-muted-foreground">Your north star for the year</p>
            </div>
          </div>
          <Dialog open={yearlyDialogOpen} onOpenChange={setYearlyDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setYearlyTheme(annualPriority?.yearly_theme || '');
                  setVisionStatement(annualPriority?.vision_statement || '');
                }}
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Yearly Vision</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Yearly Theme</label>
                  <Input
                    value={yearlyTheme}
                    onChange={(e) => setYearlyTheme(e.target.value)}
                    placeholder="e.g., Growth & Resilience"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Vision Statement</label>
                  <Textarea
                    value={visionStatement}
                    onChange={(e) => setVisionStatement(e.target.value)}
                    placeholder="Describe your vision for the year..."
                    rows={4}
                  />
                </div>
                <Button
                  onClick={() => saveYearlyVisionMutation.mutate()}
                  disabled={saveYearlyVisionMutation.isPending}
                  className="w-full"
                >
                  Save Vision
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {annualPriority ? (
          <div className="space-y-3">
            <div className="text-2xl font-semibold text-primary">
              {annualPriority.yearly_theme}
            </div>
            {annualPriority.vision_statement && (
              <p className="text-lg text-muted-foreground">
                {annualPriority.vision_statement}
              </p>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">Define your vision for {currentYear}</p>
            <Button onClick={() => setYearlyDialogOpen(true)}>
              <Sparkles className="h-4 w-4 mr-2" />
              Create Yearly Vision
            </Button>
          </div>
        )}
      </Card>

      {/* Monthly Themes Grid */}
      <Card className="p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">Monthly Themes</h2>
            <p className="text-sm text-muted-foreground">Focus areas for each month</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {monthNames.map((monthName, idx) => {
            const monthNum = idx + 1;
            const theme = monthlyThemes.find(t => t.month === monthNum);
            const isCurrent = monthNum === currentMonth;

            return (
              <div
                key={monthNum}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isCurrent
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="text-sm font-semibold mb-1">{monthName}</div>
                <div className="text-xs text-muted-foreground">
                  {theme?.theme || 'Not set'}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Weekly Affirmation */}
      <Card className="p-6 bg-gradient-to-br from-secondary/5 to-accent/5">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="h-6 w-6 text-secondary" />
          <div>
            <h2 className="text-2xl font-bold">This Week's Affirmation</h2>
            <p className="text-sm text-muted-foreground">Week {currentWeek} of {currentYear}</p>
          </div>
        </div>

        {weeklyAffirmation ? (
          <div className="text-center py-8">
            <p className="text-3xl font-bold text-secondary mb-4">
              "{weeklyAffirmation.affirmation}"
            </p>
            <Button
              variant="outline"
              onClick={() => generateAffirmationMutation.mutate()}
              disabled={generateAffirmationMutation.isPending}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generate New Affirmation
            </Button>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No affirmation for this week yet</p>
            <Button
              onClick={() => generateAffirmationMutation.mutate()}
              disabled={generateAffirmationMutation.isPending}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Affirmation
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
