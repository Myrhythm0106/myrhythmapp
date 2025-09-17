import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Crown, 
  Star, 
  TrendingUp, 
  Clock, 
  Users, 
  Shield,
  X,
  CheckCircle,
  Zap,
  Heart,
  Brain,
  Target
} from 'lucide-react';

interface ConversionOptimizationModalProps {
  assessmentResult: {
    overallScore: number;
    riskLevel: 'low' | 'moderate' | 'high';
    primaryRhythm: string;
    cognitiveImpact: {
      memoryRetention: number;
      processingSpeed: number;
      attentionSpan: number;
      executiveFunction: number;
      emotionalRegulation: number;
    };
  };
  onClose: () => void;
  onUpgrade: () => void;
}

export function ConversionOptimizationModal({ assessmentResult, onClose, onUpgrade }: ConversionOptimizationModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPersonalizedImprovements = () => {
    const improvements = [];
    
    if (assessmentResult.cognitiveImpact.memoryRetention < 70) {
      improvements.push({
        icon: Brain,
        title: "Memory Breakthrough",
        description: "Restore 40-60% of memory function with personalized protocols",
        timeframe: "3-6 weeks",
        color: "bg-blue-100 text-blue-800"
      });
    }

    if (assessmentResult.cognitiveImpact.attentionSpan < 70) {
      improvements.push({
        icon: Target,
        title: "Focus Mastery",
        description: "Extend attention span from minutes to 2+ hours consistently",
        timeframe: "4-8 weeks", 
        color: "bg-purple-100 text-purple-800"
      });
    }

    if (assessmentResult.cognitiveImpact.processingSpeed < 70) {
      improvements.push({
        icon: Zap,
        title: "Mental Agility",
        description: "Increase processing speed and mental clarity by 35%",
        timeframe: "2-4 weeks",
        color: "bg-yellow-100 text-yellow-800"
      });
    }

    if (assessmentResult.cognitiveImpact.emotionalRegulation < 70) {
      improvements.push({
        icon: Heart,
        title: "Emotional Balance", 
        description: "Achieve stable moods and stress resilience",
        timeframe: "1-3 weeks",
        color: "bg-pink-100 text-pink-800"
      });
    }

    return improvements.slice(0, 3);
  };

  const slides = [
    // Slide 1: Personal Impact
    {
      title: "Your Cognitive Recovery Potential",
      subtitle: "Based on your assessment profile",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-brain-health-500 to-memory-emerald-500 rounded-full text-white text-3xl font-bold mb-4">
              {100 - assessmentResult.overallScore}%
            </div>
            <p className="text-lg font-medium text-brain-health-700">
              Recovery Opportunity Identified
            </p>
            <p className="text-sm text-brain-health-600">
              Your assessment reveals significant improvement potential
            </p>
          </div>

          <div className="space-y-3">
            {getPersonalizedImprovements().map((improvement, index) => {
              const Icon = improvement.icon;
              return (
                <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-brain-health-200">
                  <div className="flex-shrink-0">
                    <div className={`p-2 rounded-full ${improvement.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-brain-health-800">{improvement.title}</h4>
                    <p className="text-sm text-brain-health-600">{improvement.description}</p>
                  </div>
                  <Badge className="bg-memory-emerald-100 text-memory-emerald-700">
                    {improvement.timeframe}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>
      )
    },

    // Slide 2: Social Proof
    {
      title: "Others Like You Are Transforming",
      subtitle: `${assessmentResult.riskLevel} risk profile success stories`,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                name: "Maria, 42",
                condition: "TBI Recovery",
                result: "Memory improved 65% in 8 weeks",
                quote: "I can follow conversations again!",
                avatar: "M"
              },
              {
                name: "James, 38", 
                condition: "Post-Concussion",
                result: "Returned to work full-time",
                quote: "MyRhythm gave me my life back",
                avatar: "J"
              },
              {
                name: "Sarah, 45",
                condition: "Stroke Recovery", 
                result: "Independent living restored",
                quote: "I feel like myself again",
                avatar: "S"
              },
              {
                name: "David, 52",
                condition: "Brain Injury",
                result: "Cognitive fog completely lifted",
                quote: "Clear thinking returned in 6 weeks",
                avatar: "D"
              }
            ].map((story, index) => (
              <div key={index} className="p-4 bg-gradient-to-br from-memory-emerald-50 to-brain-health-50 rounded-lg border border-memory-emerald-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 rounded-full flex items-center justify-center text-white font-bold">
                    {story.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-memory-emerald-800">{story.name}</p>
                    <p className="text-xs text-memory-emerald-600">{story.condition}</p>
                  </div>
                </div>
                <p className="text-sm font-medium text-memory-emerald-700 mb-2">{story.result}</p>
                <p className="text-xs text-memory-emerald-600 italic">"{story.quote}"</p>
              </div>
            ))}
          </div>

          <div className="text-center p-4 bg-gradient-to-r from-brain-health-100 to-memory-emerald-100 rounded-lg">
            <p className="font-semibold text-brain-health-800">
              🎉 Over 15,000 people with similar profiles have seen measurable improvements
            </p>
            <p className="text-sm text-brain-health-600 mt-1">
              Average improvement: 45% in cognitive function within 90 days
            </p>
          </div>
        </div>
      )
    },

    // Slide 3: Urgency & Offer
    {
      title: "Special Assessment-Based Offer",
      subtitle: "Limited time for assessment completers",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center space-x-2 mb-4">
              <Clock className="h-6 w-6 text-orange-500" />
              <span className="text-2xl font-bold text-orange-600">{formatTime(timeLeft)}</span>
            </div>
            <p className="text-sm text-orange-600 font-medium">
              This offer expires when timer reaches zero
            </p>
          </div>

          <div className="bg-gradient-to-r from-brain-health-50 to-memory-emerald-50 p-6 rounded-lg border-2 border-brain-health-300">
            <div className="text-center mb-4">
              <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 text-lg font-bold animate-pulse">
                🔥 ASSESSMENT COMPLETERS ONLY
              </Badge>
            </div>
            
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-brain-health-600 mb-2">
                <span className="line-through text-gray-400 text-xl">£29.99</span> £7.99/month
              </div>
              <p className="text-lg font-medium text-brain-health-700">
                73% OFF Your First 3 Months
              </p>
              <p className="text-sm text-brain-health-600">
                Then £14.99/month (cancel anytime)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-3 bg-white rounded border border-brain-health-200">
                <Shield className="h-6 w-6 text-brain-health-500 mx-auto mb-1" />
                <p className="text-sm font-medium text-brain-health-700">30-Day Guarantee</p>
              </div>
              <div className="text-center p-3 bg-white rounded border border-brain-health-200">
                <Users className="h-6 w-6 text-brain-health-500 mx-auto mb-1" />
                <p className="text-sm font-medium text-brain-health-700">Support Circle Included</p>
              </div>
            </div>

            <div className="space-y-2 text-sm text-brain-health-600">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-memory-emerald-500" />
                <span>Personalized cognitive training protocols</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-memory-emerald-500" />
                <span>Memory Bridge with unlimited recordings</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-memory-emerald-500" />
                <span>Daily rhythm optimization</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-memory-emerald-500" />
                <span>Progress tracking and reporting</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500 mb-4">
              This exclusive pricing is only available to users who complete our assessment
            </p>
          </div>
        </div>
      )
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onUpgrade();
    }
  };

  const previousSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-brain-health-500 to-memory-emerald-500 text-white p-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </Button>
          
          <div className="text-center">
            <Crown className="h-12 w-12 mx-auto mb-4 text-yellow-300" />
            <h2 className="text-2xl font-bold mb-2">{slides[currentSlide].title}</h2>
            <p className="text-white/90">{slides[currentSlide].subtitle}</p>
          </div>

          {/* Progress bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-white/80 mb-2">
              <span>Step {currentSlide + 1} of {slides.length}</span>
              <span>{Math.round(((currentSlide + 1) / slides.length) * 100)}% Complete</span>
            </div>
            <Progress value={((currentSlide + 1) / slides.length) * 100} className="h-2 bg-white/20" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {slides[currentSlide].content}
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 p-6">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={previousSlide}
              disabled={currentSlide === 0}
              className="flex-1 mr-3"
            >
              Previous
            </Button>

            {currentSlide === slides.length - 1 ? (
              <Button
                onClick={onUpgrade}
                size="lg"
                className="flex-1 bg-gradient-to-r from-brain-health-500 to-memory-emerald-500 hover:from-brain-health-600 hover:to-memory-emerald-600 text-white font-bold text-lg py-3"
              >
                <Crown className="h-5 w-5 mr-2" />
                Start My Transformation - £7.99/month
              </Button>
            ) : (
              <Button
                onClick={nextSlide}
                size="lg"
                className="flex-1 bg-gradient-to-r from-brain-health-500 to-memory-emerald-500 text-white"
              >
                Continue
                <TrendingUp className="h-5 w-5 ml-2" />
              </Button>
            )}
          </div>

          {currentSlide === slides.length - 1 && (
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                ⏰ Offer expires in {formatTime(timeLeft)} • No commitment, cancel anytime
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}