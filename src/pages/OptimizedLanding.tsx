
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PersistentRegisterButton } from '@/components/ui/PersistentRegisterButton';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Heart, 
  Zap, 
  Users, 
  Target, 
  CheckCircle, 
  Star,
  ArrowRight,
  Clock,
  Shield,
  Sparkles,
  Crown
} from 'lucide-react';

export function OptimizedLanding() {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const handleGetStarted = () => {
    navigate('/onboarding');
  };

  const painPoints = [
    {
      id: 'memory',
      icon: Brain,
      title: "I Can't Remember",
      subtitle: "I am alone",
      description: "Conversations slip away, promises forgotten, relationships strained by missed commitments",
      gradient: "from-red-500 to-orange-500"
    },
    {
      id: 'overwhelm',
      icon: Zap,
      title: "I'm Overwhelmed",
      description: "Too many tasks, scattered focus, feeling burned out and unproductive",
      gradient: "from-orange-500 to-yellow-500"
    },
    {
      id: 'disconnect',
      icon: Heart,
      title: "I Feel Disconnected",
      description: "Lost touch with family, struggling to maintain meaningful relationships",
      gradient: "from-purple-500 to-pink-500"
    }
  ];

  const solutions = [
    {
      icon: Target,
      title: "Never Forget Again",
      description: "AI-powered Memory Bridge captures every promise and commitment automatically"
    },
    {
      icon: Users,
      title: "Strengthen Relationships",
      description: "Keep your support circle informed and engaged in your journey"
    },
    {
      icon: CheckCircle,
      title: "Follow Through",
      description: "Track progress and accountability with your personal PACT system"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-emerald-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-teal-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                MyRhythm
              </span>
            </div>
            
            <Button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white px-6 py-2"
            >
              <Crown className="w-4 h-4 mr-2" />
              Get Started Free
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-16">
          <Badge className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-6 py-2 text-lg">
            <Sparkles className="w-4 h-4 mr-2" />
            Transform Your Life Today
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            Never Forget a
            <span className="block bg-gradient-to-r from-teal-600 via-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Promise Again
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            AI-powered Memory Bridge helps you remember commitments, strengthen relationships, 
            and follow through on what matters most—with your support circle by your side.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="bg-gradient-to-r from-teal-600 via-emerald-600 to-blue-600 hover:from-teal-700 hover:via-emerald-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Start Your Free Assessment
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>5-minute setup</span>
              <Shield className="w-4 h-4 ml-2" />
              <span>100% private</span>
            </div>
          </div>
        </div>

        {/* Pain Points Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            You're Not Alone in These Struggles
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {painPoints.map((pain) => {
              const Icon = pain.icon;
              return (
                <Card
                  key={pain.id}
                  className="border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg cursor-pointer"
                  onMouseEnter={() => setHoveredCard(pain.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <CardContent className="p-8 text-center space-y-4">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${pain.gradient} flex items-center justify-center mx-auto`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {pain.title}
                      </h3>
                      {pain.subtitle && (
                        <p className="text-sm text-gray-500 italic mb-3">
                          {pain.subtitle}
                        </p>
                      )}
                      <p className="text-gray-600 leading-relaxed">
                        {pain.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Solutions Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Here's How MyRhythm Changes Everything
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {solutions.map((solution, index) => {
              const Icon = solution.icon;
              return (
                <Card key={index} className="border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-emerald-50 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-8 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center mx-auto">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-teal-900">
                      {solution.title}
                    </h3>
                    
                    <p className="text-teal-700 leading-relaxed">
                      {solution.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Social Proof */}
        <div className="text-center bg-white rounded-2xl shadow-xl p-12 mb-16">
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 text-yellow-500 fill-current" />
            ))}
          </div>
          
          <blockquote className="text-2xl text-gray-700 italic mb-6">
            "MyRhythm helped me rebuild trust with my family. I finally follow through on my promises."
          </blockquote>
          
          <div className="text-gray-600">
            <p className="font-semibold">Sarah M.</p>
            <p>Working parent, Premium user</p>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center bg-gradient-to-r from-teal-500 via-emerald-500 to-blue-500 rounded-2xl text-white p-12">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Life?
          </h2>
          
          <p className="text-xl mb-8 opacity-90">
            Join thousands who never miss a commitment again
          </p>
          
          <Button
            onClick={handleGetStarted}
            size="lg"
            className="bg-white text-teal-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
          >
            Start Your Free Journey Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>

      {/* Persistent Register Button */}
      <PersistentRegisterButton />
    </div>
  );
}
