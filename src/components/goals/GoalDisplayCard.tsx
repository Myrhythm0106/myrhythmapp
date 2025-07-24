import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Target, Calendar, CheckCircle2, Clock, Edit3, ArrowRight } from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  description?: string;
  target: string;
  why: string;
  timeframe?: string;
  progress: number;
  status: 'active' | 'completed' | 'paused';
  category: string;
  createdAt: string;
}

interface GoalDisplayCardProps {
  goal: Goal;
  onEdit?: (goal: Goal) => void;
  onViewActions?: (goal: Goal) => void;
  featured?: boolean;
}

export function GoalDisplayCard({ goal, onEdit, onViewActions, featured = false }: GoalDisplayCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'paused': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4" />;
      case 'paused': return <Clock className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  return (
    <Card className={`transition-all duration-200 hover:shadow-lg ${
      featured 
        ? 'border-2 border-memory-emerald-300 bg-gradient-to-br from-memory-emerald-50/50 to-clarity-teal-50/50' 
        : 'hover:border-memory-emerald-200'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className={`p-2 rounded-lg ${
              featured 
                ? 'bg-memory-emerald-100 text-memory-emerald-700' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {getStatusIcon(goal.status)}
            </div>
            <div className="min-w-0 flex-1">
              {featured && (
                <Badge className="bg-memory-emerald-100 text-memory-emerald-700 text-xs mb-1">
                  Current Focus
                </Badge>
              )}
              <CardTitle className={`${featured ? 'text-lg' : 'text-base'} leading-tight`}>
                {goal.title}
              </CardTitle>
            </div>
          </div>
          <Badge className={`${getStatusColor(goal.status)} text-xs px-2 py-1`}>
            {goal.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Goal Description */}
        {goal.description && (
          <p className="text-sm text-gray-600 leading-relaxed">{goal.description}</p>
        )}

        {/* What Success Looks Like */}
        <div className="bg-clarity-teal-50 border border-clarity-teal-100 rounded-lg p-3">
          <h4 className="text-sm font-semibold text-clarity-teal-800 mb-1 flex items-center gap-2">
            <Target className="h-4 w-4" />
            Success Measurement
          </h4>
          <p className="text-sm text-clarity-teal-700">{goal.target}</p>
        </div>

        {/* Why This Matters */}
        {goal.why && (
          <div className="bg-purple-50 border border-purple-100 rounded-lg p-3">
            <h4 className="text-sm font-semibold text-purple-800 mb-1">Why This Matters</h4>
            <p className="text-sm text-purple-700 italic">{goal.why}</p>
          </div>
        )}

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-bold text-memory-emerald-600">{goal.progress}%</span>
          </div>
          <Progress value={goal.progress} className="h-2" />
        </div>

        {/* Timeline */}
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Created {formatDate(goal.createdAt)}
          </div>
          {goal.timeframe && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Target: {goal.timeframe}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(goal)}
              className="flex-1"
            >
              <Edit3 className="h-3 w-3 mr-1" />
              Edit
            </Button>
          )}
          {onViewActions && (
            <Button
              variant={featured ? "default" : "outline"}
              size="sm"
              onClick={() => onViewActions(goal)}
              className={`flex-1 ${featured ? 'bg-memory-emerald-600 hover:bg-memory-emerald-700' : ''}`}
            >
              <ArrowRight className="h-3 w-3 mr-1" />
              View Actions
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}