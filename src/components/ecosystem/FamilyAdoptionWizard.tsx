import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { 
  Users, 
  Calendar, 
  MessageCircle, 
  Target,
  CheckCircle,
  ArrowRight,
  Heart,
  Home
} from 'lucide-react';

interface FamilyAdoptionWizardProps {
  onComplete?: () => void;
}

export function FamilyAdoptionWizard({ onComplete }: FamilyAdoptionWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form data
  const [annualPriorities, setAnnualPriorities] = useState({
    priority_1: '',
    priority_2: '',
    priority_3: ''
  });
  const [spouseData, setSpouseData] = useState({
    name: '',
    email: '',
    relationship: 'spouse'
  });

  const handlePrioritiesSave = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('annual_priorities')
        .upsert({
          user_id: user.id,
          ...annualPriorities
        });

      if (error) throw error;
      
      toast.success('Annual priorities saved!');
      setCurrentStep(2);
    } catch (error) {
      console.error('Error saving priorities:', error);
      toast.error('Failed to save priorities');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpouseInvite = async () => {
    if (!user || !spouseData.email || !spouseData.name) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('support_circle_members')
        .insert({
          user_id: user.id,
          member_name: spouseData.name,
          member_email: spouseData.email,
          relationship: spouseData.relationship,
          role: 'family',
          status: 'pending',
          can_receive_alerts: true,
          can_send_reminders: true,
          permissions: {
            calendar: true,
            memory: true,
            actions: true,
            goals: true
          },
          invitation_token: Math.random().toString(36).substring(2, 15),
          invitation_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        });

      if (error) throw error;
      
      toast.success(`Invitation sent to ${spouseData.name}!`);
      setCurrentStep(3);
    } catch (error) {
      console.error('Error inviting spouse:', error);
      toast.error('Failed to send invitation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = () => {
    toast.success('Family adoption setup complete! 🎉');
    if (onComplete) {
      onComplete();
    } else {
      navigate('/ecosystem');
    }
  };

  const steps = [
    {
      title: 'Set Your Annual Compass',
      description: 'Define your 3 main priorities for this year',
      icon: Target
    },
    {
      title: 'Invite Your Support Partner',
      description: 'Add your spouse/partner to your support circle',
      icon: Heart
    },
    {
      title: 'Ready to Begin!',
      description: 'Your family ecosystem is set up and ready',
      icon: Home
    }
  ];

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-primary">Family Adoption Setup</h1>
        <p className="text-muted-foreground">
          Let's set up your family accountability and wellness ecosystem in 3 simple steps
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-center space-x-4 mb-8">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isActive = currentStep === index + 1;
          const isCompleted = currentStep > index + 1;
          
          return (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all
                ${isCompleted ? 'bg-memory-emerald-500 border-memory-emerald-500 text-white' : 
                  isActive ? 'bg-primary border-primary text-white' : 
                  'bg-background border-muted-foreground/30 text-muted-foreground'}
              `}>
                {isCompleted ? <CheckCircle className="h-6 w-6" /> : <StepIcon className="h-6 w-6" />}
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">{step.title}</p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Annual Compass
            </CardTitle>
            <CardDescription>
              What are your 3 main priorities for this year? These will guide your daily actions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="priority1">Priority 1 (Most Important)</Label>
              <Input
                id="priority1"
                placeholder="e.g., Improve family health and fitness"
                value={annualPriorities.priority_1}
                onChange={(e) => setAnnualPriorities(prev => ({ ...prev, priority_1: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="priority2">Priority 2</Label>
              <Input
                id="priority2"
                placeholder="e.g., Strengthen relationships and communication"
                value={annualPriorities.priority_2}
                onChange={(e) => setAnnualPriorities(prev => ({ ...prev, priority_2: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="priority3">Priority 3</Label>
              <Input
                id="priority3"
                placeholder="e.g., Achieve financial stability and security"
                value={annualPriorities.priority_3}
                onChange={(e) => setAnnualPriorities(prev => ({ ...prev, priority_3: e.target.value }))}
              />
            </div>
            <Button 
              onClick={handlePrioritiesSave}
              disabled={!annualPriorities.priority_1 || isLoading}
              className="w-full"
            >
              {isLoading ? 'Saving...' : 'Save Priorities & Continue'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Support Partner
            </CardTitle>
            <CardDescription>
              Invite your spouse or partner to be your accountability buddy and receive updates.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="spouseName">Partner's Name</Label>
              <Input
                id="spouseName"
                placeholder="e.g., John Smith"
                value={spouseData.name}
                onChange={(e) => setSpouseData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="spouseEmail">Partner's Email</Label>
              <Input
                id="spouseEmail"
                type="email"
                placeholder="e.g., john@example.com"
                value={spouseData.email}
                onChange={(e) => setSpouseData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            
            <div className="bg-brain-health-50 p-4 rounded-lg">
              <h4 className="font-medium text-brain-health-700 mb-2">Your partner will be able to:</h4>
              <ul className="text-sm text-brain-health-600 space-y-1">
                <li>• View your calendar and planned activities</li>
                <li>• See your extracted actions from conversations</li>
                <li>• Send you supportive messages and reminders</li>
                <li>• Celebrate your wins and progress</li>
              </ul>
            </div>

            <Button 
              onClick={handleSpouseInvite}
              disabled={!spouseData.name || !spouseData.email || isLoading}
              className="w-full"
            >
              {isLoading ? 'Sending Invitation...' : 'Send Invitation & Continue'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5 text-primary" />
              Ready to Begin!
            </CardTitle>
            <CardDescription>
              Your family ecosystem is set up! Here's what to do next.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="flex items-start space-x-3 p-4 bg-memory-emerald-50 rounded-lg">
                <MessageCircle className="h-5 w-5 text-memory-emerald-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-memory-emerald-800">Start Recording Conversations</h4>
                  <p className="text-sm text-memory-emerald-600">
                    Record family discussions to extract actionable items automatically
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-4 bg-sunrise-amber-50 rounded-lg">
                <Calendar className="h-5 w-5 text-sunrise-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sunrise-amber-800">Plan Your Week</h4>
                  <p className="text-sm text-sunrise-amber-600">
                    Use the calendar to schedule actions and share with your support circle
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-4 bg-brain-health-50 rounded-lg">
                <Users className="h-5 w-5 text-brain-health-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-brain-health-800">Daily Check-ins</h4>
                  <p className="text-sm text-brain-health-600">
                    Spend 15 minutes each morning and evening reviewing progress together
                  </p>
                </div>
              </div>
            </div>

            <Button onClick={handleComplete} className="w-full" size="lg">
              Start Using Your Family Ecosystem
              <CheckCircle className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}