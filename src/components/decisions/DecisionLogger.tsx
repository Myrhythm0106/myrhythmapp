import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Brain, Target, Calendar } from "lucide-react";
import { useDecisionLogging } from "@/hooks/useDecisionLogging";

const DECISION_TYPES = [
  "Personal", "Career", "Health", "Financial", "Relationship", "Business", "Other"
];

export function DecisionLogger() {
  const { decisions, loading, createDecision } = useDecisionLogging();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    decision_type: "",
    decision_context: "",
    decision_tags: [] as string[],
  });

  const handleSubmit = async () => {
    if (!formData.title.trim()) return;

    await createDecision({
      title: formData.title,
      content: formData.content,
      decision_type: formData.decision_type,
      decision_context: formData.decision_context,
      decision_tags: formData.decision_tags,
      is_decision: true,
    });

    setFormData({
      title: "",
      content: "",
      decision_type: "",
      decision_context: "",
      decision_tags: [],
    });
    setIsCreating(false);
  };

  const addTag = (tag: string) => {
    if (tag && !formData.decision_tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        decision_tags: [...prev.decision_tags, tag]
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      decision_tags: prev.decision_tags.filter(tag => tag !== tagToRemove)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center space-y-2">
          <div className="animate-pulse text-muted-foreground">Loading decisions...</div>
          <div className="text-xs text-muted-foreground">Connected to database successfully</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Decision Journal</h2>
        </div>
        <Button onClick={() => setIsCreating(true)} disabled={isCreating}>
          <Plus className="h-4 w-4 mr-2" />
          Log Decision
        </Button>
      </div>

      {isCreating && (
        <Card className="p-6 space-y-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="title">What did you decide?</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter your decision..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="type">Decision Type</Label>
              <select
                id="type"
                value={formData.decision_type}
                onChange={(e) => setFormData(prev => ({ ...prev, decision_type: e.target.value }))}
                className="mt-1 w-full p-2 border rounded-md"
              >
                <option value="">Select type...</option>
                {DECISION_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="context">Why did you decide this? (Context & Reasoning)</Label>
              <Textarea
                id="context"
                value={formData.decision_context}
                onChange={(e) => setFormData(prev => ({ ...prev, decision_context: e.target.value }))}
                placeholder="Describe the situation, your reasoning, and what influenced this decision..."
                className="mt-1 min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="content">Additional Details (Optional)</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Any additional thoughts or details..."
                className="mt-1"
              />
            </div>

            <div>
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {formData.decision_tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                    {tag} ×
                  </Badge>
                ))}
              </div>
              <Input
                placeholder="Add a tag and press Enter"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
                className="mt-2"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsCreating(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Save Decision
            </Button>
          </div>
        </Card>
      )}

      <div className="grid gap-4">
        {decisions.length === 0 ? (
          <Card className="p-8 text-center">
            <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No decisions logged yet</h3>
            <p className="text-muted-foreground mb-4">
              Start capturing your decision moments to build your decision-making wisdom.
            </p>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Log Your First Decision
            </Button>
          </Card>
        ) : (
          decisions.map((decision) => (
            <Card key={decision.id} className="p-6">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-lg">{decision.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date(decision.created_at).toLocaleDateString()}
                  </div>
                </div>

                {decision.decision_type && (
                  <Badge variant="outline">{decision.decision_type}</Badge>
                )}

                {decision.decision_context && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">Context & Reasoning:</h4>
                    <p className="text-sm">{decision.decision_context}</p>
                  </div>
                )}

                {decision.content && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">Additional Details:</h4>
                    <p className="text-sm">{decision.content}</p>
                  </div>
                )}

                {decision.decision_tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {decision.decision_tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}