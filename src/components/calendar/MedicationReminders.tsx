
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, Check, Clock, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MedicationForm } from "./forms/MedicationForm";
import { v4 as uuidv4 } from "uuid";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
}

export function MedicationReminders() {
  const [medications, setMedications] = React.useState<Medication[]>([{
    id: "1",
    name: "Amitriptyline",
    dosage: "25mg",
    time: "8:00 AM",
    taken: true
  }, {
    id: "2",
    name: "Omega-3",
    dosage: "1000mg",
    time: "8:00 AM",
    taken: false
  }, {
    id: "3",
    name: "Vitamin D",
    dosage: "2000 IU",
    time: "8:00 AM",
    taken: false
  }, {
    id: "4",
    name: "Amitriptyline",
    dosage: "25mg",
    time: "8:00 PM",
    taken: false
  }, {
    id: "5",
    name: "Melatonin",
    dosage: "3mg",
    time: "10:00 PM",
    taken: false
  }]);
  
  const [open, setOpen] = React.useState(false);

  const handleTaken = (id: string) => {
    setMedications(meds => meds.map(med => med.id === id ? {
      ...med,
      taken: true
    } : med));
    toast.success("Medication marked as taken");
  };

  const handleSkip = (id: string) => {
    setMedications(meds => meds.filter(med => med.id !== id));
    toast.info("Medication reminder skipped");
  };

  const handleAddMedication = (data: { name: string; dosage: string; time: string }) => {
    // Convert time format from 24h to AM/PM format
    const timeObj = new Date(`2000-01-01T${data.time}`);
    const formattedTime = timeObj.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: 'numeric',
      hour12: true 
    });
    
    const newMedication: Medication = {
      id: uuidv4(),
      name: data.name,
      dosage: data.dosage,
      time: formattedTime,
      taken: false
    };
    
    setMedications(prev => [...prev, newMedication]);
    setOpen(false);
    toast.success("Medication reminder added");
  };

  return <>
      {/* Add a button at the top for adding medication */}
      <div className="flex justify-end mb-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="bg-gradient-to-r from-secondary/80 to-secondary text-white font-medium border-none shadow-sm hover:shadow-md transition-all">
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Medication
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>Add Medication Reminder</DialogTitle>
            </DialogHeader>
            <MedicationForm 
              onSubmit={handleAddMedication}
              onCancel={() => setOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-4">
          {medications.map(med => <Card key={med.id} className="p-4">
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
                {med.taken ? <div className="text-sm flex items-center text-green-600">
                    <Check className="h-4 w-4 mr-1" />
                    Taken
                  </div> : <>
                    <Button variant="outline" size="sm" onClick={() => handleSkip(med.id)}>
                      <X className="h-3.5 w-3.5 mr-1" />
                      Skip
                    </Button>
                    <Button size="sm" className="bg-gradient-to-r from-secondary/90 to-secondary text-white" onClick={() => handleTaken(med.id)}>
                      <Check className="h-3.5 w-3.5 mr-1" />
                      Taken
                    </Button>
                  </>}
              </div>
            </Card>)}
        </div>
      </ScrollArea>

      <div className="mt-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full font-medium text-xs bg-gradient-to-r from-primary/80 to-primary text-white border-none shadow-sm hover:shadow-md transition-all">
              <Plus className="h-4 w-4 mr-1" />
              Add Medication Reminder
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>Add Medication Reminder</DialogTitle>
            </DialogHeader>
            <MedicationForm 
              onSubmit={handleAddMedication}
              onCancel={() => setOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </>;
}
