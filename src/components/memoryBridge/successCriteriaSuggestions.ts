/**
 * Suggested "I'll know I'm done when…" criteria.
 * Pure keyword matching — instant, offline-safe, no AI call.
 */

const FALLBACK = [
  "I've finished it and ticked it off",
  "I've told one person it's done",
  "I've written down what happened next"
];

interface Rule {
  test: RegExp;
  criteria: string[];
}

const RULES: Rule[] = [
  {
    test: /\b(call|phone|ring|email|e-mail|text|message|speak|talk|contact|chase)\b/i,
    criteria: [
      "I've spoken to them and noted what we agreed",
      "I've had a reply back from them",
      "I've left a message and set a day to try again"
    ]
  },
  {
    test: /\b(appointment|book|booking|schedule|arrange|reschedule|visit|clinic|gp|doctor|consultant)\b/i,
    criteria: [
      "The date is confirmed and in my calendar",
      "I have the time, place and who I'm seeing written down",
      "I've set a reminder the day before"
    ]
  },
  {
    test: /\b(write|draft|prepare|create|make|build|plan|design|note)\b/i,
    criteria: [
      "The draft is finished and saved",
      "I've read it once through and I'm happy with it",
      "It's ready for someone else to look at"
    ]
  },
  {
    test: /\b(send|share|submit|upload|post|forward|reply)\b/i,
    criteria: [
      "It's sent and I've had a reply",
      "I can see it in my sent items",
      "The other person has confirmed they got it"
    ]
  },
  {
    test: /\b(pay|bill|invoice|order|buy|purchase|renew|form|apply|application)\b/i,
    criteria: [
      "It's paid or submitted and I have the confirmation",
      "I've saved the receipt or reference number",
      "Nothing else is outstanding on it"
    ]
  },
  {
    test: /\b(medication|medicine|tablets|prescription|exercise|walk|rest|sleep|therapy|physio)\b/i,
    criteria: [
      "I've done it and logged how I felt afterwards",
      "I've done it every day this week as planned",
      "I've noticed what helped and what didn't"
    ]
  },
  {
    test: /\b(review|check|read|research|look|find|compare|decide)\b/i,
    criteria: [
      "I've been through it and made my decision",
      "I've written down the two or three things that matter",
      "I know what my next step is"
    ]
  },
  {
    test: /\b(meet|meeting|catch up|visit|see)\b/i,
    criteria: [
      "We've met and I've captured what we agreed",
      "The next date is in my calendar",
      "I've shared the notes with whoever needs them"
    ]
  }
];

export function getSuccessCriteriaSuggestions(actionText: string | undefined | null): string[] {
  const text = (actionText || '').trim();
  if (!text) return FALLBACK;

  const matched: string[] = [];
  for (const rule of RULES) {
    if (rule.test.test(text)) {
      matched.push(...rule.criteria);
    }
    if (matched.length >= 4) break;
  }

  const combined = [...matched, ...FALLBACK];
  const unique = Array.from(new Set(combined));
  return unique.slice(0, 4);
}
