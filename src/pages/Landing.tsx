
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Check, ArrowRight, Star, Heart, Compass, Network } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const Landing = () => {
  const navigate = useNavigate();
  
  const handleSelectPlan = (plan: string) => {
    navigate(`/onboarding?plan=${plan}&step=3`);
  };
  
  const features = [{
    icon: <Brain className="h-10 w-10 text-primary" />,
    title: "Unlock Your Cognitive Edge",
    description: "MyRhythm doesn't just remind, it anticipates. By understanding your rhythm, it proactively suggests optimal schedules and breaks down complex tasks."
  }, {
    icon: <Compass className="h-10 w-10 text-primary" />,
    title: "Visualise Your Victories",
    description: "Our revolutionary Visual Flow Builder transforms your day into an intuitive, drag-and-drop map of success. See the path, own the process."
  }, {
    icon: <Heart className="h-10 w-10 text-primary" />,
    title: "Transform Emotional Insight to Productivity",
    description: "MyRhythm's gentle emotional check-ins reveal powerful connections between mood and achievement, converting self-awareness into actionable productivity strategies."
  }, {
    icon: <Network className="h-10 w-10 text-primary" />,
    title: "Community Connection",
    description: "The network and support that understand and motivate and encourage you every step of your journey."
  }];

  return <div className="min-h-screen bg-gradient-to-b from-muted/60 to-background">
      <ScrollArea className="h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-20 md:py-32">
            <div className="container mx-auto px-4 max-w-6xl">
              <div className="flex justify-center mb-8">
                <div className="flex items-center gap-2">
                  <Brain className="h-14 w-14 text-primary" />
                  <h1 className="text-5xl font-bold">MyRhythm</h1>
                </div>
              </div>
              
              <div className="text-center mb-12 max-w-3xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  Unlock Your Cognitive Edge with MyRhythm
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Empowering you to live O.R.D.E.R.ly. Organize priorities, build Routines, strengthen Discipline, Execute with focus, and Review with intention. It's not just productivity—it's your rhythm for life.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="text-lg" onClick={() => navigate("/dashboard")}>
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

        {/* Features Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Align Your Emotions for Peak Performance</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                MyRhythm combines cutting-edge technology with human-centered design to help you achieve more with less stress.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {features.map((feature, index) => <Card key={index} className="border shadow-sm hover:shadow-md transition-all overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="mb-3">{feature.icon}</div>
                    <CardTitle className="text-2xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>)}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 bg-muted/40">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Choose Your Plan</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Select the plan that best fits your needs and start your journey to better brain health and productivity.
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
                    {["Basic symptom tracking", "Limited calendar features", "Access to public resources", "Community forum access"].map(feature => <li key={feature} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-green-500" />
                        <span>{feature}</span>
                      </li>)}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => handleSelectPlan("basic")}>
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
                    {["Advanced symptom tracking", "Full calendar management", "Complete resource library", "Community forum participation", "Personalized insights", "Priority support"].map(feature => <li key={feature} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-green-500" />
                        <span>{feature}</span>
                      </li>)}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="default" onClick={() => handleSelectPlan("premium")}>
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
                    {["All Premium features", "Multiple user accounts", "Shared calendars", "Caregiver resources", "Family support group", "Dedicated case manager", "24/7 emergency support"].map(feature => <li key={feature} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-green-500" />
                        <span>{feature}</span>
                      </li>)}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline" onClick={() => handleSelectPlan("family")}>
                    Choose Family Plan
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">What Our Users Say</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Join thousands who have improved their brain health journey with MyRhythm.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[{
              quote: "MyRhythm has completely transformed how I manage my day. I feel in control for the first time in years.",
              author: "Alex D."
            }, {
              quote: "The emotional insights feature helped me understand my patterns and make meaningful changes to my routine.",
              author: "Morgan T."
            }, {
              quote: "As a caregiver, the family plan features have made coordinating care so much easier and less stressful.",
              author: "Jamie L."
            }].map((testimonial, index) => <Card key={index} className="bg-muted/30">
                  <CardContent className="pt-6">
                    <div className="mb-4">
                      {[...Array(5)].map((_, i) => <Star key={i} className="inline-block h-4 w-4 text-primary fill-primary" />)}
                    </div>
                    <p className="italic mb-4">"{testimonial.quote}"</p>
                    <p className="font-semibold">— {testimonial.author}</p>
                  </CardContent>
                </Card>)}
            </div>

            <div className="flex justify-center">
              <Button size="lg" className="text-lg px-8" onClick={() => navigate("/onboarding?plan=basic&step=3")}>
                Start Your Free Trial
              </Button>
            </div>
          </div>
        </section>
      </ScrollArea>
    </div>;
};

export default Landing;
