import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Sparkles, 
  MapPin, 
  ArrowRight, 
  Clock,
  Target,
  Heart,
  Users,
  BookOpen,
  CheckCircle
} from "lucide-react";
import { FirstTimeUserExperience } from "./FirstTimeUserExperience";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface WelcomeToAppProps {
  showOnMount?: boolean;
  onClose?: () => void;
}

export function WelcomeToApp({ showOnMount = false, onClose }: WelcomeToAppProps) {
  // Use the new First Time User Experience instead
  return <FirstTimeUserExperience showOnMount={showOnMount} onClose={onClose} />;

}