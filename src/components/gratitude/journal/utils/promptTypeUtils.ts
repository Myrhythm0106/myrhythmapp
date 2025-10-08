
export const getPromptTypeColor = (type: string) => {
  switch (type) {
    case "fitness": return "bg-neural-blue-100 text-neural-blue-800 border border-neural-blue-200";
    case "mindfulness": return "bg-brain-health-100 text-brain-health-800 border border-brain-health-200";
    case "social": return "bg-neural-purple-100 text-neural-purple-800 border border-neural-purple-200";
    case "general": return "bg-brand-orange-100 text-brand-orange-800 border border-brand-orange-200";
    default: return "bg-neutral-100 text-neutral-800 border border-neutral-200";
  }
};

export const getPromptTypeIcon = (type: string) => {
  switch (type) {
    case "fitness": return "💪";
    case "mindfulness": return "🧘";
    case "social": return "👥";
    case "general": return "✨";
    default: return "📝";
  }
};
