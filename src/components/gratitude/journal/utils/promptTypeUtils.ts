
export const getPromptTypeColor = (type: string) => {
  switch (type) {
    case "fitness": return "bg-blue-100 text-blue-800";
    case "mindfulness": return "bg-green-100 text-green-800";
    case "social": return "bg-purple-100 text-purple-800";
    case "general": return "bg-amber-100 text-amber-800";
    default: return "bg-gray-100 text-gray-800";
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
