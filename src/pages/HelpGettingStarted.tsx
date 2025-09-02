import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, PlayCircle, BookOpen, Users, Calendar, TrendingUp } from "lucide-react";

export function HelpGettingStarted() {
  const navigate = useNavigate();

  const steps = [
    {
      title: "1. Complete Your Assessment",
      description: "Take the personalized assessment to help us understand your cognitive wellness goals.",
      action: () => navigate("/onboarding/assessment"),
      actionText: "Start Assessment"
    },
    {
      title: "2. Set Up Your Profile",
      description: "Add your personal information and preferences to customize your experience.",
      action: () => navigate("/dashboard"),
      actionText: "Go to Profile"
    },
    {
      title: "3. Build Your Support Circle",
      description: "Invite family members and care team to join your wellness journey.",
      action: () => navigate("/dashboard"),
      actionText: "Add Members"
    },
    {
      title: "4. Start Recording Memories",
      description: "Use Memory Bridge to capture conversations and important moments.",
      action: () => navigate("/dashboard"),
      actionText: "Try Memory Bridge"
    }
  ];

  const features = [
    {
      title: "Memory Bridge",
      description: "Record conversations with AI-powered transcription and action extraction",
      icon: PlayCircle
    },
    {
      title: "Smart Calendar", 
      description: "Intelligent scheduling that adapts to your energy levels",
      icon: Calendar
    },
    {
      title: "Support Circle",
      description: "Connect with family, friends, and healthcare providers",
      icon: Users
    },
    {
      title: "Progress Tracking",
      description: "Monitor your wellness journey with detailed insights",
      icon: TrendingUp
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-brain-health-50/30 via-clarity-teal-50/30 to-memory-emerald-50/30 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/help")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Help
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-brain-health-500 to-clarity-teal-500 rounded-full flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold gradient-text-brand">Getting Started Guide</h1>
          </div>
        </div>

        {/* Welcome */}
        <Card className="border-brain-health-200/50">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-brain-health-900">
                Welcome to MyRhythm!
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Let's get you set up for success on your cognitive wellness journey. Follow these steps to make the most of MyRhythm.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Getting Started Steps */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-brain-health-900">Setup Steps</h3>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <Card key={index} className="border-brain-health-200/50">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-brain-health-500 to-clarity-teal-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-lg font-semibold text-brain-health-900">{step.title}</h4>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                    <Button onClick={step.action} variant="outline" size="sm">
                      {step.actionText}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Key Features */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-brain-health-900">Key Features</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-brain-health-200/50">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-brain-health-500 to-clarity-teal-500 rounded-xl flex items-center justify-center">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg therapeutic-accent">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Need More Help */}
        <Card className="border-brain-health-200/50 bg-brain-health-50/30">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold text-brain-health-900">Still Need Help?</h3>
              <p className="text-muted-foreground">
                Our support team is here to help you get started with MyRhythm.
              </p>
              <Button 
                onClick={() => window.open('mailto:support@myrhythm.com?subject=Getting Started Help', '_blank')}
                className="cognitive-enhancement"
              >
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default HelpGettingStarted;