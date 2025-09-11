import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Brain, Crown, Zap, CheckCircle } from 'lucide-react';

interface AssessmentTypeSelectionProps {
  onSelectType: (type: 'brief' | 'comprehensive') => void;
  onBack?: () => void;
}

export function AssessmentTypeSelection({ onSelectType, onBack }: AssessmentTypeSelectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-brain-health-50/20 to-clarity-teal-50/15">
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-8">
            <Badge className="bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 text-white border-0 px-4 py-2 mb-4">
              <Brain className="h-4 w-4 mr-2" />
              Choose Your Assessment
            </Badge>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-brain-health-600 to-clarity-teal-600 bg-clip-text text-transparent mb-4">
              Which Assessment Suits You Best?
            </h1>
            <p className="text-brain-health-700 max-w-2xl mx-auto">
              Select the assessment that matches your time and needs. Both provide valuable insights for your cognitive wellness journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Brief Assessment */}
            <Card className="premium-card group hover:shadow-xl transition-all duration-300 border-0 relative">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-memory-emerald-500 to-brain-health-500 rounded-xl flex items-center justify-center">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <Badge variant="outline" className="border-memory-emerald-200 text-memory-emerald-700">
                    <Clock className="h-3 w-3 mr-1" />
                    5 minutes
                  </Badge>
                </div>
                <CardTitle className="text-xl therapeutic-accent">Quick Assessment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Get essential insights with our streamlined assessment. Perfect for getting started quickly.
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-memory-emerald-500" />
                    <span className="text-sm">8 targeted questions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-memory-emerald-500" />
                    <span className="text-sm">Core cognitive areas covered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-memory-emerald-500" />
                    <span className="text-sm">Immediate results & recommendations</span>
                  </div>
                </div>

                <Button 
                  onClick={() => onSelectType('brief')}
                  className="w-full bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 hover:from-memory-emerald-600 hover:to-brain-health-600 text-white group"
                >
                  Start Quick Assessment
                  <Zap className="h-4 w-4 ml-2 group-hover:scale-110 transition-transform" />
                </Button>
              </CardContent>
            </Card>

            {/* Comprehensive Assessment */}
            <Card className="premium-card group hover:shadow-xl transition-all duration-300 border-0 relative">
              <div className="absolute top-3 right-3">
                <Badge className="bg-gradient-to-r from-clarity-teal-500 to-beacon-500 text-white">
                  <Crown className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              </div>
              
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-clarity-teal-500 to-beacon-500 rounded-xl flex items-center justify-center">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <Badge variant="outline" className="border-clarity-teal-200 text-clarity-teal-700">
                    <Clock className="h-3 w-3 mr-1" />
                    15 minutes
                  </Badge>
                </div>
                <CardTitle className="text-xl therapeutic-accent">Complete Assessment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Comprehensive evaluation providing deep insights and personalized recommendations for optimal results.
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-clarity-teal-500" />
                    <span className="text-sm">All brief questions + advanced topics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-clarity-teal-500" />
                    <span className="text-sm">Detailed cognitive mapping</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-clarity-teal-500" />
                    <span className="text-sm">Personalized recovery protocol</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-clarity-teal-500" />
                    <span className="text-sm">Advanced insights & analytics</span>
                  </div>
                </div>

                <Button 
                  onClick={() => onSelectType('comprehensive')}
                  variant="outline"
                  className="w-full border-clarity-teal-300 hover:bg-clarity-teal-50 hover:border-clarity-teal-400 group"
                >
                  Start Complete Assessment
                  <Brain className="h-4 w-4 ml-2 group-hover:scale-110 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground mb-4">
              You can always upgrade to the comprehensive assessment later for deeper insights.
            </p>
            
            {onBack && (
              <Button variant="ghost" onClick={onBack} className="text-muted-foreground">
                ← Back to Previous Step
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}