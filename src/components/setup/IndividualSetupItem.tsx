import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CheckCircle, Settings, Users, Calendar, Brain } from 'lucide-react';
import { useSetupProgress } from '@/contexts/SetupProgressContext';
import { toast } from 'sonner';

const setupConfig = {
  dashboard: {
    title: 'Dashboard Setup',
    icon: Settings,
    content: DashboardSetupContent
  },
  'support-circle': {
    title: 'Support Circle',
    icon: Users, 
    content: SupportCircleContent
  },
  calendar: {
    title: 'Calendar Integration',
    icon: Calendar,
    content: CalendarSetupContent
  },
  community: {
    title: 'Community Access',
    icon: Brain,
    content: CommunitySetupContent
  }
};

function DashboardSetupContent({ onComplete }: { onComplete: () => void }) {
  const [selectedLayout, setSelectedLayout] = useState('');

  const layouts = [
    {
      id: 'memory-first',
      name: 'Memory-First Layout',
      description: 'Prioritizes memory tools and cognitive tracking',
      features: ['Memory Bridge prominent', 'Cognitive metrics', 'Brain games access']
    },
    {
      id: 'empowerment',
      name: 'Empowerment Layout',
      description: 'Focuses on goals, progress, and achievements',
      features: ['Goal tracking', 'Progress charts', 'Achievement badges']
    }
  ];

  const handleSave = () => {
    if (!selectedLayout) {
      toast.error('Please select a layout');
      return;
    }
    
    localStorage.setItem('dashboard_layout', selectedLayout);
    toast.success('Dashboard layout saved!');
    onComplete();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Choose Your Dashboard Layout</h3>
        <p className="text-muted-foreground">
          This determines how your main dashboard is organized and what features are highlighted.
        </p>
      </div>

      <div className="grid gap-4">
        {layouts.map((layout) => (
          <Card 
            key={layout.id}
            className={`cursor-pointer border-2 transition-colors ${
              selectedLayout === layout.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
            }`}
            onClick={() => setSelectedLayout(layout.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={`w-4 h-4 rounded-full border-2 mt-1 ${
                  selectedLayout === layout.id ? 'border-primary bg-primary' : 'border-muted-foreground'
                }`} />
                <div className="flex-1">
                  <h4 className="font-medium">{layout.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{layout.description}</p>
                  <ul className="text-xs space-y-1">
                    {layout.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button onClick={handleSave} className="w-full">
        Save Dashboard Layout
      </Button>
    </div>
  );
}

function SupportCircleContent({ onComplete }: { onComplete: () => void }) {
  const [emails, setEmails] = useState(['', '', '']);

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const handleSave = () => {
    const validEmails = emails.filter(email => email.trim());
    localStorage.setItem('support_circle_emails', JSON.stringify(validEmails));
    toast.success(`${validEmails.length} support circle members added!`);
    onComplete();
  };

  const handleSkip = () => {
    toast.info('You can add support circle members later from settings');
    onComplete();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Add Your Support Circle</h3>
        <p className="text-muted-foreground">
          Invite up to 3 family members or friends to support your journey. They'll receive updates about your progress and can help with encouragement.
        </p>
      </div>

      <div className="space-y-4">
        {emails.map((email, index) => (
          <div key={index}>
            <label className="text-sm font-medium">
              Support Member {index + 1} {index === 0 && '(Primary)'}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(index, e.target.value)}
              placeholder="Enter email address"
              className="w-full mt-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        ))}
      </div>

      <div className="bg-muted/50 p-4 rounded-lg">
        <h4 className="font-medium text-sm mb-2">What they'll be able to do:</h4>
        <ul className="text-xs space-y-1 text-muted-foreground">
          <li>• View your progress summaries (not detailed data)</li>
          <li>• Send encouragement messages</li>
          <li>• See your calendar availability for support</li>
          <li>• Receive notifications about important milestones</li>
        </ul>
      </div>

      <div className="flex gap-3">
        <Button onClick={handleSkip} variant="outline" className="flex-1">
          Set Up Later
        </Button>
        <Button onClick={handleSave} className="flex-1">
          Save Support Circle
        </Button>
      </div>
    </div>
  );
}

function CalendarSetupContent({ onComplete }: { onComplete: () => void }) {
  const [selectedCalendars, setSelectedCalendars] = useState<string[]>([]);

  const calendars = [
    { id: 'google', name: 'Google Calendar', description: 'Sync with your Google account' },
    { id: 'apple', name: 'Apple Calendar', description: 'iCloud calendar integration' },
    { id: 'outlook', name: 'Microsoft Outlook', description: 'Office 365 and Outlook.com' }
  ];

  const toggleCalendar = (calendarId: string) => {
    setSelectedCalendars(prev => 
      prev.includes(calendarId) 
        ? prev.filter(id => id !== calendarId)
        : [...prev, calendarId]
    );
  };

  const handleSave = () => {
    localStorage.setItem('connected_calendars', JSON.stringify(selectedCalendars));
    toast.success(`${selectedCalendars.length} calendar(s) connected!`);
    onComplete();
  };

  const handleSkip = () => {
    toast.info('You can connect calendars later from settings');
    onComplete();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Connect Your Calendars</h3>
        <p className="text-muted-foreground">
          Sync your calendars to enable smart scheduling, conflict detection, and automatic reminders.
        </p>
      </div>

      <div className="space-y-3">
        {calendars.map((calendar) => (
          <Card 
            key={calendar.id}
            className={`cursor-pointer border-2 transition-colors ${
              selectedCalendars.includes(calendar.id) 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => toggleCalendar(calendar.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  selectedCalendars.includes(calendar.id) 
                    ? 'border-primary bg-primary' 
                    : 'border-muted-foreground'
                }`}>
                  {selectedCalendars.includes(calendar.id) && (
                    <CheckCircle className="h-3 w-3 text-white" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium">{calendar.name}</h4>
                  <p className="text-sm text-muted-foreground">{calendar.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-muted/50 p-4 rounded-lg">
        <h4 className="font-medium text-sm mb-2">Calendar integration enables:</h4>
        <ul className="text-xs space-y-1 text-muted-foreground">
          <li>• Automatic conflict detection for MyRhythm activities</li>
          <li>• Smart scheduling suggestions</li>
          <li>• Reminder notifications</li>
          <li>• Availability sharing with support circle</li>
        </ul>
      </div>

      <div className="flex gap-3">
        <Button onClick={handleSkip} variant="outline" className="flex-1">
          Connect Later
        </Button>
        <Button onClick={handleSave} className="flex-1">
          Connect Selected
        </Button>
      </div>
    </div>
  );
}

function CommunitySetupContent({ onComplete }: { onComplete: () => void }) {
  const [preferences, setPreferences] = useState({
    publicProfile: false,
    shareProgress: false,
    joinGroups: false,
    notifications: true
  });

  const handlePreferenceChange = (key: string, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    localStorage.setItem('community_preferences', JSON.stringify(preferences));
    toast.success('Community preferences saved!');
    onComplete();
  };

  const handleSkip = () => {
    toast.info('You can join the community later from settings');
    onComplete();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Join the MyRhythm Community</h3>
        <p className="text-muted-foreground">
          Connect with others who understand your journey. Set your preferences for how you'd like to participate.
        </p>
      </div>

      <div className="space-y-4">
        {[
          {
            key: 'publicProfile',
            title: 'Create Public Profile',
            description: 'Let others see your basic profile and connect with you'
          },
          {
            key: 'shareProgress',
            title: 'Share Progress Highlights',
            description: 'Share major milestones and achievements with the community'
          },
          {
            key: 'joinGroups',
            title: 'Join Discussion Groups',
            description: 'Participate in groups based on your interests and goals'
          },
          {
            key: 'notifications',
            title: 'Community Notifications',
            description: 'Get notified about relevant community activities and updates'
          }
        ].map((pref) => (
          <div key={pref.key} className="flex items-start gap-3 p-3 border rounded-lg">
            <button
              onClick={() => handlePreferenceChange(pref.key, !preferences[pref.key as keyof typeof preferences])}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${
                preferences[pref.key as keyof typeof preferences]
                  ? 'border-primary bg-primary'
                  : 'border-muted-foreground'
              }`}
            >
              {preferences[pref.key as keyof typeof preferences] && (
                <CheckCircle className="h-3 w-3 text-white" />
              )}
            </button>
            <div>
              <h4 className="font-medium text-sm">{pref.title}</h4>
              <p className="text-xs text-muted-foreground">{pref.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-muted/50 p-4 rounded-lg">
        <h4 className="font-medium text-sm mb-2">Community benefits:</h4>
        <ul className="text-xs space-y-1 text-muted-foreground">
          <li>• Peer support from people who understand your challenges</li>
          <li>• Expert-led discussions and tips</li>
          <li>• Accountability partners for motivation</li>
          <li>• Success stories and inspiration</li>
        </ul>
      </div>

      <div className="flex gap-3">
        <Button onClick={handleSkip} variant="outline" className="flex-1">
          Maybe Later
        </Button>
        <Button onClick={handleSave} className="flex-1">
          Join Community
        </Button>
      </div>
    </div>
  );
}

export function IndividualSetupItem() {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  const { setCompleted } = useSetupProgress();

  const config = setupConfig[itemId as keyof typeof setupConfig];
  
  if (!config) {
    navigate('/setup-hub');
    return null;
  }

  const Icon = config.icon;
  const ContentComponent = config.content;

  const handleComplete = () => {
    if (itemId) {
      setCompleted(itemId);
    }
    navigate('/setup-hub');
  };

  const handleBack = () => {
    navigate('/setup-hub');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Setup
          </Button>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">{config.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <ContentComponent onComplete={handleComplete} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}