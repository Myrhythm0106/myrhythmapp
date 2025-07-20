import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, Users, Stethoscope, ArrowRight, ChevronDown, ChevronUp, Lightbulb, CheckCircle } from "lucide-react";

export function MemoryStrugglesSection() {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const struggles = [
    {
      category: "Daily Life",
      emoji: "🏠",
      icon: AlertTriangle,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      quickProblem: "Forgetting medications, appointments, daily tasks",
      problems: [
        "Forgetting medications—again",
        "Missing important appointments", 
        "Losing track of time and tasks",
        "Feeling overwhelmed by simple decisions",
        "Constant anxiety about forgetting something crucial"
      ],
      solution: "Memory-safe routines that work with your brain, not against it",
      solutionIcon: "🧠"
    },
    {
      category: "Family Life",
      emoji: "👨‍👩‍👧‍👦",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      quickProblem: "Family becomes your external memory system",
      problems: [
        "Family becomes your external memory",
        "Constant checking and reminding creates tension",
        "Losing independence and autonomy",
        "Partners become exhausted caregivers",
        "Children worry about their parent's wellbeing"
      ],
      solution: "Shared visibility without micromanagement—family as partners, not managers",
      solutionIcon: "🤝"
    },
    {
      category: "Medical Team",
      emoji: "🩺",
      icon: Stethoscope,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      quickProblem: "Can't remember symptoms or track progress",
      problems: [
        "Can't remember symptoms to report",
        "Struggle to track medication effectiveness",
        "Difficulty following complex treatment plans",
        "Appointments feel rushed and unproductive",
        "Healthcare team doesn't see daily reality"
      ],
      solution: "Simple tracking that gives your care team real insight into your daily experience",
      solutionIcon: "📊"
    }
  ];

  const toggleCard = (index: number) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  return (
    <section className="space-y-8">
      {/* Visual-First Header */}
      <div className="text-center space-y-6">
        <Badge variant="outline" className="text-amber-600 border-amber-200 text-sm px-4 py-2">
          <AlertTriangle className="h-4 w-4 mr-2" />
          The Memory Struggle is Real
        </Badge>
        
        <h2 className="text-3xl md:text-4xl font-bold">
          You're Not Broken. 
          <br />
          <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
            The Tools Are.
          </span>
        </h2>
        
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 max-w-4xl mx-auto">
          <p className="text-lg text-blue-800 leading-relaxed">
            💡 Standard productivity apps assume perfect memory. Life with memory challenges needs something completely different.
          </p>
        </div>
      </div>

      {/* Visual Challenge Cards - Brain-Friendly Layout */}
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">🎯 The Three Big Challenges</h3>
          <p className="text-sm text-muted-foreground">Click to learn more about each area</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {struggles.map((struggle, index) => (
            <Card 
              key={index} 
              className={`cursor-pointer border-2 ${struggle.borderColor} hover:shadow-lg transition-all ${
                expandedCard === index ? 'ring-2 ring-purple-200' : ''
              }`}
              onClick={() => toggleCard(index)}
            >
              <CardHeader className={`${struggle.bgColor} pb-4`}>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{struggle.emoji}</span>
                    <div>
                      <span className="text-lg font-semibold">{struggle.category}</span>
                      <p className="text-sm text-muted-foreground font-normal">
                        {struggle.quickProblem}
                      </p>
                    </div>
                  </div>
                  {expandedCard === index ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </CardTitle>
              </CardHeader>

              {expandedCard === index && (
                <CardContent className="space-y-4 pt-4">
                  {/* Detailed Problems */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-red-700 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Common Struggles:
                    </h4>
                    <div className="grid gap-2">
                      {struggle.problems.map((problem, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-2 bg-red-50 rounded-lg">
                          <div className="h-2 w-2 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                          <span className="text-sm text-red-700">{problem}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Memory-First Solution */}
                  <div className="pt-4 border-t border-muted/30">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-700 text-sm mb-2 flex items-center gap-2">
                        <span className="text-lg">{struggle.solutionIcon}</span>
                        Memory-First Solution:
                      </h4>
                      <p className="text-sm text-green-600 leading-relaxed">
                        {struggle.solution}
                      </p>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Action - Brain-Friendly CTA */}
      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-8 rounded-lg border border-emerald-200 text-center space-y-6">
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold flex items-center justify-center gap-2">
            <span className="text-2xl">✨</span>
            Ready to Stop Fighting Your Memory?
          </h3>
          <p className="text-lg text-emerald-700 max-w-2xl mx-auto">
            Join 1,000+ brain injury survivors who work <em>with</em> their memory challenges
          </p>
        </div>

        {/* Visual Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div className="flex items-center gap-2 bg-white/80 p-3 rounded-lg">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm">No overwhelming features</span>
          </div>
          <div className="flex items-center gap-2 bg-white/80 p-3 rounded-lg">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm">Family-friendly design</span>
          </div>
          <div className="flex items-center gap-2 bg-white/80 p-3 rounded-lg">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm">Built by someone who gets it</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
            🧠 Start Your Journey
          </Button>
          <Button size="lg" variant="outline" className="border-emerald-300 text-emerald-600">
            📖 Learn MYRHYTHM Framework
          </Button>
        </div>
      </div>
    </section>
  );
}