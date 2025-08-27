
import { Star, Calendar, Dumbbell, Footprints, HeartPulse, Users, Check, Plus, Coffee, Heart, Cake, Gift, Trophy, Sparkles, Camera, PartyPopper } from 'lucide-react';

export const actionTypes = [
  { 
    value: 'daily_win', 
    label: 'Daily Victory', 
    icon: Star, 
    description: 'Celebrate small wins that boost your confidence',
    examples: ['Made my bed', 'Took my medication', 'Called a friend']
  },
  { 
    value: 'family_time', 
    label: 'Family Time', 
    icon: Heart, 
    description: 'Quality time with family members for connection and support',
    examples: ['Family dinner', 'Call with sister', 'Play with grandchildren']
  },
  { 
    value: 'break_time', 
    label: 'Break/Rest Time', 
    icon: Coffee, 
    description: 'Scheduled breaks to prevent burnout and maintain energy',
    examples: ['10-minute walk', 'Breathing exercise', 'Listen to music']
  },
  { 
    value: 'appointment', 
    label: 'Appointment', 
    icon: Calendar, 
    description: 'Scheduled commitments and care visits (optional)',
    examples: ['Care visit', 'Therapy session', 'Health check-up']
  },
  { 
    value: 'gym', 
    label: 'Exercise/Fitness', 
    icon: Dumbbell, 
    description: 'Physical activities to strengthen your body',
    examples: ['Gym workout', 'Swimming', 'Yoga class']
  },
  { 
    value: 'steps', 
    label: 'Walking/Movement', 
    icon: Footprints, 
    description: 'Simple movement activities for daily wellness',
    examples: ['Walk to mailbox', '10-minute walk', 'Gentle stretching']
  },
  { 
    value: 'therapy', 
    label: 'Therapy/Health', 
    icon: HeartPulse, 
    description: 'Healthcare and therapeutic activities',
    examples: ['Physical therapy', 'Counseling', 'Health visit']
  },
  { 
    value: 'meeting', 
    label: 'Social Connection', 
    icon: Users, 
    description: 'Connecting with others for support and joy',
    examples: ['Coffee with friend', 'Support group', 'Family dinner']
  },
  { 
    value: 'task', 
    label: 'Daily Task', 
    icon: Check, 
    description: 'Important daily activities and responsibilities',
    examples: ['Grocery shopping', 'Pay bills', 'Organize room']
  },
  { 
    value: 'birthday', 
    label: 'Birthday', 
    icon: Cake, 
    description: 'Celebrate birthdays and special age milestones',
    examples: ['My birthday', 'Mom\'s 60th birthday', 'Best friend\'s birthday']
  },
  { 
    value: 'anniversary', 
    label: 'Anniversary', 
    icon: Heart, 
    description: 'Mark relationship milestones and special dates',
    examples: ['Wedding anniversary', 'First date anniversary', 'Work anniversary']
  },
  { 
    value: 'milestone', 
    label: 'Personal Milestone', 
    icon: Trophy, 
    description: 'Celebrate achievements and life milestones',
    examples: ['Graduation', 'Job promotion', 'First home purchase']
  },
  { 
    value: 'achievement', 
    label: 'Achievement', 
    icon: Star, 
    description: 'Mark personal accomplishments and victories',
    examples: ['Completed marathon', 'Finished project', 'Learned new skill']
  },
  { 
    value: 'special_occasion', 
    label: 'Special Occasion', 
    icon: PartyPopper, 
    description: 'Mark holidays, parties, and special events',
    examples: ['Christmas dinner', 'Family reunion', 'Holiday celebration']
  },
  { 
    value: 'memory_marker', 
    label: 'Memory Moment', 
    icon: Camera, 
    description: 'Capture and plan moments worth remembering',
    examples: ['Photo session', 'Family gathering', 'Special outing']
  },
  { 
    value: 'gift_reminder', 
    label: 'Gift Reminder', 
    icon: Gift, 
    description: 'Remember to buy or prepare gifts for special people',
    examples: ['Buy birthday gift', 'Prepare anniversary surprise', 'Holiday shopping']
  },
  { 
    value: 'celebration', 
    label: 'Celebration', 
    icon: Sparkles, 
    description: 'Plan and organize celebrations and parties',
    examples: ['Birthday party planning', 'Anniversary dinner', 'Victory celebration']
  },
  { 
    value: 'custom', 
    label: 'Something Else', 
    icon: Plus, 
    description: 'Create your own activity type',
    examples: ['Hobby time', 'Personal care', 'Creative activity']
  }
];
