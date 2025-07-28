import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Check, ChevronRight, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CalendarProvider {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

interface CalendarIntegrationWizardProps {
  onComplete: (provider: string) => void;
  tier?: "free" | "smart";
}

export const CalendarIntegrationWizard = ({ onComplete, tier = "free" }: CalendarIntegrationWizardProps) => {
  const [step, setStep] = useState(1);
  const [selectedProvider, setSelectedProvider] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const providers: CalendarProvider[] = [
    {
      id: "google",
      name: "Google Calendar",
      description: "Sync with Gmail and Google Workspace",
      icon: "🌐",
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100"
    },
    {
      id: "outlook",
      name: "Microsoft Outlook",
      description: "Connect to Outlook and Office 365",
      icon: "📧",
      color: "bg-orange-50 border-orange-200 hover:bg-orange-100"
    },
    {
      id: "apple",
      name: "Apple Calendar",
      description: "Sync with iCloud and Apple devices",
      icon: "🍎",
      color: "bg-gray-50 border-gray-200 hover:bg-gray-100"
    }
  ];

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId);
    setStep(2);
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    
    // Simulate OAuth flow
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setStep(3);
    setIsConnecting(false);
    
    toast({
      title: "Calendar Connected!",
      description: `Successfully connected to ${providers.find(p => p.id === selectedProvider)?.name}`,
    });
  };

  const handleComplete = () => {
    onComplete(selectedProvider);
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <Calendar className="h-12 w-12 mx-auto text-primary" />
        <h3 className="text-lg font-semibold">Choose Your Calendar</h3>
        <p className="text-sm text-muted-foreground">
          Select your preferred calendar provider for seamless integration
        </p>
      </div>
      
      <div className="space-y-3">
        {providers.map((provider) => (
          <Card
            key={provider.id}
            className={`cursor-pointer transition-all ${provider.color}`}
            onClick={() => handleProviderSelect(provider.id)}
          >
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{provider.icon}</span>
                <div>
                  <p className="font-medium">{provider.name}</p>
                  <p className="text-sm text-muted-foreground">{provider.description}</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => {
    const provider = providers.find(p => p.id === selectedProvider);
    return (
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <Globe className="h-12 w-12 mx-auto text-primary" />
          <h3 className="text-lg font-semibold">Connect to {provider?.name}</h3>
          <p className="text-sm text-muted-foreground">
            You'll be redirected to {provider?.name} to authorize access
          </p>
        </div>

        <Card className="border-dashed">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Read calendar events</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Create new events</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Update existing events</span>
              </div>
              {tier === "smart" && (
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">AI scheduling optimization</span>
                  <Badge variant="secondary" className="text-xs">Smart</Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
            Back
          </Button>
          <Button onClick={handleConnect} disabled={isConnecting} className="flex-1">
            {isConnecting ? "Connecting..." : "Connect Calendar"}
          </Button>
        </div>
      </div>
    );
  };

  const renderStep3 = () => {
    const provider = providers.find(p => p.id === selectedProvider);
    return (
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <div className="h-12 w-12 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold">Successfully Connected!</h3>
          <p className="text-sm text-muted-foreground">
            Your {provider?.name} is now synced with MyRhythm
          </p>
        </div>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-green-800">
                🎉 Calendar integration active
              </p>
              <p className="text-xs text-green-700">
                Events will sync automatically every 15 minutes
              </p>
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleComplete} className="w-full">
          Start Using Calendar Integration
        </Button>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Calendar Integration</CardTitle>
          <Badge variant="outline">{step}/3</Badge>
        </div>
        <CardDescription>
          3-step seamless calendar connection
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </CardContent>
    </Card>
  );
};