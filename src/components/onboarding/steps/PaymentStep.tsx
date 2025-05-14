
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PlanType } from "./PlanStep";

const paymentSchema = z.object({
  cardName: z.string().min(2, "Name on card is required"),
  cardNumber: z.string().regex(/^[0-9]{16}$/, "Card number must be 16 digits"),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/[0-9]{2}$/, "Please use MM/YY format"),
  cvv: z.string().regex(/^[0-9]{3,4}$/, "CVV must be 3 or 4 digits"),
});

export type PaymentFormValues = z.infer<typeof paymentSchema>;

interface PaymentStepProps {
  onComplete: (values: PaymentFormValues) => void;
  selectedPlan: PlanType;
}

export const PaymentStep = ({ onComplete, selectedPlan }: PaymentStepProps) => {
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
    mode: "onChange",
  });

  const planInfo = {
    basic: { name: "Basic Plan", price: "$7.99/month", trial: "7 Day Free Trial" },
    premium: { name: "Premium Plan", price: "$9.99/month" },
    family: { name: "Family Plan", price: "$19.99/month" }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onComplete)} className="space-y-4">
        <div className="bg-muted p-4 rounded-md mb-4">
          <h3 className="font-medium">{planInfo[selectedPlan].name}</h3>
          <p className="text-sm text-muted-foreground">
            {selectedPlan === "basic" 
              ? `${planInfo.basic.trial} - Your card will be charged ${planInfo.basic.price} after trial ends.` 
              : `You will be charged ${planInfo[selectedPlan].price}.`} 
            Cancel anytime.
          </p>
        </div>
        
        <FormField
          control={form.control}
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
          control={form.control}
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
            control={form.control}
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
            control={form.control}
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
        
        <div className="pt-4 flex justify-end">
          <Button 
            type="submit"
            disabled={!form.formState.isValid}
          >
            {selectedPlan === "basic" ? "Start Free Trial" : "Complete Payment"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
