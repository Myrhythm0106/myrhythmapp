
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface PrivacySettingsProps {
  onSave?: () => void;
}

export function PrivacySettings({ onSave }: PrivacySettingsProps) {
  const [shareProgressWithContacts, setShareProgressWithContacts] = React.useState(false);
  const [allowCommunityInteraction, setAllowCommunityInteraction] = React.useState(true);
  const [shareAnonymousData, setShareAnonymousData] = React.useState(true);
  const [enableLocationServices, setEnableLocationServices] = React.useState(false);
  const [allowDataAnalytics, setAllowDataAnalytics] = React.useState(true);

  const handleSave = () => {
    toast.success("Privacy settings saved successfully");
    console.log({
      shareProgressWithContacts,
      allowCommunityInteraction,
      shareAnonymousData,
      enableLocationServices,
      allowDataAnalytics,
    });
    if (onSave) {
      onSave();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Data Sharing</CardTitle>
          <CardDescription>Control how your information is shared</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="share-progress" className="font-medium">Share Progress with Emergency Contacts</Label>
              <p className="text-sm text-muted-foreground">Allow emergency contacts to view your daily progress</p>
            </div>
            <Switch 
              id="share-progress" 
              checked={shareProgressWithContacts} 
              onCheckedChange={setShareProgressWithContacts} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="community-interaction" className="font-medium">Community Interaction</Label>
              <p className="text-sm text-muted-foreground">Participate in community features and discussions</p>
            </div>
            <Switch 
              id="community-interaction" 
              checked={allowCommunityInteraction} 
              onCheckedChange={setAllowCommunityInteraction} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="anonymous-data" className="font-medium">Anonymous Data Sharing</Label>
              <p className="text-sm text-muted-foreground">Help improve MyRhythm by sharing anonymous usage data</p>
            </div>
            <Switch 
              id="anonymous-data" 
              checked={shareAnonymousData} 
              onCheckedChange={setShareAnonymousData} 
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>App Permissions</CardTitle>
          <CardDescription>Manage app permissions and data collection</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="location-services" className="font-medium">Location Services</Label>
              <p className="text-sm text-muted-foreground">Allow location access for location-based reminders</p>
            </div>
            <Switch 
              id="location-services" 
              checked={enableLocationServices} 
              onCheckedChange={setEnableLocationServices} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="data-analytics" className="font-medium">Data Analytics</Label>
              <p className="text-sm text-muted-foreground">Allow collection of app usage analytics</p>
            </div>
            <Switch 
              id="data-analytics" 
              checked={allowDataAnalytics} 
              onCheckedChange={setAllowDataAnalytics} 
            />
          </div>
        </CardContent>
      </Card>
      
      <Button onClick={handleSave}>Save Privacy Settings</Button>
    </div>
  );
}
