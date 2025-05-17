
import React from "react";

export function WhoItsForSection() {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-foreground">📱 Who It's For – This Was Made For You</h2>
      <div className="space-y-4 mt-3 text-foreground">
        <p>MyRhythm is for you if:</p>
        <ul className="list-disc pl-5 my-4 space-y-2 text-foreground">
          <li>You've experienced a brain injury, stroke, or cognitive change</li>
          <li>You're exhausted from trying to explain what you're going through</li>
          <li>You hear things like "just try harder" or "you don't look sick"</li>
          <li>You're a parent, professional, student—or all of the above—and just need a better way to manage your day</li>
          <li>You want to stop apologizing and start organizing, your way</li>
        </ul>
        <p className="font-medium text-foreground">If you've felt unseen, unheard, or underestimated—this is your app.</p>
      </div>
    </section>
  );
}
