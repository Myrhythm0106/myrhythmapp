
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, Check, Clock, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
}

export function MedicationReminders() {
  const [medications, setMedications] = React.useState<Medication[]>([
    { id: "1", name: "Amitriptyline", dosage: "25mg", time: "8:00 AM", taken: true },
    { id: "2", name: "Omega-3", dosage: "1000mg", time: "8:00 AM", taken: false },
    { id: "3", name: "Vitamin D", dosage: "2000 IU", time: "8:00 AM", taken: false },
    { id: "4", name: "Amitriptyline", dosage: "25mg", time: "8:00 PM", taken: false },
    { id: "5", name: "Melatonin", dosage: "3mg", time: "10:00 PM", taken: false },
  ]);

  const handleTaken = (id: string) => {
    setMedications(meds => 
      meds.map(med => 
        med.id === id ? { ...med, taken: true } : med
      )
    );
    toast.success("Medication marked as taken");
  };

  const handleSkip = (id: string) => {
    setMedications(meds => meds.filter(med => med.id !== id));
    toast.info("Medication reminder skipped");
  };

  const handleAddMedication = () => {
    toast.info("Add medication feature will be implemented soon");
  };

  return (
    <>
      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-4">
          {medications.map((med) => (
            <Card key={med.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{med.name}</div>
                  <div className="text-sm text-muted-foreground">{med.dosage}</div>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="text-sm">{med.time}</span>
                </div>
              </div>
              
              <div className="mt-3 flex justify-end gap-2">
                {med.taken ? (
                  <div className="text-sm flex items-center text-green-600">
                    <Check className="h-4 w-4 mr-1" />
                    Taken
                  </div>
                ) : (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSkip(med.id)}
                    >
                      <X className="h-3.5 w-3.5 mr-1" />
                      Skip
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleTaken(med.id)}
                    >
                      <Check className="h-3.5 w-3.5 mr-1" />
                      Taken
                    </Button>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>

      <div className="mt-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-1" />
              Add Medication Reminder
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>Add Medication Reminder</DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <p className="text-muted-foreground">Medication form would go here.</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
