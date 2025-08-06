import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useSupportCircle } from '@/hooks/use-support-circle';
import { 
  Users, 
  Plus, 
  Settings, 
  Mail, 
  Phone, 
  Heart, 
  Shield, 
  AlertCircle,
  CheckCircle,
  Clock,
  Calendar,
  Brain,
  MessageSquare,
  Trash2,
  Edit,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';

interface PermissionCategory {
  key: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export function SupportCircleManager() {
  const { members, updateMemberPermissions, addMessage } = useSupportCircle();
  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    relationship: '',
    role: 'family'
  });

  const permissionCategories: PermissionCategory[] = [
    {
      key: 'calendar',
      label: 'Calendar Access',
      description: 'View scheduled actions and appointments',
      icon: <Calendar className="w-4 h-4" />,
      color: 'text-blue-600'
    },
    {
      key: 'mood_tracking',
      label: 'Mood & Wellness',
      description: 'See mood patterns and wellness data',
      icon: <Heart className="w-4 h-4" />,
      color: 'text-red-600'
    },
    {
      key: 'pact_reports',
      label: 'PACT Reports',
      description: 'Access promise and commitment reports',
      icon: <Brain className="w-4 h-4" />,
      color: 'text-purple-600'
    },
    {
      key: 'alerts',
      label: 'Progress Alerts',
      description: 'Receive notifications about commitments',
      icon: <AlertCircle className="w-4 h-4" />,
      color: 'text-orange-600'
    },
    {
      key: 'messaging',
      label: 'Direct Messaging',
      description: 'Send and receive support messages',
      icon: <MessageSquare className="w-4 h-4" />,
      color: 'text-green-600'
    },
    {
      key: 'emergency',
      label: 'Emergency Contact',
      description: 'Receive urgent alerts and emergency notifications',
      icon: <Shield className="w-4 h-4" />,
      color: 'text-red-700'
    }
  ];

  const handleAddMember = () => {
    if (!newMember.name.trim() || !newMember.email.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Simulate adding member (would integrate with actual backend)
    toast.success(`Invitation sent to ${newMember.email}`);
    setShowAddMember(false);
    setNewMember({ name: '', email: '', relationship: '', role: 'family' });
  };

  const handlePermissionUpdate = (memberId: string, permissionKey: string, value: boolean) => {
    updateMemberPermissions(memberId, { [permissionKey]: value });
    toast.success('Permissions updated');
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'medical': return <Shield className="w-4 h-4" />;
      case 'family': return <Heart className="w-4 h-4" />;
      case 'friend': return <Users className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'medical': return 'text-red-600 bg-red-50';
      case 'family': return 'text-blue-600 bg-blue-50';
      case 'friend': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getOnlineStatus = (member: any) => {
    // Simulate online status
    return Math.random() > 0.5 ? 'online' : 'offline';
  };

  const isOnline = (member: any) => getOnlineStatus(member) === 'online';

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-purple-500/40 bg-gradient-to-br from-purple-500/10 via-blue/5 to-indigo/10 shadow-glow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-3xl">
              <Users className="w-8 h-8 text-purple-500" />
              <span className="bg-gradient-to-r from-purple-500 to-blue-600 bg-clip-text text-transparent">
                Support Circle Management
              </span>
            </CardTitle>
            
            <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite Support Circle Member</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newMember.name}
                      onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Full name..."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newMember.email}
                      onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="email@example.com"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="relationship">Relationship</Label>
                    <Input
                      id="relationship"
                      value={newMember.relationship}
                      onChange={(e) => setNewMember(prev => ({ ...prev, relationship: e.target.value }))}
                      placeholder="e.g., Spouse, Doctor, Friend..."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select value={newMember.role} onValueChange={(value) => setNewMember(prev => ({ ...prev, role: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="family">Family</SelectItem>
                        <SelectItem value="medical">Medical Professional</SelectItem>
                        <SelectItem value="friend">Friend</SelectItem>
                        <SelectItem value="caregiver">Caregiver</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowAddMember(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddMember}>
                      Send Invitation
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <p className="text-lg text-muted-foreground">
            👥 Manage your trusted support network | Set permissions and accountability preferences
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <div className="text-3xl font-bold text-purple-500">{members.length}</div>
              <div className="text-sm text-muted-foreground">Total Members</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="text-3xl font-bold text-green-500">
                {members.filter(m => isOnline(m)).length}
              </div>
              <div className="text-sm text-muted-foreground">Online Now</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="text-3xl font-bold text-blue-500">
                {members.filter(m => Object.values(m.permissions || {}).some(Boolean)).length}
              </div>
              <div className="text-sm text-muted-foreground">Can View Data</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <div className="text-3xl font-bold text-orange-500">
                {members.filter(m => m.permissions?.moodTracking || m.permissions?.healthTracking).length}
              </div>
              <div className="text-sm text-muted-foreground">Health Access</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Members List */}
      <div className="space-y-4">
        {members.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12">
              <div className="text-center">
                <Users className="h-16 w-16 mx-auto mb-4 text-purple-500/50" />
                <h3 className="text-lg font-semibold mb-2">No Support Circle Members Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Invite family, friends, or healthcare providers to join your support network
                </p>
                <Button 
                  onClick={() => setShowAddMember(true)}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Member
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          members.map((member) => (
            <Card key={member.id} className="border border-purple-500/20 hover:border-purple-500/40 transition-colors">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Member Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                            {member.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                          getOnlineStatus(member) === 'online' ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-lg">{member.name}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getRoleColor('family')}>
                            {getRoleIcon('family')}
                            <span className="ml-1">Family Member</span>
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Last active: {getOnlineStatus(member) === 'online' ? 'Now' : '2 hours ago'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Permissions Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                    {permissionCategories.map((category) => (
                      <div key={category.key} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={category.color}>
                            {category.icon}
                          </div>
                          <div>
                            <div className="text-sm font-medium">{category.label}</div>
                            <div className="text-xs text-muted-foreground">
                              {category.description}
                            </div>
                          </div>
                        </div>
                        <Switch
                          checked={member.permissions?.[category.key] || false}
                          onCheckedChange={(checked) => handlePermissionUpdate(member.id, category.key, checked)}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Quick Stats */}
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      Can view {Object.values(member.permissions || {}).filter(Boolean).length} areas
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Member since Dec 2024
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Trusted contact
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Permission Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-500" />
            Permission Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Recommended for Family:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Calendar Access (appointments & commitments)</li>
                <li>• PACT Reports (promise tracking)</li>
                <li>• Progress Alerts (accountability)</li>
                <li>• Direct Messaging (support communication)</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Recommended for Medical:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Mood & Wellness (health patterns)</li>
                <li>• Emergency Contact (urgent alerts)</li>
                <li>• Calendar Access (medical appointments)</li>
                <li>• Progress Alerts (health commitments)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}