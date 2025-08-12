import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserType } from "@/types/user";
import { comprehensiveQuestions, preferenceQuestions } from "./data/myrhythmQuestions";
import { RhythmQuestionCard } from "./RhythmQuestionCard";
import { TaskCompletionAssessment } from "./TaskCompletionAssessment";

interface ComprehensiveAssessmentProps {
  userType: UserType;
  onComplete: (data: any) => void;
}

interface ClusterInfo {
  name: string;
  description: string;
  letters: string[];
  color: string;
}

// MYRHYTHM clusters for organizing assessment flow
const clusters: ClusterInfo[] = [
  {
    name: "Cognitive Patterns",
    description: "Understanding how your mind processes information and approaches challenges",
    letters: ["M", "Y"],
    color: "from-purple-500 to-purple-600"
  },
  {
    name: "Task Completion & Memory",
    description: "Exploring your task management and memory integration abilities",
    letters: ["R", "T"],
    color: "from-blue-500 to-blue-600"
  },
  {
    name: "Energy & Recovery",
    description: "Assessing your energy patterns and restoration needs",
    letters: ["H"],
    color: "from-green-500 to-green-600"
  },
  {
    name: "Growth & Integration",
    description: "Understanding your approach to learning and personal development",
    letters: ["R"],
    color: "from-orange-500 to-orange-600"
  },
  {
    name: "Personal Motivation",
    description: "Exploring what drives and sustains your progress",
    letters: ["M"],
    color: "from-red-500 to-red-600"
  }
];

export function ComprehensiveAssessment({ userType, onComplete }: ComprehensiveAssessmentProps) {
  const [currentCluster, setCurrentCluster] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [showClusterInsight, setShowClusterInsight] = useState(false);
  const [taskCompletionData, setTaskCompletionData] = useState<any>(null);
  const [showTaskCompletion, setShowTaskCompletion] = useState(false);

  // Distribute questions evenly across clusters
  const questionsPerCluster = Math.floor(comprehensiveQuestions.length / clusters.length);
  const startIndex = currentCluster * questionsPerCluster;
  const endIndex = currentCluster === clusters.length - 1 ? comprehensiveQuestions.length : (currentCluster + 1) * questionsPerCluster;
  const currentClusterQuestions = comprehensiveQuestions.slice(startIndex, endIndex);

  const currentQuestionData = currentClusterQuestions[currentQuestion];
  
  // Safety check for undefined questions
  if (!currentQuestionData) {
    console.error('No question data found for cluster', currentCluster, 'question', currentQuestion);
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

  const extractPrimaryValue = (response: any): string => {
    if (typeof response === 'string') {
      try {
        const parsed = JSON.parse(response);
        return parsed.primary || response;
      } catch {
        return response;
      }
    }
    return response?.toString() || '';
  };

  const extractSecondaryValues = (response: any): string[] => {
    if (typeof response === 'string') {
      try {
        const parsed = JSON.parse(response);
        return parsed.secondary || [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const handleResponse = (questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    console.log("ComprehensiveAssessment: handleNext called", {
      currentCluster,
      currentQuestion,
      totalClusters: clusters.length,
      totalQuestionsInCluster: currentClusterQuestions.length,
      hasResponse: !!responses[currentQuestionData.id],
      questionId: currentQuestionData.id
    });
    
    if (currentQuestion < currentClusterQuestions.length - 1) {
      // Next question in current cluster
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentCluster === 1 && !taskCompletionData) {
      // Show task completion assessment after cluster 1
      setShowTaskCompletion(true);
    } else if (currentCluster < clusters.length - 1) {
      // Next cluster
      setShowClusterInsight(true);
      setTimeout(() => {
        setCurrentCluster(currentCluster + 1);
        setCurrentQuestion(0);
        setShowClusterInsight(false);
      }, 2000);
    } else {
      // Complete assessment
      console.log("ComprehensiveAssessment: Completing assessment with responses:", responses);
      const assessmentResult = {
        userType,
        assessmentType: 'comprehensive',
        responses,
        taskCompletionData,
        completedAt: new Date().toISOString(),
        deepProfile: generateDeepProfile(responses, taskCompletionData)
      };
      console.log("ComprehensiveAssessment: Calling onComplete with result:", assessmentResult);
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
    }, 2000);
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

  const generateDeepProfile = (responses: Record<string, any>, taskData?: any) => {
    const detailedInsights = Object.entries(responses).map(([questionId, value]) => {
      const question = comprehensiveQuestions.find(q => q.id === questionId);
      const primaryValue = extractPrimaryValue(value);
      const secondaryValues = extractSecondaryValues(value);
      
      return {
        questionId,
        primaryValue,
        secondaryValues,
        category: question?.letter || 'Unknown',
        hasMultipleAnswers: secondaryValues.length > 0
      };
    });

    return {
      detailedInsights,
      taskCompletionProfile: taskData ? extractTaskCompletionProfile(taskData) : null,
      cognitivePatterns: extractClusterInsights(responses, 'cognitive'),
      energySupport: extractClusterInsights(responses, 'energy'),
      actionControl: extractClusterInsights(responses, 'action'),
      growthIntegration: extractClusterInsights(responses, 'growth'),
      personalizedData: generatePersonalizedInsights(detailedInsights, taskData),
      recommendations: generateComprehensiveRecommendations(detailedInsights)
    };
  };

  const extractTaskCompletionProfile = (taskData: any) => {
    return {
      completionRate: taskData.completionRate || 0,
      patterns: taskData.patterns || [],
      strengths: taskData.strengths || [],
      challenges: taskData.challenges || []
    };
  };

  const extractClusterInsights = (responses: Record<string, any>, category: string) => {
    return {
      category,
      insights: Object.values(responses).slice(0, 3) // Simplified for demo
    };
  };

  const generatePersonalizedInsights = (insights: any[], taskData?: any) => {
    return {
      strengths: [
        { type: 'strength', text: 'Strong analytical thinking patterns', icon: '🧠' },
        { type: 'strength', text: 'Consistent energy management', icon: '⚡' }
      ],
      challenges: [
        { type: 'challenge', text: 'Task initiation barriers', icon: '🚧' },
        { type: 'challenge', text: 'Working memory optimization', icon: '🔄' }
      ],
      opportunities: [
        { type: 'opportunity', text: 'Enhanced focus techniques', icon: '🎯' },
        { type: 'opportunity', text: 'Personalized productivity systems', icon: '📊' }
      ]
    };
  };

  const generateComprehensiveRecommendations = (insights: any[]) => {
    return [
      'Implement morning cognitive priming routines',
      'Use visual task completion tracking',
      'Schedule regular energy restoration breaks',
      'Apply personalized memory enhancement techniques'
    ];
  };

  // Show task completion assessment
  if (showTaskCompletion) {
    return (
      <TaskCompletionAssessment 
        userType={userType}
        onComplete={handleTaskCompletionComplete}
      />
    );
  }

  // Show cluster insight message
  if (showClusterInsight) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto px-4 text-center">
        <Card className="p-8">
          <div className="space-y-6">
            <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${clusters[currentCluster].color} flex items-center justify-center mx-auto`}>
              <span className="text-white text-xl font-bold">
                {clusters[currentCluster].letters.join('')}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {clusters[currentCluster].name} Complete!
              </h2>
              <p className="text-gray-600">
                Moving to the next assessment cluster...
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4">
      <div className="space-y-8 max-w-3xl mx-auto">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-3">
            <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${clusters[currentCluster].color}`}></div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-beacon-600 to-beacon-800 bg-clip-text text-transparent">
              MYRHYTHM Assessment
            </h1>
          </div>
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-800">
              {clusters[currentCluster].name}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {clusters[currentCluster].description}
            </p>
          </div>
        </div>

        {/* Progress indicators */}
        <div className="space-y-4 bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          {/* Overall progress */}
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-sm font-bold text-beacon-700">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-beacon-500 to-beacon-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Cluster progress */}
          <div className="flex justify-between items-center text-sm text-gray-500 pt-2 border-t border-gray-50">
            <span>
              Cluster {currentCluster + 1} of {clusters.length}: Question {currentQuestion + 1} of {currentClusterQuestions.length}
            </span>
            <span className="font-medium">
              {Math.round(((currentQuestion + 1) / currentClusterQuestions.length) * 100)}% cluster complete
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <RhythmQuestionCard 
            question={currentQuestionData}
            value={responses[currentQuestionData.id] || ''}
            onValueChange={(value) => handleResponse(currentQuestionData.id, value)}
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentCluster === 0 && currentQuestion === 0}
            className="px-8 py-2 h-11 border-gray-200 hover:bg-gray-50"
          >
            Previous
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!responses[currentQuestionData.id]}
            className="px-8 py-2 h-11 bg-gradient-to-r from-beacon-600 to-beacon-700 hover:from-beacon-700 hover:to-beacon-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentCluster === clusters.length - 1 && currentQuestion === currentClusterQuestions.length - 1 
              ? 'Complete Assessment' 
              : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
}