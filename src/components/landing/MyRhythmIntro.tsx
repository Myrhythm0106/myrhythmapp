
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Heart, Star, ChevronDown, Leaf } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function MyRhythmIntro() {
  // Updated MYRHYTHM Framework - Empowering & Bright
  const frameworkSteps = [
    {
      letter: 'M',
      word: 'MINDSET',
      phase: 'Memory-Aware Mindset Foundation',
      description: 'Build cognitive confidence and self-awareness as your foundation for growth and empowerment.',
      icon: '🧠'
    },
    {
      letter: 'Y',
      word: 'Yield', 
      phase: 'Acknowledge Your Current Reality',
      description: 'Honor where you are in your recovery journey without judgment—this is your starting point for transformation.',
      icon: '🌟'
    },
    {
      letter: 'R',
      word: 'Restore',
      phase: 'Rhythm-Based Energy Management', 
      description: 'Map your cognitive peaks and rest periods to work with your brain\'s natural energy patterns.',
      icon: '⚡'
    },
    {
      letter: 'H',
      word: 'Harness',
      phase: 'Hope Through Community Support',
      description: 'Build your circle of care and maintain independence—support systems that empower, not enable.',
      icon: '💪'
    },
    {
      letter: 'Y',
      word: 'Yield',
      phase: 'Your Small Victories Matter',
      description: 'Celebrate every step forward, no matter how small—progress tracking that builds unstoppable confidence.',
      icon: '🎉'
    },
    {
      letter: 'T',
      word: 'Take',
      phase: 'Transform Your Daily Experience',
      description: 'Reclaim agency in your life through reliable memory anchors and external systems you can trust.',
      icon: '✨'
    },
    {
      letter: 'H',
      word: 'Heal',
      phase: 'Hope, Growth & Cognitive Strengthening',
      description: 'Gentle brain exercises that build resilience and recovery-focused cognitive enhancement.',
      icon: '🌈'
    },
    {
      letter: 'M',
      word: 'Multiply',
      phase: 'Mission to Share & Inspire',
      description: 'Transform your experience into hope for others—become an advocate and share your inspiring journey.',
      icon: '🌍'
    }
  ];

  return (
    <section id="myrhythm-framework" className="py-20 bg-gradient-to-b from-purple-50/60 via-blue-50/50 to-teal-50/60 relative overflow-hidden">
      {/* Bright, energizing background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-teal-300 to-purple-300 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-6 max-w-6xl relative">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 rounded-full shadow-lg">
              <Star className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent tracking-wide">
              The MYRHYTHM Framework
            </h2>
          </div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium leading-relaxed">
            An empowering 8-step system that transforms your memory recovery into unstoppable momentum and life transformation.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 mb-16">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white via-purple-50/30 to-blue-50/20 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 rounded-full shadow-md">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Born from Experience</h3>
              </div>
              <p className="text-gray-700 leading-relaxed font-medium">
                Created by cognitive wellness champions who understand the journey firsthand. 
                MYRHYTHM transforms real challenges into practical, empowering solutions that work.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white via-blue-50/30 to-teal-50/20 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-r from-blue-500 via-teal-500 to-purple-500 rounded-full shadow-md">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">Your Personal Guide</h3>
              </div>
              <p className="text-gray-700 leading-relaxed font-medium">
                Whether navigating brain injury recovery, optimizing performance, or supporting a loved one—
                MYRHYTHM adapts to your unique needs and transforms your journey into triumph.
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Enhanced MYRHYTHM Framework Steps Visual */}
        <div className="bg-gradient-to-br from-white via-purple-50/40 to-blue-50/30 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border border-purple-200/40 mb-12">
          <h3 className="text-2xl font-bold mb-8 bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent text-center">The 8 Steps of MYRHYTHM</h3>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-6 mb-8">
            {['M', 'Y', 'R', 'H', 'Y', 'T', 'H', 'M'].map((letter, index) => (
              <div key={index} className="relative group">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  {letter}
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity animate-pulse"></div>
              </div>
            ))}
          </div>
          <p className="text-gray-700 text-center font-medium leading-relaxed">
            A powerful pathway from challenge to empowerment, designed to help you discover and strengthen your unstoppable personal rhythm.
          </p>
        </div>

        {/* Refined Framework Details */}
        <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
          <CardContent className="p-8">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="framework-details" className="border-0">
                <AccordionTrigger className="text-xl font-light text-foreground hover:text-primary pb-6">
                  <div className="flex items-center gap-3">
                    <Leaf className="h-6 w-6 text-memory-emerald-600" />
                    Explore the Complete 8-Step Framework
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-8 pt-6">
                    <p className="text-muted-foreground mb-8 font-light leading-relaxed">
                      Each step of MyRhythm represents a phase in your journey from challenge to empowerment. 
                      Discover how this framework can guide your path to wellness.
                    </p>
                    
                    <div className="grid gap-6">
                      {frameworkSteps.map((step, index) => (
                        <div key={index} className="flex gap-6 p-6 bg-gradient-to-r from-memory-emerald-50/50 to-clarity-teal-50/30 rounded-2xl border border-memory-emerald-100/50 hover:shadow-md transition-all duration-300">
                          <div className="flex-shrink-0 flex flex-col items-center">
                            <div className="w-14 h-14 bg-gradient-to-r from-primary to-brain-health-500 text-white rounded-xl flex items-center justify-center font-medium text-lg shadow-md">
                              {step.letter}
                            </div>
                            <div className="text-2xl mt-2">{step.icon}</div>
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                              <h4 className="font-medium text-xl text-foreground">{step.word}</h4>
                              <span className="text-sm text-brain-health-600 font-light">• {step.phase}</span>
                            </div>
                            <p className="text-muted-foreground leading-relaxed font-light">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-10 p-6 bg-gradient-to-r from-memory-emerald-50 to-clarity-teal-50 rounded-2xl border border-memory-emerald-200/50">
                      <p className="text-sm text-muted-foreground italic text-center font-light">
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
