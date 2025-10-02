import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Mail, User, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface InitialRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegistrationComplete: (userData: { fullName: string; email: string }) => void;
}

export function InitialRegistrationModal({ isOpen, onClose, onRegistrationComplete }: InitialRegistrationModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName.trim() || !email.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      // Store data temporarily in localStorage for the flow
      const userData = { fullName: fullName.trim(), email: email.trim() };
      localStorage.setItem('registration_data', JSON.stringify(userData));

      // Prepare verification email in background (will send after payment)
      console.log("Registration data stored:", userData);
      
      toast.success("Great! Let's choose your plan");
      onRegistrationComplete(userData);
      onClose();
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-memory-emerald-600 to-brain-health-600 bg-clip-text text-transparent">
            <Sparkles className="h-6 w-6 inline-block mr-2 text-memory-emerald-500" />
            Welcome to MyRhythm
          </DialogTitle>
          <DialogDescription className="text-center text-base text-brain-health-700 pt-2">
            Take control of your cognitive health journey. Let's start with some basic information.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium">
                <User className="h-4 w-4 inline mr-1" />
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isSubmitting}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                <Mail className="h-4 w-4 inline mr-1" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                required
                className="h-11"
              />
            </div>
          </div>

          <div className="bg-gradient-to-r from-clarity-teal-50 to-brain-health-50 p-4 rounded-lg border border-clarity-teal-200">
            <p className="text-sm text-brain-health-700 text-center">
              ✨ <strong>7-Day Free Trial</strong> • No payment required to start<br />
              We'll send you a confirmation email after you choose your plan
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 hover:from-memory-emerald-600 hover:to-brain-health-600 text-white"
            >
              {isSubmitting ? "Processing..." : "Continue"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
