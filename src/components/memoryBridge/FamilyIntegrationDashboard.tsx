import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { useMemoryBridge } from '@/hooks/memoryBridge/useMemoryBridge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  Shield, 
  Eye, 
  EyeOff, 
  Bell, 
  Heart, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  MessageCircle,
  Settings
} from 'lucide-react';
import { ExtractedAction } from '@/types/memoryBridge';

interface FamilyMember {
  id: string;
  member_name: string;
  member_email: string;
  relationship: string;
  role: string;
  status: string;
  permissions: {
    memory_bridge: boolean;
    action_visibility: boolean;
    crisis_alerts: boolean;
  };
  can_receive_alerts: boolean;
}

interface SharedAction extends ExtractedAction {
  visibility_level: 'private' | 'family' | 'supporters';
  watchers: string[];
}

export function FamilyIntegrationDashboard() {
  const { user } = useAuth();
  const { extractedActions, fetchExtractedActions } = useMemoryBridge();
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [sharedActions, setSharedActions] = useState<SharedAction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFamilyMembers();
      fetchSharedActions();
    }
  }, [user]);

  const fetchFamilyMembers = async () => {
    if (!user) return;

    try {
      const { data: members, error } = await supabase
        .from('support_circle_members')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (error) throw error;
      
      const familyData = members?.map(member => {
        const permissions = member.permissions as Record<string, any> || {};
        return {
          ...member,
          permissions: {
            memory_bridge: permissions.memory_bridge || false,
            action_visibility: permissions.action_visibility || false,
            crisis_alerts: permissions.crisis_alerts || false
          }
        };
      }) || [];
      
      setFamilyMembers(familyData);
    } catch (error) {
      console.error('Error fetching family members:', error);
    }
  };

  const fetchSharedActions = async () => {
    if (!user) return;

    try {
      await fetchExtractedActions();
      
      // Simulate shared actions with visibility levels
      const actionsWithVisibility = extractedActions.map(action => ({
        ...action,
        visibility_level: action.emotional_stakes === 'high' ? 'family' as const : 'private' as const,
        watchers: action.emotional_stakes === 'high' ? familyMembers
          .filter(m => m.permissions.action_visibility)
          .map(m => m.id) : []
      }));
      
      setSharedActions(actionsWithVisibility);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching shared actions:', error);
      setIsLoading(false);
    }
  };

  const updateMemberPermissions = async (memberId: string, permission: string, enabled: boolean) => {
    try {
      const member = familyMembers.find(m => m.id === memberId);
      if (!member) return;

      const updatedPermissions = {
        ...member.permissions,
        [permission]: enabled
      };

      const { error } = await supabase
        .from('support_circle_members')
        .update({ permissions: updatedPermissions })
        .eq('id', memberId);

      if (error) throw error;

      setFamilyMembers(prev => 
        prev.map(m => 
          m.id === memberId 
            ? { ...m, permissions: updatedPermissions }
            : m
        )
      );
    } catch (error) {
      console.error('Error updating permissions:', error);
    }
  };

  const shareActionWithFamily = async (actionId: string, visibility: 'private' | 'family' | 'supporters') => {
    try {
      // Update action visibility in database
      const { error } = await supabase
        .from('extracted_actions')
        .update({ 
          status: visibility === 'private' ? 'pending' : 'shared',
          user_notes: `Shared with ${visibility}`
        })
        .eq('id', actionId)
        .eq('user_id', user?.id);

      if (error) throw error;

      // Update local state
      setSharedActions(prev =>
        prev.map(action =>
          action.id === actionId
            ? { ...action, visibility_level: visibility }
            : action
        )
      );

      // Send alerts to family members if sharing
      if (visibility !== 'private') {
        await generateFamilyAlert(actionId, visibility);
      }
    } catch (error) {
      console.error('Error sharing action:', error);
    }
  };

  const generateFamilyAlert = async (actionId: string, visibility: string) => {
    const action = sharedActions.find(a => a.id === actionId);
    if (!action || !user) return;

    try {
      const targetMembers = familyMembers
        .filter(m => m.permissions.action_visibility && m.can_receive_alerts)
        .map(m => m.member_email);

      await supabase.functions.invoke('generate-accountability-alert', {
        body: {
          userId: user.id,
          alertType: 'commitment_shared',
          relatedId: actionId,
          title: `New Commitment: ${action.action_text.substring(0, 50)}...`,
          message: `${user.email} has shared a new commitment that might need support.`,
          severity: 'info',
          targetMembers
        }
      });
    } catch (error) {
      console.error('Error generating family alert:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-32 bg-muted rounded-lg mb-4"></div>
          <div className="h-24 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Family Members Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Family & Support Circle
            <Badge variant="secondary">{familyMembers.length} members</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {familyMembers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>No family members added yet.</p>
              <p className="text-sm">Invite family members to share Memory Bridge insights.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {familyMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {member.member_name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.member_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {member.relationship} • {member.role}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={member.permissions.memory_bridge}
                          onCheckedChange={(checked) => 
                            updateMemberPermissions(member.id, 'memory_bridge', checked)
                          }
                        />
                        <span className="text-xs">Memory Bridge Access</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={member.permissions.action_visibility}
                          onCheckedChange={(checked) => 
                            updateMemberPermissions(member.id, 'action_visibility', checked)
                          }
                        />
                        <span className="text-xs">See Commitments</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={member.permissions.crisis_alerts}
                          onCheckedChange={(checked) => 
                            updateMemberPermissions(member.id, 'crisis_alerts', checked)
                          }
                        />
                        <span className="text-xs">Crisis Alerts</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Shared Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Shared Commitments
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sharedActions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>No commitments to share yet.</p>
              <p className="text-sm">Start a Memory Bridge session to capture commitments.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sharedActions.map((action) => (
                <div key={action.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <p className="font-medium mb-1">{action.action_text}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline">{action.action_type}</Badge>
                        {action.assigned_to && (
                          <span>Assigned to: {action.assigned_to}</span>
                        )}
                        {action.due_context && (
                          <span>Due: {action.due_context}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {action.visibility_level === 'family' ? (
                        <Badge variant="secondary" className="gap-1">
                          <Eye className="h-3 w-3" />
                          Shared with Family
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1">
                          <EyeOff className="h-3 w-3" />
                          Private
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {action.emotional_stakes && (
                    <div className="mb-3">
                      <p className="text-sm text-muted-foreground">
                        <strong>Why this matters:</strong> {action.emotional_stakes}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {action.status === 'completed' && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      {action.status === 'pending' && (
                        <Clock className="h-4 w-4 text-orange-500" />
                      )}
                      <span className="text-sm capitalize">{action.status}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => shareActionWithFamily(
                          action.id, 
                          action.visibility_level === 'private' ? 'family' : 'private'
                        )}
                      >
                        {action.visibility_level === 'private' ? (
                          <>
                            <Eye className="h-3 w-3 mr-1" />
                            Share
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3 w-3 mr-1" />
                            Make Private
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {sharedActions.filter(a => a.visibility_level === 'family').length}
              </div>
              <p className="text-sm text-muted-foreground">Shared Commitments</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {familyMembers.filter(m => m.permissions.action_visibility).length}
              </div>
              <p className="text-sm text-muted-foreground">Active Watchers</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {sharedActions.filter(a => a.status === 'completed').length}
              </div>
              <p className="text-sm text-muted-foreground">Completed Actions</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}