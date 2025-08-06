
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Heart, Brain, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function PowerOfConnectionSection() {
  const navigate = useNavigate();
  
  const connectionBenefits = [
    {
      icon: Heart,
      title: "You Give as Much as You Receive",
      description: "Your journey inspires others. Your progress gives hope to families facing similar challenges.",
      color: "text-red-500"
    },
    {
      icon: Brain,
      title: "Shared Understanding Heals",
      description: "Connect with others who truly understand your experience without judgment or explanation.",
      color: "text-blue-500"
    },
    {
      icon: Users,
      title: "Stronger Together",
      description: "Your support circle becomes more effective when they see how their help makes a real difference.",
      color: "text-purple-500"
    },
    {
      icon: Sparkles,
      title: "Building Something Beautiful",
      description: "Every connection creates ripples of hope and healing that extend far beyond your immediate circle.",
      color: "text-yellow-500"
    }
  ];

  return (
    <section className="space-y-8">
      <div className="text-center space-y-4">
        <Badge variant="outline" className="text-purple-600 border-purple-200">
          <Heart className="h-3 w-3 mr-1" />
          The Power of Connection
        </Badge>
        
        <h2 className="text-3xl md:text-4xl font-bold">
          You're Not a Burden—You're a Gift
        </h2>
        
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Your recovery journey doesn't just heal you—it strengthens everyone around you. 
          Connection is the strongest medicine, and together we're building something beautiful.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {connectionBenefits.map((benefit, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow border-t-4 border-t-purple-200">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <benefit.icon className={`h-6 w-6 ${benefit.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Connection CTA */}
      <Card className="relative overflow-hidden border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardContent className="p-8 text-center space-y-6">
          <h3 className="text-2xl md:text-3xl font-bold">
            Your Support Circle is Waiting
          </h3>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            They want to help, they just need to know how. Let's show them the way to support 
            you effectively while building connections that strengthen everyone involved.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate("/support-circle")}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Build Your Support Circle
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/community")}
              className="border-purple-300 text-purple-600 hover:bg-purple-50"
            >
              Join the Community
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
