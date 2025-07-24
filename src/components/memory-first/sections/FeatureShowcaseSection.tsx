import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, Users, BarChart3, CheckCircle } from "lucide-react";

export function FeatureShowcaseSection() {
  const featureShowcases = [
    {
      category: "Daily Life Solutions",
      emoji: "🏠",
      color: "border-amber-200 bg-amber-50",
      textColor: "text-amber-800",
      features: [
        {
          title: "Smart Calendar with Memory Aids",
          description: "Visual time blocking with gentle reminders",
          image: "/api/placeholder/400/250", // Placeholder for actual screenshots
          metrics: "95% reduction in missed appointments",
          icon: Calendar
        },
        {
          title: "Medication & Task Tracking", 
          description: "Photo-based reminders that actually work",
          image: "/api/placeholder/400/250",
          metrics: "98% medication adherence rate",
          icon: CheckCircle
        }
      ]
    },
    {
      category: "Family Life Coordination",
      emoji: "👨‍👩‍👧‍👦",
      color: "border-purple-200 bg-purple-50",
      textColor: "text-purple-800",
      features: [
        {
          title: "Shared Family Dashboard",
          description: "Everyone stays informed without micromanaging",
          image: "/api/placeholder/400/250",
          metrics: "Family stress reduced by 60%",
          icon: Users
        },
        {
          title: "Watcher System",
          description: "Gentle oversight without losing independence",
          image: "/api/placeholder/400/250", 
          metrics: "Autonomy maintained in 90% of users",
          icon: Users
        }
      ]
    },
    {
      category: "Medical Team Integration",
      emoji: "🩺", 
      color: "border-blue-200 bg-blue-50",
      textColor: "text-blue-800",
      features: [
        {
          title: "Symptom & Progress Tracking",
          description: "Simple logging that gives clear insights",
          image: "/api/placeholder/400/250",
          metrics: "Healthcare visits 3x more productive",
          icon: BarChart3
        },
        {
          title: "Report Generation",
          description: "Automated summaries for your care team",
          image: "/api/placeholder/400/250",
          metrics: "Doctors love the clear progress data",
          icon: BarChart3
        }
      ]
    }
  ];

  return (
    <section className="space-y-12">
      <div className="text-center space-y-4">
        <Badge variant="outline" className="text-blue-600 border-blue-200 px-4 py-2">
          <CheckCircle className="h-4 w-4 mr-2" />
          See It In Action
        </Badge>
        
        <h2 className="text-3xl md:text-4xl font-bold">
          Real Solutions for
          <br />
          <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
            The Three Big Challenges
          </span>
        </h2>
        
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          See exactly how MyRhythm addresses each challenge with brain-friendly design
        </p>
      </div>

      {featureShowcases.map((showcase, index) => (
        <div key={index} className="space-y-6">
          {/* Category Header */}
          <div className={`${showcase.color} p-6 rounded-lg border-2`}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{showcase.emoji}</span>
              <div>
                <h3 className={`text-2xl font-bold ${showcase.textColor}`}>
                  {showcase.category}
                </h3>
                <p className={`${showcase.textColor} opacity-80`}>
                  Memory-first solutions that actually work
                </p>
              </div>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {showcase.features.map((feature, featureIndex) => (
              <Card key={featureIndex} className="overflow-hidden group hover:shadow-lg transition-shadow">
                {/* Feature Image/Screenshot Placeholder */}
                <div className="relative h-48 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <feature.icon className="h-12 w-12 text-muted-foreground mx-auto" />
                    <p className="text-sm text-muted-foreground">Screenshot Coming Soon</p>
                    <p className="text-xs text-muted-foreground">
                      Live feature in app: {feature.title}
                    </p>
                  </div>
                  
                  {/* Overlay for future images */}
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors"></div>
                </div>
                
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      {feature.metrics}
                    </Badge>
                    
                    <Button variant="ghost" size="sm" className="text-primary">
                      Try This Feature
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {/* Call to Action */}
      <div className="text-center bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-lg border border-green-200">
        <h3 className="text-2xl font-bold mb-4">
          Ready to Experience These Solutions?
        </h3>
        <p className="text-lg text-green-700 mb-6 max-w-2xl mx-auto">
          See how MyRhythm transforms these three major challenges into manageable, empowering experiences
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-green-600 hover:bg-green-700">
            🚀 Start Your Free Trial
          </Button>
          <Button size="lg" variant="outline" className="border-green-300 text-green-600">
            📸 See More Screenshots
          </Button>
        </div>
      </div>
    </section>
  );
}