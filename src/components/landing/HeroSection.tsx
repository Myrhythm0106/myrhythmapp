
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, ArrowRight, LogIn } from "lucide-react";

const HeroSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative overflow-hidden">
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-20 md:py-32">
        <div className="container mx-auto px-4 max-w-6xl relative">
          {/* Login button at top right */}
          <div className="absolute top-0 right-0">
            <Button 
              variant="ghost" 
              className="flex items-center gap-2 hover:bg-primary/10"
              onClick={() => navigate("/onboarding")}
            >
              <LogIn className="h-4 w-4" />
              Login
            </Button>
            <div className="text-center">
              <Button 
                variant="link" 
                className="text-sm text-muted-foreground hover:text-primary"
                onClick={() => navigate("/onboarding")}
              >
                Forgotten password?
              </Button>
            </div>
          </div>
          
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <Brain className="h-14 w-14 text-primary" />
              <h1 className="text-5xl font-bold">MyRhythm</h1>
            </div>
          </div>
          
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6 leading-tight md:text-4xl">Organise Your World. Support Your Recall.</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Empowering you to live O.R.D.E.R.ly. Organize priorities, build Routines, strengthen Discipline, Execute with focus, and Review with intention. It's not just productivity—it's your rhythm for life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-lg" 
                onClick={() => navigate("/profile")}
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg" onClick={() => navigate("/onboarding")}>
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
