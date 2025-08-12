import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Brain, Heart, Users, TrendingUp } from "lucide-react";

const BrainInjuryAssessment = () => {
  const navigate = useNavigate();

  const handleStartAssessment = () => {
    navigate("/assessment?type=comprehensive&userType=brain-injury");
  };

  const handleQuickStart = () => {
    navigate("/quick-assessment?userType=brain-injury");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50/30 to-brain-health-50/20 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <Button 
            onClick={() => navigate("/")}
            variant="ghost" 
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          
          <div className="text-center">
            <Badge className="mb-4 bg-gradient-to-r from-purple-100 to-brain-health-100 text-brain-health-700">
              <Brain className="w-4 h-4 mr-2" />
              Brain Injury Recovery Path
            </Badge>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-brain-health-600 bg-clip-text text-transparent mb-4">
              Your Journey Back to Confidence
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Specialized assessment designed for brain injury survivors to rediscover cognitive strengths and build sustainable recovery patterns.
            </p>
          </div>
        </div>

        {/* Recovery Statistics */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="text-3xl font-bold text-brain-health-600 mb-2">89%</div>
            <p className="text-gray-600">Report improved daily confidence</p>
          </Card>
          <Card className="p-6 text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="text-3xl font-bold text-brain-health-600 mb-2">2.5x</div>
            <p className="text-gray-600">Faster task completion after 30 days</p>
          </Card>
          <Card className="p-6 text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="text-3xl font-bold text-brain-health-600 mb-2">94%</div>
            <p className="text-gray-600">Feel more supported in their journey</p>
          </Card>
        </div>

        {/* What Makes This Different */}
        <Card className="p-8 mb-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Designed Specifically for Brain Injury Recovery</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-brain-health-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Trauma-Informed Assessment</h3>
                  <p className="text-gray-600">Questions designed with understanding of brain injury experiences and recovery challenges.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-brain-health-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Strength-Based Approach</h3>
                  <p className="text-gray-600">Focus on identifying and building upon your existing cognitive strengths and resilience.</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-brain-health-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Support Network Integration</h3>
                  <p className="text-gray-600">Tools to involve caregivers and support people in your recovery journey effectively.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-brain-health-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Progressive Recovery Tracking</h3>
                  <p className="text-gray-600">Celebrate small wins and track improvement patterns that matter most to your daily life.</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Testimonial */}
        <Card className="p-8 mb-8 bg-gradient-to-br from-purple-50 to-brain-health-50 border-2 border-purple-200/50">
          <div className="text-center space-y-4">
            <div className="text-4xl">👩‍💼</div>
            <blockquote className="text-lg italic text-gray-700">
              "After my accident, I thought I'd never feel confident about my memory again. MyRhythm helped me understand that my brain had just developed a new rhythm - and that rhythm could be incredibly powerful."
            </blockquote>
            <div className="space-y-1">
              <div className="font-semibold text-gray-900">Sarah M.</div>
              <div className="text-sm text-gray-600">TBI Survivor, 18 months post-injury</div>
            </div>
          </div>
        </Card>

        {/* Assessment Options */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Preview (3 minutes)</h3>
            <p className="text-gray-600 mb-6">
              Get a taste of how the assessment works with 3 sample questions designed for brain injury recovery.
            </p>
            <Button 
              onClick={handleQuickStart}
              variant="outline"
              size="lg"
              className="w-full border-2 border-brain-health-300 hover:border-brain-health-400 hover:bg-brain-health-50"
            >
              Try Quick Preview
            </Button>
          </Card>
          
          <Card className="p-8 bg-gradient-to-br from-purple-50 to-brain-health-50 border-2 border-purple-300 shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Complete Assessment (15 minutes)</h3>
            <p className="text-gray-600 mb-6">
              Comprehensive evaluation of your cognitive patterns with personalized recovery recommendations.
            </p>
            <Button 
              onClick={handleStartAssessment}
              size="lg"
              className="w-full bg-gradient-to-r from-purple-600 to-brain-health-600 hover:from-purple-700 hover:to-brain-health-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start Your Recovery Assessment
            </Button>
          </Card>
        </div>

        {/* Support Note */}
        <div className="text-center mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700">
            <strong>Note:</strong> This assessment is designed to complement, not replace, professional medical care. 
            Always consult with your healthcare team about your recovery journey.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BrainInjuryAssessment;