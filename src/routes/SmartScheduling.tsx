import SmartSchedulingPage from "@/components/smart-scheduling/SmartSchedulingPage";
import { FeatureGate } from "@/components/subscription/FeatureGate";

const SmartScheduling = () => {
  return (
    <FeatureGate feature="smartScheduling">
      <SmartSchedulingPage />
    </FeatureGate>
  );
};

export default SmartScheduling;