// @version 0.1
// @feature Next Steps Hub - ACT Confirmation Panel

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Edit, XCircle, Sparkles, Target, Map, HelpCircle, Brain, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ExtractedAction } from "@/types/memoryBridge";
import { toast } from "@/hooks/use-toast";

interface ACTConfirmationPanelProps {
  action: ExtractedAction | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (actionId: string) => Promise<void>;
  onModify: (actionId: string, modifications: Record<string, any>) => Promise<void>;
  onReject: (actionId: string, reason: string) => Promise<void>;
  onSchedule?: (action: ExtractedAction) => void;
}

export function ACTConfirmationPanel({
  action,
  isOpen,
  onClose,
  onConfirm,
  onModify,
  onReject,
  onSchedule,
}: ACTConfirmationPanelProps) {
  const [mode, setMode] = useState<"view" | "edit" | "reject">("view");
  const [isProcessing, setIsProcessing] = useState(false);
  const [editedText, setEditedText] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);

  React.useEffect(() => {
    if (action) {
      setEditedText(action.action_text);
      setMode("view");
      setIsConfirmed(false);
      setRejectReason("");
    }
  }, [action]);

  if (!action) return null;

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      await onConfirm(action.id);
      setIsConfirmed(true);
      toast({
        title: "Action Confirmed! ✅",
        description: "Ready to schedule this action?",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to confirm action. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleModify = async () => {
    setIsProcessing(true);
    try {
      await onModify(action.id, { action_text: editedText });
      toast({
        title: "Action Modified ✏️",
        description: "Your changes have been saved.",
      });
      setMode("view");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save modifications. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast({
        title: "Reason Required",
        description: "Please tell us why you're rejecting this action.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      await onReject(action.id, rejectReason);
      toast({
        title: "Action Rejected",
        description: "This helps us improve future suggestions.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject action. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleScheduleNow = () => {
    if (onSchedule) {
      onSchedule(action);
    }
    onClose();
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "action":
        return "bg-primary text-primary-foreground";
      case "watch_out":
        return "bg-destructive text-destructive-foreground";
      case "note":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full md:w-[600px] bg-card border-l border-border shadow-2xl z-50 overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge className={getCategoryColor(action.category)}>
                      {action.category.replace("_", " ").toUpperCase()}
                    </Badge>
                    {action.priority_level && (
                      <Badge variant="outline">
                        Priority {action.priority_level}
                      </Badge>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="shrink-0"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Action Text (Editable) */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Action
                </label>
                {mode === "edit" ? (
                  <Textarea
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    className="min-h-[100px] text-lg"
                    placeholder="Edit action text..."
                  />
                ) : (
                  <p className="text-lg font-medium leading-relaxed">
                    {action.action_text}
                  </p>
                )}
              </div>

              {/* Confirmation State */}
              {isConfirmed ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-primary/10 border-2 border-primary rounded-lg p-6 text-center space-y-4"
                >
                  <div className="flex justify-center">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-8 h-8 text-primary-foreground" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-2">
                      Action Confirmed!
                    </h3>
                    <p className="text-muted-foreground">
                      Ready to schedule this action?
                    </p>
                  </div>
                  <Button
                    onClick={handleScheduleNow}
                    size="lg"
                    className="w-full"
                  >
                    Schedule Now
                  </Button>
                </motion.div>
              ) : (
                <>
                  {/* Main Action Buttons */}
                  {mode === "view" && (
                    <div className="space-y-3">
                      <Button
                        onClick={handleConfirm}
                        disabled={isProcessing}
                        size="lg"
                        className="w-full h-16 text-lg font-semibold bg-primary hover:bg-primary/90"
                      >
                        <Check className="w-6 h-6 mr-2" />
                        Confirm Action
                      </Button>

                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          onClick={() => setMode("edit")}
                          variant="outline"
                          size="lg"
                          className="h-12"
                        >
                          <Edit className="w-5 h-5 mr-2" />
                          Modify
                        </Button>
                        <Button
                          onClick={() => setMode("reject")}
                          variant="outline"
                          size="lg"
                          className="h-12 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <XCircle className="w-5 h-5 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Edit Mode Actions */}
                  {mode === "edit" && (
                    <div className="flex gap-3">
                      <Button
                        onClick={handleModify}
                        disabled={isProcessing}
                        className="flex-1"
                      >
                        Save Changes
                      </Button>
                      <Button
                        onClick={() => {
                          setMode("view");
                          setEditedText(action.action_text);
                        }}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}

                  {/* Reject Mode */}
                  {mode === "reject" && (
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Why are you rejecting this action?
                        </label>
                        <Textarea
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="This helps us improve future suggestions..."
                          className="min-h-[100px]"
                        />
                      </div>
                      <div className="flex gap-3">
                        <Button
                          onClick={handleReject}
                          disabled={isProcessing}
                          variant="destructive"
                          className="flex-1"
                        >
                          Reject Action
                        </Button>
                        <Button
                          onClick={() => {
                            setMode("view");
                            setRejectReason("");
                          }}
                          variant="outline"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Context Sections */}
              <div className="space-y-4 pt-6 border-t border-border">
                {/* Why This Matters */}
                {action.motivation_statement && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary">
                      <Sparkles className="w-5 h-5" />
                      <h3 className="font-semibold">Why This Matters</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed pl-7">
                      {action.motivation_statement}
                    </p>
                  </div>
                )}

                {/* Success Looks Like */}
                {action.success_criteria && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary">
                      <Target className="w-5 h-5" />
                      <h3 className="font-semibold">Success Looks Like</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed pl-7">
                      {action.success_criteria}
                    </p>
                  </div>
                )}

                {/* How to Do It */}
                {action.how_steps && action.how_steps.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary">
                      <Map className="w-5 h-5" />
                      <h3 className="font-semibold">How to Do It</h3>
                    </div>
                    <ul className="space-y-2 pl-7">
                      {action.how_steps.map((step, index) => (
                        <li
                          key={index}
                          className="text-muted-foreground leading-relaxed"
                        >
                          {index + 1}. {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* If Stuck */}
                {action.if_stuck && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary">
                      <HelpCircle className="w-5 h-5" />
                      <h3 className="font-semibold">If You Get Stuck</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed pl-7">
                      {action.if_stuck}
                    </p>
                  </div>
                )}
              </div>

              {/* Source Meeting */}
              {action.meeting_recording_id && (
                <div className="pt-6 border-t border-border space-y-3">
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Brain className="h-4 w-4 text-primary" />
                      Source Meeting
                    </h3>
                    <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Extracted from:</span>
                        <span className="font-medium">Memory Bridge Recording</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          // This will need to be implemented - open TranscriptViewer
                          toast({
                            title: "View Transcript",
                            description: "Navigate to Memory Bridge to view full transcript",
                          });
                        }}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        View Full Transcript
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Details */}
              {(action.start_date || action.due_context || action.assigned_watchers) && (
                <div className="pt-6 border-t border-border space-y-3">
                  {action.start_date && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Due Date:</span>
                      <span className="font-medium">
                        {new Date(action.start_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {action.due_context && !action.start_date && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Due:</span>
                      <span className="font-medium">{action.due_context}</span>
                    </div>
                  )}
                  {action.assigned_watchers && action.assigned_watchers.length > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Assigned to:</span>
                      <span className="font-medium">
                        {action.assigned_watchers.join(", ")}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
