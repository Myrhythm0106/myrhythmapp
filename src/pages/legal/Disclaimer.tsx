import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Phone, Shield, ArrowLeft } from "lucide-react";

export function Disclaimer() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="space-y-6">
        <Card className="border-amber-200 bg-amber-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <AlertTriangle className="h-6 w-6" />
              Important Disclaimer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-amber-900">
            <p className="text-lg font-semibold">
              MyRhythm is a support app and not a medical device.
            </p>
            <p>
              Our platform is designed to help you build structure, remember important tasks, 
              and connect with your support network. We do not provide medical advice, 
              diagnosis, or treatment recommendations.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              What MyRhythm Is
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc list-inside space-y-2">
              <li>A memory and routine support tool</li>
              <li>A platform for connecting with family, friends, and care team</li>
              <li>A way to track daily activities and build healthy habits</li>
              <li>A community space for peer support and encouragement</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>What MyRhythm Is NOT</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc list-inside space-y-2">
              <li>A medical device or clinical assessment tool</li>
              <li>A replacement for professional medical care</li>
              <li>A diagnostic or treatment platform</li>
              <li>A source of medical advice or recommendations</li>
            </ul>
            <p className="text-muted-foreground">
              Always consult with qualified healthcare professionals for medical questions, 
              treatment decisions, or health concerns.
            </p>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <Phone className="h-5 w-5" />
              Emergency Situations
            </CardTitle>
          </CardHeader>
          <CardContent className="text-red-900">
            <p className="font-semibold mb-2">
              In case of a medical emergency, contact your local emergency services immediately:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>UK:</strong> 999 or 112</li>
              <li><strong>US:</strong> 911</li>
              <li><strong>EU:</strong> 112</li>
            </ul>
            <p className="mt-4 text-sm">
              MyRhythm should never be used as a substitute for emergency medical services.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Responsibility</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              By using MyRhythm, you acknowledge that you understand this is a support tool 
              only. You remain responsible for your own health decisions and for seeking 
              appropriate medical care when needed.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}