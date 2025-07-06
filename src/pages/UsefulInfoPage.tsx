
import React from 'react';
import { PageLayout } from '@/components/shared/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, ExternalLink, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function UsefulInfoPage() {
  const resources = [
    {
      title: "Brain Injury Association",
      description: "Comprehensive resources and support for brain injury survivors",
      url: "https://www.biausa.org",
      category: "Support Organizations"
    },
    {
      title: "Memory Strategies Guide",
      description: "Practical techniques for improving memory and cognitive function",
      category: "Educational Resources"
    },
    {
      title: "Emergency Contacts",
      description: "Important phone numbers and crisis support lines",
      category: "Emergency Resources"
    },
    {
      title: "Healthcare Provider Directory",
      description: "Find specialists and healthcare providers in your area",
      category: "Medical Resources"
    }
  ];

  return (
    <PageLayout 
      title="Useful Resources" 
      description="Helpful information, links, and contacts for your journey"
    >
      <div className="space-y-6">
        {/* Quick Access Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-800">
                <Phone className="h-5 w-5" />
                Emergency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-red-700 mb-3">
                If you're having a medical emergency, call 911 immediately.
              </p>
              <Button variant="outline" className="w-full border-red-300 text-red-700">
                Emergency Contacts
              </Button>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Mail className="h-5 w-5" />
                Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-700 mb-3">
                Need help with MyRhythm? Contact our support team.
              </p>
              <Button variant="outline" className="w-full border-blue-300 text-blue-700">
                Contact Support
              </Button>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Book className="h-5 w-5" />
                User Guide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-700 mb-3">
                Learn how to get the most out of MyRhythm.
              </p>
              <Button 
                variant="outline" 
                className="w-full border-green-300 text-green-700"
                onClick={() => window.location.href = '/user-guide'}
              >
                View Guide
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Resource Categories */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Resource Library</h2>
          <div className="grid gap-4">
            {resources.map((resource, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{resource.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{resource.category}</p>
                    </div>
                    {resource.url && (
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{resource.description}</p>
                  {!resource.url && (
                    <p className="text-sm text-muted-foreground mt-2 italic">
                      Coming soon - Resource details
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
