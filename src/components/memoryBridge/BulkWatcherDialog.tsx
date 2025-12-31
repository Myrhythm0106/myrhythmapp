import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface SupportCircleMember {
  id: string;
  member_name: string;
  member_email: string | null;
  relationship: string;
  role: string;
}

interface BulkWatcherDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (watcherIds: string[]) => Promise<void>;
  actionsCount: number;
}

export function BulkWatcherDialog({
  isOpen,
  onClose,
  onApply,
  actionsCount
}: BulkWatcherDialogProps) {
  const { user } = useAuth();
  const [members, setMembers] = useState<SupportCircleMember[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    if (!isOpen || !user) return;

    const fetchMembers = async () => {
      setIsLoading(true);
      const { data } = await supabase
        .from('support_circle_members')
        .select('id, member_name, member_email, relationship, role')
        .eq('user_id', user.id)
        .eq('status', 'active');
      
      setMembers(data || []);
      setIsLoading(false);
    };

    fetchMembers();
  }, [isOpen, user]);

  const toggleMember = (memberId: string) => {
    setSelectedMembers(prev => {
      const next = new Set(prev);
      if (next.has(memberId)) {
        next.delete(memberId);
      } else {
        next.add(memberId);
      }
      return next;
    });
  };

  const selectAll = () => {
    setSelectedMembers(new Set(members.map(m => m.id)));
  };

  const handleApply = async () => {
    setIsApplying(true);
    try {
      await onApply(Array.from(selectedMembers));
      onClose();
    } finally {
      setIsApplying(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'primary': return 'ring-memory-emerald-500 bg-memory-emerald-100';
      case 'professional': return 'ring-neural-blue-500 bg-neural-blue-100';
      case 'family': return 'ring-brand-orange-500 bg-brand-orange-100';
      default: return 'ring-muted-foreground bg-muted';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-gradient-to-br from-white/98 to-gray-50/98 backdrop-blur-xl border border-white/40 shadow-2xl">
        <DialogHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-memory-emerald-500 to-clarity-teal-500 rounded-xl shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
          <DialogTitle className="text-lg font-bold text-foreground">
            Add Watchers to All Actions
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            These Support Circle members will be notified for all {actionsCount} actions
          </p>
        </DialogHeader>

        <div className="py-4 space-y-3">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              <Loader2 className="h-6 w-6 mx-auto animate-spin" />
              <p className="mt-2 text-sm">Loading your Support Circle...</p>
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-6 w-6 mx-auto opacity-50" />
              <p className="mt-2 text-sm">No Support Circle members found</p>
            </div>
          ) : (
            <>
              <div className="flex justify-end mb-2">
                <Button variant="ghost" size="sm" onClick={selectAll}>
                  Select All
                </Button>
              </div>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {members.map((member) => (
                  <div
                    key={member.id}
                    onClick={() => toggleMember(member.id)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all",
                      selectedMembers.has(member.id)
                        ? "bg-memory-emerald-50 border border-memory-emerald-200"
                        : "bg-muted/30 border border-transparent hover:bg-muted/50"
                    )}
                  >
                    <Checkbox 
                      checked={selectedMembers.has(member.id)}
                      onCheckedChange={() => toggleMember(member.id)}
                    />
                    <Avatar className={cn("h-10 w-10 ring-2", getRoleColor(member.role))}>
                      <AvatarFallback className="text-xs font-bold">
                        {getInitials(member.member_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{member.member_name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{member.relationship}</p>
                    </div>
                    <Badge variant="outline" className="text-xs capitalize">
                      {member.role}
                    </Badge>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            disabled={selectedMembers.size === 0 || isApplying}
            className="flex-1 bg-gradient-to-r from-memory-emerald-500 to-clarity-teal-500 text-white"
          >
            {isApplying ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Applying...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Add to All ({selectedMembers.size})
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
