import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Share2, Mail, Users, Eye, Edit, Settings, X } from 'lucide-react';
import { useCollaborativeCalendar } from './useCollaborativeCalendar';

interface EventSharingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
  eventTitle: string;
  existingShares?: Array<{
    id: string;
    shared_with_email: string;
    permission_level: string;
    status: string;
  }>;
}

export function EventSharingModal({
  open,
  onOpenChange,
  eventId,
  eventTitle,
  existingShares = []
}: EventSharingModalProps) {
  const [shareEmail, setShareEmail] = useState('');
  const [sharePermission, setSharePermission] = useState<'view' | 'edit' | 'admin'>('view');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'share' | 'invite'>('share');

  const { shareCalendarEvent, sendEventInvitation } = useCollaborativeCalendar();

  const handleShare = async () => {
    if (!shareEmail.trim()) return;
    
    await shareCalendarEvent(eventId, shareEmail.trim(), sharePermission);
    setShareEmail('');
    onOpenChange(false);
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    
    await sendEventInvitation(
      eventId, 
      inviteEmail.trim(), 
      inviteName.trim() || undefined,
      inviteMessage.trim() || undefined
    );
    
    setInviteEmail('');
    setInviteName('');
    setInviteMessage('');
    onOpenChange(false);
  };

  const getPermissionIcon = (permission: string) => {
    switch (permission) {
      case 'view': return <Eye className="h-3 w-3" />;
      case 'edit': return <Edit className="h-3 w-3" />;
      case 'admin': return <Settings className="h-3 w-3" />;
      default: return <Eye className="h-3 w-3" />;
    }
  };

  const getPermissionColor = (permission: string) => {
    switch (permission) {
      case 'view': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'edit': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'admin': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Share2 className="h-5 w-5 text-primary" />
            Share "{eventTitle}"
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Tab Selection */}
          <div className="flex space-x-1 bg-muted p-1 rounded-lg">
            <Button
              variant={activeTab === 'share' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('share')}
              className="flex-1"
            >
              <Users className="h-4 w-4 mr-2" />
              Share Calendar
            </Button>
            <Button
              variant={activeTab === 'invite' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('invite')}
              className="flex-1"
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Invitation
            </Button>
          </div>

          {/* Share Tab */}
          {activeTab === 'share' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="shareEmail">Email Address</Label>
                <Input
                  id="shareEmail"
                  type="email"
                  placeholder="colleague@example.com"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="permission">Permission Level</Label>
                <Select value={sharePermission} onValueChange={(value: any) => setSharePermission(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="view">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        <span>View Only</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="edit">
                      <div className="flex items-center gap-2">
                        <Edit className="h-4 w-4" />
                        <span>Can Edit</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="admin">
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        <span>Admin Access</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleShare} className="w-full">
                Share Calendar Event
              </Button>
            </div>
          )}

          {/* Invite Tab */}
          {activeTab === 'invite' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="inviteEmail">Email Address *</Label>
                  <Input
                    id="inviteEmail"
                    type="email"
                    placeholder="guest@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inviteName">Name (Optional)</Label>
                  <Input
                    id="inviteName"
                    placeholder="Guest Name"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="inviteMessage">Personal Message (Optional)</Label>
                <Textarea
                  id="inviteMessage"
                  placeholder="Add a personal message to your invitation..."
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  rows={3}
                />
              </div>

              <Button onClick={handleInvite} className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                Send Invitation
              </Button>
            </div>
          )}

          {/* Existing Shares */}
          {existingShares.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground">Current Collaborators</h4>
                <div className="space-y-2">
                  {existingShares.map((share) => (
                    <div
                      key={share.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-primary">
                            {share.shared_with_email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{share.shared_with_email}</p>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getPermissionColor(share.permission_level)}`}
                          >
                            {getPermissionIcon(share.permission_level)}
                            <span className="ml-1 capitalize">{share.permission_level}</span>
                          </Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
