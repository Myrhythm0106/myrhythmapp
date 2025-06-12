
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Calendar, ChevronDown, ChevronUp, FileText, History, Eye, EyeOff } from "lucide-react";
import { getAssessmentHistory, AssessmentResult } from "@/utils/rhythmAnalysis";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AssessmentResultsDisplay } from "../../onboarding/steps/rhythm/AssessmentResultsDisplay";

// Clinical scoring utilities
const convertToTScore = (rawScore: number): number => {
  return Math.round(30 + ((rawScore - 1) / 2) * 40);
};

const getClinicalSeverity = (tScore: number): { level: string; color: string } => {
  if (tScore >= 70) return { level: "Significant", color: "bg-red-100 text-red-800" };
  if (tScore >= 60) return { level: "Moderate", color: "bg-orange-100 text-orange-800" };
  if (tScore >= 40) return { level: "Normal", color: "bg-green-100 text-green-800" };
  return { level: "Below Avg", color: "bg-blue-100 text-blue-800" };
};

export function AssessmentHistoryWidget() {
  const navigate = useNavigate();
  const [openAssessmentId, setOpenAssessmentId] = useState<string | null>(null);
  const [expandHistory, setExpandHistory] = useState(false);
  const [clinicalMode, setClinicalMode] = useState(false);
  
  const assessmentHistory = getAssessmentHistory();
  
  if (assessmentHistory.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="h-5 w-5" />
            Assessment History
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <FileText className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <p className="text-sm text-gray-500 mb-4">No assessment history found</p>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => navigate("/onboarding?step=5")}
          >
            Take Your First Assessment
          </Button>
        </CardContent>
      </Card>
    );
  }

  const currentAssessment = assessmentHistory[0];
  const historicalAssessments = assessmentHistory.slice(1);

  // Prepare data for line chart with clinical scoring
  const chartData = assessmentHistory
    .filter(assessment => assessment.overallScore !== undefined && assessment.overallScore !== null)
    .map(assessment => ({
      date: new Date(assessment.completedAt).toLocaleDateString(),
      score: assessment.overallScore,
      tScore: convertToTScore(assessment.overallScore),
      focus: assessment.focusArea,
      severity: getClinicalSeverity(convertToTScore(assessment.overallScore))
    })).reverse();

  // Helper function to safely format score
  const formatScore = (score: number | undefined | null): string => {
    if (score === undefined || score === null || isNaN(score)) {
      return "N/A";
    }
    return clinicalMode ? `T=${convertToTScore(score)}` : score.toFixed(1);
  };

  const formatScoreDisplay = (assessment: AssessmentResult) => {
    if (clinicalMode) {
      const tScore = convertToTScore(assessment.overallScore);
      const severity = getClinicalSeverity(tScore);
      return (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">T = {tScore}</span>
          <Badge className={`${severity.color} text-xs`}>
            {severity.level}
          </Badge>
        </div>
      );
    }
    
    // Show personalized insight if available
    const personalizedBadge = assessment.personalizedData?.personalProfile?.rhythmSignature;
    return (
      <div className="flex flex-col gap-1">
        <span className="text-xs text-gray-500">
          Score: {formatScore(assessment.overallScore)}/3.0
        </span>
        {personalizedBadge && (
          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
            {personalizedBadge}
          </Badge>
        )}
      </div>
    );
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center gap-2">
              <History className="h-5 w-5" />
              Assessment History
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setClinicalMode(!clinicalMode)}
                className="h-6 px-2"
              >
                {clinicalMode ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              </Button>
              {assessmentHistory.length > 1 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setExpandHistory(!expandHistory)}
                  className="h-8 w-8 p-0"
                >
                  {expandHistory ? 
                    <ChevronUp className="h-4 w-4" /> : 
                    <ChevronDown className="h-4 w-4" />
                  }
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-4">
            <div 
              className="flex justify-between items-center cursor-pointer border rounded-lg p-3 hover:bg-gray-50"
              onClick={() => setOpenAssessmentId(currentAssessment.id)}
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Latest</Badge>
                  <span className="text-sm font-medium">{new Date(currentAssessment.completedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="capitalize">
                    {currentAssessment.focusArea}
                  </Badge>
                </div>
                {formatScoreDisplay(currentAssessment)}
                
                {/* Show personalized insight preview */}
                {currentAssessment.personalizedData?.insights && currentAssessment.personalizedData.insights.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-600 line-clamp-2">
                      💡 {currentAssessment.personalizedData.insights[0].title}
                    </p>
                  </div>
                )}
              </div>
              <FileText className="h-5 w-5 text-gray-400" />
            </div>
            
            {expandHistory && historicalAssessments.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs uppercase text-gray-500 font-semibold mb-1">Previous Assessments</h4>
                {historicalAssessments.map((assessment, index) => (
                  <div 
                    key={assessment.id}
                    className="flex justify-between items-center cursor-pointer border rounded-lg p-3 hover:bg-gray-50"
                    onClick={() => setOpenAssessmentId(assessment.id)}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-gray-500" />
                        <span className="text-sm">{new Date(assessment.completedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="capitalize text-xs">
                          {assessment.focusArea}
                        </Badge>
                        {formatScoreDisplay(assessment)}
                      </div>
                    </div>
                    <FileText className="h-4 w-4 text-gray-400" />
                  </div>
                ))}
              </div>
            )}
            
            {assessmentHistory.length > 1 && chartData.length > 0 && (
              <div className="pt-4 border-t">
                <Tabs defaultValue="progress">
                  <TabsList className="grid grid-cols-2 h-8">
                    <TabsTrigger value="progress" className="text-xs">
                      {clinicalMode ? "Clinical Trend" : "Progress"}
                    </TabsTrigger>
                    <TabsTrigger value="focus" className="text-xs">Focus Evolution</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="progress" className="mt-4">
                    <div className="h-[150px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={chartData}
                          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                          <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                          <YAxis 
                            domain={clinicalMode ? [20, 80] : [0, 3]} 
                            ticks={clinicalMode ? [30, 40, 50, 60, 70] : [0, 1, 2, 3]} 
                            tick={{ fontSize: 10 }} 
                          />
                          
                          {clinicalMode && (
                            <>
                              <ReferenceLine y={70} stroke="#dc2626" strokeDasharray="2 2" />
                              <ReferenceLine y={60} stroke="#ea580c" strokeDasharray="2 2" />
                              <ReferenceLine y={50} stroke="#16a34a" strokeDasharray="2 2" />
                              <ReferenceLine y={40} stroke="#2563eb" strokeDasharray="2 2" />
                            </>
                          )}
                          
                          <Tooltip 
                            formatter={(value) => [
                              clinicalMode ? `T = ${value}` : `${(value as number).toFixed(1)}/3.0`,
                              clinicalMode ? 'T-Score' : 'Score'
                            ]}
                          />
                          <Line 
                            type="monotone" 
                            dataKey={clinicalMode ? "tScore" : "score"} 
                            stroke="#8884d8" 
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="text-center text-xs text-gray-500 mt-2">
                      {clinicalMode ? "Clinical Score Evolution (T-Scores)" : "Assessment Score Evolution"}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="focus" className="mt-4">
                    <div className="space-y-2">
                      {chartData.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Badge variant="outline" className="capitalize w-24 flex justify-center">
                            {item.focus}
                          </Badge>
                          <div className="text-gray-500">{item.date}</div>
                          {clinicalMode && (
                            <Badge className={`${item.severity.color} text-xs`}>
                              {item.severity.level}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
            
            <div className="pt-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => navigate("/onboarding?step=5")}
              >
                Take New Assessment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!openAssessmentId} onOpenChange={() => setOpenAssessmentId(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Clinical Assessment Report</DialogTitle>
          </DialogHeader>
          {openAssessmentId && (
            <AssessmentResultsDisplay 
              assessmentResult={assessmentHistory.find(a => a.id === openAssessmentId)!} 
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
