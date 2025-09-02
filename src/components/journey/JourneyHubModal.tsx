import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  Compass, 
  BookOpen, 
  Map, 
  Clock,
  Target,
  Brain,
  Heart,
  Sparkles,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { useDashboard } from "@/contexts/DashboardContext";

interface JourneyHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const journeyOptions = [
  {
    id: 'guided',
    title: 'Guided Experience',
    description: 'Step-by-step journey with personalized support',
    longDescription: 'Perfect for those who want structured guidance through their recovery journey with daily check-ins and milestone tracking.',
    icon: Compass,
    color: 'brain-health',
    gradient: 'from-brain-health-500 to-clarity-teal-500',
    bgGradient: 'from-brain-health-50 to-clarity-teal-50',
    features: ['Daily guidance', 'Progress tracking', 'Milestone celebrations', 'Support circle integration'],
    route: '/guided-journey',
    storageKey: 'guided'
  },
  {
    id: 'discovery',
    title: 'Discovery Mode',
    description: 'Self-directed exploration of features and tools',
    longDescription: 'Ideal for independent explorers who want to discover features at their own pace and create their unique path.',
    icon: Map,
    color: 'memory-emerald',
    gradient: 'from-memory-emerald-500 to-brain-health-500',
    bgGradient: 'from-memory-emerald-50 to-brain-health-50',
    features: ['Self-paced learning', 'Feature exploration', 'Personalized dashboard', 'Flexible approach'],
    route: '/dashboard',
    storageKey: 'discovery'
  },
  {
    id: 'howto',
    title: 'How-to Guide',
    description: 'Interactive tutorials and feature walkthroughs',
    longDescription: 'Comprehensive tutorials that help you master each feature of MyRhythm with hands-on practice.',
    icon: BookOpen,
    color: 'clarity-teal',
    gradient: 'from-clarity-teal-500 to-beacon-500',
    bgGradient: 'from-clarity-teal-50 to-beacon-50',
    features: ['Interactive tutorials', 'Feature walkthroughs', 'Practice exercises', 'Quick reference'],
    route: '/help-getting-started',
    storageKey: 'tutorial'
  },
  {
    id: 'timeline',
    title: 'View MyRhythm Timeline',
    description: 'See your journey unfold over time',
    longDescription: 'Visualize your progress, memories, and milestones in a beautiful timeline that tells your recovery story.',
    icon: Clock,
    color: 'sunrise-amber',
    gradient: 'from-sunrise-amber-500 to-memory-emerald-500',
    bgGradient: 'from-sunrise-amber-50 to-memory-emerald-50',
    features: ['Visual timeline', 'Memory highlights', 'Progress visualization', 'Milestone markers'],
    route: '/timeline',
    storageKey: 'timeline'
  }
];

export function JourneyHubModal({ isOpen, onClose }: JourneyHubModalProps) {
  const navigate = useNavigate();
  const { setInteractionMode } = useDashboard();

  const handleOptionSelect = (option: typeof journeyOptions[0]) => {
    // Set interaction mode if it's guided or discovery
    if (option.storageKey === 'guided' || option.storageKey === 'discovery') {
      setInteractionMode(option.storageKey as 'guided' | 'discovery');
    }
    
    // Store the selection for potential future use
    localStorage.setItem('journey_preference', option.storageKey);
    
    // Navigate to the appropriate route
    navigate(option.route);
    
    // Close the modal
    onClose();
  };

  const currentMode = localStorage.getItem('dashboard_interaction_mode') || 'guided';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-brain-health-500 to-clarity-teal-500 text-white">
              <Brain className="h-6 w-6" />
            </div>
            <DialogTitle className="text-3xl font-bold gradient-text-brand">
              Your Journey Hub
            </DialogTitle>
          </div>
          <p className="text-brain-health-600 text-lg">
            Choose how you'd like to navigate your MyRhythm experience
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {journeyOptions.map((option) => {
            const IconComponent = option.icon;
            const isCurrentMode = currentMode === option.storageKey;
            
            return (
              <Card 
                key={option.id}
                className={`premium-card cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] bg-gradient-to-br ${option.bgGradient} border-${option.color}-200`}
                onClick={() => handleOptionSelect(option)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg bg-gradient-to-r ${option.gradient} text-white shadow-lg`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className={`text-lg font-bold text-${option.color}-700 flex items-center gap-2`}>
                          {option.title}
                          {isCurrentMode && (
                            <Badge className="bg-green-100 text-green-700 border-green-300 text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Current
                            </Badge>
                          )}
                        </CardTitle>
                        <p className={`text-sm text-${option.color}-600 font-medium`}>
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className={`text-sm text-${option.color}-700`}>
                    {option.longDescription}
                  </p>
                  
                  <div className="space-y-2">
                    <h4 className={`text-sm font-semibold text-${option.color}-800`}>Key Features:</h4>
                    <div className="grid grid-cols-2 gap-1">
                      {option.features.map((feature, index) => (
                        <div key={index} className={`flex items-center gap-2 text-xs text-${option.color}-600`}>
                          <Sparkles className="h-3 w-3" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    className={`w-full bg-gradient-to-r ${option.gradient} text-white hover:shadow-lg transition-all duration-300 font-medium`}
                    size="sm"
                  >
                    {isCurrentMode ? 'Continue Journey' : 'Start This Path'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center pt-6 border-t border-brain-health-200">
          <p className="text-sm text-brain-health-600">
            You can always change your preference later in your dashboard settings
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}