
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Calendar, Clock, Target, Brain } from "lucide-react";
import { GuidedActionWizard } from "./forms/GuidedActionWizard";
import { toast } from "sonner";
import { useDailyActions } from "@/hooks/use-daily-actions";

interface InteractiveCalendarActionsProps {
  selectedDate?: Date;
  selectedTime?: string;
  onActionCreate?: (actionData: any) => void;
  onRefreshCalendar?: () => void;
  view: "day" | "week" | "month" | "year";
}

export function InteractiveCalendarActions({ 
  selectedDate, 
  selectedTime, 
  onActionCreate,
  onRefreshCalendar,
  view 
}: InteractiveCalendarActionsProps) {
  const [showActionDialog, setShowActionDialog] = React.useState(false);

  const handleActionCreate = (actionData: any) => {
    // The action is already created in the database by GuidedActionWizard
    // Just trigger calendar refresh and close dialog
    onActionCreate?.(actionData);
    onRefreshCalendar?.();
    setShowActionDialog(false);
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
              <DialogTitle className="flex items-center gap-2 text-xl bg-gradient-to-r from-brain-purple-600 to-clarity-teal-600 bg-clip-text text-transparent">
                <Brain className="h-5 w-5 text-brain-purple-600" />
                Create Your Empowering Action
              </DialogTitle>
              <DialogDescription>
                {selectedDate && (
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
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
                <div className="mt-3 p-3 bg-gradient-to-r from-brain-purple-50 to-clarity-teal-50 rounded-lg border border-brain-purple-200">
                  <p className="text-sm font-medium text-brain-purple-800">✨ Design an action that empowers your brain and builds cognitive strength</p>
                  <p className="text-xs text-brain-purple-600 mt-1">Every thoughtful action you schedule builds neural pathways and strengthens your executive function!</p>
                </div>
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
