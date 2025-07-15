
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Heart, Star, ChevronDown, Leaf } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function MyRhythmIntro() {
  const frameworkSteps = [
    {
      letter: 'M',
      word: 'Mindset',
      phase: 'Moment of Impact',
      description: 'Acknowledge where you are right now. This is your starting point, not your end point. Every journey begins with honest recognition of the present moment.',
      icon: '🧠'
    },
    {
      letter: 'Y',
      word: 'Yearning', 
      phase: 'Yield to the Fog',
      description: 'Allow yourself to feel confused, overwhelmed, or uncertain. This is natural and necessary. Healing begins when we stop fighting the fog and start moving through it gently.',
      icon: '🌟'
    },
    {
      letter: 'R',
      word: 'Routine',
      phase: 'Reckon with Reality', 
      description: 'Face the truth of your situation with compassion. Understanding your new reality empowers you to work with it, not against it.',
      icon: '⚖️'
    },
    {
      letter: 'H',
      word: 'Health',
      phase: 'Harness Support',
      description: 'Build your support network and prioritize your physical and mental wellbeing. You don\'t have to do this alone—strength comes from connection.',
      icon: '💚'
    },
    {
      letter: 'Y',
      word: 'Yield',
      phase: 'Yield to Progress',
      description: 'Embrace small wins and gradual improvement. Progress isn\'t always linear, and that\'s perfectly okay. Every step forward matters.',
      icon: '🌱'
    },
    {
      letter: 'T',
      word: 'Thrive',
      phase: 'Take Back Control',
      description: 'Reclaim agency over your life through structure, routine, and intentional choices. This is where you start to feel like yourself again.',
      icon: '✨'
    },
    {
      letter: 'H',
      word: 'Heal',
      phase: 'Heal Forward',
      description: 'Move beyond recovery into growth. Use your experience to build resilience, wisdom, and a deeper understanding of your own strength.',
      icon: '🕊️'
    },
    {
      letter: 'M',
      word: 'Multiply',
      phase: 'Multiply the Mission',
      description: 'Share your journey and support others. Your story becomes a beacon of hope, multiplying the impact of your healing journey.',
      icon: '🌍'
    }
  ];

  return (
    <section id="myrhythm-framework" className="py-20 bg-gradient-to-b from-white via-memory-emerald-50/30 to-clarity-teal-50/20 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-memory-emerald-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-clarity-teal-200 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-brain-health-200 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-6 max-w-6xl relative">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-memory-emerald-500 to-clarity-teal-500 rounded-full shadow-lg">
              <Star className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl font-light text-brain-health-800 tracking-wide">
              The MyRhythm Framework
            </h2>
          </div>
          <p className="text-xl text-brain-health-600 max-w-3xl mx-auto font-light leading-relaxed">
            An evidence-based 8-step system crafted from lived experience to help you reclaim your rhythm and thrive.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 mb-16">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-r from-brain-health-500 to-memory-emerald-500 rounded-full shadow-md">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-medium text-brain-health-800">Born from Experience</h3>
              </div>
              <p className="text-brain-health-600 leading-relaxed font-light">
                Created by cognitive wellness champions who understand the journey firsthand. 
                MyRhythm transforms real challenges into practical solutions that work.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-r from-memory-emerald-500 to-clarity-teal-500 rounded-full shadow-md">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-medium text-memory-emerald-800">Your Personal Guide</h3>
              </div>
              <p className="text-memory-emerald-600 leading-relaxed font-light">
                Whether navigating brain injury recovery, optimizing performance, or supporting a loved one—
                MyRhythm adapts to your unique needs and goals.
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Enhanced Framework Steps Visual */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-xl border border-memory-emerald-100 mb-12">
          <h3 className="text-2xl font-light mb-8 text-brain-health-800 text-center">The 8 Steps of MyRhythm</h3>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-6 mb-8">
            {['M', 'Y', 'R', 'H', 'Y', 'T', 'H', 'M'].map((letter, index) => (
              <div key={index} className="relative group">
                <div className="w-16 h-16 bg-gradient-to-r from-memory-emerald-500 to-clarity-teal-500 text-white rounded-2xl flex items-center justify-center font-medium text-lg shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  {letter}
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-memory-emerald-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>
          <p className="text-brain-health-600 text-center font-light leading-relaxed">
            A structured pathway from impact to empowerment, designed to help you discover and strengthen your personal rhythm.
          </p>
        </div>

        {/* Refined Framework Details */}
        <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
          <CardContent className="p-8">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="framework-details" className="border-0">
                <AccordionTrigger className="text-xl font-light text-brain-health-700 hover:text-brain-health-600 pb-6">
                  <div className="flex items-center gap-3">
                    <Leaf className="h-6 w-6 text-memory-emerald-600" />
                    Explore the Complete 8-Step Framework
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-8 pt-6">
                    <p className="text-brain-health-600 mb-8 font-light leading-relaxed">
                      Each step of MyRhythm represents a phase in your journey from challenge to empowerment. 
                      Discover how this framework can guide your path to wellness.
                    </p>
                    
                    <div className="grid gap-6">
                      {frameworkSteps.map((step, index) => (
                        <div key={index} className="flex gap-6 p-6 bg-gradient-to-r from-memory-emerald-50/50 to-clarity-teal-50/30 rounded-2xl border border-memory-emerald-100/50 hover:shadow-md transition-all duration-300">
                          <div className="flex-shrink-0 flex flex-col items-center">
                            <div className="w-14 h-14 bg-gradient-to-r from-memory-emerald-500 to-clarity-teal-500 text-white rounded-xl flex items-center justify-center font-medium text-lg shadow-md">
                              {step.letter}
                            </div>
                            <div className="text-2xl mt-2">{step.icon}</div>
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                              <h4 className="font-medium text-xl text-brain-health-800">{step.word}</h4>
                              <span className="text-sm text-memory-emerald-600 font-light">• {step.phase}</span>
                            </div>
                            <p className="text-brain-health-600 leading-relaxed font-light">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-10 p-6 bg-gradient-to-r from-memory-emerald-50 to-clarity-teal-50 rounded-2xl border border-memory-emerald-200/50">
                      <p className="text-sm text-brain-health-600 italic text-center font-light">
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
