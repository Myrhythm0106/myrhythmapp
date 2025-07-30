import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Minus, Activity, Brain, Target } from "lucide-react";

interface ClinicalMetricsProps {
  data: {
    cognitiveScore: number; // T-score (mean 50, SD 10)
    functionalLevel: number; // 1-5 scale
    adherenceRate: number; // percentage
    progressTrend: 'improving' | 'stable' | 'declining';
    riskLevel: 'low' | 'moderate' | 'high';
    lastAssessment: string;
  };
}

export function ClinicalMetrics({ data }: ClinicalMetricsProps) {
  const getTrendIcon = () => {
    switch (data.progressTrend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'declining': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Minus className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getRiskColor = () => {
    switch (data.riskLevel) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
    }
  };

  const getTScoreCategory = (score: number) => {
    if (score >= 60) return { label: 'Above Average', color: 'text-green-600' };
    if (score >= 40) return { label: 'Average Range', color: 'text-blue-600' };
    return { label: 'Below Average', color: 'text-red-600' };
  };

  const tScoreCategory = getTScoreCategory(data.cognitiveScore);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Cognitive Assessment T-Score */}
        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <Brain className="h-4 w-4" />
              Cognitive T-Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{data.cognitiveScore}</div>
            <div className={`text-sm font-medium ${tScoreCategory.color}`}>
              {tScoreCategory.label}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Standardized score (M=50, SD=10)
            </div>
          </CardContent>
        </Card>

        {/* Functional Level */}
        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <Activity className="h-4 w-4" />
              Functional Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{data.functionalLevel}/5</div>
            <Progress value={(data.functionalLevel / 5) * 100} className="mt-2 h-2" />
            <div className="text-xs text-slate-500 mt-1">
              Activities of Daily Living Scale
            </div>
          </CardContent>
        </Card>

        {/* Treatment Adherence */}
        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <Target className="h-4 w-4" />
              Adherence Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{data.adherenceRate}%</div>
            <Progress value={data.adherenceRate} className="mt-2 h-2" />
            <div className="text-xs text-slate-500 mt-1">
              Treatment protocol compliance
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clinical Status Summary */}
      <Card className="border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-slate-600">
            Clinical Assessment Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Progress Trend</span>
            <div className="flex items-center gap-2">
              {getTrendIcon()}
              <span className="text-sm font-medium capitalize">{data.progressTrend}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Risk Level</span>
            <Badge variant="outline" className={getRiskColor()}>
              {data.riskLevel.toUpperCase()}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Last Assessment</span>
            <span className="text-sm font-medium">{data.lastAssessment}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}