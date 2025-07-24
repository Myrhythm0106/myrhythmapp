import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Play, 
  Clock, 
  X,
  Brain,
  Heart,
  Target,
  Users,
  Settings,
  BarChart3
} from "lucide-react";

interface UserGuideIntegrationProps {
  showOnMount?: boolean;
  onClose?: () => void;
}

export function UserGuideIntegration({ showOnMount = false, onClose }: UserGuideIntegrationProps) {
  const [isOpen, setIsOpen] = useState(showOnMount);
  const [hasSeenGuide, setHasSeenGuide] = useState(false);

  useEffect(() => {
    // Check if user has seen the guide before
    const seen = localStorage.getItem('myrhythm-user-guide-seen');
    setHasSeenGuide(!!seen);
    
    // Show guide automatically for new users
    if (showOnMount && !seen) {
      setIsOpen(true);
    }
  }, [showOnMount]);

  const handleViewNow = () => {
    localStorage.setItem('myrhythm-user-guide-seen', 'true');
    setHasSeenGuide(true);
    // Navigate to user guide or open interactive guide
    window.open('/user-guide', '_blank');
    handleClose();
  };

  const handleViewLater = () => {
    localStorage.setItem('myrhythm-user-guide-remind-later', 'true');
    handleClose();
  };

  const handleSkip = () => {
    localStorage.setItem('myrhythm-user-guide-seen', 'true');
    setHasSeenGuide(true);
    handleClose();
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  const guideFeatures = [
    {
      icon: Brain,
      title: "Brain Health Tracking",
      description: "Monitor cognitive function and memory health",
      time: "3 min"
    },
    {
      icon: Heart,
      title: "Gratitude Practice",
      description: "Build positive neural pathways through gratitude",
      time: "2 min"
    },
    {
      icon: Target,
      title: "Goal Setting & Actions",
      description: "Create and track meaningful daily actions",
      time: "4 min"
    },
    {
      icon: Users,
      title: "Support Circle",
      description: "Connect with family and accountability partners",
      time: "5 min"
    },
    {
      icon: BarChart3,
      title: "Progress Analytics",
      description: "Understand your patterns and improvements",
      time: "3 min"
    },
    {
      icon: Settings,
      title: "Personalization",
      description: "Customize your experience and preferences",
      time: "2 min"
    }
  ];

  return (
    <>
      {/* Welcome Dialog for New Users */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-3 text-2xl">
                <BookOpen className="h-8 w-8 text-blue-500" />
                Welcome to MyRhythm!
              </DialogTitle>
              <Button variant="ghost" size="sm" onClick={handleClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <Brain className="h-6 w-6" />
                  Your Brain Health Journey Starts Here
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-700 mb-4">
                  MyRhythm is designed to support your cognitive health and memory through science-backed practices. 
                  Our interactive user guide will show you how to get the most out of every feature.
                </p>
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Clock className="h-4 w-4" />
                  <span>Complete walkthrough: ~20 minutes</span>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">What You'll Learn:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {guideFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg bg-white">
                    <feature.icon className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{feature.title}</h4>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {feature.time}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Play className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">Interactive & Personal</span>
              </div>
              <p className="text-green-700 text-sm">
                Our guide adapts to your needs and shows you exactly where everything is. 
                You can pause, replay, or skip sections as needed.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={handleViewNow}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                View Guide Now
              </Button>
              <Button variant="outline" onClick={handleViewLater} className="flex-1">
                <Clock className="mr-2 h-4 w-4" />
                Remind Me Later
              </Button>
              <Button variant="ghost" onClick={handleSkip} className="flex-1">
                Skip for Now
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              You can always access the user guide from the help menu or support section.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quick Access Guide Link */}
      {!isOpen && (
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOpen(true)}
            className="text-sm text-muted-foreground hover:text-foreground border-border/50 hover:border-border"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            View User Guide
          </Button>
        </div>
      )}
    </>
  );
}