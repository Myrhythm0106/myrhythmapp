
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, Presentation, Users, TrendingUp, Heart } from "lucide-react";

export function InvestorDemoScript() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const demoSections = [
    {
      id: "opening",
      title: "Opening Hook (2 min)",
      icon: Presentation,
      points: [
        "40M Americans live with cognitive challenges",
        "Rehab ends, but recovery continues for life",
        "MyRhythm bridges the gap between clinical care and daily life",
        "Show landing page - emphasize brain health focus"
      ]
    },
    {
      id: "problem",
      title: "The Problem (3 min)",
      icon: Heart,
      points: [
        "Current solutions are clinical, not lifestyle-focused",
        "Families feel helpless after formal rehab ends",
        "No accountability system for ongoing recovery",
        "Demonstrate onboarding flow - personalized approach"
      ]
    },
    {
      id: "solution",
      title: "Our Solution (5 min)",
      icon: TrendingUp,
      points: [
        "LEAP methodology: Learn, Engage, Adapt, Protect",
        "Show Brain Recovery page - professional medical approach",
        "Personal Empowerment Hub - daily wins & accountability",
        "Family/caregiver integration - shared journey"
      ]
    },
    {
      id: "market",
      title: "Market Opportunity (2 min)",
      icon: Users,
      points: [
        "$4B cognitive wellness market growing 8% annually",
        "Rehab centers need post-discharge solutions",
        "Insurance companies want outcome-based tools",
        "Show subscription model - recurring revenue"
      ]
    }
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Presentation className="h-5 w-5" />
          Investor Demo Script
        </CardTitle>
        <Badge variant="outline" className="w-fit">
          Total Time: 12 minutes
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {demoSections.map((section) => {
          const Icon = section.icon;
          const isExpanded = expandedSection === section.id;
          
          return (
            <div key={section.id} className="border rounded-lg p-4">
              <Button
                variant="ghost"
                className="w-full justify-between p-0 h-auto"
                onClick={() => setExpandedSection(isExpanded ? null : section.id)}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-teal-600" />
                  <span className="font-medium">{section.title}</span>
                </div>
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
              
              {isExpanded && (
                <div className="mt-4 space-y-2">
                  {section.points.map((point, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm text-slate-700">{point}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        
        <div className="mt-6 p-4 bg-teal-50 rounded-lg border border-teal-200">
          <h3 className="font-semibold text-teal-900 mb-2">Key Value Props to Emphasize:</h3>
          <ul className="text-sm text-teal-800 space-y-1">
            <li>• First-mover advantage in post-rehab cognitive wellness</li>
            <li>• Recurring revenue model with high user retention</li>
            <li>• Scalable B2B2C model through rehab center partnerships</li>
            <li>• Data-driven outcomes for insurance reimbursement</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
