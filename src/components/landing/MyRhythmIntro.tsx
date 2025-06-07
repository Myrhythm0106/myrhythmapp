
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
            MyRhythm is a simple yet powerful framework that transforms how you approach daily life. 
            Each letter represents a core principle that, when combined, creates a sustainable rhythm 
            for growth and recovery.
          </p>
        </div>
        
        {/* Visual MYRHYTHM Display */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-4 md:p-8 mb-12 overflow-x-auto">
          <div className="flex justify-center items-center gap-2 md:gap-4 mb-8 min-w-max mx-auto">
            {['M', 'Y', 'R', 'H', 'Y', 'T', 'H', 'M'].map((letter, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg md:text-2xl font-bold mb-2">
                  {letter}
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <h3 className="text-xl md:text-2xl font-bold text-primary mb-4 whitespace-nowrap">M-Y-R-H-Y-T-H-M</h3>
            <p className="text-base md:text-lg text-muted-foreground">
              A memorable framework for organizing your thoughts, actions, and daily rhythms
            </p>
          </div>
        </div>

        {/* Framework Overview */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">The Framework at a Glance</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Each letter in MYRHYTHM represents a fundamental principle that builds upon the others, 
              creating a comprehensive approach to personal growth and daily management.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary mb-2">M</div>
              <div className="text-sm font-semibold mb-1">Most Important</div>
              <div className="text-xs text-muted-foreground">Focus on what matters</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary mb-2">Y</div>
              <div className="text-sm font-semibold mb-1">Your Plan</div>
              <div className="text-xs text-muted-foreground">Create your structure</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary mb-2">R</div>
              <div className="text-sm font-semibold mb-1">Repeat</div>
              <div className="text-xs text-muted-foreground">Build consistency</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary mb-2">H</div>
              <div className="text-sm font-semibold mb-1">Hold Focus</div>
              <div className="text-xs text-muted-foreground">Maintain attention</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary mb-2">Y</div>
              <div className="text-sm font-semibold mb-1">Your Effort</div>
              <div className="text-xs text-muted-foreground">Celebrate progress</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary mb-2">T</div>
              <div className="text-sm font-semibold mb-1">Think Back</div>
              <div className="text-xs text-muted-foreground">Reflect and learn</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary mb-2">H</div>
              <div className="text-sm font-semibold mb-1">Help Your Life</div>
              <div className="text-xs text-muted-foreground">Create positive change</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary mb-2">M</div>
              <div className="text-sm font-semibold mb-1">My Rhythm</div>
              <div className="text-xs text-muted-foreground">Find your flow</div>
            </div>
          </div>
        </div>

        {/* Core Benefits Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="text-center p-6 border rounded-lg hover:shadow-md transition-all">
            <Brain className="h-12 w-12 text-primary mx-auto mb-4" />
            <h4 className="font-semibold mb-2">Brain-Friendly</h4>
            <p className="text-sm text-muted-foreground">Designed to work with cognitive challenges, not against them</p>
          </div>
          
          <div className="text-center p-6 border rounded-lg hover:shadow-md transition-all">
            <Target className="h-12 w-12 text-primary mx-auto mb-4" />
            <h4 className="font-semibold mb-2">Clear Direction</h4>
            <p className="text-sm text-muted-foreground">Simple framework to identify and pursue meaningful goals</p>
          </div>
          
          <div className="text-center p-6 border rounded-lg hover:shadow-md transition-all">
            <RefreshCw className="h-12 w-12 text-primary mx-auto mb-4" />
            <h4 className="font-semibold mb-2">Sustainable Growth</h4>
            <p className="text-sm text-muted-foreground">Build lasting habits without overwhelming yourself</p>
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
            <h3 className="text-2xl font-bold">Why This Framework Works</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2 text-primary">🎯 Structured Yet Flexible</h4>
              <p className="text-muted-foreground">Provides clear guidance while adapting to your unique needs and circumstances.</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2 text-primary">🧠 Cognitive Science-Based</h4>
              <p className="text-muted-foreground">Built on principles that support executive function and reduce cognitive load.</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2 text-primary">📊 Measurable Progress</h4>
              <p className="text-muted-foreground">Track improvements in small, manageable steps that build confidence over time.</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2 text-primary">🔄 Holistic Integration</h4>
              <p className="text-muted-foreground">Each element reinforces the others, creating a comprehensive life management system.</p>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-6">
            Ready to see how each element works in practice?
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
            See Practical Applications <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
