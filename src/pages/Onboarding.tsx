
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserTypeSelector, UserType } from "@/components/onboarding/UserTypeSelector";
import { toast } from "sonner";
import { Brain, CreditCard, ArrowRight, ArrowLeft } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const Onboarding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedPlan = queryParams.get("plan") || "basic";
  
  // Get the step from URL or default to 1 if not present
  const initialStep = parseInt(queryParams.get("step") || "1");
  const [step, setStep] = useState(initialStep);
  const [userType, setUserType] = useState<UserType | null>(null);
  
  const personalInfoSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    location: z.string().optional(),
  });
  
  const paymentInfoSchema = z.object({
    cardName: z.string().min(2, "Name on card is required"),
    cardNumber: z.string().regex(/^[0-9]{16}$/, "Card number must be 16 digits"),
    expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/[0-9]{2}$/, "Please use MM/YY format"),
    cvv: z.string().regex(/^[0-9]{3,4}$/, "CVV must be 3 or 4 digits"),
  });
  
  const personalInfoForm = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: "",
      email: "",
      location: "",
    },
  });
  
  const paymentInfoForm = useForm<z.infer<typeof paymentInfoSchema>>({
    resolver: zodResolver(paymentInfoSchema),
    defaultValues: {
      cardName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
  });

  // Update URL when step changes
  useEffect(() => {
    const newParams = new URLSearchParams(location.search);
    newParams.set("step", step.toString());
    navigate(`${location.pathname}?${newParams.toString()}`, { replace: true });
  }, [step, location.pathname, location.search, navigate]);

  const handleContinue = () => {
    if (step === 1) {
      if (!userType) {
        toast.error("Please select a user type to continue");
        return;
      }
      setStep(2);
    }
  };
  
  const handlePersonalInfoSubmit = (values: z.infer<typeof personalInfoSchema>) => {
    console.log("Personal info:", values);
    completeOnboarding();
  };
  
  const handlePaymentInfoSubmit = (values: z.infer<typeof paymentInfoSchema>) => {
    console.log("Payment info:", values);
    
    // In a real implementation, you would send this info to a payment processor
    // Here we're just simulating a successful payment
    
    // For the basic plan, show that it's a 7-day free trial
    if (selectedPlan === "basic") {
      toast.success("Your 7-day free trial has started. Your card will be charged $7.99 after the trial period.");
    } else {
      toast.success("Payment processed successfully!");
    }
    
    // After successful payment, go to user type selection
    setStep(1);
  };
  
  const completeOnboarding = () => {
    // In a real app, we would save all this information to a database
    toast.success("Account created successfully!");
    navigate("/dashboard");
  };

  const handleBack = () => {
    if (step === 1) {
      // Go back to landing page
      navigate("/");
    } else {
      setStep(step - 1);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-2xl animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2">
            <Brain className="h-10 w-10 text-beacon-600" />
            <h1 className="text-3xl font-bold">MyRhythm</h1>
          </div>
        </div>
        
        <Card className="border-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>
                  {step === 1 && "Personalised Support to O.R.D.E.R your life"}
                  {step === 2 && "Complete your profile"}
                  {step === 3 && "Set up your payment details"}
                </CardTitle>
                <CardDescription>
                  {step === 1 && "Select the option that best describes your situation"}
                  {step === 2 && "Just a few more details to personalize your experience"}
                  {step === 3 && `Set up payment for your ${selectedPlan} plan`}
                </CardDescription>
              </div>
              <div className="text-sm font-medium">
                Step {step} of 3
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {step === 1 ? (
              <div className="space-y-6">
                <UserTypeSelector selectedType={userType} onChange={setUserType} />
                <div className="flex justify-end">
                  <Button onClick={handleContinue} className="gap-2">
                    Next <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : step === 2 ? (
              <Form {...personalInfoForm}>
                <form onSubmit={personalInfoForm.handleSubmit(handlePersonalInfoSubmit)} className="space-y-4">
                  <FormField
                    control={personalInfoForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={personalInfoForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={personalInfoForm.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Location (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="City, State (e.g., Dallas, TX)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="pt-4 flex justify-between">
                    <Button type="button" variant="outline" onClick={handleBack}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                    <Button type="submit" className="gap-2">
                      Complete Setup <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <Form {...paymentInfoForm}>
                <form onSubmit={paymentInfoForm.handleSubmit(handlePaymentInfoSubmit)} className="space-y-4">
                  {selectedPlan === "basic" && (
                    <div className="bg-muted p-4 rounded-md mb-4">
                      <h3 className="font-medium">Basic Plan - 7 Day Free Trial</h3>
                      <p className="text-sm text-muted-foreground">
                        Your card will be charged $7.99/month after your free trial ends. Cancel anytime.
                      </p>
                    </div>
                  )}
                  
                  {selectedPlan === "premium" && (
                    <div className="bg-muted p-4 rounded-md mb-4">
                      <h3 className="font-medium">Premium Plan</h3>
                      <p className="text-sm text-muted-foreground">
                        You will be charged $9.99/month. Cancel anytime.
                      </p>
                    </div>
                  )}
                  
                  {selectedPlan === "family" && (
                    <div className="bg-muted p-4 rounded-md mb-4">
                      <h3 className="font-medium">Family Plan</h3>
                      <p className="text-sm text-muted-foreground">
                        You will be charged $19.99/month. Cancel anytime.
                      </p>
                    </div>
                  )}
                  
                  <FormField
                    control={paymentInfoForm.control}
                    name="cardName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name on Card</FormLabel>
                        <FormControl>
                          <Input placeholder="John Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={paymentInfoForm.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Card Number</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              placeholder="1234 5678 9012 3456" 
                              {...field}
                              onChange={e => {
                                const value = e.target.value.replace(/\s/g, '');
                                if (!/^\d*$/.test(value) || value.length > 16) return;
                                field.onChange(value);
                              }} 
                            />
                            <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={paymentInfoForm.control}
                      name="expiryDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiry Date</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="MM/YY" 
                              {...field} 
                              onChange={e => {
                                const value = e.target.value.replace(/\s/g, '');
                                let formatted = value;
                                if (value.length === 2 && !value.includes('/')) {
                                  formatted = value + '/';
                                }
                                if (formatted.length > 5) return;
                                field.onChange(formatted);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={paymentInfoForm.control}
                      name="cvv"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CVV</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="123" 
                              {...field} 
                              onChange={e => {
                                const value = e.target.value.replace(/\s/g, '');
                                if (!/^\d*$/.test(value) || value.length > 4) return;
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="text-sm text-muted-foreground mt-4">
                    <p>By subscribing, you agree to our Terms of Service and Privacy Policy.</p>
                  </div>
                  
                  <div className="pt-4 flex justify-between">
                    <Button type="button" variant="outline" onClick={handleBack}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                    <Button type="submit">
                      {selectedPlan === "basic" ? "Start Free Trial" : "Complete Payment"}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
