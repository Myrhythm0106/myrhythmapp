
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Lightbulb, 
  Calendar, 
  RotateCw,
  Search, 
  Heart, 
  BrainCircuit, 
  HelpingHand,
  Waves,
  CheckCircle
} from "lucide-react";

type RhythmItemProps = {
  letter: string;
  title: string;
  practicalMeaning: string;
  dailyExample: string;
  actionStep: string;
  icon: React.ReactNode;
}

function RhythmItem({ letter, title, practicalMeaning, dailyExample, actionStep, icon }: RhythmItemProps) {
  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-3">
              <span className="text-primary text-2xl">{letter}</span> – {title}
            </h3>
            
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-sm text-primary mb-1">What this means for you:</h4>
                <p className="text-muted-foreground text-sm">{practicalMeaning}</p>
              </div>
              
              <div className="bg-muted/50 p-3 rounded-lg">
                <h4 className="font-semibold text-sm mb-1 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  Daily example:
                </h4>
                <p className="text-sm italic text-muted-foreground">{dailyExample}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm text-primary mb-1">Try this:</h4>
                <p className="text-sm font-medium">{actionStep}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function MyRhythmBreakdown() {
  const navigate = useNavigate();
  
  const rhythmItems: RhythmItemProps[] = [
    {
      letter: "M",
      title: "Most Important",
      practicalMeaning: "Instead of trying to do everything, you'll learn to identify the 1-3 things that truly matter each day.",
      dailyExample: "Rather than a 15-item to-do list, you might choose: 'Take medication, call mom, and do 10 minutes of gentle exercise.'",
      actionStep: "Each morning, ask yourself: 'If I only accomplished 3 things today, what would make the biggest positive difference?'",
      icon: <Lightbulb className="h-6 w-6 text-primary" />
    },
    {
      letter: "Y",
      title: "Your Plan",
      practicalMeaning: "You'll create simple, personal schedules that work with your energy levels and cognitive patterns—not against them.",
      dailyExample: "Planning your medication reminder for when you make coffee, or scheduling important calls during your 'best thinking' hours.",
      actionStep: "Notice when you feel most alert and schedule one important task during that time each day.",
      icon: <Calendar className="h-6 w-6 text-primary" />
    },
    {
      letter: "R",
      title: "Repeat",
      practicalMeaning: "Small, consistent actions become powerful habits. You'll build routines that support your brain and reduce decision fatigue.",
      dailyExample: "Setting out tomorrow's clothes each evening, or doing a 5-minute evening reflection at the same time each day.",
      actionStep: "Pick one small helpful action and do it at the same time each day for one week.",
      icon: <RotateCw className="h-6 w-6 text-primary" />
    },
    {
      letter: "H",
      title: "Hold Focus",
      practicalMeaning: "You'll develop practical strategies to minimize distractions and give your full attention to one thing at a time.",
      dailyExample: "Putting your phone in another room during meals, or using a simple timer to focus on one task for 15 minutes.",
      actionStep: "Choose one daily activity and practice doing it without multitasking. Notice how it feels different.",
      icon: <Search className="h-6 w-6 text-primary" />
    },
    {
      letter: "Y",
      title: "Your Effort",
      practicalMeaning: "Progress matters more than perfection. You'll learn to celebrate small wins and treat yourself with kindness.",
      dailyExample: "Acknowledging that you remembered to take your medicine, even if you forgot to make your bed.",
      actionStep: "Each evening, write down one thing you did well that day, no matter how small it seems.",
      icon: <Heart className="h-6 w-6 text-primary" />
    },
    {
      letter: "T",
      title: "Think Back",
      practicalMeaning: "Regular, gentle reflection helps you learn what works for your unique brain and adjust your approach accordingly.",
      dailyExample: "Noticing that you feel calmer when you prep meals the night before, or that afternoon walks help your mood.",
      actionStep: "Spend 2 minutes each evening asking: 'What felt good today?' and 'What would I do differently?'",
      icon: <BrainCircuit className="h-6 w-6 text-primary" />
    },
    {
      letter: "H",
      title: "Help Your Life",
      practicalMeaning: "These strategies work together to create more ease, confidence, and control in your daily experience.",
      dailyExample: "Finding that your morning routine helps you feel prepared, your focus practice helps you complete tasks, and reflection helps you improve.",
      actionStep: "Notice connections between different MyRhythm practices and how they support each other.",
      icon: <HelpingHand className="h-6 w-6 text-primary" />
    },
    {
      letter: "M",
      title: "My Rhythm",
      practicalMeaning: "You'll develop a personalized way of living that honors your needs, abilities, and goals—creating your unique rhythm for thriving.",
      dailyExample: "Having a flow to your days that feels sustainable, whether that's structured routines or flexible frameworks.",
      actionStep: "Trust yourself to adapt these principles in ways that feel right for your life and circumstances.",
      icon: <Waves className="h-6 w-6 text-primary" />
    }
  ];

  return (
    <section id="myrhythm-breakdown" className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">What MyRhythm Means To You</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Here's how each element of MyRhythm translates into practical, daily actions that can 
            transform your experience and help you build a life that feels more manageable and meaningful.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {rhythmItems.map((item, index) => (
            <RhythmItem 
              key={`${item.letter}-${item.title}-${index}`}
              letter={item.letter}
              title={item.title}
              practicalMeaning={item.practicalMeaning}
              dailyExample={item.dailyExample}
              actionStep={item.actionStep}
              icon={item.icon}
            />
          ))}
        </div>
        
        {/* Call to Action */}
        <div className="mt-16 text-center bg-primary/5 rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-4">Ready to Create Your Rhythm?</h3>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Start your personalized journey today. Our assessment will help you understand which 
            areas to focus on first and create a rhythm that truly works for you.
          </p>
          <Button 
            size="lg" 
            className="text-lg bg-primary hover:bg-primary/90 text-primary-foreground" 
            onClick={() => navigate("/onboarding")}
          >
            Begin Your MyRhythm Journey
          </Button>
        </div>
      </div>
    </section>
  );
}
