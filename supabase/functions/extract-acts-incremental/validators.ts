export interface ValidationResult {
  isValid: boolean;
  score: number;
  issues: string[];
}

export interface ExtractedActionForValidation {
  action_text: string;
  action_type?: string;
  assigned_to?: string;
  due_context?: string;
  scheduled_date?: string;
  scheduled_time?: string;
  confidence_score?: number;
}

export function validateExtractedAction(action: ExtractedActionForValidation): ValidationResult {
  const issues: string[] = [];
  let score = 100;

  // 1. Check for fragments (double spaces, incomplete sentences)
  if (action.action_text.includes('  ') || action.action_text.trim().length < 10) {
    issues.push('Fragment or incomplete sentence detected');
    score -= 30;
  }

  // 2. Check for action verbs (must start with action word)
  const actionVerbs = [
    'call', 'email', 'schedule', 'send', 'review', 'check', 'update', 'create', 
    'follow', 'confirm', 'prepare', 'finalize', 'reach', 'contact', 'share',
    'discuss', 'meet', 'book', 'reserve', 'pay', 'submit', 'complete', 'order',
    'watch', 'mind', 'aware', 'notice', 'remember', 'note', 'keep', 'track'
  ];
  const firstWord = action.action_text.toLowerCase().split(' ')[0];
  if (!actionVerbs.some(verb => firstWord.includes(verb))) {
    issues.push('No clear action verb detected');
    score -= 25;
  }

  // 3. Check for invalid times (must be 00:00-23:59)
  if (action.scheduled_time) {
    const timeMatch = action.scheduled_time.match(/^(\d{1,2}):(\d{2})$/);
    if (!timeMatch) {
      issues.push('Invalid time format');
      score -= 20;
    } else {
      const hours = parseInt(timeMatch[1]);
      const minutes = parseInt(timeMatch[2]);
      if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        issues.push(`Invalid time: ${action.scheduled_time}`);
        score -= 20;
      }
    }
  }

  // 4. Check text length (too short or too long)
  if (action.action_text.length < 10) {
    issues.push('Action text too short');
    score -= 25;
  } else if (action.action_text.length > 200) {
    issues.push('Action text too long (should be concise)');
    score -= 10;
  }

  // 5. Check confidence score (if provided)
  if (action.confidence_score !== undefined && action.confidence_score < 0.85) {
    issues.push('Low extraction confidence');
    score -= 15;
  }

  // 6. Check for gibberish or special characters abuse
  const specialCharRatio = (action.action_text.match(/[^a-zA-Z0-9\s.,!?-]/g) || []).length / action.action_text.length;
  if (specialCharRatio > 0.3) {
    issues.push('Too many special characters');
    score -= 20;
  }

  // 7. Check for missing critical info for commitment actions
  if (action.action_type === 'commitment' && !action.due_context && !action.scheduled_date) {
    issues.push('Commitment missing due date information');
    score -= 10;
  }

  // Ensure score doesn't go below 0
  score = Math.max(0, score);

  return {
    isValid: score >= 70, // Actions with score < 70 are rejected
    score,
    issues
  };
}
