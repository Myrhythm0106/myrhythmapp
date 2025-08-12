import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Mic, 
  Brain, 
  CheckCircle, 
  ArrowRight, 
  Clock,
  Users,
  Target,
  Heart
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export function MemoryBridgeSection() {
  const navigate = useNavigate();

  const memoryBridgeSteps = [
    {
      icon: Mic,
      title: "Record",
      description: "Capture important conversations with one click",
      color: "bg-gradient-to-br from-blue-500 to-blue-600"
    },
    {
      icon: Brain,
      title: "Summarize", 
      description: "AI intelligently analyzes and summarizes key points",
      color: "bg-gradient-to-br from-purple-500 to-purple-600"
    },
    {
      icon: Target,
      title: "Extract A.C.T.S.",
      description: "Actions, Commitments, Tasks, and Schedules identified",
      color: "bg-gradient-to-br from-emerald-500 to-emerald-600"
    },
    {
      icon: CheckCircle,
      title: "Schedule",
      description: "Automatically create follow-ups and reminders",
      color: "bg-gradient-to-br from-orange-500 to-orange-600"
    }
  ];

  const benefits = [
    {
      icon: Heart,
      title: "Never Miss a Promise",
      description: "Automatically track commitments made to loved ones"
    },
    {
      icon: Users,
      title: "Strengthen Relationships",
      description: "Show you care by following through on every conversation"
    },
    {
      icon: Clock,
      title: "Save Mental Energy",
      description: "Stop worrying about forgetting important details"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 px-4 py-2">
            🌟 Game-Changing Feature
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
            Memory Bridge
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Transform conversations into action. Never let important moments slip away again.
          </p>
        </div>

        {/* Process Flow */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {memoryBridgeSteps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="text-center hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
                {index < memoryBridgeSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-primary/60" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {benefits.map((benefit, index) => (
            <Card key={index} className="bg-gradient-to-br from-background to-secondary/30 border-primary/10">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="inline-block bg-gradient-to-r from-primary/5 via-blue-500/5 to-purple-500/5 border-primary/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Conversations?</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Experience the power of Memory Bridge with your first conversation today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  onClick={() => navigate("/auth")}
                  className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 hover:from-primary/90 hover:via-blue-600/90 hover:to-purple-600/90"
                >
                  Try Memory Bridge Free
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => {
                    const demoSection = document.getElementById('interactive-demo');
                    demoSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  See It In Action
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}