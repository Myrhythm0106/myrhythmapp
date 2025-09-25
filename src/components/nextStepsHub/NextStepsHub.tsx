import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Target, 
  Zap, 
  Star, 
  Heart,
  Filter,
  CalendarDays,
  Brain,
  TrendingUp,
  Sparkles,
  Users
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { fetchExtractedActions } from '@/utils/memoryBridgeApi';
import { NextStepsItem } from '@/types/memoryBridge';
import { toast } from 'sonner';
import { SmartPrioritizer } from './SmartPrioritizer';
import { EnergyMatcher } from './EnergyMatcher';
import { ActionCards } from './ActionCards';
import { MotivationalHeader } from './MotivationalHeader';
import { ProgressInsights } from './ProgressInsights';
import { SupportCircleWidget } from './SupportCircleWidget';
import { SmartScheduler } from './SmartScheduler';

export function NextStepsHub() {
  const { user } = useAuth();
  const [actions, setActions] = useState<NextStepsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAction, setSelectedAction] = useState<NextStepsItem | null>(null);
  const [viewMode, setViewMode] = useState<'smart' | 'energy' | 'support' | 'insights'>('smart');
  const [currentEnergyLevel, setCurrentEnergyLevel] = useState<'high' | 'medium' | 'low'>('medium');
  const [filters, setFilters] = useState({
    urgency: 'all',
    energy: 'all',
    timeAvailable: 'all'
  });

  useEffect(() => {
    if (user) {
      loadActions();
    }
  }, [user]);

  const loadActions = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const actionsData = await fetchExtractedActions(user.id);
      setActions(actionsData);
    } catch (error) {
      console.error('Error loading actions:', error);
      toast.error('Failed to load your next steps');
    } finally {
      setLoading(false);
    }
  };

  const getRecommendedAction = () => {
    const activeActions = actions.filter(a => !['done', 'completed', 'confirmed'].includes(a.status));
    if (activeActions.length === 0) return null;

    // Smart recommendation based on energy, time, and priority
    return activeActions.reduce((best, current) => {
      const currentScore = calculateActionScore(current);
      const bestScore = calculateActionScore(best);
      return currentScore > bestScore ? current : best;
    });
  };

  const calculateActionScore = (action: NextStepsItem) => {
    let score = 0;
    
    // Priority score based on existing fields
    if (action.due_context?.includes('urgent') || action.due_context?.includes('asap')) score += 3;
    else if (action.due_context?.includes('today') || action.due_context?.includes('soon')) score += 2;
    else score += 1;

    // Urgency score based on due date
    if (action.due_context?.includes('today')) score += 5;
    else if (action.due_context?.includes('tomorrow')) score += 3;
    else if (action.due_context?.includes('week')) score += 2;

    // Confidence score
    if (action.confidence_score) score += action.confidence_score * 2;

    return score;
  };

  if (loading) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary animate-pulse" />
            Loading Your Next Steps Hub...
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Organizing your empowering journey...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const recommendedAction = getRecommendedAction();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Motivational Header with Word of the Month */}
      <MotivationalHeader actions={actions} recommendedAction={recommendedAction} />

      {/* Main Hub Interface */}
      <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="grid w-fit grid-cols-4">
            <TabsTrigger value="smart" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Smart View
            </TabsTrigger>
            <TabsTrigger value="energy" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Energy Match
            </TabsTrigger>
            <TabsTrigger value="support" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Support Circle
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Insights
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <CalendarDays className="h-4 w-4 mr-2" />
              Schedule All
            </Button>
          </div>
        </div>

        <TabsContent value="smart" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SmartPrioritizer 
                actions={actions}
                onActionUpdate={loadActions}
                currentEnergyLevel={currentEnergyLevel}
              />
            </div>
            <div className="space-y-4">
              <SmartScheduler actions={actions} />
              <SupportCircleWidget actions={actions} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="energy" className="space-y-6">
          <EnergyMatcher 
            actions={actions}
            currentEnergyLevel={currentEnergyLevel}
            onEnergyLevelChange={setCurrentEnergyLevel}
            onActionUpdate={loadActions}
          />
        </TabsContent>

        <TabsContent value="support" className="space-y-6">
          <SupportCircleWidget 
            actions={actions} 
            expanded={true}
            onActionUpdate={loadActions}
          />
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <ProgressInsights actions={actions} />
        </TabsContent>
      </Tabs>

      {/* Quick Action Cards */}
      <ActionCards 
        actions={actions}
        recommendedAction={recommendedAction}
        onActionUpdate={loadActions}
      />
    </div>
  );
}