
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Eye, Save, Shield, Activity, Smile, Calendar, Heart, Target } from "lucide-react";
import { useSupportCircle } from "@/hooks/use-support-circle";

interface ExtendedPermissions {
  moodTracking: boolean;
  healthTracking: boolean;
  calendarAccess: boolean;
  gratitudeEntries: boolean;
  goalProgress: boolean;
  emergencyAlerts: boolean;
}

interface ExtendedMember {
  id: string;
  name: string;
  role: string;
  permissions: ExtendedPermissions;
}

export function EnhancedSupportCirclePermissions() {
  const { members: basicMembers, updateMemberPermissions } = useSupportCircle();
  
  // Extended members with additional permissions
  const [members, setMembers] = useState<ExtendedMember[]>(
    basicMembers.map(member => ({
      ...member,
      role: member.name.includes('Dr.') ? 'Healthcare Provider' : 
            member.name === 'Mom' || member.name === 'Dad' ? 'Family' : 'Friend',
      permissions: {
        moodTracking: member.permissions.moodTracking,
        healthTracking: member.permissions.healthTracking,
        calendarAccess: false,
        gratitudeEntries: false,
        goalProgress: false,
        emergencyAlerts: member.name.includes('Dr.') || member.name === 'Mom'
      }
    }))
  );

  const handlePermissionChange = (
    memberId: string, 
    permission: keyof ExtendedPermissions, 
    value: boolean
  ) => {
    setMembers(prev => 
      prev.map(member => 
        member.id === memberId 
          ? { 
              ...member, 
              permissions: { 
                ...member.permissions, 
                [permission]: value 
              } 
            } 
          : member
      )
    );
  };

  const savePermissions = () => {
    // Update basic permissions in the hook
    members.forEach(member => {
      updateMemberPermissions(member.id, {
        moodTracking: member.permissions.moodTracking,
        healthTracking: member.permissions.healthTracking
      });
    });

    // In a real app, save extended permissions to database
    localStorage.setItem('extendedSupportPermissions', JSON.stringify(members));
    
    toast.success("Access permissions updated successfully", {
      description: "Your support circle members' access levels have been updated."
    });
  };

  const getPermissionIcon = (permission: keyof ExtendedPermissions) => {
    const icons = {
      moodTracking: <Smile className="h-4 w-4" />,
      healthTracking: <Activity className="h-4 w-4" />,
      calendarAccess: <Calendar className="h-4 w-4" />,
      gratitudeEntries: <Heart className="h-4 w-4" />,
      goalProgress: <Target className="h-4 w-4" />,
      emergencyAlerts: <Shield className="h-4 w-4" />
    };
    return icons[permission];
  };

  const getPermissionLabel = (permission: keyof ExtendedPermissions) => {
    const labels = {
      moodTracking: "Mood Tracking",
      healthTracking: "Health Tracking", 
      calendarAccess: "Calendar & Events",
      gratitudeEntries: "Gratitude Journal",
      goalProgress: "Goals & Progress",
      emergencyAlerts: "Emergency Alerts"
    };
    return labels[permission];
  };

  const getPermissionDescription = (permission: keyof ExtendedPermissions) => {
    const descriptions = {
      moodTracking: "View mood history, trends, and insights",
      healthTracking: "Access health metrics, symptoms, and medical tracking",
      calendarAccess: "See scheduled appointments, events, and reminders",
      gratitudeEntries: "Read gratitude journal entries and practice history",
      goalProgress: "Monitor goal achievements and progress updates",
      emergencyAlerts: "Receive notifications during health emergencies"
    };
    return descriptions[permission];
  };

  const getRoleColor = (role: string) => {
    const colors = {
      'Healthcare Provider': 'bg-blue-100 text-blue-700 border-blue-200',
      'Family': 'bg-green-100 text-green-700 border-green-200',
      'Friend': 'bg-purple-100 text-purple-700 border-purple-200'
    };
    return colors[role] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-primary" />
          Support Circle Access Control
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-6">
          <p className="text-sm text-muted-foreground">
            Control exactly what information each member of your support circle can access. 
            All access is <strong>read-only</strong> and designed to help them better support you.
          </p>
          <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 p-2 rounded">
            <Shield className="h-3 w-3" />
            <span>Your privacy is protected. Members can only see what you explicitly allow.</span>
          </div>
        </div>

        <div className="space-y-6">
          {members.map((member) => (
            <Card key={member.id} className="border-l-4 border-l-primary/20">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-medium text-lg">{member.name}</h3>
                    <Badge 
                      variant="outline" 
                      className={`mt-1 ${getRoleColor(member.role)}`}
                    >
                      {member.role}
                    </Badge>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    {Object.values(member.permissions).filter(Boolean).length} of {Object.keys(member.permissions).length} permissions granted
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="grid gap-4 md:grid-cols-2">
                  {(Object.keys(member.permissions) as Array<keyof ExtendedPermissions>).map((permission) => (
                    <div key={permission} className="flex items-start justify-between space-x-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getPermissionIcon(permission)}
                          <Label 
                            htmlFor={`${permission}-${member.id}`} 
                            className="font-medium cursor-pointer"
                          >
                            {getPermissionLabel(permission)}
                          </Label>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {getPermissionDescription(permission)}
                        </p>
                      </div>
                      <Switch 
                        id={`${permission}-${member.id}`}
                        checked={member.permissions[permission]}
                        onCheckedChange={(checked) => 
                          handlePermissionChange(member.id, permission, checked)
                        }
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator className="my-6" />
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Changes will take effect immediately after saving
          </div>
          <Button onClick={savePermissions} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save All Permissions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
