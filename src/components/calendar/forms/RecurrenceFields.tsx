
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Card, CardContent } from "@/components/ui/card";
import { Repeat, ChevronDown, ChevronRight, Calendar, Info } from "lucide-react";
import { ActionFormValues } from "./actionFormSchema";
import { addDays, addWeeks, addMonths, addYears, format } from "date-fns";

const WEEKDAYS = [
  { value: "monday", label: "Mon" },
  { value: "tuesday", label: "Tue" },
  { value: "wednesday", label: "Wed" },
  { value: "thursday", label: "Thu" },
  { value: "friday", label: "Fri" },
  { value: "saturday", label: "Sat" },
  { value: "sunday", label: "Sun" },
];

export function RecurrenceFields() {
  const form = useFormContext<ActionFormValues>();
  const [isOpen, setIsOpen] = useState(false);
  
  const recurrencePattern = form.watch("recurrencePattern");
  const recurrenceInterval = form.watch("recurrenceInterval");
  const startDate = form.watch("date");
  const recurrenceDaysOfWeek = form.watch("recurrenceDaysOfWeek") || [];

  // Generate preview of next occurrences
  const generatePreview = () => {
    if (recurrencePattern === "none" || !startDate) return [];
    
    const previews = [];
    let currentDate = new Date(startDate);
    
    for (let i = 0; i < 3; i++) {
      switch (recurrencePattern) {
        case "daily":
          currentDate = addDays(currentDate, recurrenceInterval);
          break;
        case "weekly":
          currentDate = addWeeks(currentDate, recurrenceInterval);
          break;
        case "monthly":
          currentDate = addMonths(currentDate, recurrenceInterval);
          break;
        case "yearly":
          currentDate = addYears(currentDate, recurrenceInterval);
          break;
      }
      previews.push(new Date(currentDate));
    }
    
    return previews;
  };

  const previewDates = generatePreview();

  const handlePatternChange = (value: string) => {
    form.setValue("recurrencePattern", value as ActionFormValues["recurrencePattern"]);
    if (value === "none") {
      setIsOpen(false);
      // Clear recurrence fields when disabled
      form.setValue("recurrenceInterval", 1);
      form.setValue("recurrenceEndDate", "");
      form.setValue("recurrenceCount", undefined);
      form.setValue("recurrenceDaysOfWeek", []);
    } else {
      setIsOpen(true);
    }
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="recurrencePattern"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Repeat className="h-4 w-4" />
              Repeat Event
            </FormLabel>
            <Select onValueChange={handlePatternChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Choose repeat pattern" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="none">Don't repeat</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <Collapsible open={isOpen && recurrencePattern !== "none"} onOpenChange={setIsOpen}>
        <CollapsibleContent className="space-y-4">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Interval */}
                <FormField
                  control={form.control}
                  name="recurrenceInterval"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Every</FormLabel>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            max={365}
                            className="w-20"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                          />
                        </FormControl>
                        <span className="text-sm text-muted-foreground">
                          {recurrencePattern === "daily" && (recurrenceInterval === 1 ? "day" : "days")}
                          {recurrencePattern === "weekly" && (recurrenceInterval === 1 ? "week" : "weeks")}
                          {recurrencePattern === "monthly" && (recurrenceInterval === 1 ? "month" : "months")}
                          {recurrencePattern === "yearly" && (recurrenceInterval === 1 ? "year" : "years")}
                        </span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* End condition */}
                <div className="space-y-3">
                  <FormLabel>End repeat</FormLabel>
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="recurrenceEndDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="date"
                              placeholder="End date (optional)"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="text-xs text-muted-foreground">Or leave blank to repeat indefinitely</div>
                  </div>
                </div>
              </div>

              {/* Days of week for weekly pattern */}
              {recurrencePattern === "weekly" && (
                <FormField
                  control={form.control}
                  name="recurrenceDaysOfWeek"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Repeat on days</FormLabel>
                      <FormControl>
                        <div className="flex flex-wrap gap-2">
                          {WEEKDAYS.map((day) => (
                            <div key={day.value} className="flex items-center space-x-2">
                              <Checkbox
                                id={day.value}
                                checked={recurrenceDaysOfWeek.includes(day.value as any)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...recurrenceDaysOfWeek, day.value]);
                                  } else {
                                    field.onChange(recurrenceDaysOfWeek.filter((d) => d !== day.value));
                                  }
                                }}
                              />
                              <label 
                                htmlFor={day.value}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {day.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Preview section */}
              {recurrencePattern !== "none" && previewDates.length > 0 && (
                <div className="mt-4 p-3 bg-muted/30 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Next occurrences:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {previewDates.map((date, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {format(date, "MMM d, yyyy")}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Helpful tip */}
              <div className="mt-4 flex items-start gap-2 p-2 bg-blue-50 rounded-md">
                <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-blue-600">
                  <strong>Tip:</strong> You can edit individual occurrences later, or modify the entire series at once.
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
