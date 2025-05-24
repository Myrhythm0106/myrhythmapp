
import { format } from "date-fns";

export interface MoodChartDataPoint {
  day: string;
  value: number;
  mood?: string;
}

export const getChartData = (entries: any[]): MoodChartDataPoint[] => {
  // Process entries to create chart data
  const data = entries.map(entry => ({
    day: format(new Date(entry.date), "EEE"),
    value: entry.score,
    mood: entry.mood
  }));
  
  // Sort by date
  return data.reverse();
};

export const getMoodTrendInsight = (entries: any[]) => {
  if (entries.length < 3) return "Track more days to see insights.";
  
  const moodScores = entries.map(entry => entry.score);
  const avgScore = moodScores.reduce((a, b) => a + b, 0) / moodScores.length;
  
  if (avgScore > 2.5) {
    return "You've been having a good week overall! Your mood has been consistently positive.";
  } else if (avgScore > 1.5) {
    return "You've had a balanced week with ups and downs. This is a normal part of life's rhythm.";
  } else {
    return "This has been a challenging week for you. Remember that difficult periods are temporary.";
  }
};

export const getWeeklyRecommendations = (entries: any[]) => {
  if (entries.length < 3) return ["Log more days to get personalized recommendations"];
  
  const moodScores = entries.map(entry => entry.score);
  const avgScore = moodScores.reduce((a, b) => a + b, 0) / moodScores.length;
  
  if (avgScore > 2.5) {
    return [
      "Continue activities that have been working well this week",
      "Share your positive energy with others who might need support",
      "Document what's contributing to your positive mood"
    ];
  } else if (avgScore > 1.5) {
    return [
      "Build in daily moments of mindfulness or gratitude",
      "Ensure you're maintaining healthy sleep and exercise habits",
      "Connect with your support network regularly"
    ];
  } else {
    return [
      "Prioritize self-care and consider reducing commitments if possible",
      "Reach out to your support circle or consider professional support",
      "Keep track of small victories even on difficult days",
      "Remember that this period will pass"
    ];
  }
};

export const getMonthlyInsight = (entries: any[]) => {
  const greatDays = entries.filter(e => e.mood === "great").length;
  const okayDays = entries.filter(e => e.mood === "okay").length;
  const strugglingDays = entries.filter(e => e.mood === "struggling").length;
  
  const totalDays = entries.length;
  const greatPercentage = (greatDays / totalDays) * 100;
  
  if (greatPercentage > 60) {
    return "This month has been mostly positive for you. Whatever you're doing seems to be working well!";
  } else if (greatPercentage > 30) {
    return "You've had a mix of good days and challenges this month. This balance is a normal part of life.";
  } else {
    return "This month has presented more challenges than usual. Consider reviewing your self-care and support strategies.";
  }
};

export const getAverageMoodLabel = (entries: any[]) => {
  if (entries.length === 0) return "No data";
  
  const avgScore = entries.reduce((sum, entry) => sum + entry.score, 0) / entries.length;
  
  if (avgScore > 2.5) return "Good";
  if (avgScore > 1.5) return "Okay";
  return "Challenging";
};

export const getSuggestions = (mood: string) => {
  switch(mood) {
    case "great":
      return [
        "Maintain this positive energy by doing activities you enjoy",
        "Share your positive mood with others - positivity is contagious!",
        "Journal about what contributed to your good mood today"
      ];
    case "okay":
      return [
        "Take a short walk to boost your energy levels",
        "Practice 5 minutes of mindfulness or deep breathing",
        "Connect with a friend or family member"
      ];
    case "struggling":
      return [
        "Be gentle with yourself today and focus on self-care",
        "Try the 5-4-3-2-1 grounding technique (5 things you see, 4 you touch...)",
        "Consider sharing how you feel with someone you trust",
        "Remember: difficult feelings are temporary and will pass"
      ];
    default:
      return ["Log your mood to get personalized suggestions"];
  }
};
