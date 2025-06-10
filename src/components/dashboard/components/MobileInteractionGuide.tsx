
import React from "react";

export function MobileInteractionGuide() {
  return (
    <div className="bg-muted/30 rounded-lg p-3 text-center">
      <p className="text-sm text-muted-foreground mb-2 font-medium">
        ✨ Enhanced Mobile Experience
      </p>
      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <div>📱 Swipe to navigate</div>
        <div>⬇️ Pull to refresh</div>
        <div>👆 Tap for details</div>
        <div>🔄 Auto-updates</div>
      </div>
    </div>
  );
}
