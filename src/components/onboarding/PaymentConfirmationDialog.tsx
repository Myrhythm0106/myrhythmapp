import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlanType } from "./steps/plan/types";

interface PaymentConfirmationDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  selectedPlan: PlanType;
}

export function PaymentConfirmationDialog({ 
  open, 
  onConfirm, 
  onCancel, 
  selectedPlan 
}: PaymentConfirmationDialogProps) {
  const planInfo = {
    free: { name: "Free Trial", price: "£0", trial: "7 Day Free Trial" },
    premium: { name: "MyRhythm Premium", price: "£10/month", trial: "7 Day Free Trial" }
  };

  const currentPlan = planInfo[selectedPlan] || planInfo.premium;

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Your Subscription</DialogTitle>
          <DialogDescription>
            Please review your subscription details before proceeding.
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-muted p-4 rounded-md my-4">
          <h3 className="font-medium text-lg">{currentPlan.name}</h3>
          <p className="text-muted-foreground">
            {currentPlan.trial} - Your card will be charged {currentPlan.price} after trial ends.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            You can cancel anytime from your account settings.
          </p>
        </div>

        <DialogFooter className="sm:justify-start">
          <Button onClick={onConfirm} className="w-full">
            Details Confirmed
          </Button>
          <Button variant="outline" onClick={onCancel} className="w-full">
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
