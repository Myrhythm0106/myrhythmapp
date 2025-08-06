
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Heart, 
  MessageCircle, 
  Calendar,
  TrendingUp,
  Star
} from "lucide-react";

interface ConnectionDashboardProps {
  supportCircleSize: number;
  recentInteractions: number;
  connectionStrength: number;
  mutualBenefitScore: number;
}

export function ConnectionDashboard({ 
  supportCircleSize = 3, 
  recentInteractions = 12,
  connectionStrength = 85,
  mutualBenefitScore = 78
}: ConnectionDashboardProps) {
  
  const connectionMetrics = [
    {
      icon: Users,
      label: "Active Supporters",
      value: supportCircleSize,
      description: "People actively supporting your journey",
      color: "text-blue-600"
    },
    {
      icon: MessageCircle,
      label: "Recent Connections",
      value: recentInteractions,
      description: "Meaningful interactions this month",
      color: "text-green-600"
    },
    {
      icon: Heart,
      label: "Connection Strength",
      value: `${connectionStrength}%`,
      description: "How supported you feel",
      color: "text-red-600"
    },
    {
      icon: Star,
      label: "Mutual Benefit",
      value: `${mutualBenefitScore}%`,
      description: "Value you provide to your circle",
      color: "text-purple-600"
    }
  ];

  const getConnectionMessage = () => {
    if (connectionStrength >= 80) {
      return {
        message: "Your connections are thriving! Your circle feels valued and you're getting great support.",
        color: "text-green-700",
        bgColor: "bg-green-50"
      };
    } else if (connectionStrength >= 60) {
      return {
        message: "Good connections building. Consider reaching out more to strengthen these bonds.",
        color: "text-yellow-700",
        bgColor: "bg-yellow-50"
      };
    } else {
      return {
        message: "Let's work on building stronger connections. Small steps make a big difference.",
        color: "text-blue-700",
        bgColor: "bg-blue-50"
      };
    }
  };

  const connectionStatus = getConnectionMessage();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-purple-600" />
          Connection Strength Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Connection Status */}
        <div className={`p-4 rounded-lg ${connectionStatus.bgColor}`}>
          <div className="flex items-center gap-3 mb-2">
            <Heart className={`h-5 w-5 ${connectionStatus.color}`} />
            <span className={`font-medium ${connectionStatus.color}`}>
              Connection Health
            </span>
          </div>
          <p className={`text-sm ${connectionStatus.color}`}>
            {connectionStatus.message}
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {connectionMetrics.map((metric, index) => (
            <div key={index} className="text-center space-y-2">
              <div className="bg-muted p-3 rounded-full w-fit mx-auto">
                <metric.icon className={`h-5 w-5 ${metric.color}`} />
              </div>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="text-sm font-medium">{metric.label}</div>
              <div className="text-xs text-muted-foreground">
                {metric.description}
              </div>
            </div>
          ))}
        </div>

        {/* Progress Indicators */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Connection Strength</span>
              <span className="font-medium">{connectionStrength}%</span>
            </div>
            <Progress value={connectionStrength} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Mutual Benefit Score</span>
              <span className="font-medium">{mutualBenefitScore}%</span>
            </div>
            <Progress value={mutualBenefitScore} className="h-2" />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="flex-1">
            <MessageCircle className="h-4 w-4 mr-2" />
            Send Update
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Check-in
          </Button>
        </div>

        {/* Connection Insights */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            Connection Insights
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Your progress updates give your family hope and motivation</li>
            <li>• Sharing small wins helps others understand your journey better</li>
            <li>• Your resilience inspires others facing similar challenges</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
