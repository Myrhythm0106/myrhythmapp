import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  MessageCircle, 
  Clock, 
  Heart, 
  AlertTriangle, 
  User, 
  Calendar,
  Search,
  Plus,
  History,
  Lightbulb,
  Target
} from 'lucide-react';

interface ConversationContext {
  id: string;
  participant_name: string;
  relationship_type: string;
  last_conversation_date?: string;
  conversation_history: Array<{
    date: string;
    summary: string;
    key_topics: string[];
    emotional_tone: string;
  }>;
  relationship_dynamics?: string;
  important_topics: string[];
  shared_commitments: Array<{
    description: string;
    status: string;
    importance: number;
  }>;
  memory_triggers?: string;
}

interface ContextPrompt {
  type: 'reminder' | 'warning' | 'suggestion';
  message: string;
  priority: 'high' | 'medium' | 'low';
  participant: string;
  relatedCommitments?: string[];
}

export function ConversationLifelines() {
  const { user } = useAuth();
  const [contexts, setContexts] = useState<ConversationContext[]>([]);
  const [activePrompts, setActivePrompts] = useState<ContextPrompt[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState<string>('');
  const [isAddingContext, setIsAddingContext] = useState(false);
  const [newContext, setNewContext] = useState({
    participant_name: '',
    relationship_type: 'family',
    summary: '',
    key_topics: '',
    emotional_tone: 'neutral'
  });

  useEffect(() => {
    if (user) {
      fetchConversationContexts();
      generateRealTimePrompts();
    }
  }, [user]);

  const fetchConversationContexts = async () => {
    if (!user) return;

    try {
      // TODO: Create conversation_contexts table in database
      // For now, using mock data
      const mockContexts: ConversationContext[] = [];
      setContexts(mockContexts);
    } catch (error) {
      console.error('Error fetching conversation contexts:', error);
    }
  };

  const generateRealTimePrompts = async () => {
    if (!user) return;

    try {
      // TODO: Fix when extracted_actions types are available
      // For now, using extractedActions from useMemoryBridge
      const prompts: ContextPrompt[] = [];

      extractedActions?.forEach(action => {
        if (action.assigned_to) {
          // Check if we have context for this person
          const context = contexts.find(c => 
            c.participant_name.toLowerCase().includes(action.assigned_to.toLowerCase())
          );

          if (context) {
            // Generate contextual prompt
            if (context.shared_commitments.some(c => c.status === 'pending')) {
              prompts.push({
                type: 'reminder',
                message: `When talking to ${action.assigned_to}, remember you discussed: ${action.action_text}`,
                priority: 'high',
                participant: action.assigned_to,
                relatedCommitments: [action.action_text]
              });
            }
          } else {
            prompts.push({
              type: 'suggestion',
              message: `Consider adding conversation context for ${action.assigned_to} to improve Memory Bridge insights`,
              priority: 'medium',
              participant: action.assigned_to
            });
          }
        }

        // Check for overdue commitments
        if (action.due_context && action.created_at) {
          const daysSinceCreated = Math.floor(
            (new Date().getTime() - new Date(action.created_at).getTime()) / (1000 * 60 * 60 * 24)
          );
          
          if (daysSinceCreated > 3) {
            prompts.push({
              type: 'warning',
              message: `Commitment overdue: "${action.action_text}" - Consider following up`,
              priority: 'high',
              participant: action.assigned_to || 'You'
            });
          }
        }
      });

      setActivePrompts(prompts);
    } catch (error) {
      console.error('Error generating prompts:', error);
    }
  };

  const addConversationContext = async () => {
    if (!user || !newContext.participant_name) return;

    try {
      const contextData = {
        user_id: user.id,
        participant_name: newContext.participant_name,
        relationship_type: newContext.relationship_type,
        last_conversation_date: new Date().toISOString().split('T')[0],
        conversation_history: [{
          date: new Date().toISOString().split('T')[0],
          summary: newContext.summary,
          key_topics: newContext.key_topics.split(',').map(t => t.trim()),
          emotional_tone: newContext.emotional_tone
        }],
        relationship_dynamics: '',
        emotional_patterns: {},
        important_topics: newContext.key_topics.split(',').map(t => t.trim()),
        communication_preferences: '',
        energy_compatibility: 5,
        conflict_resolution_style: '',
        shared_commitments: [],
        memory_triggers: ''
      };

      // TODO: Create conversation_contexts table and implement insertion
      console.log('Would insert:', contextData);

      await fetchConversationContexts();
      setIsAddingContext(false);
      setNewContext({
        participant_name: '',
        relationship_type: 'family',
        summary: '',
        key_topics: '',
        emotional_tone: 'neutral'
      });
    } catch (error) {
      console.error('Error adding conversation context:', error);
    }
  };

  const updateLastConversation = async (contextId: string, summary: string) => {
    try {
      const context = contexts.find(c => c.id === contextId);
      if (!context) return;

      const updatedHistory = [
        {
          date: new Date().toISOString().split('T')[0],
          summary,
          key_topics: [],
          emotional_tone: 'neutral'
        },
        ...context.conversation_history
      ].slice(0, 10); // Keep last 10 conversations

      const { error } = await supabase
        .from('conversation_contexts')
        .update({
          last_conversation_date: new Date().toISOString().split('T')[0],
          conversation_history: updatedHistory
        })
        .eq('id', contextId);

      if (error) throw error;
      await fetchConversationContexts();
    } catch (error) {
      console.error('Error updating conversation:', error);
    }
  };

  const filteredContexts = contexts.filter(context =>
    context.participant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    context.relationship_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Real-Time Context Prompts */}
      {activePrompts.length > 0 && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-blue-500" />
              Conversation Lifelines
              <Badge variant="secondary">{activePrompts.length} active</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activePrompts.map((prompt, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg border-l-4 ${
                  prompt.type === 'warning' ? 'border-l-red-500 bg-red-50/50' :
                  prompt.type === 'reminder' ? 'border-l-blue-500 bg-blue-50/50' :
                  'border-l-green-500 bg-green-50/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  {prompt.type === 'warning' && <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />}
                  {prompt.type === 'reminder' && <MessageCircle className="h-4 w-4 text-blue-500 mt-0.5" />}
                  {prompt.type === 'suggestion' && <Target className="h-4 w-4 text-green-500 mt-0.5" />}
                  
                  <div className="flex-1">
                    <p className="text-sm font-medium">{prompt.message}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" size="sm">{prompt.participant}</Badge>
                      <Badge 
                        variant={prompt.priority === 'high' ? 'destructive' : 'secondary'} 
                        size="sm"
                      >
                        {prompt.priority} priority
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Search and Add */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setIsAddingContext(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Context
        </Button>
      </div>

      {/* Add Context Form */}
      {isAddingContext && (
        <Card>
          <CardHeader>
            <CardTitle>Add Conversation Context</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="participant_name">Person's Name</Label>
                <Input
                  id="participant_name"
                  value={newContext.participant_name}
                  onChange={(e) => setNewContext(prev => ({ ...prev, participant_name: e.target.value }))}
                  placeholder="e.g., Sarah, Dr. Smith"
                />
              </div>
              <div>
                <Label htmlFor="relationship_type">Relationship</Label>
                <select
                  id="relationship_type"
                  value={newContext.relationship_type}
                  onChange={(e) => setNewContext(prev => ({ ...prev, relationship_type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="family">Family</option>
                  <option value="friend">Friend</option>
                  <option value="colleague">Colleague</option>
                  <option value="healthcare">Healthcare Provider</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="summary">Conversation Summary</Label>
              <Textarea
                id="summary"
                value={newContext.summary}
                onChange={(e) => setNewContext(prev => ({ ...prev, summary: e.target.value }))}
                placeholder="Brief summary of recent conversation..."
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="key_topics">Key Topics (comma-separated)</Label>
              <Input
                id="key_topics"
                value={newContext.key_topics}
                onChange={(e) => setNewContext(prev => ({ ...prev, key_topics: e.target.value }))}
                placeholder="health, work, family plans"
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={addConversationContext}>Add Context</Button>
              <Button variant="outline" onClick={() => setIsAddingContext(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conversation Contexts */}
      <div className="grid gap-4">
        {filteredContexts.map((context) => (
          <Card key={context.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {context.participant_name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{context.participant_name}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline">{context.relationship_type}</Badge>
                      {context.last_conversation_date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Last: {new Date(context.last_conversation_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Recent Conversation */}
              {context.conversation_history[0] && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium mb-1">Most Recent Conversation</p>
                  <p className="text-sm text-muted-foreground mb-2">
                    {context.conversation_history[0].summary}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {context.conversation_history[0].key_topics.map((topic, index) => (
                      <Badge key={index} variant="secondary" size="sm">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Shared Commitments */}
              {context.shared_commitments.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2 flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    Shared Commitments
                  </p>
                  <div className="space-y-2">
                    {context.shared_commitments.map((commitment, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{commitment.description}</span>
                        <Badge 
                          variant={commitment.status === 'completed' ? 'default' : 'secondary'}
                          size="sm"
                        >
                          {commitment.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Important Topics */}
              {context.important_topics.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Important Topics</p>
                  <div className="flex flex-wrap gap-1">
                    {context.important_topics.map((topic, index) => (
                      <Badge key={index} variant="outline" size="sm">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const summary = prompt('Add a quick summary of your recent conversation:');
                    if (summary) {
                      updateLastConversation(context.id, summary);
                    }
                  }}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Update
                </Button>
                <Button variant="outline" size="sm">
                  <History className="h-3 w-3 mr-1" />
                  View History
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredContexts.length === 0 && !isAddingContext && (
        <div className="text-center py-12 text-muted-foreground">
          <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-lg font-medium mb-2">No conversation contexts yet</p>
          <p className="text-sm">Start adding context for important conversations to get personalized prompts.</p>
        </div>
      )}
    </div>
  );
}