import React from 'react';
import { cn } from '@/lib/utils';
import { Target, Users, Brain, Clock, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface CalendarIntegrationProps {
  date: Date;
  onViewActions?: () => void;
  onViewGoals?: () => void;
  onViewSupport?: () => void;
  onViewMemories?: () => void;
}

interface IntegrationItem {
  id: string;
  type: 'action' | 'goal' | 'support' | 'memory';
  title: string;
  status?: 'completed' | 'pending' | 'upcoming';
  priority?: 'high' | 'medium' | 'low';
  time?: string;
}

// Mock data - replace with real data from contexts
const getMockIntegrationData = (date: Date): IntegrationItem[] => [
  {
    id: '1',
    type: 'action',
    title: 'Morning meditation',
    status: 'completed',
    time: '08:00',
  },
  {
    id: '2',
    type: 'goal',
    title: 'Weekly focus on brain health',
    status: 'pending',
    priority: 'high',
  },
  {
    id: '3',
    type: 'support',
    title: 'Check-in with accountability partner',
    status: 'upcoming',
    time: '15:00',
  },
  {
    id: '4',
    type: 'memory',
    title: 'Journal reflection',
    status: 'pending',
    time: '20:00',
  },
];

export function CalendarIntegration({ 
  date, 
  onViewActions, 
  onViewGoals, 
  onViewSupport, 
  onViewMemories 
}: CalendarIntegrationProps) {
  const integrationData = getMockIntegrationData(date);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'action': return <Target className="h-3 w-3" />;
      case 'goal': return <Star className="h-3 w-3" />;
      case 'support': return <Users className="h-3 w-3" />;
      case 'memory': return <Brain className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'action': return 'bg-brain-health-100 text-brain-health-700 border-brain-health-200';
      case 'goal': return 'bg-sunrise-amber-100 text-sunrise-amber-700 border-sunrise-amber-200';
      case 'support': return 'bg-clarity-teal-100 text-clarity-teal-700 border-clarity-teal-200';
      case 'memory': return 'bg-memory-emerald-100 text-memory-emerald-700 border-memory-emerald-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed': return 'border-l-memory-emerald-400 bg-memory-emerald-50/50';
      case 'pending': return 'border-l-brain-health-400 bg-brain-health-50/50';
      case 'upcoming': return 'border-l-sunrise-amber-400 bg-sunrise-amber-50/50';
      default: return 'border-l-gray-400 bg-gray-50/50';
    }
  };

  const handleViewAll = (type: string) => {
    switch (type) {
      case 'action': onViewActions?.(); break;
      case 'goal': onViewGoals?.(); break;
      case 'support': onViewSupport?.(); break;
      case 'memory': onViewMemories?.(); break;
    }
  };

  if (integrationData.length === 0) {
    return (
      <div className="text-center py-6 space-y-2">
        <div className="text-2xl">📅</div>
        <p className="text-xs text-muted-foreground">
          Your integrated day view will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold therapeutic-accent">Integrated Day View</h4>
        <div className="text-xs text-muted-foreground">
          {integrationData.length} connected items
        </div>
      </div>

      {/* Integration Items */}
      <div className="space-y-2">
        {integrationData.map((item) => (
          <div
            key={item.id}
            className={cn(
              "p-3 rounded-lg border-l-2 transition-all neural-pathway-effect cursor-pointer hover:shadow-sm",
              getStatusColor(item.status)
            )}
            onClick={() => handleViewAll(item.type)}
          >
            <div className="flex items-start justify-between mb-1">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Badge
                  variant="secondary"
                  className={cn("text-xs border", getTypeColor(item.type))}
                >
                  {getTypeIcon(item.type)}
                  <span className="ml-1 capitalize">{item.type}</span>
                </Badge>
                
                {item.time && (
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {item.time}
                  </div>
                )}
              </div>
              
              {item.priority === 'high' && (
                <Star className="h-3 w-3 text-sunrise-amber-500 animate-pulse shrink-0" />
              )}
            </div>
            
            <p className="text-sm font-medium text-foreground mb-1 truncate">
              {item.title}
            </p>
            
            <div className="flex items-center justify-between">
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full border",
                item.status === 'completed' ? 'bg-memory-emerald-100 text-memory-emerald-700 border-memory-emerald-200'
                : item.status === 'pending' ? 'bg-brain-health-100 text-brain-health-700 border-brain-health-200'
                : 'bg-sunrise-amber-100 text-sunrise-amber-700 border-sunrise-amber-200'
              )}>
                {item.status || 'planned'}
              </span>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-6 px-2 hover:bg-brain-health-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewAll(item.type);
                }}
              >
                View
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2 pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onViewActions}
          className="text-xs neural-pathway-effect"
        >
          <Target className="h-3 w-3 mr-1" />
          All Actions
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onViewGoals}
          className="text-xs neural-pathway-effect"
        >
          <Star className="h-3 w-3 mr-1" />
          Goals
        </Button>
      </div>
    </div>
  );
}