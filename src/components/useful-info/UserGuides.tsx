
import React from 'react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Repeat, Brain, Target, Heart, Users } from "lucide-react";

export const UserGuides = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5" />
          Complete MyRhythm Guide
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="dashboard">
            <AccordionTrigger className="flex items-center gap-2">
              How to use the Dashboard
            </AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">The Dashboard provides a comprehensive overview of your brain health journey:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>View upcoming appointments and medication reminders</li>
                <li>Track daily mood and energy levels with quick check-ins</li>
                <li>Access your daily gratitude practice and see mood patterns</li>
                <li>Monitor goal progress with visual indicators</li>
                <li>Quick access to brain games and cognitive exercises</li>
                <li>Connect with your support circle and community</li>
                <li>Find emergency resources when needed</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="calendar-recurring">
            <AccordionTrigger className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Calendar & Recurring Events
              <Badge variant="secondary" className="ml-2 text-xs">Updated!</Badge>
            </AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">The Calendar now supports recurring events, perfect for your recovery routine:</p>
              <div className="space-y-3">
                <div>
                  <p className="font-medium">Creating Recurring Events:</p>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Weekly therapy or counseling sessions</li>
                    <li>Daily medication reminders</li>
                    <li>Monthly medical check-ups</li>
                    <li>Regular exercise or cognitive training</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium">Calendar Features:</p>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>View daily, weekly, or monthly layouts</li>
                    <li>Color-coded events for easy recognition</li>
                    <li>Link events to your recovery goals</li>
                    <li>Share schedules with your support circle</li>
                    <li>Smart notifications and reminders</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="goals-tracking">
            <AccordionTrigger className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Goal Setting & Progress Tracking
            </AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">Set and achieve meaningful recovery goals:</p>
              <div className="space-y-3">
                <div>
                  <p className="font-medium">Goal Categories:</p>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li><strong>Mobility:</strong> Physical therapy, walking, balance exercises</li>
                    <li><strong>Cognitive:</strong> Memory games, reading, concentration tasks</li>
                    <li><strong>Health:</strong> Medication adherence, symptom management</li>
                    <li><strong>Personal:</strong> Social activities, hobbies, independence</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium">Tracking Progress:</p>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Visual progress bars and completion percentages</li>
                    <li>Link calendar events to goals automatically</li>
                    <li>Celebrate milestones with achievement badges</li>
                    <li>Share progress with healthcare providers</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="brain-games">
            <AccordionTrigger className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Brain Games & Cognitive Training
            </AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">Strengthen your cognitive abilities with targeted exercises:</p>
              <div className="space-y-3">
                <div>
                  <p className="font-medium">Available Games:</p>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li><strong>Memory Match:</strong> Improve working memory and concentration</li>
                    <li><strong>Sequence Challenge:</strong> Enhance pattern recognition</li>
                    <li><strong>Focus Training:</strong> Develop sustained attention</li>
                    <li><strong>Spatial Navigation:</strong> Strengthen spatial awareness</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium">Adaptive Features:</p>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Difficulty levels adjust to your progress</li>
                    <li>Track improvement over time</li>
                    <li>Set daily cognitive exercise goals</li>
                    <li>Share achievements with your support team</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="symptom-mood">
            <AccordionTrigger>Health Tracking & Mood Monitoring</AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">Monitor your well-being with comprehensive tracking tools:</p>
              <div className="space-y-3">
                <div>
                  <p className="font-medium">Daily Symptom Tracking:</p>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Log symptoms with severity ratings (1-10 scale)</li>
                    <li>Note triggers, medication effects, and environmental factors</li>
                    <li>View trends and patterns over time</li>
                    <li>Generate reports for healthcare providers</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium">Mood & Gratitude Practice:</p>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Daily mood check-ins with emotional awareness</li>
                    <li>Gratitude journaling for positive mental health</li>
                    <li>Energy level tracking throughout the day</li>
                    <li>Correlation insights between mood and activities</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="community-support">
            <AccordionTrigger className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Community & Support Circle
            </AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">Build and maintain meaningful connections throughout your recovery:</p>
              <div className="space-y-3">
                <div>
                  <p className="font-medium">Support Circle Features:</p>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Invite family members, friends, and caregivers</li>
                    <li>Share specific health information safely and securely</li>
                    <li>Coordinate care and appointment schedules</li>
                    <li>Receive and send messages of encouragement</li>
                    <li>Allow selective access to your progress and calendar</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium">Community Engagement:</p>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Join support groups relevant to your condition</li>
                    <li>Participate in meaningful discussions</li>
                    <li>Ask questions to healthcare experts</li>
                    <li>Share experiences and insights with peers</li>
                    <li>Access expert-moderated Q&A sessions</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="advanced-features">
            <AccordionTrigger>Advanced Features & Tips</AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">Make the most of MyRhythm with these advanced features:</p>
              <div className="space-y-3">
                <div>
                  <p className="font-medium">Customization Options:</p>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Adjust text size and contrast for visual comfort</li>
                    <li>Customize notification timing and frequency</li>
                    <li>Set up voice reminders and accessibility features</li>
                    <li>Choose from different calendar and dashboard layouts</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium">Data & Privacy:</p>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Export your data for healthcare appointments</li>
                    <li>Control who has access to your information</li>
                    <li>Secure, encrypted data storage and transmission</li>
                    <li>Complete control over sharing and privacy settings</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border-blue-200 border">
          <h4 className="font-medium text-blue-900 mb-2">💡 Quick Start Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Start with setting up one recurring appointment (like therapy)</li>
            <li>• Try one brain game daily to establish a routine</li>
            <li>• Invite one trusted person to your support circle</li>
            <li>• Set a daily goal that feels achievable and meaningful</li>
            <li>• Use the mood tracker to identify patterns over time</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
