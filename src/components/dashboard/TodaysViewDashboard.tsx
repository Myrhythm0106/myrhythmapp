import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useDailyActions } from '@/contexts/DailyActionsContext';
import { supabase } from '@/integrations/supabase/client';
import { format, isToday } from 'date-fns';
import { PriorityJourneyMap } from '@/components/priorities/PriorityJourneyMap';
import { UniversalProgressBar } from '@/components/progress/UniversalProgressBar';
import { 
  Brain, 
  Calendar, 
  Heart, 
  Users, 
  Sparkles, 
  TrendingUp, 
  Clock,
  MessageCircle,
  CheckCircle2,
  Target,
  Activity,
  Sun,
  Moon,
  Coffee
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MoodEntry {
  mood: string;
  energy_level: number;
  emotions?: string[];
  emotional_note?: string;
  gratitude_note?: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  category?: string;
}

interface SupportMessage {
  id: string;
  member_name: string;
  message_text: string;
  created_at: string;
}

export function TodaysViewDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { actions, loading: actionsLoading } = useDailyActions();
  
  const [moodEntry, setMoodEntry] = useState<MoodEntry | null>(null);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const displayName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'there';
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: "Good Morning", icon: Coffee, color: "from-sunrise-amber-400 to-memory-emerald-400" };
    if (hour < 17) return { text: "Good Afternoon", icon: Sun, color: "from-clarity-teal-400 to-brain-health-500" };
    return { text: "Good Evening", icon: Moon, color: "from-brain-health-500 to-sunrise-amber-600" };
  };

  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  // Fetch today's data from all pillars
  useEffect(() => {
    const fetchTodaysData = async () => {
      if (!user) return;
      
      setLoading(true);
      const today = format(new Date(), 'yyyy-MM-dd');

      try {
        // Fetch mood/wellness data
        const { data: moodData } = await supabase
          .from('mood_entries')
          .select('*')
          .eq('user_id', user.id)
          .eq('date', today)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (moodData) setMoodEntry(moodData);

        // Fetch calendar events
        const { data: eventsData } = await supabase
          .from('calendar_events')
          .select('*')
          .eq('user_id', user.id)
          .eq('date', today)
          .order('time', { ascending: true });

        if (eventsData) setCalendarEvents(eventsData);

        // Fetch support circle messages (unread)
        const { data: messagesData } = await supabase
          .from('support_circle_messages')
          .select(`
            id,
            message_text,
            created_at,
            sender_member_id,
            support_circle_members!inner(member_name)
          `)
          .eq('recipient_user_id', user.id)
          .eq('is_read', false)
          .order('created_at', { ascending: false })
          .limit(3);

        if (messagesData) {
          const formattedMessages = messagesData.map((msg: any) => ({
            id: msg.id,
            member_name: msg.support_circle_members?.member_name || 'Support Member',
            message_text: msg.message_text,
            created_at: msg.created_at
          }));
          setSupportMessages(formattedMessages);
        }
      } catch (error) {
        console.error('Error fetching today\'s data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodaysData();
  }, [user]);

  // Filter today's actions
  const todaysActions = actions.filter(action => {
    if (!action.date) return false;
    const actionDate = new Date(action.date);
    return isToday(actionDate);
  });

  const completedActions = todaysActions.filter(a => a.status === 'completed');
  const pendingActions = todaysActions.filter(a => a.status === 'pending');

  const getEnergyMessage = (level: number) => {
    if (level >= 4) return "You're feeling energized! 🚀";
    if (level >= 3) return "Good energy today 💪";
    if (level >= 2) return "Taking it steady 🌱";
    return "Being gentle with yourself 🌸";
  };

  if (loading && actionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-memory-emerald-50 via-white to-clarity-teal-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={cn(
          "relative overflow-hidden bg-gradient-to-r",
          greeting.color,
          "py-12 px-4"
        )}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white drop-shadow-lg flex items-center gap-3">
                <GreetingIcon className="h-10 w-10" />
                {greeting.text}, {displayName}
              </h1>
              <p className="text-white/90 text-lg mt-2">
                {format(new Date(), "EEEE, MMMM do, yyyy")}
              </p>
            </div>
            <Brain className="h-20 w-20 text-white/20" />
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        
        {/* Today's Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Wellness */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-clarity-teal-50 to-white border-clarity-teal-200 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate('/calendar')}>
              <CardContent className="p-6 text-center">
                <Heart className="h-8 w-8 mx-auto mb-2 text-clarity-teal-600" />
                <h3 className="font-semibold text-brain-health-900">Wellness</h3>
                {moodEntry ? (
                  <>
                    <p className="text-2xl font-bold text-clarity-teal-700 mt-2">
                      {moodEntry.energy_level}/5
                    </p>
                    <p className="text-xs text-brain-health-600 mt-1">
                      {getEnergyMessage(moodEntry.energy_level)}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-brain-health-600 mt-2">Check in now</p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Calendar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-brain-health-50 to-white border-brain-health-200 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate('/calendar')}>
              <CardContent className="p-6 text-center">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-brain-health-600" />
                <h3 className="font-semibold text-brain-health-900">Schedule</h3>
                <p className="text-2xl font-bold text-brain-health-700 mt-2">
                  {calendarEvents.length}
                </p>
                <p className="text-xs text-brain-health-600 mt-1">
                  {calendarEvents.length === 0 ? 'No events' : 'events today'}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-memory-emerald-50 to-white border-memory-emerald-200 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate('/memory-bridge')}>
              <CardContent className="p-6 text-center">
                <Target className="h-8 w-8 mx-auto mb-2 text-memory-emerald-600" />
                <h3 className="font-semibold text-brain-health-900">Actions</h3>
                <p className="text-2xl font-bold text-memory-emerald-700 mt-2">
                  {completedActions.length}/{todaysActions.length}
                </p>
                <p className="text-xs text-brain-health-600 mt-1">
                  {completedActions.length === todaysActions.length && todaysActions.length > 0 
                    ? '🎉 All done!' 
                    : 'completed'}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-sunrise-amber-50 to-white border-sunrise-amber-200 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate('/support-circle')}>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-sunrise-amber-600" />
                <h3 className="font-semibold text-brain-health-900">Support</h3>
                <p className="text-2xl font-bold text-sunrise-amber-700 mt-2">
                  {supportMessages.length}
                </p>
                <p className="text-xs text-brain-health-600 mt-1">
                  {supportMessages.length === 0 ? 'All caught up' : 'new messages'}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* AI Assistant Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 border-0 text-white">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Sparkles className="h-8 w-8 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">Your Personal Assistant Summary</h3>
                  <p className="text-white/90 text-sm leading-relaxed">
                    {moodEntry 
                      ? `Your energy is at ${moodEntry.energy_level}/5 today. `
                      : 'Start your day with a quick wellness check-in. '}
                    {calendarEvents.length > 0 
                      ? `You have ${calendarEvents.length} event${calendarEvents.length > 1 ? 's' : ''} scheduled. `
                      : ''}
                    {pendingActions.length > 0 
                      ? `${pendingActions.length} action${pendingActions.length > 1 ? 's' : ''} need${pendingActions.length === 1 ? 's' : ''} your attention. `
                      : 'Great job staying on top of your actions! '}
                    {supportMessages.length > 0 
                      ? `Your support circle has sent ${supportMessages.length} message${supportMessages.length > 1 ? 's' : ''}.`
                      : ''}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Progress & Priority Section - Brain-Injury-First */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Universal Progress Bar - Always visible to remind of wins */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
          >
            <UniversalProgressBar showMessage={true} />
          </motion.div>

          {/* Priority Journey Map - Shows Day → Week → Month → Year cascade */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <PriorityJourneyMap collapsible={true} showProgress={true} />
          </motion.div>
        </div>

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-brain-health-500" />
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {calendarEvents.length === 0 ? (
                <div className="text-center py-8 text-brain-health-600">
                  <Calendar className="h-12 w-12 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No events scheduled</p>
                  <Button 
                    variant="link" 
                    onClick={() => navigate('/calendar')}
                    className="mt-2"
                  >
                    Add an event
                  </Button>
                </div>
              ) : (
                calendarEvents.map((event) => (
                  <div 
                    key={event.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-brain-health-50 hover:bg-brain-health-100 transition-colors cursor-pointer"
                    onClick={() => navigate('/calendar')}
                  >
                    <Clock className="h-4 w-4 text-brain-health-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-brain-health-900 truncate">{event.title}</p>
                      <p className="text-sm text-brain-health-600">{event.time}</p>
                    </div>
                    {event.category && (
                      <Badge variant="secondary" className="flex-shrink-0">
                        {event.category}
                      </Badge>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Pending Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-memory-emerald-500" />
                Pending Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingActions.length === 0 ? (
                <div className="text-center py-8 text-brain-health-600">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">All caught up! 🎉</p>
                  <Button 
                    variant="link" 
                    onClick={() => navigate('/memory-bridge')}
                    className="mt-2"
                  >
                    Review memory entries
                  </Button>
                </div>
              ) : (
                pendingActions.slice(0, 5).map((action) => (
                  <div 
                    key={action.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-memory-emerald-50 hover:bg-memory-emerald-100 transition-colors cursor-pointer"
                    onClick={() => navigate('/memory-bridge')}
                  >
                    <div className={cn(
                      "h-5 w-5 rounded-full border-2 flex-shrink-0 mt-0.5",
                      action.is_daily_win 
                        ? "border-sunrise-amber-500 bg-sunrise-amber-100" 
                        : "border-memory-emerald-500"
                    )} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-brain-health-900">{action.title}</p>
                      {action.description && (
                        <p className="text-sm text-brain-health-600 mt-1 line-clamp-2">
                          {action.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
              {pendingActions.length > 5 && (
                <Button 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => navigate('/memory-bridge')}
                >
                  View {pendingActions.length - 5} more actions
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Support Circle Updates */}
          {supportMessages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-sunrise-amber-500" />
                  Support Circle
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {supportMessages.map((msg) => (
                  <div 
                    key={msg.id}
                    className="p-3 rounded-lg bg-sunrise-amber-50 hover:bg-sunrise-amber-100 transition-colors cursor-pointer"
                    onClick={() => navigate('/support-circle')}
                  >
                    <p className="font-medium text-brain-health-900 text-sm">
                      {msg.member_name}
                    </p>
                    <p className="text-sm text-brain-health-700 mt-1 line-clamp-2">
                      {msg.message_text}
                    </p>
                    <p className="text-xs text-brain-health-500 mt-1">
                      {format(new Date(msg.created_at), 'h:mm a')}
                    </p>
                  </div>
                ))}
                <Button 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => navigate('/support-circle')}
                >
                  View all messages
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Wellness Insights */}
          {moodEntry && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-clarity-teal-500" />
                  Today's Wellness
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-brain-health-600 mb-2">Energy Level</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={cn(
                          "h-8 flex-1 rounded",
                          level <= moodEntry.energy_level
                            ? "bg-clarity-teal-500"
                            : "bg-brain-health-100"
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-brain-health-600 mt-2">
                    {getEnergyMessage(moodEntry.energy_level)}
                  </p>
                </div>

                {moodEntry.emotions && moodEntry.emotions.length > 0 && (
                  <div>
                    <p className="text-sm text-brain-health-600 mb-2">Emotions</p>
                    <div className="flex flex-wrap gap-2">
                      {moodEntry.emotions.map((emotion, idx) => (
                        <Badge key={idx} variant="secondary">
                          {emotion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {moodEntry.gratitude_note && (
                  <div>
                    <p className="text-sm text-brain-health-600 mb-1">Gratitude</p>
                    <p className="text-sm text-brain-health-800 italic">
                      "{moodEntry.gratitude_note}"
                    </p>
                  </div>
                )}

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/calendar')}
                >
                  Update wellness check-in
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Actions */}
        <Card className="border-2 border-dashed border-brain-health-300">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-memory-emerald-500" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <Button 
                variant="outline"
                className="h-auto py-3 flex-col gap-2"
                onClick={() => navigate('/memory-bridge')}
              >
                <Brain className="h-5 w-5" />
                <span className="text-sm">Record Memory</span>
              </Button>
              <Button 
                variant="outline"
                className="h-auto py-3 flex-col gap-2"
                onClick={() => navigate('/calendar')}
              >
                <Calendar className="h-5 w-5" />
                <span className="text-sm">Add Event</span>
              </Button>
              <Button 
                variant="outline"
                className="h-auto py-3 flex-col gap-2"
                onClick={() => navigate('/calendar')}
              >
                <Heart className="h-5 w-5" />
                <span className="text-sm">Wellness Check</span>
              </Button>
              <Button 
                variant="outline"
                className="h-auto py-3 flex-col gap-2"
                onClick={() => navigate('/support-circle')}
              >
                <Users className="h-5 w-5" />
                <span className="text-sm">Contact Support</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
