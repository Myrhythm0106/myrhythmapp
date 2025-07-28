import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserType } from "@/types/user";
import { comprehensiveQuestions, preferenceQuestions } from "./data/myrhythmQuestions";
import { RhythmQuestionCard } from "./RhythmQuestionCard";

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

const clusters: ClusterInfo[] = [
  {
    name: "Cognitive Patterns",
    description: "Understanding your mental approach and stress responses",
    letters: ["M", "Y"],
    color: "from-purple-500 to-blue-500"
  },
  {
    name: "Energy & Support",
    description: "Optimizing your energy rhythms and support systems",
    letters: ["R", "H"],
    color: "from-green-500 to-teal-500"
  },
  {
    name: "Action & Control",
    description: "Building agency and recognizing progress",
    letters: ["Y", "T"],
    color: "from-blue-500 to-indigo-500"
  },
  {
    name: "Growth & Integration",
    description: "Healing forward and creating lasting change",
    letters: ["H", "M"],
    color: "from-indigo-500 to-purple-500"
  }
];

export function ComprehensiveAssessment({ userType, onComplete }: ComprehensiveAssessmentProps) {
  const [currentCluster, setCurrentCluster] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [showClusterInsight, setShowClusterInsight] = useState(false);

  // For this demo, we'll use a subset of questions per cluster
  const questionsPerCluster = Math.ceil(comprehensiveQuestions.length / clusters.length);
  const currentClusterQuestions = comprehensiveQuestions.slice(
    currentCluster * questionsPerCluster,
    (currentCluster + 1) * questionsPerCluster
  );

  const currentQuestionData = currentClusterQuestions[currentQuestion];
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
    return response || '';
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
    if (currentQuestion < currentClusterQuestions.length - 1) {
      // Next question in current cluster
      setCurrentQuestion(currentQuestion + 1);
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
      const assessmentResult = {
        userType,
        assessmentType: 'comprehensive',
        responses,
        completedAt: new Date().toISOString(),
        deepProfile: generateDeepProfile(responses)
      };
      onComplete(assessmentResult);
    }
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

  const generateDeepProfile = (responses: Record<string, any>) => {
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
      cognitivePatterns: extractClusterInsights(responses, 'cognitive'),
      energySupport: extractClusterInsights(responses, 'energy'),
      actionControl: extractClusterInsights(responses, 'action'),
      growthIntegration: extractClusterInsights(responses, 'growth'),
      comprehensiveRecommendations: generateComprehensiveRecommendations(responses),
      secondaryInsights: detailedInsights.filter(insight => insight.hasMultipleAnswers)
    };
  };

  const extractClusterInsights = (responses: Record<string, any>, clusterType: string) => {
    // Generate insights based on cluster responses
    return {
      strengths: [],
      growthAreas: [],
      strategies: []
    };
  };

  const generateComprehensiveRecommendations = (responses: Record<string, any>) => {
    return [
      "Personalized cognitive training program",
      "Optimized daily rhythm schedule",
      "Targeted support system design",
      "Progress tracking and celebration system"
    ];
  };

  const getCurrentCluster = () => clusters[currentCluster];

  if (showClusterInsight) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${getCurrentCluster().color} mx-auto mb-4 flex items-center justify-center`}>
              <span className="text-white font-bold text-lg">✓</span>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {getCurrentCluster().name} Complete!
            </h3>
            <p className="text-muted-foreground mb-4">
              Analyzing your {getCurrentCluster().description.toLowerCase()} patterns...
            </p>
            <div className="animate-pulse">
              <div className="text-sm text-muted-foreground">
                Preparing insights for the next section...
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentQuestionData) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-muted-foreground">Loading questions...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <Badge className="bg-accent/10 text-accent mb-4">
          Comprehensive Assessment
        </Badge>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Deep MYRHYTHM Analysis
        </h2>
        <p className="text-muted-foreground">
          Comprehensive insights for your personalized cognitive wellness plan
        </p>
      </div>

      {/* Cluster Progress */}
      <Card className={`bg-gradient-to-r ${getCurrentCluster().color}/10`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getCurrentCluster().color} flex items-center justify-center`}>
                <span className="text-white font-bold">
                  {getCurrentCluster().letters.join('')}
                </span>
              </div>
              <div>
                <div className="font-semibold text-foreground">
                  {getCurrentCluster().name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {getCurrentCluster().description}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">
                Question {currentQuestionNumber} of {totalQuestions}
              </div>
              <div className="text-xs text-muted-foreground">
                Cluster {currentCluster + 1} of {clusters.length}
              </div>
            </div>
          </div>
          
          {/* Overall Progress */}
          <div className="w-full bg-muted rounded-full h-2 mb-2">
            <div 
              className={`bg-gradient-to-r ${getCurrentCluster().color} h-2 rounded-full transition-all duration-500`}
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Cluster Progress */}
          <div className="flex justify-between text-xs text-muted-foreground">
            {clusters.map((cluster, index) => (
              <span 
                key={cluster.name}
                className={`${index < currentCluster ? 'text-primary font-semibold' : index === currentCluster ? 'text-accent font-semibold' : ''}`}
              >
                {cluster.letters.join('')}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card>
        <CardContent className="p-6">
          <RhythmQuestionCard
            question={currentQuestionData}
            value={responses[currentQuestionData.id]}
            onValueChange={(value) => handleResponse(currentQuestionData.id, value)}
          />

          {/* Question insight */}
          {responses[currentQuestionData.id] && (
            <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-accent text-sm">🔍</span>
                </div>
                <div>
                  <div className="font-medium text-foreground mb-1">Deep Insight</div>
                  <div className="text-sm text-muted-foreground">
                    {currentQuestionData.insight}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              onClick={handlePrevious}
              disabled={currentCluster === 0 && currentQuestion === 0}
              variant="outline"
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!responses[currentQuestionData.id]}
              className={`bg-gradient-to-r ${getCurrentCluster().color} hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white`}
            >
              {currentCluster === clusters.length - 1 && currentQuestion === currentClusterQuestions.length - 1 ? (
                <>Complete Deep Assessment</>
              ) : currentQuestion === currentClusterQuestions.length - 1 ? (
                <>Next Cluster: {clusters[currentCluster + 1]?.name}</>
              ) : (
                <>Next Question</>
              )}
            </Button>
          </div>

          {/* Fatigue management */}
          {currentQuestionNumber > 10 && currentQuestionNumber % 5 === 0 && (
            <div className="mt-6 p-4 bg-primary/5 rounded-lg text-center">
              <div className="text-sm text-muted-foreground mb-2">
                💪 You're doing great! {totalQuestions - currentQuestionNumber} questions remaining.
              </div>
              <div className="text-xs text-muted-foreground">
                Your insights are building a powerful personalized plan.
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}