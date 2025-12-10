import React, { useState, useEffect } from 'react';
import { Eye, Target, Star, CheckSquare, Sparkles, MessageSquare, Send, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ShareableViewProps {
  userId: string;
  viewType: 'full' | 'goals_only' | 'priorities_only';
  canComment: boolean;
  userName?: string;
}

interface VisionData {
  id: string;
  yearly_theme: string | null;
  vision_statement: string | null;
  year: number;
}

interface GoalData {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  status: string;
  progress_percentage: number;
}

interface PriorityData {
  id: string;
  scope: string;
  priority_number: number;
  title: string;
  status: string;
  goal_id: string | null;
}

const ShareableView: React.FC<ShareableViewProps> = ({
  userId,
  viewType,
  canComment,
  userName = 'User'
}) => {
  const [vision, setVision] = useState<VisionData | null>(null);
  const [goals, setGoals] = useState<GoalData[]>([]);
  const [priorities, setPriorities] = useState<PriorityData[]>([]);
  const [encouragement, setEncouragement] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetchSharedData();
  }, [userId]);

  const fetchSharedData = async () => {
    setIsLoading(true);
    try {
      const currentYear = new Date().getFullYear();

      // Fetch vision
      if (viewType === 'full') {
        const { data: visionData } = await supabase
          .from('annual_priorities')
          .select('*')
          .eq('user_id', userId)
          .eq('year', currentYear)
          .maybeSingle();
        
        if (visionData) setVision(visionData);
      }

      // Fetch goals
      if (viewType === 'full' || viewType === 'goals_only') {
        const { data: goalsData } = await supabase
          .from('goals')
          .select('*')
          .eq('user_id', userId)
          .eq('status', 'active')
          .order('created_at', { ascending: false });
        
        if (goalsData) setGoals(goalsData);
      }

      // Fetch priorities
      if (viewType === 'full' || viewType === 'priorities_only') {
        const { data: prioritiesData } = await supabase
          .from('priorities')
          .select('*')
          .eq('user_id', userId)
          .eq('is_shareable', true)
          .order('priority_number');
        
        if (prioritiesData) setPriorities(prioritiesData as PriorityData[]);
      }
    } catch (error) {
      console.error('Error fetching shared data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendEncouragement = async () => {
    if (!encouragement.trim()) return;
    
    setIsSending(true);
    try {
      // Send as a support circle message
      const { error } = await supabase
        .from('support_circle_messages')
        .insert({
          user_id: userId,
          recipient_user_id: userId,
          message_type: 'encouragement',
          message_text: encouragement
        });
      
      if (error) throw error;
      
      toast.success('Encouragement sent!');
      setEncouragement('');
    } catch (error) {
      console.error('Error sending encouragement:', error);
      toast.error('Failed to send encouragement');
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const overallProgress = goals.length > 0
    ? Math.round(goals.reduce((sum, g) => sum + (g.progress_percentage || 0), 0) / goals.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-primary/10 to-accent/20 border-none">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{userName}'s Journey</CardTitle>
              <CardDescription>
                {viewType === 'full' && 'Vision, Goals & Priorities'}
                {viewType === 'goals_only' && 'Goals & Progress'}
                {viewType === 'priorities_only' && 'Current Priorities'}
              </CardDescription>
            </div>
          </div>
          
          {goals.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-muted-foreground">{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </div>
          )}
        </CardHeader>
      </Card>

      <ScrollArea className="h-[calc(100vh-350px)]">
        <div className="space-y-6 pr-4">
          {/* Vision Section */}
          {viewType === 'full' && vision && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <CardTitle className="text-lg">Vision {vision.year}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {vision.yearly_theme && (
                  <p className="text-xl font-semibold text-primary mb-2">{vision.yearly_theme}</p>
                )}
                {vision.vision_statement && (
                  <p className="text-muted-foreground">{vision.vision_statement}</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Goals Section */}
          {(viewType === 'full' || viewType === 'goals_only') && goals.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Active Goals</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {goals.map(goal => (
                  <div key={goal.id} className="p-3 rounded-lg bg-accent/30">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{goal.title}</h4>
                        {goal.description && (
                          <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
                        )}
                      </div>
                      {goal.category && (
                        <Badge variant="outline">{goal.category}</Badge>
                      )}
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <Progress value={goal.progress_percentage || 0} className="flex-1 h-1.5" />
                      <span className="text-xs text-muted-foreground w-10">
                        {goal.progress_percentage || 0}%
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Priorities Section */}
          {(viewType === 'full' || viewType === 'priorities_only') && priorities.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-orange-500" />
                  <CardTitle className="text-lg">Current Priorities</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['daily', 'weekly', 'monthly'].map(scope => {
                    const scopePriorities = priorities.filter(p => p.scope === scope);
                    if (scopePriorities.length === 0) return null;
                    
                    return (
                      <div key={scope}>
                        <h5 className="text-sm font-medium text-muted-foreground capitalize mb-2">
                          {scope} Priorities
                        </h5>
                        <div className="space-y-2">
                          {scopePriorities.map(priority => (
                            <div 
                              key={priority.id}
                              className={cn(
                                "flex items-center gap-3 p-2 rounded-lg",
                                priority.status === 'completed' 
                                  ? "bg-green-500/10" 
                                  : "bg-accent/30"
                              )}
                            >
                              <span className="text-sm font-medium text-muted-foreground">
                                P{priority.priority_number}
                              </span>
                              <span className={cn(
                                priority.status === 'completed' && "line-through text-muted-foreground"
                              )}>
                                {priority.title}
                              </span>
                              {priority.status === 'completed' && (
                                <CheckSquare className="w-4 h-4 text-green-500 ml-auto" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty state */}
          {goals.length === 0 && priorities.length === 0 && !vision && (
            <Card className="text-center py-12">
              <CardContent>
                <Eye className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">
                  {userName} hasn't shared any items yet.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>

      {/* Encouragement Section */}
      {canComment && (
        <>
          <Separator />
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                <CardTitle className="text-lg">Send Encouragement</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Textarea
                  placeholder={`Write an encouraging message for ${userName}...`}
                  value={encouragement}
                  onChange={(e) => setEncouragement(e.target.value)}
                  className="min-h-[80px]"
                />
                <Button 
                  onClick={sendEncouragement}
                  disabled={!encouragement.trim() || isSending}
                  className="w-full"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Encouragement
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default ShareableView;
