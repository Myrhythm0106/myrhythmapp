
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Brain, Target, RefreshCw, Eye, Heart, ArrowRight } from "lucide-react";

export function MyRhythmIntro() {
  const navigate = useNavigate();

  return (
    <section id="discover-myrhythm" className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl mb-6 text-foreground font-bold md:text-4xl">Discover MyRhythm</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            MyRhythm is more than a method—it's a gentle framework designed to help you rebuild 
            structure and confidence in your daily life. Each letter represents a key principle 
            for creating sustainable, meaningful progress.
          </p>
        </div>
        
        {/* Visual MYRHYTHM Display */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8 mb-12">
          <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
            {['M', 'Y', 'R', 'H', 'Y', 'T', 'H', 'M'].map((letter, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mb-2">
                  {letter}
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <h3 className="text-2xl font-bold text-primary mb-4">M-Y-R-H-Y-T-H-M</h3>
            <p className="text-lg text-muted-foreground">
              A simple, memorable way to organize your thoughts, actions, and days
            </p>
          </div>
        </div>

        {/* Core Benefits Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="text-center p-6 border rounded-lg hover:shadow-md transition-all">
            <Brain className="h-12 w-12 text-primary mx-auto mb-4" />
            <h4 className="font-semibold mb-2">Cognitive Support</h4>
            <p className="text-sm text-muted-foreground">Gentle strategies that work with your brain, not against it</p>
          </div>
          
          <div className="text-center p-6 border rounded-lg hover:shadow-md transition-all">
            <Target className="h-12 w-12 text-primary mx-auto mb-4" />
            <h4 className="font-semibold mb-2">Clear Focus</h4>
            <p className="text-sm text-muted-foreground">Simple ways to identify and pursue what matters most</p>
          </div>
          
          <div className="text-center p-6 border rounded-lg hover:shadow-md transition-all">
            <RefreshCw className="h-12 w-12 text-primary mx-auto mb-4" />
            <h4 className="font-semibold mb-2">Sustainable Habits</h4>
            <p className="text-sm text-muted-foreground">Build routines that stick without overwhelming yourself</p>
          </div>
          
          <div className="text-center p-6 border rounded-lg hover:shadow-md transition-all">
            <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
            <h4 className="font-semibold mb-2">Self-Compassion</h4>
            <p className="text-sm text-muted-foreground">Progress over perfection, always at your own pace</p>
          </div>
        </div>

        {/* Why It Works */}
        <div className="bg-muted/30 rounded-xl p-8 mb-12">
          <div className="flex items-center gap-4 mb-6">
            <Eye className="h-8 w-8 text-primary" />
            <h3 className="text-2xl font-bold">Why MyRhythm Works</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2 text-primary">🧠 Brain-Friendly Design</h4>
              <p className="text-muted-foreground">Created with cognitive challenges in mind, every step is designed to reduce mental load while maximizing effectiveness.</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2 text-primary">🔄 Flexible Framework</h4>
              <p className="text-muted-foreground">Adapt the rhythm to your unique needs, energy levels, and circumstances—there's no one-size-fits-all approach.</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2 text-primary">📈 Progressive Growth</h4>
              <p className="text-muted-foreground">Start small and build confidence through consistent, manageable steps that compound over time.</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2 text-primary">💪 Evidence-Based</h4>
              <p className="text-muted-foreground">Built from real experiences and proven strategies that have helped countless individuals rebuild their lives.</p>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-6">
            Ready to see how MyRhythm applies to your daily life?
          </p>
          <Button 
            size="lg" 
            className="text-lg bg-primary hover:bg-primary/90 text-primary-foreground inline-flex items-center gap-2"
            onClick={() => {
              const breakdownSection = document.getElementById('myrhythm-breakdown');
              if (breakdownSection) {
                breakdownSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Explore Practical Applications <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
