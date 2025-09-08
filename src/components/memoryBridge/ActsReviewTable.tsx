import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Calendar, Download, Check, Clock } from 'lucide-react';
import { ExtractedAction } from '@/types/memoryBridge';
import { useActsScheduling } from '@/hooks/memoryBridge/useActsScheduling';
import { generateICS } from '@/utils/ics';
import { toast } from 'sonner';

interface ActsReviewTableProps {
  actions: ExtractedAction[];
  onUpdateAction: (actionId: string, updates: Partial<ExtractedAction>) => void;
  onConfirmActions: (actionIds: string[], scheduleData: Record<string, { date: string; time: string }>) => void;
}

export function ActsReviewTable({ actions, onUpdateAction, onConfirmActions }: ActsReviewTableProps) {
  const [selectedActions, setSelectedActions] = useState<Set<string>>(new Set());
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [editingCell, setEditingCell] = useState<{ actionId: string; field: string } | null>(null);
  
  const { suggestions, isLoading, generateSuggestionsForAction } = useActsScheduling();

  const highConfidenceActions = useMemo(() => 
    actions.filter(action => (action.confidence_score || 0) >= 0.8),
    [actions]
  );

  const handleSelectAction = (actionId: string, checked: boolean) => {
    const newSelected = new Set(selectedActions);
    if (checked) {
      newSelected.add(actionId);
    } else {
      newSelected.delete(actionId);
    }
    setSelectedActions(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedActions(new Set(actions.map(a => a.id!)));
    } else {
      setSelectedActions(new Set());
    }
  };

  const handleAcceptHighConfidence = async () => {
    const scheduleData: Record<string, { date: string; time: string }> = {};
    
    for (const action of highConfidenceActions) {
      if (!suggestions[action.id!]) {
        await generateSuggestionsForAction(action);
      }
      
      const topSuggestion = suggestions[action.id!]?.[0];
      if (topSuggestion) {
        scheduleData[action.id!] = {
          date: topSuggestion.date,
          time: topSuggestion.time
        };
      }
    }
    
    onConfirmActions(highConfidenceActions.map(a => a.id!), scheduleData);
    toast.success(`Accepted ${highConfidenceActions.length} high-confidence actions`);
  };

  const handleAcceptSelected = async () => {
    const scheduleData: Record<string, { date: string; time: string }> = {};
    const selectedActionsArray = actions.filter(a => selectedActions.has(a.id!));
    
    for (const action of selectedActionsArray) {
      if (!suggestions[action.id!]) {
        await generateSuggestionsForAction(action);
      }
      
      const topSuggestion = suggestions[action.id!]?.[0];
      if (topSuggestion) {
        scheduleData[action.id!] = {
          date: topSuggestion.date,
          time: topSuggestion.time
        };
      }
    }
    
    onConfirmActions(Array.from(selectedActions), scheduleData);
    setSelectedActions(new Set());
    toast.success(`Accepted ${selectedActions.size} actions`);
  };

  const handleExportCSV = () => {
    const csvContent = [
      ['Action', 'Assignee', 'Priority', 'Due Context', 'Context', 'Confidence', 'Status'].join(','),
      ...actions.map(action => [
        `"${action.action_text}"`,
        `"${action.assigned_to || ''}"`,
        getPriorityText(action.priority_level),
        `"${action.due_context || ''}"`,
        `"${action.relationship_impact || ''}"`,
        action.confidence_score || 0,
        action.status
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'extracted-actions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadICS = async (actionIds: string[]) => {
    const actionsToExport = actions.filter(a => actionIds.includes(a.id!));
    const events = actionsToExport.map(action => {
      const suggestion = suggestions[action.id!]?.[0];
      return {
        title: action.action_text,
        description: `Context: ${action.relationship_impact || ''}\n\nAssignee: ${action.assigned_to || ''}\nPriority: ${getPriorityText(action.priority_level)}`,
        start: suggestion ? new Date(`${suggestion.date}T${suggestion.time}`) : new Date(),
        end: suggestion ? new Date(`${suggestion.date}T${suggestion.time}`) : new Date(),
        location: ''
      };
    });
    
    const icsContent = generateICS(events);
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'actions-calendar.ics';
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Calendar file downloaded');
  };

  const toggleRowExpansion = (actionId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(actionId)) {
      newExpanded.delete(actionId);
    } else {
      newExpanded.add(actionId);
    }
    setExpandedRows(newExpanded);
  };

  const getPriorityText = (priorityLevel: number): string => {
    if (priorityLevel <= 2) return 'high';
    if (priorityLevel <= 3) return 'medium';
    return 'low';
  };

  const getPriorityColor = (priorityLevel: number) => {
    const priority = getPriorityText(priorityLevel);
    switch (priority) {
      case 'high': return 'bg-red-500/10 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-300';
      case 'medium': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-300';
      case 'low': return 'bg-green-500/10 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-300';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-500/10 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-300';
    if (confidence >= 0.6) return 'bg-yellow-500/10 text-yellow-700 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-300';
    return 'bg-red-500/10 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-300';
  };

  return (
    <div className="space-y-4">
      {/* Bulk Actions Bar */}
      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
        <div className="flex items-center gap-4">
          <Checkbox
            checked={selectedActions.size === actions.length}
            onCheckedChange={handleSelectAll}
          />
          <span className="text-sm text-muted-foreground">
            {selectedActions.size} of {actions.length} selected
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {highConfidenceActions.length > 0 && (
            <Button
              variant="default"
              size="sm"
              onClick={handleAcceptHighConfidence}
              className="bg-primary hover:bg-primary/90"
            >
              <Check className="w-4 h-4 mr-2" />
              Accept All High-Confidence ({highConfidenceActions.length})
            </Button>
          )}
          
          {selectedActions.size > 0 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAcceptSelected}
              >
                <Check className="w-4 h-4 mr-2" />
                Accept Selected ({selectedActions.size})
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadICS(Array.from(selectedActions))}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Add to Calendar
              </Button>
            </>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Main Table */}
      <div className="border rounded-lg bg-background">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-muted/50">
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedActions.size === actions.length && actions.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="w-12"></TableHead>
              <TableHead className="min-w-[200px]">Action</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Suggested Times</TableHead>
              <TableHead>Confidence</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {actions.map((action) => (
              <React.Fragment key={action.id}>
                <TableRow className="hover:bg-muted/50">
                  <TableCell>
                    <Checkbox
                      checked={selectedActions.has(action.id!)}
                      onCheckedChange={(checked) => handleSelectAction(action.id!, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleRowExpansion(action.id!)}
                      className="p-1 h-auto"
                    >
                      {expandedRows.has(action.id!) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium">
                    {editingCell?.actionId === action.id && editingCell?.field === 'action' ? (
                      <Input
                        defaultValue={action.action_text}
                        onBlur={(e) => {
                          onUpdateAction(action.id!, { action_text: e.target.value });
                          setEditingCell(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            onUpdateAction(action.id!, { action_text: e.currentTarget.value });
                            setEditingCell(null);
                          }
                        }}
                        autoFocus
                      />
                    ) : (
                      <div
                        onClick={() => setEditingCell({ actionId: action.id!, field: 'action' })}
                        className="cursor-text hover:bg-muted/50 p-1 rounded"
                      >
                        {action.action_text}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingCell?.actionId === action.id && editingCell?.field === 'assignee' ? (
                      <Input
                        defaultValue={action.assigned_to || ''}
                        onBlur={(e) => {
                          onUpdateAction(action.id!, { assigned_to: e.target.value });
                          setEditingCell(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            onUpdateAction(action.id!, { assigned_to: e.currentTarget.value });
                            setEditingCell(null);
                          }
                        }}
                        autoFocus
                      />
                    ) : (
                      <div
                        onClick={() => setEditingCell({ actionId: action.id!, field: 'assignee' })}
                        className="cursor-text hover:bg-muted/50 p-1 rounded"
                      >
                        {action.assigned_to || ''}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={getPriorityText(action.priority_level)}
                      onValueChange={(value) => {
                        const priorityLevel = value === 'high' ? 1 : value === 'medium' ? 3 : 5;
                        onUpdateAction(action.id!, { priority_level: priorityLevel });
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(action.priority_level)}>
                      {getPriorityText(action.priority_level)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <ScheduleSuggestionCell
                      action={action}
                      suggestions={suggestions[action.id!]}
                      isLoading={isLoading[action.id!]}
                      onGenerateSuggestions={() => generateSuggestionsForAction(action)}
                      onSelectTime={(date: string, time: string) => {
                        onUpdateAction(action.id!, { 
                          due_context: `${date} ${time}`,
                          scheduled_date: date,
                          scheduled_time: time
                        });
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Badge className={getConfidenceColor(action.confidence_score || 0)}>
                      {Math.round((action.confidence_score || 0) * 100)}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={action.status === 'confirmed' ? 'default' : 'secondary'}>
                      {action.status === 'confirmed' ? 'Accepted' : 'New'}
                    </Badge>
                  </TableCell>
                </TableRow>
                
                {expandedRows.has(action.id!) && (
                  <TableRow>
                    <TableCell colSpan={8} className="bg-muted/20">
                      <div className="p-4 space-y-2">
                        <div>
                          <span className="font-medium text-sm">Context:</span>
                          <p className="text-sm text-muted-foreground mt-1">{action.relationship_impact || 'No context provided'}</p>
                        </div>
                        {action.user_notes && (
                          <div>
                            <span className="font-medium text-sm">AI Notes:</span>
                            <p className="text-sm text-muted-foreground mt-1">{action.user_notes}</p>
                          </div>
                        )}
                        {action.due_context && (
                          <div>
                            <span className="font-medium text-sm">Due Context:</span>
                            <p className="text-sm text-muted-foreground mt-1">{action.due_context}</p>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
        
        {actions.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No actions extracted yet.</p>
            <p className="text-sm">Start a recording to capture actionable items.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Separate component for schedule suggestions
function ScheduleSuggestionCell({ 
  action, 
  suggestions, 
  isLoading, 
  onGenerateSuggestions, 
  onSelectTime 
}: {
  action: ExtractedAction;
  suggestions?: any[];
  isLoading?: boolean;
  onGenerateSuggestions: () => void;
  onSelectTime: (date: string, time: string) => void;
}) {
  React.useEffect(() => {
    if (!suggestions && !isLoading) {
      onGenerateSuggestions();
    }
  }, [suggestions, isLoading, onGenerateSuggestions]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
        <span className="text-sm text-muted-foreground">Scheduling...</span>
      </div>
    );
  }

  if (!suggestions || suggestions.length === 0) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={onGenerateSuggestions}
        className="text-xs"
      >
        Generate Times
      </Button>
    );
  }

  return (
    <div className="space-y-1">
      {suggestions.slice(0, 3).map((suggestion, index) => (
        <Button
          key={index}
          variant="ghost"
          size="sm"
          onClick={() => onSelectTime(suggestion.date, suggestion.time)}
          className="text-xs h-auto p-1 block w-full text-left hover:bg-primary/10"
        >
          <div className="flex items-center justify-between">
            <span>{new Date(`${suggestion.date}T${suggestion.time}`).toLocaleDateString()} {suggestion.time}</span>
            <Badge variant="outline" className="text-xs ml-2">
              {Math.round(suggestion.confidence * 100)}%
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground truncate">
            {suggestion.reason}
          </div>
        </Button>
      ))}
    </div>
  );
}