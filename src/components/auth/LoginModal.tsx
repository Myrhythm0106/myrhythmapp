
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // In a real app, we would check against a database
    // For now, we'll check against localStorage to simulate a registration match
    const registeredEmail = localStorage.getItem("myrhythm_email");
    const registeredName = localStorage.getItem("myrhythm_name");
    
    // Check if either email or name matches the username
    const usernameMatches = registeredEmail === username || registeredName === username;
    // Check if we have a stored password and if it matches
    const storedPassword = localStorage.getItem("myrhythm_password");
    const passwordMatches = storedPassword === password;

    setTimeout(() => {
      if (usernameMatches && passwordMatches) {
        toast.success("Login successful!");
        localStorage.setItem("myrhythm_logged_in", "true");
        navigate("/dashboard");
      } else {
        toast.error("Invalid username or password");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Login to MyRhythm</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username or Email</Label>
            <Input
              id="username"
              placeholder="Enter your username or email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="password">Password</Label>
              <Button
                variant="link"
                className="px-0 text-sm"
                onClick={(e) => {
                  e.preventDefault();
                  toast.info("Password reset functionality will be available soon");
                }}
              >
                Forgot password?
              </Button>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <DialogFooter className="pt-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </DialogFooter>
        </form>
        <div className="text-center text-sm mt-4">
          <span className="text-muted-foreground">Don't have an account?</span>{" "}
          <Button
            variant="link"
            className="p-0"
            onClick={() => {
              onClose();
              navigate("/onboarding");
            }}
          >
            Sign up
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
