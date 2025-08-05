import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, CheckCircle, Calendar, Users, ArrowRight, Mic, Shield } from "lucide-react";

export function CoreFeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: "Memory Bridge",
      subtitle: "AI-Powered Conversation Recording",
      description: "Record conversations and let AI extract actionable commitments automatically. Never forget important promises or tasks again.",
      benefits: [
        "Smart conversation analysis",
        "Automatic promise extraction",
        "Context-aware insights"
      ],
      color: "from-purple-500 to-blue-500",
      demoAction: "Start Recording"
    },
    {
      icon: CheckCircle,
      title: "PACTs",
      subtitle: "Promise Accountability & Tracking",
      description: "Track your commitments with intelligent priority scoring and trust metrics. Build reliable habits through accountability.",
      benefits: [
        "Smart priority scoring",
        "Trust score tracking",
        "Family sharing & support"
      ],
      color: "from-blue-500 to-teal-500",
      demoAction: "View PACTs"
    },
    {
      icon: Calendar,
      title: "Smart Calendar",
      subtitle: "AI-Optimized Scheduling",
      description: "Automatically schedule your commitments based on energy levels, priorities, and optimal time slots for success.",
      benefits: [
        "Energy-aware scheduling",
        "Optimal time detection",
        "Conflict prevention"
      ],
      color: "from-teal-500 to-green-500",
      demoAction: "Schedule Tasks"
    },
    {
      icon: Users,
      title: "Support Circle",
      subtitle: "Family & Caregiver Network",
      description: "Connect with loved ones who support your journey. Share progress, get encouragement, and maintain accountability together.",
      benefits: [
        "Family progress sharing",
        "Caregiver insights",
        "Emergency support network"
      ],
      color: "from-green-500 to-purple-500",
      demoAction: "Connect Circle"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
            MyRhythm Core Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Four interconnected tools designed specifically for cognitive wellness and memory support. 
            Each feature works together to create a comprehensive support system.
          </p>
          
          {/* Trust & Security Badge */}
          <div className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-500">
            <Shield className="h-4 w-4" />
            <span>HIPAA-compliant • Privacy-first design • Family-safe sharing</span>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl font-bold text-gray-800 mb-1">
                      {feature.title}
                    </CardTitle>
                    <p className="text-sm font-medium text-gray-500 mb-3">
                      {feature.subtitle}
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Benefits List */}
                <div className="space-y-3 mb-6">
                  {feature.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.color}`} />
                      <span className="text-sm text-gray-600">{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* Demo Action Button */}
                <Button 
                  variant="outline" 
                  className="w-full group-hover:bg-gray-50 transition-colors"
                >
                  {feature.demoAction}
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Integration Message */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-100">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-purple-400" />
                <div className="w-8 h-px bg-purple-300" />
                <div className="w-3 h-3 rounded-full bg-blue-400" />
                <div className="w-8 h-px bg-blue-300" />
                <div className="w-3 h-3 rounded-full bg-teal-400" />
                <div className="w-8 h-px bg-teal-300" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              Seamlessly Connected Ecosystem
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Unlike standalone apps, MyRhythm's features work together. Record a conversation, 
              extract commitments, schedule them optimally, and share progress with your support circle - 
              all in one integrated platform designed for cognitive wellness.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}