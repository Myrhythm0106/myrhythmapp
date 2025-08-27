import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Clock, 
  Heart, 
  Target, 
  Users, 
  Battery,
  Zap,
  CheckCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface AssessmentQuestion {
  id: string;
  question: string;
  options: {
    value: string;
    label: string;
    feature: string;
    benefit: string;
  }[];
  category: 'cognitive' | 'emotional' | 'functional' | 'social';
}

const BRIEF_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'primary-challenge',
    question: "What's your primary cognitive wellness goal?",
    category: 'cognitive',
    options: [
      {
        value: 'memory',
        label: 'Strengthen memory and recall',
        feature: 'Memory Bridge + Brain Games',
        benefit: 'Enhanced memory encoding and retrieval'
      },
      {
        value: 'focus',
        label: 'Improve focus and attention',
        feature: 'Brain Games + Calendar',
        benefit: 'Better sustained attention and task management'
      },
      {
        value: 'routine',
        label: 'Build consistent daily routines',
        feature: 'Calendar + Daily Actions',
        benefit: 'Structured cognitive support and habit formation'
      },
      {
        value: 'wellbeing',
        label: 'Support emotional wellness',
        feature: 'Gratitude + Support Network',
        benefit: 'Positive neural pathways and social connection'
      }
    ]
  },
  {
    id: 'energy-level',
    question: 'How would you describe your typical energy levels?',
    category: 'functional',
    options: [
      {
        value: 'high',
        label: 'High energy, ready for challenges',
        feature: 'Brain Games + Memory Bridge',
        benefit: 'Maximize cognitive training opportunities'
      },
      {
        value: 'moderate',
        label: 'Moderate, varies throughout day',
        feature: 'Calendar + Gratitude',
        benefit: 'Balanced approach with flexible scheduling'
      },
      {
        value: 'low',
        label: 'Lower energy, need gentle approaches',
        feature: 'Gratitude + Support Network',
        benefit: 'Low-energy, high-impact wellness practices'
      }
    ]
  },
  {
    id: 'support-preference',
    question: 'How do you prefer to receive support?',
    category: 'social',
    options: [
      {
        value: 'independent',
        label: 'Mostly independent with occasional check-ins',
        feature: 'Daily Actions + Brain Games',
        benefit: 'Self-directed progress with automated tracking'
      },
      {
        value: 'collaborative',
        label: 'Regular collaboration with others',
        feature: 'Support Network + Memory Bridge',
        benefit: 'Social cognitive engagement and shared accountability'
      },
      {
        value: 'guided',
        label: 'Structured guidance and reminders',
        feature: 'Calendar + Support Network',
        benefit: 'External structure with caring oversight'
      }
    ]
  }
];

const COMPREHENSIVE_QUESTIONS: AssessmentQuestion[] = [
  ...BRIEF_QUESTIONS,
  {
    id: 'memory-challenges',
    question: 'Which memory challenges affect you most?',
    category: 'cognitive',
    options: [
      {
        value: 'short-term',
        label: 'Short-term memory (remembering recent events)',
        feature: 'Memory Bridge',
        benefit: 'Captures and structures recent information'
      },
      {
        value: 'working',
        label: 'Working memory (holding info while thinking)',
        feature: 'Brain Games',
        benefit: 'Strengthens working memory capacity'
      },
      {
        value: 'prospective',
        label: 'Prospective memory (remembering to do things)',
        feature: 'Calendar + Daily Actions',
        benefit: 'External reminders and structured planning'
      }
    ]
  },
  {
    id: 'emotional-state',
    question: 'How often do you experience positive emotions?',
    category: 'emotional',
    options: [
      {
        value: 'often',
        label: 'Often - I maintain positive outlook',
        feature: 'Brain Games + Memory Bridge',
        benefit: 'Cognitive challenges to maintain engagement'
      },
      {
        value: 'sometimes',
        label: 'Sometimes - ups and downs',
        feature: 'Gratitude + Support Network',
        benefit: 'Consistent positivity practices and connection'
      },
      {
        value: 'rarely',
        label: 'Rarely - struggling with mood',
        feature: 'Gratitude + Daily Actions',
        benefit: 'Gentle mood elevation through small wins'
      }
    ]
  },
  {
    id: 'daily-structure',
    question: 'How structured is your daily routine?',
    category: 'functional',
    options: [
      {
        value: 'very',
        label: 'Very structured - I follow consistent routines',
        feature: 'Brain Games + Memory Bridge',
        benefit: 'Advanced cognitive training within structure'
      },
      {
        value: 'somewhat',
        label: 'Somewhat - some routine but flexible',
        feature: 'Calendar + Gratitude',
        benefit: 'Gentle structure with wellness practices'
      },
      {
        value: 'minimal',
        label: 'Minimal - need help building structure',
        feature: 'Calendar + Daily Actions',
        benefit: 'Gradual routine building with support'
      }
    ]
  }
];

export function MVPAssessment() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const assessmentType = searchParams.get('type') || 'brief';
  const autostart = searchParams.get('autostart') === 'true';
  const isPaid = searchParams.get('paid') === 'true';
  
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const [isComplete, setIsComplete] = React.useState(false);
  const [recommendations, setRecommendations] = React.useState<string[]>([]);
  const [showIntro, setShowIntro] = React.useState(!autostart);

  const questions = assessmentType === 'comprehensive' ? COMPREHENSIVE_QUESTIONS : BRIEF_QUESTIONS;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (questionId: string, answer: string) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      generateRecommendations(newAnswers);
      setIsComplete(true);
    }
  };

  const generateRecommendations = (finalAnswers: Record<string, string>) => {
    const featureCount: Record<string, number> = {};
    
    questions.forEach(question => {
      const answer = finalAnswers[question.id];
      const option = question.options.find(opt => opt.value === answer);
      if (option) {
        const features = option.feature.split(' + ');
        features.forEach(feature => {
          featureCount[feature] = (featureCount[feature] || 0) + 1;
        });
      }
    });

    const sortedFeatures = Object.entries(featureCount)
      .sort(([,a], [,b]) => b - a)
      .map(([feature]) => feature)
      .slice(0, 3);

    setRecommendations(sortedFeatures);
    
    // Save results for later viewing
    const results = {
      answers: finalAnswers,
      recommendations: sortedFeatures,
      assessmentType,
      isPaid,
      completedAt: new Date().toISOString()
    };
    localStorage.setItem('lastAssessmentResults', JSON.stringify(results));
  };

  const getFeatureRoute = (feature: string): string => {
    const routes: Record<string, string> = {
      'Memory Bridge': '/memory-bridge',
      'Brain Games': '/brain-games',
      'Gratitude': '/gratitude',
      'Calendar': '/calendar',
      'Daily Actions': '/dashboard',
      'Support Network': '/support'
    };
    return routes[feature] || '/dashboard';
  };

  const getFeatureColor = (feature: string): string => {
    const colors: Record<string, string> = {
      'Memory Bridge': 'memory-emerald',
      'Brain Games': 'brain-health',
      'Gratitude': 'clarity-teal',
      'Calendar': 'sunrise-amber',
      'Daily Actions': 'memory-emerald',
      'Support Network': 'brain-health'
    };
    return colors[feature] || 'memory-emerald';
  };

  // Intro screen for non-autostart assessments
  if (showIntro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-memory-emerald-50/30 via-brain-health-50/25 to-clarity-teal-50/30 p-6 flex items-center justify-center">
        <Card className="w-full max-w-2xl border-memory-emerald-200 bg-gradient-to-br from-memory-emerald-50/50 to-white">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Brain className="h-16 w-16 text-brain-health-600" />
            </div>
            <CardTitle className="text-3xl text-brain-health-800 mb-2">
              {assessmentType === 'comprehensive' ? 'Comprehensive' : 'Brief'} Assessment
            </CardTitle>
            <p className="text-brain-health-600 text-lg">
              {assessmentType === 'comprehensive' 
                ? 'A detailed 15-20 minute assessment for comprehensive insights'
                : 'A quick 5-10 minute assessment for immediate guidance'
              }
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center p-4 bg-memory-emerald-50 rounded-lg">
                <Clock className="h-8 w-8 text-memory-emerald-600 mx-auto mb-2" />
                <h3 className="font-semibold text-memory-emerald-800">Duration</h3>
                <p className="text-sm text-memory-emerald-600">
                  {assessmentType === 'comprehensive' ? '15-20 minutes' : '5-10 minutes'}
                </p>
              </div>
              <div className="text-center p-4 bg-brain-health-50 rounded-lg">
                <Target className="h-8 w-8 text-brain-health-600 mx-auto mb-2" />
                <h3 className="font-semibold text-brain-health-800">Questions</h3>
                <p className="text-sm text-brain-health-600">
                  {questions.length} personalized questions
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <Button
                onClick={() => setShowIntro(false)}
                className="bg-gradient-to-r from-brain-health-500 to-memory-emerald-500 text-white px-8 py-3 text-lg"
              >
                Start Assessment
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-memory-emerald-50/30 via-brain-health-50/25 to-clarity-teal-50/30 p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="border-sunrise-amber-200 bg-gradient-to-br from-sunrise-amber-50/50 to-memory-emerald-50/50">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-sunrise-amber-600" />
              </div>
              <CardTitle className="text-2xl text-sunrise-amber-800">
                Your Personalized MyRhythm Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  Based on your assessment, these features will provide the most cognitive benefit:
                </p>
              </div>

              <div className="space-y-4">
                {recommendations.map((feature, index) => {
                  const getFeatureStyles = (feature: string) => {
                    const styleMap = {
                      'Memory Bridge': {
                        card: 'border-memory-emerald-200 bg-gradient-to-r from-memory-emerald-50/50 to-white',
                        badge: 'bg-memory-emerald-100 text-memory-emerald-700',
                        title: 'text-memory-emerald-800',
                        button: 'bg-gradient-to-r from-memory-emerald-500 to-memory-emerald-600'
                      },
                      'Brain Games': {
                        card: 'border-brain-health-200 bg-gradient-to-r from-brain-health-50/50 to-white',
                        badge: 'bg-brain-health-100 text-brain-health-700',
                        title: 'text-brain-health-800',
                        button: 'bg-gradient-to-r from-brain-health-500 to-brain-health-600'
                      },
                      'Gratitude': {
                        card: 'border-clarity-teal-200 bg-gradient-to-r from-clarity-teal-50/50 to-white',
                        badge: 'bg-clarity-teal-100 text-clarity-teal-700',
                        title: 'text-clarity-teal-800',
                        button: 'bg-gradient-to-r from-clarity-teal-500 to-clarity-teal-600'
                      },
                      'Calendar': {
                        card: 'border-sunrise-amber-200 bg-gradient-to-r from-sunrise-amber-50/50 to-white',
                        badge: 'bg-sunrise-amber-100 text-sunrise-amber-700',
                        title: 'text-sunrise-amber-800',
                        button: 'bg-gradient-to-r from-sunrise-amber-500 to-sunrise-amber-600'
                      },
                      'Daily Actions': {
                        card: 'border-memory-emerald-200 bg-gradient-to-r from-memory-emerald-50/50 to-white',
                        badge: 'bg-memory-emerald-100 text-memory-emerald-700',
                        title: 'text-memory-emerald-800',
                        button: 'bg-gradient-to-r from-memory-emerald-500 to-memory-emerald-600'
                      },
                      'Support Network': {
                        card: 'border-brain-health-200 bg-gradient-to-r from-brain-health-50/50 to-white',
                        badge: 'bg-brain-health-100 text-brain-health-700',
                        title: 'text-brain-health-800',
                        button: 'bg-gradient-to-r from-brain-health-500 to-brain-health-600'
                      }
                    };
                    return styleMap[feature as keyof typeof styleMap] || styleMap['Memory Bridge'];
                  };

                  const styles = getFeatureStyles(feature);

                  return (
                    <Card 
                      key={feature}
                      className={styles.card}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge className={styles.badge}>
                              #{index + 1} Priority
                            </Badge>
                            <h3 className={`font-semibold ${styles.title}`}>
                              {feature}
                            </h3>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => navigate(getFeatureRoute(feature))}
                            className={styles.button}
                          >
                            Start Now
                            <ArrowRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="text-center space-y-4">
                <div className={`p-4 rounded-lg bg-gradient-to-r from-memory-emerald-100 to-brain-health-100 border border-memory-emerald-200`}>
                  <p className="text-sm font-medium text-memory-emerald-800 mb-2 flex items-center justify-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Empowerment Insight
                  </p>
                  <p className="text-sm text-memory-emerald-700">
                    You have the power to strengthen your cognitive abilities. Each small action 
                    creates positive changes in your brain, building resilience and confidence.
                  </p>
                </div>

                <div className="flex gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/mvp-dashboard')}
                    className="border-brain-health-200 hover:bg-brain-health-50"
                  >
                    View All Features
                  </Button>
                  <Button
                    onClick={() => navigate(`/mvp-assessment-results?type=${assessmentType}&paid=${isPaid}`)}
                    className="bg-gradient-to-r from-sunrise-amber-500 to-memory-emerald-500"
                  >
                    View Full Results
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-memory-emerald-50/30 via-brain-health-50/25 to-clarity-teal-50/30 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="outline" className="border-brain-health-300 text-brain-health-700">
              {assessmentType === 'comprehensive' ? 'Comprehensive' : 'Quick'} Assessment
            </Badge>
            <span className="text-sm text-muted-foreground">
              {currentQuestion + 1} of {questions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2 bg-memory-emerald-100" />
        </div>

        {/* Question Card */}
        <Card className="border-memory-emerald-200 bg-gradient-to-br from-memory-emerald-50/50 to-white">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              {currentQ.category === 'cognitive' && <Brain className="h-5 w-5 text-brain-health-600" />}
              {currentQ.category === 'emotional' && <Heart className="h-5 w-5 text-clarity-teal-600" />}
              {currentQ.category === 'functional' && <Battery className="h-5 w-5 text-sunrise-amber-600" />}
              {currentQ.category === 'social' && <Users className="h-5 w-5 text-memory-emerald-600" />}
              <span className="text-sm font-medium text-muted-foreground capitalize">
                {currentQ.category} Wellness
              </span>
            </div>
            <CardTitle className="text-xl text-memory-emerald-800">
              {currentQ.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentQ.options.map((option) => (
              <Card
                key={option.value}
                className="cursor-pointer transition-all duration-200 hover:scale-102 hover:shadow-md border-memory-emerald-100 hover:border-memory-emerald-300"
                onClick={() => handleAnswer(currentQ.id, option.value)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-memory-emerald-800 mb-1">
                        {option.label}
                      </h4>
                      <div className="space-y-1">
                        <p className="text-xs text-brain-health-600 font-medium">
                          🎯 Recommended: {option.feature}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {option.benefit}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-memory-emerald-400 group-hover:text-memory-emerald-600" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="mt-6 flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="border-memory-emerald-200"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/mvp-dashboard')}
            className="border-brain-health-200 hover:bg-brain-health-50"
          >
            Skip Assessment
          </Button>
        </div>
      </div>
    </div>
  );
}