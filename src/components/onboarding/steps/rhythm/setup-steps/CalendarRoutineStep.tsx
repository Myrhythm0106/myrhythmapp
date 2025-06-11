
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Calendar, Clock, Plus, X } from "lucide-react";

interface CalendarRoutineStepProps {
  onComplete: (data: any) => void;
  assessmentResult: any;
}

export function CalendarRoutineStep({ onComplete, assessmentResult }: CalendarRoutineStepProps) {
  const [routineData, setRoutineData] = useState({
    recurringAppointments: [] as Array<{
      title: string;
      type: string;
      frequency: string;
      day: string;
      time: string;
    }>,
    medicationTimes: [] as Array<{
      name: string;
      times: string[];
    }>,
    dailyRoutineEnabled: true,
    wakeTime: "07:00",
    sleepTime: "22:00"
  });

  const appointmentTypes = [
    "Physical Therapy",
    "Occupational Therapy", 
    "Speech Therapy",
    "Doctor Visit",
    "Counseling/Psychology",
    "Support Group",
    "Other Medical"
  ];

  const addAppointment = () => {
    setRoutineData(prev => ({
      ...prev,
      recurringAppointments: [...prev.recurringAppointments, {
        title: "",
        type: "",
        frequency: "weekly",
        day: "",
        time: ""
      }]
    }));
  };

  const updateAppointment = (index: number, field: string, value: string) => {
    setRoutineData(prev => ({
      ...prev,
      recurringAppointments: prev.recurringAppointments.map((apt, i) => 
        i === index ? { ...apt, [field]: value } : apt
      )
    }));
  };

  const removeAppointment = (index: number) => {
    setRoutineData(prev => ({
      ...prev,
      recurringAppointments: prev.recurringAppointments.filter((_, i) => i !== index)
    }));
  };

  const handleContinue = () => {
    onComplete(routineData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Calendar & Routine Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Recurring Appointments */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">Recurring Appointments</Label>
            <Button variant="outline" size="sm" onClick={addAppointment}>
              <Plus className="h-4 w-4 mr-2" />
              Add Appointment
            </Button>
          </div>
          
          {routineData.recurringAppointments.length === 0 ? (
            <div className="text-center p-6 border-2 border-dashed rounded-lg">
              <Calendar className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No recurring appointments yet</p>
              <p className="text-sm text-muted-foreground">Add your regular therapy sessions, doctor visits, etc.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {routineData.recurringAppointments.map((appointment, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="grid grid-cols-2 gap-3 flex-1">
                      <div>
                        <Label htmlFor={`apt-type-${index}`}>Type</Label>
                        <Select value={appointment.type} onValueChange={(value) => updateAppointment(index, 'type', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {appointmentTypes.map(type => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor={`apt-title-${index}`}>Specific Name/Location</Label>
                        <Input
                          id={`apt-title-${index}`}
                          value={appointment.title}
                          onChange={(e) => updateAppointment(index, 'title', e.target.value)}
                          placeholder="e.g., Sunshine Physical Therapy"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`apt-day-${index}`}>Day</Label>
                        <Select value={appointment.day} onValueChange={(value) => updateAppointment(index, 'day', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select day" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monday">Monday</SelectItem>
                            <SelectItem value="tuesday">Tuesday</SelectItem>
                            <SelectItem value="wednesday">Wednesday</SelectItem>
                            <SelectItem value="thursday">Thursday</SelectItem>
                            <SelectItem value="friday">Friday</SelectItem>
                            <SelectItem value="saturday">Saturday</SelectItem>
                            <SelectItem value="sunday">Sunday</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor={`apt-time-${index}`}>Time</Label>
                        <Input
                          id={`apt-time-${index}`}
                          type="time"
                          value={appointment.time}
                          onChange={(e) => updateAppointment(index, 'time', e.target.value)}
                        />
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeAppointment(index)} className="ml-2">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Daily Routine */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="dailyRoutine"
              checked={routineData.dailyRoutineEnabled}
              onCheckedChange={(checked) => setRoutineData(prev => ({ ...prev, dailyRoutineEnabled: checked as boolean }))}
            />
            <Label htmlFor="dailyRoutine" className="text-base font-medium">
              Set up basic daily routine framework
            </Label>
          </div>
          
          {routineData.dailyRoutineEnabled && (
            <div className="grid grid-cols-2 gap-4 pl-6">
              <div>
                <Label htmlFor="wakeTime">Typical wake time</Label>
                <Input
                  id="wakeTime"
                  type="time"
                  value={routineData.wakeTime}
                  onChange={(e) => setRoutineData(prev => ({ ...prev, wakeTime: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="sleepTime">Typical bedtime</Label>
                <Input
                  id="sleepTime"
                  type="time"
                  value={routineData.sleepTime}
                  onChange={(e) => setRoutineData(prev => ({ ...prev, sleepTime: e.target.value }))}
                />
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 border-t">
          <Button onClick={handleContinue} className="w-full">
            Continue to Goal Framework
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
