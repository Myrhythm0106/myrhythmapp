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
import { supabase } from '@/integrations/supabase/client';

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

  // Load connected accounts on mount
  useEffect(() => {
    // Mock data for now - will be replaced when types are updated
    const mockAccounts: CalendarAccount[] = [
      // Will load from database once types are available
    ];
    setAccounts(mockAccounts);
  }, [user]);

  const handleConnectGoogle = async () => {
    setSyncing('google');
    
    try {
      // Mock OAuth flow for now - will implement real Google Calendar API later
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
      toast.success('Google Calendar connected successfully! (Demo mode)');
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
      // Mock OAuth flow for now - will implement real Microsoft Graph API later
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
      toast.success('Outlook Calendar connected successfully! (Demo mode)');
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
                  Connect Google
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
                  Connect Outlook
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
    </div>
  );
}