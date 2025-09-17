import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Mail, 
  User, 
  Phone, 
  FileText,
  Shield,
  Check,
  Plus,
  X
} from 'lucide-react';
import { toast } from 'sonner';

interface ShareWithCareTeamProps {
  assessmentData: any;
  userType?: string;
  onClose: () => void;
  onShare?: (data: any) => void;
}

interface CareTeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  relationship: string;
}

export function ShareWithCareTeam({ assessmentData, userType, onClose, onShare }: ShareWithCareTeamProps) {
  const [careTeamMembers, setCareTeamMembers] = useState<CareTeamMember[]>([]);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: 'family',
    phone: '',
    relationship: ''
  });
  const [shareOptions, setShareOptions] = useState({
    includeFullResults: true,
    includeRecommendations: true,
    includeCognitiveProfile: false,
    includeProjections: false,
    includeOptimalTiming: true,
    allowFutureUpdates: true
  });
  const [personalMessage, setPersonalMessage] = useState('');
  const [isSharing, setIsSharing] = useState(false);

  const roleOptions = [
    { value: 'family', label: 'Family Member', icon: '👨‍👩‍👧‍👦' },
    { value: 'caregiver', label: 'Caregiver', icon: '🤝' },
    { value: 'doctor', label: 'Doctor', icon: '👨‍⚕️' },
    { value: 'therapist', label: 'Therapist', icon: '🧠' },
    { value: 'nurse', label: 'Nurse', icon: '👩‍⚕️' },
    { value: 'social_worker', label: 'Social Worker', icon: '🏥' }
  ];

  const addMember = () => {
    if (!newMember.name || !newMember.email) {
      toast.error('Please fill in name and email');
      return;
    }

    const member: CareTeamMember = {
      id: Date.now().toString(),
      ...newMember
    };

    setCareTeamMembers([...careTeamMembers, member]);
    setNewMember({
      name: '',
      email: '',
      role: 'family',
      phone: '',
      relationship: ''
    });
  };

  const removeMember = (id: string) => {
    setCareTeamMembers(careTeamMembers.filter(member => member.id !== id));
  };

  const handleShare = async () => {
    if (careTeamMembers.length === 0) {
      toast.error('Please add at least one care team member');
      return;
    }

    setIsSharing(true);
    
    try {
      const shareData = {
        assessmentData: {
          ...assessmentData,
          sharedAt: new Date().toISOString(),
          sharedBy: userType || 'user'
        },
        careTeamMembers,
        shareOptions,
        personalMessage,
        privacyLevel: 'care-team'
      };

      // Simulate API call to share with care team
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (onShare) {
        onShare(shareData);
      }

      toast.success(`Assessment shared with ${careTeamMembers.length} care team members`);
      onClose();
    } catch (error) {
      toast.error('Failed to share assessment');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-brain-health-500" />
            Share Assessment with Care Team
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Privacy Notice */}
          <div className="p-4 bg-brain-health-50/50 rounded-lg border border-brain-health-200">
            <div className="flex items-start space-x-2">
              <Shield className="h-5 w-5 text-brain-health-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-brain-health-700">Privacy & Security</h4>
                <p className="text-sm text-brain-health-600 mt-1">
                  Your assessment data will be securely shared with selected care team members only. 
                  You can revoke access at any time from your dashboard.
                </p>
              </div>
            </div>
          </div>

          {/* Add Care Team Members */}
          <div>
            <Label className="text-base font-medium mb-3 block">Care Team Members</Label>
            
            {/* Existing Members */}
            {careTeamMembers.length > 0 && (
              <div className="space-y-2 mb-4">
                {careTeamMembers.map((member) => {
                  const roleInfo = roleOptions.find(r => r.value === member.role);
                  return (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-white border border-brain-health-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="text-lg">{roleInfo?.icon}</div>
                        <div>
                          <p className="font-medium text-brain-health-800">{member.name}</p>
                          <p className="text-sm text-brain-health-600">{member.email}</p>
                          <Badge variant="outline" className="text-xs mt-1">
                            {roleInfo?.label}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMember(member.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Add New Member Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div>
                <Label htmlFor="name" className="text-sm">Name</Label>
                <Input
                  id="name"
                  placeholder="Full name"
                  value={newMember.name}
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={newMember.email}
                  onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="role" className="text-sm">Role</Label>
                <select
                  id="role"
                  className="w-full p-2 border border-input rounded-md bg-background"
                  value={newMember.role}
                  onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                >
                  {roleOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.icon} {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="relationship" className="text-sm">Relationship</Label>
                <Input
                  id="relationship"
                  placeholder="e.g., Spouse, Primary Doctor"
                  value={newMember.relationship}
                  onChange={(e) => setNewMember({...newMember, relationship: e.target.value})}
                />
              </div>
            </div>

            <Button onClick={addMember} variant="outline" className="w-full mb-4">
              <Plus className="h-4 w-4 mr-2" />
              Add Care Team Member
            </Button>
          </div>

          {/* Share Options */}
          <div>
            <Label className="text-base font-medium mb-3 block">What to Share</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fullResults"
                  checked={shareOptions.includeFullResults}
                  onCheckedChange={(checked) => 
                    setShareOptions({...shareOptions, includeFullResults: !!checked})
                  }
                />
                <Label htmlFor="fullResults" className="text-sm">Assessment Results & Scores</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="recommendations"
                  checked={shareOptions.includeRecommendations}
                  onCheckedChange={(checked) => 
                    setShareOptions({...shareOptions, includeRecommendations: !!checked})
                  }
                />
                <Label htmlFor="recommendations" className="text-sm">Personalized Recommendations</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="timing"
                  checked={shareOptions.includeOptimalTiming}
                  onCheckedChange={(checked) => 
                    setShareOptions({...shareOptions, includeOptimalTiming: !!checked})
                  }
                />
                <Label htmlFor="timing" className="text-sm">Optimal Scheduling Times</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="updates"
                  checked={shareOptions.allowFutureUpdates}
                  onCheckedChange={(checked) => 
                    setShareOptions({...shareOptions, allowFutureUpdates: !!checked})
                  }
                />
                <Label htmlFor="updates" className="text-sm">Allow Future Progress Updates</Label>
              </div>
            </div>
          </div>

          {/* Personal Message */}
          <div>
            <Label htmlFor="message" className="text-base font-medium mb-2 block">
              Personal Message (Optional)
            </Label>
            <Textarea
              id="message"
              placeholder="Add a personal note for your care team..."
              value={personalMessage}
              onChange={(e) => setPersonalMessage(e.target.value)}
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleShare} 
              disabled={isSharing || careTeamMembers.length === 0}
              className="flex-1 bg-gradient-to-r from-brain-health-500 to-memory-emerald-500 text-white"
            >
              {isSharing ? (
                'Sharing...'
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Share Assessment
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
