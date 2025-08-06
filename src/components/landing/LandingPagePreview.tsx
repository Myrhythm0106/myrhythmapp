import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  Brain, 
  Heart, 
  Users, 
  ArrowRight, 
  CheckCircle, 
  Sparkles, 
  TrendingUp,
  Shield,
  Eye,
  ChevronDown,
  ChevronUp,
  Play,
  Star
} from "lucide-react";

export function LandingPagePreview() {
  console.log('🎯 LandingPagePreview: Component is rendering!');
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  console.log('🎯 LandingPagePreview: About to return JSX');
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-blue-50/25 to-teal-50/30 relative">
      {/* Clean Professional Background - No Toy Elements */}
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-50/10 via-transparent to-purple-50/10" />
      
      {/* Preview Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={() => setShowBeforeAfter(!showBeforeAfter)}
          variant="outline"
          className="bg-white/90 backdrop-blur-sm"
        >
          {showBeforeAfter ? "Hide Comparison" : "Show Before/After"}
        </Button>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section - Visual-First Approach */}
        <section className="text-center space-y-8 py-16">
          {/* Medical-Grade Visual Branding */}
          <div className="space-y-4">
            <div className="flex justify-center items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 via-blue-600 to-teal-600 rounded-2xl flex items-center justify-center">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                  MyRhythm
                </h1>
                <p className="text-sm text-muted-foreground">Professional Cognitive Wellness Platform</p>
              </div>
            </div>

            {/* Elegant Visual Headline */}
            <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight max-w-4xl mx-auto">
              Transform Your Recovery Journey Into
              <span className="block text-3xl md:text-4xl text-purple-600 font-light mt-2">
                Confident Independence
              </span>
            </h2>

            {/* Visual Progress Indicator */}
            <div className="flex items-center justify-center gap-4 my-8">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-300 opacity-60" />
                <span className="text-sm text-muted-foreground">Struggling</span>
              </div>
              <div className="flex-1 h-1 bg-gradient-to-r from-red-300 via-yellow-300 to-emerald-400 rounded-full max-w-xs" />
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-emerald-400" />
                <span className="text-sm font-medium text-emerald-600">Thriving</span>
              </div>
            </div>
          </div>

          {/* Professional Medical Credentials */}
          <div className="flex flex-wrap justify-center gap-3">
            <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
              <Shield className="h-3 w-3 mr-1" />
              Medical-Grade
            </Badge>
            <Badge className="bg-gradient-to-r from-blue-600 to-teal-600 text-white border-0">
              <CheckCircle className="h-3 w-3 mr-1" />
              Survivor-Tested
            </Badge>
            <Badge className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white border-0">
              <Brain className="h-3 w-3 mr-1" />
              Neurologist-Approved
            </Badge>
          </div>

          {/* Primary CTA - Prominent */}
          <div className="space-y-4">
            <Button 
              size="lg"
              onClick={() => navigate("/onboarding")}
              className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 hover:from-purple-700 hover:via-blue-700 hover:to-teal-700 text-white text-lg px-8 py-6 shadow-lg"
            >
              Begin Your Recovery Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                2-minute preview
              </span>
              <span className="flex items-center gap-1">
                <Play className="h-4 w-4" />
                No signup required
              </span>
            </div>
          </div>
        </section>

        {/* Visual Journey Map - Replacing Text-Heavy Sections */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Your Recovery Journey</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See how our platform guides you from challenge to confidence
            </p>
          </div>

          {/* Interactive Journey Stages */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                stage: "Assess",
                icon: Eye,
                image: "/api/placeholder/300/200",
                title: "Understanding Your Needs",
                description: "Personalized assessment",
                color: "from-purple-500 to-purple-600"
              },
              {
                stage: "Plan", 
                icon: Brain,
                image: "/api/placeholder/300/200",
                title: "Cognitive Roadmap",
                description: "Tailored recovery plan",
                color: "from-blue-500 to-blue-600"
              },
              {
                stage: "Practice",
                icon: TrendingUp,
                image: "/api/placeholder/300/200", 
                title: "Daily Strengthening",
                description: "Structured exercises",
                color: "from-teal-500 to-teal-600"
              },
              {
                stage: "Thrive",
                icon: Sparkles,
                image: "/api/placeholder/300/200",
                title: "Independent Living",
                description: "Confident autonomy", 
                color: "from-emerald-500 to-emerald-600"
              }
            ].map((stage, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 cursor-pointer">
                <CardHeader className="pb-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stage.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                    <stage.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg text-center">{stage.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-3 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Professional Visual</span>
                  </div>
                  <p className="text-sm text-center text-muted-foreground">{stage.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Progressive Disclosure - Success Stories */}
        <section className="py-16">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4">Real Recovery Stories</h3>
            <p className="text-muted-foreground">Professional medical outcomes from our platform</p>
          </div>

          {/* Visual Stats - Replacing Heavy Text */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { metric: "95%", label: "Reduced Missed Appointments", icon: CheckCircle },
              { metric: "78%", label: "Improved Task Completion", icon: TrendingUp },
              { metric: "85%", label: "Family Stress Reduction", icon: Heart }
            ].map((stat, index) => (
              <Card key={index} className="text-center p-6 bg-gradient-to-br from-white to-purple-50/30">
                <stat.icon className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-purple-600 mb-2">{stat.metric}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            ))}
          </div>

          {/* Expandable Testimonials */}
          <div className="space-y-4">
            {[
              {
                id: "sarah",
                name: "Sarah M., Stroke Survivor",
                preview: "\"MyRhythm gave me back my independence after my stroke...\"",
                full: "\"After my stroke, I felt like I'd lost myself. MyRhythm didn't just help me remember things - it helped me rebuild my confidence. The family support features meant my daughter could help without taking over my life. I'm living independently again.\""
              },
              {
                id: "michael", 
                name: "Dr. Michael Chen, Neurologist",
                preview: "\"I recommend MyRhythm to 90% of my brain injury patients...\"",
                full: "\"In 20 years of practice, I've never seen a cognitive wellness platform that combines medical rigor with genuine usability. The visual-first approach works with damaged neural pathways instead of against them. My patients show measurable improvement in executive function.\""
              }
            ].map((testimonial) => (
              <Card key={testimonial.id} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <Star className="h-6 w-6 text-white fill-current" />
                  </div>
                  <div className="flex-1">
                    <p className="text-lg mb-2">{expandedSection === testimonial.id ? testimonial.full : testimonial.preview}</p>
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm text-muted-foreground">{testimonial.name}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSection(testimonial.id)}
                        className="text-purple-600"
                      >
                        {expandedSection === testimonial.id ? (
                          <>Show Less <ChevronUp className="h-4 w-4 ml-1" /></>
                        ) : (
                          <>Read More <ChevronDown className="h-4 w-4 ml-1" /></>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Feature Overview - Visual Icons */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Core Capabilities</h3>
            <Button
              variant="outline"
              onClick={() => toggleSection("features")}
              className="mx-auto"
            >
              {expandedSection === "features" ? "Hide Details" : "Explore Features"}
              {expandedSection === "features" ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
            </Button>
          </div>

          {/* Visual Feature Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Memory Bridge", icon: Brain, color: "purple" },
              { name: "Smart Calendar", icon: CheckCircle, color: "blue" },
              { name: "Family Support", icon: Users, color: "teal" },
              { name: "Progress Tracking", icon: TrendingUp, color: "emerald" }
            ].map((feature, index) => (
               <Card key={index} className="p-6 text-center hover:shadow-lg transition-all">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                  feature.color === 'purple' ? 'bg-gradient-to-br from-purple-400 to-purple-600' :
                  feature.color === 'blue' ? 'bg-gradient-to-br from-blue-400 to-blue-600' :
                  feature.color === 'teal' ? 'bg-gradient-to-br from-teal-400 to-teal-600' :
                  'bg-gradient-to-br from-emerald-400 to-emerald-600'
                }`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold">{feature.name}</h4>
                {expandedSection === "features" && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Professional-grade {feature.name.toLowerCase()} designed for cognitive wellness.
                  </p>
                )}
              </Card>
            ))}
          </div>
        </section>

        {/* Final CTA - Medical Professional */}
        <section className="py-16 text-center">
          <Card className="p-8 bg-gradient-to-br from-purple-50 to-teal-50 border-purple-200">
            <h3 className="text-2xl font-bold mb-4">Ready to Begin Recovery?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of survivors who've reclaimed their independence with professional-grade cognitive wellness tools.
            </p>
            <div className="space-y-4">
              <Button 
                size="lg"
                onClick={() => navigate("/onboarding")}
                className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 text-white px-8 py-6"
              >
                Start Free Assessment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <div className="flex justify-center gap-6 text-sm text-muted-foreground">
                <span>✓ No credit card required</span>
                <span>✓ HIPAA compliant</span>
                <span>✓ Family-friendly</span>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}