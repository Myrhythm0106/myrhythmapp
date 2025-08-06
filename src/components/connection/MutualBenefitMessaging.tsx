
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, Heart, Lightbulb, Users, Star } from "lucide-react";

export function MutualBenefitMessaging() {
  const benefitsYouGive = [
    {
      icon: Heart,
      title: "Hope & Inspiration",
      description: "Your progress gives family members hope and shows them recovery is possible.",
      example: "When you complete a therapy session, your partner feels hopeful about your journey together."
    },
    {
      icon: Lightbulb,
      title: "Learning & Growth",
      description: "Your journey teaches others about resilience, adaptation, and what truly matters.",
      example: "Your creative problem-solving inspires your children to think differently about challenges."
    },
    {
      icon: Users,
      title: "Stronger Relationships",
      description: "Facing challenges together deepens bonds and creates more meaningful connections.",
      example: "Your honest communication about struggles helps your family become more open and supportive."
    },
    {
      icon: Star,
      title: "Purpose & Meaning",
      description: "Supporting you gives your circle a sense of purpose and the joy of making a real difference.",
      example: "Your friend feels fulfilled knowing their encouragement helps you take on new challenges."
    }
  ];

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="text-center space-y-3">
          <Badge variant="outline" className="text-green-600 border-green-200">
            <Gift className="h-3 w-3 mr-1" />
            The Gift You Give
          </Badge>
          
          <h3 className="text-2xl font-bold">
            You're Not Just Receiving—You're Giving
          </h3>
          
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your recovery journey enriches the lives of everyone around you. 
            Here's how your courage and progress make a difference:
          </p>
        </div>

        <div className="space-y-6">
          {benefitsYouGive.map((benefit, index) => (
            <div key={index} className="flex gap-4 p-4 bg-green-50/50 rounded-lg border border-green-100">
              <div className="bg-green-100 p-3 rounded-full h-fit">
                <benefit.icon className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1 space-y-2">
                <h4 className="font-semibold text-green-800">{benefit.title}</h4>
                <p className="text-sm text-green-700">{benefit.description}</p>
                <div className="bg-white/80 p-3 rounded border border-green-200">
                  <p className="text-xs text-green-600 italic">
                    💡 Example: {benefit.example}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200 text-center">
          <h4 className="font-semibold text-green-800 mb-2">
            Remember: Your Journey Matters
          </h4>
          <p className="text-sm text-green-700">
            Every step forward, every challenge faced, every small victory creates ripples of 
            positive impact that extend far beyond what you can see. Your courage gives others 
            permission to be brave too.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
