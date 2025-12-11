// Dream prompt suggestions organized by category for brain-friendly discovery

export interface PromptSuggestion {
  text: string;
  category?: string;
  emoji?: string;
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
    { text: "Feel stronger and healthier", category: "health", emoji: "💪" },
    { text: "Learn something new", category: "growth", emoji: "📚" },
    { text: "Reconnect with loved ones", category: "relationships", emoji: "❤️" },
    { text: "Find more peace and calm", category: "wellbeing", emoji: "🧘" },
    { text: "Build financial security", category: "finance", emoji: "💰" },
    { text: "Start a creative project", category: "creativity", emoji: "🎨" },
    { text: "Advance in my career", category: "career", emoji: "🚀" },
    { text: "Build confidence in myself", category: "personal", emoji: "✨" },
  ]
};

// Why/motivation suggestions
export const dreamWhyPrompt: DreamPrompt = {
  question: "Why is this meaningful to you?",
  helpText: "Your 'why' will keep you going on hard days",
  suggestions: [
    { text: "Because I want to be there for my family", emoji: "👨‍👩‍👧" },
    { text: "Because I deserve to feel good about myself", emoji: "💖" },
    { text: "Because this will help me feel more independent", emoji: "🦋" },
    { text: "Because it will improve my daily quality of life", emoji: "☀️" },
    { text: "Because I want to prove to myself I can do this", emoji: "🏆" },
    { text: "Because it aligns with who I want to become", emoji: "🌟" },
  ]
};

// Affirmation suggestions
export const affirmationPrompt: DreamPrompt = {
  question: "What will you tell yourself on hard days?",
  helpText: "A personal affirmation to keep you motivated",
  suggestions: [
    { text: "I am getting stronger every day", emoji: "💪" },
    { text: "Every small step counts", emoji: "👣" },
    { text: "I am worthy of this goal", emoji: "💎" },
    { text: "My effort is building something beautiful", emoji: "🌸" },
    { text: "I can do hard things", emoji: "🔥" },
    { text: "Progress, not perfection", emoji: "🌱" },
  ]
};

// Discovery prompts for guided exploration
export const discoveryPrompts: DreamPrompt[] = [
  {
    question: "If fear didn't exist, what would you try?",
    suggestions: [
      { text: "Start my own business", emoji: "🏢" },
      { text: "Travel to a new country", emoji: "✈️" },
      { text: "Learn a musical instrument", emoji: "🎵" },
      { text: "Speak up more at work", emoji: "🎤" },
      { text: "Ask for what I really want", emoji: "🙋" },
    ]
  },
  {
    question: "What does a perfect morning look like?",
    suggestions: [
      { text: "Waking up feeling rested", emoji: "😴" },
      { text: "Having time for exercise", emoji: "🏃" },
      { text: "Enjoying a peaceful breakfast", emoji: "🍳" },
      { text: "No rushing or stress", emoji: "🧘" },
      { text: "Quality time with family", emoji: "👨‍👩‍👧" },
    ]
  },
  {
    question: "What would make your family proud?",
    suggestions: [
      { text: "Taking better care of my health", emoji: "💪" },
      { text: "Being more present with them", emoji: "❤️" },
      { text: "Achieving a long-held goal", emoji: "🎯" },
      { text: "Learning to manage stress better", emoji: "🧘" },
      { text: "Building financial stability", emoji: "💰" },
    ]
  },
  {
    question: "What skill would change your life?",
    suggestions: [
      { text: "Better communication", emoji: "💬" },
      { text: "Time management", emoji: "⏰" },
      { text: "Cooking healthy meals", emoji: "🥗" },
      { text: "Managing my emotions", emoji: "🧠" },
      { text: "Learning a new language", emoji: "🌍" },
    ]
  }
];

// Dream categories for organization
export const dreamCategories = [
  { id: "health", label: "Health & Wellness", emoji: "💪", color: "brain-health" },
  { id: "relationships", label: "Relationships", emoji: "❤️", color: "neural-magenta" },
  { id: "career", label: "Career & Work", emoji: "💼", color: "neural-blue" },
  { id: "finance", label: "Financial", emoji: "💰", color: "brand-orange" },
  { id: "growth", label: "Personal Growth", emoji: "🌱", color: "memory-emerald" },
  { id: "creativity", label: "Creativity", emoji: "🎨", color: "neural-purple" },
  { id: "wellbeing", label: "Mental Wellbeing", emoji: "🧘", color: "clarity-teal" },
  { id: "personal", label: "Personal", emoji: "✨", color: "beacon" },
];

// Template dreams for quick start
export const templateDreams = [
  {
    title: "Improve my physical health",
    why: "Because I want to feel energized and strong every day",
    affirmation: "Every healthy choice makes me stronger",
    category: "health",
    emoji: "💪"
  },
  {
    title: "Strengthen my relationships",
    why: "Because meaningful connections bring joy to my life",
    affirmation: "I nurture the relationships that matter most",
    category: "relationships",
    emoji: "❤️"
  },
  {
    title: "Learn something new",
    why: "Because growth keeps my mind sharp and engaged",
    affirmation: "I am always capable of learning and growing",
    category: "growth",
    emoji: "📚"
  },
  {
    title: "Find more peace and balance",
    why: "Because I deserve to feel calm and centered",
    affirmation: "I create peace in my life, one moment at a time",
    category: "wellbeing",
    emoji: "🧘"
  },
];

// Emoji picker options organized by category
export const dreamEmojis = {
  health: ["💪", "🏃", "🧘", "🥗", "💊", "🏋️", "🚴", "🏊"],
  relationships: ["❤️", "👨‍👩‍👧", "🤝", "💑", "👥", "🫂", "💝", "👋"],
  career: ["💼", "🚀", "📈", "💻", "🎯", "📊", "🏆", "💡"],
  finance: ["💰", "💵", "🏦", "📈", "💳", "🏠", "📉", "💎"],
  growth: ["🌱", "📚", "🎓", "🧠", "✨", "🌟", "📖", "🔮"],
  creativity: ["🎨", "🎵", "📝", "🎭", "📷", "🎬", "✏️", "🖌️"],
  wellbeing: ["🧘", "🌸", "☀️", "🌈", "🕊️", "🌊", "🍃", "🦋"],
  personal: ["✨", "💫", "⭐", "🌟", "💖", "🔥", "🎉", "🙏"],
};
