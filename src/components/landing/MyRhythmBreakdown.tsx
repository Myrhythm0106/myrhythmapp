
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
  Waves
} from "lucide-react";

type RhythmItemProps = {
  letter: string;
  title: string;
  meaning: string;
  helps: string;
  icon: React.ReactNode;
}

function RhythmItem({ letter, title, meaning, helps, icon }: RhythmItemProps) {
  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 p-3 rounded-full">
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">
              <span className="text-primary">{letter}</span> – {title}
            </h3>
            <p className="mb-2 text-muted-foreground">
              <strong>What it means:</strong> {meaning}
            </p>
            <p className="text-muted-foreground">
              <strong>How it helps:</strong> {helps}
            </p>
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
      meaning: "Gently explore what truly matters most to you right now.",
      helps: "Helps you focus your energy where it counts, reducing overwhelm.",
      icon: <Lightbulb className="h-6 w-6 text-primary" />
    },
    {
      letter: "Y",
      title: "Your Plan",
      meaning: "Create your own simple, personal plan for your day.",
      helps: "Gives you a clear roadmap, making daily tasks feel more manageable.",
      icon: <Calendar className="h-6 w-6 text-primary" />
    },
    {
      letter: "R",
      title: "Repeat",
      meaning: "Try to repeat your planned steps often to build consistency.",
      helps: "Small, repeated actions build powerful habits and steady progress.",
      icon: <RotateCw className="h-6 w-6 text-primary" />
    },
    {
      letter: "H",
      title: "Hold Focus",
      meaning: "Learn to hold your attention on one task at a time, minimizing distractions.",
      helps: "Improves concentration and helps you complete tasks more easily.",
      icon: <Search className="h-6 w-6 text-primary" />
    },
    {
      letter: "Y",
      title: "Your Effort",
      meaning: "Give your best, gentle effort to each task. It's about progress, not perfection.",
      helps: "Builds confidence and celebrates every step forward, no matter how small.",
      icon: <Heart className="h-6 w-6 text-primary" />
    },
    {
      letter: "T",
      title: "Think Back",
      meaning: "Take a moment to think back on how things went each day.",
      helps: "Helps you learn what worked well and what might need a gentle adjustment.",
      icon: <BrainCircuit className="h-6 w-6 text-primary" />
    },
    {
      letter: "H",
      title: "Help Your Life",
      meaning: "These gentle steps are designed to help you create more flow and ease.",
      helps: "Reduces stress and helps you feel more in control of your daily experiences.",
      icon: <HelpingHand className="h-6 w-6 text-primary" />
    },
    {
      letter: "M",
      title: "My Rhythm",
      meaning: "This is your unique rhythm for living well, on your own terms.",
      helps: "Empowers you to define success and happiness in a way that truly fits you.",
      icon: <Waves className="h-6 w-6 text-primary" />
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-primary mb-4">MyRhythm - What It Means To You</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rhythmItems.map((item) => (
            <RhythmItem 
              key={`${item.letter}-${item.title}`}
              letter={item.letter}
              title={item.title}
              meaning={item.meaning}
              helps={item.helps}
              icon={item.icon}
            />
          ))}
        </div>
        
        {/* Register Now button */}
        <div className="mt-12 text-center">
          <Button size="lg" className="text-lg bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => navigate("/onboarding")}>
            Register Now
          </Button>
        </div>
      </div>
    </section>
  );
}
