// Brain-health benefit messages for reminders
// Based on neuroscience research on memory, motivation, and habit formation

export interface ReminderMotivation {
  id: string;
  category: 'medication' | 'appointment' | 'task' | 'exercise' | 'social' | 'self-care' | 'general';
  benefit: string;
  shortBenefit: string;
  source?: string;
}

export const reminderMotivations: ReminderMotivation[] = [
  // Medication reminders
  { id: 'med-1', category: 'medication', benefit: 'Taking medication on time helps maintain steady levels in your body, which supports optimal brain healing and function.', shortBenefit: 'Keeps your brain healing steadily', source: 'Neuropharmacology research' },
  { id: 'med-2', category: 'medication', benefit: 'Consistent medication timing can improve effectiveness by up to 40% compared to irregular dosing.', shortBenefit: 'Boosts medication effectiveness', source: 'Clinical studies' },
  { id: 'med-3', category: 'medication', benefit: 'Your brain creates stronger routine pathways when you take medication at the same time each day.', shortBenefit: 'Strengthens memory pathways' },
  { id: 'med-4', category: 'medication', benefit: 'Completing this task releases dopamine - your brain\'s reward chemical - which makes future remembering easier.', shortBenefit: 'Releases feel-good brain chemicals' },
  { id: 'med-5', category: 'medication', benefit: 'Each time you remember your medication, you\'re actively training your memory system.', shortBenefit: 'Trains your memory' },

  // Appointment reminders
  { id: 'apt-1', category: 'appointment', benefit: 'Arriving on time reduces stress hormones that can interfere with memory and clear thinking.', shortBenefit: 'Reduces stress on your brain' },
  { id: 'apt-2', category: 'appointment', benefit: 'Preparing ahead gives your brain time to process and remember important information from the appointment.', shortBenefit: 'Helps you remember more' },
  { id: 'apt-3', category: 'appointment', benefit: 'Being punctual builds trust and strengthens your relationships - both important for brain health.', shortBenefit: 'Builds trust and connections' },
  { id: 'apt-4', category: 'appointment', benefit: 'Medical appointments are investments in your recovery - each one moves you forward.', shortBenefit: 'Invests in your recovery' },
  { id: 'apt-5', category: 'appointment', benefit: 'Your healthcare team notices and appreciates your commitment to showing up.', shortBenefit: 'Shows your commitment' },

  // Task reminders
  { id: 'task-1', category: 'task', benefit: 'Completing tasks releases dopamine, which reinforces positive behavior patterns in your brain.', shortBenefit: 'Rewards your brain naturally' },
  { id: 'task-2', category: 'task', benefit: 'Each small task you complete builds confidence and strengthens executive function.', shortBenefit: 'Builds confidence' },
  { id: 'task-3', category: 'task', benefit: 'Breaking tasks into steps exercises your planning abilities - a key brain skill.', shortBenefit: 'Exercises planning skills' },
  { id: 'task-4', category: 'task', benefit: 'Checking off tasks reduces mental load, freeing up brain space for what matters most.', shortBenefit: 'Frees up brain space' },
  { id: 'task-5', category: 'task', benefit: 'Following through on commitments strengthens the neural pathways for reliability.', shortBenefit: 'Makes you more reliable' },
  { id: 'task-6', category: 'task', benefit: 'Your future self will thank you for taking care of this now.', shortBenefit: 'Future you says thanks' },
  { id: 'task-7', category: 'task', benefit: 'Every promise kept is a deposit in your trust account - with yourself and others.', shortBenefit: 'Builds self-trust' },

  // Exercise reminders
  { id: 'ex-1', category: 'exercise', benefit: 'Just 10 minutes of movement increases blood flow to your brain by 15%, boosting clarity and memory.', shortBenefit: 'Boosts brain blood flow' },
  { id: 'ex-2', category: 'exercise', benefit: 'Exercise releases BDNF - a protein that helps grow new brain cells and connections.', shortBenefit: 'Grows new brain cells' },
  { id: 'ex-3', category: 'exercise', benefit: 'Physical activity reduces inflammation that can slow brain healing.', shortBenefit: 'Supports brain healing' },
  { id: 'ex-4', category: 'exercise', benefit: 'Moving your body helps process emotions and reduce anxiety stored in your nervous system.', shortBenefit: 'Reduces anxiety' },
  { id: 'ex-5', category: 'exercise', benefit: 'Regular movement improves sleep quality, which is essential for memory consolidation.', shortBenefit: 'Improves sleep and memory' },

  // Social reminders
  { id: 'soc-1', category: 'social', benefit: 'Social connection activates your brain\'s reward centers and reduces harmful stress hormones.', shortBenefit: 'Activates reward centers' },
  { id: 'soc-2', category: 'social', benefit: 'Conversations exercise multiple brain areas simultaneously - language, emotion, and memory.', shortBenefit: 'Exercises your whole brain' },
  { id: 'soc-3', category: 'social', benefit: 'Maintaining relationships is one of the strongest predictors of brain health as we age.', shortBenefit: 'Protects long-term brain health' },
  { id: 'soc-4', category: 'social', benefit: 'People who care about you are rooting for your success right now.', shortBenefit: 'People are cheering for you' },
  { id: 'soc-5', category: 'social', benefit: 'Connection releases oxytocin, which helps with healing and emotional regulation.', shortBenefit: 'Releases healing hormones' },

  // Self-care reminders
  { id: 'care-1', category: 'self-care', benefit: 'Rest is not laziness - it\'s when your brain consolidates memories and heals.', shortBenefit: 'Rest helps your brain heal' },
  { id: 'care-2', category: 'self-care', benefit: 'Hydration improves cognitive performance - even mild dehydration reduces focus by 25%.', shortBenefit: 'Hydration boosts focus' },
  { id: 'care-3', category: 'self-care', benefit: 'Taking breaks prevents mental fatigue and actually improves productivity.', shortBenefit: 'Prevents burnout' },
  { id: 'care-4', category: 'self-care', benefit: 'Self-compassion activates the same brain areas as receiving care from others.', shortBenefit: 'Activates self-healing' },
  { id: 'care-5', category: 'self-care', benefit: 'Prioritizing yourself isn\'t selfish - you can\'t pour from an empty cup.', shortBenefit: 'Refills your energy' },

  // General reminders
  { id: 'gen-1', category: 'general', benefit: 'Every time you respond to a reminder, you\'re strengthening your memory systems.', shortBenefit: 'Strengthens memory' },
  { id: 'gen-2', category: 'general', benefit: 'Using reminders is a smart strategy - even the most successful people use external memory aids.', shortBenefit: 'Smart people use reminders' },
  { id: 'gen-3', category: 'general', benefit: 'Your brain is working hard for you - this reminder is your partner in that effort.', shortBenefit: 'Your brain\'s partner' },
  { id: 'gen-4', category: 'general', benefit: 'Completing this builds momentum - success breeds success in your brain\'s reward system.', shortBenefit: 'Builds momentum' },
  { id: 'gen-5', category: 'general', benefit: 'You\'re proving to yourself that you can follow through. That belief changes everything.', shortBenefit: 'Proves you can do it' },
  { id: 'gen-6', category: 'general', benefit: 'Small consistent actions create bigger changes than occasional heroic efforts.', shortBenefit: 'Small steps, big changes' },
  { id: 'gen-7', category: 'general', benefit: 'The fact that you set this reminder shows you\'re taking your goals seriously.', shortBenefit: 'Shows self-commitment' },
  { id: 'gen-8', category: 'general', benefit: 'Your future self is counting on present you. Don\'t let them down.', shortBenefit: 'Future you is counting on you' },
  { id: 'gen-9', category: 'general', benefit: 'This is you taking control. That feeling of agency is powerful for brain health.', shortBenefit: 'You\'re in control' },
  { id: 'gen-10', category: 'general', benefit: 'Every completed task is evidence that your brain is capable and reliable.', shortBenefit: 'Your brain is capable' },
];

// Escalation messages that get progressively more engaging
export const escalationMessages = [
  // Level 0 - Gentle
  { level: 0, messages: [
    "Just a friendly nudge about your upcoming task.",
    "Quick reminder - you've got this!",
    "A gentle heads up for you.",
    "Your future self scheduled this - they had good reasons!"
  ]},
  // Level 1 - Encouraging
  { level: 1, messages: [
    "Hey, this is still waiting for you. You can do it!",
    "Checking in - this task needs your attention.",
    "Don't forget - you set this reminder for a reason.",
    "Still time to complete this! Your brain will thank you."
  ]},
  // Level 2 - Motivational
  { level: 2, messages: [
    "This is important to you. Let's make it happen!",
    "Your commitment is being tested - show up for yourself!",
    "Remember why you set this. That reason still matters.",
    "You're stronger than procrastination. Prove it!"
  ]},
  // Level 3 - Urgent but supportive
  { level: 3, messages: [
    "Time is running short. Need help with this?",
    "This needs attention now. You've got support if needed.",
    "Almost missed! But you can still make this happen.",
    "Your support circle cares - they're ready to help if needed."
  ]}
];

// Pre-reminder messages (30 min before)
export const preReminderMessages = [
  "Coming up in 30 minutes: ",
  "Getting ready? You have ",
  "Heads up! In 30 minutes: ",
  "Preparing you for: ",
  "Soon on your schedule: "
];

// Celebration messages after completion
export const celebrationMessages = [
  "🎉 Amazing! You did it!",
  "✨ Promise kept! You're building trust.",
  "🌟 That's a win! Your brain thanks you.",
  "💪 Done! One more step toward your goals.",
  "🙌 Completed! You showed up for yourself.",
  "🎯 Nailed it! Streak growing stronger!",
  "⭐ Success! Your reliability is inspiring.",
  "🏆 Champion move! Keep this momentum going!"
];

// Get a random motivation for a category
export function getRandomMotivation(category?: string): ReminderMotivation {
  const filtered = category 
    ? reminderMotivations.filter(m => m.category === category || m.category === 'general')
    : reminderMotivations;
  return filtered[Math.floor(Math.random() * filtered.length)];
}

// Get escalation message by level
export function getEscalationMessage(level: number): string {
  const levelData = escalationMessages.find(e => e.level === Math.min(level, 3));
  const messages = levelData?.messages || escalationMessages[0].messages;
  return messages[Math.floor(Math.random() * messages.length)];
}

// Get pre-reminder prefix
export function getPreReminderPrefix(): string {
  return preReminderMessages[Math.floor(Math.random() * preReminderMessages.length)];
}

// Get celebration message
export function getCelebrationMessage(): string {
  return celebrationMessages[Math.floor(Math.random() * celebrationMessages.length)];
}
