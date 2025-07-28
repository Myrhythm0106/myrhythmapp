import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Brain, Clock, Calendar, Zap, Plus, X } from 'lucide-react';
import { PageLayout } from '@/components/shared/PageLayout';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Activity {
  id: string;
  name: string;
  duration: number;
  cognitiveLoad: 'low' | 'medium' | 'high';
  preferredTime?: 'morning' | 'afternoon' | 'evening';
  priority: 'low' | 'medium' | 'high';
}

interface ScheduleSlot {
  time: string;
  activity: Activity;
  energyMatch: 'optimal' | 'good' | 'fair';
}

interface SmartSchedulingPageProps {
  onCalendarIntegration?: () => void;
}

const SmartSchedulingPage = ({ onCalendarIntegration }: SmartSchedulingPageProps) => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [newActivity, setNewActivity] = useState({
    name: '',
    duration: 30,
    cognitiveLoad: 'medium' as const,
    preferredTime: 'morning' as const,
    priority: 'medium' as const
  });
  const [generatedSchedule, setGeneratedSchedule] = useState<ScheduleSlot[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const addActivity = () => {
    if (!newActivity.name.trim()) {
      toast.error('Please enter an activity name');
      return;
    }

    const activity: Activity = {
      id: Date.now().toString(),
      ...newActivity
    };

    setActivities([...activities, activity]);
    setNewActivity({
      name: '',
      duration: 30,
      cognitiveLoad: 'medium',
      preferredTime: 'morning',
      priority: 'medium'
    });
    toast.success('Activity added!');
  };

  const removeActivity = (id: string) => {
    setActivities(activities.filter(a => a.id !== id));
  };

  const generateSmartSchedule = async () => {
    if (activities.length === 0) {
      toast.error('Please add some activities first');
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI scheduling algorithm
    await new Promise(resolve => setTimeout(resolve, 2000));

    const timeSlots = ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00'];
    const sortedActivities = [...activities].sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    const schedule: ScheduleSlot[] = sortedActivities.slice(0, timeSlots.length).map((activity, index) => ({
      time: timeSlots[index],
      activity,
      energyMatch: activity.cognitiveLoad === 'high' && index < 2 ? 'optimal' : 
                  activity.cognitiveLoad === 'medium' ? 'good' : 'fair'
    }));

    setGeneratedSchedule(schedule);
    setIsGenerating(false);
    toast.success('Smart schedule generated! 🧠✨');
  };

  const applyToCalendar = () => {
    if (onCalendarIntegration) {
      onCalendarIntegration();
    } else {
      toast.success('Schedule applied to your calendar!');
      navigate('/calendar');
    }
  };

  const getCognitiveLoadColor = (load: string) => {
    switch (load) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getEnergyMatchColor = (match: string) => {
    switch (match) {
      case 'optimal': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-orange-100 text-orange-800';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <PageLayout 
      title="Smart Scheduling" 
      description="AI-powered weekly schedule optimization based on your cognitive patterns"
    >
      <div className="space-y-6">
        {/* Premium Badge */}
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-gradient-to-r from-primary to-primary-variant text-primary-foreground">
            <Zap className="h-3 w-3 mr-1" />
            Premium Feature
          </Badge>
        </div>

        {/* Activity Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Your Activities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <Label htmlFor="activity-name">Activity Name</Label>
                <Input
                  id="activity-name"
                  value={newActivity.name}
                  onChange={(e) => setNewActivity({...newActivity, name: e.target.value})}
                  placeholder="e.g., Focus work session"
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={newActivity.duration}
                  onChange={(e) => setNewActivity({...newActivity, duration: parseInt(e.target.value) || 30})}
                />
              </div>
              <div>
                <Label htmlFor="cognitive-load">Cognitive Load</Label>
                <select 
                  id="cognitive-load"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newActivity.cognitiveLoad}
                  onChange={(e) => setNewActivity({...newActivity, cognitiveLoad: e.target.value as any})}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <select 
                  id="priority"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newActivity.priority}
                  onChange={(e) => setNewActivity({...newActivity, priority: e.target.value as any})}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <Button onClick={addActivity} className="w-full md:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Activity
            </Button>
          </CardContent>
        </Card>

        {/* Activities List */}
        {activities.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Your Activities ({activities.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium">{activity.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {activity.duration} min
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getCognitiveLoadColor(activity.cognitiveLoad)}>
                          {activity.cognitiveLoad}
                        </Badge>
                        <Badge variant="outline">
                          {activity.priority} priority
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeActivity(activity.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Generate Schedule */}
        <Card>
          <CardContent className="pt-6">
            <Button 
              onClick={generateSmartSchedule}
              disabled={activities.length === 0 || isGenerating}
              className="w-full"
              size="lg"
            >
              <Brain className="h-5 w-5 mr-2" />
              {isGenerating ? 'Generating Smart Schedule...' : 'Generate Smart Schedule'}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Schedule */}
        {generatedSchedule.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Your Optimized Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {generatedSchedule.map((slot, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="font-mono text-lg font-semibold text-primary">
                      {slot.time}
                    </div>
                    <div>
                      <p className="font-medium">{slot.activity.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {slot.activity.duration} minutes
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getCognitiveLoadColor(slot.activity.cognitiveLoad)}>
                      {slot.activity.cognitiveLoad}
                    </Badge>
                    <Badge className={getEnergyMatchColor(slot.energyMatch)}>
                      {slot.energyMatch} energy match
                    </Badge>
                  </div>
                </div>
              ))}
              
              <Separator />
              
              <div className="flex gap-4">
                <Button onClick={applyToCalendar} className="flex-1">
                  <Calendar className="h-4 w-4 mr-2" />
                  {onCalendarIntegration ? "Connect & Apply to Calendar" : "Apply to Calendar"}
                </Button>
                <Button variant="outline" onClick={() => setGeneratedSchedule([])}>
                  Generate New Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  );
};

export default SmartSchedulingPage;