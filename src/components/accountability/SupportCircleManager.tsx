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
import { EmailValidator } from '@/utils/security/emailValidator';
import { toast } from 'sonner';

export function SupportCircleManager() {
  const { supportCircle, addSupportMember, updateMemberPermissions, isLoading } = useAccountabilitySystem();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newMember, setNewMember] = useState({
    member_name: '',
    member_email: '',
    member_phone: '',
    relationship: '',
    role: 'viewer' as SupportCircleMember['role'],
    permissions: {
      mood: false,
      health: false,
      calendar: false,
      goals: false,
      gratitude: false,
    },
    can_send_reminders: false,
    can_receive_alerts: true,
    notification_preferences: {
      email: true,
      sms: false,
    }
  });

  const handleAddMember = async () => {
    // Validation
    if (!newMember.member_name.trim()) {
      toast.error('Please provide a name');
      return;
    }
    
    if (!newMember.relationship) {
      toast.error('Please select a relationship');
      return;
    }

    // Email validation if provided
    if (newMember.member_email && !EmailValidator.isValidEmail(newMember.member_email)) {
      toast.error('Please provide a valid email address (e.g., name@example.com)');
      return;
    }

    // At least email or phone required for contact
    if (!newMember.member_email && !newMember.member_phone) {
      toast.error('Please provide either an email or phone number');
      return;
    }

    setIsSubmitting(true);
    console.log('Adding support member:', {
      name: newMember.member_name,
      email: newMember.member_email,
      relationship: newMember.relationship,
      role: newMember.role
    });

    try {
      const result = await addSupportMember(newMember);
      console.log('Support member added successfully:', result);
      
      // Reset form
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
          gratitude: false,
        },
        can_send_reminders: false,
        can_receive_alerts: true,
        notification_preferences: {
          email: true,
          sms: false,
        }
      });
      setIsAddDialogOpen(false);
      toast.success(`${newMember.member_name} has been added to your support circle!`);
    } catch (error) {
      console.error('Error adding member:', error);
      toast.error('Failed to add support member. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePermissionChange = async (memberId: string, field: string, value: any) => {
    try {
      await updateMemberPermissions(memberId, { [field]: value });
    } catch (error) {
      console.error('Error updating permissions:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Support Circle</h2>
          <p className="text-muted-foreground">
            Manage who can help keep you accountable and supported
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Support Circle Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={newMember.member_name}
                    onChange={(e) => setNewMember({ ...newMember, member_name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="relationship">Relationship *</Label>
                  <Select
                    value={newMember.relationship}
                    onValueChange={(value) => setNewMember({ ...newMember, relationship: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="family">Family Member</SelectItem>
                      <SelectItem value="friend">Friend</SelectItem>
                      <SelectItem value="caregiver">Caregiver</SelectItem>
                      <SelectItem value="healthcare">Healthcare Provider</SelectItem>
                      <SelectItem value="therapist">Therapist</SelectItem>
                      <SelectItem value="social-worker">Social Worker</SelectItem>
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
                    onChange={(e) => setNewMember({ ...newMember, member_email: e.target.value })}
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={newMember.member_phone}
                    onChange={(e) => setNewMember({ ...newMember, member_phone: e.target.value })}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  value={newMember.role}
                  onValueChange={(value) => setNewMember({ ...newMember, role: value as SupportCircleMember['role'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">Viewer</SelectItem>
                    <SelectItem value="supporter">Supporter</SelectItem>
                    <SelectItem value="caregiver">Caregiver</SelectItem>
                    <SelectItem value="medical">Medical Professional</SelectItem>
                    <SelectItem value="colleague">Colleague</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Permissions</Label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(newMember.permissions).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={key}
                        checked={value}
                        onCheckedChange={(checked) => 
                          setNewMember({
                            ...newMember,
                            permissions: { ...newMember.permissions, [key]: !!checked }
                          })
                        }
                      />
                      <Label htmlFor={key} className="capitalize text-sm">
                        {key === 'mood' ? 'Mood & Energy' : key}
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
                      setNewMember({ ...newMember, can_send_reminders: !!checked })
                    }
                  />
                  <Label htmlFor="reminders">Can send reminders</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="alerts"
                    checked={newMember.can_receive_alerts}
                    onCheckedChange={(checked) => 
                      setNewMember({ ...newMember, can_receive_alerts: !!checked })
                    }
                  />
                  <Label htmlFor="alerts">Receive alerts</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddMember} disabled={isSubmitting}>
                  {isSubmitting ? 'Adding...' : 'Add Member'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Support Circle Members */}
      <div className="grid gap-4">
        {isLoading ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading support circle...</p>
              </div>
            </CardContent>
          </Card>
        ) : supportCircle.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No support circle members yet</h3>
                <p className="text-muted-foreground mb-4">
                  Add family, friends, or healthcare providers to your support network
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Member
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          supportCircle.map((member) => (
            <Card key={member.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{member.member_name}</CardTitle>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span className="capitalize">{member.relationship}</span>
                        <Badge variant={member.role === 'medical' ? 'default' : 'secondary'}>
                          {member.role}
                        </Badge>
                      </div>
                    </div>
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
                        <div className="grid grid-cols-2 gap-4">
                          {member.member_email && (
                            <div className="flex items-center space-x-2 text-sm">
                              <Mail className="h-4 w-4" />
                              <span>{member.member_email}</span>
                            </div>
                          )}
                          {member.member_phone && (
                            <div className="flex items-center space-x-2 text-sm">
                              <Phone className="h-4 w-4" />
                              <span>{member.member_phone}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-3">
                          <Label>Permissions</Label>
                          <div className="grid grid-cols-2 gap-3">
                            {Object.entries(member.permissions).map(([key, value]) => (
                              <div key={key} className="flex items-center justify-between">
                                <Label className="capitalize text-sm">
                                  {key === 'mood' ? 'Mood & Energy' : key}
                                </Label>
                                <Switch
                                  checked={value}
                                  onCheckedChange={(checked) => 
                                    handlePermissionChange(member.id, `permissions.${key}`, checked)
                                  }
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <Label>Can send reminders</Label>
                          </div>
                          <Switch
                            checked={member.can_send_reminders}
                            onCheckedChange={(checked) => 
                              handlePermissionChange(member.id, 'can_send_reminders', checked)
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Bell className="h-4 w-4" />
                            <Label>Receive alerts</Label>
                          </div>
                          <Switch
                            checked={member.can_receive_alerts}
                            onCheckedChange={(checked) => 
                              handlePermissionChange(member.id, 'can_receive_alerts', checked)
                            }
                          />
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(member.permissions)
                    .filter(([_, enabled]) => enabled)
                    .map(([permission]) => (
                      <Badge key={permission} variant="outline" className="text-xs">
                        <Shield className="h-3 w-3 mr-1" />
                        {permission === 'mood' ? 'Mood & Energy' : permission}
                      </Badge>
                    ))}
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
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}