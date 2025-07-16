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
  
  // MYRHYTHM Framework - Empowering Memory Recovery
  const steps = [
    {
      number: 1,
      letter: "M",
      title: "MINDSET - Memory-Aware Foundation",
      icon: Brain,
      description: "Build cognitive confidence and self-awareness as your foundation",
      memorySpecific: "Start with self-compassion and realistic expectations"
    },
    {
      number: 2,
      letter: "Y", 
      title: "YIELD - Acknowledge Your Reality",
      icon: Heart,
      description: "Honor where you are in your recovery journey without judgment",
      memorySpecific: "Accept your current abilities while planning growth"
    },
    {
      number: 3,
      letter: "R",
      title: "RESTORE - Rhythm-Based Energy",
      icon: Clock,
      description: "Map your cognitive peaks and rest periods to optimize your day",
      memorySpecific: "Work with your brain's natural energy patterns"
    },
    {
      number: 4,
      letter: "H",
      title: "HARNESS - Hope Through Community",
      icon: Users,
      description: "Build your circle of care and maintain your independence",
      memorySpecific: "Support systems that empower, not enable"
    },
    {
      number: 5,
      letter: "Y",
      title: "YIELD - Your Victories Matter",
      icon: Trophy,
      description: "Celebrate every step forward, no matter how small",
      memorySpecific: "Progress tracking that builds confidence"
    },
    {
      number: 6,
      letter: "T",
      title: "TAKE - Transform Daily Experience",
      icon: Target,
      description: "Reclaim agency in your life with reliable memory anchors",
      memorySpecific: "External memory systems you can trust"
    },
    {
      number: 7,
      letter: "H",
      title: "HEAL - Hope & Growth Forward",
      icon: Sparkles,
      description: "Gentle brain exercises that build cognitive resilience",
      memorySpecific: "Recovery-focused cognitive enhancement"
    },
    {
      number: 8,
      letter: "M",
      title: "MULTIPLY - Mission to Inspire",
      icon: Calendar,
      description: "Become an advocate and share your journey to inspire others",
      memorySpecific: "Transform your experience into hope for others"
    }
  ];

  return (
    <section className="space-y-8">
      <div className="text-center space-y-4">
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          <Brain className="h-3 w-3 mr-1" />
          Exclusive to Memory-First Users
        </Badge>
        
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
          The MYRHYTHM Framework
        </h2>
        
        <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
          Unlike generic productivity methods, this framework was created specifically for minds rebuilding after 
          brain injury, stroke, concussion, or other memory challenges.
        </p>
      </div>

      {/* MYRHYTHM Framework Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => (
          <Card key={index} className="relative group hover:shadow-lg transition-shadow border-l-4 border-l-purple-200 hover:border-l-purple-400 bg-gradient-to-br from-white via-purple-50/10 to-blue-50/15">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-r from-purple-100 via-blue-100 to-teal-100 p-2 rounded-lg group-hover:from-purple-200 group-hover:via-blue-200 group-hover:to-teal-200 transition-colors">
                  <step.icon className="h-5 w-5 bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent" />
                </div>
                <Badge variant="secondary" className="text-xs bg-gradient-to-r from-purple-50 via-blue-50 to-teal-50 text-purple-700">
                  {step.letter}
                </Badge>
              </div>
              <CardTitle className="text-lg leading-tight bg-gradient-to-r from-purple-700 via-blue-700 to-teal-700 bg-clip-text text-transparent">
                {step.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-700 leading-relaxed">
                {step.description}
              </p>
              <div className="bg-gradient-to-r from-purple-50/60 via-blue-50/50 to-teal-50/60 p-3 rounded-md border-l-2 border-l-purple-300">
                <p className="text-xs font-medium bg-gradient-to-r from-purple-700 via-blue-700 to-teal-700 bg-clip-text text-transparent">
                  Memory-First Approach:
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {step.memorySpecific}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Comparison Box */}
      <div className="bg-gradient-to-r from-purple-50/40 via-blue-50/30 to-teal-50/40 p-8 rounded-lg border border-purple-200/50">
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
          className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 hover:from-purple-700 hover:via-blue-700 hover:to-teal-700 text-lg px-8 py-6 shadow-lg"
        >
          Start My MYRHYTHM Journey
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </section>
  );
}