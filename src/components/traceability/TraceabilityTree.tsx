import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Target, Star, CheckSquare, Eye, Link2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTraceability, TraceabilityNode, VisionItem, GoalItem, PriorityItem, TaskItem } from '@/contexts/TraceabilityContext';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface TraceabilityTreeProps {
  onNodeClick?: (node: TraceabilityNode) => void;
  showLinkButtons?: boolean;
  compact?: boolean;
}

const TraceabilityTree: React.FC<TraceabilityTreeProps> = ({ 
  onNodeClick,
  showLinkButtons = false,
  compact = false
}) => {
  const { traceabilityTree, goals, priorities, tasks, isLoading } = useTraceability();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-muted-foreground">Loading traceability...</div>
      </div>
    );
  }

  if (!traceabilityTree) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No vision set for this year.</p>
        <p className="text-sm mt-2">Start by setting your yearly vision and priorities.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <TreeNode 
        node={traceabilityTree} 
        level={0} 
        onNodeClick={onNodeClick}
        showLinkButtons={showLinkButtons}
        compact={compact}
      />
      
      {/* Unlinked items section */}
      <UnlinkedItems 
        goals={goals}
        priorities={priorities}
        tasks={tasks}
        onNodeClick={onNodeClick}
        compact={compact}
      />
    </div>
  );
};

interface TreeNodeProps {
  node: TraceabilityNode;
  level: number;
  onNodeClick?: (node: TraceabilityNode) => void;
  showLinkButtons?: boolean;
  compact?: boolean;
}

const TreeNode: React.FC<TreeNodeProps> = ({ 
  node, 
  level, 
  onNodeClick,
  showLinkButtons,
  compact 
}) => {
  const [isOpen, setIsOpen] = useState(level < 2);
  const hasChildren = node.children.length > 0;

  const getNodeIcon = () => {
    switch (node.type) {
      case 'vision': return <Sparkles className="w-4 h-4 text-amber-500" />;
      case 'goal': return <Target className="w-4 h-4 text-primary" />;
      case 'priority': return <Star className="w-4 h-4 text-orange-500" />;
      case 'task': return <CheckSquare className="w-4 h-4 text-green-500" />;
    }
  };

  const getNodeTitle = () => {
    switch (node.type) {
      case 'vision': 
        return (node.item as VisionItem).yearly_theme || 'Vision ' + (node.item as VisionItem).year;
      case 'goal': 
        return (node.item as GoalItem).title;
      case 'priority': 
        return (node.item as PriorityItem).title;
      case 'task': 
        return (node.item as TaskItem).title;
    }
  };

  const getStatusColor = () => {
    if (node.type === 'task') {
      const task = node.item as TaskItem;
      return task.status === 'completed' ? 'bg-green-500/20 text-green-700' : 'bg-muted text-muted-foreground';
    }
    if (node.type === 'priority') {
      const priority = node.item as PriorityItem;
      switch (priority.status) {
        case 'completed': return 'bg-green-500/20 text-green-700';
        case 'deferred': return 'bg-yellow-500/20 text-yellow-700';
        default: return 'bg-blue-500/20 text-blue-700';
      }
    }
    if (node.type === 'goal') {
      const goal = node.item as GoalItem;
      return goal.status === 'completed' ? 'bg-green-500/20 text-green-700' : 'bg-blue-500/20 text-blue-700';
    }
    return '';
  };

  return (
    <div className={cn("select-none", level > 0 && "ml-4 border-l border-border pl-4")}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div 
          className={cn(
            "group flex items-center gap-2 p-2 rounded-lg transition-colors",
            "hover:bg-accent/50 cursor-pointer",
            compact ? "py-1" : "py-2"
          )}
          onClick={() => onNodeClick?.(node)}
        >
          {hasChildren && (
            <CollapsibleTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                {isOpen ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </Button>
            </CollapsibleTrigger>
          )}
          
          {!hasChildren && <div className="w-5" />}
          
          {getNodeIcon()}
          
          <span className={cn(
            "flex-1 font-medium",
            compact ? "text-sm" : "text-base",
            node.type === 'vision' && "text-lg font-semibold"
          )}>
            {getNodeTitle()}
          </span>
          
          {node.type !== 'vision' && (
            <Badge variant="secondary" className={cn("text-xs", getStatusColor())}>
              {node.type === 'task' 
                ? (node.item as TaskItem).status
                : node.type === 'priority'
                  ? (node.item as PriorityItem).status
                  : (node.item as GoalItem).status
              }
            </Badge>
          )}
          
          {node.progress !== undefined && node.progress > 0 && (
            <div className="flex items-center gap-2 w-24">
              <Progress value={node.progress} className="h-1.5" />
              <span className="text-xs text-muted-foreground w-8">{node.progress}%</span>
            </div>
          )}
          
          {showLinkButtons && node.type !== 'vision' && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                // Open linking modal
              }}
            >
              <Link2 className="w-3 h-3" />
            </Button>
          )}
        </div>
        
        {hasChildren && (
          <CollapsibleContent>
            <div className="space-y-1 mt-1">
              {node.children.map((child, index) => (
                <TreeNode 
                  key={`${child.type}-${index}`}
                  node={child} 
                  level={level + 1}
                  onNodeClick={onNodeClick}
                  showLinkButtons={showLinkButtons}
                  compact={compact}
                />
              ))}
            </div>
          </CollapsibleContent>
        )}
      </Collapsible>
    </div>
  );
};

interface UnlinkedItemsProps {
  goals: GoalItem[];
  priorities: PriorityItem[];
  tasks: TaskItem[];
  onNodeClick?: (node: TraceabilityNode) => void;
  compact?: boolean;
}

const UnlinkedItems: React.FC<UnlinkedItemsProps> = ({ 
  goals, 
  priorities, 
  tasks,
  onNodeClick,
  compact
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const unlinkedGoals = goals.filter(g => !g.annual_priority_id);
  const unlinkedPriorities = priorities.filter(p => !p.goal_id);
  const unlinkedTasks = tasks.filter(t => !t.priority_id && !t.goal_id);
  
  const totalUnlinked = unlinkedGoals.length + unlinkedPriorities.length + unlinkedTasks.length;
  
  if (totalUnlinked === 0) return null;

  return (
    <div className="mt-6 border-t border-border pt-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between">
            <span className="flex items-center gap-2">
              <Link2 className="w-4 h-4 text-muted-foreground" />
              <span>Unlinked Items</span>
              <Badge variant="secondary">{totalUnlinked}</Badge>
            </span>
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="mt-2 space-y-4">
          {unlinkedGoals.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <Target className="w-4 h-4" /> Goals without Vision Link
              </h4>
              <div className="space-y-1 ml-4">
                {unlinkedGoals.map(goal => (
                  <div 
                    key={goal.id}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-lg hover:bg-accent/50 cursor-pointer",
                      compact && "py-1"
                    )}
                    onClick={() => onNodeClick?.({ type: 'goal', item: goal, children: [] })}
                  >
                    <Target className="w-4 h-4 text-primary" />
                    <span className="text-sm">{goal.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {unlinkedPriorities.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <Star className="w-4 h-4" /> Priorities without Goal Link
              </h4>
              <div className="space-y-1 ml-4">
                {unlinkedPriorities.map(priority => (
                  <div 
                    key={priority.id}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-lg hover:bg-accent/50 cursor-pointer",
                      compact && "py-1"
                    )}
                    onClick={() => onNodeClick?.({ type: 'priority', item: priority, children: [] })}
                  >
                    <Star className="w-4 h-4 text-orange-500" />
                    <span className="text-sm">{priority.title}</span>
                    <Badge variant="outline" className="text-xs">{priority.scope}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {unlinkedTasks.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <CheckSquare className="w-4 h-4" /> Tasks without Links
              </h4>
              <div className="space-y-1 ml-4">
                {unlinkedTasks.slice(0, 10).map(task => (
                  <div 
                    key={task.id}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-lg hover:bg-accent/50 cursor-pointer",
                      compact && "py-1"
                    )}
                    onClick={() => onNodeClick?.({ type: 'task', item: task, children: [] })}
                  >
                    <CheckSquare className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{task.title}</span>
                  </div>
                ))}
                {unlinkedTasks.length > 10 && (
                  <p className="text-xs text-muted-foreground ml-6">
                    +{unlinkedTasks.length - 10} more tasks
                  </p>
                )}
              </div>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default TraceabilityTree;
