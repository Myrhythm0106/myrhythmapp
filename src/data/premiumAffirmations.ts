
export interface PremiumIChooseStatement {
  id: string;
  text: string;
  category: string;
  theme: 'courage' | 'growth' | 'love' | 'strength' | 'balance' | 'wisdom';
  userType: string;
  tier: 'free' | 'premium';
  mood?: 'great' | 'okay' | 'struggling';
  tags: string[];
}

const freeStatements: PremiumIChooseStatement[] = [
  // Thought-provoking statements
  {
    id: 'free-1',
    text: 'I choose to honor my brain\'s healing journey with gentle patience',
    category: 'healing',
    theme: 'courage',
    userType: 'brain-injury',
    tier: 'free',
    tags: ['healing', 'patience', 'self-compassion']
  },
  {
    id: 'free-2',
    text: 'I choose to question what limits me and expand beyond those boundaries',
    category: 'reflection',
    theme: 'growth',
    userType: 'wellness',
    tier: 'free',
    tags: ['reflect', 'boundaries', 'expansion']
  },
  {
    id: 'free-3',
    text: 'I choose to see setbacks as setups for my greatest comebacks',
    category: 'resilience',
    theme: 'strength',
    userType: 'wellness',
    tier: 'free',
    tags: ['inspire', 'resilience', 'comeback']
  },
  // Motivating statements
  {
    id: 'free-4',
    text: 'I choose to celebrate my victories, no matter how small',
    category: 'celebration',
    theme: 'strength',
    userType: 'brain-injury',
    tier: 'free',
    tags: ['victory', 'progress', 'celebration']
  },
  {
    id: 'free-5',
    text: 'I choose to fuel my dreams with consistent daily actions',
    category: 'action',
    theme: 'growth',
    userType: 'wellness',
    tier: 'free',
    tags: ['motivate', 'dreams', 'consistency']
  },
  {
    id: 'free-6',
    text: 'I choose to turn my pain into power and my struggles into strength',
    category: 'transformation',
    theme: 'courage',
    userType: 'wellness',
    tier: 'free',
    tags: ['motivate', 'transformation', 'strength']
  },
  // Encouraging statements
  {
    id: 'free-7',
    text: 'I choose to focus my mental energy on what matters most',
    category: 'focus',
    theme: 'wisdom',
    userType: 'wellness',
    tier: 'free',
    tags: ['focus', 'priorities', 'clarity']
  },
  {
    id: 'free-8',
    text: 'I choose to trust my journey, even when the path isn\'t clear',
    category: 'trust',
    theme: 'balance',
    userType: 'wellness',
    tier: 'free',
    tags: ['encourage', 'trust', 'journey']
  },
  {
    id: 'free-9',
    text: 'I choose to be patient with my progress while persistent in my efforts',
    category: 'patience',
    theme: 'balance',
    userType: 'brain-injury',
    tier: 'free',
    tags: ['encourage', 'patience', 'persistence']
  },
  // Inspiring statements
  {
    id: 'free-10',
    text: 'I choose to let my authenticity be my greatest superpower',
    category: 'authenticity',
    theme: 'love',
    userType: 'wellness',
    tier: 'free',
    tags: ['inspire', 'authenticity', 'power']
  },
  {
    id: 'free-11',
    text: 'I choose to plant seeds of kindness that will bloom in unexpected places',
    category: 'kindness',
    theme: 'love',
    userType: 'wellness',
    tier: 'free',
    tags: ['inspire', 'kindness', 'connection']
  },
  {
    id: 'free-12',
    text: 'I choose to rise above my circumstances and create my own weather',
    category: 'empowerment',
    theme: 'courage',
    userType: 'wellness',
    tier: 'free',
    tags: ['inspire', 'empowerment', 'creation']
  },
  // Growth-focused statements
  {
    id: 'free-13',
    text: 'I choose to embrace discomfort as the price of admission to my next level',
    category: 'growth',
    theme: 'growth',
    userType: 'wellness',
    tier: 'free',
    tags: ['growth', 'discomfort', 'evolution']
  },
  {
    id: 'free-14',
    text: 'I choose to learn from every experience and let wisdom guide my steps',
    category: 'learning',
    theme: 'wisdom',
    userType: 'wellness',
    tier: 'free',
    tags: ['growth', 'learning', 'wisdom']
  },
  {
    id: 'free-15',
    text: 'I choose to honor my recovery by celebrating each small victory',
    category: 'recovery',
    theme: 'strength',
    userType: 'brain-injury',
    tier: 'free',
    tags: ['growth', 'recovery', 'celebration']
  }
];

const premiumStatements: PremiumIChooseStatement[] = [
  // Advanced thought-provoking statements
  {
    id: 'premium-1',
    text: 'I choose to transform every challenge into an opportunity for exponential growth',
    category: 'transformation',
    theme: 'growth',
    userType: 'wellness',
    tier: 'premium',
    tags: ['transformation', 'growth', 'challenge']
  },
  {
    id: 'premium-2',
    text: 'I choose to rewrite the stories that no longer serve my highest potential',
    category: 'transformation',
    theme: 'courage',
    userType: 'wellness',
    tier: 'premium',
    tags: ['reflect', 'stories', 'potential']
  },
  {
    id: 'premium-3',
    text: 'I choose to dance with uncertainty and find grace in the unknown',
    category: 'acceptance',
    theme: 'balance',
    userType: 'wellness',
    tier: 'premium',
    tags: ['reflect', 'uncertainty', 'grace']
  },
  // Advanced motivating statements
  {
    id: 'premium-4',
    text: 'I choose to be the architect of my dreams and the engineer of my reality',
    category: 'creation',
    theme: 'strength',
    userType: 'wellness',
    tier: 'premium',
    tags: ['motivate', 'creation', 'dreams']
  },
  {
    id: 'premium-5',
    text: 'I choose to harness my setbacks as fuel for my unstoppable comeback',
    category: 'resilience',
    theme: 'courage',
    userType: 'wellness',
    tier: 'premium',
    tags: ['motivate', 'resilience', 'comeback']
  },
  {
    id: 'premium-6',
    text: 'I choose to let my recovery journey inspire others to believe in miracles',
    category: 'inspiration',
    theme: 'love',
    userType: 'brain-injury',
    tier: 'premium',
    tags: ['motivate', 'recovery', 'inspiration']
  },
  // Advanced encouraging statements
  {
    id: 'premium-7',
    text: 'I choose to trust that my brain\'s healing happens in perfect divine timing',
    category: 'trust',
    theme: 'wisdom',
    userType: 'brain-injury',
    tier: 'premium',
    tags: ['encourage', 'trust', 'healing']
  },
  {
    id: 'premium-8',
    text: 'I choose to see my sensitivity as a superpower that connects me to life\'s beauty',
    category: 'sensitivity',
    theme: 'love',
    userType: 'wellness',
    tier: 'premium',
    tags: ['encourage', 'sensitivity', 'connection']
  },
  {
    id: 'premium-9',
    text: 'I choose to honor my unique pace while celebrating every forward step',
    category: 'pace',
    theme: 'balance',
    userType: 'brain-injury',
    tier: 'premium',
    tags: ['encourage', 'pace', 'progress']
  },
  // Advanced inspiring statements
  {
    id: 'premium-10',
    text: 'I choose to be a lighthouse of hope in a world that sometimes feels dark',
    category: 'hope',
    theme: 'love',
    userType: 'wellness',
    tier: 'premium',
    tags: ['inspire', 'hope', 'light']
  },
  {
    id: 'premium-11',
    text: 'I choose to let my scars become constellations that guide others home',
    category: 'healing',
    theme: 'wisdom',
    userType: 'wellness',
    tier: 'premium',
    tags: ['inspire', 'healing', 'guidance']
  },
  {
    id: 'premium-12',
    text: 'I choose to transform my wound into wisdom and my mess into my message',
    category: 'transformation',
    theme: 'wisdom',
    userType: 'wellness',
    tier: 'premium',
    tags: ['inspire', 'transformation', 'wisdom']
  },
  // Advanced growth statements
  {
    id: 'premium-13',
    text: 'I choose to alchemize my pain into purpose and my tests into testimonies',
    category: 'purpose',
    theme: 'growth',
    userType: 'wellness',
    tier: 'premium',
    tags: ['growth', 'purpose', 'transformation']
  },
  {
    id: 'premium-14',
    text: 'I choose to expand beyond my comfort zone and into my greatness zone',
    category: 'expansion',
    theme: 'courage',
    userType: 'wellness',
    tier: 'premium',
    tags: ['growth', 'expansion', 'greatness']
  },
  {
    id: 'premium-15',
    text: 'I choose to let my recovery be a masterpiece painted with courage and love',
    category: 'recovery',
    theme: 'love',
    userType: 'brain-injury',
    tier: 'premium',
    tags: ['growth', 'recovery', 'masterpiece']
  }
];

export function getRandomIChooseStatement(
  userType: string = 'wellness',
  hasPremium: boolean = false,
  mood?: 'great' | 'okay' | 'struggling',
  excludeIds: string[] = [],
  monthlyTheme?: string
): PremiumIChooseStatement | null {
  let availableStatements = [...freeStatements];
  
  if (hasPremium) {
    availableStatements = [...freeStatements, ...premiumStatements];
  }

  // Filter by user type and exclude used statements
  availableStatements = availableStatements
    .filter(s => s.userType === userType || s.userType === 'wellness')
    .filter(s => !excludeIds.includes(s.id));

  // If monthly theme is provided, prioritize statements that align with the theme
  if (monthlyTheme) {
    const themeAlignedStatements = availableStatements.filter(s => 
      s.tags.some(tag => 
        tag.toLowerCase().includes(monthlyTheme.toLowerCase()) ||
        s.theme.toLowerCase().includes(monthlyTheme.toLowerCase()) ||
        s.category.toLowerCase().includes(monthlyTheme.toLowerCase())
      )
    );
    
    if (themeAlignedStatements.length > 0) {
      availableStatements = themeAlignedStatements;
    }
  }

  if (availableStatements.length === 0) {
    return null;
  }

  // Random selection
  const randomIndex = Math.floor(Math.random() * availableStatements.length);
  return availableStatements[randomIndex];
}
