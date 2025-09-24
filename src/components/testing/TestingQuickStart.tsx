import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  Mic, 
  Brain, 
  CheckCircle, 
  ArrowRight,
  User,
  Clock,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

export function TestingQuickStart() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleStartTesting = () => {
    if (!user) {
      navigate('/auth');
      toast.info('Please sign in first to test recordings');
      return;
    }
    navigate('/memory-bridge');
    toast.success('Opening Memory Bridge testing interface');
  };

  const handleCreateTestAccount = () => {
    navigate('/auth');
  };

  const testingSteps = [
    {
      step: 1,
      title: 'Sign Up (Free)',
      description: 'Create your test account - no payment required',
      icon: User,
      completed: !!user
    },
    {
      step: 2,
      title: 'Record Conversation',
      description: 'Capture a meeting or make commitments aloud',
      icon: Mic,
      completed: false
    },
    {
      step: 3,
      title: 'AI Processing',
      description: 'Watch AI extract actionable commitments',
      icon: Brain,
      completed: false
    },
    {
      step: 4,
      title: 'Review Results',
      description: 'Confirm and schedule your extracted actions',
      icon: CheckCircle,
      completed: false
    }
  ];

  return (
    <div className="space-y-6">
      {/* Hero Testing Card */}
      <Card className="border-2 border-primary bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Play className="h-6 w-6 text-primary" />
                Test MyRhythm Memory Bridge
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                Experience the complete AI-powered commitment tracking system
              </p>
            </div>
            <Badge className="bg-green-100 text-green-800">
              100% Free Testing
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button 
              onClick={handleStartTesting} 
              size="lg"
              className="flex items-center gap-2"
            >
              <Zap className="h-5 w-5" />
              {user ? 'Start Recording Test' : 'Sign In & Test'}
              <ArrowRight className="h-4 w-4" />
            </Button>
            
            {!user && (
              <Button 
                variant="outline" 
                onClick={handleCreateTestAccount}
                size="lg"
              >
                Create Test Account
              </Button>
            )}
          </div>
          
          {user && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-green-800 text-sm">
                  Signed in as <strong>{user.email}</strong> - Ready to test!
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Testing Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Testing Process</CardTitle>
          <p className="text-muted-foreground">
            Follow these steps to test the complete Memory Bridge experience
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {testingSteps.map((step) => (
              <div 
                key={step.step}
                className={`flex items-center gap-4 p-4 rounded-lg border ${
                  step.completed 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step.completed 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-300 text-gray-700'
                }`}>
                  {step.completed ? <CheckCircle className="h-4 w-4" /> : step.step}
                </div>
                
                <step.icon className={`h-5 w-5 ${
                  step.completed ? 'text-green-600' : 'text-gray-500'
                }`} />
                
                <div className="flex-1">
                  <h4 className="font-medium">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* What You'll Test */}
      <Card>
        <CardHeader>
          <CardTitle>What You'll Experience</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <Mic className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-medium mb-1">Voice Recording</h3>
              <p className="text-sm text-muted-foreground">
                Record meetings, calls, or personal commitments
              </p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <Brain className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-medium mb-1">AI Extraction</h3>
              <p className="text-sm text-muted-foreground">
                Watch AI identify and extract actionable items
              </p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-medium mb-1">Action Management</h3>
              <p className="text-sm text-muted-foreground">
                Review, edit, and schedule your commitments
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}