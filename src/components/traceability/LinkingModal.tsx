import React, { useState } from 'react';
import { Target, Star, CheckSquare, Link2, Unlink, Sparkles, Search } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useTraceability, GoalItem, PriorityItem, VisionItem } from '@/contexts/TraceabilityContext';

type LinkableItemType = 'goal' | 'priority' | 'task';

interface LinkingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemType: LinkableItemType;
  itemId: string;
  itemTitle: string;
  currentLinkId?: string | null;
}

const LinkingModal: React.FC<LinkingModalProps> = ({
  open,
  onOpenChange,
  itemType,
  itemId,
  itemTitle,
  currentLinkId
}) => {
  const { 
    vision, 
    goals, 
    priorities,
    linkGoalToVision,
    linkPriorityToGoal,
    linkTaskToPriority,
    linkTaskToGoal
  } = useTraceability();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>(
    itemType === 'goal' ? 'vision' : itemType === 'priority' ? 'goals' : 'priorities'
  );

  const handleLink = async (targetId: string | null) => {
    switch (itemType) {
      case 'goal':
        await linkGoalToVision(itemId, targetId);
        break;
      case 'priority':
        await linkPriorityToGoal(itemId, targetId);
        break;
      case 'task':
        if (activeTab === 'priorities') {
          await linkTaskToPriority(itemId, targetId);
        } else {
          await linkTaskToGoal(itemId, targetId);
        }
        break;
    }
    onOpenChange(false);
  };

  const getAvailableTargets = () => {
    if (itemType === 'goal') {
      // Goals can link to vision
      return { type: 'vision', items: vision ? [vision] : [] };
    }
    if (itemType === 'priority') {
      // Priorities can link to goals
      return { 
        type: 'goals', 
        items: goals.filter(g => 
          g.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      };
    }
    // Tasks can link to priorities or goals
    if (activeTab === 'priorities') {
      return { 
        type: 'priorities', 
        items: priorities.filter(p => 
          p.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      };
    }
    return { 
      type: 'goals', 
      items: goals.filter(g => 
        g.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    };
  };

  const targets = getAvailableTargets();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Link2 className="w-5 h-5" />
            Link {itemType.charAt(0).toUpperCase() + itemType.slice(1)}
          </SheetTitle>
          <SheetDescription>
            Connect "{itemTitle}" to a parent item for full traceability
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* Current link info */}
          {currentLinkId && (
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm">Currently linked</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleLink(null)}
                className="text-destructive hover:text-destructive"
              >
                <Unlink className="w-4 h-4 mr-1" />
                Unlink
              </Button>
            </div>
          )}

          {/* Tab selection for tasks */}
          {itemType === 'task' && (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="priorities" className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Priority
                </TabsTrigger>
                <TabsTrigger value="goals" className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Goal
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}

          {/* Search */}
          {targets.type !== 'vision' && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={`Search ${targets.type}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          )}

          {/* Available targets */}
          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {targets.type === 'vision' && vision && (
                <LinkableItem
                  icon={<Sparkles className="w-4 h-4 text-amber-500" />}
                  title={vision.yearly_theme || `Vision ${vision.year}`}
                  subtitle={vision.vision_statement || undefined}
                  isSelected={currentLinkId === vision.id}
                  onClick={() => handleLink(vision.id)}
                />
              )}

              {targets.type === 'goals' && (targets.items as GoalItem[]).map(goal => (
                <LinkableItem
                  key={goal.id}
                  icon={<Target className="w-4 h-4 text-primary" />}
                  title={goal.title}
                  subtitle={goal.description || undefined}
                  badge={goal.category || undefined}
                  progress={goal.progress_percentage}
                  isSelected={currentLinkId === goal.id}
                  onClick={() => handleLink(goal.id)}
                />
              ))}

              {targets.type === 'priorities' && (targets.items as PriorityItem[]).map(priority => (
                <LinkableItem
                  key={priority.id}
                  icon={<Star className="w-4 h-4 text-orange-500" />}
                  title={priority.title}
                  badge={priority.scope}
                  status={priority.status}
                  isSelected={currentLinkId === priority.id}
                  onClick={() => handleLink(priority.id)}
                />
              ))}

              {targets.items.length === 0 && targets.type !== 'vision' && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No {targets.type} found</p>
                  {searchQuery && <p className="text-sm mt-1">Try a different search term</p>}
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Skip linking */}
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            Skip for now
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

interface LinkableItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  badge?: string;
  status?: string;
  progress?: number;
  isSelected: boolean;
  onClick: () => void;
}

const LinkableItem: React.FC<LinkableItemProps> = ({
  icon,
  title,
  subtitle,
  badge,
  status,
  progress,
  isSelected,
  onClick
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left p-3 rounded-lg border transition-all",
        "hover:border-primary hover:bg-accent/50",
        isSelected && "border-primary bg-primary/10"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium truncate">{title}</span>
            {badge && (
              <Badge variant="outline" className="text-xs">
                {badge}
              </Badge>
            )}
            {status && (
              <Badge 
                variant="secondary" 
                className={cn(
                  "text-xs",
                  status === 'completed' && "bg-green-500/20 text-green-700",
                  status === 'active' && "bg-blue-500/20 text-blue-700",
                  status === 'deferred' && "bg-yellow-500/20 text-yellow-700"
                )}
              >
                {status}
              </Badge>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-muted-foreground truncate mt-0.5">{subtitle}</p>
          )}
          {progress !== undefined && progress > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{progress}%</span>
            </div>
          )}
        </div>
        {isSelected && (
          <Link2 className="w-4 h-4 text-primary flex-shrink-0" />
        )}
      </div>
    </button>
  );
};

export default LinkingModal;
