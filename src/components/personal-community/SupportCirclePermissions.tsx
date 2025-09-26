
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Eye, Save } from "lucide-react";

interface Member {
  id: string;
  name: string;
  permissions: {
    moodTracking: boolean;
    healthTracking: boolean;
    actions: boolean;
  };
}

export function SupportCirclePermissions() {
  // This would come from a database in a real app
  const [members, setMembers] = useState<Member[]>([
    { 
      id: "1", 
      name: "Sarah Johnson", 
      permissions: { moodTracking: false, healthTracking: false, actions: false }
    },
    { 
      id: "2", 
      name: "Michael Smith", 
      permissions: { moodTracking: true, healthTracking: false, actions: true }
    },
    { 
      id: "3", 
      name: "Dr. Smith", 
      permissions: { moodTracking: true, healthTracking: true, actions: false }
    },
    { 
      id: "4", 
      name: "Mom", 
      permissions: { moodTracking: false, healthTracking: false, actions: true }
    },
  ]);

  const handlePermissionChange = (memberId: string, permission: 'moodTracking' | 'healthTracking' | 'actions', value: boolean) => {
    setMembers(members.map(member => 
      member.id === memberId 
        ? { 
            ...member, 
            permissions: { 
              ...member.permissions, 
              [permission]: value 
            } 
          } 
        : member
    ));
  };

  const savePermissions = () => {
    // In a real app, this would save to a database
    toast.success("Permissions updated successfully", {
      description: "Your support circle members' access has been updated."
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-primary" />
          Support Circle Access Permissions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-6">
          Control which members of your support circle can view your health and mood tracking data.
          Members will only have read-only access to the data you choose to share.
        </p>

        <div className="space-y-6">
          {members.map((member) => (
            <div key={member.id} className="border rounded-lg p-4">
              <h3 className="font-medium text-lg mb-3">{member.name}</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor={`mood-${member.id}`} className="font-medium">Mood Tracking</Label>
                    <p className="text-sm text-muted-foreground">
                      Access to view your mood history and insights
                    </p>
                  </div>
                  <Switch 
                    id={`mood-${member.id}`}
                    checked={member.permissions.moodTracking}
                    onCheckedChange={(checked) => 
                      handlePermissionChange(member.id, 'moodTracking', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor={`health-${member.id}`} className="font-medium">Health Tracking</Label>
                    <p className="text-sm text-muted-foreground">
                      Access to view your health metrics and history
                    </p>
                  </div>
                  <Switch 
                    id={`health-${member.id}`}
                    checked={member.permissions.healthTracking}
                    onCheckedChange={(checked) => 
                      handlePermissionChange(member.id, 'healthTracking', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor={`actions-${member.id}`} className="font-medium">Next Steps & Actions</Label>
                    <p className="text-sm text-muted-foreground">
                      Full access to view and help with action items from recordings
                    </p>
                  </div>
                  <Switch 
                    id={`actions-${member.id}`}
                    checked={member.permissions.actions}
                    onCheckedChange={(checked) => 
                      handlePermissionChange(member.id, 'actions', checked)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={savePermissions} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Permissions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
