
import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/20 px-4 text-center">
      <div className="mb-6">
        <Brain className="h-20 w-20 text-beacon-600 mx-auto animate-pulse-beacon" />
      </div>
      <h1 className="text-4xl font-bold mb-2">Page Not Found</h1>
      <p className="text-xl text-muted-foreground mb-6 max-w-md">
        We couldn't find the page you're looking for. It might have been moved or doesn't exist.
      </p>
      <div className="space-x-4">
        <Button asChild>
          <Link to="/">Return to Dashboard</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/help">Get Help</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
