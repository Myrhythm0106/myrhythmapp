
import React from "react";

export function MobileExperience() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold text-foreground">Mobile Experience</h2>
      <p className="text-foreground">
        MyRhythm is fully optimized for mobile devices, with special features to enhance the experience on phones and tablets:
      </p>
      
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <div className="bg-primary rounded-full p-1 mt-1">
            <span className="text-xs text-primary-foreground font-bold">1</span>
          </div>
          <p className="text-foreground"><strong>Swipeable interfaces</strong> - Navigate through cards, calendar views, and content with intuitive swipe gestures.</p>
        </div>
        
        <div className="flex items-start gap-2">
          <div className="bg-primary rounded-full p-1 mt-1">
            <span className="text-xs text-primary-foreground font-bold">2</span>
          </div>
          <p className="text-foreground"><strong>Mobile navigation</strong> - Easy access menu available from any screen for quick navigation.</p>
        </div>
        
        <div className="flex items-start gap-2">
          <div className="bg-primary rounded-full p-1 mt-1">
            <span className="text-xs text-primary-foreground font-bold">3</span>
          </div>
          <p className="text-foreground"><strong>Responsive layouts</strong> - All screens automatically adjust to your device size for optimal viewing.</p>
        </div>
        
        <div className="flex items-start gap-2">
          <div className="bg-primary rounded-full p-1 mt-1">
            <span className="text-xs text-primary-foreground font-bold">4</span>
          </div>
          <p className="text-foreground"><strong>Touch-friendly controls</strong> - Larger touch targets and intuitive interactions designed for touch screens.</p>
        </div>
      </div>
    </section>
  );
}
