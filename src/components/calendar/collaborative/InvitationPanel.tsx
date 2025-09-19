import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Bell, 
  Mail, 
  Calendar, 
  Clock, 
  Check, 
  X, 
  MessageCircle,
  Users,
  Activity
} from 'lucide-react';
import { useCollaborativeCalendar } from './useCollaborativeCalendar';
import { format } from 'date-fns';

interface InvitationPanelProps {
  trigger: React.ReactNode;
}

export function InvitationPanel({ trigger }: InvitationPanelProps) {
  const { invitations, shares, respondToInvitation } = useCollaborativeCalendar();

  const pendingInvitations = invitations.filter(inv => inv.status === 'pending');
  const recentShares = shares.slice(0, 5);
  const recentInvitations = invitations.filter(inv => inv.status !== 'pending').slice(0, 5);

  const handleResponse = async (invitationId: string, response: 'accepted' | 'declined' | 'maybe') => {
    await respondToInvitation(invitationId, response);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return <Badge className="bg-green-100 text-green-800 border-green-200">✅ Accepted</Badge>;
      case 'declined':
        return <Badge variant="destructive">❌ Declined</Badge>;
      case 'maybe':
        return <Badge variant="secondary">🤔 Maybe</Badge>;
      case 'pending':
        return <Badge variant="outline">⏳ Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger}
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[500px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Calendar Notifications
            {pendingInvitations.length > 0 && (
              <Badge variant="destructive" className="text-xs">
                {pendingInvitations.length}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Pending Invitations */}
          {pendingInvitations.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Pending Invitations ({pendingInvitations.length})
              </h3>
              
              {pendingInvitations.map((invitation) => (
                <Card key={invitation.id} className="border-primary/20">
                  <CardContent className="p-4 space-y-3">
                    <div className="space-y-1">
                      <h4 className="font-medium text-sm">Event Invitation</h4>
                      <p className="text-xs text-muted-foreground">
                        From: {invitation.invitee_name || invitation.invitee_email}
                      </p>
                    </div>
                    
                    {invitation.message && (
                      <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                        "{invitation.message}"
                      </p>
                    )}

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => handleResponse(invitation.id, 'accepted')}
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleResponse(invitation.id, 'maybe')}
                      >
                        <MessageCircle className="h-3 w-3 mr-1" />
                        Maybe
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="flex-1"
                        onClick={() => handleResponse(invitation.id, 'declined')}
                      >
                        <X className="h-3 w-3 mr-1" />
                        Decline
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {(pendingInvitations.length > 0 && (recentShares.length > 0 || recentInvitations.length > 0)) && <Separator />}

          {/* Recent Activity */}
          {(recentShares.length > 0 || recentInvitations.length > 0) && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Recent Activity
              </h3>

              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {/* Recent Shares */}
                {recentShares.map((share) => (
                  <div
                    key={share.id}
                    className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg"
                  >
                    <div className="p-1.5 bg-primary/10 rounded">
                      <Users className="h-3 w-3" />
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Calendar Shared</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {format(new Date(share.created_at), 'MMM d, HH:mm')}
                        </div>
                      </div>
                      
                      <p className="text-xs text-muted-foreground">
                        {share.shared_with_email}
                      </p>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {share.permission_level} access
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Recent Invitations */}
                {recentInvitations.map((invitation) => (
                  <div
                    key={invitation.id}
                    className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg"
                  >
                    <div className="p-1.5 bg-primary/10 rounded">
                      <Mail className="h-3 w-3" />
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Event Invitation</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {format(new Date(invitation.created_at), 'MMM d, HH:mm')}
                        </div>
                      </div>
                      
                      <p className="text-xs text-muted-foreground">
                        {invitation.invitee_email}
                      </p>
                      
                      <div className="flex items-center gap-2">
                        {getStatusBadge(invitation.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {pendingInvitations.length === 0 && recentShares.length === 0 && recentInvitations.length === 0 && (
            <div className="text-center py-8 space-y-2">
              <Bell className="h-8 w-8 mx-auto text-muted-foreground opacity-50" />
              <p className="text-sm text-muted-foreground">No notifications yet</p>
              <p className="text-xs text-muted-foreground">
                Calendar invitations and activity will appear here
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}