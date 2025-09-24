import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Brain, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  CheckCircle,
  User,
  Mail,
  Shield
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { CalendarIntegrationWizard } from '@/components/calendar/CalendarIntegrationWizard';
import { smartScheduler } from '@/utils/smartScheduler';
import { toast } from 'sonner';

interface AssessmentResults {
  answers: Record<string, string>;
  recommendations: string[];
  assessmentType: string;
  isPaid: boolean;
  completedAt: string;
}

interface AssessmentToCalendarFlowProps {
  assessmentResults: AssessmentResults;
  onComplete: () => void;
}

type FlowStep = 'save-results' | 'register' | 'calendar-preview' | 'calendar-integration' | 'complete';

export function AssessmentToCalendarFlow({ assessmentResults, onComplete }: AssessmentToCalendarFlowProps) {
  const [currentStep, setCurrentStep] = useState<FlowStep>('save-results');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scheduleSuggestions, setScheduleSuggestions] = useState<any[]>([]);
  const { signUpFreemium, user } = useAuth();
  const navigate = useNavigate();

  const stepProgress = {
    'save-results': 25,
    'register': 50,
    'calendar-preview': 75,
    'calendar-integration': 90,
    'complete': 100
  };

  useEffect(() => {
    if (user && currentStep === 'register') {
      // User is already logged in, skip registration
      handleGenerateSchedule();
    }
  }, [user, currentStep]);

  const handleSaveResults = () => {
    // Skip authentication barrier - generate schedule directly for all users
    handleGenerateSchedule();
  };

  const handleRegister = async () => {
    if (!email || !name) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signUpFreemium(email, name);
      
      if (!error) {
        // Save assessment results with user context for later use
        const enrichedResults = {
          ...assessmentResults,
          userEmail: email,
          userName: name,
          registeredAt: new Date().toISOString()
        };
        localStorage.setItem('pendingAssessmentResults', JSON.stringify(enrichedResults));
        
        // Generate schedule preview
        await handleGenerateSchedule();
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateSchedule = async () => {
    setIsLoading(true);
    try {
      // Convert assessment answers to user preferences and generate schedule
      const suggestions = await generateScheduleFromAssessment(assessmentResults);
      setScheduleSuggestions(suggestions);
      setCurrentStep('calendar-preview');
    } catch (error) {
      console.error('Error generating schedule:', error);
      toast.error('Error generating your schedule. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateScheduleFromAssessment = async (results: AssessmentResults) => {
    // Map assessment answers to scheduling preferences
    const preferences = mapAssessmentToPreferences(results);
    
    // Generate week of sample events based on recommendations
    const sampleEvents = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      
      results.recommendations.forEach((feature, index) => {
        const eventTime = getOptimalTimeForFeature(feature, preferences, i);
        if (eventTime) {
          sampleEvents.push({
            id: `${i}-${index}`,
            title: getFeatureActionTitle(feature),
            date: date.toISOString().split('T')[0],
            time: eventTime,
            feature,
            description: getFeatureDescription(feature, results.answers),
            duration: getFeatureDuration(feature),
            confidence: calculateConfidence(feature, preferences, i)
          });
        }
      });
    }
    
    return sampleEvents.sort((a, b) => b.confidence - a.confidence).slice(0, 10);
  };

  const mapAssessmentToPreferences = (results: AssessmentResults) => {
    const answers = results.answers;
    
    return {
      productiveHours: answers['energy-level'] === 'high' ? 
        ['09:00', '10:00', '11:00', '14:00', '15:00'] : 
        answers['energy-level'] === 'moderate' ?
        ['10:00', '11:00', '14:00', '16:00'] :
        ['11:00', '14:00', '15:00'],
      
      energyPeaks: answers['energy-level'] === 'high' ? 
        ['morning', 'afternoon'] : 
        answers['energy-level'] === 'moderate' ?
        ['morning'] : ['afternoon'],
        
      preferredDuration: answers['support-preference'] === 'independent' ? 30 : 
                        answers['support-preference'] === 'guided' ? 20 : 25,
                        
      dailyStructure: answers['daily-structure'] || 'moderate',
      
      doNotDisturbTimes: ['12:00-13:00', '17:00-18:00'] // Standard meal times
    };
  };

  const getOptimalTimeForFeature = (feature: string, preferences: any, dayIndex: number) => {
    const timeMap = {
      'Memory Bridge': preferences.productiveHours[0] || '09:00',
      'Brain Games': preferences.productiveHours[1] || '10:00', 
      'Gratitude': '08:00', // Morning gratitude
      'Calendar': preferences.productiveHours[2] || '14:00',
      'Daily Actions': '07:30', // Early morning planning
      'Support Network': '16:00' // Afternoon connection
    };
    
    return timeMap[feature as keyof typeof timeMap] || '10:00';
  };

  const getFeatureActionTitle = (feature: string) => {
    const titleMap = {
      'Memory Bridge': 'Memory Reflection Session',
      'Brain Games': 'Cognitive Training',
      'Gratitude': 'Daily Gratitude Practice',
      'Calendar': 'Day Planning & Review',
      'Daily Actions': 'Morning Intention Setting',
      'Support Network': 'Connection Check-in'
    };
    
    return titleMap[feature as keyof typeof titleMap] || `${feature} Session`;
  };

  const getFeatureDescription = (feature: string, answers: Record<string, string>) => {
    const challenge = answers['primary-challenge'];
    
    const descriptionMap = {
      'Memory Bridge': `Structured memory strengthening session${challenge === 'memory' ? ' focused on recall techniques' : ''}`,
      'Brain Games': `Cognitive training exercises${challenge === 'focus' ? ' for attention improvement' : ''}`,
      'Gratitude': 'Daily gratitude practice to build positive neural pathways',
      'Calendar': 'Planning session to build consistent routines',
      'Daily Actions': 'Morning intention setting for focused day ahead',
      'Support Network': 'Connect with your support circle for encouragement'
    };
    
    return descriptionMap[feature as keyof typeof descriptionMap] || `Personalized ${feature} session`;
  };

  const getFeatureDuration = (feature: string) => {
    const durationMap = {
      'Memory Bridge': 25,
      'Brain Games': 20,
      'Gratitude': 10,
      'Calendar': 15,
      'Daily Actions': 15,
      'Support Network': 30
    };
    
    return durationMap[feature as keyof typeof durationMap] || 20;
  };

  const calculateConfidence = (feature: string, preferences: any, dayIndex: number) => {
    // Higher confidence for features that match user preferences
    let baseScore = 0.7;
    
    if (preferences.energyPeaks.includes('morning') && ['Gratitude', 'Daily Actions'].includes(feature)) {
      baseScore += 0.2;
    }
    
    if (preferences.dailyStructure === 'very' && feature === 'Calendar') {
      baseScore += 0.1;
    }
    
    return Math.min(baseScore, 0.95);
  };

  const handleCalendarIntegration = () => {
    setCurrentStep('calendar-integration');
  };

  const handleIntegrationComplete = () => {
    setCurrentStep('complete');
    toast.success('Your personalized schedule is ready! Welcome to MyRhythm.');
  };

  const handleGetStarted = () => {
    onComplete();
    navigate('/calendar');
  };

  if (currentStep === 'save-results') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-memory-emerald-50/30 via-brain-health-50/25 to-clarity-teal-50/30 p-6 flex items-center justify-center">
        <Card className="w-full max-w-2xl border-memory-emerald-200 bg-gradient-to-br from-memory-emerald-50/50 to-white">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Calendar className="h-16 w-16 text-brain-health-600" />
            </div>
            <CardTitle className="text-3xl text-brain-health-800 mb-2">
              Your Transformation Awaits
            </CardTitle>
            <p className="text-brain-health-600 text-lg">
              Save your results and get your personalized schedule in seconds
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-r from-memory-emerald-100 to-brain-health-100 p-4 rounded-lg border border-memory-emerald-200">
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="h-5 w-5 text-memory-emerald-600" />
                <h3 className="font-semibold text-memory-emerald-800">Your Recommended Features</h3>
              </div>
              <div className="flex gap-2 flex-wrap">
                {assessmentResults.recommendations.map((feature, index) => (
                  <Badge key={feature} variant="secondary" className="bg-memory-emerald-200 text-memory-emerald-700">
                    #{index + 1} {feature}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Get your personalized weekly schedule
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Sync with Google, Outlook, or Apple Calendar
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Start your cognitive wellness journey today
              </div>
            </div>

            <div className="text-center">
              <Button
                onClick={handleSaveResults}
                size="lg"
                className="bg-gradient-to-r from-brain-health-500 to-memory-emerald-500 text-white px-8 py-3"
              >
                Save My Results & Get My Schedule
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === 'register') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-memory-emerald-50/30 via-brain-health-50/25 to-clarity-teal-50/30 p-6 flex items-center justify-center">
        <Card className="w-full max-w-md border-memory-emerald-200 bg-gradient-to-br from-memory-emerald-50/50 to-white">
          <CardHeader className="text-center">
            <Progress value={stepProgress[currentStep]} className="mb-4" />
            <div className="flex justify-center mb-4">
              <User className="h-12 w-12 text-brain-health-600" />
            </div>
            <CardTitle className="text-2xl text-brain-health-800">
              Quick Registration
            </CardTitle>
            <p className="text-brain-health-600">
              Just your email and name to get started
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-brain-health-700">
                <Mail className="h-4 w-4 inline mr-2" />
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="border-memory-emerald-200"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-brain-health-700">
                <User className="h-4 w-4 inline mr-2" />
                Name
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="border-memory-emerald-200"
              />
            </div>

            <div className="bg-memory-emerald-50 p-3 rounded-lg border border-memory-emerald-200">
              <div className="flex items-center gap-2 text-sm text-memory-emerald-700">
                <Shield className="h-4 w-4" />
                Your assessment results will be saved securely
              </div>
            </div>

            <Button
              onClick={handleRegister}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-brain-health-500 to-memory-emerald-500"
            >
              {isLoading ? 'Creating Your Account...' : 'Create My Account & Continue'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === 'calendar-preview') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-memory-emerald-50/30 via-brain-health-50/25 to-clarity-teal-50/30 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="border-sunrise-amber-200 bg-gradient-to-br from-sunrise-amber-50/50 to-white">
            <CardHeader className="text-center">
              <Progress value={stepProgress[currentStep]} className="mb-4" />
              <div className="flex justify-center mb-4">
                <Brain className="h-16 w-16 text-brain-health-600" />
              </div>
              <CardTitle className="text-3xl text-brain-health-800">
                Your Personalized Schedule is Ready!
              </CardTitle>
              <p className="text-brain-health-600 text-lg">
                Based on your assessment, here's your cognitive wellness schedule
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                {scheduleSuggestions.slice(0, 6).map((event) => (
                  <Card key={event.id} className="border-memory-emerald-200 bg-gradient-to-r from-memory-emerald-50/30 to-white">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <Clock className="h-4 w-4 text-memory-emerald-600" />
                            <span className="font-medium text-brain-health-800">
                              {event.title}
                            </span>
                            <Badge variant="outline" className="bg-memory-emerald-100 text-memory-emerald-700 border-memory-emerald-300">
                              {event.duration}min
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground ml-7">
                            {event.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-brain-health-700">
                            {event.time}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {Math.round(event.confidence * 100)}% match
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="bg-gradient-to-r from-memory-emerald-100 to-brain-health-100 p-4 rounded-lg border border-memory-emerald-200">
                <p className="text-sm font-medium text-memory-emerald-800 mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Smart Schedule Optimization
                </p>
                <p className="text-sm text-memory-emerald-700">
                  This schedule adapts to your energy levels, preferences, and goals. 
                  You can easily modify times and sync with your existing calendar.
                </p>
              </div>

              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => navigate('/calendar')}
                  className="border-brain-health-200 hover:bg-brain-health-50"
                >
                  Skip Integration
                </Button>
                <Button
                  onClick={handleCalendarIntegration}
                  className="bg-gradient-to-r from-sunrise-amber-500 to-memory-emerald-500"
                >
                  Connect My Calendar
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (currentStep === 'calendar-integration') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-memory-emerald-50/30 via-brain-health-50/25 to-clarity-teal-50/30 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Progress value={stepProgress[currentStep]} className="mb-4" />
          </div>
          <CalendarIntegrationWizard 
            onComplete={handleIntegrationComplete}
          />
        </div>
      </div>
    );
  }

  if (currentStep === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-memory-emerald-50/30 via-brain-health-50/25 to-clarity-teal-50/30 p-6 flex items-center justify-center">
        <Card className="w-full max-w-2xl border-memory-emerald-200 bg-gradient-to-br from-memory-emerald-50/50 to-white">
          <CardHeader className="text-center">
            <Progress value={100} className="mb-4" />
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <CardTitle className="text-3xl text-brain-health-800 mb-2">
              Welcome to Your MyRhythm Journey!
            </CardTitle>
            <p className="text-brain-health-600 text-lg">
              Your personalized schedule is ready and synced
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-memory-emerald-50 rounded-lg">
                <Calendar className="h-8 w-8 text-memory-emerald-600 mx-auto mb-2" />
                <h3 className="font-semibold text-memory-emerald-800">Synchronized</h3>
                <p className="text-sm text-memory-emerald-600">
                  Events added to your calendar
                </p>
              </div>
              <div className="text-center p-4 bg-brain-health-50 rounded-lg">
                <Brain className="h-8 w-8 text-brain-health-600 mx-auto mb-2" />
                <h3 className="font-semibold text-brain-health-800">Personalized</h3>
                <p className="text-sm text-brain-health-600">
                  Based on your assessment
                </p>
              </div>
              <div className="text-center p-4 bg-clarity-teal-50 rounded-lg">
                <Sparkles className="h-8 w-8 text-clarity-teal-600 mx-auto mb-2" />
                <h3 className="font-semibold text-clarity-teal-800">Adaptive</h3>
                <p className="text-sm text-clarity-teal-600">
                  Adjusts to your progress
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-memory-emerald-100 to-brain-health-100 p-4 rounded-lg border border-memory-emerald-200">
              <p className="text-sm font-medium text-memory-emerald-800 mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Your Journey Starts Now
              </p>
              <p className="text-sm text-memory-emerald-700">
                Check your calendar for your first session, and remember - every small step 
                creates positive changes in your brain. You've got this!
              </p>
            </div>

            <div className="text-center">
              <Button
                onClick={handleGetStarted}
                size="lg"
                className="bg-gradient-to-r from-brain-health-500 to-memory-emerald-500 text-white px-8 py-3"
              >
                Start My First Session
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}