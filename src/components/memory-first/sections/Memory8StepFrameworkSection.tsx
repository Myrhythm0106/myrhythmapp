import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Brain, ArrowRight } from "lucide-react";
import { ExpandableMyRhythmCards } from "@/components/shared/ExpandableMyRhythmCards";

export function Memory8StepFrameworkSection() {
  const navigate = useNavigate();
  
  // MYRHYTHM Framework - Empowering Memory Recovery
  const steps = [
    {
      letter: "M",
      word: "MINDSET",
      phase: "Memory-Aware Foundation",
      description: "Build cognitive confidence and self-awareness as your foundation for growth and empowerment.",
      memoryFocus: "Start with self-compassion and realistic expectations",
      icon: "🧠"
    },
    {
      letter: "Y",
      word: "Reflect",
      phase: "Acknowledge Your Reality",
      description: "Honor where you are in your recovery journey without judgment—this is your starting point for transformation.",
      memoryFocus: "Accept your current abilities while planning growth",
      icon: "🌟"
    },
    {
      letter: "R",
      word: "Restore",
      phase: "Rhythm-Based Energy",
      description: "Map your cognitive peaks and rest periods to work with your brain's natural energy patterns.",
      memoryFocus: "Work with your brain's natural energy patterns",
      icon: "⚡"
    },
    {
      letter: "H",
      word: "Harness",
      phase: "Hope Through Community",
      description: "Build your circle of care and maintain independence—support systems that empower, not enable.",
      memoryFocus: "Support systems that empower, not enable",
      icon: "💪"
    },
    {
      letter: "Y",
      word: "Celebrate",
      phase: "Your Victories Matter",
      description: "Celebrate every step forward, no matter how small—progress tracking that builds unstoppable confidence.",
      memoryFocus: "Progress tracking that builds confidence",
      icon: "🎉"
    },
    {
      letter: "T",
      word: "Take",
      phase: "Transform Daily Experience",
      description: "Reclaim agency in your life through reliable memory anchors and external systems you can trust.",
      memoryFocus: "External memory systems you can trust",
      icon: "✨"
    },
    {
      letter: "H",
      word: "Heal",
      phase: "Hope & Growth Forward",
      description: "Gentle brain exercises that build resilience and recovery-focused cognitive enhancement.",
      memoryFocus: "Recovery-focused cognitive enhancement",
      icon: "🌈"
    },
    {
      letter: "M",
      word: "Multiply",
      phase: "Mission to Inspire",
      description: "Transform your experience into hope for others—become an advocate and share your inspiring journey.",
      memoryFocus: "Transform your experience into hope for others",
      icon: "🌍"
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

      {/* MYRHYTHM Framework Cards */}
      <ExpandableMyRhythmCards 
        steps={steps}
        variant="framework"
        showExpandAll={true}
      />

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