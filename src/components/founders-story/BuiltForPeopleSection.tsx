
import React from "react";

export function BuiltForPeopleSection() {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-foreground">👨‍👩‍👧‍👦 Built for the People Around You, Too</h2>
      <div className="space-y-4 mt-3 text-foreground">
        <p>Recovery is never just yours. It affects everyone who loves you—and often, they don't know how to help.</p>
        <p className="text-foreground">That's why MyRhythm gently includes them in your journey:</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6 text-foreground">
          <div className="bg-muted/20 p-4 rounded-lg">
            <p className="font-medium">📩 Loved ones</p>
            <p>can send uplifting notes or helpful reminders</p>
          </div>
          <div className="bg-muted/20 p-4 rounded-lg">
            <p className="font-medium">🩺 Medical professionals</p>
            <p>can track your rhythms and provide encouragement</p>
          </div>
          <div className="bg-muted/20 p-4 rounded-lg">
            <p className="font-medium">📊 You</p>
            <p>stay in charge—no micromanaging, just meaningful support</p>
          </div>
        </div>
        <p className="font-medium text-foreground">You don't have to choose between independence and connection. With MyRhythm, you get both.</p>
      </div>
    </section>
  );
}
