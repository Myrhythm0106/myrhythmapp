
import React from "react";
import { 
  Lightbulb, 
  Calendar, 
  RotateCw,
  Search, 
  Heart, 
  BrainCircuit, 
  HelpingHand,
  Waves
} from "lucide-react";

export function MyRhythmIntro() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
            Discover Your MYRHYTHM
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We've broken down key strategies into a simple, memorable guide: MYRHYTHM. 
            These aren't rigid rules, but suggestions to help you build structure, focus, 
            and peace into your everyday.
          </p>
        </div>
        
        <div className="flex justify-center">
          <div className="relative w-full max-w-2xl">
            {/* MYRHYTHM Visual - Centered logo with icons arranged in a circular pattern */}
            <div className="bg-blue-50 rounded-full p-8 w-40 h-40 mx-auto flex items-center justify-center">
              <h3 className="text-xl font-bold text-primary">MYRHYTHM</h3>
            </div>
            
            {/* Icons arranged in a circular pattern around MYRHYTHM */}
            <div className="absolute -top-4 left-1/2 -ml-10">
              <div className="bg-white p-3 rounded-full shadow-md">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="absolute top-8 right-12 md:right-24">
              <div className="bg-white p-3 rounded-full shadow-md">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="absolute top-20 -right-4 md:right-10">
              <div className="bg-white p-3 rounded-full shadow-md">
                <RotateCw className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="absolute bottom-20 -right-4 md:right-10">
              <div className="bg-white p-3 rounded-full shadow-md">
                <Search className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="absolute bottom-8 right-12 md:right-24">
              <div className="bg-white p-3 rounded-full shadow-md">
                <Heart className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="absolute -bottom-4 left-1/2 -ml-10">
              <div className="bg-white p-3 rounded-full shadow-md">
                <BrainCircuit className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="absolute bottom-8 left-12 md:left-24">
              <div className="bg-white p-3 rounded-full shadow-md">
                <HelpingHand className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="absolute bottom-20 -left-4 md:left-10">
              <div className="bg-white p-3 rounded-full shadow-md">
                <Waves className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="absolute top-20 -left-4 md:left-10">
              <div className="bg-white p-3 rounded-full shadow-md">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="absolute top-8 left-12 md:left-24">
              <div className="bg-white p-3 rounded-full shadow-md">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
