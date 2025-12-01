// Persona-specific language adapter for consistent messaging

export type PersonaType = 'student' | 'executive' | 'recovery' | 'caregiver' | 'general';

interface PersonaLanguage {
  action: string;
  actions: string;
  reminder: string;
  schedule: string;
  victory: string;
  victoryEmoji: string;
  encouragement: string;
  missed: string;
  examplePrompt: string;
  quickQuestion: string;
  quickQuestionOptions: string[];
  // Brain-injury-first additions
  warmWelcome: string;
  scheduleReason: string;
  progressAck: string;
  overwhelmSupport: string;
  moodLabels: string[];
  ctaText: string;
}

const personaLanguageMap: Record<PersonaType, PersonaLanguage> = {
  student: {
    action: "To-do",
    actions: "To-dos",
    reminder: "Study reminder",
    schedule: "Add to planner",
    victory: "Nailed it!",
    victoryEmoji: "🎯",
    encouragement: "You're crushing it! Keep the momentum going.",
    missed: "No worries - let's reschedule this one.",
    examplePrompt: "I need to finish my essay by Friday and study for the math test on Monday",
    quickQuestion: "What's your hardest subject to stay on top of?",
    quickQuestionOptions: ["Math/Science", "Writing/Essays", "Group Projects", "Test Prep"],
    warmWelcome: "Ready to crush today? You've got this!",
    scheduleReason: "Scheduled for when you said you focus best",
    progressAck: "Look at everything you've accomplished!",
    overwhelmSupport: "One thing at a time - you can do this.",
    moodLabels: ["Focused", "Okay", "Need a break"],
    ctaText: "Let's do this!"
  },
  executive: {
    action: "Deliverable",
    actions: "Deliverables",
    reminder: "Meeting prep",
    schedule: "Block time",
    victory: "Done. Next.",
    victoryEmoji: "💼",
    encouragement: "Excellent execution. Moving forward.",
    missed: "Let's get this rescheduled.",
    examplePrompt: "I need to review the Q4 projections before Thursday's board meeting and follow up with Sarah about the partnership",
    quickQuestion: "What's your biggest productivity leak?",
    quickQuestionOptions: ["Too many meetings", "Email overload", "Context switching", "Unclear priorities"],
    warmWelcome: "Your priorities are clear. Let's execute.",
    scheduleReason: "Optimized for your peak performance window",
    progressAck: "Strong execution this week.",
    overwhelmSupport: "Focus on high-impact items first.",
    moodLabels: ["High energy", "Steady", "Low bandwidth"],
    ctaText: "Start my day"
  },
  recovery: {
    action: "Next step",
    actions: "Next steps",
    reminder: "Gentle reminder",
    schedule: "Plan your day",
    victory: "You did it!",
    victoryEmoji: "🌟",
    encouragement: "Every small step matters. You're doing great.",
    missed: "It's okay. Let's find a better time that works for you.",
    examplePrompt: "I want to call my therapist to schedule an appointment and take a 10 minute walk today",
    quickQuestion: "What would help you most right now?",
    quickQuestionOptions: ["Structure & routine", "Gentle reminders", "Breaking tasks down", "Tracking progress"],
    warmWelcome: "You're taking control of your day. That takes real strength.",
    scheduleReason: "Scheduled for when you said you feel most energized",
    progressAck: "Look at all you've accomplished! Every step forward counts.",
    overwhelmSupport: "It's okay to take it one thing at a time. You're doing great.",
    moodLabels: ["Good energy", "Okay", "Need rest"],
    ctaText: "Let's start your day"
  },
  caregiver: {
    action: "Care task",
    actions: "Care tasks",
    reminder: "Care reminder",
    schedule: "Add to care plan",
    victory: "Great job caring!",
    victoryEmoji: "💙",
    encouragement: "You're making a difference. Don't forget to care for yourself too.",
    missed: "Caregiving is hard. Let's adjust the timing.",
    examplePrompt: "I need to pick up Mom's prescription by Wednesday and schedule her follow-up appointment",
    quickQuestion: "Who are you supporting?",
    quickQuestionOptions: ["Parent/Elder", "Child/Dependent", "Spouse/Partner", "Multiple people"],
    warmWelcome: "You're here for others - we're here for you.",
    scheduleReason: "Timed around your caregiving schedule",
    progressAck: "You're doing amazing work - and making progress!",
    overwhelmSupport: "Caregiving is hard. Be gentle with yourself.",
    moodLabels: ["Managing well", "Okay", "Overwhelmed"],
    ctaText: "View my care plan"
  },
  general: {
    action: "Action",
    actions: "Actions",
    reminder: "Reminder",
    schedule: "Schedule it",
    victory: "Done!",
    victoryEmoji: "✨",
    encouragement: "Great progress! Keep it up.",
    missed: "Let's reschedule this.",
    examplePrompt: "I need to call the doctor by Friday about my test results",
    quickQuestion: "What brings you here today?",
    quickQuestionOptions: ["Stay organized", "Remember important things", "Build better habits", "Reduce stress"],
    warmWelcome: "Good to see you! Let's make today count.",
    scheduleReason: "Scheduled based on your preferences",
    progressAck: "You're making real progress!",
    overwhelmSupport: "Take it one step at a time.",
    moodLabels: ["Good", "Okay", "Tired"],
    ctaText: "Start my day"
  }
};

export function getPersonaLanguage(persona: PersonaType | string | null): PersonaLanguage {
  const normalizedPersona = (persona?.toLowerCase() || 'general') as PersonaType;
  return personaLanguageMap[normalizedPersona] || personaLanguageMap.general;
}

export function getPersonaFromUserType(userType: string | null): PersonaType {
  if (!userType) return 'general';
  
  const typeMap: Record<string, PersonaType> = {
    'student': 'student',
    'brain-injury': 'recovery',
    'thriving': 'recovery',
    'executive': 'executive',
    'professional': 'executive',
    'caregiver': 'caregiver',
    'medical': 'caregiver',
    'cognitive-support': 'recovery',
    'brain-health': 'general',
    'memory-first': 'recovery'
  };
  
  return typeMap[userType.toLowerCase()] || 'general';
}

export function adaptTerm(term: string, persona: PersonaType | string | null): string {
  const lang = getPersonaLanguage(persona as PersonaType);
  
  const termMap: Record<string, keyof PersonaLanguage> = {
    'action': 'action',
    'actions': 'actions',
    'reminder': 'reminder',
    'schedule': 'schedule',
    'victory': 'victory',
    'encouragement': 'encouragement',
    'missed': 'missed'
  };
  
  const key = termMap[term.toLowerCase()];
  return key ? lang[key] as string : term;
}
