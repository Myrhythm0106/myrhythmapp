
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AssessmentResult, SectionScore } from "@/utils/rhythmAnalysis";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { scaleLabels } from "./rhythmAssessmentData";

interface AssessmentResultsDisplayProps {
  assessmentResult: AssessmentResult;
}

export function AssessmentResultsDisplay({ assessmentResult }: AssessmentResultsDisplayProps) {
  const [expandedSections, setExpandedSections] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState("summary");

  // Toggle section expansion
  const toggleSection = (sectionId: number) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId) 
        : [...prev, sectionId]
    );
  };

  // Prepare data for pie chart
  const pieData = assessmentResult.sectionScores.map(section => ({
    name: section.title,
    value: section.average,
    id: section.id
  }));

  // Colors for the pie chart
  const COLORS = ['#FF6B6B', '#4ECDC4', '#FFD166', '#6A0572', '#AB83A1', '#1A535C', '#F9C80E', '#5D576B'];

  return (
    <Card className="overflow-hidden">
      <Tabs defaultValue="summary" className="w-full" onValueChange={setActiveTab}>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Your Assessment Results</h3>
              <p className="text-sm text-gray-600">
                Completed on {new Date(assessmentResult.completedAt).toLocaleDateString()}
              </p>
            </div>
            <TabsList className="grid grid-cols-2 h-8">
              <TabsTrigger value="summary" className="text-xs">Summary</TabsTrigger>
              <TabsTrigger value="details" className="text-xs">Details</TabsTrigger>
            </TabsList>
          </div>
        </div>

        <CardContent className="p-0">
          <TabsContent value="summary" className="p-4 space-y-4 m-0">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="w-full md:w-1/2">
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-sm font-medium">Overall Score</span>
                    <div className="relative group">
                      <Info className="h-3.5 w-3.5 text-gray-400 cursor-help" />
                      <div className="absolute z-10 invisible group-hover:visible bg-white p-2 rounded shadow-md text-xs w-48 text-left top-full left-1/2 transform -translate-x-1/2">
                        Your overall score is the average of all question responses across all sections.
                      </div>
                    </div>
                  </div>
                  <div className="text-3xl font-bold">
                    {assessmentResult.overallScore.toFixed(1)}
                    <span className="text-sm text-gray-500 font-normal ml-1">/ 3.0</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium mb-1">Your Primary Focus</div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                        {assessmentResult.focusArea.charAt(0).toUpperCase() + assessmentResult.focusArea.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <div className="font-medium mb-1">Determination Reason</div>
                    <p className="text-gray-700 leading-relaxed">
                      {assessmentResult.determinationReason}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-1/2 h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [
                      `${typeof value === 'number' ? value.toFixed(1) : value} / 3.0`, 
                      'Score'
                    ]} />
                  </PieChart>
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
                    <div>
                      <h4 className="font-medium text-gray-900">{section.title}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 text-xs">
                          {section.phase}
                        </Badge>
                        <span className="text-sm text-gray-500">Score: {section.average.toFixed(1)}/3.0</span>
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
                        // Find question text from the section id and question id
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
                              <span className="text-sm font-medium">
                                {scaleLabels[score - 1]}
                              </span>
                            </div>
                            <Progress value={(score / 3) * 100} className="h-2" />
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
