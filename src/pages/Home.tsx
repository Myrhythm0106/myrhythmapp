
import React from "react";
import { BrainRecoveryHome } from "@/components/brain-recovery/BrainRecoveryHome";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PageHeader } from "@/components/ui/PageHeader";

const Home = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="animate-fade-in pb-8">
      <ScrollArea className="h-[calc(100vh-64px)] pr-4">
        <div className="px-4 sm:px-6">
          <PageHeader 
            title="Brain Recovery" 
            subtitle="Your personalized path to rebuilding your rhythm and reclaiming your day."
          />
          <BrainRecoveryHome />
        </div>
      </ScrollArea>
    </div>
  );
};

export default Home;
