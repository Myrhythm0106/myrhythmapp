import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, Mail, Shield, X, RefreshCw } from 'lucide-react';
import { useAccountabilitySystem } from '@/hooks/use-accountability-system';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function PendingInvitations() {
  const { supportCircle, loadSupportCircle } = useAccountabilitySystem();
  
  const pendingInvitations = supportCircle.filter(member => member.status === 'pending');

  const revokePendingInvitation = async (memberId: string, memberName: string) => {
    try {
      const { data, error } = await supabase.rpc('revoke_invitation', {
        p_member_id: memberId,
        p_user_id: (await supabase.auth.getUser()).data.user?.id
      });

      if (error) throw error;

      if (data) {
        toast.success(`Invitation to ${memberName} has been revoked`);
        await loadSupportCircle(); // Refresh the list
      } else {
        toast.error('Failed to revoke invitation');
      }
    } catch (error: any) {
      console.error('Error revoking invitation:', error);
      toast.error('Failed to revoke invitation');
    }
  };

  const resendInvitation = async (member: any) => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('No authenticated user');

      const emailResponse = await supabase.functions.invoke('send-invitation-email', {
        body: {
          memberName: member.member_name,
          memberEmail: member.member_email,
          inviterName: user.user_metadata?.name || user.email || 'MyRhythm User',
          relationship: member.relationship,
          role: member.role,
          invitationToken: member.invitation_token,
          permissions: member.permissions || {}
        }
      });

      if (emailResponse.error) {
        throw emailResponse.error;
      }

      toast.success(`Invitation resent to ${member.member_name}!`);
    } catch (error: any) {
      console.error('Error resending invitation:', error);
      toast.error('Failed to resend invitation');
    }
  };

  const getTimeRemaining = (expiresAt: string | null) => {
    if (!expiresAt) return 'No expiration';
    
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffMs = expiry.getTime() - now.getTime();
    
    if (diffMs <= 0) return 'Expired';
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    }
    return `${minutes}m remaining`;
  };

  if (pendingInvitations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Pending Invitations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            No pending invitations. All your support circle members have accepted their invitations.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Pending Invitations ({pendingInvitations.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Invitations expire after 48 hours for security. Pending members cannot access your data until they verify their identity and accept.
          </AlertDescription>
        </Alert>

        {pendingInvitations.map((member) => {
          const timeRemaining = getTimeRemaining(member.invitation_expires_at);
          const isExpired = timeRemaining === 'Expired';
          
          return (
            <div key={member.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{member.member_name}</span>
                    <Badge variant={isExpired ? "destructive" : "secondary"}>
                      {isExpired ? 'Expired' : 'Pending'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    {member.member_email}
                  </div>
                  <p className="text-xs text-muted-foreground">{member.relationship}</p>
                </div>
                
                <div className="flex gap-2">
                  {!isExpired && (
                    <Button
                      onClick={() => resendInvitation(member)}
                      size="sm"
                      variant="outline"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Resend
                    </Button>
                  )}
                  <Button
                    onClick={() => revokePendingInvitation(member.id, member.member_name)}
                    size="sm"
                    variant="destructive"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Revoke
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  Invited: {new Date(member.invited_at || member.created_at).toLocaleDateString()}
                </span>
                <span className={`font-medium ${isExpired ? 'text-red-600' : 'text-orange-600'}`}>
                  {timeRemaining}
                </span>
              </div>
              
              {isExpired && (
                <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                  This invitation has expired. You can revoke it and send a new invitation if needed.
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}