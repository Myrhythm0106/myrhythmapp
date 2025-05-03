
import React from 'react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const UserGuides = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Getting Started</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>How to use the Dashboard</AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">The Dashboard provides a quick overview of your brain health journey:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>View your upcoming appointments and medication reminders</li>
                <li>Track symptoms and see recent patterns</li>
                <li>Access community discussions and resources</li>
                <li>Find emergency resources when needed</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Tracking your symptoms</AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">The Symptom Tracker helps you record and analyze your health:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Log symptoms daily with the tracking form</li>
                <li>Rate severity on a scale of 1-10</li>
                <li>Note triggers or factors that may have contributed</li>
                <li>View trends and patterns in the history section</li>
                <li>Share reports with healthcare providers</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Managing your calendar</AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">The Calendar helps you stay organized:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Add appointments with healthcare providers</li>
                <li>Set medication reminders</li>
                <li>Schedule self-care activities</li>
                <li>View daily, weekly, or monthly views</li>
                <li>Get notifications for upcoming events</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>Using the community features</AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">The Community section connects you with others:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Join support groups relevant to your condition</li>
                <li>Participate in discussions</li>
                <li>Ask questions to healthcare experts</li>
                <li>Share your experiences and insights</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger>Managing your support circle</AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">My Support Circle helps you coordinate with loved ones:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Invite family members, friends, and caregivers</li>
                <li>Share specific health information safely</li>
                <li>Coordinate care and appointments</li>
                <li>Send and receive messages of support</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};
