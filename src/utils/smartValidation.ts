export interface SMARTCriteria {
  specific: boolean;
  measurable: boolean;
  achievable: boolean;
  relevant: boolean;
  timeBound: boolean;
}

export interface SMARTAnalysis {
  score: number; // 0-100
  criteria: SMARTCriteria;
  suggestions: string[];
}

export function analyzeSMART(action: {
  action_text: string;
  assigned_to?: string;
  start_date?: string;
  end_date?: string;
  priority_level?: number;
  relationship_impact?: string;
}): SMARTAnalysis {
  const criteria: SMARTCriteria = {
    specific: isSpecific(action.action_text),
    measurable: isMeasurable(action.action_text),
    achievable: isAchievable(action.action_text, action.relationship_impact),
    relevant: isRelevant(action.action_text, action.relationship_impact),
    timeBound: isTimeBound(action.start_date, action.end_date)
  };

  const score = Object.values(criteria).filter(Boolean).length * 20;
  const suggestions = generateSuggestions(criteria, action);

  return { score, criteria, suggestions };
}

function isSpecific(actionText: string): boolean {
  // Check for specific action words and clear objectives
  const specificWords = ['complete', 'create', 'send', 'call', 'meet', 'review', 'deliver', 'schedule', 'book', 'arrange'];
  const hasSpecificWords = specificWords.some(word => actionText.toLowerCase().includes(word));
  const hasDetails = actionText.length > 10 && actionText.includes(' ');
  
  return hasSpecificWords || hasDetails;
}

function isMeasurable(actionText: string): boolean {
  // Look for quantifiable elements
  const measurableIndicators = /\d+|all|complete|finish|by|until|percentage|%|hours|minutes|days|weeks/i;
  return measurableIndicators.test(actionText);
}

function isAchievable(actionText: string, context?: string): boolean {
  // Basic achievability check - avoid unrealistic words
  const unrealisticWords = ['impossible', 'never', 'always', 'perfect', 'everything'];
  const hasUnrealistic = unrealisticWords.some(word => actionText.toLowerCase().includes(word));
  
  return !hasUnrealistic && (context ? context.length > 0 : true);
}

function isRelevant(actionText: string, context?: string): boolean {
  // Check if there's context or purpose
  return Boolean(context && context.length > 0) || actionText.length > 15;
}

function isTimeBound(startDate?: string, endDate?: string): boolean {
  return Boolean(startDate || endDate);
}

function generateSuggestions(criteria: SMARTCriteria, action: any): string[] {
  const suggestions: string[] = [];

  if (!criteria.specific) {
    suggestions.push("Add more specific details about what exactly needs to be done");
  }
  
  if (!criteria.measurable) {
    suggestions.push("Include how you'll know when it's complete (quantity, quality, or deadline)");
  }
  
  if (!criteria.achievable) {
    suggestions.push("Consider if this can realistically be accomplished with available resources");
  }
  
  if (!criteria.relevant) {
    suggestions.push("Add context about why this matters or how it connects to your goals");
  }
  
  if (!criteria.timeBound) {
    suggestions.push("Set a specific start date or deadline for this action");
  }

  return suggestions;
}

export function getSMARTColor(score: number): string {
  if (score >= 80) return 'bg-green-500/10 text-green-700 border-green-200';
  if (score >= 60) return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
  if (score >= 40) return 'bg-orange-500/10 text-orange-700 border-orange-200';
  return 'bg-red-500/10 text-red-700 border-red-200';
}

export function getSMARTLabel(score: number): string {
  if (score >= 80) return 'SMART Ready';
  if (score >= 60) return 'Nearly SMART';
  if (score >= 40) return 'Needs Work';
  return 'Not SMART';
}