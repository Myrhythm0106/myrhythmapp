
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Crown, Star, Zap, Check } from "lucide-react";

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
        'Customizable themes',
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
        'Family member access',
        'Care team collaboration',
        'Shared progress tracking',
        'Emergency alerts',
        'Medical report generation'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-4 text-purple-700 hover:bg-purple-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <Crown className="h-8 w-8 text-amber-500" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Upgrade MyRhythm
              </h1>
            </div>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Unlock the full power of personalized cognitive wellness and empowerment
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative ${plan.popular ? 'border-2 border-purple-400 shadow-xl' : 'border border-gray-200'}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="text-4xl font-bold text-purple-600">
                  {plan.price}
                  <span className="text-lg font-normal text-gray-600">{plan.period}</span>
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' 
                      : 'bg-gray-600 hover:bg-gray-700'
                  }`}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Choose {plan.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
