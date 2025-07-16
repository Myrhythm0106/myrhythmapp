
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAccountabilitySystem } from '@/hooks/use-accountability-system';
import { Mail, Plus, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export function SimpleInviteForm() {
  const { addSupportMember } = useAccountabilitySystem();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    relationship: '',
    role: 'viewer' as const,
    permissions: {
      mood: false,
      health: false,
      calendar: false,
      goals: false,
      gratitude: false,
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await addSupportMember({
        member_name: formData.name,
        member_email: formData.email,
        relationship: formData.relationship,
        role: formData.role,
        permissions: formData.permissions,
        can_send_reminders: formData.role === 'supporter' || formData.role === 'caregiver',
        can_receive_alerts: true,
        notification_preferences: {
          email: true,
          sms: false
        }
      });

      setSuccess(true);
      toast.success(`Invitation sent to ${formData.name}!`);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        relationship: '',
        role: 'viewer',
        permissions: {
          mood: false,
          health: false,
          calendar: false,
          goals: false,
          gratitude: false,
        }
      });
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
      
    } catch (error) {
      console.error('Error inviting support member:', error);
      setError('Failed to send invitation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePermissionChange = (permission: keyof typeof formData.permissions, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: checked
      }
    }));
  };

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h3 className="text-lg font-semibold text-green-700">Invitation Sent!</h3>
            <p className="text-sm text-gray-600">
              {formData.name} will receive an email invitation to join your support circle.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Invite Support Circle Member
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter their full name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter their email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="pl-10"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="relationship">Relationship</Label>
            <Input
              id="relationship"
              type="text"
              placeholder="e.g., Family, Friend, Caregiver, Doctor"
              value={formData.relationship}
              onChange={(e) => setFormData(prev => ({ ...prev, relationship: e.target.value }))}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select 
              value={formData.role} 
              onValueChange={(value: any) => setFormData(prev => ({ ...prev, role: value }))}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viewer">Viewer - Can see shared information</SelectItem>
                <SelectItem value="supporter">Supporter - Can send reminders</SelectItem>
                <SelectItem value="caregiver">Caregiver - Full support access</SelectItem>
                <SelectItem value="medical">Medical - Healthcare professional</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>What can they access?</Label>
            <div className="space-y-2">
              {Object.entries({
                mood: 'Mood tracking',
                health: 'Health information',
                calendar: 'Calendar & activities',
                goals: 'Goals & progress',
                gratitude: 'Gratitude entries'
              }).map(([key, label]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={key}
                    checked={formData.permissions[key as keyof typeof formData.permissions]}
                    onCheckedChange={(checked) => 
                      handlePermissionChange(key as keyof typeof formData.permissions, checked as boolean)
                    }
                    disabled={isLoading}
                  />
                  <Label htmlFor={key} className="text-sm">{label}</Label>
                </div>
              ))}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? 'Sending Invitation...' : 'Send Invitation'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
