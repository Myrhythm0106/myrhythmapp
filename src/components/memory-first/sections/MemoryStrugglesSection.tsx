import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, Users, Stethoscope, ArrowRight } from "lucide-react";

export function MemoryStrugglesSection() {
  const struggles = [
    {
      category: "Daily Life Chaos",
      icon: AlertTriangle,
      color: "text-red-500",
      bgColor: "bg-red-50",
      problems: [
        "Forgetting medications—again",
        "Missing important appointments",
        "Losing track of time and tasks",
        "Feeling overwhelmed by simple decisions",
        "Constant anxiety about forgetting something crucial"
      ],
      solution: "Memory-safe routines that work with your brain, not against it"
    },
    {
      category: "Family Strain",
      icon: Users,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      problems: [
        "Family becomes your external memory",
        "Constant checking and reminding creates tension",
        "Losing independence and autonomy",
        "Partners become exhausted caregivers",
        "Children worry about their parent's wellbeing"
      ],
      solution: "Shared visibility without micromanagement—family as partners, not managers"
    },
    {
      category: "Medical Disconnect",
      icon: Stethoscope,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      problems: [
        "Can't remember symptoms to report",
        "Struggle to track medication effectiveness",
        "Difficulty following complex treatment plans",
        "Appointments feel rushed and unproductive",
        "Healthcare team doesn't see daily reality"
      ],
      solution: "Simple tracking that gives your care team real insight into your daily experience"
    }
  ];

  return (
    <section className="space-y-8">
      <div className="text-center space-y-4">
        <Badge variant="outline" className="text-red-600 border-red-200">
          <AlertTriangle className="h-3 w-3 mr-1" />
          The Memory Struggle is Real
        </Badge>
        
        <h2 className="text-3xl md:text-4xl font-bold">
          You're Not Broken. The Tools Are.
        </h2>
        
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Standard productivity apps assume perfect memory. Life with memory challenges needs something completely different.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {struggles.map((struggle, index) => (
          <Card key={index} className="border-l-4 border-l-primary/30 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className={`${struggle.bgColor} p-2 rounded-lg`}>
                  <struggle.icon className={`h-6 w-6 ${struggle.color}`} />
                </div>
                <span className="text-lg">{struggle.category}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Problems */}
              <div className="space-y-2">
                <h4 className="font-medium text-muted-foreground text-sm uppercase tracking-wide">
                  Common Struggles:
                </h4>
                <ul className="space-y-2">
                  {struggle.problems.map((problem, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                      <span className="text-red-700">{problem}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Solution */}
              <div className="pt-4 border-t border-muted/30">
                <div className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-green-700 text-sm mb-1">
                      Our Memory-First Solution:
                    </h4>
                    <p className="text-sm text-green-600 leading-relaxed">
                      {struggle.solution}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-lg border border-blue-100 text-center">
        <h3 className="text-2xl font-semibold mb-4">
          Ready to Stop Fighting Your Memory?
        </h3>
        <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
          Join thousands who've discovered that working <em>with</em> memory challenges, 
          not against them, is the path to reclaimed confidence.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
          <span>✓ No overwhelming features</span>
          <span>✓ Family-friendly design</span>
          <span>✓ Built by someone who gets it</span>
        </div>
      </div>
    </section>
  );
}