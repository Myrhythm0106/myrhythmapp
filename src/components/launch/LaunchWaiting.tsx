import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

/** Plain-words waiting screen with a "Take me Home" escape after 5 seconds. */
export function LaunchWaiting({ message = 'Getting your day ready…' }: { message?: string }) {
  const [slow, setSlow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setSlow(true), 5000); return () => clearTimeout(t); }, []);
  return (
    <div className="min-h-[60svh] flex flex-col items-center justify-center gap-4 text-center px-6" role="status" aria-live="polite">
      <Loader2 className="h-7 w-7 animate-spin text-launch-teal" />
      <p className="text-lg text-launch-ink">{message}</p>
      {slow && (
        <Link to="/launch/home" className="min-h-[56px] inline-flex items-center px-6 rounded-xl border border-launch-gold/40 text-launch-ink font-medium hover:bg-launch-cream">
          This is taking a while — take me Home
        </Link>
      )}
    </div>
  );
}
