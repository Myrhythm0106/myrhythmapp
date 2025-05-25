
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Brain, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EventForm } from "@/components/calendar/EventForm";

export function StickyActionBar() {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 md:flex-row md:bottom-6 md:right-6">
      <div className="bg-white/90 backdrop-blur-sm border rounded-full p-2 shadow-lg flex gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="rounded-full">
              <Plus className="h-4 w-4 mr-1" />
              Add Action
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add New Action</DialogTitle>
            </DialogHeader>
            <EventForm />
          </DialogContent>
        </Dialog>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="rounded-full"
          onClick={() => navigate("/calendar")}
        >
          <Calendar className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="rounded-full"
          onClick={() => navigate("/brain-games")}
        >
          <Brain className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="rounded-full"
          onClick={() => navigate("/gratitude")}
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
