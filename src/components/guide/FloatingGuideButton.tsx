import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { HelpCircle, BookOpen } from "lucide-react";
import { PersonalCoachGuide } from "./PersonalCoachGuide";
import { useNavigate } from "react-router-dom";

export function FloatingGuideButton() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpenFullGuide = () => {
    setIsOpen(false);
    navigate('/user-guide-view');
  };

  return (
    <>
      <div className="fixed bottom-20 right-6 z-40">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-full w-14 h-14 p-0"
          aria-label="Open Getting Started Guide"
        >
          <HelpCircle className="h-6 w-6" />
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Your Personal Guide
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
            <PersonalCoachGuide />
          </div>
          <div className="flex justify-center p-4 border-t">
            <Button onClick={handleOpenFullGuide} variant="outline">
              Open Full Guide Page
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}