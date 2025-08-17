import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  HelpCircle, 
  MapPin, 
  Navigation, 
  Home, 
  RefreshCw,
  ArrowLeft,
  ArrowRight,
  Compass,
  X
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

interface NeverLostSystemProps {
  className?: string;
}

export function NeverLostSystem({ className }: NeverLostSystemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const getCurrentLocationInfo = () => {
    const path = location.pathname;
    
    const locationMap: Record<string, { title: string; description: string; section: string; nextSteps: string[] }> = {
      '/': {
        title: 'Home Page',
        description: 'Welcome page where you can learn about MyRhythm and sign up',
        section: 'Public Area',
        nextSteps: ['Sign up to get started', 'Read about our features', 'View pricing']
      },
      '/dashboard': {
        title: 'Dashboard',
        description: 'Your personal command center with daily actions, progress, and quick access',
        section: 'Main App',
        nextSteps: ['Complete daily check-in', 'Add gratitude entry', 'Review your goals']
      },
      '/gratitude': {
        title: 'Gratitude Practice',
        description: 'Record what you\'re grateful for and understand why it matters to your brain health',
        section: 'Wellness Tools',
        nextSteps: ['Add new gratitude entry', 'Review your journal', 'Check your patterns']
      },
      '/brain-games': {
        title: 'Brain Training',
        description: 'Cognitive exercises designed to improve memory, attention, and processing speed',
        section: 'Training Center',
        nextSteps: ['Start daily challenge', 'Try a new game type', 'Review your progress']
      },
      '/calendar': {
        title: 'Calendar',
        description: 'View and manage your TBI calendar events and appointments',
        section: 'Organization Tools',
        nextSteps: ['Add new event', 'Review upcoming items', 'Set reminders']
      },
      '/goals': {
        title: 'Goals & Actions',
        description: 'Set meaningful goals and track daily actions toward achieving them',
        section: 'Progress Tracking',
        nextSteps: ['Create new goal', 'Add daily action', 'Check progress']
      },
      '/accountability': {
        title: 'Accountability Hub',
        description: 'Connect with your support circle and manage accountability partnerships',
        section: 'Community',
        nextSteps: ['Invite support member', 'Check in with circle', 'Review alerts']
      },
      '/support': {
        title: 'Help & Support',
        description: 'Get help, access guides, and contact our support team',
        section: 'Help Center',
        nextSteps: ['Search help articles', 'Contact support', 'View user guide']
      },
      '/profile': {
        title: 'Your Profile',
        description: 'Manage your personal information and account settings',
        section: 'Account Management',
        nextSteps: ['Update profile info', 'Change settings', 'View subscription']
      },
      '/analytics': {
        title: 'Analytics & Insights',
        description: 'View detailed analytics about your progress and patterns',
        section: 'Data & Insights',
        nextSteps: ['Review trends', 'Export data', 'Set new targets']
      }
    };

    return locationMap[path] || {
      title: 'Unknown Location',
      description: 'You seem to be in an unknown area of the app',
      section: 'Unknown',
      nextSteps: ['Log In', 'Contact support if needed']
    };
  };

  const quickNavigation = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Gratitude', path: '/gratitude', icon: MapPin },
    { name: 'Brain Games', path: '/brain-games', icon: Navigation },
    { name: 'Support', path: '/support', icon: HelpCircle },
  ];

  const handleStartOver = () => {
    localStorage.clear();
    navigate('/dashboard');
    setIsOpen(false);
  };

  const currentLocation = getCurrentLocationInfo();

  return (
    <>
      {/* Never Lost Button - Always visible */}
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="fixed top-4 right-4 z-40 bg-white/90 backdrop-blur-sm border-blue-200 text-blue-700 hover:bg-blue-50"
      >
        <Compass className="h-4 w-4 mr-2" />
        Where Am I?
      </Button>

      {/* Never Lost Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-3 text-2xl">
                <Compass className="h-8 w-8 text-blue-500" />
                You Are Here
              </DialogTitle>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Current Location */}
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-blue-800">
                    <MapPin className="h-6 w-6" />
                    {currentLocation.title}
                  </CardTitle>
                  <Badge variant="secondary">{currentLocation.section}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-blue-700 mb-4">{currentLocation.description}</p>
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-800">What you can do here:</h4>
                  <ul className="space-y-1">
                    {currentLocation.nextSteps.map((step, index) => (
                      <li key={index} className="text-sm text-blue-600 flex items-center">
                        <div className="w-1 h-1 bg-blue-500 rounded-full mr-2"></div>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Quick Navigation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="h-5 w-5" />
                  Quick Navigation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {quickNavigation.map((item) => (
                    <Button
                      key={item.path}
                      variant={location.pathname === item.path ? "default" : "outline"}
                      className="justify-start h-auto p-3"
                      onClick={() => {
                        navigate(item.path);
                        setIsOpen(false);
                      }}
                    >
                      <item.icon className="h-4 w-4 mr-2" />
                      <div className="text-left">
                        <div className="font-medium">{item.name}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Navigation History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowLeft className="h-5 w-5" />
                  Recent Pages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      window.history.back();
                      setIsOpen(false);
                    }}
                    className="flex-1"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Go Back
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      window.history.forward();
                      setIsOpen(false);
                    }}
                    className="flex-1"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Go Forward
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Options */}
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-orange-800 flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" />
                  Feeling Lost?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-orange-700 text-sm">
                  If you're feeling overwhelmed or can't find what you need, these options can help:
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    onClick={() => {
                      navigate('/dashboard');
                      setIsOpen(false);
                    }}
                    className="flex-1"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Log In
                  </Button>
                  <Button
                    onClick={() => {
                      navigate('/support');
                      setIsOpen(false);
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Get Help
                  </Button>
                </div>
                <Button
                  onClick={handleStartOver}
                  variant="ghost"
                  className="w-full text-orange-700 hover:bg-orange-100"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Start Fresh (Clear All Data)
                </Button>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}