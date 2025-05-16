
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function SupportInfo() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold text-foreground">Getting Support</h2>
      <p className="text-foreground">
        If you need assistance with MyRhythm, there are several ways to get help:
      </p>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">In-App Resources</CardTitle>
          </CardHeader>
          <CardContent className="text-foreground">
            <p>Visit the Resources section for user guides, FAQs, and tutorial videos.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Contact Support</CardTitle>
          </CardHeader>
          <CardContent className="text-foreground">
            <p>Reach out to our support team through the Help & Support section in the app.</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
