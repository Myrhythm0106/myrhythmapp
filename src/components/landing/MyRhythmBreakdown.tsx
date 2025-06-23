
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Calendar, Users, Target, BookOpen, Mic, Star, Zap } from "lucide-react";

const features = [
  {
    icon: <Brain className="h-6 w-6 text-primary" />,
    title: "Cognitive Strengthening",
    description: "Empowering brain exercises and activities designed to enhance your cognitive abilities and build confidence in your mental capabilities."
  },
  {
    icon: <Calendar className="h-6 w-6 text-primary" />,
    title: "Life Organization Mastery",
    description: "Smart scheduling and reminder systems that help you create structure, reduce overwhelm, and build momentum in your daily life."
  },
  {
    icon: <Users className="h-6 w-6 text-primary" />,
    title: "Empowering Support Network",
    description: "Connect with a thriving community and invite your personal support circle to celebrate your progress and share in your journey."
  },
  {
    icon: <Target className="h-6 w-6 text-primary" />,
    title: "Achievement Goal System",
    description: "Set, track, and celebrate meaningful goals that align with your values and help you build the life you want to live."
  },
  {
    icon: <BookOpen className="h-6 w-6 text-primary" />,
    title: "Growth Resource Library",
    description: "Access evidence-based tools, inspiring content, and educational resources designed to support your cognitive wellness and personal growth."
  },
  {
    icon: <Mic className="h-6 w-6 text-primary" />,
    title: "Voice Reflection & Sharing",
    description: "Capture your thoughts, track your progress, and share important insights with your healthcare team or support network as you choose."
  }
];

export function MyRhythmBreakdown() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-primary flex items-center justify-center gap-2">
            <Zap className="h-8 w-8" />
            Your Empowerment Toolkit
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the comprehensive suite of tools designed to empower your cognitive wellness journey and help you thrive.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-primary/10 hover:border-primary/30 transition-all hover:shadow-lg group">
              <CardContent className="p-6 text-center">
                <div className="bg-primary/10 group-hover:bg-primary/20 transition-colors p-3 rounded-full w-fit mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center bg-gradient-to-r from-primary/5 to-purple/5 rounded-xl p-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-bold">Built by Champions, For Champions</h3>
          </div>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Every feature in MyRhythm was created by people who understand the journey firsthand. 
            We've transformed our own challenges into strengths, and now we're here to empower you to do the same. 
            You have everything you need within you—MyRhythm simply helps you unlock it.
          </p>
        </div>
      </div>
    </section>
  );
}
