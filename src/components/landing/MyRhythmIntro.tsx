
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Heart, Star } from "lucide-react";

export function MyRhythmIntro() {
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
        
        {/* Simplified framework steps */}
        <div className="bg-gradient-to-r from-primary/10 to-purple/10 rounded-xl p-8 text-center">
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
      </div>
    </section>
  );
}
