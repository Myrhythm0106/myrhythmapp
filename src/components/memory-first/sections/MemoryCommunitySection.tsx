import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Shield, Heart, Brain, ArrowRight, Sparkles } from "lucide-react";

export function MemoryCommunitySection() {
  const navigate = useNavigate();
  
  const benefits = [
    {
      icon: Shield,
      title: "Safe Space",
      description: "No judgment, no pressure—just understanding from people who truly get it"
    },
    {
      icon: Brain,
      title: "Memory-Friendly Support",
      description: "All communications designed for memory challenges—clear, simple, supportive"
    },
    {
      icon: Heart,
      title: "Family Integration", 
      description: "Resources for partners, children, and caregivers navigating this journey together"
    },
    {
      icon: Sparkles,
      title: "Hope Sharing",
      description: "Daily reminders that memory challenges don't define your worth or limit your potential"
    }
  ];

  return (
    <section className="space-y-8">
      <div className="text-center space-y-4">
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          <Users className="h-3 w-3 mr-1" />
          Join the Memory-First Community
        </Badge>
        
        <h2 className="text-3xl md:text-4xl font-bold">
          You Don't Have to Rebuild Alone
        </h2>
        
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Connect with 1,000+ brain injury survivors, families, and caregivers who understand 
          the unique challenges of memory loss and the joy of small victories.
        </p>
      </div>

      {/* Community Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {benefits.map((benefit, index) => (
          <Card key={index} className="text-center hover:shadow-lg transition-shadow border-t-4 border-t-blue-200">
            <CardContent className="p-6 space-y-4">
              <div className="bg-blue-100 p-4 rounded-full w-fit mx-auto">
                <benefit.icon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main CTA Card */}
      <Card className="relative overflow-hidden border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-8 md:p-12 text-center space-y-6">
          <div className="absolute top-4 right-4 opacity-20">
            <Users size={100} className="text-blue-600" />
          </div>
          
          <div className="relative z-10 space-y-6">
            <h3 className="text-3xl md:text-4xl font-bold">
              Your Memory-First Journey Starts Today
            </h3>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Join the only community designed specifically for memory challenges. 
              Rediscover your confidence, rebuild your rhythm, and reconnect with life.
            </p>

            {/* Key Promise */}
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg border border-blue-200 max-w-2xl mx-auto">
              <h4 className="font-semibold text-blue-800 mb-3">
                Our Promise to You:
              </h4>
              <ul className="text-sm text-blue-700 space-y-2">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  <span>No overwhelming features or complex interfaces</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  <span>Family support that protects independence</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  <span>Progress tracking that celebrates every small win</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  <span>Community that understands your journey</span>
                </li>
              </ul>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                size="lg" 
                onClick={() => navigate("/onboarding")}
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6"
              >
                🧠 Start My Memory-First Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate("/auth")} 
                className="border-blue-300 text-blue-600 hover:bg-blue-50 text-lg px-8 py-6"
              >
                I'm a Family Member/Caregiver
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-6 border-t border-blue-200 space-y-2">
              <p className="text-sm text-blue-600 font-medium">
                Join 1,000+ brain injury survivors who've rediscovered hope
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-xs text-blue-500">
                <span>✓ Privacy-first design</span>
                <span>✓ Medical team approved</span>
                <span>✓ Family-tested approach</span>
                <span>✓ Survivor-built features</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Quote */}
      <div className="text-center bg-muted/30 p-6 rounded-lg">
        <p className="text-lg italic text-muted-foreground">
          "Memory challenges changed our lives, but they didn't end our story. 
          Today, we're writing new chapters filled with hope, progress, and community."
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          — The MyRhythm Memory-First Community
        </p>
      </div>
    </section>
  );
}