
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Save, BookmarkCheck } from "lucide-react";

interface BackButtonWarningProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onSaveAndContinue?: () => void;
  destination: string;
  hasUnsavedData: boolean;
  dataDescription?: string;
  completionPercentage?: number;
  isAssessment?: boolean;
}

export function BackButtonWarning({
  open,
  onClose,
  onConfirm,
  onSaveAndContinue,
  destination,
  hasUnsavedData,
  dataDescription = "your progress",
  completionPercentage = 0,
  isAssessment = false
}: BackButtonWarningProps) {
  
  const getRiskLevel = () => {
    if (completionPercentage > 75) return "high";
    if (completionPercentage > 25) return "medium";
    return "low";
  };

  const riskLevel = getRiskLevel();
  
  const getWarningMessage = () => {
    if (!hasUnsavedData) return null;
    
    if (isAssessment) {
      if (completionPercentage > 75) {
        return "You're almost done with your assessment! Leaving now means you'll need to restart the entire process.";
      } else if (completionPercentage > 25) {
        return "You've made good progress on your assessment. We can save where you are so you can continue later.";
      } else {
        return "You've started your assessment. We can bookmark your progress so you don't lose your work.";
      }
    }
    
    return `You will lose ${dataDescription} if you leave without saving.`;
  };

  const getSaveButtonText = () => {
    if (isAssessment && completionPercentage > 0) {
      return completionPercentage > 75 ? "Save & Resume Later" : "Bookmark Progress";
    }
    return "Save Progress & Continue";
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className={`h-5 w-5 ${
              riskLevel === 'high' ? 'text-red-500' : 
              riskLevel === 'medium' ? 'text-amber-500' : 'text-blue-500'
            }`} />
            {riskLevel === 'high' ? 'Important: Don\'t Lose Your Work!' : 'Leave This Page?'}
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>You're about to go to: <strong>{destination}</strong></p>
            
            {completionPercentage > 0 && (
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{completionPercentage}% complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      riskLevel === 'high' ? 'bg-red-500' : 
                      riskLevel === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>
            )}
            
            {hasUnsavedData && (
              <p className={`font-medium ${
                riskLevel === 'high' ? 'text-red-600' : 
                riskLevel === 'medium' ? 'text-amber-600' : 'text-blue-600'
              }`}>
                ⚠️ {getWarningMessage()}
              </p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
          {onSaveAndContinue && hasUnsavedData && (
            <Button onClick={onSaveAndContinue} className="w-full gap-2">
              {completionPercentage > 75 ? (
                <BookmarkCheck className="h-4 w-4" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {getSaveButtonText()}
            </Button>
          )}
          <div className="flex gap-2 w-full">
            <AlertDialogCancel className="flex-1">Stay Here</AlertDialogCancel>
            <AlertDialogAction 
              onClick={onConfirm}
              className={`flex-1 ${
                riskLevel === 'high' ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              {riskLevel === 'high' ? 'Leave Anyway' : 'Leave Without Saving'}
            </AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
