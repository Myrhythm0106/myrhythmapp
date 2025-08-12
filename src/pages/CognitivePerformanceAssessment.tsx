import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Zap, Target, BarChart3, Lightbulb } from "lucide-react";

const CognitivePerformanceAssessment = () => {
  const navigate = useNavigate();

  const handleStartAssessment = () => {
    navigate("/assessment?type=comprehensive&userType=performance");
  };

  const handleQuickStart = () => {
    navigate("/quick-assessment?userType=performance");
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
              <Zap className="w-4 h-4 mr-2" />
              Cognitive Performance Optimization
            </Badge>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-brain-health-600 bg-clip-text text-transparent mb-4">
              Unlock Your Peak Performance
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced cognitive assessment for professionals, students, and anyone seeking to optimize their mental performance and productivity.
            </p>
          </div>
        </div>

        {/* Performance Statistics */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="text-3xl font-bold text-brain-health-600 mb-2">37%</div>
            <p className="text-gray-600">Increase in productivity metrics</p>
          </Card>
          <Card className="p-6 text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="text-3xl font-bold text-brain-health-600 mb-2">2.8x</div>
            <p className="text-gray-600">Improvement in focus duration</p>
          </Card>
          <Card className="p-6 text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="text-3xl font-bold text-brain-health-600 mb-2">91%</div>
            <p className="text-gray-600">Report feeling more mentally sharp</p>
          </Card>
        </div>

        {/* What Makes This Different */}
        <Card className="p-8 mb-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Designed for Peak Cognitive Performance</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-brain-health-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Precision Cognitive Mapping</h3>
                  <p className="text-gray-600">Detailed analysis of attention, memory, processing speed, and executive function patterns.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-brain-health-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Performance Analytics</h3>
                  <p className="text-gray-600">Data-driven insights into your cognitive strengths and optimization opportunities.</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-brain-health-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Strategic Enhancement Plans</h3>
                  <p className="text-gray-600">Personalized protocols for optimizing focus, memory, and mental agility in your specific context.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-brain-health-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Real-World Applications</h3>
                  <p className="text-gray-600">Practical strategies you can implement immediately in work, study, or competitive environments.</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Use Cases */}
        <Card className="p-8 mb-8 bg-gradient-to-br from-purple-50 to-brain-health-50 border-2 border-purple-200/50">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Perfect for:</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-brain-health-500 rounded-full"></div>
                <span className="text-gray-700">Executives and business leaders</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-brain-health-500 rounded-full"></div>
                <span className="text-gray-700">Students and academics</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-brain-health-500 rounded-full"></div>
                <span className="text-gray-700">Creative professionals</span>
              </li>
            </ul>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-brain-health-500 rounded-full"></div>
                <span className="text-gray-700">Athletes and competitors</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-brain-health-500 rounded-full"></div>
                <span className="text-gray-700">Healthcare professionals</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-brain-health-500 rounded-full"></div>
                <span className="text-gray-700">Anyone seeking cognitive edge</span>
              </li>
            </ul>
          </div>
        </Card>

        {/* Testimonial */}
        <Card className="p-8 mb-8 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200/50">
          <div className="text-center space-y-4">
            <div className="text-4xl">👨‍💼</div>
            <blockquote className="text-lg italic text-gray-700">
              "The insights from my cognitive assessment revolutionized how I approach my workday. I've never felt more mentally sharp and productive."
            </blockquote>
            <div className="space-y-1">
              <div className="font-semibold text-gray-900">Michael R.</div>
              <div className="text-sm text-gray-600">CEO, Tech Startup</div>
            </div>
          </div>
        </Card>

        {/* Assessment Options */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Performance Check (3 minutes)</h3>
            <p className="text-gray-600 mb-6">
              Sample assessment questions focused on professional cognitive performance and optimization potential.
            </p>
            <Button 
              onClick={handleQuickStart}
              variant="outline"
              size="lg"
              className="w-full border-2 border-brain-health-300 hover:border-brain-health-400 hover:bg-brain-health-50"
            >
              Try Performance Preview
            </Button>
          </Card>
          
          <Card className="p-8 bg-gradient-to-br from-purple-50 to-brain-health-50 border-2 border-purple-300 shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Complete Performance Analysis (15 minutes)</h3>
            <p className="text-gray-600 mb-6">
              Comprehensive cognitive performance evaluation with detailed optimization strategies.
            </p>
            <Button 
              onClick={handleStartAssessment}
              size="lg"
              className="w-full bg-gradient-to-r from-purple-600 to-brain-health-600 hover:from-purple-700 hover:to-brain-health-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start Performance Assessment
            </Button>
          </Card>
        </div>

        {/* Professional Note */}
        <div className="text-center mt-8 p-6 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-700">
            <strong>Professional Grade:</strong> This assessment uses evidence-based cognitive evaluation methods 
            adapted for high-performance contexts and optimization goals.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CognitivePerformanceAssessment;