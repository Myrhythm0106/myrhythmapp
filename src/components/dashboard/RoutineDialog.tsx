
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface RoutineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddRoutine: (routine: { name: string; time?: string; color: string }) => void;
}

export function RoutineDialog({ open, onOpenChange, onAddRoutine }: RoutineDialogProps) {
  const [routineName, setRoutineName] = useState("");
  const [routineTime, setRoutineTime] = useState("");
  const [routineColor, setRoutineColor] = useState("blue");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (routineName.trim()) {
      onAddRoutine({
        name: routineName.trim(),
        time: routineTime || undefined,
        color: routineColor
      });
      setRoutineName("");
      setRoutineTime("");
      setRoutineColor("blue");
      onOpenChange(false);
      toast.success("Routine added successfully!");
    } else {
      toast.error("Please enter a routine name");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Routine</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="routine-name">Routine Name</Label>
            <Input
              id="routine-name"
              placeholder="e.g., Morning Medication"
              value={routineName}
              onChange={(e) => setRoutineName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="routine-time">Time (Optional)</Label>
            <Input
              id="routine-time"
              type="time"
              value={routineTime}
              onChange={(e) => setRoutineTime(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="routine-color">Color</Label>
            <Select value={routineColor} onValueChange={setRoutineColor}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blue">Blue</SelectItem>
                <SelectItem value="green">Green</SelectItem>
                <SelectItem value="amber">Amber</SelectItem>
                <SelectItem value="purple">Purple</SelectItem>
                <SelectItem value="pink">Pink</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Routine</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
