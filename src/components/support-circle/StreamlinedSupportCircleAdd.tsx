import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { 
  UserPlus, 
  Shield, 
  CheckCircle,
  Users,
  Stethoscope,
  Home,
  Briefcase,
  Heart
} from 'lucide-react';
import { useAccountabilitySystem, SupportCircleMember } from '@/hooks/use-accountability-system';

interface StreamlinedSupportCircleAddProps {
  onAdd?: () => void;
  onCancel?: () => void;
}

const roleOptions = [
  { value: 'family', label: 'Family Member', icon: Home, description: 'Spouse, parent, child, or close relative', dbRole: 'supporter' as const },
  { value: 'caregiver', label: 'Caregiver', icon: Heart, description: 'Professional or family caregiver', dbRole: 'caregiver' as const },
  { value: 'medical', label: 'Medical Professional', icon: Stethoscope, description: 'Doctor, therapist, or healthcare provider', dbRole: 'medical' as const },
  { value: 'friend', label: 'Close Friend', icon: Users, description: 'Trusted friend or peer supporter', dbRole: 'supporter' as const },
  { value: 'colleague', label: 'Work Colleague', icon: Briefcase, description: 'Workplace support or supervisor', dbRole: 'viewer' as const },
];

export function StreamlinedSupportCircleAdd({ onAdd, onCancel }: StreamlinedSupportCircleAddProps) {
  const { addSupportMember } = useAccountabilitySystem();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [notes, setNotes] = useState('');
  const [permissions, setPermissions] = useState({
    viewProgress: false,
    receiveUpdates: false,
    emergencyContact: false,
    viewCalendar: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-suggest permissions based on role
  const handleRoleChange = (selectedRole: string) => {
    setRole(selectedRole);
    
    // Smart permission defaults based on role
    switch (selectedRole) {
      case 'family':
        setPermissions({
          viewProgress: true,
          receiveUpdates: true,
          emergencyContact: true,
          viewCalendar: true,
        });
        break;
      case 'caregiver':
        setPermissions({
          viewProgress: true,
          receiveUpdates: true,
          emergencyContact: true,
          viewCalendar: true,
        });
        break;
      case 'medical':
        setPermissions({
          viewProgress: true,
          receiveUpdates: false,
          emergencyContact: false,
          viewCalendar: false,
        });
        break;
      case 'friend':
        setPermissions({
          viewProgress: false,
          receiveUpdates: true,
          emergencyContact: false,
          viewCalendar: false,
        });
        break;
      case 'colleague':
        setPermissions({
          viewProgress: false,
          receiveUpdates: false,
          emergencyContact: false,
          viewCalendar: false,
        });
        break;
      default:
        setPermissions({
          viewProgress: false,
          receiveUpdates: false,
          emergencyContact: false,
          viewCalendar: false,
        });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }
    
    if (!email.trim()) {
      toast.error('Email address is required');
      return;
    }
    
    if (!role) {
      toast.error('Please select a role');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      // Get the database role from the selected role option
      const selectedRoleOption = roleOptions.find(r => r.value === role);
      const dbRole = selectedRoleOption?.dbRole || 'viewer';

      // Call the real database function
      await addSupportMember({
        member_name: name.trim(),
        member_email: email.trim(),
        relationship: role,
        role: dbRole,
        permissions: {
          mood: permissions.viewProgress,
          health: permissions.viewProgress,
          calendar: permissions.viewCalendar,
          goals: permissions.viewProgress,
          gratitude: false,
        },
        can_send_reminders: false,
        can_receive_alerts: permissions.receiveUpdates,
        notification_preferences: {
          email: true,
          sms: false,
        }
      });
      
      toast.success(`Invitation sent to ${email}! They'll receive an email with instructions to join your support circle.`);
      
      // Reset form
      setName('');
      setEmail('');
      setRole('');
      setNotes('');
      setPermissions({
        viewProgress: false,
        receiveUpdates: false,
        emergencyContact: false,
        viewCalendar: false,
      });
      
      // Call onAdd callback to notify parent
      if (onAdd) {
        onAdd();
      }
      
    } catch (error: any) {
      console.error('Failed to add support member:', error);
      toast.error(error.message || 'Failed to send invitation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedRoleInfo = roleOptions.find(option => option.value === role);

  return (
    <Card className="premium-card border-0 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-memory-emerald-500 to-memory-emerald-600 rounded-xl flex items-center justify-center">
            <UserPlus className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-brain-health-900">
              Add Support Circle Member
            </CardTitle>
            <p className="text-sm text-brain-health-600 mt-1">
              Invite someone who cares about your journey
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name - Required */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold text-brain-health-900 flex items-center gap-2">
              <span className="w-2 h-2 bg-memory-emerald-500 rounded-full"></span>
              Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter their name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
              required
            />
          </div>

          {/* Email - Required */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold text-brain-health-900 flex items-center gap-2">
              <span className="w-2 h-2 bg-memory-emerald-500 rounded-full"></span>
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter their email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              required
            />
          </div>

          {/* Role - Required */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-brain-health-900 flex items-center gap-2">
              <span className="w-2 h-2 bg-clarity-teal-500 rounded-full"></span>
              Relationship Role
            </Label>
            <Select value={role} onValueChange={handleRoleChange} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select their role in your support circle" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4 text-brain-health-600" />
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-xs text-muted-foreground">{option.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            
            {selectedRoleInfo && (
              <div className="p-3 bg-brain-health-50 rounded-lg border border-brain-health-200">
                <div className="flex items-center gap-2 mb-1">
                  <selectedRoleInfo.icon className="h-4 w-4 text-brain-health-600" />
                  <span className="text-sm font-medium text-brain-health-900">{selectedRoleInfo.label}</span>
                </div>
                <p className="text-xs text-brain-health-600">{selectedRoleInfo.description}</p>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-semibold text-brain-health-900 flex items-center gap-2">
              <span className="w-2 h-2 bg-beacon-500 rounded-full"></span>
              Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Add any special notes about how they support you..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          {/* Permissions */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-brain-health-900 flex items-center gap-2">
              <Shield className="h-4 w-4 text-brain-health-600" />
              Permissions
            </Label>
            <p className="text-xs text-brain-health-600">
              Control what this person can see and do. Defaults are set based on their role, but you can customize.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'viewProgress', label: 'View Progress Reports', description: 'See your daily/weekly summaries' },
                { key: 'receiveUpdates', label: 'Receive Updates', description: 'Get notified about milestones' },
                { key: 'emergencyContact', label: 'Emergency Contact', description: 'Contact in urgent situations' },
                { key: 'viewCalendar', label: 'View Calendar', description: 'See your schedule and activities' },
              ].map((permission) => (
                <div key={permission.key} className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-brain-health-200/50">
                  <Checkbox
                    id={permission.key}
                    checked={permissions[permission.key as keyof typeof permissions]}
                    onCheckedChange={(checked) =>
                      setPermissions(prev => ({
                        ...prev,
                        [permission.key]: checked as boolean
                      }))
                    }
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor={permission.key}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {permission.label}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {permission.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || !name.trim() || !email.trim() || !role}
              className="premium-button flex-1"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending Invitation...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Send Invitation
                </>
              )}
            </Button>
            
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>

          {/* Success Message */}
          <div className="p-4 bg-gradient-to-r from-memory-emerald-50 to-clarity-teal-50 rounded-lg border border-memory-emerald-200">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-memory-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-memory-emerald-900 mb-1">
                  Brain-Injury Friendly Process
                </p>
                <p className="text-xs text-memory-emerald-700">
                  Once invited, they'll receive clear instructions and can start supporting you immediately. 
                  You can always adjust permissions later.
                </p>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}