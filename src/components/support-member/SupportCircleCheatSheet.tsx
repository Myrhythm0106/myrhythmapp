import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, MessageCircle, Calendar, ArrowRight } from 'lucide-react';

interface SupportCircleCheatSheetProps {
  supportedUserName: string;
  onNavigateToActions: () => void;
  onNavigateToMessages: () => void;
}

export function SupportCircleCheatSheet({ 
  supportedUserName, 
  onNavigateToActions, 
  onNavigateToMessages 
}: SupportCircleCheatSheetProps) {
  const quickActions = [
    {
      icon: CheckCircle,
      title: "Check Progress",
      description: `See what ${supportedUserName} accomplished today`,
      action: "View Activities",
      onClick: onNavigateToActions,
      color: "text-emerald-600"
    },
    {
      icon: MessageCircle,
      title: "Send Encouragement", 
      description: "Send a quick message of support",
      action: "Send Message",
      onClick: onNavigateToMessages,
      color: "text-blue-600"
    },
    {
      icon: Calendar,
      title: "Track Activities",
      description: "Know when they have appointments and goals",
      action: "View Calendar",
      onClick: onNavigateToActions,
      color: "text-purple-600"
    }
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">3 Ways You Make a Difference</CardTitle>
        <p className="text-sm text-muted-foreground">
          Your support helps {supportedUserName} stay motivated and on track
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <div key={index} className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full bg-muted ${action.color}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{action.title}</h3>
                    <p className="text-xs text-muted-foreground leading-tight">
                      {action.description}
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={action.onClick}
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-between text-xs"
                >
                  {action.action}
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <h4 className="font-medium text-sm mb-2">💡 Quick Wins (takes &lt; 30 seconds)</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• "Great job completing your therapy session!"</li>
            <li>• "Proud of you for sticking to your routine"</li>
            <li>• "How are you feeling about today's activities?"</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}