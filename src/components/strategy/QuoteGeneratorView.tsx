
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Share2, 
  Calendar, 
  Search,
  Copy,
  Twitter,
  Facebook,
  Linkedin,
  Instagram,
  Heart,
  MessageCircle,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";

export function QuoteGeneratorView() {
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [scheduledPosts, setScheduledPosts] = useState([]);

  // Sample quotes from your 90-day collection
  const quotes = [
    {
      day: 1,
      week: 1,
      quote: "Your brain isn't broken—it's learning a new rhythm. Every small step creates new pathways to possibility.",
      attribution: "MyRhythm Founder",
      theme: "Foundation",
      tags: ["neuroplasticity", "hope", "recovery"]
    },
    {
      day: 2,
      week: 1,
      quote: "I discovered that healing isn't about going back to who you were, but growing into who you're meant to become.",
      attribution: "MyRhythm Journey",
      theme: "Growth",
      tags: ["healing", "transformation", "growth"]
    },
    {
      day: 3,
      week: 1,
      quote: "The most powerful recovery tool isn't medication or therapy alone—it's believing your brain can adapt, grow, and thrive again.",
      attribution: "Brain Health Advocate",
      theme: "Empowerment",
      tags: ["recovery", "belief", "empowerment"]
    },
    // Add more quotes as needed...
  ];

  const filteredQuotes = quotes.filter(quote => 
    quote.week === selectedWeek && 
    (quote.quote.toLowerCase().includes(searchTerm.toLowerCase()) ||
     quote.theme.toLowerCase().includes(searchTerm.toLowerCase()) ||
     quote.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Quote copied to clipboard!");
  };

  const schedulePost = (quote, platform) => {
    setScheduledPosts(prev => [...prev, { quote, platform, scheduledFor: new Date() }]);
    toast.success(`Scheduled for ${platform}!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <CardHeader>
          <CardTitle className="mobile-heading-md flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            90-Day Brain Health Quote Generator
          </CardTitle>
          <p className="text-purple-100">Transform your quotes into powerful marketing content</p>
        </CardHeader>
      </Card>

      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="w-full overflow-x-auto flex md:grid md:grid-cols-4 gap-1">
          <TabsTrigger value="browse" className="flex-shrink-0">
            <span className="hidden sm:inline">Browse Quotes</span>
            <span className="sm:hidden">Browse</span>
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex-shrink-0">
            <span className="hidden sm:inline">Content Calendar</span>
            <span className="sm:hidden">Schedule</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex-shrink-0">
            <span className="hidden sm:inline">Performance</span>
            <span className="sm:hidden">Stats</span>
          </TabsTrigger>
          <TabsTrigger value="generate" className="flex-shrink-0">
            <span className="hidden sm:inline">AI Variants</span>
            <span className="sm:hidden">AI</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search quotes by theme, content, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((week) => (
                <Button
                  key={week}
                  variant={selectedWeek === week ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedWeek(week)}
                >
                  Week {week}
                </Button>
              ))}
            </div>
          </div>

          {/* Quote Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredQuotes.map((quoteItem, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge variant="secondary">Day {quoteItem.day}</Badge>
                      <Badge variant="outline" className="ml-2">{quoteItem.theme}</Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(quoteItem.quote)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <blockquote className="text-lg italic border-l-4 border-purple-500 pl-4">
                    "{quoteItem.quote}"
                  </blockquote>
                  <p className="text-sm text-gray-600">- {quoteItem.attribution}</p>
                  
                  <div className="flex flex-wrap gap-1">
                    {quoteItem.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="text-sm text-gray-500">Share on:</span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => schedulePost(quoteItem, 'Twitter')}
                      >
                        <Twitter className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => schedulePost(quoteItem, 'LinkedIn')}
                      >
                        <Linkedin className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => schedulePost(quoteItem, 'Instagram')}
                      >
                        <Instagram className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => schedulePost(quoteItem, 'Facebook')}
                      >
                        <Facebook className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Content Publishing Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                  <div key={day} className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-3">{day}</h4>
                    <div className="space-y-2">
                      <div className="p-2 bg-blue-50 rounded text-xs">
                        <div className="font-medium">9:00 AM</div>
                        <div>LinkedIn Quote</div>
                      </div>
                      <div className="p-2 bg-purple-50 rounded text-xs">
                        <div className="font-medium">3:00 PM</div>
                        <div>Instagram Story</div>
                      </div>
                      <div className="p-2 bg-green-50 rounded text-xs">
                        <div className="font-medium">7:00 PM</div>
                        <div>Twitter Thread</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Engagement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mobile-heading-lg font-bold">4.2K</div>
                <p className="text-sm text-gray-600">Total likes this month</p>
                <div className="text-green-600 text-sm mt-1">↗ +23% vs last month</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-blue-500" />
                  Comments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mobile-heading-lg font-bold">892</div>
                <p className="text-sm text-gray-600">Total comments this month</p>
                <div className="text-green-600 text-sm mt-1">↗ +18% vs last month</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-green-500" />
                  Shares
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mobile-heading-lg font-bold">156</div>
                <p className="text-sm text-gray-600">Total shares this month</p>
                <div className="text-green-600 text-sm mt-1">↗ +31% vs last month</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Performing Quotes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {quotes.slice(0, 3).map((quote, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                    <Badge className="mt-1">#{index + 1}</Badge>
                    <div className="flex-1">
                      <p className="font-medium">"{quote.quote.substring(0, 100)}..."</p>
                      <div className="flex gap-4 mt-2 text-sm text-gray-600">
                        <span>❤️ 432 likes</span>
                        <span>💬 89 comments</span>
                        <span>🔄 23 shares</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                AI Quote Variations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Generate variations of your quotes for different platforms and audiences.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">LinkedIn Version</h4>
                    <p className="text-sm">Professional, longer format with call-to-action</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Generate
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Twitter Thread</h4>
                    <p className="text-sm">Break into multiple tweets with hashtags</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Generate
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Instagram Caption</h4>
                    <p className="text-sm">Visual-friendly with emojis and hashtags</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Generate
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Blog Post Opener</h4>
                    <p className="text-sm">Expanded into article introduction</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Generate
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
