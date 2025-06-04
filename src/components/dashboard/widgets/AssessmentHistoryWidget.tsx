
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Calendar, ChevronDown, ChevronUp, FileText, History } from "lucide-react";
import { getAssessmentHistory, AssessmentResult } from "@/utils/rhythmAnalysis";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AssessmentResultsDisplay } from "../../onboarding/steps/rhythm/AssessmentResultsDisplay";

export function AssessmentHistoryWidget() {
  const navigate = useNavigate();
  const [openAssessmentId, setOpenAssessmentId] = useState<string | null>(null);
  const [expandHistory, setExpandHistory] = useState(false);
  
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

  // Prepare data for line chart
  const chartData = assessmentHistory.map(assessment => ({
    date: new Date(assessment.completedAt).toLocaleDateString(),
    score: assessment.overallScore,
    focus: assessment.focusArea
  })).reverse();

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center gap-2">
              <History className="h-5 w-5" />
              Assessment History
            </CardTitle>
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
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-4">
            <div 
              className="flex justify-between items-center cursor-pointer border rounded-lg p-3 hover:bg-gray-50"
              onClick={() => setOpenAssessmentId(currentAssessment.id)}
            >
              <div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Latest</Badge>
                  <span className="text-sm font-medium">{new Date(currentAssessment.completedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="capitalize">
                    {currentAssessment.focusArea}
                  </Badge>
                  <span className="text-xs text-gray-500">Score: {currentAssessment.overallScore.toFixed(1)}/3.0</span>
                </div>
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
                        <span className="text-xs text-gray-500">Score: {assessment.overallScore.toFixed(1)}/3.0</span>
                      </div>
                    </div>
                    <FileText className="h-4 w-4 text-gray-400" />
                  </div>
                ))}
              </div>
            )}
            
            {assessmentHistory.length > 1 && (
              <div className="pt-4 border-t">
                <Tabs defaultValue="progress">
                  <TabsList className="grid grid-cols-2 h-8">
                    <TabsTrigger value="progress" className="text-xs">Progress</TabsTrigger>
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
                          <YAxis domain={[0, 3]} ticks={[0, 1, 2, 3]} tick={{ fontSize: 10 }} />
                          <Tooltip />
                          <Line type="monotone" dataKey="score" stroke="#8884d8" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="text-center text-xs text-gray-500 mt-2">Assessment Score Evolution</div>
                  </TabsContent>
                  
                  <TabsContent value="focus" className="mt-4">
                    <div className="space-y-2">
                      {chartData.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Badge variant="outline" className="capitalize w-24 flex justify-center">
                            {item.focus}
                          </Badge>
                          <div className="text-gray-500">{item.date}</div>
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Assessment Details</DialogTitle>
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
