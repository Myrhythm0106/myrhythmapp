
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, Moon, Sun, Bell, Volume2 } from "lucide-react";

interface PersonalProfileStepProps {
  onComplete: (data: any) => void;
  assessmentResult: any;
}

export function PersonalProfileStep({ onComplete, assessmentResult }: PersonalProfileStepProps) {
  const [preferences, setPreferences] = useState({
    rhythmType: "morning",
    notificationStyle: "gentle",
    accessibilityNeeds: [] as string[],
    energyPattern: "steady",
    preferredReminderTime: "30"
  });

  const handleAccessibilityToggle = (need: string, checked: boolean) => {
    setPreferences(prev => ({
      ...prev,
      accessibilityNeeds: checked 
        ? [...prev.accessibilityNeeds, need]
        : prev.accessibilityNeeds.filter(n => n !== need)
    }));
  };

  const handleContinue = () => {
    onComplete(preferences);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sun className="h-5 w-5" />
          Personal Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rhythm Type */}
        <div className="space-y-3">
          <Label className="text-base font-medium">When do you feel most alert and productive?</Label>
          <RadioGroup value={preferences.rhythmType} onValueChange={(value) => setPreferences(prev => ({ ...prev, rhythmType: value }))}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="morning" id="morning" />
              <Label htmlFor="morning" className="flex items-center gap-2">
                <Sun className="h-4 w-4" />
                Morning person - I'm most alert in the early hours
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="evening" id="evening" />
              <Label htmlFor="evening" className="flex items-center gap-2">
                <Moon className="h-4 w-4" />
                Evening person - I'm most alert later in the day
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="varies" id="varies" />
              <Label htmlFor="varies">It varies day to day</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Notification Style */}
        <div className="space-y-3">
          <Label className="text-base font-medium">How would you prefer to receive reminders?</Label>
          <RadioGroup value={preferences.notificationStyle} onValueChange={(value) => setPreferences(prev => ({ ...prev, notificationStyle: value }))}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="gentle" id="gentle" />
              <Label htmlFor="gentle" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Gentle - Soft notifications and subtle reminders
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="direct" id="direct" />
              <Label htmlFor="direct" className="flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                Direct - Clear, direct notifications when needed
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="minimal" id="minimal" />
              <Label htmlFor="minimal">Minimal - Only essential notifications</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Accessibility Needs */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Do any of these accessibility features help you? (Select all that apply)</Label>
          <div className="space-y-2">
            {[
              { id: "largeText", label: "Larger text size" },
              { id: "highContrast", label: "High contrast colors" },
              { id: "voiceReminders", label: "Voice reminders" },
              { id: "simplifiedNavigation", label: "Simplified navigation" },
              { id: "extraTime", label: "Extra time for interactions" }
            ].map((item) => (
              <div key={item.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={item.id}
                  checked={preferences.accessibilityNeeds.includes(item.id)}
                  onCheckedChange={(checked) => handleAccessibilityToggle(item.id, checked as boolean)}
                />
                <Label htmlFor={item.id}>{item.label}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Reminder Timing */}
        <div className="space-y-3">
          <Label htmlFor="reminderTime" className="text-base font-medium">
            How far in advance would you like appointment reminders?
          </Label>
          <RadioGroup value={preferences.preferredReminderTime} onValueChange={(value) => setPreferences(prev => ({ ...prev, preferredReminderTime: value }))}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="15" id="15min" />
              <Label htmlFor="15min">15 minutes before</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="30" id="30min" />
              <Label htmlFor="30min">30 minutes before</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="60" id="60min" />
              <Label htmlFor="60min">1 hour before</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1440" id="1day" />
              <Label htmlFor="1day">1 day before</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="pt-4 border-t">
          <Button onClick={handleContinue} className="w-full">
            Continue to Calendar Setup
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
