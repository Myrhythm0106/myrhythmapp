import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Check, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSupportCircle } from '@/hooks/use-support-circle';
import { cn } from '@/lib/utils';

interface SupportCircleQuickAssignProps {
  actionId: string;
  currentWatchers: string[];
  onWatchersChange: (watchers: string[]) => void;
  compact?: boolean;
}

export function SupportCircleQuickAssign({
  actionId,
  currentWatchers,
  onWatchersChange,
  compact = false
}: SupportCircleQuickAssignProps) {
  const { members, isLoading } = useSupportCircle();
  const [isOpen, setIsOpen] = React.useState(false);

  const activeMembers = members || [];
  const hasWatchers = currentWatchers.length > 0;

  const toggleMember = (memberId: string) => {
    if (currentWatchers.includes(memberId)) {
      onWatchersChange(currentWatchers.filter(id => id !== memberId));
    } else {
      onWatchersChange([...currentWatchers, memberId]);
    }
  };

  const getWatcherNames = () => {
    return currentWatchers
      .map(id => activeMembers.find(m => m.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  if (isLoading || activeMembers.length === 0) {
    return null;
  }

  if (compact) {
    return (
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "h-8 px-2 gap-1",
            hasWatchers && "text-primary"
          )}
        >
          <Users className="w-4 h-4" />
          {hasWatchers && (
            <span className="text-xs">{currentWatchers.length}</span>
          )}
        </Button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute bottom-full right-0 mb-2 p-3 bg-popover border border-border rounded-xl shadow-lg z-50 min-w-[200px]"
            >
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Share with Support Circle
              </p>
              <div className="space-y-1">
                {activeMembers.map(member => (
                  <button
                    key={member.id}
                    onClick={() => toggleMember(member.id)}
                    className={cn(
                      "w-full flex items-center gap-2 p-2 rounded-lg text-sm transition-colors",
                      currentWatchers.includes(member.id)
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted"
                    )}
                  >
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                      currentWatchers.includes(member.id)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}>
                      {currentWatchers.includes(member.id) ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        member.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <span>{member.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-muted/50 rounded-xl hover:bg-muted transition-colors"
      >
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium">
            {hasWatchers ? (
              <>👀 {getWatcherNames()} watching</>
            ) : (
              <>Share with Support Circle</>
            )}
          </span>
        </div>
        <UserPlus className="w-4 h-4 text-muted-foreground" />
      </button>

      {/* Member list */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-2 pl-2">
              <p className="text-xs text-muted-foreground">
                They'll be notified when you complete this step 💜
              </p>
              <div className="flex flex-wrap gap-2">
                {activeMembers.map(member => (
                  <button
                    key={member.id}
                    onClick={() => toggleMember(member.id)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-full text-sm transition-all",
                      currentWatchers.includes(member.id)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    {currentWatchers.includes(member.id) && (
                      <Check className="w-3 h-3" />
                    )}
                    {member.name}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
