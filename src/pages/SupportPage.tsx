import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  BookOpen, 
  MessageCircle, 
  Mail, 
  Phone, 
  Video, 
  FileText, 
  HelpCircle,
  Search,
  ExternalLink,
  Brain,
  Users,
  Lightbulb
} from "lucide-react";

const SupportPage = () => {
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Help & Support
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We're here to help you get the most out of MyRhythm. Find answers, get support, and connect with our community.
        </p>
      </div>

      {/* Quick Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search for help articles, FAQs, or features..."
              className="pl-10 h-12 text-lg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <BookOpen className="h-8 w-8 text-blue-500" />
              <div>
                <CardTitle>User Guide</CardTitle>
                <p className="text-sm text-muted-foreground">Complete walkthrough</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Step-by-step guides to help you navigate and use all features effectively.
            </p>
            <Button className="w-full">
              Open User Guide
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <MessageCircle className="h-8 w-8 text-green-500" />
              <div>
                <CardTitle>Live Chat</CardTitle>
                <p className="text-sm text-muted-foreground">Get instant help</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Chat with our support team for immediate assistance with any questions.
            </p>
            <Button className="w-full">
              Start Chat
              <MessageCircle className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Video className="h-8 w-8 text-purple-500" />
              <div>
                <CardTitle>Video Tutorials</CardTitle>
                <p className="text-sm text-muted-foreground">Visual learning</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Watch helpful video tutorials to master MyRhythm features.
            </p>
            <Button className="w-full">
              Watch Videos
              <Video className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Popular Help Topics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <HelpCircle className="h-5 w-5 mr-2" />
            Popular Help Topics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: Brain, title: "Getting Started with Brain Training", description: "Learn how to use our cognitive exercises effectively" },
              { icon: Users, title: "Setting Up Your Support Circle", description: "Connect with family and friends for accountability" },
              { icon: Lightbulb, title: "Understanding Your Progress", description: "How to read your analytics and track improvement" },
              { icon: FileText, title: "Managing Your Account", description: "Account settings, privacy, and subscription options" }
            ].map((topic, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <topic.icon className="h-6 w-6 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">{topic.title}</h3>
                  <p className="text-sm text-muted-foreground">{topic.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Contact Our Support Team</CardTitle>
            <p className="text-muted-foreground">
              Send us a message and we'll get back to you within 24 hours.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Your Email</label>
              <Input type="email" placeholder="your.email@example.com" />
            </div>
            <div>
              <label className="text-sm font-medium">Subject</label>
              <Input placeholder="What can we help you with?" />
            </div>
            <div>
              <label className="text-sm font-medium">Message</label>
              <Textarea 
                placeholder="Please describe your question or issue in detail..."
                rows={5}
              />
            </div>
            <Button className="w-full">
              <Mail className="mr-2 h-4 w-4" />
              Send Message
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Other Ways to Reach Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium">Phone Support</p>
                <p className="text-sm text-muted-foreground">1-800-MYRHYTHM (Mon-Fri, 9AM-6PM EST)</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium">Email Support</p>
                <p className="text-sm text-muted-foreground">support@myrhythm.app</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-purple-500" />
              <div>
                <p className="font-medium">Community Forum</p>
                <p className="text-sm text-muted-foreground">Connect with other users and share experiences</p>
              </div>
            </div>

            <Button variant="outline" className="w-full">
              Visit Community Forum
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Resources */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-800">Need Immediate Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-700 mb-4">
            If you're experiencing a medical emergency or mental health crisis, please contact emergency services immediately.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="destructive">
              Emergency Services: 911
            </Button>
            <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
              Crisis Support: 988
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportPage;