import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Sparkles, 
  ArrowRight, 
  Brain,
  Calendar,
  Users,
  TrendingUp,
  BookOpen,
  Target,
  Heart,
  Star,
  Trophy,
  CheckCircle,
  Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface WelcomeCelebrationProps {
  showOnMount?: boolean;
  onClose?: () => void;
}

export function WelcomeCelebration({ showOnMount = false, onClose }: WelcomeCelebrationProps) {
  const [isOpen, setIsOpen] = useState(showOnMount);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (showOnMount) {
      setIsOpen(true);
      // Auto-progress through steps
      const timer = setTimeout(() => {
        if (currentStep < 1) {
          setCurrentStep(currentStep + 1);
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showOnMount, currentStep]);

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  const handleBeginJourney = () => {
    handleClose();
    // Go straight to MVP assessment flow after checkout
    navigate("/mvp/assessment-flow?type=brief&path=guided&flow=post-payment");
    toast.success("Welcome to your transformative journey!");
  };

  const handleExploreDashboard = () => {
    handleClose();
    navigate("/dashboard");
    toast.success("Let's explore MyRhythm together!");
  };

  const celebrations = [
    {
      icon: Trophy,
      title: "🎉 Commitment Celebrated!",
      subtitle: "You've taken the most important step",
      description: "Your decision to invest in your cognitive wellness shows incredible strength and wisdom.",
      gradient: "from-beacon-500 to-clarity-teal-500"
    },
    {
      icon: Sparkles,
      title: "✨ Welcome to MyRhythm",
      subtitle: "Where transformation begins",
      description: "You're now part of an exclusive community dedicated to cognitive excellence and brain health.",
      gradient: "from-brain-health-500 to-memory-emerald-500"
    }
  ];

  const features = [
    {
      icon: Brain,
      title: "Personalized Brain Health",
      description: "Memory enhancement tools and cognitive wellness strategies tailored to you",
      color: "brain-health"
    },
    {
      icon: Calendar,
      title: "Smart Life Management",
      description: "Intelligent scheduling with cognitive load optimization",
      color: "clarity-teal"
    },
    {
      icon: Users,
      title: "Expert Support Network",
      description: "Connect with specialists and your personal care team",
      color: "memory-emerald"
    },
    {
      icon: TrendingUp,
      title: "Precision Progress Tracking",
      description: "Monitor your cognitive wellness journey with detailed insights",
      color: "beacon"
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-0 p-0 bg-gradient-to-br from-brain-health-50 via-clarity-teal-50 to-memory-emerald-50">
        <div className="relative">
          {/* Premium Header */}
          <div className="relative overflow-hidden bg-gradient-to-r from-brain-health-600 via-clarity-teal-600 to-memory-emerald-600 p-8 text-white">
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
            
            <div className="relative text-center">
              <div className="mx-auto w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 shadow-xl animate-neural-pulse">
                {React.createElement(celebrations[currentStep]?.icon || Trophy, { 
                  className: "h-10 w-10 text-white" 
                })}
              </div>
              
              <DialogHeader>
                <DialogTitle className="text-4xl font-bold text-white mb-2">
                  {celebrations[currentStep]?.title}
                </DialogTitle>
                <p className="text-xl text-white/90 mb-2">
                  {celebrations[currentStep]?.subtitle}
                </p>
                <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
                  {celebrations[currentStep]?.description}
                </p>
              </DialogHeader>
            </div>

            {/* Progress Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {celebrations.map((_, index) => (
                <div 
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentStep 
                      ? 'bg-white shadow-lg scale-125' 
                      : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>

            <CardContent className="p-8 space-y-8">
              {/* Premium Features Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <Card key={index} className="premium-card group hover:shadow-lg transition-all duration-300 border-0">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 ${
                          feature.color === 'brain-health' ? 'bg-gradient-to-br from-brain-health-500 to-brain-health-600' :
                          feature.color === 'clarity-teal' ? 'bg-gradient-to-br from-clarity-teal-500 to-clarity-teal-600' :
                          feature.color === 'memory-emerald' ? 'bg-gradient-to-br from-memory-emerald-500 to-memory-emerald-600' :
                          'bg-gradient-to-br from-beacon-500 to-beacon-600'
                        }`}>
                          <feature.icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-lg therapeutic-accent mb-2">
                            {feature.title}
                          </h4>
                          <p className="text-muted-foreground leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

            {/* Exclusive Benefits */}
            <Card className="premium-card border-beacon-200/50 bg-gradient-to-r from-beacon-50 to-brain-health-50">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Star className="h-6 w-6 text-beacon-600" />
                    <h3 className="text-2xl font-bold gradient-text-brand">
                      Exclusive Member Benefits
                    </h3>
                    <Star className="h-6 w-6 text-beacon-600" />
                  </div>
                  
                  <div className="grid sm:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2 justify-center">
                      <CheckCircle className="h-4 w-4 text-memory-emerald-600" />
                      <span>Unlimited brain games</span>
                    </div>
                    <div className="flex items-center gap-2 justify-center">
                      <CheckCircle className="h-4 w-4 text-brain-health-600" />
                      <span>Personal AI coaching</span>
                    </div>
                    <div className="flex items-center gap-2 justify-center">
                      <CheckCircle className="h-4 w-4 text-clarity-teal-600" />
                      <span>Priority support</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Premium Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button 
                onClick={handleBeginJourney}
                size="lg"
                className="flex-1 premium-button text-lg py-6 hover:shadow-xl transition-all duration-300 group"
              >
                <Target className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                Begin Your Guided Journey
                <ArrowRight className="h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                onClick={handleExploreDashboard}
                variant="outline"
                size="lg"
                className="flex-1 border-brain-health-300 hover:bg-brain-health-50 hover:border-brain-health-400 text-lg py-6 transition-all duration-300 group"
              >
                <Brain className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                Explore Dashboard
              </Button>
            </div>

            {/* Empowerment Message */}
            <div className="text-center p-6 rounded-2xl bg-gradient-to-r from-memory-emerald-50 to-brain-health-50 border border-memory-emerald-200/50">
              <Heart className="h-8 w-8 mx-auto mb-3 text-memory-emerald-600" />
              <p className="text-lg font-medium therapeutic-accent mb-2">
                Your Transformation Starts Today
              </p>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                You've joined an exclusive community of individuals committed to cognitive excellence. 
                Every step you take from here contributes to your brain health and overall wellbeing.
              </p>
            </div>
          </CardContent>
        </div>
      </DialogContent>
    </Dialog>
  );
}