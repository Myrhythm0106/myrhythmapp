
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Check, ArrowRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const Landing = () => {
  const navigate = useNavigate();

  const handleSelectPlan = (plan: string) => {
    // Navigate directly to payment step with the selected plan
    navigate(`/onboarding?plan=${plan}&step=3`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/60 to-background">
      <ScrollArea className="h-screen">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <Brain className="h-12 w-12 text-beacon-600" />
              <h1 className="text-4xl font-bold">MyRhythm</h1>
            </div>
          </div>
          
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Personalized Support for Your Brain Health Journey</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Track symptoms, access resources, and connect with a supportive community designed specifically for individuals with brain injuries and mental health conditions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="border-2 transition-all hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Basic Plan</CardTitle>
                <CardDescription>Essential features for individual support</CardDescription>
                <div className="mt-4">
                  <div className="text-3xl font-bold">Free for 7 days</div>
                  <div className="text-sm text-muted-foreground">Then $7.99/month</div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {[
                    "Basic symptom tracking",
                    "Limited calendar features",
                    "Access to public resources",
                    "Community forum access"
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => handleSelectPlan("basic")}
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-2 border-primary relative transition-all hover:shadow-lg">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                MOST POPULAR
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Premium Plan</CardTitle>
                <CardDescription>Enhanced features for your recovery journey</CardDescription>
                <div className="mt-4 text-3xl font-bold">$9.99<span className="text-base font-normal text-muted-foreground">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {[
                    "Advanced symptom tracking",
                    "Full calendar management",
                    "Complete resource library",
                    "Community forum participation",
                    "Personalized insights",
                    "Priority support"
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant="default"
                  onClick={() => handleSelectPlan("premium")}
                >
                  Choose Premium
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-2 transition-all hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Family Plan</CardTitle>
                <CardDescription>Support for caregivers and families</CardDescription>
                <div className="mt-4 text-3xl font-bold">$19.99<span className="text-base font-normal text-muted-foreground">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {[
                    "All Premium features",
                    "Multiple user accounts",
                    "Shared calendars",
                    "Caregiver resources",
                    "Family support group",
                    "Dedicated case manager",
                    "24/7 emergency support"
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => handleSelectPlan("family")}
                >
                  Choose Family Plan
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">Join thousands who have improved their brain health journey</h3>
            <p className="text-muted-foreground">
              Our evidence-based approach provides the tools, resources, and community support you need for your unique situation.
            </p>
          </div>

          <div className="flex justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8" 
              onClick={() => navigate("/onboarding?plan=basic&step=3")}
            >
              Start Your Free Trial
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Landing;
