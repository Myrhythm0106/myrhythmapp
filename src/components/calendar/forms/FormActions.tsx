
import React from "react";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";

interface FormActionsProps {
  isSubmitting?: boolean;
}

export function FormActions({ isSubmitting }: FormActionsProps) {
  return (
    <div className="flex justify-end gap-2">
      <DialogClose asChild>
        <Button type="button" variant="outline">Cancel</Button>
      </DialogClose>
      <Button type="submit" disabled={isSubmitting}>Add Action</Button>
    </div>
  );
}
