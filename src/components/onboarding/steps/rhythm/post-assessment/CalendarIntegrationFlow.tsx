import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Plus, Check } from "lucide-react";
import { UserType } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface CalendarIntegrationFlowProps {
  userType: UserType;
  assessmentResult: any;
  onComplete: (data: any) => void;
}

export function CalendarIntegrationFlow({ userType, assessmentResult, onComplete }: CalendarIntegrationFlowProps) {
  const { user } = useAuth();
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connected' | 'syncing'>('disconnected');

  useEffect(() => {
    checkExistingConnection();
  }, [user]);

  const checkExistingConnection = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('calendar_integrations')
      .select('id, provider, last_sync')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .maybeSingle();
    
    if (data) {
      setConnectionStatus('connected');
      setSelectedIntegrations([data.provider]);
    }
  };

  const integrationOptions = [
    {
      id: 'google',
      name: 'Google Calendar',
      description: 'Sync with your Google Calendar',
      icon: '📅',
      popular: true
    },
    {
      id: 'outlook',
      name: 'Microsoft Outlook',
      description: 'Connect to Outlook Calendar',
      icon: '📧',
      popular: true
    },
    {
      id: 'apple',
      name: 'Apple Calendar',
      description: 'Sync with iCloud Calendar',
      icon: '🍎',
      popular: false
    },
    {
      id: 'manual',
      name: 'Manual Entry',
      description: 'Add events manually',
      icon: '✏️',
      popular: false
    }
  ];

  const handleIntegrationToggle = (integrationId: string) => {
    setSelectedIntegrations(prev => 
      prev.includes(integrationId)
        ? prev.filter(id => id !== integrationId)
        : [...prev, integrationId]
    );
  };

  const handleConnect = async () => {
    if (!selectedIntegrations.includes('google')) {
      toast.error("Please select Google Calendar");
      return;
    }
    
    if (!user) {
      toast.error("Please sign in to connect calendar");
      return;
    }
    
    setIsConnecting(true);
    
    try {
      // Get OAuth URL from edge function
      const { data, error } = await supabase.functions.invoke('calendar-google-auth', {
        body: { user_id: user.id }
      });
      
      if (error) throw error;
      
      // Open OAuth popup
      const width = 600;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      const authWindow = window.open(
        data.authUrl,
        'Google Calendar Authorization',
        `width=${width},height=${height},left=${left},top=${top}`
      );
      
      // Poll for connection success
      const checkConnection = setInterval(async () => {
        try {
          const { data: integration } = await supabase
            .from('calendar_integrations')
            .select('id, provider, is_active')
            .eq('user_id', user.id)
            .eq('provider', 'google')
            .eq('is_active', true)
            .maybeSingle();
          
          if (integration) {
            clearInterval(checkConnection);
            if (authWindow && !authWindow.closed) {
              authWindow.close();
            }
            
            setConnectionStatus('connected');
            toast.success("Google Calendar connected! 🎉");
            
            // Trigger initial sync
            await supabase.functions.invoke('calendar-google-sync');
            
            setIsConnecting(false);
            onComplete({
              selectedIntegrations: ['google'],
              connectedAt: new Date().toISOString(),
              integrationId: integration.id,
              userType,
              assessmentResult
            });
          }
        } catch (error) {
          // Still waiting for connection
        }
      }, 2000);
      
      // Timeout after 5 minutes
      setTimeout(() => {
        clearInterval(checkConnection);
        setIsConnecting(false);
        if (authWindow && !authWindow.closed) {
          authWindow.close();
        }
        toast.error("Connection timed out. Please try again.");
      }, 5 * 60 * 1000);
      
    } catch (error) {
      console.error('OAuth error:', error);
      toast.error("Failed to connect calendar");
      setIsConnecting(false);
    }
  };

  const handleSkip = () => {
    onComplete({ 
      selectedIntegrations: [], 
      skipped: true,
      userType,
      assessmentResult
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          Connect Your Calendar
        </CardTitle>
        <p className="text-muted-foreground">
          Sync your existing calendar to automatically populate your schedule and optimize your daily rhythm.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          {integrationOptions.map((option) => (
            <div
              key={option.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedIntegrations.includes(option.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleIntegrationToggle(option.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{option.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{option.name}</h3>
                      {option.popular && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                </div>
                {selectedIntegrations.includes(option.id) && (
                  <Check className="h-5 w-5 text-blue-600" />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Smart Schedule Optimization</h4>
              <p className="text-sm text-blue-800 mt-1">
                Based on your assessment results, we'll suggest optimal times for tasks, breaks, and activities 
                that align with your natural rhythm and energy patterns.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleSkip}
            className="flex-1"
            disabled={isConnecting}
          >
            Skip for Now
          </Button>
          <Button
            onClick={handleConnect}
            className="flex-1"
            disabled={selectedIntegrations.length === 0 || isConnecting}
          >
            {isConnecting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Connecting...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Connect Selected
              </>
            )}
          </Button>
        </div>

        {selectedIntegrations.length > 0 && (
          <div className="text-center text-sm text-muted-foreground">
            {selectedIntegrations.length} integration{selectedIntegrations.length > 1 ? 's' : ''} selected
          </div>
        )}
      </CardContent>
    </Card>
  );
}
