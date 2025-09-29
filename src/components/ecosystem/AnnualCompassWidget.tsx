import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { 
  Target, 
  Edit3, 
  Save, 
  Calendar,
  TrendingUp,
  Sparkles,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface AnnualPriorities {
  p1: string;
  p2: string;
  p3: string;
}

interface AnnualCompassWidgetProps {
  className?: string;
  expanded?: boolean;
}

export function AnnualCompassWidget({ className = "", expanded = false }: AnnualCompassWidgetProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [priorities, setPriorities] = useState<AnnualPriorities>({ p1: '', p2: '', p3: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadPriorities();
    }
  }, [user]);

  const loadPriorities = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      // Use raw query to avoid TypeScript errors
      const { data, error } = await supabase
        .from('annual_priorities')
        .select('priority_1, priority_2, priority_3')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading priorities:', error);
        toast.error('Failed to load annual priorities');
        return;
      }

      if (data) {
        setPriorities({
          p1: (data as any).priority_1 || '',
          p2: (data as any).priority_2 || '',
          p3: (data as any).priority_3 || ''
        });
      }
    } catch (error) {
      console.error('Error in loadPriorities:', error);
      toast.error('Failed to load annual priorities');
    } finally {
      setIsLoading(false);
    }
  };

  const savePriorities = async () => {
    if (!user) return;

    try {
      setIsSaving(true);
      // Use raw query to avoid TypeScript errors
      const { error } = await supabase
        .from('annual_priorities')
        .upsert({
          user_id: user.id,
          priority_1: priorities.p1,
          priority_2: priorities.p2,
          priority_3: priorities.p3,
          updated_at: new Date().toISOString()
        } as any);

      if (error) {
        console.error('Error saving priorities:', error);
        toast.error('Failed to save priorities');
        return;
      }

      toast.success('Annual priorities saved!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error in savePriorities:', error);
      toast.error('Failed to save priorities');
    } finally {
      setIsSaving(false);
    }
  };

  const updatePriority = (field: keyof AnnualPriorities, value: string) => {
    setPriorities(prev => ({ ...prev, [field]: value }));
  };

  const hasAnyPriorities = priorities.p1 || priorities.p2 || priorities.p3;
  const allPrioritiesSet = priorities.p1 && priorities.p2 && priorities.p3;

  const getPriorityStatus = () => {
    if (allPrioritiesSet) return { label: 'Complete', color: 'bg-green-100 text-green-700', icon: CheckCircle };
    if (hasAnyPriorities) return { label: 'In Progress', color: 'bg-blue-100 text-blue-700', icon: TrendingUp };
    return { label: 'Not Set', color: 'bg-gray-100 text-gray-700', icon: Target };
  };

  const status = getPriorityStatus();

  if (isLoading) {
    return (
      <Card className={`${className}`}>
        <CardContent className="p-4 text-center">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Compact view for dashboard
  if (!expanded) {
    return (
      <Card className={`cursor-pointer hover:shadow-md transition-shadow ${className}`} onClick={() => navigate('/calendar?view=year')}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-sm">Annual Compass</h3>
            </div>
            <Badge className={`text-xs ${status.color}`}>
              <status.icon className="w-3 h-3 mr-1" />
              {status.label}
            </Badge>
          </div>

          {hasAnyPriorities ? (
            <div className="space-y-2">
              {priorities.p1 && (
                <div className="text-sm">
                  <span className="text-red-600 font-medium">P1:</span>
                  <span className="ml-2 text-gray-700">{priorities.p1.substring(0, 30)}{priorities.p1.length > 30 ? '...' : ''}</span>
                </div>
              )}
              {priorities.p2 && (
                <div className="text-sm">
                  <span className="text-orange-600 font-medium">P2:</span>
                  <span className="ml-2 text-gray-700">{priorities.p2.substring(0, 30)}{priorities.p2.length > 30 ? '...' : ''}</span>
                </div>
              )}
              {priorities.p3 && (
                <div className="text-sm">
                  <span className="text-blue-600 font-medium">P3:</span>
                  <span className="ml-2 text-gray-700">{priorities.p3.substring(0, 30)}{priorities.p3.length > 30 ? '...' : ''}</span>
                </div>
              )}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-gray-500">Click to edit in Calendar</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          ) : (
            <div className="text-center py-2">
              <p className="text-sm text-gray-600 mb-2">Set your yearly priorities</p>
              <Button size="sm" onClick={(e) => { e.stopPropagation(); navigate('/calendar?view=year'); }}>
                <Sparkles className="w-4 h-4 mr-1" />
                Set Priorities
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Expanded view for full editing
  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 w-5 text-blue-600" />
            Annual Compass
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`${status.color}`}>
              <status.icon className="w-3 h-3 mr-1" />
              {status.label}
            </Badge>
            {!isEditing ? (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit3 className="w-4 h-4 mr-1" />
                Edit
              </Button>
            ) : (
              <Button 
                size="sm" 
                onClick={savePriorities}
                disabled={isSaving}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Save className="w-4 h-4 mr-1" />
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600 text-sm">
          Define your three most important goals for this year. These will guide your daily decisions and actions.
        </p>

        <div className="space-y-4">
          {/* P1 Priority */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <span className="w-6 h-6 rounded bg-red-100 text-red-700 text-xs font-bold flex items-center justify-center">P1</span>
              Most Important Goal
            </label>
            {isEditing ? (
              <Input
                value={priorities.p1}
                onChange={(e) => updatePriority('p1', e.target.value)}
                placeholder="Your most critical yearly goal..."
                className="border-red-200 focus:border-red-500"
              />
            ) : (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800">{priorities.p1 || 'Not set yet'}</p>
              </div>
            )}
          </div>

          {/* P2 Priority */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <span className="w-6 h-6 rounded bg-orange-100 text-orange-700 text-xs font-bold flex items-center justify-center">P2</span>
              Important Goal
            </label>
            {isEditing ? (
              <Input
                value={priorities.p2}
                onChange={(e) => updatePriority('p2', e.target.value)}
                placeholder="Your second priority..."
                className="border-orange-200 focus:border-orange-500"
              />
            ) : (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-md">
                <p className="text-orange-800">{priorities.p2 || 'Not set yet'}</p>
              </div>
            )}
          </div>

          {/* P3 Priority */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <span className="w-6 h-6 rounded bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">P3</span>
              Nice to Have Goal
            </label>
            {isEditing ? (
              <Input
                value={priorities.p3}
                onChange={(e) => updatePriority('p3', e.target.value)}
                placeholder="Your third priority..."
                className="border-blue-200 focus:border-blue-500"
              />
            ) : (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-blue-800">{priorities.p3 || 'Not set yet'}</p>
              </div>
            )}
          </div>
        </div>

        {/* Progress Insight */}
        {hasAnyPriorities && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200"
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Progress Insight</span>
            </div>
            <p className="text-sm text-blue-700">
              {allPrioritiesSet 
                ? "Excellent! Your compass is set. All actions and decisions can now be filtered through these three priorities."
                : "You're making progress! Consider completing all three priorities for maximum clarity and focus."
              }
            </p>
          </motion.div>
        )}

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/calendar?view=year')}
          >
            <Calendar className="w-4 h-4 mr-1" />
            Year View
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/next-steps')}
          >
            <Target className="w-4 h-4 mr-1" />
            Align Actions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}