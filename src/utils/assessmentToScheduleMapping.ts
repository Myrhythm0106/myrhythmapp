import { ExtractedAction } from './actionExtraction';
import { UserSchedulePreference } from './smartScheduler';

export interface AssessmentAnswers {
  'primary-challenge': string;
  'energy-level': string;
  'support-preference': string;
  'memory-challenges'?: string;
  'emotional-state'?: string;
  'daily-structure'?: string;
}

export interface ScheduleEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  feature: string;
  description: string;
  confidence: number;
  priority: 'high' | 'medium' | 'low';
  actionType: string;
}

/**
 * Maps assessment answers to user schedule preferences
 */
export function mapAssessmentToPreferences(answers: AssessmentAnswers): UserSchedulePreference {
  const energyLevel = answers['energy-level'];
  const supportPreference = answers['support-preference'];
  const dailyStructure = answers['daily-structure'] || 'moderate';
  
  // Map energy levels to productive hours
  const productiveHours = (() => {
    switch (energyLevel) {
      case 'high':
        return ['07:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
      case 'moderate':
        return ['08:00', '10:00', '11:00', '14:00', '15:00'];
      case 'low':
        return ['10:00', '11:00', '14:00', '15:00'];
      default:
        return ['09:00', '10:00', '14:00', '15:00'];
    }
  })();

  // Map energy levels to energy peaks
  const energyPeaks = (() => {
    switch (energyLevel) {
      case 'high':
        return ['morning', 'afternoon'];
      case 'moderate':
        return ['morning'];
      case 'low':
        return ['afternoon'];
      default:
        return ['morning'];
    }
  })();

  // Map support preference to session duration
  const preferredDuration = (() => {
    switch (supportPreference) {
      case 'independent':
        return 30;
      case 'guided':
        return 20;
      case 'collaborative':
        return 25;
      default:
        return 25;
    }
  })();

  return {
    productiveHours,
    energyPeaks,
    preferredDuration,
    dailyStructure,
    doNotDisturbTimes: ['12:00-13:00', '17:00-18:00'], // Standard meal times
    focusBlocks: energyLevel === 'high' ? ['09:00-11:00', '14:00-16:00'] : ['10:00-11:00', '14:00-15:00'],
    restPeriods: ['12:00-13:00', '16:00-16:30']
  };
}

/**
 * Generates schedule events from assessment recommendations
 */
export function generateScheduleFromAssessment(
  recommendations: string[], 
  answers: AssessmentAnswers,
  startDate: Date = new Date()
): ScheduleEvent[] {
  const preferences = mapAssessmentToPreferences(answers);
  const events: ScheduleEvent[] = [];
  
  // Generate events for the next 7 days
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + dayOffset);
    const dateString = date.toISOString().split('T')[0];
    
    // Create events for each recommendation
    recommendations.forEach((feature, index) => {
      const optimalTime = getOptimalTimeForFeature(feature, preferences, dayOffset);
      
      if (optimalTime && shouldScheduleOnDay(feature, dayOffset)) {
        const event: ScheduleEvent = {
          id: `${dateString}-${feature.toLowerCase().replace(/\s+/g, '-')}-${index}`,
          title: getFeatureActionTitle(feature),
          date: dateString,
          time: optimalTime,
          duration: getFeatureDuration(feature, answers),
          feature,
          description: getFeatureDescription(feature, answers),
          confidence: calculateEventConfidence(feature, preferences, dayOffset),
          priority: getFeaturePriority(feature, answers),
          actionType: getActionType(feature)
        };
        
        events.push(event);
      }
    });
  }
  
  return events.sort((a, b) => {
    // Sort by date first, then by confidence
    const dateCompare = a.date.localeCompare(b.date);
    if (dateCompare !== 0) return dateCompare;
    return b.confidence - a.confidence;
  });
}

/**
 * Gets optimal time slot for a feature based on preferences
 */
function getOptimalTimeForFeature(
  feature: string, 
  preferences: UserSchedulePreference, 
  dayIndex: number
): string | null {
  const timeMap: Record<string, string[]> = {
    'Memory Bridge': preferences.productiveHours.slice(0, 2),
    'Brain Games': preferences.productiveHours.slice(1, 3),
    'Gratitude': ['07:30', '08:00'], // Early morning
    'Calendar': preferences.productiveHours.slice(2, 4),
    'Daily Actions': ['07:00', '07:30'], // Very early morning
    'Support Network': ['16:00', '17:00'] // Late afternoon
  };
  
  const availableTimes = timeMap[feature] || preferences.productiveHours.slice(0, 2);
  
  // Rotate times based on day to create variety
  const timeIndex = dayIndex % availableTimes.length;
  return availableTimes[timeIndex];
}

/**
 * Determines if a feature should be scheduled on a given day
 */
function shouldScheduleOnDay(feature: string, dayIndex: number): boolean {
  // Schedule different features on different frequencies
  const scheduleMap: Record<string, number[]> = {
    'Memory Bridge': [0, 2, 4, 6], // Every other day
    'Brain Games': [1, 3, 5], // Alternate days
    'Gratitude': [0, 1, 2, 3, 4, 5, 6], // Daily
    'Calendar': [0, 2, 4], // 3 times a week
    'Daily Actions': [0, 1, 2, 3, 4], // Weekdays
    'Support Network': [1, 4, 6] // 3 times a week
  };
  
  return scheduleMap[feature]?.includes(dayIndex) ?? false;
}

/**
 * Gets the action title for a feature
 */
function getFeatureActionTitle(feature: string): string {
  const titleMap: Record<string, string> = {
    'Memory Bridge': 'Memory Strengthening Session',
    'Brain Games': 'Cognitive Training',
    'Gratitude': 'Daily Gratitude Practice',
    'Calendar': 'Planning & Organization',
    'Daily Actions': 'Intention Setting',
    'Support Network': 'Connection Time'
  };
  
  return titleMap[feature] || `${feature} Session`;
}

/**
 * Gets feature description based on assessment answers
 */
function getFeatureDescription(feature: string, answers: AssessmentAnswers): string {
  const challenge = answers['primary-challenge'];
  const energyLevel = answers['energy-level'];
  
  const descriptionMap: Record<string, string> = {
    'Memory Bridge': `Structured memory exercises${challenge === 'memory' ? ' focused on recall and retention' : ''}`,
    'Brain Games': `Cognitive training${challenge === 'focus' ? ' for attention and concentration' : ''}`,
    'Gratitude': 'Positive mindset practice to build resilience and emotional wellness',
    'Calendar': `Daily planning session${challenge === 'routine' ? ' to build consistent habits' : ''}`,
    'Daily Actions': `Morning intention setting${energyLevel === 'low' ? ' with gentle energy building' : ''}`,
    'Support Network': 'Connect with your support circle for encouragement and accountability'
  };
  
  return descriptionMap[feature] || `Personalized ${feature.toLowerCase()} session`;
}

/**
 * Gets duration for a feature based on assessment
 */
function getFeatureDuration(feature: string, answers: AssessmentAnswers): number {
  const energyLevel = answers['energy-level'];
  const supportPreference = answers['support-preference'];
  
  const baseDurations: Record<string, number> = {
    'Memory Bridge': 25,
    'Brain Games': 20,
    'Gratitude': 10,
    'Calendar': 15,
    'Daily Actions': 10,
    'Support Network': 20
  };
  
  let duration = baseDurations[feature] || 20;
  
  // Adjust based on energy level
  if (energyLevel === 'low') {
    duration = Math.max(10, duration - 5);
  } else if (energyLevel === 'high') {
    duration += 5;
  }
  
  // Adjust based on support preference
  if (supportPreference === 'guided') {
    duration = Math.max(10, duration - 5);
  }
  
  return duration;
}

/**
 * Calculates confidence score for an event
 */
function calculateEventConfidence(
  feature: string, 
  preferences: UserSchedulePreference, 
  dayIndex: number
): number {
  let confidence = 0.7; // Base confidence
  
  // Higher confidence for features that match energy patterns
  if (preferences.energyPeaks.includes('morning') && 
      ['Gratitude', 'Daily Actions'].includes(feature)) {
    confidence += 0.15;
  }
  
  if (preferences.energyPeaks.includes('afternoon') && 
      ['Brain Games', 'Memory Bridge'].includes(feature)) {
    confidence += 0.15;
  }
  
  // Higher confidence for structured users with planning features
  if (preferences.dailyStructure === 'very' && feature === 'Calendar') {
    confidence += 0.1;
  }
  
  // Vary confidence by day to create realistic scheduling
  const dayVariation = (dayIndex % 3) * 0.05;
  confidence += dayVariation;
  
  return Math.min(confidence, 0.95);
}

/**
 * Gets priority level for a feature
 */
function getFeaturePriority(feature: string, answers: AssessmentAnswers): 'high' | 'medium' | 'low' {
  const challenge = answers['primary-challenge'];
  
  // High priority for features that match primary challenge
  if (challenge === 'memory' && feature === 'Memory Bridge') return 'high';
  if (challenge === 'focus' && feature === 'Brain Games') return 'high';
  if (challenge === 'routine' && feature === 'Calendar') return 'high';
  if (challenge === 'wellbeing' && feature === 'Gratitude') return 'high';
  
  // Medium priority for supportive features
  if (['Daily Actions', 'Support Network'].includes(feature)) return 'medium';
  
  return 'low';
}

/**
 * Gets action type for categorization
 */
function getActionType(feature: string): string {
  const typeMap: Record<string, string> = {
    'Memory Bridge': 'cognitive-training',
    'Brain Games': 'cognitive-training',
    'Gratitude': 'wellness',
    'Calendar': 'planning',
    'Daily Actions': 'planning',
    'Support Network': 'social'
  };
  
  return typeMap[feature] || 'general';
}

/**
 * Converts a schedule event to an ExtractedAction format
 */
export function convertScheduleEventToAction(event: ScheduleEvent): ExtractedAction {
  return {
    id: event.id,
    text: `${event.title} - ${event.description}`,
    category: 'schedule' as const,
    priority: event.priority,
    actionType: event.actionType,
    suggestedTime: event.time,
    estimatedDuration: event.duration,
    isTimeSpecific: true,
    relationshipImpact: event.feature === 'Support Network' ? 'positive' : undefined,
    emotionalStakes: event.priority === 'high' ? 'high' : 'medium',
    intent: `Complete ${event.title.toLowerCase()}`,
    context: `Generated from assessment recommendations focusing on ${event.feature}`,
    confidence: event.confidence,
    extractedAt: new Date().toISOString(),
    status: 'confirmed'
  };
}