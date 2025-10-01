import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface AffirmationTrack {
  text: string;
  firstSeen: string;
  dayCount: number;
  lastShown: string;
}

export function useAffirmationTracker(currentStatement: string) {
  const { user } = useAuth();
  const [trackData, setTrackData] = useState<AffirmationTrack | null>(null);
  const [showReinforcement, setShowReinforcement] = useState(false);

  useEffect(() => {
    if (!user || !currentStatement) return;

    const storageKey = `affirmation_track_${user.id}`;
    const stored = localStorage.getItem(storageKey);
    const today = new Date().toISOString().split('T')[0];

    let track: AffirmationTrack;

    if (stored) {
      const parsed = JSON.parse(stored) as AffirmationTrack;
      
      // Same statement as before
      if (parsed.text === currentStatement) {
        // Check if it's a new day
        if (parsed.lastShown !== today) {
          track = {
            ...parsed,
            dayCount: parsed.dayCount + 1,
            lastShown: today
          };
        } else {
          track = parsed;
        }
      } else {
        // New statement
        track = {
          text: currentStatement,
          firstSeen: today,
          dayCount: 1,
          lastShown: today
        };
      }
    } else {
      // First time tracking
      track = {
        text: currentStatement,
        firstSeen: today,
        dayCount: 1,
        lastShown: today
      };
    }

    localStorage.setItem(storageKey, JSON.stringify(track));
    setTrackData(track);

    // Show reinforcement message occasionally (every 3rd day, or on day 2)
    const shouldShow = track.dayCount === 2 || (track.dayCount > 2 && track.dayCount % 3 === 0);
    setShowReinforcement(shouldShow && track.dayCount > 1);

  }, [user, currentStatement]);

  return {
    dayCount: trackData?.dayCount || 1,
    showReinforcement,
    isRepeating: (trackData?.dayCount || 1) > 1
  };
}
