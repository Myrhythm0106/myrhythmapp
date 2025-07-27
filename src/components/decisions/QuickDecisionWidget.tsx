import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Plus, ArrowRight } from "lucide-react";
import { useDecisionLogging } from "@/hooks/useDecisionLogging";
import { useNavigate } from "react-router-dom";

export function QuickDecisionWidget() {
  const { decisions } = useDecisionLogging();
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const navigate = useNavigate();

  const recentDecisions = decisions.slice(0, 3);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Decision Moments</h3>
        </div>
        <Button 
          size="sm" 
          variant="ghost"
          onClick={() => navigate('/decisions')}
          className="text-xs"
        >
          View All <ArrowRight className="h-3 w-3 ml-1" />
        </Button>
      </div>

      {recentDecisions.length === 0 ? (
        <div className="text-center py-4">
          <Brain className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-3">
            Capture your decision moments
          </p>
          <Button 
            size="sm" 
            onClick={() => navigate('/decisions')}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Log First Decision
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {recentDecisions.map((decision) => (
            <div key={decision.id} className="text-sm p-2 bg-muted/50 rounded">
              <p className="font-medium truncate">{decision.title}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(decision.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => navigate('/decisions')}
            className="w-full mt-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            Log New Decision
          </Button>
        </div>
      )}
    </Card>
  );
}