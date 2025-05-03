
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export const TermsPolicies = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Terms of Service & Privacy Policy</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-4">
          <Button variant="outline" className="justify-start">
            <FileText className="mr-2 h-4 w-4" />
            Terms of Service
          </Button>
          <Button variant="outline" className="justify-start">
            <FileText className="mr-2 h-4 w-4" />
            Privacy Policy
          </Button>
          <Button variant="outline" className="justify-start">
            <FileText className="mr-2 h-4 w-4" />
            Data Processing Agreement
          </Button>
          <Button variant="outline" className="justify-start">
            <FileText className="mr-2 h-4 w-4" />
            Cookie Policy
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
