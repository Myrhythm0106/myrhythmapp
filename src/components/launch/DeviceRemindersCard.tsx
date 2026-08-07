import React, { useEffect, useState } from 'react';
import { LaunchCard } from '@/components/launch/LaunchCard';
import { Button } from '@/components/ui/button';
import { Bell, BellRing, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

type Perm = 'unsupported' | 'default' | 'granted' | 'denied';

function readPermission(): Perm {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
  return Notification.permission as Perm;
}

/**
 * One-tap "turn reminders on for this phone" plus a test alert so you can
 * confirm within seconds that notifications actually land on your device.
 */
export function DeviceRemindersCard() {
  const [perm, setPerm] = useState<Perm>('default');

  useEffect(() => {
    setPerm(readPermission());
  }, []);

  const enable = async () => {
    if (perm === 'unsupported') {
      toast.error('This browser cannot show alerts. Reminders will still arrive by email.');
      return;
    }
    try {
      const result = await Notification.requestPermission();
      setPerm(result as Perm);
      if (result === 'granted') {
        toast.success('Reminders are on for this device.');
      } else {
        toast.error('Alerts are blocked. Turn them on for MyRhythm in your phone settings, then try again.');
      }
    } catch {
      toast.error("We couldn't turn alerts on. Try again in a moment.");
    }
  };

  const sendTest = () => {
    if (readPermission() !== 'granted') {
      toast.error('Turn reminders on first, then send a test.');
      return;
    }
    try {
      new Notification('MyRhythm', {
        body: 'This is a test reminder. Your alerts are working.',
        icon: '/icons/icon-192.png',
      });
      toast.success('Test sent — check your notifications.');
    } catch {
      toast.error("We couldn't send the test alert on this device.");
    }
  };

  return (
    <LaunchCard className="bg-launch-ivory border-launch-gold/30">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-launch-gold/15 flex items-center justify-center shrink-0">
          <Bell className="h-5 w-5 text-launch-ink" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-launch-ink">Reminders on this phone</h3>
          <p className="mt-1 text-sm text-launch-ink/70">
            Your reminders are already scheduled. Allow alerts so they show up on this device too.
            Gentle, Steady and Strong intensities still apply per event.
          </p>

          {perm === 'granted' ? (
            <div className="mt-3 flex flex-col sm:flex-row gap-2">
              <div className="flex items-center gap-2 text-sm font-medium text-launch-ink">
                <CheckCircle2 className="h-4 w-4" />
                Alerts are on for this device
              </div>
              <Button variant="outline" className="min-h-[56px] sm:ml-auto" onClick={sendTest}>
                <BellRing className="h-4 w-4 mr-2" />
                Send a test reminder
              </Button>
            </div>
          ) : (
            <Button className="mt-3 min-h-[56px] w-full sm:w-auto" onClick={enable}>
              Turn on reminders on this phone
            </Button>
          )}

          {perm === 'denied' && (
            <p className="mt-2 text-sm text-launch-ink/70">
              Alerts are currently blocked. Open your browser or phone settings for MyRhythm, allow
              notifications, then come back and tap again.
            </p>
          )}
        </div>
      </div>
    </LaunchCard>
  );
}
