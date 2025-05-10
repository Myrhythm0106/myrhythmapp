
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Action } from "../types/goalTypes";
import { ChevronDown, ChevronRight, Calendar } from "lucide-react";
import { ActionTable } from "./ActionTable";

interface UnlinkedActionsProps {
  actions: Action[];
  isExpanded: boolean;
  onToggle: () => void;
}

export const UnlinkedActions: React.FC<UnlinkedActionsProps> = ({ 
  actions, 
  isExpanded, 
  onToggle 
}) => {
  return (
    <Card className="border-l-4 border-l-gray-300">
      <CardContent className="p-0">
        <div 
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/30"
          onClick={onToggle}
        >
          <div className="flex items-center space-x-2">
            {isExpanded ? 
              <ChevronDown className="h-4 w-4 text-muted-foreground" /> : 
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            }
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span className="font-medium">Actions Without Goals</span>
            </div>
          </div>
        </div>
        
        {isExpanded && (
          <div className="px-4 pb-4 pt-0">
            <ActionTable actions={actions} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
