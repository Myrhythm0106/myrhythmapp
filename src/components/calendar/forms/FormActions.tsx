
import React from "react";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";

interface FormActionsProps {
  isSubmitting?: boolean;
  mode?: "add" | "edit";
}

export function FormActions({ isSubmitting, mode = "add" }: FormActionsProps) {
  const buttonText = mode === "add" ? "Add Action" : "Update Action";
  
  return (
    <div className="flex justify-end gap-2 pt-4 sticky bottom-0 bg-background border-t">
      <DialogClose asChild>
        <Button type="button" variant="outline">Cancel</Button>
      </DialogClose>
      <Button type="submit" disabled={isSubmitting}>{buttonText}</Button>
    </div>
  );
}
