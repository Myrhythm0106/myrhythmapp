
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Brain, Heart, Activity, Check, Users, ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/onboarding?step=1");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-beacon-100 to-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              🧠 MyRhythm: Reclaim Structure. Reignite Confidence. Reconnect Lives.
            </h1>
            <p className="text-xl text-muted-foreground">
              Your personalised path to rebuilding your rhythm and reclaiming your day.
            </p>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 my-8 shadow-md border border-muted">
              <p className="text-lg italic">
                💬 "After my brain aneurysm, remembering simple things felt impossible. With my husband's support, 
                we rebuilt a rhythm that gave us back our peace. That rhythm became MyRhythm. Now, it's here for you, 
                your loved ones, and your care team."
              </p>
              <p className="mt-3 font-medium">— Bella A., Brain Health Coach & Brain Aneurysm Survivor</p>
            </div>
            
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="text-lg px-8 bg-primary hover:bg-primary/90"
            >
              👉 Get Started (Free Trial)
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Why MyRhythm Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">✨ Built for Brain Recovery. Backed by Real Experience.</h2>
            <p className="text-lg text-muted-foreground">
              Whether you're living with memory challenges, supporting someone who is, or delivering care, 
              MyRhythm offers a simple, supportive way to bring structure and calm to each day.
            </p>
          </div>
          
          <div className="flex justify-center mb-12">
            <div className="w-full max-w-md">
              <AspectRatio ratio={16/9} className="bg-muted rounded-lg overflow-hidden">
                <img 
                  src="/placeholder.svg" 
                  alt="Support illustration" 
                  className="w-full h-full object-cover"
                />
              </AspectRatio>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">💡 Key Benefits</h2>
          </div>
          
          {/* For Individuals */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-6 text-center">For Individuals with Brain Injuries</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-border">
                <div className="flex justify-center mb-4">
                  <Brain className="h-12 w-12 text-primary" />
                </div>
                <h4 className="text-xl font-semibold mb-3 text-center">Stay On Track</h4>
                <p className="text-muted-foreground">
                  Daily reminders, routines, and goals, personalised to your pace whilst encouraging 
                  a growth mindset.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-sm border border-border">
                <div className="flex justify-center mb-4">
                  <Heart className="h-12 w-12 text-primary" />
                </div>
                <h4 className="text-xl font-semibold mb-3 text-center">Regain Confidence and Control</h4>
                <p className="text-muted-foreground">
                  Celebrate progress and rebuild trust in your memory alongside a positive mindset.
                </p>
              </div>
            </div>
          </div>
          
          {/* For Family & Carers */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-6 text-center">For Family & Carers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-border">
                <div className="flex justify-center mb-4">
                  <Activity className="h-12 w-12 text-secondary" />
                </div>
                <h4 className="text-xl font-semibold mb-3 text-center">See the Day, Stay Connected</h4>
                <p className="text-muted-foreground">
                  View schedules, add notes, and send encouragement. Let MyRhythm remember so you can 
                  focus on love, not logistics.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-sm border border-border">
                <div className="flex justify-center mb-4">
                  <Users className="h-12 w-12 text-secondary" />
                </div>
                <h4 className="text-xl font-semibold mb-3 text-center">Be a Partner, Not a Planner</h4>
                <p className="text-muted-foreground">
                  Support without burnout. Share the responsibility and maintain healthy relationships.
                </p>
              </div>
            </div>
          </div>
          
          {/* For Medical Professionals */}
          <div>
            <h3 className="text-2xl font-bold mb-6 text-center">For Medical Professionals</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-border">
                <div className="flex justify-center mb-4">
                  <Activity className="h-12 w-12 text-annabel-600" />
                </div>
                <h4 className="text-xl font-semibold mb-3 text-center">Monitor Without Hovering</h4>
                <p className="text-muted-foreground">
                  See patient engagement patterns and progress (with consent).
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-sm border border-border">
                <div className="flex justify-center mb-4">
                  <Heart className="h-12 w-12 text-annabel-600" />
                </div>
                <h4 className="text-xl font-semibold mb-3 text-center">Send Encouragement</h4>
                <p className="text-muted-foreground">
                  Human-centered care, just a message away.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-sm border border-border">
                <div className="flex justify-center mb-4">
                  <Brain className="h-12 w-12 text-annabel-600" />
                </div>
                <h4 className="text-xl font-semibold mb-3 text-center">Promote Holistic Healing</h4>
                <p className="text-muted-foreground">
                  Align goals, routines, and brain recovery practices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Matters Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-6">🌱 Why It Matters</h2>
              <p className="text-lg text-muted-foreground">
                Recovery isn't just about healing the brain. It's about restoring rhythm, to thoughts, 
                routines, relationships, and identity. That's what MyRhythm makes possible.
              </p>
            </div>
            
            <div className="flex justify-center my-12">
              <div className="w-full max-w-md">
                <AspectRatio ratio={16/9} className="bg-muted rounded-lg overflow-hidden">
                  <img 
                    src="/placeholder.svg" 
                    alt="Calming representation of rhythm" 
                    className="w-full h-full object-cover"
                  />
                </AspectRatio>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-6">👨‍👩‍👧‍👦 Our Story, Now Yours Too</h2>
              <p className="text-lg text-muted-foreground">
                After my injury, our home was filled with sticky notes, alarms, missed moments and tension 
                in the house. My husband became my reminder, planner and alarm. But what we needed wasn't 
                more noise it was shared rhythm. Which is how MyRhythm was birthed.
              </p>
            </div>
            
            <div className="flex justify-center my-12">
              <div className="w-full max-w-md">
                <AspectRatio ratio={1/1} className="bg-muted rounded-full overflow-hidden">
                  <img 
                    src="/placeholder.svg" 
                    alt="Family connection" 
                    className="w-full h-full object-cover"
                  />
                </AspectRatio>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 md:py-32 bg-gradient-to-t from-beacon-100 to-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl font-bold mb-6">🔵 Be Part of the First Wave</h2>
            <p className="text-xl">
              Join our waitlist and be the first to try MyRhythm as a:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Button variant="outline" size="lg" className="text-lg border-2">
                <Check className="mr-2 h-5 w-5 text-primary" />
                Survivor
              </Button>
              <Button variant="outline" size="lg" className="text-lg border-2">
                <Check className="mr-2 h-5 w-5 text-primary" />
                Family Member or Carer
              </Button>
              <Button variant="outline" size="lg" className="text-lg border-2">
                <Check className="mr-2 h-5 w-5 text-primary" />
                Medical Professional
              </Button>
            </div>
            
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="text-xl px-8 py-6 bg-primary hover:bg-primary/90 w-full md:w-auto"
            >
              🕊 It's not just about remembering. It's about rising.
            </Button>
            <p className="text-lg font-medium">Let's rebuild your rhythm together.</p>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Brain className="h-8 w-8 text-primary mr-2" />
              <span className="text-xl font-bold">MyRhythm</span>
            </div>
            <div className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} MyRhythm. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
