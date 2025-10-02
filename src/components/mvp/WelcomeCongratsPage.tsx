import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Brain, 
  Calendar, 
  Users, 
  TrendingUp,
  Sparkles,
  HandHeart,
  Compass,
  ArrowRight,
  Clock
} from "lucide-react";
import { motion } from "framer-motion";

export function WelcomeCongratsPage() {
  const navigate = useNavigate();
  const [selectedRoute, setSelectedRoute] = useState<'guided' | 'discovery' | null>(null);
  const [trialDaysRemaining] = useState(7);

  useEffect(() => {
    // Get user data from registration flow
    const registrationData = localStorage.getItem('registration_data');
    if (registrationData) {
      const { fullName } = JSON.parse(registrationData);
      console.log("Welcome page loaded for:", fullName);
    }
  }, []);

  const benefits = [
    {
      icon: <Brain className="h-6 w-6 text-memory-emerald-500" />,
      title: "Memory Bridge",
      description: "Capture and organize conversations effortlessly"
    },
    {
      icon: <Calendar className="h-6 w-6 text-clarity-teal-500" />,
      title: "Smart Calendar",
      description: "Never miss important tasks and appointments"
    },
    {
      icon: <Users className="h-6 w-6 text-sunrise-amber-500" />,
      title: "Support Circle",
      description: "Stay connected with your care team"
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-brain-health-500" />,
      title: "Progress Tracking",
      description: "See your cognitive health improve over time"
    }
  ];

  const handleRouteSelection = (route: 'guided' | 'discovery') => {
    setSelectedRoute(route);
    
    // Store route selection
    localStorage.setItem('selected_route', route);
    
    // Navigate to user guide
    navigate('/mvp/user-guide');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-memory-emerald-50 via-brain-health-50 to-clarity-teal-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Congratulations Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 rounded-full flex items-center justify-center animate-pulse">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-memory-emerald-600 to-brain-health-600 bg-clip-text text-transparent mb-4">
            Welcome to MyRhythm! 🎉
          </h1>
          
          <p className="text-xl text-brain-health-700 max-w-2xl mx-auto">
            Congratulations! You've taken the first step towards better cognitive health and organization.
          </p>
          
          <Badge className="mt-4 bg-gradient-to-r from-memory-emerald-500 to-clarity-teal-500 text-white border-0 px-6 py-2 text-base">
            <Clock className="h-4 w-4 mr-2" />
            {trialDaysRemaining} Days Free Trial Active
          </Badge>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-center text-brain-health-800 mb-6">
            What You Can Expect
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm border-2 border-transparent hover:border-memory-emerald-200 transition-all duration-300 hover:shadow-lg h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-memory-emerald-100 to-brain-health-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        {benefit.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-brain-health-800 mb-1">
                          {benefit.title}
                        </h3>
                        <p className="text-sm text-brain-health-600">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Route Selection */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-center text-brain-health-800 mb-4">
            Choose Your Journey
          </h2>
          <p className="text-center text-brain-health-600 mb-8 max-w-2xl mx-auto">
            How would you like to get started? Both paths lead to success - choose what feels right for you.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Guided Route */}
            <Card 
              className={`cursor-pointer transition-all hover:shadow-xl border-2 ${
                selectedRoute === 'guided' 
                  ? 'border-memory-emerald-500 shadow-lg scale-[1.02]' 
                  : 'border-transparent hover:border-memory-emerald-200'
              }`}
              onClick={() => setSelectedRoute('guided')}
            >
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-memory-emerald-500 to-brain-health-500 rounded-full flex items-center justify-center">
                  <HandHeart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-brain-health-800 mb-2">
                  Guided Journey
                </h3>
                <Badge variant="secondary" className="mb-4">Recommended</Badge>
                <p className="text-brain-health-600 mb-6">
                  Take my hand - I'll show you everything step by step with a personalized tour
                </p>
                <Button 
                  onClick={() => handleRouteSelection('guided')}
                  className="w-full bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 hover:from-memory-emerald-600 hover:to-brain-health-600 text-white"
                >
                  Start Guided Tour
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Discovery Route */}
            <Card 
              className={`cursor-pointer transition-all hover:shadow-xl border-2 ${
                selectedRoute === 'discovery' 
                  ? 'border-clarity-teal-500 shadow-lg scale-[1.02]' 
                  : 'border-transparent hover:border-clarity-teal-200'
              }`}
              onClick={() => setSelectedRoute('discovery')}
            >
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-clarity-teal-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <Compass className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-brain-health-800 mb-2">
                  Discovery Mode
                </h3>
                <Badge variant="outline" className="mb-4">Explore Freely</Badge>
                <p className="text-brain-health-600 mb-6">
                  I want to explore on my own and discover features at my own pace
                </p>
                <Button 
                  onClick={() => handleRouteSelection('discovery')}
                  variant="outline"
                  className="w-full border-clarity-teal-300 hover:bg-clarity-teal-50"
                >
                  Start Exploring
                  <Compass className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Info Card */}
          <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <strong>Don't worry!</strong> You can always switch between guided and discovery mode at any time. 
                  Your journey is flexible and adapts to your needs.
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
