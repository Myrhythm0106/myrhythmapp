import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Heart, Award, Users, ArrowRight } from "lucide-react";

export function FounderStorySection() {
  const navigate = useNavigate();
  
  return (
    <section className="space-y-8">
      <div className="text-center space-y-4">
        <Badge variant="outline" className="text-purple-600 border-purple-200">
          <Heart className="h-3 w-3 mr-1" />
          Built by Someone Who Understands
        </Badge>
        
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-800 bg-clip-text text-transparent">
          Beyond Survival: How Brain<br />
          Aneurysm Crisis Sparked a Movement
        </h2>
      </div>

      <Card className="overflow-hidden border-l-4 border-l-purple-300">
        <div className="md:flex">
          {/* Left side - Visual/Credentials */}
          <div className="md:w-1/3 bg-gradient-to-br from-purple-100 to-blue-100 p-8 flex flex-col items-center justify-center space-y-6">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-full">
              <Brain className="h-20 w-20 text-purple-600" />
            </div>
            
            <div className="text-center space-y-3">
              <h3 className="text-xl font-bold text-purple-800">Bella A.</h3>
              <div className="space-y-1">
                <Badge className="bg-purple-600 text-white">Brain Aneurysm Survivor</Badge>
                <Badge variant="outline" className="text-purple-600 border-purple-300">Brain Health Coach</Badge>
                <Badge variant="outline" className="text-purple-600 border-purple-300">Bee Foundation Ambassador</Badge>
              </div>
            </div>
          </div>
          
          {/* Right side - Story */}
          <CardContent className="md:w-2/3 p-8 space-y-6">
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-purple-800">
                "From Tragedy to Triumph: #IChoose to Thrive"
              </h3>
              
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong className="text-foreground">April Fools' Day 2010:</strong> The worst headache of my life. Brain aneurysm rupture. Doctors said I'd die, never work again, that motherhood would wait five years. But they underestimated the power of choice.
                </p>
                
                <p>
                  <strong className="text-foreground">Rock bottom became my foundation:</strong> When words disappeared and memories vanished, I had God as my anchor, Aaron as my unwavering support, and friends who spoke life over my circumstances. <strong>#IChoose</strong> became my daily declaration.
                </p>
                
                <p>
                  <strong className="text-foreground">The turning point:</strong> I stopped trying to get my old brain back and started building systems for the brain I have now. Aaron and I didn't just survive—we created a framework that helps thousands thrive.
                </p>
                
                <p>
                  <strong className="text-foreground">Today's reality:</strong> I speak internationally about resilience, coach brain injury survivors, and use MyRhythm daily. My memory may be different, but my impact is greater than ever. Tragedy tried to end my story—instead, it started a movement.
                </p>
              </div>
            </div>

            {/* What Makes This Different */}
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-4">
                Why This App Is Different from Anything Else:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <div className="flex items-center gap-2">
                     <Brain className="h-4 w-4 text-purple-600" />
                     <span className="text-sm font-medium">🧠 Memory-First Design</span>
                   </div>
                   <p className="text-sm text-purple-700 pl-6">
                     <strong>The Only App Built BY and FOR People with Memory Challenges</strong> - Every feature tested by real survivors
                   </p>
                 </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium">Family Integration</span>
                  </div>
                  <p className="text-sm text-purple-700 pl-6">
                    Support without dependency—we protect relationships
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium">Lived Experience</span>
                  </div>
                  <p className="text-sm text-purple-700 pl-6">
                    Built by someone who uses it daily for their own recovery
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium">Clinical Backing</span>
                  </div>
                  <p className="text-sm text-purple-700 pl-6">
                    Developed with neurologists and brain injury specialists
                  </p>
                </div>
              </div>
            </div>

            {/* Personal Mission */}
            <div className="border-l-4 border-l-purple-300 pl-6">
              <p className="text-lg italic text-purple-800 leading-relaxed">
                "I went from doctors saying I'd never work again to speaking on international stages about resilience. 
                From being a burden to my husband to being his partner in building a movement. #IChoose proved that 
                your comeback story starts with a choice. And MyRhythm? It's not just how I survived—it's how I learned to thrive."
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                onClick={() => navigate("/onboarding")}
                className="bg-purple-600 hover:bg-purple-700 flex-1"
                size="lg"
              >
                #IChoose to Start My Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate("/founders-story")}
                className="border-purple-300 text-purple-600 hover:bg-purple-50"
                size="lg"
              >
                Hear Bella's Full Story
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Trust Indicators */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <h4 className="font-semibold text-purple-800">Medical Recognition</h4>
            <p className="text-sm text-purple-600 mt-1">
              Recommended by neurologists and used in brain injury rehabilitation programs
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-purple-800">Community Impact</h4>
            <p className="text-sm text-purple-600 mt-1">
              1,000+ brain injury survivors using daily • 94% report increased confidence
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-purple-800">Ongoing Commitment</h4>
            <p className="text-sm text-purple-600 mt-1">
              Bella speaks internationally and continues using MyRhythm daily in her own journey
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}