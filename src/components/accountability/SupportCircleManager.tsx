
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Users, Plus, Mail, Phone, Shield, Clock, Bell, Settings } from 'lucide-react';
import { useAccountabilitySystem, SupportCircleMember } from '@/hooks/use-accountability-system';
import { toast } from 'sonner';

export function SupportCircleManager() {
  const { supportCircle, addSupportMember, updateMemberPermissions } = useAccountabilitySystem();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<SupportCircleMember | null>(null);
  
  const [newMember, setNewMember] = useState({
    member_name: '',
    member_email: '',
    member_phone: '',
    relationship: '',
    role: 'viewer' as const,
    permissions: {
      mood: false,
      health: false,
      calendar: false,
      goals: false,
      gratitude: false
    },
    can_send_reminders: false,
    can_receive_alerts: true,
    notification_preferences: {
      email: true,
      sms: false
    }
  });

  const handleAddMember = async () => {
    if (!newMember.member_name || !newMember.relationship) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      await addSupportMember(newMember);
      setIsAddDialogOpen(false);
      setNewMember({
        member_name: '',
        member_email: '',
        member_phone: '',
        relationship: '',
        role: 'viewer',
        permissions: {
          mood: false,
          health: false,
          calendar: false,
          goals: false,
          gratitude: false
        },
        can_send_reminders: false,
        can_receive_alerts: true,
        notification_preferences: {
          email: true,
          sms: false
        }
      });
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleUpdatePermissions = async (member: SupportCircleMember, updates: Partial<SupportCircleMember>) => {
    await updateMemberPermissions(member.id, updates);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'medical': return 'bg-red-100 text-red-800';
      case 'caregiver': return 'bg-blue-100 text-blue-800';
      case 'supporter': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Support Circle</h2>
          <p className="text-muted-foreground">
            Manage who can help you stay accountable and connected
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Support Circle Member</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={newMember.member_name}
                    onChange={(e) => setNewMember(prev => ({ ...prev, member_name: e.target.value }))}
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <Label htmlFor="relationship">Relationship *</Label>
                  <Select 
                    value={newMember.relationship} 
                    onValueChange={(value) => setNewMember(prev => ({ ...prev, relationship: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="family">Family Member</SelectItem>
                      <SelectItem value="friend">Friend</SelectItem>
                      <SelectItem value="caregiver">Caregiver</SelectItem>
                      <SelectItem value="healthcare">Healthcare Provider</SelectItem>
                      <SelectItem value="colleague">Colleague</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newMember.member_email}
                    onChange={(e) => setNewMember(prev => ({ ...prev, member_email: e.target.value }))}
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newMember.member_phone}
                    onChange={(e) => setNewMember(prev => ({ ...prev, member_phone: e.target.value }))}
                    placeholder="Phone number"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="role">Role</Label>
                <Select 
                  value={newMember.role} 
                  onValueChange={(value: any) => setNewMember(prev => ({ ...prev, role: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">Viewer - Can see shared information</SelectItem>
                    <SelectItem value="supporter">Supporter - Can encourage and remind</SelectItem>
                    <SelectItem value="caregiver">Caregiver - Can help with daily tasks</SelectItem>
                    <SelectItem value="medical">Medical - Healthcare provider access</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Permissions</Label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(newMember.permissions).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={key}
                        checked={value}
                        onCheckedChange={(checked) => 
                          setNewMember(prev => ({
                            ...prev,
                            permissions: { ...prev.permissions, [key]: checked }
                          }))
                        }
                      />
                      <Label htmlFor={key} className="text-sm capitalize">
                        {key === 'gratitude' ? 'Gratitude Practice' : key}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="reminders"
                    checked={newMember.can_send_reminders}
                    onCheckedChange={(checked) => 
                      setNewMember(prev => ({ ...prev, can_send_reminders: checked as boolean }))
                    }
                  />
                  <Label htmlFor="reminders">Can send reminders</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="alerts"
                    checked={newMember.can_receive_alerts}
                    onCheckedChange={(checked) => 
                      setNewMember(prev => ({ ...prev, can_receive_alerts: checked as boolean }))
                    }
                  />
                  <Label htmlFor="alerts">Receive alerts</Label>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddMember}>
                Add Member
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {supportCircle.map((member) => (
          <Card key={member.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{member.member_name}</h3>
                    <p className="text-sm text-muted-foreground capitalize">
                      {member.relationship}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {member.member_email && (
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Mail className="h-3 w-3 mr-1" />
                          {member.member_email}
                        </div>
                      )}
                      {member.member_phone && (
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Phone className="h-3 w-3 mr-1" />
                          {member.member_phone}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Badge className={getRoleColor(member.role)}>
                    {member.role}
                  </Badge>
                  
                  <div className="flex items-center space-x-2">
                    {member.can_send_reminders && (
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        Reminders
                      </Badge>
                    )}
                    {member.can_receive_alerts && (
                      <Badge variant="outline" className="text-xs">
                        <Bell className="h-3 w-3 mr-1" />
                        Alerts
                      </Badge>
                    )}
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Manage {member.member_name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <Label>Data Access Permissions</Label>
                          <div className="space-y-2">
                            {Object.entries(member.permissions).map(([key, value]) => (
                              <div key={key} className="flex items-center justify-between">
                                <Label className="text-sm capitalize">
                                  {key === 'gratitude' ? 'Gratitude Practice' : key}
                                </Label>
                                <Switch
                                  checked={value}
                                  onCheckedChange={(checked) => 
                                    handleUpdatePermissions(member, {
                                      permissions: { ...member.permissions, [key]: checked }
                                    })
                                  }
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label>Actions</Label>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm">Can send reminders</Label>
                              <Switch
                                checked={member.can_send_reminders}
                                onCheckedChange={(checked) => 
                                  handleUpdatePermissions(member, { can_send_reminders: checked })
                                }
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label className="text-sm">Receive alerts</Label>
                              <Switch
                                checked={member.can_receive_alerts}
                                onCheckedChange={(checked) => 
                                  handleUpdatePermissions(member, { can_receive_alerts: checked })
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Permissions Summary */}
              <div className="mt-4 flex flex-wrap gap-2">
                {Object.entries(member.permissions)
                  .filter(([_, value]) => value)
                  .map(([key]) => (
                    <Badge key={key} variant="secondary" className="text-xs">
                      <Shield className="h-3 w-3 mr-1" />
                      {key === 'gratitude' ? 'Gratitude' : key}
                    </Badge>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {supportCircle.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Support Circle Members</h3>
              <p className="text-muted-foreground mb-4">
                Add family, friends, or healthcare providers to your support circle to stay connected and accountable.
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Member
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
