
import React from "react";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

const LandingFooter = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-background py-12 border-t">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-8">
          <h3 className="text-xl font-bold mb-4">Have Questions?</h3>
          <p className="text-muted-foreground mb-4">We're here to help.</p>
          <Button variant="outline" className="gap-2">
            <Mail className="h-4 w-4" />
            Contact Us
          </Button>
        </div>
        
        <Separator className="my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-muted-foreground">
              &copy; {currentYear} MyRhythm. All rights reserved.
            </p>
          </div>
          <div className="flex gap-4 text-sm">
            <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/founders-story" className="text-muted-foreground hover:text-foreground transition-colors">
              Our Story
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
