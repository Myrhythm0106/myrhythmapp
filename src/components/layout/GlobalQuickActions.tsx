import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Mic, 
  Camera, 
  Calendar, 
  Heart, 
  Brain, 
  Plus,
  X,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const quickActions = [
  {
    id: "quick-capture",
    label: "Quick Capture",
    icon: Mic,
    path: "/quick-capture",
    color: "from-memory-emerald-500 to-memory-emerald-600",
    description: "Record & extract actions"
  },
  {
    id: "memory",
    label: "Capture Memory",
    icon: Camera,
    path: "/memory-bank",
    color: "from-brain-health-500 to-brain-health-600",
    description: "Photo, voice, or text"
  },
  {
    id: "calendar",
    label: "Add Event",
    icon: Calendar,
    path: "/calendar",
    color: "from-clarity-teal-500 to-clarity-teal-600",
    description: "Schedule something"
  },
  {
    id: "gratitude",
    label: "Gratitude",
    icon: Heart,
    path: "/memory-bank?tab=gratitude",
    color: "from-rose-500 to-rose-600",
    description: "Deep why reflection"
  },
  {
    id: "brain-boost",
    label: "Brain Boost",
    icon: Brain,
    path: "/brain-games",
    color: "from-neural-purple-500 to-neural-purple-600",
    description: "Daily challenge"
  }
];

export function GlobalQuickActions() {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show on landing/auth pages
  const hiddenPaths = ["/", "/auth", "/login", "/signup", "/web-onboarding"];
  if (hiddenPaths.some(path => location.pathname === path || location.pathname.startsWith("/auth"))) {
    return null;
  }

  const handleAction = (path: string) => {
    navigate(path);
    setIsExpanded(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-brain-health-200/50 p-3 min-w-[200px]"
          >
            <div className="space-y-2">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.div
                    key={action.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Button
                      variant="ghost"
                      onClick={() => handleAction(action.path)}
                      className="w-full justify-start gap-3 h-auto py-3 px-3 hover:bg-brain-health-50 rounded-xl group"
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center",
                        action.color
                      )}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-foreground group-hover:text-brain-health-700">
                          {action.label}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {action.description}
                        </div>
                      </div>
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300",
          isExpanded 
            ? "bg-gray-800 rotate-45" 
            : "bg-gradient-to-br from-memory-emerald-500 via-brain-health-500 to-clarity-teal-500"
        )}
      >
        {isExpanded ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <Plus className="h-6 w-6 text-white" />
        )}
      </motion.button>

      {/* Pulse animation when not expanded */}
      {!isExpanded && (
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full bg-gradient-to-br from-memory-emerald-500 to-clarity-teal-500 -z-10"
        />
      )}
    </div>
  );
}
