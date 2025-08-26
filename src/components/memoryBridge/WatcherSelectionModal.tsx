import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Users, Shield, Heart, Stethoscope, Crown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SupportMember {
  id: string;
  member_name: string;
  member_email: string;
  relationship: string;
  role: string;
  status: string;
}

interface WatcherSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionIds: string[];
  onComplete: (selectedWatchers: string[], memberNames: string[]) => void;
}

export function WatcherSelectionModal({
  isOpen,
  onClose,
  actionIds,
  onComplete
}: WatcherSelectionModalProps) {
  const [supportMembers, setSupportMembers] = useState<SupportMember[]>([]);
  const [selectedWatchers, setSelectedWatchers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchSupportMembers();
    }
  }, [isOpen]);

  const fetchSupportMembers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('support_circle_members')
        .select('*')
        .eq('status', 'active')
        .order('member_name');

      if (error) throw error;
      setSupportMembers(data || []);
    } catch (error) {
      console.error('Error fetching support members:', error);
      toast.error('Failed to load support circle members');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWatcherToggle = (memberId: string) => {
    setSelectedWatchers(prev => 
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleComplete = () => {
    const memberNames = supportMembers
      .filter(member => selectedWatchers.includes(member.id))
      .map(member => member.member_name);
    
    onComplete(selectedWatchers, memberNames);
    toast.success(`Selected ${selectedWatchers.length} watchers for accountability`);
    onClose();
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'medical': return <Stethoscope className="h-4 w-4" />;
      case 'family': return <Heart className="h-4 w-4" />;
      case 'mentor': return <Crown className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'medical': return 'bg-red-100 text-red-800 border-red-200';
      case 'family': return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'mentor': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Choose Your Accountability Watchers
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Select the support circle members who should receive notifications about your progress on these actions.
            They'll be able to encourage you and help keep you accountable.
          </p>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading your support circle...</p>
            </div>
          ) : supportMembers.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">No Support Circle Members</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  You haven't added anyone to your support circle yet. 
                  Add family, friends, or mentors to help with accountability.
                </p>
                <Button variant="outline" onClick={onClose}>
                  Add Members First
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {supportMembers.map((member) => (
                <Card
                  key={member.id}
                  className={`cursor-pointer transition-colors ${
                    selectedWatchers.includes(member.id)
                      ? 'border-primary bg-primary/5'
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => handleWatcherToggle(member.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedWatchers.includes(member.id)}
                          onChange={() => handleWatcherToggle(member.id)}
                        />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{member.member_name}</span>
                            <Badge className={getRoleBadgeColor(member.role)}>
                              {getRoleIcon(member.role)}
                              {member.role}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {member.relationship} • {member.member_email}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              {selectedWatchers.length} watcher{selectedWatchers.length !== 1 ? 's' : ''} selected
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleComplete}
                disabled={selectedWatchers.length === 0}
              >
                Continue with {selectedWatchers.length} Watcher{selectedWatchers.length !== 1 ? 's' : ''}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}