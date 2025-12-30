import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Users, ChevronDown, Check, Bell, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface SupportCircleMember {
  id: string;
  member_name: string;
  member_email: string | null;
  relationship: string;
  role: string;
  status: string;
}

interface ActionWatcherSelectorProps {
  actionId: string;
  assignedWatchers: string[];
  onWatchersChange: (watchers: string[]) => void;
  onNotify?: () => void;
}

const roleColors: Record<string, string> = {
  family: 'ring-red-400 bg-red-100 text-red-700',
  friend: 'ring-blue-400 bg-blue-100 text-blue-700',
  medical: 'ring-green-400 bg-green-100 text-green-700',
  caregiver: 'ring-purple-400 bg-purple-100 text-purple-700',
  professional: 'ring-amber-400 bg-amber-100 text-amber-700',
  other: 'ring-gray-400 bg-gray-100 text-gray-700'
};

export function ActionWatcherSelector({
  actionId,
  assignedWatchers,
  onWatchersChange,
  onNotify
}: ActionWatcherSelectorProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [members, setMembers] = useState<SupportCircleMember[]>([]);
  const [assignedDetails, setAssignedDetails] = useState<SupportCircleMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isNotifying, setIsNotifying] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchMembers = async () => {
      const { data } = await supabase
        .from('support_circle_members')
        .select('id, member_name, member_email, relationship, role, status')
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (data) {
        setMembers(data);
        // Get details for assigned watchers
        const assigned = data.filter(m => assignedWatchers.includes(m.id));
        setAssignedDetails(assigned);
      }
    };

    fetchMembers();
  }, [user, assignedWatchers]);

  const toggleWatcher = async (memberId: string) => {
    setIsLoading(true);
    const isCurrentlyAssigned = assignedWatchers.includes(memberId);
    const newWatchers = isCurrentlyAssigned
      ? assignedWatchers.filter(id => id !== memberId)
      : [...assignedWatchers, memberId];

    onWatchersChange(newWatchers);
    setIsLoading(false);
  };

  const handleNotifyAll = async () => {
    setIsNotifying(true);
    try {
      // Update support_circle_notified flag
      const { error } = await supabase
        .from('extracted_actions')
        .update({ support_circle_notified: true })
        .eq('id', actionId);

      if (error) throw error;
      
      onNotify?.();
      toast.success('Watchers notified successfully!');
    } catch (error) {
      console.error('Error notifying watchers:', error);
      toast.error('Failed to notify watchers');
    } finally {
      setIsNotifying(false);
    }
  };

  const getRoleColor = (relationship: string) => {
    const normalizedRole = relationship.toLowerCase();
    return roleColors[normalizedRole] || roleColors.other;
  };

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-neural-purple-50/90 to-white/90 backdrop-blur-sm border border-neural-purple-200/50 shadow-lg p-4">
      {/* Glass reflection effect */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
      
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-neural-purple-100 rounded-lg">
                <Users className="h-4 w-4 text-neural-purple-600" />
              </div>
              <span className="font-semibold text-neural-purple-700 text-sm">SUPPORT CIRCLE</span>
              {assignedWatchers.length > 0 && (
                <Badge className="bg-gradient-to-r from-brand-orange-500 to-brand-orange-600 text-white text-xs shadow-md">
                  {assignedWatchers.length} watching
                </Badge>
              )}
            </div>
            <ChevronDown className={cn(
              "h-4 w-4 text-neural-purple-500 transition-transform duration-200",
              isOpen && "rotate-180"
            )} />
          </div>
        </CollapsibleTrigger>

        {/* Assigned watcher avatars */}
        {assignedDetails.length > 0 && !isOpen && (
          <div className="flex -space-x-2 mt-3 relative z-10">
            {assignedDetails.slice(0, 5).map(watcher => (
              <Avatar 
                key={watcher.id} 
                className={cn(
                  "h-8 w-8 ring-2 ring-offset-2 ring-offset-white shadow-md transition-transform hover:scale-110",
                  getRoleColor(watcher.relationship).split(' ')[0]
                )}
              >
                <AvatarFallback className={cn("text-xs font-bold", getRoleColor(watcher.relationship).split(' ').slice(1).join(' '))}>
                  {watcher.member_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </AvatarFallback>
              </Avatar>
            ))}
            {assignedDetails.length > 5 && (
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold ring-2 ring-white">
                +{assignedDetails.length - 5}
              </div>
            )}
          </div>
        )}

        <CollapsibleContent className="relative z-10">
          <div className="pt-4 space-y-3">
            {/* Current watchers with details */}
            {assignedDetails.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {assignedDetails.map(watcher => (
                  <div 
                    key={watcher.id}
                    className="flex items-center gap-2 px-2 py-1 bg-white/80 rounded-full border border-neural-purple-200/50 shadow-sm"
                  >
                    <Avatar className={cn("h-5 w-5 ring-1", getRoleColor(watcher.relationship).split(' ')[0])}>
                      <AvatarFallback className="text-[10px] font-bold">
                        {watcher.member_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium text-foreground">{watcher.member_name}</span>
                    <Badge variant="outline" className="text-[10px] py-0 px-1">
                      {watcher.relationship}
                    </Badge>
                  </div>
                ))}
              </div>
            )}

            {/* Add more members */}
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {members.map(member => {
                const isAssigned = assignedWatchers.includes(member.id);
                return (
                  <button
                    key={member.id}
                    onClick={() => toggleWatcher(member.id)}
                    disabled={isLoading}
                    className={cn(
                      "w-full flex items-center gap-2 p-2 rounded-lg transition-all duration-200",
                      isAssigned 
                        ? "bg-neural-purple-100/80 border border-neural-purple-200" 
                        : "hover:bg-white/60 border border-transparent hover:border-neural-purple-100"
                    )}
                  >
                    <Avatar className={cn("h-7 w-7 ring-2", getRoleColor(member.relationship).split(' ')[0])}>
                      <AvatarFallback className={cn("text-xs font-bold", getRoleColor(member.relationship).split(' ').slice(1).join(' '))}>
                        {member.member_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-foreground flex-1 text-left">{member.member_name}</span>
                    <Badge variant="outline" className="text-xs">
                      {member.relationship}
                    </Badge>
                    {isAssigned && (
                      <div className="p-1 bg-neural-purple-500 rounded-full">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
              
              {members.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-2">
                  No support circle members yet
                </p>
              )}
            </div>

            {/* Notify button */}
            {assignedWatchers.length > 0 && (
              <Button 
                onClick={handleNotifyAll}
                disabled={isNotifying}
                className="w-full bg-gradient-to-r from-brand-orange-500 to-brand-orange-600 hover:from-brand-orange-600 hover:to-brand-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 mt-2"
              >
                {isNotifying ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Bell className="h-4 w-4 mr-2" />
                )}
                Notify All Watchers
              </Button>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
