import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserType } from "@/types/user";
import { comprehensiveQuestions } from "./data/myrhythmQuestions";
import { RhythmQuestionCard } from "./RhythmQuestionCard";
import { TaskCompletionAssessment } from "./TaskCompletionAssessment";
import { Brain, Lightbulb, TrendingUp, Target, Zap, Star } from "lucide-react";

interface EnhancedComprehensiveAssessmentProps {
  userType: UserType;
  onComplete: (data: any) => void;
}

interface ClusterInfo {
  name: string;
  description: string;
  letters: string[];
  color: string;
  icon: React.ComponentType<any>;
  benefits: string[];
}

const enhancedClusters: ClusterInfo[] = [
  {
    name: "Cognitive Patterns",
    description: "Understanding how your mind processes information and approaches challenges",
    letters: ["M", "Y"],
    color: "from-memory-emerald-500 to-memory-emerald-600",
    icon: Brain,
    benefits: ["Memory optimization", "Processing clarity", "Decision making"]
  },
  {
    name: "Task Completion & Memory",
    description: "Exploring your task management and memory integration abilities",
    letters: ["R", "T"],
    color: "from-brain-health-500 to-brain-health-600",
    icon: Target,
    benefits: ["Task efficiency", "Memory anchoring", "Goal achievement"]
  },
  {
    name: "Energy & Recovery",
    description: "Assessing your energy patterns and restoration needs",
    letters: ["H"],
    color: "from-clarity-teal-500 to-clarity-teal-600",
    icon: Zap,
    benefits: ["Energy optimization", "Recovery timing", "Sustainable performance"]
  },
  {
    name: "Growth & Integration",
    description: "Understanding your approach to learning and personal development",
    letters: ["R"],
    color: "from-sunrise-amber-500 to-sunrise-amber-600",
    icon: TrendingUp,
    benefits: ["Learning acceleration", "Skill integration", "Progress tracking"]
  },
  {
    name: "Personal Motivation",
    description: "Exploring what drives and sustains your progress",
    letters: ["M"],
    color: "from-beacon-500 to-beacon-600",
    icon: Star,
    benefits: ["Motivation clarity", "Value alignment", "Sustained engagement"]
  }
];

export function EnhancedComprehensiveAssessment({ userType, onComplete }: EnhancedComprehensiveAssessmentProps) {
  const [currentCluster, setCurrentCluster] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [showClusterInsight, setShowClusterInsight] = useState(false);
  const [taskCompletionData, setTaskCompletionData] = useState<any>(null);
  const [showTaskCompletion, setShowTaskCompletion] = useState(false);
  const [liveInsights, setLiveInsights] = useState<any>({});

  // Distribute questions evenly across clusters
  const questionsPerCluster = Math.floor(comprehensiveQuestions.length / enhancedClusters.length);
  const startIndex = currentCluster * questionsPerCluster;
  const endIndex = currentCluster === enhancedClusters.length - 1 ? comprehensiveQuestions.length : (currentCluster + 1) * questionsPerCluster;
  const currentClusterQuestions = comprehensiveQuestions.slice(startIndex, endIndex);

  const currentQuestionData = currentClusterQuestions[currentQuestion];
  
  if (!currentQuestionData) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto px-4">
        <Card className="p-6">
          <p className="text-center text-red-600">Error loading questions. Please refresh and try again.</p>
        </Card>
      </div>
    );
  }

  const totalQuestions = comprehensiveQuestions.length;
  const currentQuestionNumber = currentCluster * questionsPerCluster + currentQuestion + 1;
  const progress = (currentQuestionNumber / totalQuestions) * 100;
  const clusterProgress = ((currentQuestion + 1) / currentClusterQuestions.length) * 100;

  const generateLiveInsights = (responses: Record<string, any>, cluster: number, questionNum: number) => {
    const totalAnswered = Object.keys(responses).length;
    const currentClusterData = enhancedClusters[cluster];
    
    return {
      clusterStrengths: getClusterStrengths(responses, cluster),
      emergingProfile: getEmergingProfile(responses, totalAnswered),
      nextBenefit: currentClusterData.benefits[questionNum % currentClusterData.benefits.length],
      confidenceLevel: Math.min(95, 30 + (totalAnswered * 3)),
      profileCompletion: Math.round((totalAnswered / totalQuestions) * 100)
    };
  };

  const getClusterStrengths = (responses: Record<string, any>, cluster: number) => {
    const clusterQuestions = Object.keys(responses).length;
    if (clusterQuestions < 2) return ["Self-awareness"];
    
    const strengthMap = [
      ["Cognitive flexibility", "Strategic thinking"],
      ["Task management", "Memory integration"],
      ["Energy awareness", "Recovery planning"],
      ["Growth mindset", "Adaptability"],
      ["Motivation clarity", "Value alignment"]
    ];
    
    return strengthMap[cluster] || ["Insight development"];
  };

  const getEmergingProfile = (responses: Record<string, any>, totalAnswered: number) => {
    if (totalAnswered < 3) return "Early Explorer";
    if (totalAnswered < 7) return "Pattern Builder";
    if (totalAnswered < 12) return "Insight Developer";
    return "Profile Master";
  };

  const handleResponse = (questionId: string, value: any) => {
    const newResponses = {
      ...responses,
      [questionId]: value
    };
    setResponses(newResponses);
    
    // Generate live insights
    const insights = generateLiveInsights(newResponses, currentCluster, currentQuestion);
    setLiveInsights(insights);
  };

  const handleNext = () => {
    if (currentQuestion < currentClusterQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentCluster === 1 && !taskCompletionData) {
      setShowTaskCompletion(true);
    } else if (currentCluster < enhancedClusters.length - 1) {
      setShowClusterInsight(true);
      setTimeout(() => {
        setCurrentCluster(currentCluster + 1);
        setCurrentQuestion(0);
        setShowClusterInsight(false);
      }, 3000); // Longer time to read insights
    } else {
      const assessmentResult = {
        userType,
        assessmentType: 'comprehensive',
        responses,
        taskCompletionData,
        completedAt: new Date().toISOString(),
        deepProfile: generateDeepProfile(responses, taskCompletionData),
        enhancedInsights: liveInsights
      };
      onComplete(assessmentResult);
    }
  };

  const handleTaskCompletionComplete = (data: any) => {
    setTaskCompletionData(data);
    setShowTaskCompletion(false);
    setShowClusterInsight(true);
    setTimeout(() => {
      setCurrentCluster(currentCluster + 1);
      setCurrentQuestion(0);
      setShowClusterInsight(false);
    }, 3000);
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (currentCluster > 0) {
      setCurrentCluster(currentCluster - 1);
      const prevClusterQuestions = comprehensiveQuestions.slice(
        (currentCluster - 1) * questionsPerCluster,
        currentCluster * questionsPerCluster
      );
      setCurrentQuestion(prevClusterQuestions.length - 1);
    }
  };

  // ... keep existing helper functions but enhance them
  const generateDeepProfile = (responses: Record<string, any>, taskData?: any) => {
    return {
      detailedInsights: Object.entries(responses).map(([questionId, value]) => ({
        questionId,
        value,
        category: comprehensiveQuestions.find(q => q.id === questionId)?.letter || 'Unknown'
      })),
      taskCompletionProfile: taskData,
      enhancedMetrics: {
        cognitiveFlexibility: calculateMetric(responses, 'cognitive'),
        taskEfficiency: calculateMetric(responses, 'task'),
        energyOptimization: calculateMetric(responses, 'energy'),
        growthPotential: calculateMetric(responses, 'growth'),
        motivationAlignment: calculateMetric(responses, 'motivation')
      },
      personalizedRecommendations: generatePersonalizedRecommendations(responses, taskData)
    };
  };

  const calculateMetric = (responses: Record<string, any>, category: string) => {
    return Math.floor(Math.random() * 30) + 70; // 70-100 range for demo
  };

  const generatePersonalizedRecommendations = (responses: Record<string, any>, taskData?: any) => {
    return [
      "Implement morning cognitive priming based on your energy patterns",
      "Use visual task completion tracking aligned with your preferences",
      "Schedule strategic breaks during your identified low-energy periods",
      "Apply personalized memory techniques matching your learning style"
    ];
  };

  // Show task completion assessment
  if (showTaskCompletion) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto px-4">
        <div className="text-center mb-6">
          <Badge className="bg-brain-health-100 text-brain-health-700 mb-2">
            Interactive Task Assessment
          </Badge>
          <h2 className="text-xl font-semibold text-brain-health-800">
            Let's see how you handle real tasks
          </h2>
        </div>
        <TaskCompletionAssessment 
          userType={userType}
          onComplete={handleTaskCompletionComplete}
        />
      </div>
    );
  }

  // Show enhanced cluster insight
  if (showClusterInsight) {
    const cluster = enhancedClusters[currentCluster];
    const ClusterIcon = cluster.icon;
    
    return (
      <div className="space-y-6 max-w-4xl mx-auto px-4 text-center">
        <Card className="p-8 border-2 border-dashed border-brain-health-200">
          <div className="space-y-6">
            <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${cluster.color} flex items-center justify-center mx-auto`}>
              <ClusterIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-brain-health-900 mb-2">
                {cluster.name} Complete! 🎉
              </h2>
              <p className="text-brain-health-600 mb-4">
                You've unlocked insights about: {cluster.benefits.join(", ")}
              </p>
              {liveInsights.clusterStrengths && (
                <div className="bg-brain-health-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-brain-health-700">
                    Key strengths discovered: {liveInsights.clusterStrengths.join(" & ")}
                  </p>
                </div>
              )}
            </div>
            <div className="text-sm text-brain-health-500">
              Moving to the next assessment cluster...
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const currentClusterData = enhancedClusters[currentCluster];
  const ClusterIcon = currentClusterData.icon;

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4">
      {/* Enhanced Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <ClusterIcon className={`h-6 w-6 text-brain-health-600`} />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-brain-health-600 to-clarity-teal-600 bg-clip-text text-transparent">
            Enhanced MYRHYTHM Assessment
          </h1>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-brain-health-800">
            {currentClusterData.name}
          </h2>
          <p className="text-brain-health-600 max-w-2xl mx-auto">
            {currentClusterData.description}
          </p>
        </div>
      </div>

      {/* Live Insights Panel */}
      {liveInsights.emergingProfile && (
        <Card className="bg-gradient-to-r from-brain-health-50/50 to-clarity-teal-50/50 border-brain-health-200">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <TrendingUp className="h-4 w-4 text-brain-health-600" />
                  <span className="text-xs font-medium text-brain-health-700">Profile</span>
                </div>
                <div className="text-sm font-bold text-brain-health-800">
                  {liveInsights.emergingProfile}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star className="h-4 w-4 text-clarity-teal-600" />
                  <span className="text-xs font-medium text-clarity-teal-700">Confidence</span>
                </div>
                <div className="text-sm font-bold text-clarity-teal-800">
                  {liveInsights.confidenceLevel}%
                </div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Target className="h-4 w-4 text-memory-emerald-600" />
                  <span className="text-xs font-medium text-memory-emerald-700">Next Benefit</span>
                </div>
                <div className="text-xs font-semibold text-memory-emerald-800">
                  {liveInsights.nextBenefit}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Lightbulb className="h-4 w-4 text-sunrise-amber-600" />
                  <span className="text-xs font-medium text-sunrise-amber-700">Complete</span>
                </div>
                <div className="text-sm font-bold text-sunrise-amber-800">
                  {liveInsights.profileCompletion}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Progress indicators */}
      <div className="space-y-4 bg-white rounded-xl p-6 border border-brain-health-100 shadow-sm">
        {/* Overall progress */}
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-brain-health-700">Overall Progress</span>
          <span className="text-sm font-bold text-brain-health-700">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-brain-health-100 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-brain-health-500 to-clarity-teal-500 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Cluster progress */}
        <div className="flex justify-between items-center text-sm text-brain-health-500 pt-2 border-t border-brain-health-50">
          <span>
            {currentClusterData.name}: Question {currentQuestion + 1} of {currentClusterQuestions.length}
          </span>
          <span className="font-medium">
            {Math.round(clusterProgress)}% cluster complete
          </span>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-xl border border-brain-health-100 shadow-sm overflow-hidden">
        <RhythmQuestionCard 
          question={currentQuestionData}
          value={responses[currentQuestionData.id] || ''}
          onValueChange={(value) => handleResponse(currentQuestionData.id, value)}
        />
      </div>

      {/* Enhanced Navigation */}
      <div className="flex justify-between items-center pt-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentCluster === 0 && currentQuestion === 0}
          className="px-8 py-2 h-11 border-brain-health-200 hover:bg-brain-health-50"
        >
          Previous
        </Button>
        
        <div className="text-center">
          <div className="text-xs text-brain-health-500 mb-1">
            Unlocking: {currentClusterData.benefits[currentQuestion % currentClusterData.benefits.length]}
          </div>
        </div>
        
        <Button
          onClick={handleNext}
          disabled={!responses[currentQuestionData.id]}
          className="px-8 py-2 h-11 bg-gradient-to-r from-brain-health-600 to-clarity-teal-600 hover:from-brain-health-700 hover:to-clarity-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentCluster === enhancedClusters.length - 1 && currentQuestion === currentClusterQuestions.length - 1 
            ? 'Complete Enhanced Assessment' 
            : 'Continue Discovery'}
        </Button>
      </div>
    </div>
  );
}
