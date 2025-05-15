
import React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { BrainRecoveryHome } from "@/components/brain-recovery/BrainRecoveryHome";
import { useIsMobile } from "@/hooks/use-mobile";

const Home = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="animate-fade-in">
      <BrainRecoveryHome />
    </div>
  );
};

export default Home;
