
import React, { useState, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from '@/components/ui/button';
import { Info, ArrowLeft, ArrowRight } from "lucide-react";
import { TutorialModal } from '@/components/tutorial/TutorialModal';
import { UsefulInfoTabs } from '@/components/useful-info/UsefulInfoTabs';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const UsefulInfo = () => {
  const [showTutorial, setShowTutorial] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const navigate = useNavigate();
  const AUTO_ADVANCE_TIME = 60; // Auto-advance after 60 seconds (1 minute)
  
  // Timer to track how long the user has been on this page
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Auto-advance notification after designated time
  useEffect(() => {
    if (timeSpent === AUTO_ADVANCE_TIME) {
      toast.info("Would you like to continue to the dashboard?", {
        duration: 10000, // Show for 10 seconds
        action: {
          label: "Continue",
          onClick: () => navigateToDashboard(),
        },
      });
    }
  }, [timeSpent]);
  
  // Function to navigate back
  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };
  
  // Function to navigate to dashboard
  const navigateToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <ScrollArea className="h-[calc(100vh-64px)]">
      <div className="space-y-6 p-4">
        <PageHeader
          title="Useful Information"
          subtitle="Guides, tutorials and helpful resources"
        >
          <div className="flex gap-2">
            <Button onClick={() => setShowTutorial(true)}>
              <Info className="mr-2 h-4 w-4" />
              App Tutorial
            </Button>
          </div>
        </PageHeader>

        <UsefulInfoTabs />
        
        {/* Navigation buttons */}
        <div className="flex justify-between mt-8 pb-8">
          <Button onClick={handleBack} variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          <Button onClick={navigateToDashboard} className="flex items-center gap-2">
            Continue to Dashboard
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        
        <TutorialModal isOpen={showTutorial} onComplete={() => setShowTutorial(false)} />
      </div>
    </ScrollArea>
  );
};

export default UsefulInfo;
