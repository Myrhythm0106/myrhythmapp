
import { Star, Calendar, Dumbbell, Footprints, HeartPulse, Users, Check, Plus, Coffee, Heart } from 'lucide-react';

export const actionTypes = [
  { 
    value: 'daily_win', 
    label: 'Daily Victory', 
    icon: <Star className="h-4 w-4" />, 
    description: 'Celebrate small wins that boost your confidence',
    examples: ['Made my bed', 'Took my medication', 'Called a friend']
  },
  { 
    value: 'family_time', 
    label: 'Family Time', 
    icon: <Heart className="h-4 w-4" />, 
    description: 'Quality time with family members for connection and support',
    examples: ['Family dinner', 'Call with sister', 'Play with grandchildren']
  },
  { 
    value: 'break_time', 
    label: 'Break/Rest Time', 
    icon: <Coffee className="h-4 w-4" />, 
    description: 'Scheduled breaks to prevent burnout and maintain energy',
    examples: ['10-minute walk', 'Breathing exercise', 'Listen to music']
  },
  { 
    value: 'appointment', 
    label: 'Appointment', 
    icon: <Calendar className="h-4 w-4" />, 
    description: 'Scheduled meetings with healthcare providers',
    examples: ['Doctor visit', 'Therapy session', 'Check-up']
  },
  { 
    value: 'gym', 
    label: 'Exercise/Fitness', 
    icon: <Dumbbell className="h-4 w-4" />, 
    description: 'Physical activities to strengthen your body',
    examples: ['Gym workout', 'Swimming', 'Yoga class']
  },
  { 
    value: 'steps', 
    label: 'Walking/Movement', 
    icon: <Footprints className="h-4 w-4" />, 
    description: 'Simple movement activities for daily wellness',
    examples: ['Walk to mailbox', '10-minute walk', 'Gentle stretching']
  },
  { 
    value: 'therapy', 
    label: 'Therapy/Medical', 
    icon: <HeartPulse className="h-4 w-4" />, 
    description: 'Healthcare and therapeutic activities',
    examples: ['Physical therapy', 'Counseling', 'Medical treatment']
  },
  { 
    value: 'meeting', 
    label: 'Social Connection', 
    icon: <Users className="h-4 w-4" />, 
    description: 'Connecting with others for support and joy',
    examples: ['Coffee with friend', 'Support group', 'Family dinner']
  },
  { 
    value: 'task', 
    label: 'Daily Task', 
    icon: <Check className="h-4 w-4" />, 
    description: 'Important daily activities and responsibilities',
    examples: ['Grocery shopping', 'Pay bills', 'Organize room']
  },
  { 
    value: 'custom', 
    label: 'Something Else', 
    icon: <Plus className="h-4 w-4" />, 
    description: 'Create your own activity type',
    examples: ['Hobby time', 'Personal care', 'Creative activity']
  }
];
