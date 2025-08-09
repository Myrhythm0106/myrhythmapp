import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Mic, 
  Heart, 
  Users, 
  Shield, 
  Zap, 
  Target, 
  MessageCircle,
  Crown,
  ArrowRight,
  CheckCircle,
  Clock,
  PlayCircle
} from 'lucide-react';

export function MemoryBridgeStarterDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Brain className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent mb-3">
            Memory Bridge
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Transform conversations into lasting commitments
          </p>
          <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800">
            Free Trial • No Credit Card Required
          </Badge>
        </div>

        {/* Quick Start */}
        <Card className="border-2 border-purple-200 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-purple-900">
              Start Your First Memory Bridge Session
            </CardTitle>
            <p className="text-purple-700">
              Record a conversation and watch AI extract commitments, promises, and next steps
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg bg-white/50">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mic className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-purple-900 mb-2">1. Record</h3>
                <p className="text-sm text-purple-700">Start recording any conversation with family, friends, or healthcare providers</p>
              </div>
              
              <div className="text-center p-4 border rounded-lg bg-white/50">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Brain className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-blue-900 mb-2">2. AI Analysis</h3>
                <p className="text-sm text-blue-700">Our AI extracts commitments, promises, and important next steps</p>
              </div>
              
              <div className="text-center p-4 border rounded-lg bg-white/50">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="font-semibold text-teal-900 mb-2">3. Never Forget</h3>
                <p className="text-sm text-teal-700">Review, confirm, and track all your commitments in one place</p>
              </div>
            </div>
            
            <div className="text-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg"
              >
                <PlayCircle className="h-6 w-6 mr-2" />
                Start Free Recording Session
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Relationship Protection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                <Clock className="h-4 w-4 text-red-500" />
                <span className="text-sm">Track promises to loved ones</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <Shield className="h-4 w-4 text-orange-500" />
                <span className="text-sm">Prevent relationship conflicts</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Never miss important commitments</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                Family Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <MessageCircle className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Share insights with care team</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <Brain className="h-4 w-4 text-purple-500" />
                <span className="text-sm">AI-powered family alerts</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-lg">
                <Target className="h-4 w-4 text-teal-500" />
                <span className="text-sm">Coordinated support system</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sample Results */}
        <Card>
          <CardHeader>
            <CardTitle>See What Memory Bridge Captures</CardTitle>
            <p className="text-muted-foreground">Example from a family dinner conversation</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-lg p-4 bg-gradient-to-r from-green-50 to-blue-50">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Promise to Mom</p>
                  <p className="text-sm text-muted-foreground">"I'll call you every Sunday evening to check in"</p>
                  <Badge variant="secondary" className="mt-1">High emotional importance</Badge>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4 bg-gradient-to-r from-orange-50 to-red-50">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="font-medium">Doctor's Appointment</p>
                  <p className="text-sm text-muted-foreground">"Schedule that follow-up appointment by Friday"</p>
                  <Badge variant="destructive" className="mt-1">Health priority</Badge>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4 bg-gradient-to-r from-purple-50 to-blue-50">
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-purple-500 mt-0.5" />
                <div>
                  <p className="font-medium">Family Gathering</p>
                  <p className="text-sm text-muted-foreground">"Organize the family reunion for Dad's birthday next month"</p>
                  <Badge variant="outline" className="mt-1">Shared responsibility</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upgrade CTA */}
        <Card className="border-2 border-purple-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Ready for Full Memory Bridge?</CardTitle>
            <p className="text-muted-foreground">Unlock unlimited recordings and family sharing</p>
          </CardHeader>
          <CardContent className="text-center">
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Free Trial</h3>
                <ul className="text-sm space-y-1 text-left">
                  <li>• 3 recording sessions</li>
                  <li>• Basic AI extraction</li>
                  <li>• Personal dashboard</li>
                </ul>
              </div>
              
              <div className="p-4 border-2 border-purple-200 rounded-lg bg-purple-50">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Crown className="h-4 w-4" />
                  Premium
                </h3>
                <ul className="text-sm space-y-1 text-left">
                  <li>• Unlimited recordings</li>
                  <li>• Family integration</li>
                  <li>• Crisis prevention</li>
                  <li>• Advanced AI insights</li>
                </ul>
              </div>
            </div>
            
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3"
            >
              <Crown className="h-5 w-5 mr-2" />
              Upgrade to Premium
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              £19.99/month • 7-day free trial • Cancel anytime
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}