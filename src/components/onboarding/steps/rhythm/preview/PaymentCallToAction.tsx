
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Sparkles, Zap, Lock, ChevronDown, Crown, Star, Timer, TrendingUp } from "lucide-react";

interface PaymentCallToActionProps {
  onPaymentSelect: (option: 'trial' | 'monthly' | 'annual' | 'skip') => void;
}

export function PaymentCallToAction({ onPaymentSelect }: PaymentCallToActionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Main Premium Unlock Card */}
      <Card className="border-4 border-gradient-to-r from-purple-500 to-blue-500 bg-gradient-to-br from-purple-50 to-blue-50 shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Crown className="h-8 w-8 text-yellow-500" />
            <Badge className="bg-red-600 text-white px-3 py-1 animate-pulse">
              LIMITED TIME
            </Badge>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            🚀 Unlock Your Complete Transformation Plan
          </CardTitle>
          <p className="text-lg text-gray-700 mt-2">
            You're missing <strong>7 personalized insights</strong> and your <strong>complete 8-week action plan</strong>
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Value Proposition Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border-2 border-green-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-green-800">What You Get Instantly:</h3>
              </div>
              <ul className="space-y-2 text-sm text-green-700">
                <li>• 7 Additional Personalized Insights</li>
                <li>• Complete 8-Week Action Plan</li>
                <li>• Progress Tracking Dashboard</li>
                <li>• Goal Setting Templates</li>
                <li>• Milestone Celebrations</li>
                <li>• Ongoing Support & Guidance</li>
              </ul>
            </div>
            
            <div className="bg-white p-4 rounded-lg border-2 border-red-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-red-600" />
                <h3 className="font-semibold text-red-800">Success Stories:</h3>
              </div>
              <div className="space-y-2 text-sm text-red-700">
                <p className="italic">"Transformed my daily routine in just 2 weeks"</p>
                <p className="italic">"Finally have clarity on my goals"</p>
                <p className="italic">"The personalized plan actually works!"</p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-yellow-500">★★★★★</span>
                  <span className="text-xs">4.9/5 from 2,847 users</span>
                </div>
              </div>
            </div>
          </div>

          {/* Urgent Pricing Section */}
          <div className="bg-gradient-to-r from-red-100 to-orange-100 p-6 rounded-xl border-2 border-red-300">
            <div className="text-center mb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Timer className="h-6 w-6 text-red-600 animate-pulse" />
                <Badge className="bg-red-600 text-white px-4 py-2 font-bold">
                  20% OFF - TODAY ONLY
                </Badge>
              </div>
              <p className="text-red-800 font-semibold">
                Complete your assessment today and save £47.98/year
              </p>
            </div>
            
            <div className="grid gap-3 max-w-lg mx-auto">
              <Button
                onClick={() => onPaymentSelect('trial')}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white font-bold text-lg py-4 shadow-lg"
              >
                <Sparkles className="h-6 w-6 mr-3" />
                START 7-DAY PREMIUM TRIAL
                <Badge className="ml-3 bg-yellow-500 text-black font-bold">FREE</Badge>
              </Button>
              
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => onPaymentSelect('annual')}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold relative"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Annual (Save 20%)
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">
                    BEST VALUE
                  </Badge>
                </Button>
                <Button
                  onClick={() => onPaymentSelect('monthly')}
                  variant="outline"
                  className="border-2 font-semibold"
                >
                  Monthly Plan
                </Button>
              </div>
            </div>
          </div>

          {/* Feature Comparison */}
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <div className="bg-white/80 p-4 rounded-lg border border-gray-300 cursor-pointer hover:bg-white/90 transition-colors">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-800 flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    See exactly what you're missing in Preview Mode
                  </p>
                  <ChevronDown 
                    className={`h-5 w-5 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </div>
              </div>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="mt-2">
              <div className="bg-white/80 p-4 rounded-lg border border-gray-300">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <Badge variant="outline" className="text-orange-600">Preview Mode</Badge>
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 1 basic insight</li>
                      <li>• General recommendations</li>
                      <li>• Basic progress indicator</li>
                      <li>• No action plan</li>
                      <li>• No tracking tools</li>
                      <li>• No ongoing support</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <Badge className="bg-green-600 text-white">Premium Access</Badge>
                    </h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• 8 personalized insights</li>
                      <li>• Custom strategies for your situation</li>
                      <li>• Detailed progress analytics</li>
                      <li>• Complete 8-week action plan</li>
                      <li>• Goal templates & tracking</li>
                      <li>• Ongoing support & guidance</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Social Proof */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="text-center">
              <p className="text-blue-800 font-semibold mb-2">
                Join 10,000+ users who've transformed their lives with Premium
              </p>
              <div className="flex justify-center items-center gap-4 text-sm text-blue-700">
                <span>⚡ Instant access</span>
                <span>🎯 Proven results</span>
                <span>🛡️ 30-day guarantee</span>
              </div>
            </div>
          </div>

          {/* Reluctant Skip Option */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">
              Not ready to unlock your full potential today?
            </p>
            <Button
              onClick={() => onPaymentSelect('skip')}
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700 underline"
            >
              Continue with limited preview (miss out on personalized insights)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Fear of Missing Out Card */}
      <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200">
        <CardContent className="text-center p-6">
          <h3 className="font-bold text-red-900 text-xl mb-2">
            ⚠️ Don't Miss Out on Your Transformation
          </h3>
          <p className="text-red-700 mb-4">
            Thousands of users wish they had started their Premium journey sooner. 
            Your personalized plan is ready - take action now!
          </p>
          <div className="flex justify-center gap-4 text-sm text-red-600">
            <span>⏰ Limited time offer</span>
            <span>📈 Proven success rate</span>
            <span>💪 Start today, see results this week</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
