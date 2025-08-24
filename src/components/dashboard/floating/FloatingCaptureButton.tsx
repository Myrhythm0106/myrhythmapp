import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Mic, Camera, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export function FloatingCaptureButton() {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const captureOptions = [
    {
      id: "text",
      label: "Text Note",
      icon: FileText,
      color: "from-brain-health-500 to-clarity-teal-500",
      action: () => navigate("/memory-bridge?type=text")
    },
    {
      id: "voice",
      label: "Voice Memo", 
      icon: Mic,
      color: "from-clarity-teal-500 to-memory-emerald-500",
      action: () => navigate("/memory-bridge?type=voice")
    },
    {
      id: "photo",
      label: "Photo Memory",
      icon: Camera, 
      color: "from-memory-emerald-500 to-sunrise-amber-500",
      action: () => navigate("/memory-bridge?type=photo")
    }
  ];

  const handleMainClick = () => {
    if (isExpanded) {
      setIsExpanded(false);
    } else {
      setIsExpanded(true);
    }
  };

  const handleOptionClick = (option: typeof captureOptions[0]) => {
    setIsExpanded(false);
    option.action();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-16 right-0 space-y-3"
          >
            {captureOptions.map((option, index) => {
              const IconComponent = option.icon;
              return (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, x: 20, y: 10 }}
                  animate={{ 
                    opacity: 1, 
                    x: 0, 
                    y: 0,
                    transition: { delay: index * 0.1 }
                  }}
                  exit={{ opacity: 0, x: 20, y: 10 }}
                  className="flex items-center gap-3"
                >
                  <div className="bg-white text-sm font-medium px-3 py-2 rounded-lg shadow-md border border-gray-200 whitespace-nowrap">
                    {option.label}
                  </div>
                  <Button
                    size="sm"
                    className={`h-12 w-12 rounded-full bg-gradient-to-r ${option.color} text-white shadow-lg hover:shadow-xl transition-all duration-300 border-0`}
                    onClick={() => handleOptionClick(option)}
                  >
                    <IconComponent className="h-5 w-5" />
                  </Button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <Button
        size="lg"
        className={`h-14 w-14 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 border-0 ${
          isExpanded 
            ? 'bg-gradient-to-r from-gray-500 to-gray-600 rotate-45' 
            : 'bg-gradient-to-r from-brain-health-500 to-clarity-teal-500'
        }`}
        onClick={handleMainClick}
      >
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 45 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="plus"
              initial={{ opacity: 0, rotate: 45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -45 }}
            >
              <Plus className="h-6 w-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>
    </div>
  );
}