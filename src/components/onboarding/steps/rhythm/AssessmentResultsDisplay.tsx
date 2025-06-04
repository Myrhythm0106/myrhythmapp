
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AssessmentResult, SectionScore } from "@/utils/rhythmAnalysis";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { ChevronDown, ChevronUp, Info, Download, Eye, EyeOff, FileText } from "lucide-react";
import { scaleLabels } from "./rhythmAssessmentData";

interface AssessmentResultsDisplayProps {
  assessmentResult: AssessmentResult;
}

// Clinical scoring utilities
const convertToTScore = (rawScore: number): number => {
  // Convert 1-3 scale to T-score (mean=50, SD=10)
  // 1.0 = T-score 30, 2.0 = T-score 50, 3.0 = T-score 70
  return Math.round(30 + ((rawScore - 1) / 2) * 40);
};

const getPercentileRank = (tScore: number): number => {
  // Approximate percentile based on T-score
  if (tScore <= 30) return 2;
  if (tScore <= 40) return 16;
  if (tScore <= 50) return 50;
  if (tScore <= 60) return 84;
  if (tScore <= 70) return 98;
  return 99;
};

const getClinicalSeverity = (tScore: number): { level: string; color: string; description: string } => {
  if (tScore >= 70) return {
    level: "Significant Concern",
    color: "bg-red-100 text-red-800 border-red-300",
    description: "Scores indicate areas requiring clinical attention and intervention"
  };
  if (tScore >= 60) return {
    level: "Moderate Difficulty",
    color: "bg-orange-100 text-orange-800 border-orange-300",
    description: "Scores suggest mild to moderate challenges that may benefit from support"
  };
  if (tScore >= 40) return {
    level: "Within Normal Limits",
    color: "bg-green-100 text-green-800 border-green-300",
    description: "Scores fall within expected range for individuals with similar experiences"
  };
  return {
    level: "Below Average",
    color: "bg-blue-100 text-blue-800 border-blue-300",
    description: "Scores indicate relative strengths in this domain"
  };
};

export function AssessmentResultsDisplay({ assessmentResult }: AssessmentResultsDisplayProps) {
  const [expandedSections, setExpandedSections] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState("summary");
  const [clinicalMode, setClinicalMode] = useState(false);

  // Toggle section expansion
  const toggleSection = (sectionId: number) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId) 
        : [...prev, sectionId]
    );
  };

  // Prepare clinical profile data
  const clinicalProfileData = assessmentResult.sectionScores.map(section => {
    const tScore = convertToTScore(section.average);
    return {
      name: section.title.substring(0, 12) + (section.title.length > 12 ? '...' : ''),
      fullName: section.title,
      tScore,
      rawScore: section.average,
      percentile: getPercentileRank(tScore),
      severity: getClinicalSeverity(tScore)
    };
  });

  const overallTScore = convertToTScore(assessmentResult.overallScore);
  const overallSeverity = getClinicalSeverity(overallTScore);
  const overallPercentile = getPercentileRank(overallTScore);

  const handleExportReport = () => {
    // Generate clinical report (placeholder for now)
    console.log("Exporting clinical report...");
  };

  return (
    <Card className="overflow-hidden">
      <Tabs defaultValue="summary" className="w-full" onValueChange={setActiveTab}>
        <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-4 border-b border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                MyRhythm Assessment Results
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Completed: {new Date(assessmentResult.completedAt).toLocaleDateString()}</span>
                <span>Assessment ID: {assessmentResult.id.substring(0, 8)}</span>
                <span>Version: {assessmentResult.version}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setClinicalMode(!clinicalMode)}
                className="flex items-center gap-1"
              >
                {clinicalMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {clinicalMode ? "Consumer View" : "Clinical View"}
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportReport}>
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
          
          <TabsList className="grid grid-cols-3 h-8">
            <TabsTrigger value="summary" className="text-xs">Clinical Summary</TabsTrigger>
            <TabsTrigger value="profile" className="text-xs">Domain Profile</TabsTrigger>
            <TabsTrigger value="details" className="text-xs">Item Analysis</TabsTrigger>
          </TabsList>
        </div>

        <CardContent className="p-0">
          <TabsContent value="summary" className="p-4 space-y-4 m-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="text-center p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-sm font-medium">
                      {clinicalMode ? "Composite T-Score" : "Overall Assessment"}
                    </span>
                    <div className="relative group">
                      <Info className="h-3.5 w-3.5 text-gray-400 cursor-help" />
                      <div className="absolute z-10 invisible group-hover:visible bg-white p-2 rounded shadow-md text-xs w-64 text-left top-full left-1/2 transform -translate-x-1/2">
                        {clinicalMode 
                          ? "T-scores have a mean of 50 and standard deviation of 10. Scores above 60 may indicate areas of concern."
                          : "Your overall score reflects your current position across all assessment areas."
                        }
                      </div>
                    </div>
                  </div>
                  
                  {clinicalMode ? (
                    <div className="space-y-2">
                      <div className="text-3xl font-bold">
                        T = {overallTScore}
                        <span className="text-sm text-gray-500 font-normal ml-2">
                          ({overallPercentile}th percentile)
                        </span>
                      </div>
                      <Badge className={`${overallSeverity.color} text-sm py-1 px-3`}>
                        {overallSeverity.level}
                      </Badge>
                      <p className="text-xs text-gray-600 mt-2">
                        {overallSeverity.description}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-3xl font-bold">
                        {Math.round((assessmentResult.overallScore / 3) * 100)}%
                        <span className="text-sm text-gray-500 font-normal ml-1">progress</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        You're making good progress in your recovery journey
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium mb-2">Primary Focus Area</div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 text-sm py-1 px-3">
                      {assessmentResult.focusArea.charAt(0).toUpperCase() + assessmentResult.focusArea.slice(1)} Focus
                    </Badge>
                  </div>
                  
                  <div className="text-sm">
                    <div className="font-medium mb-2">
                      {clinicalMode ? "Clinical Interpretation" : "What This Means"}
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <p className="text-gray-700 leading-relaxed">
                        {clinicalMode 
                          ? `Clinical assessment indicates primary intervention focus should be on ${assessmentResult.focusArea} domain. This determination is based on standardized scoring algorithms and should be considered alongside clinical judgment and patient history.`
                          : assessmentResult.determinationReason
                        }
                      </p>
                    </div>
                  </div>

                  {clinicalMode && (
                    <div className="text-xs text-gray-500 p-3 bg-yellow-50 rounded border border-yellow-200">
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong>Clinical Disclaimer:</strong> This assessment is a screening tool and should not replace clinical judgment. Results should be interpreted by qualified healthcare professionals in the context of comprehensive clinical evaluation.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="text-sm font-medium">Domain Scores Summary</div>
                <div className="space-y-2">
                  {clinicalProfileData.map((domain, index) => (
                    <div key={index} className="flex justify-between items-center p-2 border rounded">
                      <span className="text-sm">{domain.fullName}</span>
                      <div className="flex items-center gap-2">
                        {clinicalMode ? (
                          <>
                            <span className="text-sm font-medium">T = {domain.tScore}</span>
                            <Badge className={`${domain.severity.color} text-xs`}>
                              {domain.severity.level}
                            </Badge>
                          </>
                        ) : (
                          <>
                            <span className="text-sm font-medium">
                              {Math.round((domain.rawScore / 3) * 100)}%
                            </span>
                            <div className="w-16">
                              <Progress value={(domain.rawScore / 3) * 100} className="h-2" />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="p-4 m-0">
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h4 className="font-semibold mb-2">
                  {clinicalMode ? "Clinical Domain Profile (T-Scores)" : "Domain Strengths Profile"}
                </h4>
                <p className="text-sm text-gray-600">
                  {clinicalMode 
                    ? "T-scores with normative comparison bands (shaded areas represent typical ranges)"
                    : "Your relative strengths across different recovery domains"
                  }
                </p>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={clinicalProfileData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 10 }} 
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis 
                      domain={clinicalMode ? [20, 80] : [0, 100]}
                      tick={{ fontSize: 10 }}
                      label={{ 
                        value: clinicalMode ? 'T-Score' : 'Progress %', 
                        angle: -90, 
                        position: 'insideLeft' 
                      }}
                    />
                    
                    {clinicalMode && (
                      <>
                        <ReferenceLine y={70} stroke="#dc2626" strokeDasharray="2 2" label="Significant" />
                        <ReferenceLine y={60} stroke="#ea580c" strokeDasharray="2 2" label="Moderate" />
                        <ReferenceLine y={50} stroke="#16a34a" strokeDasharray="2 2" label="Average" />
                        <ReferenceLine y={40} stroke="#2563eb" strokeDasharray="2 2" label="Below Avg" />
                      </>
                    )}
                    
                    <Tooltip 
                      formatter={(value, name) => [
                        clinicalMode 
                          ? [`T = ${value} (${getPercentileRank(value as number)}th percentile)`, 'T-Score']
                          : [`${Math.round(((value as number) / 70) * 100)}%`, 'Progress']
                      ]}
                      labelFormatter={(label, payload) => {
                        const item = payload?.[0]?.payload;
                        return item ? item.fullName : label;
                      }}
                    />
                    
                    <Line 
                      type="monotone" 
                      dataKey={clinicalMode ? "tScore" : "percentile"} 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="details" className="p-0 m-0">
            <div className="divide-y divide-gray-200">
              {assessmentResult.sectionScores.map((section) => (
                <div key={section.id} className="p-4">
                  <div 
                    className="flex justify-between items-center cursor-pointer" 
                    onClick={() => toggleSection(section.id)}
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{section.title}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 text-xs">
                          {section.phase}
                        </Badge>
                        {clinicalMode ? (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">
                              T = {convertToTScore(section.average)}
                            </span>
                            <Badge className={`${getClinicalSeverity(convertToTScore(section.average)).color} text-xs`}>
                              {getClinicalSeverity(convertToTScore(section.average)).level}
                            </Badge>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">
                            Score: {section.average.toFixed(1)}/3.0 ({Math.round((section.average / 3) * 100)}%)
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      {expandedSections.includes(section.id) ? 
                        <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      }
                    </div>
                  </div>
                  
                  {expandedSections.includes(section.id) && (
                    <div className="mt-4 space-y-4">
                      {Object.entries(section.responses).map(([questionId, score]) => {
                        const sectionData = require("./rhythmAssessmentData").sections.find(
                          (s: any) => s.id === section.id
                        );
                        const questionText = sectionData?.questions.find(
                          (q: any) => q.id === questionId
                        )?.text || "Question";
                        
                        return (
                          <div key={questionId} className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">{questionText}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">
                                  {scaleLabels[score - 1]}
                                </span>
                                {clinicalMode && (
                                  <span className="text-xs text-gray-500">
                                    ({score}/3)
                                  </span>
                                )}
                              </div>
                            </div>
                            <Progress 
                              value={(score / 3) * 100} 
                              className={`h-2 ${
                                score >= 2.5 ? 'text-red-500' :
                                score >= 2 ? 'text-orange-500' :
                                'text-green-500'
                              }`} 
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
