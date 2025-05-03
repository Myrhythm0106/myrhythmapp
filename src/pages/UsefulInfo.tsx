
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from '@/components/ui/button';
import { Info } from "lucide-react";
import { TutorialModal } from '@/components/tutorial/TutorialModal';
import { UsefulInfoTabs } from '@/components/useful-info/UsefulInfoTabs';

const UsefulInfo = () => {
  const [showTutorial, setShowTutorial] = React.useState(false);

  return (
    <ScrollArea className="h-[calc(100vh-64px)]">
      <div className="space-y-6 p-4">
        <PageHeader
          title="Useful Information"
          subtitle="Guides, tutorials and helpful resources"
        >
          <Button onClick={() => setShowTutorial(true)}>
            <Info className="mr-2 h-4 w-4" />
            App Tutorial
          </Button>
        </PageHeader>

        <UsefulInfoTabs />
        
        <TutorialModal isOpen={showTutorial} onComplete={() => setShowTutorial(false)} />
      </div>
    </ScrollArea>
  );
};

export default UsefulInfo;
