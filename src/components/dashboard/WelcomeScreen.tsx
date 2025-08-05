import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Crown, ArrowRight, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MonthlyTheme } from "./MonthlyTheme";
import { DailyIChooseWidget } from "./DailyIChooseWidget";
import { SubscriptionGate } from "@/components/subscription/SubscriptionGate";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/contexts/SubscriptionContext";

interface WelcomeScreenProps {
  onProceedToDashboard: () => void;
  userType?: string;
}

export function WelcomeScreen({ onProceedToDashboard, userType }: WelcomeScreenProps) {
  const [currentStep, setCurrentStep] = useState<"subscription" | "theme" | "choose" | "ready">("subscription");
  const [hasTheme, setHasTheme] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subscriptionData, hasFeature } = useSubscription();

  useEffect(() => {
    // Check subscription status first
    if (subscriptionData.subscribed || subscriptionData.trial_active) {
      // Check if monthly theme is already set
      const savedTheme = localStorage.getItem("myrhythm_monthly_theme");
      if (savedTheme) {
        setHasTheme(true);
        setCurrentStep("choose");
      } else {
        setCurrentStep("theme");
      }
    } else {
      setCurrentStep("subscription");
    }
  }, [subscriptionData]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const handlePlanSelected = (planType: 'basic' | 'premium' | 'family') => {
    setSelectedPlan(planType);
    // Move to theme selection after plan selection
    setCurrentStep("theme");
  };

  const handleContinueFree = () => {
    // Continue with limited features
    setCurrentStep("theme");
  };

  const handleThemeComplete = () => {
    setHasTheme(true);
    setCurrentStep("choose");
  };

  const handleProceedToDashboard = () => {
    // Set that welcome flow is complete for today
    const today = new Date().toDateString();
    localStorage.setItem(`welcome_complete_${today}`, "true");
    onProceedToDashboard();
  };

  const handleViewCalendar = () => {
    navigate("/calendar");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 p-4 space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <h1 className="text-5xl font-black mb-4">
          <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
            {getGreeting()}!
          </span>
        </h1>
        <p className="text-xl text-gray-700 font-medium">
          Let's set the tone for an amazing day
        </p>
      </motion.div>

      {/* Step Flow */}
      <div className="max-w-4xl mx-auto space-y-8">
        <AnimatePresence mode="wait">
          {currentStep === "subscription" && (
            <motion.div
              key="subscription"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <SubscriptionGate 
                onPlanSelected={handlePlanSelected}
                onContinueFree={handleContinueFree}
                showFreeTrial={true}
              />
            </motion.div>
          )}

          {currentStep === "theme" && (
            <motion.div
              key="theme"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-purple-700 mb-2">Step 1: Set Your Monthly Theme</h2>
                <p className="text-purple-600">Choose a powerful word that will guide your month</p>
              </div>
              
              <div className="max-w-2xl mx-auto">
                <MonthlyTheme />
              </div>
              
              {hasTheme && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <Button 
                    onClick={handleThemeComplete}
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    Continue to Daily Empowerment
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}

          {currentStep === "choose" && (
            <motion.div
              key="choose"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-blue-700 mb-2">Step 2: Your Daily #IChoose Statement</h2>
                <p className="text-blue-600">This will empower you for the day ahead</p>
              </div>
              
              <DailyIChooseWidget 
                onUpgradeClick={() => {}} 
                userType={userType} 
              />
              
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-center"
                >
                <Button 
                  onClick={() => setCurrentStep("ready")}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
                >
                  I'm Ready for My Day
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </motion.div>
          )}

          {currentStep === "ready" && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-8"
            >
              <Card className="p-8 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200">
                <CardContent className="space-y-6">
                  <div className="text-6xl">🚀</div>
                  <h2 className="text-4xl font-black text-emerald-700">You're All Set!</h2>
                  <p className="text-xl text-emerald-600">
                    Your theme is locked in, your daily empowerment is ready. 
                    Time to make today amazing!
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button 
                      onClick={handleProceedToDashboard}
                      size="lg"
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                    >
                      <Crown className="mr-2 h-5 w-5" />
                      Enter Your Command Center
                    </Button>
                    
                    <Button 
                      onClick={handleViewCalendar}
                      size="lg"
                      variant="outline"
                      className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    >
                      <Calendar className="mr-2 h-5 w-5" />
                      View Calendar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}