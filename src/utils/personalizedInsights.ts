import { UserType } from "@/types/user";
import { FocusArea } from "./rhythmAnalysis";

interface ProfileData {
  primaryChallenge: string;
  energyPeak: string;
  supportStyle: string;
  quickRecommendations: string[];
}

// Helper function to generate a random item from an array
function getRandomItem<T>(array: T[]): T {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

// Helper function to generate personalized insights
export function generatePersonalizedInsights(userType: UserType): ProfileData {
  const rhythmSignature = rhythmSignatures[userType];
  const primaryChallenge = primaryChallenges[userType];
  const energyPeak = energyPeaks[userType];
  const supportStyle = supportStyles[userType];
  const quickWin = quickWins[userType];
  
  return {
    primaryChallenge,
    energyPeak,
    supportStyle,
    quickRecommendations: [
      `Embrace your rhythm signature: ${rhythmSignature}`,
      `Address your primary challenge with focused strategies`,
      `Optimize your energy peak for maximum productivity`,
      `Seek support that aligns with your preferred style`,
      `Achieve a quick win by ${quickWin}`
    ]
  };
}

const rhythmSignatures: Record<UserType, string> = {
  'brain-injury': 'The Resilient Rebuilder',
  'cognitive-optimization': 'The Strategic Optimizer',
  'empowerment': 'The Empowered Leader',
  'brain-health': 'The Wellness Champion',
  'caregiver': 'The Compassionate Guide',
  'wellness': 'The Balanced Achiever',
  'medical-professional': 'The Clinical Expert',
  'colleague': 'The Collaborative Innovator'
};

const challengeStatements: Record<FocusArea, string[]> = {
  memory: [
    'You sometimes struggle to recall important details.',
    'Remembering names and faces can be challenging for you.',
    'You occasionally misplace items or forget appointments.'
  ],
  structure: [
    'You find it difficult to maintain a consistent daily routine.',
    'Staying organized and managing tasks can be overwhelming.',
    'You sometimes struggle to prioritize effectively.'
  ],
  emotional: [
    'You occasionally experience mood swings or emotional ups and downs.',
    'Managing stress and anxiety can be challenging for you.',
    'You sometimes struggle to regulate your emotions effectively.'
  ],
  achievement: [
    'You sometimes struggle to stay motivated and focused on your goals.',
    'Achieving a sense of accomplishment can be challenging for you.',
    'You occasionally feel stuck or stagnant in your personal growth.'
  ],
  community: [
    'You sometimes feel isolated or disconnected from others.',
    'Building and maintaining meaningful relationships can be challenging.',
    'You occasionally struggle to find a sense of belonging.'
  ],
  growth: [
    'You sometimes struggle to embrace new challenges and experiences.',
    'Stepping outside of your comfort zone can be difficult for you.',
    'You occasionally feel resistant to change or personal growth.'
  ]
};

const strengthStatements: Record<FocusArea, string[]> = {
  memory: [
    'You have a strong ability to learn and retain new information.',
    'Your memory skills allow you to excel in academic pursuits.',
    'You are adept at recalling past experiences and events.'
  ],
  structure: [
    'You thrive in structured environments and routines.',
    'Your organizational skills help you stay on top of tasks and responsibilities.',
    'You are adept at creating and maintaining effective systems.'
  ],
  emotional: [
    'You possess a high degree of emotional intelligence and empathy.',
    'Your emotional resilience allows you to navigate challenges with grace.',
    'You are adept at understanding and managing your emotions.'
  ],
  achievement: [
    'You are highly motivated and driven to achieve your goals.',
    'Your determination and perseverance lead to success in your endeavors.',
    'You are adept at setting and accomplishing meaningful objectives.'
  ],
  community: [
    'You are a natural connector and enjoy building relationships with others.',
    'Your social skills make you a valuable member of any community.',
    'You are adept at fostering a sense of belonging and connection.'
  ],
  growth: [
    'You have a strong desire to learn and grow as an individual.',
    'Your open-mindedness allows you to embrace new experiences and perspectives.',
    'You are adept at adapting to change and seeking personal development.'
  ]
};

const opportunityStatements: Record<FocusArea, string[]> = {
  memory: [
    'Enhance your memory skills through targeted exercises and techniques.',
    'Explore strategies for improving focus and concentration.',
    'Develop habits that support long-term memory retention.'
  ],
  structure: [
    'Create a daily routine that aligns with your natural rhythms and preferences.',
    'Implement organizational systems to streamline tasks and responsibilities.',
    'Prioritize activities that contribute to your overall well-being.'
  ],
  emotional: [
    'Practice mindfulness and meditation to cultivate emotional awareness.',
    'Develop healthy coping mechanisms for managing stress and anxiety.',
    'Seek support from trusted friends, family, or professionals.'
  ],
  achievement: [
    'Set clear, achievable goals that align with your values and aspirations.',
    'Break down larger tasks into smaller, manageable steps.',
    'Celebrate your accomplishments and acknowledge your progress.'
  ],
  community: [
    'Join social groups or organizations that align with your interests.',
    'Attend community events and engage with your neighbors.',
    'Volunteer your time to support causes you care about.'
  ],
  growth: [
    'Embrace new challenges and step outside of your comfort zone.',
    'Seek out opportunities for learning and personal development.',
    'Cultivate a growth mindset and embrace change as a catalyst for growth.'
  ]
};

const personalizedMessages: Record<FocusArea, string[]> = {
  memory: [
    'Your memory skills are a valuable asset that can be further enhanced through targeted training and practice.',
    'By implementing effective memory strategies, you can unlock your full cognitive potential.',
    'Embrace the journey of memory enhancement and discover the power of your mind.'
  ],
  structure: [
    'Creating a structured environment can provide a sense of stability and control in your life.',
    'By establishing routines and systems, you can optimize your productivity and well-being.',
    'Embrace the power of structure and create a life that supports your goals and aspirations.'
  ],
  emotional: [
    'Your emotional intelligence is a strength that can be further developed through self-awareness and practice.',
    'By cultivating emotional resilience, you can navigate challenges with grace and equanimity.',
    'Embrace the journey of emotional growth and discover the power of your inner peace.'
  ],
  achievement: [
    'Your drive and determination are valuable assets that can lead to great success in your endeavors.',
    'By setting clear goals and taking consistent action, you can achieve your dreams and aspirations.',
    'Embrace the journey of achievement and discover the power of your potential.'
  ],
  community: [
    'Your ability to connect with others is a gift that can enrich your life and the lives of those around you.',
    'By building meaningful relationships, you can create a strong support system and sense of belonging.',
    'Embrace the power of community and discover the joy of connection and collaboration.'
  ],
  growth: [
    'Your desire to learn and grow is a valuable asset that can lead to personal fulfillment and success.',
    'By embracing new challenges and seeking out opportunities for development, you can unlock your full potential.',
    'Embrace the journey of growth and discover the power of your evolving self.'
  ]
};

const nextSteps: Record<FocusArea, string[]> = {
  memory: [
    'Begin a daily memory training program to sharpen your cognitive skills.',
    'Practice mindfulness techniques to improve focus and concentration.',
    'Incorporate memory-enhancing foods into your diet.'
  ],
  structure: [
    'Create a daily routine that aligns with your natural rhythms and preferences.',
    'Implement organizational systems to streamline tasks and responsibilities.',
    'Prioritize activities that contribute to your overall well-being.'
  ],
  emotional: [
    'Practice mindfulness and meditation to cultivate emotional awareness.',
    'Develop healthy coping mechanisms for managing stress and anxiety.',
    'Seek support from trusted friends, family, or professionals.'
  ],
  achievement: [
    'Set clear, achievable goals that align with your values and aspirations.',
    'Break down larger tasks into smaller, manageable steps.',
    'Celebrate your accomplishments and acknowledge your progress.'
  ],
  community: [
    'Join social groups or organizations that align with your interests.',
    'Attend community events and engage with your neighbors.',
    'Volunteer your time to support causes you care about.'
  ],
  growth: [
    'Embrace new challenges and step outside of your comfort zone.',
    'Seek out opportunities for learning and personal development.',
    'Cultivate a growth mindset and embrace change as a catalyst for growth.'
  ]
};

const uniqueCharacteristics: Record<FocusArea, string[]> = {
  memory: [
    'Analytical Mindset',
    'Strategic Thinking',
    'Detail-Oriented'
  ],
  structure: [
    'Organized Approach',
    'Systematic Planning',
    'Efficient Execution'
  ],
  emotional: [
    'Empathetic Nature',
    'Compassionate Heart',
    'Resilient Spirit'
  ],
  achievement: [
    'Driven Personality',
    'Ambitious Goals',
    'Persistent Effort'
  ],
  community: [
    'Collaborative Spirit',
    'Supportive Nature',
    'Inclusive Mindset'
  ],
  growth: [
    'Curious Mind',
    'Open Heart',
    'Adaptive Nature'
  ]
};

const strengths: Record<FocusArea, string[]> = {
  memory: [
    'Problem-Solving',
    'Logical Reasoning',
    'Pattern Recognition'
  ],
  structure: [
    'Time Management',
    'Task Prioritization',
    'Resource Allocation'
  ],
  emotional: [
    'Emotional Regulation',
    'Conflict Resolution',
    'Empathy'
  ],
  achievement: [
    'Goal Setting',
    'Action Planning',
    'Progress Tracking'
  ],
  community: [
    'Relationship Building',
    'Team Collaboration',
    'Community Engagement'
  ],
  growth: [
    'Learning Agility',
    'Adaptability',
    'Innovation'
  ]
};

const growthOpportunities: Record<FocusArea, string[]> = {
  memory: [
    'Sustained Attention',
    'Working Memory',
    'Processing Speed'
  ],
  structure: [
    'Flexibility',
    'Adaptability',
    'Spontaneity'
  ],
  emotional: [
    'Emotional Expression',
    'Vulnerability',
    'Self-Compassion'
  ],
  achievement: [
    'Patience',
    'Resilience',
    'Self-Care'
  ],
  community: [
    'Assertiveness',
    'Boundary Setting',
    'Self-Advocacy'
  ],
  growth: [
    'Risk-Taking',
    'Experimentation',
    'Embracing Failure'
  ]
};

const primaryChallenges: Record<UserType, string> = {
  'brain-injury': 'Rebuilding cognitive confidence and establishing new patterns',
  'cognitive-optimization': 'Maximizing mental performance while maintaining balance',
  'empowerment': 'Translating personal vision into consistent action and leadership',
  'brain-health': 'Maintaining optimal cognitive wellness through lifestyle integration',
  'caregiver': 'Balancing care responsibilities with personal wellbeing',
  'wellness': 'Creating sustainable habits that support long-term health goals',
  'medical-professional': 'Managing clinical demands while maintaining personal cognitive health',
  'colleague': 'Fostering innovation while supporting team cognitive wellness'
};

const energyPeaks: Record<UserType, string> = {
  'brain-injury': 'Mid-morning after structured routine establishment',
  'cognitive-optimization': 'Early morning during peak focus hours',
  'empowerment': 'Throughout the day with consistent energy management',
  'brain-health': 'Morning and early evening with proper lifestyle balance',
  'caregiver': 'Early morning before care responsibilities begin',
  'wellness': 'Flexible peaks based on optimized daily rhythms',
  'medical-professional': 'During structured work periods with adequate recovery',
  'colleague': 'Collaborative periods with team energy alignment'
};

const supportStyles: Record<UserType, string> = {
  'brain-injury': 'Structured guidance with celebration of small wins',
  'cognitive-optimization': 'Data-driven insights with performance metrics',
  'empowerment': 'Goal-oriented coaching with leadership development',
  'brain-health': 'Holistic wellness approach with lifestyle integration',
  'caregiver': 'Compassionate support with self-care reminders',
  'wellness': 'Balanced approach with sustainable habit formation',
  'medical-professional': 'Evidence-based strategies with clinical relevance',
  'colleague': 'Collaborative learning with peer support networks'
};

const quickWins: Record<UserType, string> = {
  'brain-injury': 'Complete one small cognitive exercise daily',
  'cognitive-optimization': 'Implement a 10-minute morning focus routine',
  'empowerment': 'Set and achieve one meaningful micro-goal daily',
  'brain-health': 'Add one brain-healthy habit to your daily routine',
  'caregiver': 'Schedule 15 minutes of personal time each day',
  'wellness': 'Track one wellness metric consistently for a week',
  'medical-professional': 'Use evidence-based cognitive breaks between patients',
  'colleague': 'Share one cognitive wellness tip with a team member'
};
