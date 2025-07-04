
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFormContext } from 'react-hook-form';
import { Calendar, Clock, MapPin, Users, Target, MessageSquare, Star, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

export function ReviewStep() {
  const { watch } = useFormContext();
  const formData = watch();

  const formatTime = (time: string) => {
    if (!time) return 'Not set';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    return format(new Date(dateString), 'EEEE, MMMM d, yyyy');
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-800 mb-1">
                Great job! You've created a brain-friendly action plan
              </p>
              <p className="text-sm text-green-700">
                Review the details below and click "Create Action" when you're ready. 
                Your support team will be notified and ready to cheer you on!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Summary */}
      <Card className="border-memory-emerald-200">
        <CardHeader className="bg-gradient-to-r from-memory-emerald-50 to-clarity-teal-50">
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-memory-emerald-600" />
            {formData.isGoal ? 'Your Goal' : 'Your Action'}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          {/* Title */}
          <div>
            <h3 className="font-semibold text-lg text-memory-emerald-800 mb-1">
              {formData.title || 'Untitled'}
            </h3>
            <Badge variant="outline" className="bg-memory-emerald-50 text-memory-emerald-700">
              {formData.isGoal ? 'Long-term Goal' : formData.type?.replace('_', ' ') || 'Action'}
            </Badge>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-clarity-teal-500" />
              <div>
                <p className="text-sm font-medium">Date</p>
                <p className="text-sm text-gray-600">{formatDate(formData.date)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-clarity-teal-500" />
              <div>
                <p className="text-sm font-medium">Time</p>
                <p className="text-sm text-gray-600">
                  {formatTime(formData.startTime)}
                  {formData.endTime && ` - ${formatTime(formData.endTime)}`}
                  {formData.duration && ` (${formData.duration} minutes)`}
                </p>
              </div>
            </div>
          </div>

          {/* Location */}
          {formData.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-clarity-teal-500" />
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-gray-600">{formData.location}</p>
              </div>
            </div>
          )}

          {/* Why It Matters */}
          {formData.notes && (
            <div className="flex items-start gap-2">
              <MessageSquare className="h-4 w-4 text-brain-health-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Why this matters to you</p>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg mt-1">
                  {formData.notes}
                </p>
              </div>
            </div>
          )}

          {/* Linked Goal */}
          {formData.goalId && formData.goalId !== 'none' && (
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-memory-emerald-500" />
              <div>
                <p className="text-sm font-medium">Connected to Goal</p>
                <Badge className="bg-memory-emerald-50 text-memory-emerald-700 border-memory-emerald-200 mt-1">
                  Goal: {formData.goalId}
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Support Team */}
      {formData.watchers && formData.watchers.length > 0 && (
        <Card className="border-blue-200">
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Users className="h-5 w-5" />
              Your Support Team ({formData.watchers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex flex-wrap gap-2">
              {formData.watchers.map((watcher: string, index: number) => (
                <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {watcher}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              These people will receive gentle updates about your progress and can offer encouragement when needed.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Recurrence Info */}
      {formData.recurrencePattern && formData.recurrencePattern !== 'none' && (
        <Card className="border-purple-200">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div>
                <p className="text-sm font-medium">Recurring Action</p>
                <p className="text-sm text-gray-600">
                  This will repeat {formData.recurrencePattern} 
                  {formData.recurrenceInterval > 1 && ` every ${formData.recurrenceInterval}`}
                  {formData.recurrenceEndDate && ` until ${formatDate(formData.recurrenceEndDate)}`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Encouragement */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardContent className="pt-4">
          <div className="text-center">
            <p className="text-sm font-medium text-yellow-800 mb-1">
              🌟 You're building something amazing!
            </p>
            <p className="text-sm text-yellow-700">
              Every action you take, no matter how small, is a step forward on your journey. 
              Your brain is learning and adapting with each positive choice you make.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
