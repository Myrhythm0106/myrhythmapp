
import React from "react";
import { Preview3Background } from "@/components/ui/Preview3Background";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info, Brain, Heart, BookOpen, ExternalLink, Star, Download } from "lucide-react";

export default function UsefulInfoPage() {
  return (
    <Preview3Background>
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
              <Info className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Memory1st Resource Center
              </h1>
              <p className="text-muted-foreground">Evidence-Based Information for Your LEAP Journey</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-l-4 border-l-blue-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-600" />
                Memory1st Foundations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Understanding Neuroplasticity</span>
                    <Badge variant="secondary">Essential</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">How your brain adapts and heals through gentle, consistent practice</p>
                </div>
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Memory-First Principles</span>
                    <Badge variant="secondary">Core</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">The science behind our gentle, brain-friendly approach</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <BookOpen className="w-4 h-4 mr-2" />
                Explore Foundations
              </Button>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-indigo-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-indigo-600" />
                LEAP Empowerment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Building Emotional Resilience</span>
                    <Badge variant="secondary">Popular</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Gentle strategies for emotional strength and stability</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Empowerment Mindset</span>
                    <Badge variant="secondary">Featured</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Cultivating confidence and self-efficacy through LEAP principles</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <Star className="w-4 h-4 mr-2" />
                Discover LEAP
              </Button>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-600" />
                Research & Studies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Clinical Evidence</span>
                    <Badge variant="secondary">Updated</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Latest research supporting Memory1st approaches</p>
                </div>
                <div className="p-3 bg-violet-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Success Stories</span>
                    <Badge variant="secondary">Inspiring</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Real LEAP journeys and empowerment outcomes</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Research
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Reference Guides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Memory1st Daily Practices</span>
                  <Button size="sm" variant="outline">
                    <Download className="w-3 h-3 mr-1" />
                    PDF
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">LEAP Goal Setting Framework</span>
                  <Button size="sm" variant="outline">
                    <Download className="w-3 h-3 mr-1" />
                    PDF
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Gentle Progress Tracking</span>
                  <Button size="sm" variant="outline">
                    <Download className="w-3 h-3 mr-1" />
                    PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>External Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Brain Health Institute</span>
                    <ExternalLink className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-xs text-muted-foreground">Comprehensive brain health information and resources</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Empowerment Psychology Hub</span>
                    <ExternalLink className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-xs text-muted-foreground">Evidence-based empowerment and resilience strategies</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Support Community Forums</span>
                    <ExternalLink className="w-4 h-4 text-purple-600" />
                  </div>
                  <p className="text-xs text-muted-foreground">Connect with others on similar Memory1st journeys</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <Info className="h-12 w-12 text-blue-600 mx-auto" />
              <h3 className="text-xl font-semibold">Evidence-Based, Hope-Filled Resources</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our Resource Center combines Memory1st scientific foundations with empowering LEAP principles. 
                Every piece of information is carefully curated to support your gentle journey toward greater 
                confidence, resilience, and well-being. Knowledge becomes power when it's accessible, 
                understandable, and actionable.
              </p>
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">150+</div>
                  <div className="text-xs text-muted-foreground">Resources</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">25</div>
                  <div className="text-xs text-muted-foreground">Research Papers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">12</div>
                  <div className="text-xs text-muted-foreground">Quick Guides</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Preview3Background>
  );
}
