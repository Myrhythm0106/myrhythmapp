
import React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Target, ArrowRight, CheckCircle2 } from "lucide-react";

const FAQ = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Frequently Asked Questions" 
        subtitle="Find answers to common questions about using MyRhythm"
      />

      <Card>
        <CardContent className="p-6">
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="goals-thinking">
              <AccordionTrigger className="text-left text-lg font-medium">
                How should I think about Goals?
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base">
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                  <p className="font-medium text-blue-900 mb-2">Think Simple, Think Big Picture</p>
                  <p className="text-blue-800">
                    A Goal is something important you want to achieve. It might take weeks or months. 
                    Examples: "Walk to the mailbox by myself" or "Read a whole book" or "Cook dinner for my family."
                  </p>
                </div>
                
                <div className="space-y-3">
                  <p><strong>Good Goals:</strong></p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Are specific and clear</li>
                    <li>Matter to YOU personally</li>
                    <li>Can be broken into smaller steps</li>
                    <li>You can picture yourself doing it</li>
                  </ul>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="font-medium text-green-900 mb-2">Remember:</p>
                  <p className="text-green-800">
                    Your goal should excite you, even if it feels challenging. It's okay to start with something that seems hard - we'll break it down together.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="writing-goals">
              <AccordionTrigger className="text-left text-lg font-medium">
                How do I write a Goal?
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base">
                <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
                  <p className="font-medium text-purple-900 mb-2">The Simple Goal Formula</p>
                  <p className="text-purple-800">
                    "I want to [ACTION] by [WHEN]"
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <p className="font-medium text-green-600">✓ Good Examples:</p>
                    <ul className="space-y-2 text-sm bg-green-50 p-3 rounded">
                      <li>"Walk to the mailbox by myself by Christmas"</li>
                      <li>"Read one book by my birthday"</li>
                      <li>"Make scrambled eggs by next month"</li>
                      <li>"Remember my daughter's name easily by summer"</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="font-medium text-red-600">✗ Too Vague:</p>
                    <ul className="space-y-2 text-sm bg-red-50 p-3 rounded">
                      <li>"Get better at walking"</li>
                      <li>"Read more"</li>
                      <li>"Improve my memory"</li>
                      <li>"Be healthier"</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg">
                  <p className="font-medium text-amber-900 mb-2">Writing Tip:</p>
                  <p className="text-amber-800">
                    Write your goal like you're telling a friend. Use simple words. If you can't explain it in one sentence, make it simpler.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="actions-explained">
              <AccordionTrigger className="text-left text-lg font-medium">
                What are Small Steps and Tiny Actions?
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base">
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-5 w-5 text-blue-600" />
                      <p className="font-medium text-blue-900">Small Steps</p>
                    </div>
                    <p className="text-blue-800">
                      These break your big Goal into manageable pieces. Each Small Step gets you closer to your Goal.
                    </p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <p className="font-medium text-green-900">Tiny Actions</p>
                    </div>
                    <p className="text-green-800">
                      These are the actual things you DO each day. They should be so small they feel easy to complete.
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg border">
                  <p className="font-medium mb-4">Example Breakdown:</p>
                  
                  <div className="space-y-4">
                    <div className="bg-white p-3 rounded border-l-4 border-blue-400">
                      <p className="font-medium text-blue-900">🎯 GOAL: Walk to the mailbox by myself</p>
                    </div>
                    
                    <div className="ml-4 space-y-3">
                      <div className="bg-white p-3 rounded border-l-4 border-orange-400">
                        <p className="font-medium text-orange-900">📋 Small Step: Walk to the front door and back</p>
                        <div className="ml-4 mt-2 space-y-1">
                          <p className="text-sm">→ Tiny Action: Today at 10 AM, walk from chair to front door, touch door, walk back</p>
                          <p className="text-sm">→ Tiny Action: Tomorrow at 10 AM, walk to front door, open it, close it, walk back</p>
                        </div>
                      </div>
                      
                      <div className="bg-white p-3 rounded border-l-4 border-orange-400">
                        <p className="font-medium text-orange-900">📋 Small Step: Walk to the driveway and back</p>
                        <div className="ml-4 mt-2 space-y-1">
                          <p className="text-sm">→ Tiny Action: Next week at 10 AM, walk to the driveway, count to 10, walk back</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="font-medium text-green-900 mb-2">Key Rule:</p>
                  <p className="text-green-800">
                    If a Tiny Action takes more than 10 minutes or feels scary, make it smaller. The goal is to succeed every day, not to struggle.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="daily-actions">
              <AccordionTrigger className="text-left text-lg font-medium">
                How do I write good Daily Actions?
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base">
                <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
                  <p className="font-medium text-purple-900 mb-2">The Action Formula</p>
                  <p className="text-purple-800">
                    "On [DAY] at [TIME], I will [DO WHAT] for [HOW LONG]"
                  </p>
                </div>

                <div className="grid gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="font-medium text-green-900 mb-3">✓ Perfect Daily Actions:</p>
                    <ul className="space-y-2 text-sm">
                      <li>"Tuesday at 2 PM, I will walk from my chair to the kitchen counter and back (5 minutes)"</li>
                      <li>"Today at 9 AM, I will read one page of my book out loud (10 minutes)"</li>
                      <li>"Friday at 11 AM, I will crack 2 eggs into a bowl and stir them (5 minutes)"</li>
                    </ul>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="font-medium text-red-900 mb-3">✗ Too Hard or Vague:</p>
                    <ul className="space-y-2 text-sm">
                      <li>"Exercise today" (When? What kind? How long?)</li>
                      <li>"Read for 2 hours" (Too long, might feel overwhelming)</li>
                      <li>"Make a full breakfast" (Too many steps at once)</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg">
                  <p className="font-medium text-amber-900 mb-2">Success Tips:</p>
                  <ul className="space-y-1 text-amber-800">
                    <li>• Pick the same time each day when possible</li>
                    <li>• Choose times when you usually feel good</li>
                    <li>• Make it so easy you can't say no</li>
                    <li>• Celebrate when you complete it!</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="connection">
              <AccordionTrigger className="text-left text-lg font-medium">
                How do Goals and Actions work together?
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base">
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                  <p className="font-medium text-blue-900 mb-2">Think of it like a staircase:</p>
                  <p className="text-blue-800">
                    Your Goal is at the top. Each Small Step is a section of stairs. Each Tiny Action is one single step you take today.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-green-600" />
                    <p>Every Tiny Action you complete moves you closer to your Goal</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-green-600" />
                    <p>The app shows you how much progress you're making</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-green-600" />
                    <p>You can see exactly which Goal each action helps with</p>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="font-medium text-green-900 mb-2">Remember:</p>
                  <p className="text-green-800">
                    Small actions done consistently are more powerful than big actions done rarely. Trust the process - every small step matters!
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default FAQ;
