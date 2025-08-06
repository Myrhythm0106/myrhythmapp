import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { PACTTable } from './PACTTable';
import { useMemoryBridge } from '@/hooks/memoryBridge/useMemoryBridge';
import { ChevronDown, ChevronUp, TrendingUp, Target, CheckCircle, Clock, Share2, FileText } from 'lucide-react';

export function FollowThroughTab() {
  const { extractedActions, fetchExtractedActions } = useMemoryBridge();
  const [isStatsExpanded, setIsStatsExpanded] = useState(true);

  useEffect(() => {
    fetchExtractedActions();
  }, [fetchExtractedActions]);

  // Calculate stats
  const totalPACTs = extractedActions.length;
  const confirmedPACTs = extractedActions.filter(action => action.status === 'confirmed').length;
  const completedPACTs = extractedActions.filter(action => action.status === 'completed').length;
  const pendingPACTs = extractedActions.filter(action => action.status === 'pending').length;
  
  const completionRate = totalPACTs > 0 ? Math.round((completedPACTs / totalPACTs) * 100) : 0;
  const confirmationRate = totalPACTs > 0 ? Math.round((confirmedPACTs / totalPACTs) * 100) : 0;
  
  // Calculate trust score based on completion and confirmation patterns
  const trustScore = Math.round((completionRate * 0.6) + (confirmationRate * 0.4));

  return (
    <div className="space-y-6">
      {/* Collapsible Stats Header with Empowering Message */}
      <Collapsible open={isStatsExpanded} onOpenChange={setIsStatsExpanded}>
        <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-primary/5 transition-colors">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-2xl font-bold text-primary">
                    I AM a Promise Keeper
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Every commitment I make builds trust and strengthens my relationships
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">{trustScore}%</div>
                    <div className="text-sm text-muted-foreground">Trust Score</div>
                  </div>
                  {isStatsExpanded ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {/* Total PACTs */}
                <div className="flex items-center gap-3 p-4 bg-background rounded-lg border">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{totalPACTs}</div>
                    <div className="text-sm text-muted-foreground">Total PACTs</div>
                  </div>
                </div>

                {/* Completion Rate */}
                <div className="flex items-center gap-3 p-4 bg-background rounded-lg border">
                  <div className="p-2 bg-green-100 rounded-full">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{completionRate}%</div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </div>
                </div>

                {/* Pending Actions */}
                <div className="flex items-center gap-3 p-4 bg-background rounded-lg border">
                  <div className="p-2 bg-orange-100 rounded-full">
                    <Clock className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">{pendingPACTs}</div>
                    <div className="text-sm text-muted-foreground">Pending</div>
                  </div>
                </div>

                {/* Trust Growth */}
                <div className="flex items-center gap-3 p-4 bg-background rounded-lg border">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">+{Math.max(0, trustScore - 50)}%</div>
                    <div className="text-sm text-muted-foreground">Trust Growth</div>
                  </div>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Completion Progress</span>
                    <span className="font-medium">{completedPACTs}/{totalPACTs}</span>
                  </div>
                  <Progress value={completionRate} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Trust Building Journey</span>
                    <span className="font-medium">{trustScore}%</span>
                  </div>
                  <Progress value={trustScore} className="h-2" />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 mt-6">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Generate Report
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Share Progress
                </Button>
                <Badge variant="secondary" className="text-sm py-1 px-3">
                  Next Review: Today 6:00 PM
                </Badge>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* PACT Management Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            My PACT Commitments
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Track, prioritize, and follow through on your Promises, Actions, Commitments & Tasks
          </p>
        </CardHeader>
        <CardContent>
          <PACTTable extractedActions={extractedActions} />
        </CardContent>
      </Card>
    </div>
  );
}