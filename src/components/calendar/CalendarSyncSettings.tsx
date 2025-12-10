import React from 'react';
import { useCalendarIntegration } from '@/hooks/useCalendarIntegration';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RefreshCw, Plus, Trash2, Calendar, Loader2, CheckCircle2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function CalendarSyncSettings() {
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
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Calendar Sync</h3>
        <p className="text-sm text-muted-foreground">
          Connect your calendars to see all your events in one place
        </p>
      </div>

      {/* Connected Calendars */}
      {integrations.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Connected Calendars
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {integrations.map((integration) => (
              <div
                key={integration.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
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
                    <p className="font-medium text-sm">{integration.account_email}</p>
                    <p className="text-xs text-muted-foreground">
                      {integration.last_sync
                        ? `Synced ${formatDistanceToNow(new Date(integration.last_sync))} ago`
                        : 'Never synced'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="capitalize">
                    {integration.provider}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => disconnectCalendar(integration.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            <Button
              onClick={() => syncCalendar()}
              disabled={isSyncing}
              variant="outline"
              className="w-full mt-2"
            >
              {isSyncing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Sync Now
            </Button>
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* Add Calendar */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Calendar
          </CardTitle>
          <CardDescription>
            Connect external calendars to import events
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Google Calendar */}
          <Button
            onClick={connectGoogle}
            disabled={isLoading || googleConnected}
            variant="outline"
            className="w-full justify-start"
          >
            <div className="w-6 h-6 mr-3 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5.5c1.6 0 3.1.5 4.3 1.5l3.3-3.3C17.6 1.8 15 .8 12 .8 7.5.8 3.6 3.3 1.7 7l3.9 3C6.5 7.3 9 5.5 12 5.5z"/>
                <path fill="#4285F4" d="M23.2 12.3c0-.9-.1-1.8-.2-2.6H12v5h6.3c-.3 1.5-1.1 2.7-2.3 3.5l3.6 2.8c2.1-2 3.6-4.9 3.6-8.7z"/>
                <path fill="#FBBC05" d="M5.6 14c-.3-.9-.5-1.9-.5-3s.2-2.1.5-3L1.7 5C.6 7.1 0 9.5 0 12s.6 4.9 1.7 7l3.9-3z"/>
                <path fill="#34A853" d="M12 24c3 0 5.5-1 7.3-2.7l-3.6-2.8c-1 .7-2.3 1-3.7 1-2.9 0-5.5-2-6.4-4.7l-3.9 3c1.9 3.8 5.8 6.2 10.3 6.2z"/>
              </svg>
            </div>
            {googleConnected ? 'Google Calendar Connected' : 'Connect Google Calendar'}
            {googleConnected && <CheckCircle2 className="h-4 w-4 ml-auto text-green-500" />}
          </Button>

          {/* Outlook Calendar */}
          <Button
            onClick={connectOutlook}
            disabled={isLoading || outlookConnected}
            variant="outline"
            className="w-full justify-start"
          >
            <div className="w-6 h-6 mr-3 rounded-full bg-blue-100 flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#0078D4" d="M7.88 12.04q0 .45-.11.87-.1.41-.33.74-.22.33-.58.52-.37.2-.87.2t-.85-.2q-.35-.21-.57-.55-.22-.33-.33-.75-.1-.42-.1-.86t.1-.87q.1-.43.34-.76.22-.34.59-.54.36-.2.87-.2t.86.2q.35.21.57.55.22.34.31.77.1.43.1.88zM24 12v9.38q0 .46-.33.8-.33.32-.8.32H7.13q-.46 0-.8-.33-.32-.33-.32-.8V18H1q-.41 0-.7-.3-.3-.29-.3-.7V7q0-.41.3-.7.29-.3.7-.3h6.13V1q0-.46.32-.8.34-.32.8-.32h15.74q.47 0 .8.33.33.34.33.8v2.5l-4.5 2.5L24 8v4zM7.13 12.5v4.5h4.5v-4.5h-4.5zM6 8.25V6h-.13L2 8.75v.75h4.13V8.25zM7.88 7.75q-.36-.15-.79-.23-.44-.1-.99-.1-1.23 0-2.18.58-.95.56-1.49 1.52-.54.96-.54 2.14 0 1.2.52 2.14.52.94 1.44 1.48.92.55 2.09.55.63 0 1.14-.1.52-.08.88-.26v-1.86q-.43.26-.91.4-.49.14-1 .14-.68 0-1.19-.21-.52-.2-.85-.61-.33-.41-.5-.96t-.17-1.21q0-.65.16-1.2.16-.57.48-.99.31-.43.76-.67.46-.24 1.05-.24.47 0 .87.11.39.1.72.32v-1.74zM21 16.5V12h-3v4.5h3zm0-5.5V8h-3v3h3zm0-4V4.5h-3V7h3zM10.5 16.5h3V12h-3v4.5zm3-5.5V8h-3v3h3z"/>
              </svg>
            </div>
            {outlookConnected ? 'Outlook Connected' : 'Connect Outlook'}
            {outlookConnected && <CheckCircle2 className="h-4 w-4 ml-auto text-green-500" />}
          </Button>
        </CardContent>
      </Card>

      {integrations.length === 0 && !isLoading && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No calendars connected yet. Connect one above to get started.
        </p>
      )}
    </div>
  );
}
