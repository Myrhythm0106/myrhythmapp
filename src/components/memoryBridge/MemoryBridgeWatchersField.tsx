import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SwipeableContainer } from '@/components/ui/SwipeableContainer';
import { useAccountabilitySystem } from '@/hooks/use-accountability-system';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useRecordingLimits } from '@/hooks/memoryBridge/useRecordingLimits';
import { Users, Plus, X, Heart, UserCheck, Stethoscope, User, Crown, Lock } from 'lucide-react';
import { toast } from 'sonner';

interface MemoryBridgeWatchersFieldProps {
  selectedWatchers: string[];
  onWatchersChange: (watchers: string[]) => void;
}

export function MemoryBridgeWatchersField({ 
  selectedWatchers, 
  onWatchersChange 
}: MemoryBridgeWatchersFieldProps) {
  const { supportCircle, isLoading } = useAccountabilitySystem();
  const { tier, upgradeRequired } = useSubscription();
  const { canAddWatchers } = useRecordingLimits();
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'family':
        return <Heart className="h-4 w-4 text-red-500" />;
      case 'friend':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'medical':
      case 'healthcare':
        return <Stethoscope className="h-4 w-4 text-green-500" />;
      case 'caregiver':
        return <UserCheck className="h-4 w-4 text-purple-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'family':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'friend':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'medical':
      case 'healthcare':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'caregiver':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const handleSwipeInvite = (memberId: string) => {
    if (!canAddWatchers()) {
      toast.error('Upgrade to add family watchers to your recordings');
      return;
    }
    toggleWatcher(memberId);
  };

  const handleSwipeUpgrade = () => {
    toast.info('Swipe to upgrade and unlock family sharing');
  };

  const toggleWatcher = (memberId: string) => {
    if (!canAddWatchers()) {
      toast.error('Family sharing requires upgrade. Swipe to unlock!');
      return;
    }

    const isSelected = selectedWatchers.includes(memberId);
    const newWatchers = isSelected 
      ? selectedWatchers.filter(id => id !== memberId)
      : [...selectedWatchers, memberId];
    
    onWatchersChange(newWatchers);
    
    if (!isSelected) {
      toast.success('Family member added as watcher');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Family Watchers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Loading support circle...</div>
        </CardContent>
      </Card>
    );
  }

  if (!canAddWatchers()) {
    return (
      <SwipeableContainer
        onSwipeRight={{
          label: 'Upgrade',
          icon: <Crown className="h-4 w-4" />,
          color: '#10b981',
          action: handleSwipeUpgrade
        }}
        enableHorizontalSwipe={true}
        className="mb-4"
      >
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <Lock className="h-5 w-5" />
              Family Watching (Premium Feature)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-3">
              <p className="text-sm text-amber-700">
                Add trusted family members as watchers to your empowerment sessions
              </p>
              <div className="bg-white/50 rounded-lg p-3 border border-amber-200">
                <p className="text-xs text-amber-600 font-medium">
                  💡 Swipe right to upgrade and unlock family accountability
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </SwipeableContainer>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Family Watchers
          {tier !== 'free' && (
            <Badge variant="secondary" className="text-xs">
              <Crown className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {supportCircle.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground py-4">
            <Users className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p>No support circle members yet.</p>
            <p className="text-xs mt-1">Add members to invite them as watchers.</p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground mb-3">
              Choose family members to watch and support your empowerment sessions:
            </p>
            <div className="space-y-2">
              {supportCircle.map((member) => (
                <SwipeableContainer
                  key={member.id}
                  onSwipeRight={{
                    label: selectedWatchers.includes(member.id) ? 'Remove' : 'Add Watcher',
                    icon: selectedWatchers.includes(member.id) ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />,
                    color: selectedWatchers.includes(member.id) ? '#ef4444' : '#10b981',
                    action: () => handleSwipeInvite(member.id)
                  }}
                  enableHorizontalSwipe={true}
                >
                  <div 
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedWatchers.includes(member.id) 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-card border-border hover:bg-muted/50'
                    }`}
                    onClick={() => toggleWatcher(member.id)}
                  >
                    <div className="flex items-center gap-3">
                      {getRoleIcon(member.role)}
                      <div>
                        <p className="font-medium text-sm">{member.member_name}</p>
                        <p className="text-xs text-muted-foreground">{member.relationship}</p>
                      </div>
                      <Badge className={`text-xs ${getRoleColor(member.role)}`}>
                        {member.role}
                      </Badge>
                    </div>
                    <Button
                      type="button"
                      variant={selectedWatchers.includes(member.id) ? "default" : "outline"}
                      size="sm"
                      className="h-8"
                    >
                      {selectedWatchers.includes(member.id) ? (
                        <>
                          <X className="h-4 w-4 mr-1" />
                          Remove
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </>
                      )}
                    </Button>
                  </div>
                </SwipeableContainer>
              ))}
            </div>
            {selectedWatchers.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
                <p className="text-xs text-green-600 font-medium">
                  {selectedWatchers.length} family member(s) will be able to view and comment on this session
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}