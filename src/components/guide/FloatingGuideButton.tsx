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
      <div className="flex justify-center mt-6">
        <Button
          onClick={() => setIsOpen(true)}
          variant="ghost"
          size="sm"
          className="text-sm text-muted-foreground hover:text-foreground"
          aria-label="Open Getting Started Guide"
        >
          <HelpCircle className="h-4 w-4 mr-2" />
          Need Help? Quick Guide
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