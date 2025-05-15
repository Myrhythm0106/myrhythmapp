
import React from "react";
import { BrainRecoveryHome } from "@/components/brain-recovery/BrainRecoveryHome";
import { useIsMobile } from "@/hooks/use-mobile";

const Home = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="animate-fade-in pb-8">
      <BrainRecoveryHome />
    </div>
  );
};

export default Home;
