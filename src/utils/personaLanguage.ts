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
    quickQuestionOptions: ["Math/Science", "Writing/Essays", "Group Projects", "Test Prep"]
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
    quickQuestionOptions: ["Too many meetings", "Email overload", "Context switching", "Unclear priorities"]
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
    quickQuestionOptions: ["Structure & routine", "Gentle reminders", "Breaking tasks down", "Tracking progress"]
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
    quickQuestionOptions: ["Parent/Elder", "Child/Dependent", "Spouse/Partner", "Multiple people"]
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
    quickQuestionOptions: ["Stay organized", "Remember important things", "Build better habits", "Reduce stress"]
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
