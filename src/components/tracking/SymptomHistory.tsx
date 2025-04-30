
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, X, ChevronLeft, ChevronRight, HeartPulse, Activity } from "lucide-react";
import { toast } from "sonner";

// Sample data to demonstrate UI (now including blood pressure and steps)
const sampleData = [
  { 
    id: 1, 
    date: "2023-05-15", 
    time: "08:30 AM", 
    symptom: "Headache", 
    severity: 4, 
    notes: "Woke up with throbbing pain on right side of head.",
    bloodPressure: { systolic: 128, diastolic: 82 },
    steps: null 
  },
  { 
    id: 2, 
    date: "2023-05-15", 
    time: "03:15 PM", 
    symptom: "Fatigue", 
    severity: 3, 
    notes: "Feeling very tired after lunch meeting.",
    bloodPressure: null,
    steps: 4500 
  },
  { 
    id: 3, 
    date: "2023-05-16", 
    time: "11:00 AM", 
    symptom: "Dizziness", 
    severity: 2, 
    notes: "Brief episode while standing up quickly.",
    bloodPressure: { systolic: 118, diastolic: 76 },
    steps: 2300
  },
  { 
    id: 4, 
    date: "2023-05-17", 
    time: "09:45 AM", 
    symptom: "Memory Issue", 
    severity: 3, 
    notes: "Difficulty recalling names during conversation.",
    bloodPressure: { systolic: 122, diastolic: 80 },
    steps: null
  },
  { 
    id: 5, 
    date: "2023-05-18", 
    time: "07:00 PM", 
    symptom: "Anxiety", 
    severity: 4, 
    notes: "Feeling anxious about upcoming appointment.",
    bloodPressure: null,
    steps: 7800
  },
];

export function SymptomHistory() {
  const [date, setDate] = React.useState<Date>();
  const [filtered, setFiltered] = React.useState(sampleData);
  const [symptomType, setSymptomType] = React.useState<string>("all");
  
  // In a real app, this would filter based on actual user data
  const handleFilter = () => {
    let results = sampleData;
    
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd");
      results = results.filter(item => item.date === formattedDate);
    }
    
    if (symptomType !== "all") {
      results = results.filter(item => item.symptom.toLowerCase() === symptomType);
    }
    
    setFiltered(results);
    toast.info(`Showing ${results.length} results`);
  };
  
  const clearFilters = () => {
    setDate(undefined);
    setSymptomType("all");
    setFiltered(sampleData);
    toast.info("Filters cleared");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="sm:w-1/3 space-y-2">
          <label className="text-sm font-medium">Filter by date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="sm:w-1/3 space-y-2">
          <label className="text-sm font-medium">Symptom type</label>
          <Select value={symptomType} onValueChange={setSymptomType}>
            <SelectTrigger>
              <SelectValue placeholder="Select symptom type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All symptoms</SelectItem>
              <SelectItem value="headache">Headache</SelectItem>
              <SelectItem value="fatigue">Fatigue</SelectItem>
              <SelectItem value="dizziness">Dizziness</SelectItem>
              <SelectItem value="memory issue">Memory Issues</SelectItem>
              <SelectItem value="anxiety">Anxiety</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="sm:w-1/3 flex items-end gap-2">
          <Button className="flex-1" onClick={handleFilter}>Apply Filters</Button>
          <Button variant="ghost" size="icon" onClick={clearFilters}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((log) => (
            <Card key={log.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{log.symptom}</div>
                    <div className="text-sm text-muted-foreground">{log.date} at {log.time}</div>
                  </div>
                  <div className="bg-muted px-2 py-1 rounded-full text-sm">
                    Severity: {log.severity}/5
                  </div>
                </div>
                
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {log.bloodPressure && (
                    <div className="flex items-center space-x-2 text-sm bg-secondary/20 rounded-md p-2">
                      <HeartPulse className="h-4 w-4 text-primary" />
                      <span>Blood Pressure: {log.bloodPressure.systolic}/{log.bloodPressure.diastolic} mmHg</span>
                    </div>
                  )}
                  
                  {log.steps && (
                    <div className="flex items-center space-x-2 text-sm bg-secondary/20 rounded-md p-2">
                      <Activity className="h-4 w-4 text-primary" />
                      <span>Steps: {log.steps.toLocaleString()}</span>
                    </div>
                  )}
                </div>
                
                {log.notes && (
                  <div className="mt-2 text-sm border-t pt-2">
                    {log.notes}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center p-8 border rounded-lg bg-muted/20">
            <p>No symptom logs found matching your filters.</p>
            <Button variant="link" onClick={clearFilters}>Clear filters</Button>
          </div>
        )}
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" size="sm">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <Button variant="outline" size="sm">
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
