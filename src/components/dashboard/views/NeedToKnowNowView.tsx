
import React from "react";
import { TodayFocus } from "@/components/dashboard/TodayFocus";
import { UpcomingToday } from "@/components/dashboard/UpcomingToday";
import { RoutineCheckIn } from "@/components/dashboard/RoutineCheckIn";
import { MoodEnergySnapshot } from "@/components/dashboard/MoodEnergySnapshot";
import { BrainGameQuickStart } from "@/components/dashboard/BrainGameQuickStart";
import { Card } from "@/components/ui/card";
import { AlertTriangle, Clock } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";

export function NeedToKnowNowView() {
  const navigate = useNavigate();

  const handleRedirect = (path: string, action: string) => {
    navigate(path);
  };

  const ViewOnlyWrapper = ({ children, redirectPath, actionDescription }: { 
    children: React.ReactNode;
    redirectPath: string;
    actionDescription: string;
  }) => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="cursor-pointer hover:opacity-80 transition-opacity">
          {children}
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Dashboard is View Only</AlertDialogTitle>
          <AlertDialogDescription>
            The dashboard provides an overview of your information. To {actionDescription}, you'll be redirected to the appropriate page where you can make changes.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Stay on Dashboard</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleRedirect(redirectPath, actionDescription)}>
            Go to {actionDescription.split(' ')[0]} Page
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return (
    <div className="space-y-6">
      {/* Urgent/Time-sensitive items */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <ViewOnlyWrapper 
            redirectPath="/calendar" 
            actionDescription="update your focus items"
          >
            <TodayFocus />
          </ViewOnlyWrapper>
          <ViewOnlyWrapper 
            redirectPath="/calendar" 
            actionDescription="view or modify upcoming events"
          >
            <UpcomingToday />
          </ViewOnlyWrapper>
        </div>
        <div className="space-y-4">
          <ViewOnlyWrapper 
            redirectPath="/tracking" 
            actionDescription="check in and update your routine"
          >
            <RoutineCheckIn />
          </ViewOnlyWrapper>
          <ViewOnlyWrapper 
            redirectPath="/mood" 
            actionDescription="track your mood and energy"
          >
            <MoodEnergySnapshot />
          </ViewOnlyWrapper>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ViewOnlyWrapper 
          redirectPath="/brain-games" 
          actionDescription="start brain games"
        >
          <BrainGameQuickStart />
        </ViewOnlyWrapper>
        
        {/* Quick reminder card - view only */}
        <Card className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <div className="flex items-start gap-3">
            <div className="bg-amber-500/20 p-2 rounded-md mt-1">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-medium text-amber-900 mb-1">Quick Reminder</h3>
              <p className="text-sm text-amber-800">
                Remember to take your evening medication and complete your gratitude practice before bed.
              </p>
              <div className="flex items-center gap-1 mt-2 text-xs text-amber-700">
                <Clock className="h-3 w-3" />
                <span>Due in 4 hours</span>
              </div>
              <p className="text-xs text-amber-700 mt-2 italic">
                💡 Click on dashboard items to go to the relevant page for editing
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
