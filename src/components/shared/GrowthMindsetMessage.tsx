import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Heart, Trophy, TrendingUp } from 'lucide-react';

interface GrowthMindsetMessageProps {
  type: 'encouragement' | 'celebration' | 'progress' | 'resilience' | 'potential';
  context?: string;
  userName?: string;
}

const messages = {
  encouragement: [
    "Every step forward is progress worth celebrating! 🌟",
    "Your brain is incredibly resilient and constantly growing! 🧠✨",
    "Challenges are opportunities for your brain to get stronger! 💪",
    "You're building new neural pathways with every effort! 🌈",
    "Progress isn't always linear, and that's perfectly okay! 📈",
    "Your determination inspires everyone around you! 🌺"
  ],
  celebration: [
    "Amazing work! Your brain just grew a little stronger! 🎉",
    "You're proving that growth has no limits! 🚀",
    "Look how far you've come - that's pure determination! 👏",
    "Every achievement builds the foundation for the next! 🏆",
    "Your progress is inspiring others to believe in their potential! ✨",
    "You're rewriting what's possible every single day! 📝"
  ],
  progress: [
    "Your brain is actively rewiring itself for success! 🔄",
    "Each day brings new opportunities for growth! 🌅",
    "Small steps create extraordinary transformations! 👣",
    "You're building resilience with every challenge you face! 🛡️",
    "Progress is happening even when you can't see it! 🌱",
    "Your consistency is creating powerful change! ⚡"
  ],
  resilience: [
    "Setbacks are setups for incredible comebacks! 🌊",
    "Your ability to adapt and overcome is remarkable! 🦋",
    "Every challenge you face makes you stronger than before! 💎",
    "You're not just surviving, you're thriving! 🌟",
    "Resilience is your superpower, and you have it in abundance! 🦸",
    "Difficult days become wisdom for easier tomorrows! 🌈"
  ],
  potential: [
    "Your potential is limitless and constantly expanding! ♾️",
    "The best version of you is always just beginning! 🌅",
    "You have everything within you to achieve amazing things! 💫",
    "Your journey is unique and incredibly valuable! 🗺️",
    "You're not just healing, you're discovering new strengths! 🔍",
    "Every day you're becoming more of who you're meant to be! 🌸"
  ]
};

const icons = {
  encouragement: Heart,
  celebration: Trophy,
  progress: TrendingUp,
  resilience: Sparkles,
  potential: Sparkles
};

const colors = {
  encouragement: 'bg-pink-100 text-pink-800 border-pink-200',
  celebration: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  progress: 'bg-blue-100 text-blue-800 border-blue-200',
  resilience: 'bg-purple-100 text-purple-800 border-purple-200',
  potential: 'bg-green-100 text-green-800 border-green-200'
};

export function GrowthMindsetMessage({ type, context, userName }: GrowthMindsetMessageProps) {
  const messageArray = messages[type];
  const randomMessage = messageArray[Math.floor(Math.random() * messageArray.length)];
  const Icon = icons[type];
  const colorClass = colors[type];

  // Personalize message if userName is provided
  const personalizedMessage = userName 
    ? randomMessage.replace(/You're|Your|You/g, (match) => {
        switch(match) {
          case "You're": return `${userName}, you're`;
          case "Your": return `${userName}, your`;
          case "You": return userName;
          default: return match;
        }
      })
    : randomMessage;

  return (
    <Badge 
      variant="outline" 
      className={`${colorClass} p-3 text-sm font-medium flex items-center gap-2 w-full justify-center text-center border-2`}
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      <span>{personalizedMessage}</span>
    </Badge>
  );
}