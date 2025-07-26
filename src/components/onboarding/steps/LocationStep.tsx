
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Globe, Building } from "lucide-react";

const locationSchema = z.object({
  country: z.string().min(1, "Please enter your country"),
  state: z.string().min(1, "Please enter your state or province"),
  town: z.string().min(1, "Please enter your city or town"),
});

export type LocationFormValues = z.infer<typeof locationSchema>;

interface LocationStepProps {
  onComplete: (values: LocationFormValues) => void;
  initialValues?: LocationFormValues;
}

export function LocationStep({ onComplete, initialValues }: LocationStepProps) {
  const [hasCompleted, setHasCompleted] = useState(false);
  
  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: initialValues || {
      country: "",
      state: "",
      town: "",
    }
  });

  function onSubmit(values: LocationFormValues) {
    console.log("LocationStep: Form submitted with values:", values);
    setHasCompleted(true);
    onComplete(values);
  }

  const isFormValid = form.formState.isValid && 
                     form.watch('country') && 
                     form.watch('state') && 
                     form.watch('town');
  
  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Step 2: Where are you located?
        </h2>
        <p className="text-lg text-muted-foreground">
          This helps us provide region-specific resources and support options.
          <br />
          <span className="text-sm font-medium text-blue-600">
            ✨ This step is optional - you can skip it if you prefer
          </span>
        </p>
      </div>

      <Card className="border-2 border-border/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <MapPin className="h-6 w-6 text-primary" />
            Your Location Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Country <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., United States, United Kingdom, Canada..." 
                        {...field} 
                        className="h-12 text-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      State/Province <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., California, Ontario, New South Wales..." 
                        {...field} 
                        className="h-12 text-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="town"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      City/Town <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Los Angeles, Toronto, Sydney..." 
                        {...field} 
                        className="h-12 text-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                <Button 
                  type="submit" 
                  disabled={!isFormValid}
                  className="w-full h-12 text-lg"
                >
                  Save My Location
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => onComplete({ country: "Not specified", state: "Not specified", town: "Not specified" })}
                  className="w-full h-12 text-lg text-muted-foreground hover:text-foreground"
                >
                  Skip This Step
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {hasCompleted && (
        <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-green-800 font-medium">
            ✓ Location details saved! Click Continue to choose your plan.
          </p>
        </div>
      )}

      <div className="text-center text-sm text-muted-foreground bg-blue-50 p-4 rounded-lg">
        <p className="font-medium mb-2">🔒 Privacy Notice</p>
        <p>Your location helps us provide relevant resources and support. We never share your specific location data.</p>
      </div>
    </div>
  );
}
