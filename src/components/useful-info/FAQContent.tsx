
import React from 'react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const FAQContent = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Frequently Asked Questions</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="faq-1">
            <AccordionTrigger>How is my data protected?</AccordionTrigger>
            <AccordionContent>
              <p>Your data is encrypted both in transit and at rest. We use industry-standard security protocols and regular security audits to ensure your information remains private. You control exactly what is shared with healthcare providers or support circle members.</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="faq-2">
            <AccordionTrigger>Can I export my health data?</AccordionTrigger>
            <AccordionContent>
              <p>Yes, you can export your symptom tracking data, medication history, and appointment records as PDF reports or CSV files. This makes it easy to share information with healthcare providers or keep for your personal records.</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="faq-3">
            <AccordionTrigger>How do I change my subscription plan?</AccordionTrigger>
            <AccordionContent>
              <p>To change your subscription plan, go to your Profile page and select the "Subscription" tab. From there, you can upgrade, downgrade, or cancel your subscription. Changes to your plan will take effect at the start of your next billing cycle.</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="faq-4">
            <AccordionTrigger>Is MyRhythm replacing medical care?</AccordionTrigger>
            <AccordionContent>
              <p>No, MyRhythm is designed to complement your medical care, not replace it. The app helps you track symptoms, manage appointments, and connect with support networks, but you should always consult with healthcare professionals for medical advice and treatment.</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="faq-5">
            <AccordionTrigger>How do I contact support?</AccordionTrigger>
            <AccordionContent>
              <p>For technical support or questions about your account, you can reach our support team by tapping on "Help & Support" in the sidebar menu. You can also email us directly at support@myrhythm.app.</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};
