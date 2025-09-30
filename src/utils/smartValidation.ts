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
  verbCategory?: string;
  confidenceLevel?: 'high' | 'medium' | 'low';
}

export function analyzeSMART(action: {
  action_text: string;
  assigned_to?: string;
  start_date?: string;
  end_date?: string;
  priority_level?: number;
  relationship_impact?: string;
  verb_category?: string;
  completion_criteria_specific?: string;
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
  
  // Determine confidence level based on score
  let confidenceLevel: 'high' | 'medium' | 'low' = 'low';
  if (score >= 80) confidenceLevel = 'high';
  else if (score >= 60) confidenceLevel = 'medium';

  return { score, criteria, suggestions, verbCategory: action.verb_category, confidenceLevel };
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
  const verbCategory = action.verb_category || '';
  const actionText = action.action_text.toLowerCase();

  if (!criteria.specific) {
    // Provide verb-category specific suggestions
    if (verbCategory === 'COMMUNICATION' || actionText.includes('call') || actionText.includes('email')) {
      suggestions.push("Add specific contact details: Who exactly will you call/email? Include their full name, role, and phone/email if available.");
    } else if (verbCategory === 'MEDICAL' || actionText.includes('doctor') || actionText.includes('appointment')) {
      suggestions.push("Specify the healthcare provider's name, clinic/hospital, and what the appointment is for.");
    } else if (verbCategory === 'PLANNING' || actionText.includes('create') || actionText.includes('prepare')) {
      suggestions.push("Define exactly what you'll create/prepare: What format? How long? What sections?");
    } else {
      suggestions.push("Add more specific details: Who exactly is involved? What specific thing will you do?");
    }
  }

  if (!criteria.measurable) {
    if (verbCategory === 'COMMUNICATION') {
      suggestions.push("Define what a successful interaction looks like: e.g., 'when I've received their confirmation/response'");
    } else if (verbCategory === 'COMPLETION') {
      suggestions.push("Specify the final deliverable: What does 'complete' mean? What will exist when you're done?");
    } else {
      suggestions.push("Add a clear outcome: How will you know this is complete? What will be different?");
    }
  }

  if (!criteria.achievable) {
    if (action.priority_level === 1) {
      suggestions.push("This is high priority - break it down into smaller steps to make it more manageable.");
    } else {
      suggestions.push("Consider: Do you have everything you need to complete this? Add 'If stuck' guidance.");
    }
  }

  if (!criteria.relevant) {
    suggestions.push("Add context: Why is this important? How does it connect to your goals or wellbeing?");
  }

  if (!criteria.timeBound) {
    if (actionText.includes('urgent') || actionText.includes('asap') || action.priority_level === 1) {
      suggestions.push("High priority but no deadline! Add target date: 'by tomorrow' or 'within 24 hours'");
    } else if (verbCategory === 'MEDICAL') {
      suggestions.push("Medical actions need clear timing. Add: 'by [specific date]' or 'within [timeframe]'");
    } else {
      suggestions.push("Add a target date: When will you start? When should it be done?");
    }
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