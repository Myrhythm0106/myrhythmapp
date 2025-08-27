
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, CheckCircle2, Heart, HeartHandshake, Lightbulb, Star } from "lucide-react";

export function WhyMyRhythmSection() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Star className="h-5 w-5 text-primary" />
        Why MyRhythm for Brain Recovery?
      </h2>
      
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <p className="text-lg">
              ✨ Built for Brain Recovery. Backed by Real Experience.
            </p>
            
            <p>
              Whether you're living with memory challenges, supporting someone who is, or delivering care, 
              MyRhythm offers a simple, supportive way to bring structure and calm to each day.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="bg-blue-50 p-3 rounded-lg inline-flex">
                  <Brain className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-lg font-medium">For Individuals</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-500 mt-1" />
                    <span>Stay On Track: Daily reminders, routines, and goals at your pace</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-500 mt-1" />
                    <span>Regain Confidence: Celebrate progress and rebuild trust in your memory</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <div className="bg-purple-50 p-3 rounded-lg inline-flex">
                  <Heart className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="text-lg font-medium">For Family & Carers</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-purple-500 mt-1" />
                    <span>See the Day, Stay Connected: View schedules and add notes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-purple-500 mt-1" />
                    <span>Be a Partner, Not a Planner: Support without burnout</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <div className="bg-green-50 p-3 rounded-lg inline-flex">
                  <HeartHandshake className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="text-lg font-medium">For Professionals</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-1" />
                    <span>See engagement patterns users choose to share</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-1" />
                    <span>Support holistic wellness approaches</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg space-y-2 mt-4">
              <h3 className="font-medium flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                How different features work together
              </h3>
              <p className="text-sm text-muted-foreground">
                Your daily check-ins help identify energy patterns, which inform your routine timing, 
                while brain games strengthen cognitive skills needed for daily tasks.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
