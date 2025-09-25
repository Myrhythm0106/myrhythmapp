import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Users, 
  MessageCircle, 
  Heart,
  Share,
  Bell,
  UserCheck
} from 'lucide-react';
import { NextStepsItem } from '@/types/memoryBridge';

interface SupportCircleWidgetProps {
  actions: NextStepsItem[];
  expanded?: boolean;
  onActionUpdate?: () => void;
}

export function SupportCircleWidget({ actions, expanded = false, onActionUpdate }: SupportCircleWidgetProps) {
  const actionsWithWatchers = actions.filter(a => 
    a.assigned_watchers && a.assigned_watchers.length > 0
  );

  const totalWatchers = new Set(
    actionsWithWatchers.flatMap(a => a.assigned_watchers || [])
  ).size;

  if (!expanded && actionsWithWatchers.length === 0) {
    return (
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Users className="h-5 w-5" />
            Support Circle
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6">
          <div className="space-y-3">
            <Heart className="h-8 w-8 mx-auto text-purple-400" />
            <p className="text-sm text-purple-700">
              No shared actions yet
            </p>
            <Button size="sm" variant="outline" className="border-purple-200 text-purple-700">
              <Share className="h-4 w-4 mr-2" />
              Share an Action
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 ${expanded ? '' : 'h-fit'}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-800">
          <Users className="h-5 w-5" />
          Your Support Circle
          <Badge className="bg-purple-100 text-purple-800">
            {totalWatchers} people
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className={expanded ? "h-96" : "h-64"}>
          <div className="space-y-4">
            {actionsWithWatchers.map((action, index) => (
              <Card 
                key={action.id || index}
                className="p-4 bg-white/70 border border-purple-200 hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-sm text-gray-900 flex-1">
                      {action.action_text}
                    </h4>
                    <Badge 
                      variant="secondary" 
                      className="ml-2 bg-purple-100 text-purple-800 border-purple-200"
                    >
                      {action.assigned_watchers?.length} watching
                    </Badge>
                  </div>

                  {/* Watchers List */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {action.assigned_watchers?.map((watcher, i) => (
                      <div 
                        key={i}
                        className="flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs"
                      >
                        <UserCheck className="h-3 w-3" />
                        {watcher}
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="flex-1 border-purple-200 text-purple-700 hover:bg-purple-50"
                    >
                      <MessageCircle className="h-3 w-3 mr-1" />
                      Update
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="flex-1 border-purple-200 text-purple-700 hover:bg-purple-50"
                    >
                      <Bell className="h-3 w-3 mr-1" />
                      Notify
                    </Button>
                  </div>

                  {/* Encouragement */}
                  <div className="bg-purple-100 border border-purple-200 rounded-md p-2 text-xs text-purple-800">
                    💜 <strong>Your support circle believes in you!</strong> They're here to celebrate your progress and offer encouragement when you need it.
                  </div>
                </div>
              </Card>
            ))}

            {expanded && (
              <>
                {/* Support Circle Benefits */}
                <Card className="p-4 bg-white/70 border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    Why Support Circles Work
                  </h4>
                  <div className="space-y-2 text-xs text-purple-700">
                    <div className="flex items-start gap-2">
                      <span className="text-purple-500">•</span>
                      <span><strong>Accountability:</strong> You're 65% more likely to complete goals when someone is watching supportively</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-purple-500">•</span>
                      <span><strong>Celebration:</strong> Shared victories feel twice as good and build stronger neural pathways</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-purple-500">•</span>
                      <span><strong>Encouragement:</strong> Having cheerleaders helps you push through challenging moments</span>
                    </div>
                  </div>
                </Card>

                {/* Add Support Member */}
                <Card className="p-4 bg-white/70 border border-purple-200 border-dashed">
                  <div className="text-center space-y-3">
                    <Users className="h-6 w-6 mx-auto text-purple-400" />
                    <div>
                      <h4 className="font-medium text-purple-800 mb-1">Expand Your Circle</h4>
                      <p className="text-xs text-purple-600">
                        Add family, friends, or colleagues to your support network
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Invite Someone
                    </Button>
                  </div>
                </Card>
              </>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}