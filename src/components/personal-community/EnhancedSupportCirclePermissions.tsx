import React, { useState, useEffect } from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Heart, Activity, Target, Sparkles, Mic } from 'lucide-react';

interface EnhancedSupportCirclePermissionsProps {
  member: any; // Replace with actual type
  onUpdate: (memberId: string, permissions: any) => void; // Replace with actual type
}

export function EnhancedSupportCirclePermissions({ member, onUpdate }: EnhancedSupportCirclePermissionsProps) {
  const [permissions, setPermissions] = useState(member.permissions || {});

  useEffect(() => {
    setPermissions(member.permissions || {});
  }, [member.permissions]);

  const handlePermissionChange = (permissionKey: string, value: boolean) => {
    const updatedPermissions = { ...permissions, [permissionKey]: value };
    setPermissions(updatedPermissions);
    onUpdate(member.id, updatedPermissions);
  };

  const permissionCategories = [
    {
      key: 'calendar',
      label: 'Calendar & Events',
      description: 'View scheduled events, appointments, and calendar entries',
      icon: Calendar,
      color: 'text-blue-600'
    },
    {
      key: 'mood',
      label: 'Mood Tracking',
      description: 'Access mood entries and emotional well-being data',
      icon: Heart,
      color: 'text-pink-600'
    },
    {
      key: 'symptoms',
      label: 'Symptom Tracking',
      description: 'View symptom logs and health tracking information',
      icon: Activity,
      color: 'text-red-600'
    },
    {
      key: 'goals',
      label: 'Goals & Progress',
      description: 'Monitor goal progress and achievement milestones',
      icon: Target,
      color: 'text-green-600'
    },
    {
      key: 'gratitude',
      label: 'Gratitude Journal',
      description: 'Read gratitude entries and positive reflections',
      icon: Sparkles,
      color: 'text-yellow-600'
    },
    {
      key: 'voice_recordings',
      label: 'Voice Recordings',
      description: 'Access voice notes and audio recordings shared with healthcare',
      icon: Mic,
      color: 'text-purple-600'
    }
  ];

  return (
    <Card>
      <CardContent className="space-y-4">
        {permissionCategories.map(category => (
          <div key={category.key} className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <category.icon className={`h-4 w-4 ${category.color}`} />
                <Label htmlFor={`permission-${category.key}`} className="font-medium">
                  {category.label}
                </Label>
              </div>
              <p className="text-sm text-muted-foreground">{category.description}</p>
            </div>
            <Switch
              id={`permission-${category.key}`}
              checked={!!permissions[category.key]}
              onCheckedChange={(value) => handlePermissionChange(category.key, value)}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
