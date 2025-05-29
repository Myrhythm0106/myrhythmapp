
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface NotificationSettingsProps {
  onSave?: () => void;
}

export function NotificationSettings({ onSave }: NotificationSettingsProps) {
  const [appointmentReminders, setAppointmentReminders] = React.useState(true);
  const [medicationReminders, setMedicationReminders] = React.useState(true);
  const [symptomTracking, setSymptomTracking] = React.useState(true);
  const [communityActivity, setCommunityActivity] = React.useState(false);
  const [appUpdates, setAppUpdates] = React.useState(true);

  const handleSave = () => {
    toast.success("Notification settings saved");
    console.log({
      appointmentReminders,
      medicationReminders,
      symptomTracking,
      communityActivity,
      appUpdates,
    });
    if (onSave) {
      onSave();
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="appointment-reminders" className="font-medium">Appointment Reminders</Label>
            <p className="text-sm text-muted-foreground">Receive notifications for upcoming appointments</p>
          </div>
          <Switch 
            id="appointment-reminders" 
            checked={appointmentReminders} 
            onCheckedChange={setAppointmentReminders} 
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="medication-reminders" className="font-medium">Medication Reminders</Label>
            <p className="text-sm text-muted-foreground">Receive reminders to take prescribed medications</p>
          </div>
          <Switch 
            id="medication-reminders" 
            checked={medicationReminders} 
            onCheckedChange={setMedicationReminders} 
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="symptom-tracking" className="font-medium">Symptom Tracking</Label>
            <p className="text-sm text-muted-foreground">Receive reminders to log your daily symptoms</p>
          </div>
          <Switch 
            id="symptom-tracking" 
            checked={symptomTracking} 
            onCheckedChange={setSymptomTracking} 
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="community-activity" className="font-medium">Community Activity</Label>
            <p className="text-sm text-muted-foreground">Receive notifications about comments and posts in the community</p>
          </div>
          <Switch 
            id="community-activity" 
            checked={communityActivity} 
            onCheckedChange={setCommunityActivity} 
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="app-updates" className="font-medium">App Updates</Label>
            <p className="text-sm text-muted-foreground">Receive notifications about new features and updates</p>
          </div>
          <Switch 
            id="app-updates" 
            checked={appUpdates} 
            onCheckedChange={setAppUpdates} 
          />
        </div>
      </div>
      
      <Button onClick={handleSave}>Save Notification Settings</Button>
    </div>
  );
}
