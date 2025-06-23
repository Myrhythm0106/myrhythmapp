
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Heart, Star, ChevronDown } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function MyRhythmIntro() {
  const frameworkSteps = [
    {
      letter: 'M',
      word: 'Mindset',
      phase: 'Moment of Impact',
      description: 'Acknowledge where you are right now. This is your starting point, not your end point. Every journey begins with honest recognition of the present moment.'
    },
    {
      letter: 'Y',
      word: 'Yearning', 
      phase: 'Yield to the Fog',
      description: 'Allow yourself to feel confused, overwhelmed, or uncertain. This is natural and necessary. Healing begins when we stop fighting the fog and start moving through it gently.'
    },
    {
      letter: 'R',
      word: 'Routine',
      phase: 'Reckon with Reality', 
      description: 'Face the truth of your situation with compassion. Understanding your new reality empowers you to work with it, not against it.'
    },
    {
      letter: 'H',
      word: 'Health',
      phase: 'Harness Support',
      description: 'Build your support network and prioritize your physical and mental wellbeing. You don\'t have to do this alone—strength comes from connection.'
    },
    {
      letter: 'Y',
      word: 'Yield',
      phase: 'Yield to Progress',
      description: 'Embrace small wins and gradual improvement. Progress isn\'t always linear, and that\'s perfectly okay. Every step forward matters.'
    },
    {
      letter: 'T',
      word: 'Thrive',
      phase: 'Take Back Control',
      description: 'Reclaim agency over your life through structure, routine, and intentional choices. This is where you start to feel like yourself again.'
    },
    {
      letter: 'H',
      word: 'Heal',
      phase: 'Heal Forward',
      description: 'Move beyond recovery into growth. Use your experience to build resilience, wisdom, and a deeper understanding of your own strength.'
    },
    {
      letter: 'M',
      word: 'Multiply',
      phase: 'Multiply the Mission',
      description: 'Share your journey and support others. Your story becomes a beacon of hope, multiplying the impact of your healing journey.'
    }
  ];

  return (
    <section id="myrhythm-framework" className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-primary flex items-center justify-center gap-2">
            <Star className="h-8 w-8" />
            The MyRhythm Framework
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            An evidence-based 8-step system crafted from lived experience to help you reclaim your rhythm and thrive.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 mb-12">
          <Card className="border-primary/20 bg-gradient-to-br from-blue-50 to-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/20 p-2 rounded-full">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Born from Experience</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Created by cognitive wellness champions who understand the journey firsthand. 
                MyRhythm transforms real challenges into practical solutions that work.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-primary/20 bg-gradient-to-br from-purple-50 to-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/20 p-2 rounded-full">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Your Personal Guide</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Whether navigating brain injury recovery, optimizing performance, or supporting a loved one—
                MyRhythm adapts to your unique needs and goals.
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Framework steps visual */}
        <div className="bg-gradient-to-r from-primary/10 to-purple/10 rounded-xl p-8 text-center mb-8">
          <h3 className="text-xl font-bold mb-4">The 8 Steps of MyRhythm</h3>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4 mb-6">
            {['M', 'Y', 'R', 'H', 'Y', 'T', 'H', 'M'].map((letter, index) => (
              <div key={index} className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                {letter}
              </div>
            ))}
          </div>
          <p className="text-muted-foreground">
            A structured pathway from impact to empowerment, designed to help you discover and strengthen your personal rhythm.
          </p>
        </div>

        {/* Detailed framework explanation */}
        <Card className="border-primary/20">
          <CardContent className="p-6">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="framework-details">
                <AccordionTrigger className="text-lg font-semibold text-primary hover:text-primary/80">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Explore the Complete 8-Step Framework
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-6 pt-4">
                    <p className="text-muted-foreground mb-6">
                      Each step of MyRhythm represents a phase in your journey from challenge to empowerment. 
                      Click through to understand how this framework can guide your path to wellness.
                    </p>
                    
                    <div className="grid gap-6">
                      {frameworkSteps.map((step, index) => (
                        <div key={index} className="flex gap-4 p-4 bg-gradient-to-r from-muted/20 to-transparent rounded-lg">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
                              {step.letter}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                              <h4 className="font-bold text-lg text-foreground">{step.word}</h4>
                              <span className="text-sm text-primary font-medium">• {step.phase}</span>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <p className="text-sm text-muted-foreground italic text-center">
                        💡 <strong>Remember:</strong> Your journey through these steps isn't linear. You might find yourself revisiting earlier steps, and that's completely normal. MyRhythm is designed to meet you wherever you are in your journey.
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
