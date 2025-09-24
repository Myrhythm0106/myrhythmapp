import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, User, Mail } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function AuthDebugHelper() {
  const { user, session, loading, signIn } = useAuth();

  const handleTestSignIn = async () => {
    // Try with a test account that definitely exists
    const { error } = await signIn("test@myrhythm.app", "TestPass123!");
    
    if (error) {
      console.log("Test sign in failed:", error);
    } else {
      console.log("Test sign in successful");
    }
  };

  return (
    <Card className="mt-4 border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="text-sm flex items-center">
          <AlertCircle className="h-4 w-4 mr-2 text-yellow-600" />
          Auth Debug Info
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <User className="h-3 w-3" />
            <span>User:</span>
            <Badge variant={user ? "default" : "secondary"}>
              {user ? "Logged In" : "Not Logged In"}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-3 w-3" />
            <span>Session:</span>
            <Badge variant={session ? "default" : "secondary"}>
              {session ? "Active" : "None"}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <Mail className="h-3 w-3" />
            <span>Email:</span>
            <span className="text-muted-foreground">
              {user?.email || "None"}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span>Loading:</span>
            <Badge variant={loading ? "destructive" : "default"}>
              {loading ? "Yes" : "No"}
            </Badge>
          </div>
        </div>

        {!user && !loading && (
          <Alert className="border-blue-200 bg-blue-50">
            <AlertDescription className="text-blue-800 text-xs">
              <strong>Sign In Issue?</strong> Try these steps:
              <ol className="list-decimal list-inside mt-1 space-y-1">
                <li>Check if your account exists (try "Forgot Password")</li>
                <li>Make sure email is verified</li>
                <li>Check Supabase URL configuration</li>
                <li>Try the test account below</li>
              </ol>
            </AlertDescription>
          </Alert>
        )}

        <Button 
          onClick={handleTestSignIn} 
          variant="outline" 
          size="sm" 
          className="w-full text-xs"
        >
          Try Test Account (test@myrhythm.app)
        </Button>
      </CardContent>
    </Card>
  );
}