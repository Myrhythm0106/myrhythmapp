import React, { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { X, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function NonClinicalBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  if (!isVisible) return null;

  return (
    <Alert className="mb-4 border-blue-200 bg-blue-50/80">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertDescription className="flex items-center justify-between">
        <span className="text-blue-800">
          MyRhythm is a support app, not a medical device. 
          <Button 
            variant="link" 
            className="p-0 h-auto text-blue-600 underline ml-1"
            onClick={() => navigate("/legal/disclaimer")}
          >
            Learn more
          </Button>
        </span>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setIsVisible(false)}
          className="text-blue-600 hover:bg-blue-100"
        >
          <X className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  );
}