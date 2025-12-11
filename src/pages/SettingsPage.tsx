import React from 'react';
import { PageLayout } from '@/components/shared/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Bell, Shield, Palette, Globe, Calendar, HardDrive } from 'lucide-react';
import { CalendarSyncSettings } from '@/components/calendar/CalendarSyncSettings';

export default function SettingsPage() {
  return (
    <PageLayout 
      title="Settings" 
      description="Customize your experience and manage your preferences"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <Switch id="push-notifications" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <Switch id="email-notifications" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="goal-reminders">Goal Reminders</Label>
              <Switch id="goal-reminders" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="celebration-alerts">Achievement Celebrations</Label>
              <Switch id="celebration-alerts" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <Switch id="dark-mode" />
            </div>
            <div className="space-y-2">
              <Label>Theme Color</Label>
              <Select defaultValue="blue">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blue">Blue</SelectItem>
                  <SelectItem value="purple">Purple</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                  <SelectItem value="orange">Orange</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Language & Region
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Language</Label>
              <Select defaultValue="en">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Time Zone</Label>
              <Select defaultValue="Europe/London">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {/* United Kingdom & Ireland */}
                  <SelectItem value="Europe/London">London, UK (GMT/BST)</SelectItem>
                  <SelectItem value="Europe/Dublin">Dublin, Ireland (GMT/IST)</SelectItem>
                  
                  {/* Western Europe */}
                  <SelectItem value="Europe/Paris">Paris, France (CET)</SelectItem>
                  <SelectItem value="Europe/Amsterdam">Amsterdam, Netherlands (CET)</SelectItem>
                  <SelectItem value="Europe/Brussels">Brussels, Belgium (CET)</SelectItem>
                  <SelectItem value="Europe/Madrid">Madrid, Spain (CET)</SelectItem>
                  <SelectItem value="Europe/Lisbon">Lisbon, Portugal (WET)</SelectItem>
                  
                  {/* Central Europe */}
                  <SelectItem value="Europe/Berlin">Berlin, Germany (CET)</SelectItem>
                  <SelectItem value="Europe/Rome">Rome, Italy (CET)</SelectItem>
                  <SelectItem value="Europe/Vienna">Vienna, Austria (CET)</SelectItem>
                  <SelectItem value="Europe/Warsaw">Warsaw, Poland (CET)</SelectItem>
                  <SelectItem value="Europe/Zurich">Zurich, Switzerland (CET)</SelectItem>
                  
                  {/* Eastern Europe */}
                  <SelectItem value="Europe/Athens">Athens, Greece (EET)</SelectItem>
                  <SelectItem value="Europe/Helsinki">Helsinki, Finland (EET)</SelectItem>
                  <SelectItem value="Europe/Bucharest">Bucharest, Romania (EET)</SelectItem>
                  <SelectItem value="Europe/Stockholm">Stockholm, Sweden (CET)</SelectItem>
                  <SelectItem value="Europe/Oslo">Oslo, Norway (CET)</SelectItem>
                  <SelectItem value="Europe/Copenhagen">Copenhagen, Denmark (CET)</SelectItem>
                  
                  {/* United States */}
                  <SelectItem value="America/New_York">New York (Eastern Time)</SelectItem>
                  <SelectItem value="America/Chicago">Chicago (Central Time)</SelectItem>
                  <SelectItem value="America/Denver">Denver (Mountain Time)</SelectItem>
                  <SelectItem value="America/Los_Angeles">Los Angeles (Pacific Time)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Connected Calendars
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarSyncSettings />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              Storage Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Recording Retention Period</Label>
              <Select defaultValue="30">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days (recommended for active users)</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="30">30 days (default)</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Recordings will be automatically deleted after this period. You'll receive reminders before deletion.
              </p>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-delete">Auto-delete after transcription</Label>
              <Switch id="auto-delete" />
            </div>
            <p className="text-sm text-muted-foreground">
              When enabled, audio files will be deleted automatically once transcribed and actions extracted.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="data-sharing">Allow Data Sharing for Insights</Label>
              <Switch id="data-sharing" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="analytics">Usage Analytics</Label>
              <Switch id="analytics" defaultChecked />
            </div>
            <Button variant="outline" className="w-full">
              Download My Data
            </Button>
            <Button variant="destructive" className="w-full">
              Delete Account
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button>Save Settings</Button>
        </div>
      </div>
    </PageLayout>
  );
}