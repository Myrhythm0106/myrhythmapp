import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserType } from "@/types/user";

interface EncouragementEngineProps {
  userType: UserType;
  currentStreak: number;
  mood: 'great' | 'okay' | 'struggling';
}

export function EncouragementEngine({ userType, currentStreak, mood }: EncouragementEngineProps) {
  const [encouragement, setEncouragement] = useState("");

  useEffect(() => {
    // Simulate fetching encouragement based on user type, streak, and mood
    const fetchEncouragement = async () => {
      let message = "Keep up the great work!";

      if (userType === "brain-injury") {
        message = "Every step is a victory. You're doing amazing!";
      } else if (userType === "caregiver") {
        message = "Your dedication makes a world of difference.";
      }

      if (mood === 'struggling') {
        message = "It's okay to have tough days. Remember your strength.";
      }

      if (currentStreak > 30) {
        message += " Your consistency is truly inspiring!";
      }

      setEncouragement(message);
    };

    fetchEncouragement();
  }, [userType, currentStreak, mood]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>A Word of Encouragement</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg">{encouragement}</p>
        <Button className="mt-4">Get Inspired</Button>
      </CardContent>
    </Card>
  );
}
