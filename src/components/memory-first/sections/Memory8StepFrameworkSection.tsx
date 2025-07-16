import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Clock, 
  Heart, 
  Target, 
  Users, 
  Brain, 
  Calendar, 
  Trophy, 
  Sparkles,
  ArrowRight
} from "lucide-react";

export function Memory8StepFrameworkSection() {
  const navigate = useNavigate();
  
  const steps = [
    {
      number: 1,
      title: "Memory-Safe Morning",
      icon: Clock,
      description: "Start each day with gentle routines that don't overwhelm your cognitive load",
      memorySpecific: "Visual cues, not complex lists"
    },
    {
      number: 2,
      title: "Energy Mapping",
      icon: Heart,
      description: "Track when your mind is sharpest and when it needs rest",
      memorySpecific: "Plan around your brain's natural rhythms"
    },
    {
      number: 3,
      title: "Micro-Priorities",
      icon: Target,
      description: "Break big goals into memory-friendly, bite-sized pieces",
      memorySpecific: "One clear focus at a time"
    },
    {
      number: 4,
      title: "Support Circle",
      icon: Users,
      description: "Keep family in the loop without making them your full-time reminder system",
      memorySpecific: "Independence with safety net"
    },
    {
      number: 5,
      title: "Cognitive Strengthening",
      icon: Brain,
      description: "Brain exercises designed for recovery, not performance pressure",
      memorySpecific: "Gentle progress, celebrating small wins"
    },
    {
      number: 6,
      title: "Memory Anchors",
      icon: Calendar,
      description: "Create reliable touchpoints throughout your day",
      memorySpecific: "External memory you can trust"
    },
    {
      number: 7,
      title: "Progress Celebration",
      icon: Trophy,
      description: "Acknowledge every step forward, no matter how small",
      memorySpecific: "Rebuilding confidence one win at a time"
    },
    {
      number: 8,
      title: "Identity Restoration",
      icon: Sparkles,
      description: "Rediscover who you are beyond your memory challenges",
      memorySpecific: "You are more than your diagnosis"
    }
  ];

  return (
    <section className="space-y-8">
      <div className="text-center space-y-4">
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          <Brain className="h-3 w-3 mr-1" />
          Exclusive to Memory-First Users
        </Badge>
        
        <h2 className="text-3xl md:text-4xl font-bold">
          The 8-Step Memory-First Framework
        </h2>
        
        <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
          Unlike generic productivity methods, this framework was created specifically for minds rebuilding after 
          brain injury, stroke, concussion, or other memory challenges.
        </p>
      </div>

      {/* Framework Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => (
          <Card key={index} className="relative group hover:shadow-lg transition-shadow border-l-4 border-l-blue-200 hover:border-l-blue-400">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <step.icon className="h-5 w-5 text-blue-600" />
                </div>
                <Badge variant="secondary" className="text-xs">
                  Step {step.number}
                </Badge>
              </div>
              <CardTitle className="text-lg leading-tight">
                {step.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
              <div className="bg-blue-50 p-3 rounded-md border-l-2 border-l-blue-300">
                <p className="text-xs font-medium text-blue-700">
                  Memory-First Difference:
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  {step.memorySpecific}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Comparison Box */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-8 rounded-lg border border-amber-200">
        <h3 className="text-2xl font-semibold mb-6 text-center">
          Why Other Apps Fail Memory-Challenged Brains
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="font-semibold text-red-700 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-red-500" />
              Standard Productivity Apps
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-red-500">✗</span>
                <span>Assume perfect working memory</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500">✗</span>
                <span>Overwhelming feature lists</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500">✗</span>
                <span>Focus on speed and efficiency</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500">✗</span>
                <span>No family coordination features</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500">✗</span>
                <span>Built for "normal" cognitive function</span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-green-700 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              Memory-First Design
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Works with impaired memory</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Simple, clear visual design</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Gentle progress, celebrating small wins</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Family support without dependency</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Built by and for memory challenges</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center space-y-6">
        <h3 className="text-2xl font-semibold">
          Ready to Experience the Memory-First Difference?
        </h3>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Join the community of brain injury survivors who've rediscovered their confidence with our 8-step approach.
        </p>
        <Button 
          size="lg" 
          onClick={() => navigate("/onboarding")}
          className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6"
        >
          Start My 8-Step Journey
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </section>
  );
}