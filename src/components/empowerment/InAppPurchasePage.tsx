
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Crown, Star, Zap, Check, Shield, Heart, Brain, Target, Sparkles } from "lucide-react";

interface InAppPurchasePageProps {
  onBack: () => void;
}

export function InAppPurchasePage({ onBack }: InAppPurchasePageProps) {
  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: '$7.99',
      period: '/month',
      description: 'Perfect for getting started',
      features: [
        'Basic empowerment statements',
        'Daily #IChoose statements',
        'Progress tracking',
        'Basic calendar features'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$9.99',
      period: '/month',
      description: 'Most popular choice',
      popular: true,
      features: [
        'All Starter features',
        'Premium empowerment statements',
        'Advanced planning tools',
        'Goal tracking & analytics',
        'Customizable brain training',
        'Priority support'
      ]
    },
    {
      id: 'family',
      name: 'Care Team',
      price: '$15.99',
      period: '/month',
      description: 'For families and care teams',
      features: [
        'All Pro features',
        'Memory Bank - Capture & preserve memories',
        'Care team collaboration',
        'Watcher collaboration on memories',
        'Family member access',
        'Shared progress tracking',
        'Emergency alerts',
        'Medical report generation'
      ]
    }
  ];

  const benefits = [
    {
      icon: Brain,
      title: "Advanced Brain Training",
      description: "Personalized cognitive exercises designed for brain injury recovery"
    },
    {
      icon: Heart,
      title: "Therapeutic Support",
      description: "Evidence-based tools for emotional wellness and resilience building"
    },
    {
      icon: Target,
      title: "Goal Achievement",
      description: "Smart tracking and adaptive strategies to reach your recovery milestones"
    },
    {
      icon: Shield,
      title: "Medical Integration",
      description: "Seamlessly share progress with healthcare providers and care teams"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/60 via-blue-50/50 to-teal-50/60 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-4 text-purple-700 hover:bg-gradient-to-r hover:from-purple-50/40 hover:via-blue-50/40 hover:to-teal-50/40"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                <Crown className="h-7 w-7 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                  Upgrade MyRhythm
                </h1>
                <p className="text-lg text-gray-600">Transform your recovery journey</p>
              </div>
            </div>
            
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Unlock the full power of personalized cognitive wellness and empowerment tools designed specifically for brain injury recovery
            </p>
            
            <div className="flex justify-center">
              <Badge variant="premium" className="px-4 py-2 text-base">
                <Sparkles className="h-4 w-4 mr-2" />
                Trusted by thousands in their recovery journey
              </Badge>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <Card key={index} className="text-center border-0 bg-gradient-to-br from-white/80 to-purple-50/30 shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pricing Plans */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative transition-all duration-300 hover:scale-105 ${
                plan.popular 
                  ? 'border-2 border-purple-300 shadow-2xl bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30' 
                  : 'border border-gray-200 shadow-lg bg-gradient-to-br from-white to-gray-50/30 hover:shadow-xl'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge variant="premium" className="px-4 py-1 text-sm">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900">{plan.name}</CardTitle>
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                  {plan.price}
                  <span className="text-lg font-normal text-gray-600">{plan.period}</span>
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant={plan.popular ? "premium" : "default"}
                  className="w-full text-base py-3"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Choose {plan.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-white/80 via-purple-50/40 to-blue-50/40 rounded-2xl p-8 border border-purple-100">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">30-Day</div>
                <div className="text-gray-600 font-medium">Money-Back Guarantee</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">HIPAA</div>
                <div className="text-gray-600 font-medium">Compliant & Secure</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">24/7</div>
                <div className="text-gray-600 font-medium">Customer Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
