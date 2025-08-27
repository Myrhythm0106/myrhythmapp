import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Stethoscope, Heart, User } from "lucide-react";

interface ClinicalViewToggleProps {
  isClinicalView: boolean;
  onToggle: (enabled: boolean) => void;
  userRole?: 'consumer' | 'clinical' | 'medical';
}

export function ClinicalViewToggle({ 
  isClinicalView, 
  onToggle, 
  userRole = 'consumer' 
}: ClinicalViewToggleProps) {
  // Only show for clinical/medical users - hidden for consumers by default
  if (userRole === 'consumer') return null;

  return (
    <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg shadow-sm mb-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-slate-100 rounded-lg">
          {isClinicalView ? (
            <Stethoscope className="h-5 w-5 text-slate-600" />
          ) : (
            <Heart className="h-5 w-5 text-emerald-600" />
          )}
        </div>
        <div>
          <h3 className="font-medium">
            {isClinicalView ? 'Clinical Professional View' : 'Patient Empowerment View'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {isClinicalView 
              ? 'Showing clinical metrics, T-scores, and professional terminology'
              : 'Showing empowering language and patient-centered experience'
            }
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Badge variant={isClinicalView ? "default" : "outline"} className="text-xs">
          {isClinicalView ? 'Clinical' : 'Empowerment'}
        </Badge>
        <Switch
          checked={isClinicalView}
          onCheckedChange={onToggle}
          aria-label="Toggle clinical view"
        />
      </div>
    </div>
  );
}