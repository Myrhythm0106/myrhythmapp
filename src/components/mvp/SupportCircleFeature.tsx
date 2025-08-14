import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Heart, Shield, Star, Crown, Zap } from "lucide-react";

export function SupportCircleFeature() {
  return (
    <section className="py-16 bg-gradient-to-br from-purple-50/30 via-blue-50/20 to-teal-50/30">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 bg-gradient-to-r from-purple-100 to-brain-health-100 text-brain-health-700">
            <Users className="w-4 h-4 mr-2" />
            Support Circle - Coming Soon
          </Badge>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent mb-4">
            Never Walk Your Journey Alone
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with family, caregivers, and healthcare providers in your personalized support network
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Feature Preview */}
          <Card className="bg-gradient-to-br from-white to-purple-50/30 border-purple-200/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-brain-health-500 rounded-lg">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                Connected Care Network
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-purple-200/50">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    M
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Medical Team</p>
                    <p className="text-sm text-gray-600">Dr. Sarah, Therapist John</p>
                  </div>
                  <Shield className="h-4 w-4 text-green-500 ml-auto" />
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-purple-200/50">
                  <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    F
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Family Circle</p>
                    <p className="text-sm text-gray-600">Spouse, Children</p>
                  </div>
                  <Heart className="h-4 w-4 text-red-500 ml-auto" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monetization Tiers */}
          <Card className="bg-gradient-to-br from-white to-brain-health-50/30 border-brain-health-200/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-brain-health-500 to-teal-500 rounded-lg">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                Premium Support Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">Unlimited Members</span>
                  </div>
                  <Badge variant="outline" className="text-purple-600 border-purple-300">
                    Premium
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-teal-600" />
                    <span className="font-medium">Real-time Alerts</span>
                  </div>
                  <Badge variant="outline" className="text-teal-600 border-teal-300">
                    Clinical
                  </Badge>
                </div>
                <div className="text-center pt-2">
                  <p className="text-sm text-gray-600 mb-2">Starting at $9.99/month</p>
                  <Button variant="outline" size="sm" className="text-purple-600 border-purple-300">
                    Learn More
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Value Proposition */}
        <div className="text-center bg-gradient-to-r from-purple-100/50 via-blue-100/30 to-teal-100/50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Accountability that empowers, privacy that protects
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Your Support Circle helps you stay on track while maintaining complete control over your privacy and progress sharing
          </p>
          <Button 
            variant="premium"
            size="lg"
            className="px-8 py-3"
          >
            Join the Waitlist
            <Heart className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}