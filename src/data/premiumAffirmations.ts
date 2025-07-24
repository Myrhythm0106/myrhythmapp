
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
    text: 'I choose to celebrate my victories, no matter how small',
    category: 'celebration',
    theme: 'strength',
    userType: 'brain-injury',
    tier: 'free',
    tags: ['victory', 'progress', 'celebration']
  },
  {
    id: 'free-3',
    text: 'I choose to focus my mental energy on what matters most',
    category: 'focus',
    theme: 'wisdom',
    userType: 'wellness',
    tier: 'free',
    tags: ['focus', 'priorities', 'clarity']
  }
];

const premiumStatements: PremiumIChooseStatement[] = [
  {
    id: 'premium-1',
    text: 'I choose to transform every challenge into an opportunity for exponential growth',
    category: 'transformation',
    theme: 'growth',
    userType: 'wellness',
    tier: 'premium',
    tags: ['transformation', 'growth', 'challenge']
  },
  // Add more premium statements as needed
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
