import SmartSchedulingPage from "@/components/smart-scheduling/SmartSchedulingPage";
import { FeatureGate } from "@/components/subscription/FeatureGate";
import { CalendarIntegrationWizard } from "@/components/calendar/CalendarIntegrationWizard";
import { useState } from "react";

const SmartScheduling = () => {
  const [showCalendarIntegration, setShowCalendarIntegration] = useState(false);

  const handleCalendarIntegration = (provider: string) => {
    console.log("Calendar connected:", provider);
    setShowCalendarIntegration(false);
  };

  if (showCalendarIntegration) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <CalendarIntegrationWizard 
          onComplete={handleCalendarIntegration}
          tier="smart"
        />
      </div>
    );
  }

  return (
    <FeatureGate feature="smartScheduling">
      <SmartSchedulingPage onCalendarIntegration={() => setShowCalendarIntegration(true)} />
    </FeatureGate>
  );
};

export default SmartScheduling;