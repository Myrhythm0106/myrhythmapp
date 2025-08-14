import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Brain, Heart, Users, Award, Calendar, Target, Lightbulb, Sparkles } from "lucide-react";
import { BrainFriendlyAccessibility } from "./sections/BrainFriendlyAccessibility";

export function FoundersMemoryStoryContent() {
  const navigate = useNavigate();

  const timeline = [
    {
      title: "The Day Everything Changed",
      date: "April 1st, 2010",
      icon: Brain,
      content: "April Fools' Day—but there was nothing funny about the worst headache of my life. Brain aneurysm rupture. Emergency surgery. Doctors said I'd die. That I'd never work again. That motherhood would wait at least five years. But here's the thing about rock bottom—it gives you a solid foundation to rebuild on."
    },
    {
      title: "When Faith Became My Anchor",
      date: "Recovery Phase 1", 
      icon: Heart,
      content: "When words disappeared and memories vanished minutes after making them, I had two choices: despair or lean into something bigger than myself. As a believer, I knew God wasn't finished with my story. In my darkest moments, His presence became my unshakeable anchor. Faith didn't fix my brain—it gave me strength to rebuild."
    },
    {
      title: "Aaron: My Unshakeable Support",
      date: "Early Recovery",
      icon: Users,
      content: "Aaron became my external brain—tracking medications, appointments, even reminding me to eat. Our home turned into a sticky note maze. He was burning out, and I felt like a burden. But Aaron never gave up on us. His unwavering love and practical support became the bedrock of my recovery. Together, we learned that love adapts."
    },
    {
      title: "Friends Who Spoke Life",
      date: "6 Months Post-Surgery",
      icon: Lightbulb,
      content: "When I wanted to quit, dear friends spoke truth over me: 'Bella, this isn't the end of your story—it's a plot twist.' 'Your brain may be different, but your heart is the same.' 'Stop trying to go back—move forward.' In occupational therapy, Sarah, another survivor, said: 'Stop trying to remember everything. Start building systems that remember for you.'"
    },
    {
      title: "#IChoose to Rise",
      date: "8 Months Post-Surgery",
      icon: Target,
      content: "This became my daily declaration: #IChoose to rise. Not because it was easy, but because giving up wasn't an option. #IChoose hope over despair. #IChoose growth over stagnation. #IChoose to believe my best days weren't behind me. That night, Aaron and I sketched the first version of what would become MyRhythm."
    },
    {
      title: "Building Our Rhythm",
      date: "Year 1-2",
      icon: Sparkles,
      content: "We didn't build an app first—we built a life system that honored how my brain worked now. Visual cues instead of complex text. Family integration without dependency. Progress tracking that celebrated forgetting vitamins but remembering to call mom. Every feature battle-tested on our daily reality."
    },
    {
      title: "The Movement Grows", 
      date: "Year 2-3",
      icon: Users,
      content: "Word spread in brain injury support groups. Other survivors and families wanted what we'd built. Each person we helped taught us something new. The app evolved from our personal survival tool into a community-driven solution. #IChoose was becoming more than my tagline—it was becoming our rallying cry."
    },
    {
      title: "Clinical Recognition",
      date: "Year 3-4",
      icon: Award,
      content: "Neurologists began recommending our approach. Dr. Martinez at the Brain Injury Center started seeing remarkable patterns in patients using our system. We formalized the 8-Step Memory-First Framework—not just clinical theory, but lived experience validated by medical professionals."
    },
    {
      title: "Today: Thriving Beyond Survival",
      date: "Present Day",
      icon: Sparkles,
      content: "My memory will never be what it was, but my life is richer than I ever imagined. Aaron and I aren't patient and caregiver—we're partners in a rhythm that honors both our strengths. I use this app daily, not as a crutch, but as a tool that celebrates how beautifully different brains can thrive. Every user's success reminds me: #IChoose was the right choice."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Accessibility Controls */}
      <div className="mb-6">
        <BrainFriendlyAccessibility />
      </div>

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
          <Badge className="bg-gradient-to-r from-brain-health-500 to-memory-emerald-500 text-white border-0">
            <Brain className="h-3 w-3 mr-1" />
            Inspirational Speaker & Survivor
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-brain-health-600 via-memory-emerald-600 to-clarity-teal-600 bg-clip-text text-transparent">
            Beyond Survival: How Brain<br />
            Aneurysm Crisis Sparked a Movement
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            The intimate story of how one woman's darkest moment illuminated a path to empowerment 
            for thousands navigating memory challenges worldwide.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="accessibility-text space-y-8">
        {/* Personal Introduction */}
        <Card className="border-l-4 border-l-brain-health-300 bg-gradient-to-r from-memory-emerald-50/60 via-brain-health-50/60 to-clarity-teal-50/60">
        <CardContent className="p-8">
          <div className="flex items-start gap-6">
            <div className="bg-gradient-to-r from-brain-health-100 to-memory-emerald-100 p-4 rounded-full">
              <Brain className="h-12 w-12 text-brain-health-600" />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">From Tragedy to Triumph: Why I Share This Story</h2>
              <p className="text-muted-foreground leading-relaxed">
                "I'm not sharing this story for sympathy—I'm sharing it because it proves that tragedy doesn't get the final word. 
                When a brain aneurysm tried to end my story on April Fools' Day 2010, I had two choices: surrender to the prognosis 
                or fight for something different. With God as my anchor, Aaron as my champion, and friends who spoke life over death, 
                I chose to thrive. <strong>#IChoose</strong> became more than my personal tagline—it became a movement. If you're 
                reading this in your own dark moment, know this: your comeback story starts with a choice."
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
                    <div className="bg-gradient-to-r from-brain-health-100 to-memory-emerald-100 p-3 rounded-full">
                      <event.icon className="h-6 w-6 text-brain-health-600" />
                    </div>
                    {index < timeline.length - 1 && (
                      <div className="w-px h-16 bg-gradient-to-b from-brain-health-200 to-memory-emerald-200 mt-4" />
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="text-xl font-semibold">{event.title}</h3>
                      <Badge variant="outline" className="text-brain-health-600 border-brain-health-300 bg-brain-health-50/50">
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
      <Card className="bg-gradient-to-r from-memory-emerald-50/60 via-brain-health-50/60 to-clarity-teal-50/60 border-brain-health-200">
        <CardContent className="p-8 space-y-6">
          <h2 className="text-2xl font-bold text-center text-brain-health-800">
            Why MyRhythm Is Different from Every Other App
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-brain-health-800">Built by Lived Experience</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-brain-health-500 mt-2" />
                  <span>Every feature tested by someone with actual memory challenges</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-brain-health-500 mt-2" />
                  <span>Designed for brains that work differently, not broken brains</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-brain-health-500 mt-2" />
                  <span>Founder uses the app daily for her own recovery</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-brain-health-800">Memory-First Philosophy</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-brain-health-500 mt-2" />
                  <span>Visual cues over complex text instructions</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-brain-health-500 mt-2" />
                  <span>Family integration that preserves independence</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-brain-health-500 mt-2" />
                  <span>Progress tracking that celebrates small wins</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Mission */}
      <Card className="border-l-4 border-l-memory-emerald-300 bg-gradient-to-r from-memory-emerald-50/40 to-clarity-teal-50/40">
        <CardContent className="p-8 space-y-6">
          <h2 className="text-2xl font-bold text-brain-health-800">Our Mission Today</h2>
          
          <div className="space-y-4">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Today, MyRhythm serves over 1,000 brain injury survivors and their families. 
              But our mission goes beyond technology—we're changing how society thinks about memory challenges.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <div className="bg-gradient-to-r from-memory-emerald-100 to-brain-health-100 p-4 rounded-full w-fit mx-auto">
                  <Users className="h-8 w-8 text-memory-emerald-600" />
                </div>
                <h3 className="font-semibold text-brain-health-800">Community Building</h3>
                <p className="text-sm text-muted-foreground">
                  Creating safe spaces for memory-challenged individuals and families
                </p>
              </div>
              
              <div className="text-center space-y-2">
                <div className="bg-gradient-to-r from-brain-health-100 to-clarity-teal-100 p-4 rounded-full w-fit mx-auto">
                  <Award className="h-8 w-8 text-brain-health-600" />
                </div>
                <h3 className="font-semibold text-brain-health-800">Clinical Integration</h3>
                <p className="text-sm text-muted-foreground">
                  Working with healthcare providers to improve patient outcomes
                </p>
              </div>
              
              <div className="text-center space-y-2">
                <div className="bg-gradient-to-r from-clarity-teal-100 to-sunrise-amber-100 p-4 rounded-full w-fit mx-auto">
                  <Sparkles className="h-8 w-8 text-clarity-teal-600" />
                </div>
                <h3 className="font-semibold text-brain-health-800">Hope Restoration</h3>
                <p className="text-sm text-muted-foreground">
                  Proving that memory challenges don't define your potential
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Invitation */}
      <Card className="bg-gradient-to-r from-brain-health-600 via-memory-emerald-600 to-clarity-teal-600 text-white">
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
              onClick={() => navigate("/auth")}
              className="bg-white text-brain-health-600 hover:bg-white/90 text-lg px-8 py-6 font-semibold"
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
            "Every person who joins our community reminds me why Aaron and I started this journey. 
            Your courage to rebuild inspires us to keep building. #IChoose to keep fighting for every brain that works differently."
          </p>
        </CardContent>
        </Card>
      </main>
    </div>
  );
}