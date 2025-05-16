
import React from "react";

export function GuideFooter() {
  return (
    <div className="text-center text-sm text-muted-foreground mt-8">
      <p>MyRhythm User Guide • Last Updated: {new Date().toLocaleDateString()}</p>
      <p>This guide is provided for users of the MyRhythm application. All features described may be subject to updates or changes.</p>
    </div>
  );
}
