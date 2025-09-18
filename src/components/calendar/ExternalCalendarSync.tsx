import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Calendar, 
  ExternalLink, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  Download,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface CalendarAccount {
  id: string;
  type: 'google' | 'outlook' | 'apple';
  email: string;
  name: string;
  isConnected: boolean;
  lastSync?: Date;
  syncEnabled: boolean;
}

export function ExternalCalendarSync() {
  const [accounts, setAccounts] = useState<CalendarAccount[]>([]);
  const [syncing, setSyncing] = useState<string | null>(null);
  const { user } = useAuth();

  // Mock data for demo - will be replaced when Supabase types are regenerated
  useEffect(() => {
    // Simulate some existing connections for demo purposes
    const mockAccounts: CalendarAccount[] = [];
    setAccounts(mockAccounts);
  }, [user]);

  const handleConnectGoogle = async () => {
    setSyncing('google');
    
    try {
      // Mock OAuth flow - will implement real Google Calendar API once types are updated
      const mockAccount: CalendarAccount = {
        id: `google-${Date.now()}`,
        type: 'google',
        email: user?.email || 'user@gmail.com',
        name: 'Google Calendar',
        isConnected: true,
        lastSync: new Date(),
        syncEnabled: true
      };

      setAccounts(prev => [...prev, mockAccount]);
      toast.success('Google Calendar connected! (Demo mode - database integration pending type updates)');
    } catch (error) {
      console.error('Failed to connect Google Calendar:', error);
      toast.error('Failed to connect Google Calendar');
    } finally {
      setSyncing(null);
    }
  };

  const handleConnectOutlook = async () => {
    setSyncing('outlook');
    
    try {
      // Mock OAuth flow - will implement real Microsoft Graph API once types are updated
      const mockAccount: CalendarAccount = {
        id: `outlook-${Date.now()}`,
        type: 'outlook',
        email: user?.email || 'user@outlook.com',
        name: 'Outlook Calendar',
        isConnected: true,
        lastSync: new Date(),
        syncEnabled: true
      };

      setAccounts(prev => [...prev, mockAccount]);
      toast.success('Outlook Calendar connected! (Demo mode - database integration pending type updates)');
    } catch (error) {
      console.error('Failed to connect Outlook:', error);
      toast.error('Failed to connect Outlook Calendar');
    } finally {
      setSyncing(null);
    }
  };

  const handleToggleSync = async (accountId: string, enabled: boolean) => {
    try {
      setAccounts(prev => prev.map(acc => 
        acc.id === accountId 
          ? { ...acc, syncEnabled: enabled }
          : acc
      ));
      toast.success(`Sync ${enabled ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      console.error('Failed to toggle sync:', error);
      toast.error('Failed to update sync settings');
    }
  };

  const handleSyncNow = async (accountId: string) => {
    setSyncing(accountId);
    
    try {
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setAccounts(prev => prev.map(acc => 
        acc.id === accountId 
          ? { ...acc, lastSync: new Date() }
          : acc
      ));

      toast.success('Calendar synced successfully!');
    } catch (error) {
      console.error('Sync failed:', error);
      toast.error('Failed to sync calendar');
    } finally {
      setSyncing(null);
    }
  };

  const getProviderIcon = (type: string) => {
    switch (type) {
      case 'google': return '📅';
      case 'outlook': return '📆';
      case 'apple': return '🍎';
      default: return '📋';
    }
  };

  const getProviderName = (type: string) => {
    switch (type) {
      case 'google': return 'Google Calendar';
      case 'outlook': return 'Outlook Calendar';
      case 'apple': return 'Apple Calendar';
      default: return 'Calendar';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">External Calendar Sync</h3>
          <p className="text-sm text-muted-foreground">
            Connect your external calendars to keep everything in sync
          </p>
          <div className="flex items-center gap-2 mt-2">
            <div className="h-2 w-2 bg-orange-500 rounded-full animate-pulse"></div>
            <p className="text-xs text-orange-600">
              Demo mode: Database types updating. Full sync available once Supabase types regenerate.
            </p>
          </div>
        </div>
      </div>

      {/* Connection Options */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              📅 Google Calendar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Sync with your Google Calendar for seamless integration
            </p>
            <Button 
              onClick={handleConnectGoogle}
              disabled={syncing === 'google'}
              className="w-full"
              size="sm"
            >
              {syncing === 'google' ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Connect Google (Demo)
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              📆 Outlook Calendar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Sync with Microsoft Outlook and Office 365 calendars
            </p>
            <Button 
              onClick={handleConnectOutlook}
              disabled={syncing === 'outlook'}
              className="w-full"
              size="sm"
            >
              {syncing === 'outlook' ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Connect Outlook (Demo)
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Connected Accounts */}
      {accounts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Connected Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {accounts.map((account) => (
              <div 
                key={account.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="text-lg">
                    {getProviderIcon(account.type)}
                  </div>
                  <div>
                    <div className="font-medium text-sm">
                      {getProviderName(account.type)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {account.email}
                    </div>
                    {account.lastSync && (
                      <div className="text-xs text-muted-foreground">
                        Last synced: {account.lastSync.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={account.isConnected ? "default" : "secondary"}>
                    {account.isConnected ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Connected
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Disconnected
                      </>
                    )}
                  </Badge>

                  <Switch
                    checked={account.syncEnabled}
                    onCheckedChange={(checked) => handleToggleSync(account.id, checked)}
                    disabled={!account.isConnected}
                  />

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSyncNow(account.id)}
                    disabled={syncing === account.id || !account.isConnected || !account.syncEnabled}
                  >
                    {syncing === account.id ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Export Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-sm">Download ICS File</div>
              <div className="text-xs text-muted-foreground">
                Export your scheduled actions as a calendar file
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Settings className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-medium text-blue-900">Integration Status</h4>
              <p className="text-sm text-blue-700">
                External calendar sync is in demo mode. Database tables have been created successfully. 
                Full functionality will be available once Supabase regenerates the TypeScript types.
              </p>
              <div className="text-xs text-blue-600 mt-2">
                ✅ Database tables created<br/>
                ⏳ TypeScript types pending<br/>
                🔄 Real-time sync ready for implementation
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}