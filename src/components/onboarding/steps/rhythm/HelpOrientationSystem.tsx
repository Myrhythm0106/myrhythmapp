import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  HelpCircle, 
  MapPin, 
  ArrowRight, 
  RotateCcw,
  Book,
  MessageCircle,
  Navigation,
  X,
  ChevronRight
} from "lucide-react";

interface HelpOrientationSystemProps {
  currentLocation: string;
  onClose: () => void;
  onNavigateTo: (location: string) => void;
  onStartOver?: () => void;
}

export function HelpOrientationSystem({ 
  currentLocation, 
  onClose, 
  onNavigateTo, 
  onStartOver 
}: HelpOrientationSystemProps) {
  const [showFullHelp, setShowFullHelp] = useState(false);

  const getLocationInfo = () => {
    switch (currentLocation) {
      case 'assessment_complete':
        return {
          title: 'Assessment Complete',
          description: 'You\'ve finished your quick assessment and received your personalized MYRHYTHM profile.',
          currentStep: 'Reviewing your results',
          nextStep: 'Life Operating Model setup',
          helpText: 'This screen shows your assessment results and what happens next in your journey. You can continue to setup or learn more about the approach first.',
          quickActions: [
            { label: 'Start Setup', action: 'setup', icon: ArrowRight },
            { label: 'Learn More', action: 'guide', icon: Book }
          ]
        };
      case 'calendar_setup':
        return {
          title: 'Calendar Integration',
          description: 'Connect your existing calendar to sync your schedule and optimize your daily rhythm.',
          currentStep: 'Setting up calendar sync',
          nextStep: 'Focus timer configuration',
          helpText: 'This step helps us understand your current schedule so we can suggest better timing for focused work and breaks.',
          quickActions: [
            { label: 'Connect Calendar', action: 'connect', icon: ArrowRight },
            { label: 'Skip This Step', action: 'skip', icon: ChevronRight }
          ]
        };
      case 'pomodoro_setup':
        return {
          title: 'Focus Timer Setup',
          description: 'Configure your personalized Pomodoro timer based on your assessment results.',
          currentStep: 'Customizing focus periods',
          nextStep: 'Support circle setup',
          helpText: 'These timer settings are optimized for your specific needs and energy patterns. You can always adjust them later.',
          quickActions: [
            { label: 'Use Settings', action: 'accept', icon: ArrowRight },
            { label: 'Customize', action: 'customize', icon: Navigation }
          ]
        };
      case 'support_setup':
        return {
          title: 'Support Circle',
          description: 'Add family members and healthcare providers for gentle accountability.',
          currentStep: 'Building your support network',
          nextStep: 'Dashboard access',
          helpText: 'Your support circle helps celebrate wins and provides encouragement. You control what information is shared.',
          quickActions: [
            { label: 'Add People', action: 'add', icon: ArrowRight },
            { label: 'Set Up Later', action: 'later', icon: ChevronRight }
          ]
        };
      default:
        return {
          title: 'MYRHYTHM Journey',
          description: 'You\'re building your personalized Life Operating Model.',
          currentStep: 'Setting up your system',
          nextStep: 'Continue building',
          helpText: 'Each step builds on the previous one to create a complete support system for your daily life.',
          quickActions: [
            { label: 'Continue', action: 'continue', icon: ArrowRight }
          ]
        };
    }
  };

  const locationInfo = getLocationInfo();

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'setup':
        onNavigateTo('life_setup');
        break;
      case 'guide':
        onNavigateTo('user_guide');
        break;
      case 'connect':
        onNavigateTo('calendar_connect');
        break;
      case 'skip':
        onNavigateTo('next_step');
        break;
      case 'accept':
        onNavigateTo('accept_settings');
        break;
      case 'customize':
        onNavigateTo('customize_timer');
        break;
      case 'add':
        onNavigateTo('add_support');
        break;
      case 'later':
        onNavigateTo('next_step');
        break;
      default:
        onNavigateTo('continue');
    }
    onClose();
  };

  if (!showFullHelp) {
    return (
      <Card className="fixed bottom-20 right-4 w-80 border-primary/20 bg-primary/5 shadow-lg z-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <HelpCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-foreground mb-1">
                Where am I?
              </h3>
              <p className="text-xs text-muted-foreground mb-2">
                {locationInfo.description}
              </p>
              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setShowFullHelp(true)}
                  className="text-xs"
                >
                  Get Help
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={onClose}
                  className="text-xs p-1"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Where Am I? - Navigation Help
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Location */}
          <div className="bg-primary/10 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="default" className="text-xs">
                Current Location
              </Badge>
              <span className="font-semibold">{locationInfo.title}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {locationInfo.helpText}
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="font-medium text-muted-foreground">Current Step:</span>
                <p>{locationInfo.currentStep}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Next Step:</span>
                <p>{locationInfo.nextStep}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="font-semibold mb-3">What can I do from here?</h3>
            <div className="space-y-2">
              {locationInfo.quickActions.map((action, index) => {
                const ActionIcon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action.action)}
                    className="w-full p-3 text-left border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <ActionIcon className="h-4 w-4 text-primary" />
                      <span className="font-medium">{action.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Journey Overview */}
          <div>
            <h3 className="font-semibold mb-3">Your Complete Journey</h3>
            <div className="space-y-2">
              {[
                { step: 'Assessment', status: 'complete', description: 'Identify your MYRHYTHM profile' },
                { step: 'Life Setup', status: currentLocation === 'assessment_complete' ? 'current' : 'complete', description: 'Build your operating model' },
                { step: 'Daily Practice', status: 'upcoming', description: 'Live your MYRHYTHM daily' },
                { step: 'LEAP Living', status: 'upcoming', description: 'Meaningful, sustainable life' }
              ].map((item, index) => (
                <div key={index} className={`flex items-center gap-3 p-2 rounded ${
                  item.status === 'current' ? 'bg-primary/10' : 
                  item.status === 'complete' ? 'bg-green-50' : 'bg-muted/30'
                }`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    item.status === 'current' ? 'bg-primary text-primary-foreground' :
                    item.status === 'complete' ? 'bg-green-600 text-white' : 'bg-muted text-muted-foreground'
                  }`}>
                    {item.status === 'complete' ? '✓' : index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{item.step}</div>
                    <div className="text-xs text-muted-foreground">{item.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Options */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Need a fresh start?</h3>
            <div className="flex gap-2">
              {onStartOver && (
                <Button 
                  variant="outline" 
                  onClick={() => { onStartOver(); onClose(); }}
                  className="flex-1"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Start Over
                </Button>
              )}
              <Button 
                variant="outline" 
                onClick={() => onNavigateTo('dashboard')}
                className="flex-1"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}