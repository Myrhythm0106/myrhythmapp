
// Centralized mapping of empowering terms to plain explanations
// Hover/tap any empowering term to see its SMART explanation

export interface TermDefinition {
  empowering: string;
  plain: string;
}

export const empoweringGlossary: Record<string, TermDefinition> = {
  // Status Terms
  "Victory Achieved": {
    empowering: "Victory Achieved! 🎉",
    plain: "Task completed successfully"
  },
  "Building Momentum": {
    empowering: "Building Momentum 🚀",
    plain: "Task is currently in progress"
  },
  "Ready to Conquer": {
    empowering: "Ready to Conquer",
    plain: "Task is ready to start"
  },
  "On Your Radar": {
    empowering: "On Your Radar",
    plain: "Task is scheduled for later"
  },
  "Paused for Now": {
    empowering: "Paused for Now",
    plain: "Task is temporarily on hold"
  },
  
  // Priority Terms
  "Power Focus": {
    empowering: "Power Focus",
    plain: "High priority - do this first"
  },
  "Growth Zone": {
    empowering: "Growth Zone",
    plain: "Medium priority - important but not urgent"
  },
  "Steady Progress": {
    empowering: "Steady Progress",
    plain: "Lower priority - complete when time allows"
  },
  
  // Dashboard Terms
  "Command Center": {
    empowering: "Command Center",
    plain: "Your main dashboard"
  },
  "Immediate Focus": {
    empowering: "Immediate Focus",
    plain: "Your most important task right now"
  },
  "Today's Victories": {
    empowering: "Today's Victories",
    plain: "Tasks to complete today"
  },
  "Weekly Wins": {
    empowering: "Weekly Wins",
    plain: "This week's goals and tasks"
  },
  "Monthly Milestones": {
    empowering: "Monthly Milestones",
    plain: "Goals for this month"
  },
  "Yearly Vision": {
    empowering: "Yearly Vision",
    plain: "Your long-term goals for the year"
  },
  
  // Action Terms
  "Claim Your Time": {
    empowering: "Claim Your Time",
    plain: "Schedule this task"
  },
  "Mark Victory": {
    empowering: "Mark Victory",
    plain: "Mark as complete"
  },
  "Support Circle": {
    empowering: "Support Circle",
    plain: "People who help and support you"
  },
  "Watchers": {
    empowering: "Watchers",
    plain: "People notified about your progress"
  },
  
  // Progress Terms
  "Momentum Streak": {
    empowering: "Momentum Streak 🔥",
    plain: "Consecutive days of completed tasks"
  },
  "Completion Rate": {
    empowering: "Completion Rate",
    plain: "Percentage of tasks finished"
  },
  "Peak Performance": {
    empowering: "Peak Performance",
    plain: "Your most productive time of day"
  },
  
  // Encouragement Terms
  "You're Unstoppable": {
    empowering: "You're Unstoppable! 💪",
    plain: "Great job - you're making excellent progress"
  },
  "Keep Building": {
    empowering: "Keep Building",
    plain: "Continue with your current tasks"
  },
  "Every Step Counts": {
    empowering: "Every Step Counts",
    plain: "All progress matters, no matter how small"
  },
  
  // Empty States
  "Power Hub Awaits": {
    empowering: "Your Power Hub Awaits! 🌟",
    plain: "No tasks yet - add your first one"
  },
  "Fresh Start": {
    empowering: "Fresh Start",
    plain: "Begin something new"
  },
  
  // Calendar Terms
  "Time Blocked": {
    empowering: "Time Blocked",
    plain: "Scheduled in your calendar"
  },
  "Priority Flow": {
    empowering: "Priority Flow",
    plain: "How your priorities connect across timeframes"
  },
  
// Recording Terms
  "Memory Bridge": {
    empowering: "Memory Bridge",
    plain: "Voice recording feature for capturing conversations"
  },
  "Action Extraction": {
    empowering: "Action Extraction",
    plain: "AI finds tasks from your recordings"
  },
  
  // Journey Terms
  "Launch Your Journey": {
    empowering: "Launch Your Journey 🚀",
    plain: "Getting started with the app"
  },
  "Discover Your Identity": {
    empowering: "Discover Your Identity 👤",
    plain: "Setting up your user profile"
  },
  "Choose Your Path": {
    empowering: "Choose Your Path 🛤️",
    plain: "Selecting guided or explorer mode"
  },
  "Build Your Rhythm Profile": {
    empowering: "Build Your Rhythm Profile 🧠",
    plain: "Completing the cognitive assessment"
  },
  "Build Your Foundation": {
    empowering: "Build Your Foundation 💪",
    plain: "Setting up your support network"
  },
  "Activate Your Voice": {
    empowering: "Activate Your Voice 🎤",
    plain: "Making your first voice recording"
  },
  "Claim Your First Victory": {
    empowering: "Claim Your First Victory 🏆",
    plain: "Completing your first scheduled action"
  }
};

// Helper function to get plain text for an empowering term
export const getPlainText = (empoweringTerm: string): string | null => {
  const entry = empoweringGlossary[empoweringTerm];
  return entry?.plain || null;
};

// Helper to check if a term exists in glossary
export const hasGlossaryEntry = (term: string): boolean => {
  return term in empoweringGlossary;
};

// Get all terms for a category (useful for documentation)
export const getTermsByCategory = (category: string): TermDefinition[] => {
  const categoryMap: Record<string, string[]> = {
    status: ["Victory Achieved", "Building Momentum", "Ready to Conquer", "On Your Radar", "Paused for Now"],
    priority: ["Power Focus", "Growth Zone", "Steady Progress"],
    dashboard: ["Command Center", "Immediate Focus", "Today's Victories", "Weekly Wins", "Monthly Milestones", "Yearly Vision"],
    actions: ["Claim Your Time", "Mark Victory", "Support Circle", "Watchers"],
    progress: ["Momentum Streak", "Completion Rate", "Peak Performance"],
    encouragement: ["You're Unstoppable", "Keep Building", "Every Step Counts"],
    empty: ["Power Hub Awaits", "Fresh Start"],
    calendar: ["Time Blocked", "Priority Flow"],
    recording: ["Memory Bridge", "Action Extraction"]
  };
  
  const terms = categoryMap[category] || [];
  return terms.map(term => empoweringGlossary[term]).filter(Boolean);
};
