import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { 
  Info, 
  BookOpen, 
  HelpCircle, 
  FileText, 
  Youtube,
  Heart
} from "lucide-react";
import { TutorialModal } from '@/components/tutorial/TutorialModal';

const UsefulInfo = () => {
  const [showTutorial, setShowTutorial] = React.useState(false);

  return (
    <ScrollArea className="h-[calc(100vh-64px)]">
      <div className="space-y-6 p-4">
        <PageHeader
          title="Useful Information"
          subtitle="Guides, tutorials and helpful resources"
        >
          <Button onClick={() => setShowTutorial(true)}>
            <Info className="mr-2 h-4 w-4" />
            App Tutorial
          </Button>
        </PageHeader>

        <Tabs defaultValue="guides" className="space-y-4">
          <TabsList className="w-full flex justify-between md:justify-start space-x-2">
            <TabsTrigger value="guides" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden md:inline">User Guides</span>
              <span className="md:hidden">Guides</span>
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              <span className="hidden md:inline">Frequently Asked Questions</span>
              <span className="md:hidden">FAQ</span>
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center gap-2">
              <Youtube className="h-4 w-4" />
              <span className="hidden md:inline">Tutorial Videos</span>
              <span className="md:hidden">Videos</span>
            </TabsTrigger>
            <TabsTrigger value="terms" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden md:inline">Terms & Privacy</span>
              <span className="md:hidden">Terms</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="guides" className="space-y-4">
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
          </TabsContent>
          
          <TabsContent value="faq" className="space-y-4">
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
          </TabsContent>
          
          <TabsContent value="videos" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tutorial Videos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Getting Started with MyRhythm", 
                    "How to Track Symptoms Effectively",
                    "Managing Your Calendar",
                    "Using the Community Features",
                    "Setting Up Your Support Circle",
                    "Privacy and Security Features"
                  ].map((title, index) => (
                    <Card key={index} className="flex items-center p-4">
                      <div className="bg-muted rounded-md p-6 mr-4">
                        <Youtube className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{title}</h3>
                        <p className="text-sm text-muted-foreground">3:24</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="terms" className="space-y-4">
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
          </TabsContent>
        </Tabs>
      </div>
      <TutorialModal isOpen={showTutorial} onComplete={() => setShowTutorial(false)} />
    </ScrollArea>
  );
};

export default UsefulInfo;
