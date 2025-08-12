import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Sparkles, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const quickQuestions = [
  {
    id: 1,
    text: "How would you describe your current memory confidence?",
    options: [
      "I feel confident most of the time",
      "Some days are better than others", 
      "I struggle with memory daily",
      "I'm looking to optimize my performance"
    ]
  },
  {
    id: 2,
    text: "What's your main goal for improving your cognitive function?",
    options: [
      "Recover from brain injury or trauma",
      "Manage age-related memory changes",
      "Enhance workplace performance",
      "Support a loved one's journey"
    ]
  },
  {
    id: 3,
    text: "How often do memory challenges affect your daily activities?",
    options: [
      "Rarely - just want to optimize",
      "Occasionally - minor impact",
      "Frequently - moderate impact", 
      "Daily - significant challenges"
    ]
  }
];

const QuickAssessment = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);

  const handleResponse = (response: string) => {
    setResponses(prev => ({
      ...prev,
      [currentQuestion]: response
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < quickQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleUpgrade = () => {
    navigate("/auth");
  };

  const handleTryFull = () => {
    navigate("/comprehensive-assessment");
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50/30 to-brain-health-50/20 py-8">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-gradient-to-r from-purple-100 to-brain-health-100 text-brain-health-700">
              <Sparkles className="w-4 h-4 mr-2" />
              Quick Assessment Complete
            </Badge>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-brain-health-600 bg-clip-text text-transparent mb-4">
              Your Memory Potential Preview
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Based on your responses, here's a glimpse of your cognitive patterns
            </p>
          </div>

          {/* Preview Results */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Memory Confidence Score</h3>
              <div className="text-4xl font-bold text-brain-health-600 mb-2">72%</div>
              <p className="text-gray-600">Your current confidence level indicates room for significant improvement through targeted strategies.</p>
            </Card>
            
            <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Recommended Path</h3>
              <div className="text-lg font-semibold text-purple-600 mb-2">Brain Health Optimization</div>
              <p className="text-gray-600">A personalized approach focusing on memory confidence and daily life integration.</p>
            </Card>
          </div>

          {/* Locked Premium Content */}
          <Card className="p-8 bg-gradient-to-br from-purple-50 to-brain-health-50 border-2 border-purple-200/50 mb-8">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-brain-health-500 rounded-full flex items-center justify-center">
                  <Lock className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900">Unlock Your Complete MYRHYTHM Analysis</h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Get your detailed cognitive pattern analysis, personalized recommendations, and access to the full MYRHYTHM assessment framework.
              </p>
              
              <div className="bg-white rounded-lg p-6 space-y-4">
                <h4 className="font-semibold text-gray-900 text-left">What you'll unlock:</h4>
                <ul className="text-left space-y-2 text-gray-600">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-brain-health-500 rounded-full"></div>
                    Detailed cognitive pattern analysis across 8 key dimensions
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-brain-health-500 rounded-full"></div>
                    Personalized daily strategies and interventions
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-brain-health-500 rounded-full"></div>
                    Progress tracking and momentum building tools
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-brain-health-500 rounded-full"></div>
                    Support network integration features
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleUpgrade}
              size="lg"
              className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 to-brain-health-600 hover:from-purple-700 hover:to-brain-health-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start Your MYRHYTHM Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              onClick={handleTryFull}
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg font-semibold border-2 border-gray-300 hover:border-brain-health-400 hover:bg-brain-health-50"
            >
              Try Comprehensive Assessment
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50/30 to-brain-health-50/20 py-8">
      <div className="max-w-3xl mx-auto px-6">
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
              <Sparkles className="w-4 h-4 mr-2" />
              Quick Assessment Preview
            </Badge>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-brain-health-600 bg-clip-text text-transparent">
              Discover Your Memory Potential
            </h1>
            <p className="text-gray-600 mt-2">
              3 quick questions to preview your cognitive patterns
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestion + 1} of {quickQuestions.length}</span>
            <span>{Math.round(((currentQuestion + 1) / quickQuestions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-brain-health-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / quickQuestions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {quickQuestions[currentQuestion].text}
            </h2>
            
            <div className="space-y-3">
              {quickQuestions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleResponse(option)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                    responses[currentQuestion] === option
                      ? 'border-brain-health-400 bg-brain-health-50'
                      : 'border-gray-200 hover:border-brain-health-300 hover:bg-brain-health-50/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      responses[currentQuestion] === option
                        ? 'bg-brain-health-400 border-brain-health-400'
                        : 'border-gray-300'
                    }`} />
                    <span className="text-gray-700">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            onClick={prevQuestion}
            variant="outline"
            disabled={currentQuestion === 0}
            className={currentQuestion === 0 ? 'invisible' : ''}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          
          <Button
            onClick={nextQuestion}
            disabled={!responses[currentQuestion]}
            className="bg-gradient-to-r from-purple-600 to-brain-health-600 hover:from-purple-700 hover:to-brain-health-700"
          >
            {currentQuestion === quickQuestions.length - 1 ? 'See Results' : 'Next'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickAssessment;