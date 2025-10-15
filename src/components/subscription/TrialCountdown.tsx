import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TrialCountdownProps {
  trialEndDate: Date;
  onUpgrade?: () => void;
}

export function TrialCountdown({ trialEndDate, onUpgrade }: TrialCountdownProps) {
  const navigate = useNavigate();
  const [daysLeft, setDaysLeft] = useState(0);
  const [hoursLeft, setHoursLeft] = useState(0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const diff = trialEndDate.getTime() - now.getTime();
      
      if (diff <= 0) {
        setDaysLeft(0);
        setHoursLeft(0);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      
      setDaysLeft(days);
      setHoursLeft(hours);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000 * 60 * 60); // Update every hour

    return () => clearInterval(interval);
  }, [trialEndDate]);

  if (daysLeft === 0 && hoursLeft === 0) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-semibold text-red-900">Trial Expired</p>
                <p className="text-sm text-red-700">Upgrade to continue using premium features</p>
              </div>
            </div>
            <Button 
              size="sm"
              onClick={() => {
                if (onUpgrade) {
                  onUpgrade();
                } else {
                  navigate('/subscribe');
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              <Crown className="h-4 w-4 mr-2" />
              Upgrade Now
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isUrgent = daysLeft <= 2;

  return (
    <Card className={`border-2 ${isUrgent ? 'border-orange-200 bg-orange-50' : 'border-blue-200 bg-blue-50'}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className={`h-5 w-5 ${isUrgent ? 'text-orange-600' : 'text-blue-600'}`} />
            <div>
              <p className={`font-semibold ${isUrgent ? 'text-orange-900' : 'text-blue-900'}`}>
                {daysLeft}d {hoursLeft}h left in trial
              </p>
              <p className={`text-sm ${isUrgent ? 'text-orange-700' : 'text-blue-700'}`}>
                Upgrade anytime to keep premium access
              </p>
            </div>
          </div>
          <Button 
            size="sm"
            variant={isUrgent ? 'default' : 'outline'}
            onClick={() => {
              if (onUpgrade) {
                onUpgrade();
              } else {
                navigate('/subscribe');
              }
            }}
            className={isUrgent ? 'bg-orange-600 hover:bg-orange-700' : ''}
          >
            <Crown className="h-4 w-4 mr-2" />
            Upgrade
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
