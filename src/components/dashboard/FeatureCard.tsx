
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Lock, Eye, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'available' | 'preview' | 'coming-soon' | 'premium';
  category: 'essential' | 'memory1st' | 'community' | 'resources';
  path?: string;
  metric?: {
    value: string | number;
    label: string;
  };
  className?: string;
}

const statusConfig = {
  available: {
    badge: { text: "Try Now", variant: "default" as const, icon: ArrowRight },
    buttonText: "Open",
    buttonVariant: "default" as const,
    disabled: false
  },
  preview: {
    badge: { text: "Preview", variant: "secondary" as const, icon: Eye },
    buttonText: "Preview",
    buttonVariant: "outline" as const,
    disabled: false
  },
  'coming-soon': {
    badge: { text: "Coming Soon", variant: "outline" as const, icon: Sparkles },
    buttonText: "Coming Soon",
    buttonVariant: "ghost" as const,
    disabled: true
  },
  premium: {
    badge: { text: "Premium", variant: "secondary" as const, icon: Lock },
    buttonText: "Upgrade",
    buttonVariant: "outline" as const,
    disabled: false
  }
};

const categoryStyles = {
  essential: "border-l-4 border-l-blue-400 bg-gradient-to-br from-blue-50/50 to-blue-100/30",
  memory1st: "border-l-4 border-l-purple-400 bg-gradient-to-br from-purple-50/50 to-purple-100/30",
  community: "border-l-4 border-l-teal-400 bg-gradient-to-br from-teal-50/50 to-teal-100/30",
  resources: "border-l-4 border-l-green-400 bg-gradient-to-br from-green-50/50 to-green-100/30"
};

export function FeatureCard({ 
  title, 
  description, 
  icon, 
  status, 
  category, 
  path, 
  metric, 
  className 
}: FeatureCardProps) {
  const navigate = useNavigate();
  const config = statusConfig[status];
  const StatusIcon = config.badge.icon;

  const handleClick = () => {
    if (path && !config.disabled) {
      navigate(path);
    }
  };

  return (
    <Card className={cn(
      "cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]",
      categoryStyles[category],
      config.disabled && "opacity-60 cursor-not-allowed",
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/80 shadow-sm">
              {icon}
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">{title}</CardTitle>
              {metric && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-bold text-primary">{metric.value}</span>
                  <span className="text-sm text-muted-foreground">{metric.label}</span>
                </div>
              )}
            </div>
          </div>
          <Badge variant={config.badge.variant} className="flex items-center gap-1">
            <StatusIcon className="h-3 w-3" />
            {config.badge.text}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4 min-h-[2.5rem]">{description}</p>
        <Button
          variant={config.buttonVariant}
          size="sm"
          className="w-full"
          disabled={config.disabled}
          onClick={handleClick}
        >
          {config.buttonText}
          {!config.disabled && <ArrowRight className="h-4 w-4 ml-2" />}
        </Button>
      </CardContent>
    </Card>
  );
}
