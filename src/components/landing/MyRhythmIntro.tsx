
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Heart, Star, Zap } from "lucide-react";

export function MyRhythmIntro() {
  return (
    <section id="discover-myrhythm" className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-primary flex items-center justify-center gap-2">
            <Star className="h-8 w-8" />
            Discover Your Empowering MyRhythm
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            More than an app—it's your personal empowerment companion, designed to help you thrive and flourish in every aspect of life.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="border-primary/20 bg-gradient-to-br from-blue-50 to-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/20 p-2 rounded-full">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Cognitive Wellness Champion</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Born from the lived experience of cognitive wellness transformation, MyRhythm empowers you to turn challenges into strengths. 
                Whether you're navigating brain injury recovery, optimizing mental performance, or supporting a loved one—you're capable of amazing things.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-primary/20 bg-gradient-to-br from-purple-50 to-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/20 p-2 rounded-full">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Your Personal Growth Partner</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                MyRhythm believes in your potential. Through personalized tools, empowering insights, and a supportive community, 
                we help you build confidence, create structure, and celebrate every step of your thriving journey.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-12 bg-gradient-to-r from-primary/10 to-purple/10 rounded-xl p-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-bold">Your Rhythm, Your Power</h3>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every person has a unique rhythm—a way of thinking, feeling, and moving through the world that, when honored and supported, 
            becomes their greatest strength. MyRhythm helps you discover, embrace, and thrive within your personal rhythm.
          </p>
        </div>
      </div>
    </section>
  );
}
