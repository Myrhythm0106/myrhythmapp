import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Calendar, Brain, TrendingUp, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ShareSummary } from '@/components/ui/ShareSummary';

interface SavedReport {
  id: string;
  title: string;
  type: 'assessment' | 'progress' | 'summary';
  date: string;
  data: any;
}

export function ReportsWidget() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<SavedReport[]>([]);

  useEffect(() => {
    // Load saved reports from localStorage
    const savedReports = localStorage.getItem('myrhythm_reports');
    if (savedReports) {
      setReports(JSON.parse(savedReports));
    } else {
      // Create sample reports
      const sampleReports: SavedReport[] = [
        {
          id: '1',
          title: 'Latest Assessment Results',
          type: 'assessment',
          date: new Date().toISOString(),
          data: {
            overallScore: 75,
            primaryRhythm: 'Building Rhythm',
            assessmentType: 'comprehensive'
          }
        },
        {
          id: '2',
          title: 'Weekly Progress Summary',
          type: 'progress',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          data: {
            weeklyGoals: 5,
            completed: 3,
            improvementAreas: ['Memory', 'Focus']
          }
        }
      ];
      setReports(sampleReports);
      localStorage.setItem('myrhythm_reports', JSON.stringify(sampleReports));
    }
  }, []);

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'assessment': return Brain;
      case 'progress': return TrendingUp;
      default: return FileText;
    }
  };

  const getReportColor = (type: string) => {
    switch (type) {
      case 'assessment': return 'bg-brain-health-100 text-brain-health-700';
      case 'progress': return 'bg-memory-emerald-100 text-memory-emerald-700';
      default: return 'bg-clarity-teal-100 text-clarity-teal-700';
    }
  };

  const handleViewReport = (report: SavedReport) => {
    if (report.type === 'assessment') {
      navigate('/mvp-assessment-results?paid=true');
    } else {
      // Handle other report types
      navigate('/dashboard');
    }
  };

  return (
    <Card className="h-fit">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold text-brain-health-700 flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Reports & Progress
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/reports')}
          className="text-brain-health-600 hover:text-brain-health-700"
        >
          View All
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {reports.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground mb-4">No reports yet</p>
            <Button
              onClick={() => navigate('/mvp-assessment?type=brief')}
              className="bg-gradient-to-r from-brain-health-500 to-memory-emerald-500 text-white"
            >
              Take Assessment
            </Button>
          </div>
        ) : (
          reports.map((report) => {
            const Icon = getReportIcon(report.type);
            return (
              <Card key={report.id} className="border border-brain-health-200/60">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${getReportColor(report.type)}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-brain-health-800">{report.title}</h4>
                        <p className="text-xs text-brain-health-600">
                          {new Date(report.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewReport(report)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <ShareSummary
                        title={report.title}
                        data={report.data}
                        className="h-8 w-8 p-0"
                        variant="ghost"
                        triggerContent={<Download className="h-4 w-4" />}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
        
        <div className="pt-2 border-t border-brain-health-200/60">
          <Button
            onClick={() => navigate('/mvp-assessment?type=comprehensive')}
            variant="outline"
            className="w-full border-brain-health-300 text-brain-health-700 hover:bg-brain-health-50"
          >
            <Brain className="h-4 w-4 mr-2" />
            Take New Assessment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}