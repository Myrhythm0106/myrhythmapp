import React, { useState } from 'react';
import { LaunchLayout } from '@/components/launch/LaunchLayout';
import { LaunchCard } from '@/components/launch/LaunchCard';
import { LaunchButton } from '@/components/launch/LaunchButton';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Bell, Shield, Palette, Globe, Calendar, HardDrive, 
  ChevronLeft, Trash2, RefreshCw, CheckCircle2, Loader2, Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCalendarIntegration } from '@/hooks/useCalendarIntegration';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

export default function LaunchSettings() {
  const navigate = useNavigate();
  const [retentionDays, setRetentionDays] = useState('30');
  const [autoDeleteAfterTranscription, setAutoDeleteAfterTranscription] = useState(false);
  
  const {
    integrations,
    isLoading,
    isSyncing,
    connectGoogle,
    connectOutlook,
    syncCalendar,
    disconnectCalendar,
  } = useCalendarIntegration();

  const googleConnected = integrations.some(i => i.provider === 'google');
  const outlookConnected = integrations.some(i => i.provider === 'outlook');

  return (
    <LaunchLayout showHeader={true}>
      <div className="mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 mb-4"
        >
          <ChevronLeft className="h-5 w-5" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Customize your experience</p>
      </div>

      <div className="space-y-4 pb-24">
        {/* Connected Calendars Section */}
        <LaunchCard>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Connected Calendars</h3>
              <p className="text-xs text-gray-500">Sync with Google & Outlook</p>
            </div>
          </div>

          {/* Connected Calendars List */}
          {integrations.length > 0 && (
            <div className="space-y-3 mb-4">
              {integrations.map((integration) => (
                <div
                  key={integration.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      integration.provider === 'google' ? 'bg-red-100' : 'bg-blue-100'
                    }`}>
                      <Calendar className={`h-4 w-4 ${
                        integration.provider === 'google' ? 'text-red-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-900">{integration.account_email}</p>
                      <p className="text-xs text-gray-500">
                        {integration.last_sync
                          ? `Synced ${formatDistanceToNow(new Date(integration.last_sync))} ago`
                          : 'Never synced'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="capitalize text-xs">
                      {integration.provider}
                    </Badge>
                    <button
                      onClick={() => disconnectCalendar(integration.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={() => syncCalendar()}
                disabled={isSyncing}
                className="w-full flex items-center justify-center gap-2 py-2 text-sm text-brand-emerald-600 font-medium"
              >
                {isSyncing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Sync Now
              </button>
            </div>
          )}

          {/* Add Calendar Buttons */}
          <div className="space-y-2">
            <button
              onClick={connectGoogle}
              disabled={isLoading || googleConnected}
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5.5c1.6 0 3.1.5 4.3 1.5l3.3-3.3C17.6 1.8 15 .8 12 .8 7.5.8 3.6 3.3 1.7 7l3.9 3C6.5 7.3 9 5.5 12 5.5z"/>
                  <path fill="#4285F4" d="M23.2 12.3c0-.9-.1-1.8-.2-2.6H12v5h6.3c-.3 1.5-1.1 2.7-2.3 3.5l3.6 2.8c2.1-2 3.6-4.9 3.6-8.7z"/>
                  <path fill="#FBBC05" d="M5.6 14c-.3-.9-.5-1.9-.5-3s.2-2.1.5-3L1.7 5C.6 7.1 0 9.5 0 12s.6 4.9 1.7 7l3.9-3z"/>
                  <path fill="#34A853" d="M12 24c3 0 5.5-1 7.3-2.7l-3.6-2.8c-1 .7-2.3 1-3.7 1-2.9 0-5.5-2-6.4-4.7l-3.9 3c1.9 3.8 5.8 6.2 10.3 6.2z"/>
                </svg>
              </div>
              <span className="flex-1 text-left text-sm font-medium text-gray-900">
                {googleConnected ? 'Google Calendar Connected' : 'Connect Google Calendar'}
              </span>
              {googleConnected && <CheckCircle2 className="h-5 w-5 text-green-500" />}
            </button>

            <button
              onClick={connectOutlook}
              disabled={isLoading || outlookConnected}
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#0078D4" d="M7.88 12.04q0 .45-.11.87-.1.41-.33.74-.22.33-.58.52-.37.2-.87.2t-.85-.2q-.35-.21-.57-.55-.22-.33-.33-.75-.1-.42-.1-.86t.1-.87q.1-.43.34-.76.22-.34.59-.54.36-.2.87-.2t.86.2q.35.21.57.55.22.34.31.77.1.43.1.88zM24 12v9.38q0 .46-.33.8-.33.32-.8.32H7.13q-.46 0-.8-.33-.32-.33-.32-.8V18H1q-.41 0-.7-.3-.3-.29-.3-.7V7q0-.41.3-.7.29-.3.7-.3h6.13V1q0-.46.32-.8.34-.32.8-.32h15.74q.47 0 .8.33.33.34.33.8v2.5l-4.5 2.5L24 8v4z"/>
                </svg>
              </div>
              <span className="flex-1 text-left text-sm font-medium text-gray-900">
                {outlookConnected ? 'Outlook Connected' : 'Connect Outlook'}
              </span>
              {outlookConnected && <CheckCircle2 className="h-5 w-5 text-green-500" />}
            </button>
          </div>
        </LaunchCard>

        {/* Storage Management */}
        <LaunchCard>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <HardDrive className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Storage Management</h3>
              <p className="text-xs text-gray-500">Manage your recordings</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm text-gray-700">Recording Retention</Label>
              <Select value={retentionDays} onValueChange={setRetentionDays}>
                <SelectTrigger className="w-full rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days (recommended)</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                You'll receive reminders before auto-deletion
              </p>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <Label className="text-sm text-gray-900">Auto-delete after transcription</Label>
                <p className="text-xs text-gray-500">Free up space automatically</p>
              </div>
              <Switch 
                checked={autoDeleteAfterTranscription}
                onCheckedChange={setAutoDeleteAfterTranscription}
              />
            </div>
          </div>
        </LaunchCard>

        {/* Language & Region */}
        <LaunchCard>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <Globe className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Language & Region</h3>
              <p className="text-xs text-gray-500">Set your preferences</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm text-gray-700">Language</Label>
              <Select defaultValue="en">
                <SelectTrigger className="w-full rounded-xl">
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
              <Label className="text-sm text-gray-700">Time Zone</Label>
              <Select defaultValue="Europe/London">
                <SelectTrigger className="w-full rounded-xl">
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
          </div>
        </LaunchCard>

        {/* Notifications */}
        <LaunchCard>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Bell className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              <p className="text-xs text-gray-500">Manage your alerts</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <Label className="text-sm text-gray-900">Push Notifications</Label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between py-2">
              <Label className="text-sm text-gray-900">Email Reminders</Label>
              <Switch />
            </div>
            <div className="flex items-center justify-between py-2">
              <Label className="text-sm text-gray-900">Goal Reminders</Label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between py-2">
              <Label className="text-sm text-gray-900">Celebrations</Label>
              <Switch defaultChecked />
            </div>
          </div>
        </LaunchCard>

        {/* Appearance */}
        <LaunchCard>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
              <Palette className="h-5 w-5 text-pink-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Appearance</h3>
              <p className="text-xs text-gray-500">Customize your look</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <Label className="text-sm text-gray-900">Dark Mode</Label>
              <Switch />
            </div>
          </div>
        </LaunchCard>

        {/* Privacy & Security */}
        <LaunchCard>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <Shield className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Privacy & Security</h3>
              <p className="text-xs text-gray-500">Your data settings</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <Label className="text-sm text-gray-900">Usage Analytics</Label>
              <Switch defaultChecked />
            </div>
            <LaunchButton variant="outline" className="w-full">
              Download My Data
            </LaunchButton>
          </div>
        </LaunchCard>
      </div>
    </LaunchLayout>
  );
}
