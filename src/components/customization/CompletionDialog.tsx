
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CompletionDialogProps {
  open: boolean;
  onComplete: () => void;
}

export function CompletionDialog({ open, onComplete }: CompletionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Setup Complete!</DialogTitle>
          <DialogDescription className="text-center">
            Congratulations! You've successfully completed your MyRhythm setup. 
            You'll now be taken to the Calendar screen where you can start planning your goals and managing your daily rhythm.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center pt-4">
          <Button onClick={onComplete} className="px-8">
            Go to Calendar
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
