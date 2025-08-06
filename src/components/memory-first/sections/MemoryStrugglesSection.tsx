
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, Users, Stethoscope, ArrowRight, ChevronDown, ChevronUp, Lightbulb, CheckCircle, Eye } from "lucide-react";
import { FeatureShowcaseSection } from "./FeatureShowcaseSection";

export function MemoryStrugglesSection() {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const struggles = [
    {
      category: "Daily Life",
      emoji: "🏠",
      icon: Clock,
      gradient: "from-emerald-50 to-emerald-100",
      borderColor: "border-emerald-200/50",
      headerBg: "bg-emerald-50/50",
      textColor: "text-emerald-700",
      accentColor: "text-emerald-600",
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
      gradient: "from-brain-health-50 to-brain-health-100",
      borderColor: "border-brain-health-200/50",
      headerBg: "bg-brain-health-50/50",
      textColor: "text-brain-health-700",
      accentColor: "text-brain-health-600",
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
      gradient: "from-clarity-teal-50 to-clarity-teal-100",
      borderColor: "border-clarity-teal-200/50",
      headerBg: "bg-clarity-teal-50/50",
      textColor: "text-clarity-teal-700",
      accentColor: "text-clarity-teal-600",
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
    <section className="space-y-12 max-w-6xl mx-auto">
      {/* Elegant Header */}
      <div className="text-center space-y-6">
        <Badge variant="outline" className="bg-white/90 border-emerald-200 text-emerald-700 text-sm px-4 py-2 shadow-sm">
          <AlertTriangle className="h-4 w-4 mr-2" />
          The Memory Struggle is Real
        </Badge>
        
        <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
          You're Not Broken. 
          <br />
          <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-blue-300 bg-clip-text text-transparent">
            The Tools Are.
          </span>
        </h2>
        
        <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/20 max-w-4xl mx-auto">
          <p className="text-lg text-emerald-800 leading-relaxed">
            💡 Standard productivity apps assume perfect memory. Life with memory challenges needs something completely different.
          </p>
        </div>
      </div>

      {/* Elegant Challenge Cards */}
      <div className="space-y-8">
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-white mb-4">🎯 The Three Big Challenges</h3>
          <p className="text-emerald-100/80">Click to explore each area and discover our solutions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {struggles.map((struggle, index) => (
            <Card 
              key={index} 
              className={`cursor-pointer bg-white/95 backdrop-blur-sm border-2 ${struggle.borderColor} hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] ${
                expandedCard === index ? 'ring-4 ring-white/30 shadow-2xl scale-[1.02]' : ''
              }`}
              onClick={() => toggleCard(index)}
            >
              <CardHeader className={`bg-gradient-to-r ${struggle.gradient} rounded-t-lg pb-4`}>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{struggle.emoji}</span>
                    <div>
                      <span className={`text-xl font-bold ${struggle.textColor}`}>{struggle.category}</span>
                      <p className={`text-sm ${struggle.accentColor} font-medium mt-1`}>
                        {struggle.quickProblem}
                      </p>
                    </div>
                  </div>
                  <div className={`${struggle.textColor} transition-transform duration-200 ${expandedCard === index ? 'rotate-180' : ''}`}>
                    <ChevronDown className="h-5 w-5" />
                  </div>
                </CardTitle>
              </CardHeader>

              {expandedCard === index && (
                <CardContent className="space-y-6 pt-6 bg-white/50">
                  {/* Problems Section */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-700 flex items-center gap-2 text-sm uppercase tracking-wide">
                      <AlertTriangle className="h-4 w-4" />
                      Common Struggles:
                    </h4>
                    <div className="space-y-2">
                      {struggle.problems.map((problem, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50/80 rounded-lg border border-gray-100">
                          <div className="h-2 w-2 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{problem}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Solution Section */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className={`bg-gradient-to-r ${struggle.gradient} p-6 rounded-xl border ${struggle.borderColor}`}>
                      <h4 className={`font-semibold ${struggle.textColor} text-sm mb-3 flex items-center gap-2 uppercase tracking-wide`}>
                        <span className="text-lg">{struggle.solutionIcon}</span>
                        Memory-First Solution:
                      </h4>
                      <p className={`text-sm ${struggle.accentColor} leading-relaxed font-medium`}>
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

      {/* Elegant CTA Section */}
      <div className="bg-white/95 backdrop-blur-sm p-10 rounded-2xl shadow-xl border border-white/20 text-center space-y-8">
        <div className="space-y-4">
          <h3 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-3">
            <span className="text-3xl">✨</span>
            Ready to Stop Fighting Your Memory?
          </h3>
          <p className="text-xl text-emerald-700 max-w-2xl mx-auto font-medium">
            Join 1,000+ brain injury survivors who work <em>with</em> their memory challenges
          </p>
        </div>

        {/* Elegant Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <div className="flex items-center gap-3 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
            <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
            <span className="text-sm font-medium text-emerald-700">No overwhelming features</span>
          </div>
          <div className="flex items-center gap-3 bg-brain-health-50 p-4 rounded-xl border border-brain-health-100">
            <CheckCircle className="h-5 w-5 text-brain-health-600 flex-shrink-0" />
            <span className="text-sm font-medium text-brain-health-700">Family-friendly design</span>
          </div>
          <div className="flex items-center gap-3 bg-clarity-teal-50 p-4 rounded-xl border border-clarity-teal-100">
            <CheckCircle className="h-5 w-5 text-clarity-teal-600 flex-shrink-0" />
            <span className="text-sm font-medium text-clarity-teal-700">Built by someone who gets it</span>
          </div>
        </div>

        {/* Professional CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
            🧠 Start Your Journey
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" className="border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-semibold">
            <Eye className="h-4 w-4 mr-2" />
            See It In Action
          </Button>
        </div>
      </div>

      {/* Feature Showcase Section */}
      <FeatureShowcaseSection />
    </section>
  );
}
