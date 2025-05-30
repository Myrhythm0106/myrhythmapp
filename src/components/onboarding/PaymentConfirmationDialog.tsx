
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlanType } from "./steps/PlanStep";

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
    basic: { name: "Basic Plan", price: "$7.99/month", trial: "7 Day Free Trial" },
    premium: { name: "Premium Plan", price: "$9.99/month" },
    family: { name: "Family Plan", price: "$19.99/month" }
  };

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
          <h3 className="font-medium text-lg">{planInfo[selectedPlan].name}</h3>
          <p className="text-muted-foreground">
            {selectedPlan === "basic" 
              ? `${planInfo.basic.trial} - Your card will be charged ${planInfo.basic.price} after trial ends.` 
              : `You will be charged ${planInfo[selectedPlan].price} monthly.`}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            You can cancel anytime from your account settings.
          </p>
        </div>

        <DialogFooter className="sm:justify-start">
          <Button onClick={onConfirm} className="w-full">
            {selectedPlan === "basic" ? "Start Free Trial" : "Confirm Subscription"}
          </Button>
          <Button variant="outline" onClick={onCancel} className="w-full">
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
