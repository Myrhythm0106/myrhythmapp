
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Loader2 } from "lucide-react";
import { speechService } from "@/utils/speechSynthesis";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SpeechButtonProps {
  text: string;
  className?: string;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "ghost";
  showLabel?: boolean;
  autoSpeak?: boolean;
}

export function SpeechButton({ 
  text, 
  className, 
  size = "sm", 
  variant = "outline",
  showLabel = false,
  autoSpeak = false
}: SpeechButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  React.useEffect(() => {
    if (autoSpeak && text && speechService.isAvailable()) {
      handleSpeak();
    }
  }, [autoSpeak, text]);

  const handleSpeak = async () => {
    if (!speechService.isAvailable()) {
      toast.error("Speech not supported in this browser");
      return;
    }

    if (isSpeaking) {
      speechService.cancel();
      setIsSpeaking(false);
      return;
    }

    try {
      setIsSpeaking(true);
      await speechService.speak(text, { rate: 0.8, volume: 0.9 });
    } catch (error) {
      console.error("Speech error:", error);
      toast.error("Could not read text aloud");
    } finally {
      setIsSpeaking(false);
    }
  };

  if (!speechService.isAvailable()) {
    return null;
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleSpeak}
      className={cn(
        "flex items-center gap-2 transition-all duration-200",
        isSpeaking && "bg-primary/10 border-primary/30",
        className
      )}
      disabled={!text}
    >
      {isSpeaking ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Volume2 className="h-4 w-4" />
      )}
      {showLabel && (
        <span className="text-xs">
          {isSpeaking ? "Speaking..." : "Read Aloud"}
        </span>
      )}
    </Button>
  );
}
