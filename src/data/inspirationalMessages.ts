
// Types
export interface InspirationalMessage {
  text: string;
  category: "great" | "okay" | "struggling";
  type: string;
}

// Great mood messages
const greatMoodMessages: InspirationalMessage[] = [
  {
    text: "Your positive energy is contagious. Keep spreading that joy!",
    category: "great",
    type: "positivity"
  },
  {
    text: "Wonderful to see you thriving today! Use this energy for something special.",
    category: "great",
    type: "productivity"
  },
  {
    text: "Your great mood is a perfect time to tackle something challenging.",
    category: "great",
    type: "productivity"
  },
  {
    text: "Feeling good? Pay it forward with a kind act for someone else today.",
    category: "great",
    type: "mindfulness"
  },
  {
    text: "Great days like today are perfect for setting new goals and aspirations.",
    category: "great",
    type: "growth"
  },
  {
    text: "Channel this positive energy into your most important tasks today.",
    category: "great",
    type: "productivity"
  },
  {
    text: "When you're feeling good, your brain makes stronger connections. Try learning something new!",
    category: "great",
    type: "health"
  },
  {
    text: "This positive state is perfect for creative thinking and innovation.",
    category: "great",
    type: "creativity"
  },
  {
    text: "Celebrate your good mood by spending time with people who energize you further.",
    category: "great",
    type: "social"
  },
  {
    text: "Optimal mood is the perfect time to practice gratitude. What are three things you're thankful for?",
    category: "great",
    type: "mindfulness"
  },
  {
    text: "Use this positive energy for a brisk walk or workout to compound the benefits.",
    category: "great",
    type: "physical"
  },
  {
    text: "Your brain is primed for learning when you feel good. Take advantage!",
    category: "great",
    type: "growth"
  },
  {
    text: "Great moods enhance creativity. Try tackling a creative project today.",
    category: "great",
    type: "creativity"
  },
  {
    text: "Feeling good today? Pay attention to what contributed to this feeling for future reference.",
    category: "great",
    type: "mindfulness"
  },
  {
    text: "Harness this positive energy for deeper focus and flow state work.",
    category: "great",
    type: "productivity"
  },
  {
    text: "Great days are perfect for trying something new that pushes your comfort zone a bit.",
    category: "great",
    type: "growth"
  },
  {
    text: "Your positive mood creates resilience for future challenges. Savor it!",
    category: "great",
    type: "resilience"
  },
  {
    text: "The world needs your positive energy. Share your enthusiasm with others today.",
    category: "great",
    type: "social"
  },
  {
    text: "Great moods can boost problem-solving ability. What challenge can you tackle today?",
    category: "great",
    type: "productivity"
  },
  {
    text: "Take a moment to appreciate your good mood and the circumstances that contributed to it.",
    category: "great",
    type: "mindfulness"
  },
  {
    text: "Your enthusiasm today can move mountains. What will you accomplish?",
    category: "great",
    type: "motivation"
  },
  {
    text: "Today's positive energy is the perfect foundation for excellence.",
    category: "great",
    type: "productivity"
  }
];

// Okay mood messages
const okayMoodMessages: InspirationalMessage[] = [
  {
    text: "Take a deep breath and find a moment of calm today.",
    category: "okay",
    type: "mindfulness"
  },
  {
    text: "Remember to stretch for 5 minutes every hour to keep your body loose.",
    category: "okay",
    type: "physical"
  },
  {
    text: "Drink a glass of water right now - staying hydrated helps brain function!",
    category: "okay",
    type: "health"
  },
  {
    text: "One small positive thought can change your whole day.",
    category: "okay",
    type: "positivity"
  },
  {
    text: "Try focusing on one task at a time today to reduce cognitive load.",
    category: "okay",
    type: "productivity"
  },
  {
    text: "Stand up and do a quick 30-second stretch to boost your energy.",
    category: "okay",
    type: "physical"
  },
  {
    text: "Practice gratitude by noting three things you're thankful for today.",
    category: "okay",
    type: "mindfulness"
  },
  {
    text: "Every step forward is progress, no matter how small.",
    category: "okay",
    type: "positivity"
  },
  {
    text: "Consider taking a 10-minute nature walk to refresh your mind.",
    category: "okay",
    type: "health"
  },
  {
    text: "Set one achievable goal for today and celebrate when you complete it.",
    category: "okay",
    type: "productivity"
  },
  {
    text: "Sometimes an okay day is the perfect foundation for small improvements.",
    category: "okay",
    type: "growth"
  },
  {
    text: "Take five deep breaths and notice how your body feels afterward.",
    category: "okay",
    type: "mindfulness"
  },
  {
    text: "Looking out a window for a minute can help reset your mental state.",
    category: "okay",
    type: "health"
  },
  {
    text: "What's one small thing you can do to make today slightly better?",
    category: "okay",
    type: "positivity"
  },
  {
    text: "Breaking tasks into smaller pieces makes them more manageable.",
    category: "okay",
    type: "productivity"
  },
  {
    text: "Listen to a favorite song to give your mood a gentle boost.",
    category: "okay",
    type: "health"
  },
  {
    text: "Even on ordinary days, extraordinary things can happen.",
    category: "okay",
    type: "positivity"
  },
  {
    text: "A brief conversation with someone you like can improve your day.",
    category: "okay",
    type: "social"
  },
  {
    text: "Move your body for 5 minutes to refresh your perspective.",
    category: "okay",
    type: "physical"
  },
  {
    text: "Sometimes 'good enough' really is good enough. Be gentle with yourself today.",
    category: "okay",
    type: "mindfulness"
  },
  {
    text: "Small improvements add up to big changes over time.",
    category: "okay",
    type: "growth"
  },
  {
    text: "Balance is sometimes more valuable than constant high energy.",
    category: "okay",
    type: "mindfulness"
  }
];

// Struggling mood messages
const strugglingMoodMessages: InspirationalMessage[] = [
  {
    text: "Remember that difficult feelings are temporary and will pass.",
    category: "struggling",
    type: "resilience"
  },
  {
    text: "Be kind to yourself today - you're doing the best you can.",
    category: "struggling",
    type: "self-care"
  },
  {
    text: "Take things one small moment at a time when days are challenging.",
    category: "struggling",
    type: "mindfulness"
  },
  {
    text: "Your worth isn't measured by your productivity, especially on hard days.",
    category: "struggling",
    type: "self-care"
  },
  {
    text: "Reach out to someone supportive - connection helps in difficult times.",
    category: "struggling",
    type: "social"
  },
  {
    text: "Focus on just the next small step. You don't need to solve everything at once.",
    category: "struggling",
    type: "resilience"
  },
  {
    text: "Try the 5-4-3-2-1 technique: notice 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste.",
    category: "struggling",
    type: "mindfulness"
  },
  {
    text: "Difficult days are when self-care is most important. What small comfort can you give yourself?",
    category: "struggling",
    type: "self-care"
  },
  {
    text: "Struggling is human and universal. You're not alone in having hard days.",
    category: "struggling",
    type: "resilience"
  },
  {
    text: "Your brain and body need rest when you're struggling. Can you take a short break?",
    category: "struggling",
    type: "health"
  },
  {
    text: "Place a hand on your heart and take three deep breaths. Feel the support you're giving yourself.",
    category: "struggling",
    type: "mindfulness"
  },
  {
    text: "Progress isn't always visible. Sometimes surviving a hard day is an achievement.",
    category: "struggling",
    type: "resilience"
  },
  {
    text: "Stepping outside for fresh air can help shift your perspective when struggling.",
    category: "struggling",
    type: "health"
  },
  {
    text: "Your struggles don't define you - they're just one part of your complex human experience.",
    category: "struggling",
    type: "resilience"
  },
  {
    text: "Simply drinking water and eating something nourishing can help when you're having a tough time.",
    category: "struggling",
    type: "health"
  },
  {
    text: "Consider reaching out to a professional if you're struggling consistently.",
    category: "struggling",
    type: "support"
  },
  {
    text: "Your brain is trying to protect you when you feel down. Thank it, then gently redirect.",
    category: "struggling",
    type: "mindfulness"
  },
  {
    text: "What worked for you in past difficult times? Can you try that strategy again?",
    category: "struggling",
    type: "resilience"
  },
  {
    text: "It takes courage to acknowledge when you're struggling. That awareness is valuable.",
    category: "struggling",
    type: "growth"
  },
  {
    text: "When we name our emotions, we gain some power over them. What exactly are you feeling?",
    category: "struggling",
    type: "mindfulness"
  },
  {
    text: "This moment is hard, but you have overcome difficult moments before.",
    category: "struggling",
    type: "resilience"
  },
  {
    text: "Healing isn't linear. Some days are harder than others, and that's okay.",
    category: "struggling",
    type: "self-care"
  }
];

// Additional messages for each category - representing the larger collection
// In a real implementation, you would add hundreds more messages here
const additionalGreatMoodMessages: InspirationalMessage[] = [
  {
    text: "Your enthusiasm today is infectious. Let it propel you to new heights.",
    category: "great",
    type: "motivation"
  },
  {
    text: "Great days are perfect for planning exciting future goals.",
    category: "great",
    type: "planning"
  },
  // Many more would be added here to reach well over 100...
];

const additionalOkayMoodMessages: InspirationalMessage[] = [
  {
    text: "Sometimes steady and stable is exactly what we need.",
    category: "okay",
    type: "balance"
  },
  {
    text: "Moderation and consistency often lead to lasting progress.",
    category: "okay",
    type: "growth"
  },
  // Many more would be added here to reach well over 100...
];

const additionalStrugglingMoodMessages: InspirationalMessage[] = [
  {
    text: "Every storm passes eventually. Hold on to that knowledge today.",
    category: "struggling",
    type: "hope"
  },
  {
    text: "Small moments of peace can be found even on the hardest days.",
    category: "struggling",
    type: "mindfulness"
  },
  // Many more would be added here to reach well over 100...
];

// Combine all messages
export const inspirationalMessages: InspirationalMessage[] = [
  ...greatMoodMessages,
  ...okayMoodMessages,
  ...strugglingMoodMessages,
  ...additionalGreatMoodMessages,
  ...additionalOkayMoodMessages,
  ...additionalStrugglingMoodMessages
];

// In a real implementation, this array would contain over 400 messages total
