import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { MessageCircle, ChevronDown, Send, Loader2, ThumbsUp, Clock, HandHelping, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface ActionNote {
  id: string;
  action_id: string;
  support_member_id: string;
  note_text: string;
  note_type: string;
  is_visible_to_user: boolean;
  created_at: string;
  member_name?: string;
  member_relationship?: string;
}

interface ActionCommentsSectionProps {
  actionId: string;
}

const noteTypeConfig = {
  encouragement: { icon: ThumbsUp, label: 'Encourage', emoji: '💪', color: 'text-green-600 bg-green-50' },
  reminder: { icon: Clock, label: 'Reminder', emoji: '⏰', color: 'text-amber-600 bg-amber-50' },
  help: { icon: HandHelping, label: 'Help Offer', emoji: '🤝', color: 'text-blue-600 bg-blue-50' },
  update: { icon: FileText, label: 'Update', emoji: '📝', color: 'text-purple-600 bg-purple-50' }
};

const roleColors: Record<string, string> = {
  family: 'ring-red-400 bg-red-100 text-red-700',
  friend: 'ring-blue-400 bg-blue-100 text-blue-700',
  medical: 'ring-green-400 bg-green-100 text-green-700',
  caregiver: 'ring-purple-400 bg-purple-100 text-purple-700',
  professional: 'ring-amber-400 bg-amber-100 text-amber-700',
  other: 'ring-gray-400 bg-gray-100 text-gray-700'
};

export function ActionCommentsSection({ actionId }: ActionCommentsSectionProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [comments, setComments] = useState<ActionNote[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentType, setCommentType] = useState<string>('encouragement');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!actionId || !isOpen) return;

    const fetchComments = async () => {
      setIsLoading(true);
      try {
        // Fetch notes with member details
        const { data: notes } = await supabase
          .from('support_member_action_notes')
          .select(`
            *,
            support_circle_members!support_member_action_notes_support_member_id_fkey (
              member_name,
              relationship
            )
          `)
          .eq('action_id', actionId)
          .eq('is_visible_to_user', true)
          .order('created_at', { ascending: false });

        if (notes) {
          const formattedNotes = notes.map(note => ({
            ...note,
            member_name: (note.support_circle_members as any)?.member_name || 'Support Member',
            member_relationship: (note.support_circle_members as any)?.relationship || 'other'
          }));
          setComments(formattedNotes);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [actionId, isOpen]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !user) return;

    setIsSending(true);
    try {
      // Get user's support member ID if they are a support member
      const { data: memberData } = await supabase
        .from('support_circle_members')
        .select('id')
        .eq('member_email', user.email)
        .eq('status', 'active')
        .single();

      if (!memberData) {
        toast.error('You must be a support circle member to comment');
        return;
      }

      const { data, error } = await supabase
        .from('support_member_action_notes')
        .insert({
          action_id: actionId,
          support_member_id: memberData.id,
          note_text: newComment,
          note_type: commentType,
          is_visible_to_user: true
        })
        .select()
        .single();

      if (error) throw error;

      // Add to local state
      const { data: memberInfo } = await supabase
        .from('support_circle_members')
        .select('member_name, relationship')
        .eq('id', memberData.id)
        .single();

      setComments(prev => [{
        ...data,
        member_name: memberInfo?.member_name || 'You',
        member_relationship: memberInfo?.relationship || 'other'
      }, ...prev]);
      
      setNewComment('');
      toast.success('Comment added!');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setIsSending(false);
    }
  };

  const getRoleColor = (relationship: string) => {
    const normalizedRole = relationship?.toLowerCase() || 'other';
    return roleColors[normalizedRole] || roleColors.other;
  };

  const getTypeConfig = (type: string) => {
    return noteTypeConfig[type as keyof typeof noteTypeConfig] || noteTypeConfig.update;
  };

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-clarity-teal-50/90 to-white/90 backdrop-blur-sm border border-clarity-teal-200/50 shadow-lg p-4">
      {/* Glass reflection effect */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
      
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-clarity-teal-100 rounded-lg">
                <MessageCircle className="h-4 w-4 text-clarity-teal-600" />
              </div>
              <span className="font-semibold text-clarity-teal-700 text-sm">COMMENTS</span>
              {comments.length > 0 && (
                <Badge className="bg-gradient-to-r from-clarity-teal-500 to-clarity-teal-600 text-white text-xs shadow-md">
                  {comments.length}
                </Badge>
              )}
            </div>
            <ChevronDown className={cn(
              "h-4 w-4 text-clarity-teal-500 transition-transform duration-200",
              isOpen && "rotate-180"
            )} />
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent className="relative z-10">
          <div className="pt-4 space-y-3">
            {/* Comment list */}
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-clarity-teal-500" />
              </div>
            ) : comments.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {comments.map(comment => {
                  const typeConfig = getTypeConfig(comment.note_type);
                  return (
                    <div 
                      key={comment.id} 
                      className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-white/60 shadow-sm transition-all hover:shadow-md"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className={cn("h-6 w-6 ring-2", getRoleColor(comment.member_relationship || '').split(' ')[0])}>
                          <AvatarFallback className={cn("text-xs font-bold", getRoleColor(comment.member_relationship || '').split(' ').slice(1).join(' '))}>
                            {comment.member_name?.[0] || 'S'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm text-foreground">{comment.member_name}</span>
                        <Badge variant="outline" className="text-[10px] py-0 px-1">
                          {comment.member_relationship}
                        </Badge>
                        <div className={cn("flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full", typeConfig.color)}>
                          <span>{typeConfig.emoji}</span>
                        </div>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 pl-8">{comment.note_text}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-2">
                No comments yet. Be the first to encourage!
              </p>
            )}

            {/* Add comment input */}
            <div className="flex gap-2 pt-2 border-t border-clarity-teal-100">
              <Select value={commentType} onValueChange={setCommentType}>
                <SelectTrigger className="w-28 h-9 bg-white/80 backdrop-blur-sm text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(noteTypeConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key} className="text-xs">
                      <span className="flex items-center gap-1">
                        {config.emoji} {config.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a supportive comment..."
                className="flex-1 h-9 bg-white/80 backdrop-blur-sm text-sm"
                onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
              />
              <Button 
                onClick={handleAddComment}
                disabled={isSending || !newComment.trim()}
                size="sm"
                className="h-9 bg-gradient-to-r from-brand-orange-500 to-brand-orange-600 hover:from-brand-orange-600 hover:to-brand-orange-700 shadow-md"
              >
                {isSending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
