import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileDown, Printer, Calendar, Clock, CheckCircle, Circle } from 'lucide-react';
import { ExtractedAction } from '@/types/memoryBridge';
import { format } from 'date-fns';

interface ProfessionalPactReportProps {
  actions: ExtractedAction[];
  meetingTitle?: string;
  meetingDate?: string;
  onScheduleAction: (action: ExtractedAction) => void;
  onExportPDF: () => void;
}

export const ProfessionalPactReport: React.FC<ProfessionalPactReportProps> = ({
  actions,
  meetingTitle = "Meeting",
  meetingDate,
  onScheduleAction,
  onExportPDF
}) => {
  const getActionTypeColor = (type: string) => {
    switch (type) {
      case 'promise': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'commitment': return 'bg-green-100 text-green-800 border-green-200';
      case 'task': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'reminder': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-700" />;
      default: return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getPriorityText = (level: number) => {
    if (level >= 8) return 'Critical';
    if (level >= 6) return 'High';
    if (level >= 4) return 'Medium';
    return 'Low';
  };

  const getPriorityColor = (level: number) => {
    if (level >= 8) return 'bg-red-100 text-red-800 border-red-200';
    if (level >= 6) return 'bg-orange-100 text-orange-800 border-orange-200';
    if (level >= 4) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const confirmedActions = actions.filter(action => action.status === 'confirmed');
  const completedActions = actions.filter(action => action.status === 'completed');
  const trustScore = actions.length > 0 ? Math.round((completedActions.length / actions.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold text-foreground">
                P.A.C.T. Professional Report
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                Promises, Actions, Commitments & Tasks from {meetingTitle}
              </p>
              {meetingDate && (
                <p className="text-sm text-muted-foreground">
                  Meeting Date: {format(new Date(meetingDate), 'MMMM d, yyyy')}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.print()}
                className="gap-2"
              >
                <Printer className="h-4 w-4" />
                Print
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onExportPDF}
                className="gap-2"
              >
                <FileDown className="h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{actions.length}</div>
              <div className="text-sm text-muted-foreground">Total Items</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{confirmedActions.length}</div>
              <div className="text-sm text-muted-foreground">Confirmed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{completedActions.length}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-memory-emerald">{trustScore}%</div>
              <div className="text-sm text-muted-foreground">Compliance Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* P.A.C.T. Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Action Items Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Due Context</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead className="w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {actions.map((action) => (
                <TableRow key={action.id} className="group">
                  <TableCell>
                    {getStatusIcon(action.status)}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={getActionTypeColor(action.action_type)}
                    >
                      {action.action_type.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-md">
                    <div className="space-y-1">
                      <p className="font-medium">{action.action_text}</p>
                      {action.emotional_stakes && (
                        <p className="text-xs text-muted-foreground">
                          Impact: {action.emotional_stakes}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {action.assigned_to || 'Self'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {action.due_context || 'No deadline specified'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline"
                      className={getPriorityColor(action.priority_level)}
                    >
                      {getPriorityText(action.priority_level)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <span className="text-sm font-medium">
                        {Math.round((action.confidence_score || 0) * 100)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {action.status === 'confirmed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onScheduleAction(action)}
                        className="gap-1 text-xs"
                      >
                        <Calendar className="h-3 w-3" />
                        Schedule
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {actions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No P.A.C.T. items found in this meeting recording.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Relationship Impact Summary */}
      {actions.some(action => action.relationship_impact) && (
        <Card>
          <CardHeader>
            <CardTitle>Relationship Impact Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {actions
                .filter(action => action.relationship_impact)
                .map((action) => (
                  <div key={action.id} className="border-l-4 border-primary pl-4">
                    <p className="font-medium">{action.action_text}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {action.relationship_impact}
                    </p>
                    {action.intent_behind && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Intent: {action.intent_behind}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};