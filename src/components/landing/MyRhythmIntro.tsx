import React from "react";
import { Lightbulb, Calendar, RotateCw, Search, Heart, BrainCircuit, HelpingHand, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
export function MyRhythmIntro() {
  const navigate = useNavigate();

  // Define the MYRHYTHM elements with their icons and descriptions
  const myRhythmElements = [{
    letter: "M",
    title: "Most Important",
    description: "Gently explore what truly matters most to you right now",
    benefit: "Helps you focus your energy where it counts, reducing overwhelm",
    icon: <Lightbulb className="h-10 w-10 text-primary" />
  }, {
    letter: "Y",
    title: "Your Plan",
    description: "Create your own simple, personal plan for your day",
    benefit: "Gives you a clear roadmap, making daily tasks feel more manageable",
    icon: <Calendar className="h-10 w-10 text-primary" />
  }, {
    letter: "R",
    title: "Repeat",
    description: "Try to repeat your planned steps often to build consistency",
    benefit: "Small, repeated actions build powerful habits and steady progress",
    icon: <RotateCw className="h-10 w-10 text-primary" />
  }, {
    letter: "H",
    title: "Hold Focus",
    description: "Learn to hold your attention on one task at a time, minimizing distractions",
    benefit: "Improves concentration and helps you complete tasks more easily",
    icon: <Search className="h-10 w-10 text-primary" />
  }, {
    letter: "Y",
    title: "Your Effort",
    description: "Give your best, gentle effort to each task. It's about progress, not perfection",
    benefit: "Builds confidence and celebrates every step forward, no matter how small",
    icon: <Heart className="h-10 w-10 text-primary" />
  }, {
    letter: "T",
    title: "Think Back",
    description: "Take a moment to think back on how things went each day",
    benefit: "Helps you learn what worked well and what might need a gentle adjustment",
    icon: <BrainCircuit className="h-10 w-10 text-primary" />
  }, {
    letter: "H",
    title: "Help Your Life",
    description: "These gentle steps are designed to help you create more flow and ease",
    benefit: "Reduces stress and helps you feel more in control of your daily experiences",
    icon: <HelpingHand className="h-10 w-10 text-primary" />
  }, {
    letter: "M",
    title: "My Rhythm",
    description: "This is your unique rhythm for living well, on your own terms",
    benefit: "Empowers you to define success and happiness in a way that truly fits you",
    icon: <Waves className="h-10 w-10 text-primary" />
  }];
  return <section id="discover-myrhythm" className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">Discover MYRHYTHM</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We've broken down key strategies into a simple, memorable guide: MYRHYTHM. 
            These aren't rigid rules, but suggestions to help you build structure, focus, 
            and peace into your everyday.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {myRhythmElements.map((element, index) => <div key={index} className="flex gap-4 p-6 border rounded-lg hover:shadow-md transition-all">
              <div className="flex-shrink-0 flex flex-col items-center">
                {element.icon}
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mt-4 text-2xl font-bold text-primary">
                  {element.letter}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">{element.title}</h3>
                <p className="text-muted-foreground mb-2">{element.description}</p>
                <p className="text-sm font-medium text-primary">{element.benefit}</p>
              </div>
            </div>)}
        </div>
        
        <div className="mt-12 text-center">
          <Button size="lg" className="text-lg bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => navigate("/onboarding")}>Register Now</Button>
        </div>
      </div>
    </section>;
}