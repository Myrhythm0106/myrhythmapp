import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Brain, Heart, Users, Award, Calendar, Target, Lightbulb, Sparkles } from "lucide-react";

export function FoundersMemoryStoryContent() {
  const navigate = useNavigate();

  const timeline = [
    {
      title: "The Day Everything Changed",
      date: "March 15, 2020",
      icon: Brain,
      content: "At 34, I was at the peak of my career. Sharp memory, quick thinking, managing complex projects effortlessly. Then, during a routine morning, I felt the worst headache of my life. Brain aneurysm. Emergency surgery. Everything I thought I knew about myself was about to change."
    },
    {
      title: "The Fog Descends",
      date: "Recovery Phase 1",
      icon: Heart,
      content: "Simple words disappeared from my vocabulary. I'd forget conversations minutes after having them. My husband David became my external brain—tracking medications, appointments, even reminding me to eat. Our home turned into a sticky note maze, and both of us were drowning."
    },
    {
      title: "The Breaking Point",
      date: "6 Months Post-Surgery",
      icon: Users,
      content: "David was burning out. I felt like a burden. Our relationship was strained to the breaking point. I tried every app, every system—but they all assumed I had normal memory function. The tools designed to help me only made me feel more broken."
    },
    {
      title: "The First Breakthrough",
      date: "8 Months Post-Surgery",
      icon: Lightbulb,
      content: "In occupational therapy, I met Sarah, another aneurysm survivor. She shared a simple insight: 'Stop trying to remember everything. Start building systems that remember for you.' That night, David and I sketched the first version of what would become MyRhythm."
    },
    {
      title: "Building for Our Reality",
      date: "Year 1-2",
      icon: Target,
      content: "We didn't build an app first—we built a life system. Visual cues instead of text lists. Family integration without dependency. Gentle progress tracking that celebrated forgetting to take vitamins but remembering to call mom. Every feature tested on our own daily struggles."
    },
    {
      title: "The Community Emerges", 
      date: "Year 2-3",
      icon: Users,
      content: "Word spread in brain injury support groups. Other survivors and families wanted what we'd built. Each person we helped taught us something new about memory challenges. The app evolved from our personal tool into a community-driven solution."
    },
    {
      title: "Clinical Validation",
      date: "Year 3-4",
      icon: Award,
      content: "Neurologists began noticing patterns in their patients who used our system. Dr. Martinez at the Brain Injury Center started recommending it. We formalized our approach into the 8-Step Memory-First Framework, backed by clinical observation and real-world results."
    },
    {
      title: "Today: Living Proof",
      date: "Present Day",
      icon: Sparkles,
      content: "My memory will never be what it was, but my life is richer than ever. David and I aren't patient and caregiver—we're partners in a shared rhythm. I use this app daily, not as a crutch, but as a tool that honors how my brain works now. Every user's success reminds me why we started this journey."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="text-center space-y-4">
          <Badge className="bg-purple-600 text-white">
            <Brain className="h-3 w-3 mr-1" />
            Founder's Full Story
          </Badge>
          
          <h1 className="text-4xl md:text-5xl font-bold">
            From Brain Aneurysm to<br />
            Memory-First Pioneer
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            The complete journey of how a life-changing brain injury became the foundation 
            for the world's first memory-first life empowerment platform.
          </p>
        </div>
      </div>

      {/* Personal Introduction */}
      <Card className="border-l-4 border-l-purple-300">
        <CardContent className="p-8">
          <div className="flex items-start gap-6">
            <div className="bg-purple-100 p-4 rounded-full">
              <Brain className="h-12 w-12 text-purple-600" />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Bella's Personal Message</h2>
              <p className="text-muted-foreground leading-relaxed">
                "I'm sharing this story not for sympathy, but for hope. If you're reading this because you 
                or someone you love is struggling with memory challenges, I want you to know: your best days 
                are not behind you. They're different than you planned, but they can be beautiful."
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-center">The Journey: From Tragedy to Triumph</h2>
        
        <div className="space-y-6">
          {timeline.map((event, index) => (
            <Card key={index} className="relative">
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  <div className="flex flex-col items-center">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <event.icon className="h-6 w-6 text-purple-600" />
                    </div>
                    {index < timeline.length - 1 && (
                      <div className="w-px h-16 bg-purple-200 mt-4" />
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="text-xl font-semibold">{event.title}</h3>
                      <Badge variant="outline" className="text-purple-600 border-purple-300">
                        {event.date}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {event.content}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* What Makes This Different */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="p-8 space-y-6">
          <h2 className="text-2xl font-bold text-center">
            Why MyRhythm Is Different from Every Other App
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-purple-800">Built by Lived Experience</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mt-2" />
                  <span>Every feature tested by someone with actual memory challenges</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mt-2" />
                  <span>Designed for brains that work differently, not broken brains</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mt-2" />
                  <span>Founder uses the app daily for her own recovery</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-purple-800">Memory-First Philosophy</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mt-2" />
                  <span>Visual cues over complex text instructions</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mt-2" />
                  <span>Family integration that preserves independence</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mt-2" />
                  <span>Progress tracking that celebrates small wins</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Mission */}
      <Card className="border-l-4 border-l-green-300">
        <CardContent className="p-8 space-y-6">
          <h2 className="text-2xl font-bold">Our Mission Today</h2>
          
          <div className="space-y-4">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Today, MyRhythm serves over 1,000 brain injury survivors and their families. 
              But our mission goes beyond technology—we're changing how society thinks about memory challenges.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <div className="bg-green-100 p-4 rounded-full w-fit mx-auto">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold">Community Building</h3>
                <p className="text-sm text-muted-foreground">
                  Creating safe spaces for memory-challenged individuals and families
                </p>
              </div>
              
              <div className="text-center space-y-2">
                <div className="bg-green-100 p-4 rounded-full w-fit mx-auto">
                  <Award className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold">Clinical Integration</h3>
                <p className="text-sm text-muted-foreground">
                  Working with healthcare providers to improve patient outcomes
                </p>
              </div>
              
              <div className="text-center space-y-2">
                <div className="bg-green-100 p-4 rounded-full w-fit mx-auto">
                  <Sparkles className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold">Hope Restoration</h3>
                <p className="text-sm text-muted-foreground">
                  Proving that memory challenges don't define your potential
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Invitation */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardContent className="p-8 text-center space-y-6">
          <h2 className="text-3xl font-bold">
            Join Me on This Journey
          </h2>
          
          <p className="text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
            If you're struggling with memory challenges, or supporting someone who is, 
            you don't have to rebuild alone. Let's rediscover what's possible together.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="lg" 
              onClick={() => navigate("/onboarding")}
              className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6"
            >
              Start My Memory-First Journey
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/")} 
              className="border-white/50 text-white hover:bg-white/10 text-lg px-8 py-6"
            >
              Learn More About MyRhythm
            </Button>
          </div>
          
          <p className="text-sm opacity-75 italic">
            "Every person who joins our community reminds me why David and I started this journey. 
            Your courage to rebuild inspires us to keep building."
          </p>
        </CardContent>
      </Card>
    </div>
  );
}