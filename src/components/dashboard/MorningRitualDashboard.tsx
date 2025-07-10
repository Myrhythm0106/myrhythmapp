
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sun, Cloud, CloudRain, Snowflake, Thermometer, Calendar, Target, Heart } from "lucide-react";
import { DailyIChooseWidget } from "./DailyIChooseWidget";
import { useUserData } from "@/hooks/use-user-data";
import { useSubscription } from "@/contexts/SubscriptionContext";

interface MorningRitualDashboardProps {
  onSetDailyIntention: (intention: string) => void;
  onEnergyLevelSet: (level: number) => void;
  onUpgradeClick?: () => void;
}

export function MorningRitualDashboard({ 
  onSetDailyIntention, 
  onEnergyLevelSet, 
  onUpgradeClick 
}: MorningRitualDashboardProps) {
  const userData = useUserData();
  const { hasFeature } = useSubscription();
  const [weather, setWeather] = useState({ temp: 72, condition: 'sunny', icon: Sun });
  const [energyLevel, setEnergyLevel] = useState<number | null>(null);
  const [dailyIntention, setDailyIntention] = useState('');
  const [todaysPriorities, setTodaysPriorities] = useState<string[]>([]);

  const greetingTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getPersonalizedPriorities = () => {
    const userType = userData.userType || 'wellness';
    const priorities = {
      'brain-injury': [
        'Take morning medication',
        'Complete gentle brain exercises',
        'Practice memory strategies',
        'Rest when needed'
      ],
      'caregiver': [
        'Check in with loved one',
        'Schedule personal self-care',
        'Prepare nutritious meals',
        'Connect with support network'
      ],
      'cognitive-optimization': [
        'Tackle most challenging task first',
        'Complete focused work blocks',
        'Review and optimize systems',
        'Plan tomorrow\'s priorities'
      ],
      'wellness': [
        'Morning movement or exercise',
        'Healthy breakfast and hydration',
        'Review goals and priorities',
        'Practice gratitude or meditation'
      ]
    };
    
    return priorities[userType] || priorities.wellness;
  };

  useEffect(() => {
    setTodaysPriorities(getPersonalizedPriorities());
    
    // Simulate weather data (in real app, would come from API)
    const conditions = [
      { temp: 72, condition: 'sunny', icon: Sun },
      { temp: 68, condition: 'cloudy', icon: Cloud },
      { temp: 65, condition: 'rainy', icon: CloudRain },
      { temp: 45, condition: 'snowy', icon: Snowflake }
    ];
    setWeather(conditions[Math.floor(Math.random() * conditions.length)]);
  }, [userData.userType]);

  const handleEnergyLevelSelect = (level: number) => {
    setEnergyLevel(level);
    onEnergyLevelSet(level);
    
    // Adjust today's priorities based on energy level
    if (level <= 2) {
      setTodaysPriorities(prev => prev.filter((_, index) => index < 2));
    }
  };

  const handleIntentionSet = () => {
    if (dailyIntention.trim()) {
      onSetDailyIntention(dailyIntention);
    }
  };

  const WeatherIcon = weather.icon;

  return (
    <div className="space-y-6">
      {/* Greeting & Weather */}
      <Card className="bg-gradient-to-r from-sunrise-orange-50 to-sunrise-orange-100 border-sunrise-orange-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-sunrise-orange-900">
                {greetingTime()}, {userData.name || 'there'}!
              </h1>
              <p className="text-sunrise-orange-700 mt-1">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="flex items-center gap-3 text-sunrise-orange-700">
              <WeatherIcon className="h-8 w-8" />
              <div className="text-right">
                <p className="text-2xl font-bold">{weather.temp}°F</p>
                <p className="text-sm capitalize">{weather.condition}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily #IChoose Statement */}
      <DailyIChooseWidget onUpgradeClick={onUpgradeClick} />

      {/* Energy Level Check-in */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-energy-600" />
            How's your energy today?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((level) => (
              <Button
                key={level}
                variant={energyLevel === level ? "default" : "outline"}
                onClick={() => handleEnergyLevelSelect(level)}
                className="h-16 flex flex-col items-center justify-center"
              >
                <span className="text-2xl mb-1">
                  {level === 1 ? '😴' : level === 2 ? '😊' : level === 3 ? '🙂' : level === 4 ? '😄' : '🚀'}
                </span>
                <span className="text-xs">{level}</span>
              </Button>
            ))}
          </div>
          {energyLevel && (
            <p className="text-sm text-muted-foreground mt-3 text-center">
              {energyLevel <= 2 && "Perfect! We'll keep today's plan gentle and achievable."}
              {energyLevel === 3 && "Great! You're ready for a balanced, productive day."}
              {energyLevel >= 4 && "Excellent! You're ready to tackle bigger challenges today."}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Today's Priorities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-focus-600" />
            Today's Personalized Priorities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {todaysPriorities.map((priority, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-focus-500 rounded-full"></div>
                <span className="text-sm">{priority}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Daily Intention Setting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-heart-600" />
            Today's Focus Intention
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <textarea
              value={dailyIntention}
              onChange={(e) => setDailyIntention(e.target.value)}
              placeholder="What's the one thing you want to focus on today? (e.g., 'I will approach challenges with patience and self-compassion')"
              className="w-full p-3 border rounded-lg resize-none"
              rows={3}
            />
            <Button 
              onClick={handleIntentionSet}
              disabled={!dailyIntention.trim()}
              className="w-full"
            >
              Set My Daily Intention
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
