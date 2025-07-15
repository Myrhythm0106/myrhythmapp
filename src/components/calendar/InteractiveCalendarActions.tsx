
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Calendar, Clock, Target } from "lucide-react";
import { GuidedActionWizard } from "./forms/GuidedActionWizard";
import { toast } from "sonner";

interface InteractiveCalendarActionsProps {
  selectedDate?: Date;
  selectedTime?: string;
  onActionCreate?: (actionData: any) => void;
  view: "day" | "week" | "month" | "year";
}

export function InteractiveCalendarActions({ 
  selectedDate, 
  selectedTime, 
  onActionCreate,
  view 
}: InteractiveCalendarActionsProps) {
  const [showActionDialog, setShowActionDialog] = React.useState(false);

  const handleActionCreate = (actionData: any) => {
    const newAction = {
      ...actionData,
      date: selectedDate,
      time: selectedTime,
      id: Math.random().toString(36).substr(2, 9)
    };
    
    onActionCreate?.(newAction);
    setShowActionDialog(false);
    
    toast.success("🎯 Action Created!", {
      description: `New action scheduled for ${selectedDate?.toLocaleDateString()}`,
      duration: 3000
    });
  };

  const handleUpgradeClick = () => {
    toast.success("Upgrade feature coming soon!");
  };

  const getFloatingButtonPosition = () => {
    switch (view) {
      case "day":
        return "fixed bottom-6 right-6 z-50";
      case "week":
        return "fixed bottom-6 right-6 z-50";
      case "month":
        return "fixed bottom-6 right-6 z-50";
      case "year":
        return "fixed bottom-6 right-6 z-50";
      default:
        return "fixed bottom-6 right-6 z-50";
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className={getFloatingButtonPosition()}>
        <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
          <DialogTrigger asChild>
            <Button 
              size="lg"
              className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-clarity-teal-500 to-memory-emerald-500 hover:from-clarity-teal-600 hover:to-memory-emerald-600 hover:scale-110 transition-all duration-200"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl bg-gradient-to-r from-clarity-teal-600 to-memory-emerald-600 bg-clip-text text-transparent">
                <Target className="h-5 w-5 text-clarity-teal-600" />
                Create Brain-Friendly Action
              </DialogTitle>
              <DialogDescription>
                {selectedDate && (
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{selectedDate.toLocaleDateString()}</span>
                    </div>
                    {selectedTime && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{selectedTime}</span>
                      </div>
                    )}
                  </div>
                )}
                Create a personalized action that fits your energy and recovery needs.
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[calc(90vh-120px)] overflow-y-auto">
              <GuidedActionWizard 
                onSuccess={handleActionCreate}
                onUpgradeClick={handleUpgradeClick}
                preFilledData={{
                  date: selectedDate?.toISOString().split('T')[0],
                  time: selectedTime
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Add Hints for Calendar Interactions */}
      <div className="fixed bottom-20 right-6 z-40">
        <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-2 shadow-sm text-xs text-gray-600 max-w-48">
          <p className="font-medium mb-1">💡 Quick Tips:</p>
          <ul className="space-y-1">
            <li>• Click dates to add actions</li>
            <li>• Click time slots for scheduling</li>
            <li>• Use the + button for quick add</li>
          </ul>
        </div>
      </div>
    </>
  );
}
