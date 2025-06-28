
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
import { AlertTriangle, Save } from "lucide-react";

interface BackButtonWarningProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onSaveAndContinue?: () => void;
  destination: string;
  hasUnsavedData: boolean;
  dataDescription?: string;
}

export function BackButtonWarning({
  open,
  onClose,
  onConfirm,
  onSaveAndContinue,
  destination,
  hasUnsavedData,
  dataDescription = "your progress"
}: BackButtonWarningProps) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Leave This Page?
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>You're about to go to: <strong>{destination}</strong></p>
            {hasUnsavedData && (
              <p className="text-red-600 font-medium">
                ⚠️ You will lose {dataDescription} if you leave without saving.
              </p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
          {onSaveAndContinue && hasUnsavedData && (
            <Button onClick={onSaveAndContinue} className="w-full gap-2">
              <Save className="h-4 w-4" />
              Save Progress & Continue
            </Button>
          )}
          <div className="flex gap-2 w-full">
            <AlertDialogCancel className="flex-1">Stay Here</AlertDialogCancel>
            <AlertDialogAction 
              onClick={onConfirm}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              Leave Without Saving
            </AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
