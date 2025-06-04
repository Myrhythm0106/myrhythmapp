
import React from "react";
import { TodaysActions } from "@/components/dashboard/TodaysActions";
import { UpcomingToday } from "@/components/dashboard/UpcomingToday";
import { RoutineCheckIn } from "@/components/dashboard/RoutineCheckIn";
import { MoodEnergySnapshot } from "@/components/dashboard/MoodEnergySnapshot";
import { BrainGameQuickStart } from "@/components/dashboard/BrainGameQuickStart";
import { DynamicFocusAreaWidget } from "@/components/dashboard/widgets/DynamicFocusAreaWidget";
import { AssessmentHistoryWidget } from "@/components/dashboard/widgets/AssessmentHistoryWidget";
import { Card } from "@/components/ui/card";
import { AlertTriangle, Clock } from "lucide-react";
import { getCurrentFocusArea } from "@/utils/rhythmAnalysis";
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
  const currentFocusArea = getCurrentFocusArea();

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

  // Prioritize widgets based on focus area
  const getFocusAreaWidgets = () => {
    const baseWidgets = [
      <TodaysActions key="actions" />,
      <ViewOnlyWrapper key="upcoming" redirectPath="/calendar" actionDescription="view or modify upcoming events">
        <UpcomingToday />
      </ViewOnlyWrapper>,
      <ViewOnlyWrapper key="routine" redirectPath="/tracking" actionDescription="check in and update your routine">
        <RoutineCheckIn />
      </ViewOnlyWrapper>,
      <ViewOnlyWrapper key="mood" redirectPath="/mood" actionDescription="track your mood and energy">
        <MoodEnergySnapshot />
      </ViewOnlyWrapper>,
      <ViewOnlyWrapper key="brain" redirectPath="/brain-games" actionDescription="start brain games">
        <BrainGameQuickStart />
      </ViewOnlyWrapper>
    ];

    // Reorder based on focus area
    if (currentFocusArea === "emotional") {
      return [baseWidgets[0], baseWidgets[3], baseWidgets[2], baseWidgets[1], baseWidgets[4]];
    } else if (currentFocusArea === "structure") {
      return [baseWidgets[0], baseWidgets[1], baseWidgets[2], baseWidgets[3], baseWidgets[4]];
    } else if (currentFocusArea === "growth") {
      return [baseWidgets[0], baseWidgets[4], baseWidgets[3], baseWidgets[2], baseWidgets[1]];
    }
    
    return baseWidgets;
  };

  const prioritizedWidgets = getFocusAreaWidgets();

  return (
    <div className="space-y-6">
      {/* Dynamic Focus Area Widget - Always at the top */}
      <DynamicFocusAreaWidget />

      {/* Assessment History Widget - New widget added below the focus area */}
      <AssessmentHistoryWidget />

      {/* Prioritized widgets based on focus area */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-4">
          {prioritizedWidgets[0]}
          {prioritizedWidgets[1]}
        </div>
        <div className="space-y-4">
          {prioritizedWidgets[2]}
          {prioritizedWidgets[3]}
        </div>
      </div>

      {/* Additional content */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {prioritizedWidgets[4]}
        
        {/* Focus-area specific reminder card */}
        <Card className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <div className="flex items-start gap-3">
            <div className="bg-amber-500/20 p-2 rounded-md mt-1">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-medium text-amber-900 mb-1">Your Rhythm Reminder</h3>
              <p className="text-sm text-amber-800">
                {currentFocusArea === "emotional" && "Take time for emotional self-care today. Your wellbeing matters."}
                {currentFocusArea === "structure" && "Stick to your routines today. Structure helps your brain heal."}
                {currentFocusArea === "achievement" && "Focus on your goals today. Every step forward counts."}
                {currentFocusArea === "community" && "Connect with your support network today. You're not alone."}
                {currentFocusArea === "growth" && "Challenge yourself to grow today. Your brain is capable of amazing things."}
                {!currentFocusArea && "Complete your daily actions to make progress toward your goals. Every small step matters!"}
              </p>
              <div className="flex items-center gap-1 mt-2 text-xs text-amber-700">
                <Clock className="h-3 w-3" />
                <span>Personalized for your current rhythm phase</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
