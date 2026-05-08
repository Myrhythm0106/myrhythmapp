// Dream prompt suggestions organized by category for brain-friendly discovery

export interface PromptSuggestion {
  text: string;
  category?: string;
}

export interface DreamPrompt {
  question: string;
  helpText?: string;
  suggestions: PromptSuggestion[];
}

// Dream title suggestions
export const dreamTitlePrompt: DreamPrompt = {
  question: "What would make you proud in 3 months?",
  helpText: "Choose one to start, then make it yours",
  suggestions: [
    { text: "Feel stronger and healthier", category: "health" },
    { text: "Learn something new", category: "growth" },
    { text: "Reconnect with loved ones", category: "relationships" },
    { text: "Find more peace and calm", category: "wellbeing" },
    { text: "Build financial security", category: "finance" },
    { text: "Start a creative project", category: "creativity" },
    { text: "Advance in my career", category: "career" },
    { text: "Build confidence in myself", category: "personal" },
  ]
};

// Why/motivation suggestions
export const dreamWhyPrompt: DreamPrompt = {
  question: "Why is this meaningful to you?",
  helpText: "Your 'why' will keep you going on hard days",
  suggestions: [
    { text: "Because I want to be there for my family" },
    { text: "Because I deserve to feel good about myself" },
    { text: "Because this will help me feel more independent" },
    { text: "Because it will improve my daily quality of life" },
    { text: "Because I want to prove to myself I can do this" },
    { text: "Because it aligns with who I want to become" },
  ]
};

// Affirmation suggestions
export const affirmationPrompt: DreamPrompt = {
  question: "What will you tell yourself on hard days?",
  helpText: "A personal affirmation to keep you motivated",
  suggestions: [
    { text: "I am getting stronger every day" },
    { text: "Every small step counts" },
    { text: "I am worthy of this goal" },
    { text: "My effort is building something meaningful" },
    { text: "I can do hard things" },
    { text: "Progress, not perfection" },
  ]
};

// Discovery prompts for guided exploration
export const discoveryPrompts: DreamPrompt[] = [
  {
    question: "If fear didn't exist, what would you try?",
    suggestions: [
      { text: "Start my own business" },
      { text: "Travel to a new country" },
      { text: "Learn a musical instrument" },
      { text: "Speak up more at work" },
      { text: "Ask for what I really want" },
    ]
  },
  {
    question: "What does a perfect morning look like?",
    suggestions: [
      { text: "Waking up feeling rested" },
      { text: "Having time for exercise" },
      { text: "Enjoying a peaceful breakfast" },
      { text: "No rushing or stress" },
      { text: "Quality time with family" },
    ]
  },
  {
    question: "What would make your family proud?",
    suggestions: [
      { text: "Taking better care of my health" },
      { text: "Being more present with them" },
      { text: "Achieving a long-held goal" },
      { text: "Learning to manage stress better" },
      { text: "Building financial stability" },
    ]
  },
  {
    question: "What skill would change your life?",
    suggestions: [
      { text: "Better communication" },
      { text: "Time management" },
      { text: "Cooking healthy meals" },
      { text: "Managing my emotions" },
      { text: "Learning a new language" },
    ]
  }
];

// Dream categories for organization
export const dreamCategories: { id: string; label: string; color: string; emoji?: string }[] = [
  { id: "health",        label: "Health & Wellness",  color: "brain-health" },
  { id: "relationships", label: "Relationships",      color: "neural-magenta" },
  { id: "career",        label: "Career & Work",      color: "neural-blue" },
  { id: "finance",       label: "Financial",          color: "brand-orange" },
  { id: "growth",        label: "Personal Growth",    color: "memory-emerald" },
  { id: "creativity",    label: "Creativity",         color: "neural-purple" },
  { id: "wellbeing",     label: "Mental Wellbeing",   color: "clarity-teal" },
  { id: "personal",      label: "Personal",           color: "beacon" },
];

// Template dreams for quick start
export const templateDreams = [
  {
    title: "Improve my physical health",
    why: "Because I want to feel energised and strong every day",
    affirmation: "Every healthy choice makes me stronger",
    category: "health",
  },
  {
    title: "Strengthen my relationships",
    why: "Because meaningful connections bring depth to my life",
    affirmation: "I nurture the relationships that matter most",
    category: "relationships",
  },
  {
    title: "Learn something new",
    why: "Because growth keeps my mind sharp and engaged",
    affirmation: "I am always capable of learning and growing",
    category: "growth",
  },
  {
    title: "Find more peace and balance",
    why: "Because I deserve to feel calm and centred",
    affirmation: "I create peace in my life, one moment at a time",
    category: "wellbeing",
  },
];

// Deprecated — kept for backward compatibility. No longer surfaced in UI.
export const dreamEmojis: Record<string, string[]> = {
  health: [], relationships: [], career: [], finance: [], growth: [], creativity: [], wellbeing: [], personal: []
};
