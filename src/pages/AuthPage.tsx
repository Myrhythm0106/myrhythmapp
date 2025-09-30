
import React from "react";
import { Preview3Background } from "@/components/ui/Preview3Background";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Mail, Lock, UserPlus, LogIn, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const navigate = useNavigate();

  return (
    <Preview3Background>
      <div className="min-h-screen flex items-center justify-center p-4">
        {/* Back Button */}
        <Button
          onClick={() => navigate('/')}
          variant="ghost"
          size="sm"
          className="absolute top-4 left-4 text-brain-health-700 hover:text-brain-health-900 hover:bg-brain-health-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
        
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                  MyRhythm
                </h1>
                <p className="text-sm text-muted-foreground">Memory1st → LEAP Forward</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="email" type="email" placeholder="Enter your email" className="pl-10" autoComplete="email" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="password" type="password" placeholder="Enter your password" className="pl-10" autoComplete="current-password" />
                  </div>
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-memory-emerald-600 to-clarity-teal-600 hover:from-memory-emerald-700 hover:to-clarity-teal-700"
                  onClick={() => navigate("/memory-bridge")}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Continue Your Journey
                </Button>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="signup-email" type="email" placeholder="Enter your email" className="pl-10" autoComplete="email" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="signup-password" type="password" placeholder="Create a password" className="pl-10" autoComplete="new-password" />
                  </div>
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-clarity-teal-600 to-memory-emerald-600 hover:from-clarity-teal-700 hover:to-memory-emerald-700"
                  onClick={() => navigate("/mvp/user-type-selection")}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Your Journey Starts Here
                </Button>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground">
                Begin your gentle, Memory1st approach to empowered living
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Preview3Background>
  );
}
