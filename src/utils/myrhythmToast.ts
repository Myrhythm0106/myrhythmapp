
import { toast } from "sonner";
import { Brain, Heart, CheckCircle, AlertCircle, Info, Zap } from "lucide-react";

interface MyRhythmToastOptions {
  title?: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export const myRhythmToast = {
  success: (message: string, options?: Omit<MyRhythmToastOptions, 'variant'>) => {
    toast.success(message, {
      description: options?.description || "Your Memory1st journey continues forward 🚀",
      duration: options?.duration || 4000,
      className: "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200",
    });
  },

  error: (message: string, options?: Omit<MyRhythmToastOptions, 'variant'>) => {
    toast.error(message, {
      description: options?.description || "MyRhythm is here to support you through this ✨",
      duration: options?.duration || 5000,
      className: "bg-gradient-to-r from-red-50 to-rose-50 border-red-200",
    });
  },

  info: (message: string, options?: Omit<MyRhythmToastOptions, 'variant'>) => {
    toast.info(message, {
      description: options?.description || "Empowering your LEAP forward 💙",
      duration: options?.duration || 4000,
      className: "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200",
    });
  },

  warning: (message: string, options?: Omit<MyRhythmToastOptions, 'variant'>) => {
    toast.warning(message, {
      description: options?.description || "MyRhythm keeps your progress safe ⚡",
      duration: options?.duration || 5000,
      className: "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200",  
    });
  },

  progress: (message: string, options?: Omit<MyRhythmToastOptions, 'variant'>) => {
    toast.success(`🎯 MyRhythm Progress: ${message}`, {
      description: options?.description || "Every step builds your Memory1st foundation",
      duration: options?.duration || 4000,
      className: "bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200",
    });
  },

  welcome: (message: string, options?: Omit<MyRhythmToastOptions, 'variant'>) => {
    toast.success(`💙 MyRhythm Welcome: ${message}`, {
      description: options?.description || "Your personalized journey to LEAP living begins now",
      duration: options?.duration || 6000,
      className: "bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-200",
    });
  },

  savedProgress: (message: string = "Progress Saved") => {
    toast.success(`✨ MyRhythm: ${message}`, {
      description: "We found saved progress from a previous session. Would you like to resume where you left off?",
      duration: 6000,
      className: "bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200",
      action: {
        label: "Resume Journey",
        onClick: () => {
          // This will be handled by the component using it
          window.dispatchEvent(new CustomEvent('myrhythm:resume-progress'));
        },
      },
    });
  }
};
