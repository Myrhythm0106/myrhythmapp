
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Brain, Mail, Lock } from "lucide-react";
import { PasswordInput } from "./PasswordInput";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(email, password);
    
    if (!error) {
      onClose();
      navigate("/dashboard");
    }
    
    setIsLoading(false);
  };

  const handleClose = () => {
    setEmail("");
    setPassword("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 border-2 border-purple-200/50">
        <DialogHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 rounded-full flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                Welcome Back to MyRhythm
              </DialogTitle>
              <p className="text-sm text-muted-foreground">Memory1st → LEAP Forward</p>
            </div>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-white/80 border-purple-200 focus:border-purple-400"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <PasswordInput
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-white/80 border-purple-200 focus:border-purple-400"
                required
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 hover:from-purple-700 hover:via-blue-700 hover:to-teal-700 text-white font-medium" 
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In to MyRhythm"}
          </Button>
        </form>
        
        <div className="text-center text-sm mt-4">
          <span className="text-muted-foreground">Don't have an account?</span>{" "}
          <Button
            variant="link"
            className="p-0 text-purple-600 hover:text-purple-700"
            onClick={() => {
              handleClose();
              navigate("/auth");
            }}
          >
            Start Your Memory1st Journey
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
