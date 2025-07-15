import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Plus, Check } from "lucide-react";
import { UserType } from "@/types/user";

interface CalendarIntegrationFlowProps {
  userType: UserType;
  assessmentResult: any;
  onComplete: (data: any) => void;
}

export function CalendarIntegrationFlow({ userType, assessmentResult, onComplete }: CalendarIntegrationFlowProps) {
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);

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
    setIsConnecting(true);
    
    // Simulate connection process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const integrationData = {
      selectedIntegrations,
      connectedAt: new Date().toISOString(),
      userType,
      assessmentResult
    };
    
    setIsConnecting(false);
    onComplete(integrationData);
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
