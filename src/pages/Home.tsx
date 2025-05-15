
import React from "react";
import { BrainRecoveryHome } from "@/components/brain-recovery/BrainRecoveryHome";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";

const Home = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="animate-fade-in pb-8">
      <ScrollArea className="h-[calc(100vh-64px)]">
        <BrainRecoveryHome />
      </ScrollArea>
    </div>
  );
};

export default Home;
