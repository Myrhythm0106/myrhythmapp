
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useFormContext } from 'react-hook-form';
import { Star, Lightbulb, CalendarIcon, Clock, Heart, Coffee } from 'lucide-react';
import { ActionTypeSelector } from '../components/ActionTypeSelector';
import { actionTypes } from '../data/actionTypes';

export function ActionBasicsStep() {
  const { control, watch, setValue } = useFormContext();
  const isGoal = watch('isGoal');
  const actionType = watch('type');
  const selectedType = actionTypes.find(type => type.value === actionType);

  return (
    <div className="space-y-6">
      {/* Helper Card */}
      <Card className="bg-gradient-to-r from-clarity-teal-50 to-memory-emerald-50 border-clarity-teal-200">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-clarity-teal-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-clarity-teal-800 mb-1">
                Brain-Friendly Tip
              </p>
              <p className="text-sm text-clarity-teal-700">
                Start with what you want to do, then we'll help you decide when and get the right support. 
                Every small step counts on your journey! Include family time and breaks to maintain balance.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goal Toggle */}
      <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
        <div>
          <p className="font-medium text-purple-800">Is this a long-term goal?</p>
          <p className="text-sm text-purple-600">Goals help break big achievements into smaller steps</p>
        </div>
        <Switch 
          checked={isGoal} 
          onCheckedChange={(checked) => {
            setValue('isGoal', checked);
            if (checked) {
              setValue('type', 'daily');
            } else {
              setValue('type', 'daily_win');
            }
          }}
        />
      </div>

      {/* Action Title */}
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-medium flex items-center gap-2">
              <Star className="h-4 w-4 text-memory-emerald-500" />
              What would you like to {isGoal ? 'achieve' : 'do'}?
            </FormLabel>
            <FormControl>
              <Input
                placeholder={
                  isGoal 
                    ? "e.g., Walk to the mailbox independently" 
                    : "e.g., Take a 10-minute walk around the block"
                }
                className="text-base p-3"
                {...field}
              />
            </FormControl>
            <FormMessage />
            <p className="text-sm text-gray-600 mt-1">
              {isGoal 
                ? "Describe what you want to accomplish over time"
                : "Be specific about what you'll do - this helps your brain prepare!"
              }
            </p>
          </FormItem>
        )}
      />

      {/* Action Type Selection */}
      {!isGoal && <ActionTypeSelector />}

      {/* Show examples for selected type */}
      {selectedType && !isGoal && (
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="pt-4">
            <p className="font-medium text-gray-800 mb-2">Examples of {selectedType.label}:</p>
            <div className="flex flex-wrap gap-2">
              {selectedType.examples.map((example, index) => (
                <Badge key={index} variant="outline" className="bg-white">
                  {example}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Special guidance for family time and breaks */}
      {(actionType === 'family_time' || actionType === 'break_time') && (
        <Card className="bg-gradient-to-r from-heart-50 to-clarity-teal-50 border-heart-200">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              {actionType === 'family_time' ? 
                <Heart className="h-5 w-5 text-heart-600 mt-0.5 flex-shrink-0" /> :
                <Coffee className="h-5 w-5 text-clarity-teal-600 mt-0.5 flex-shrink-0" />
              }
              <div>
                <p className="text-sm font-medium text-gray-800 mb-1">
                  {actionType === 'family_time' ? 'Family Connection Benefits' : 'Break Time Benefits'}
                </p>
                <p className="text-sm text-gray-700">
                  {actionType === 'family_time' 
                    ? 'Family time strengthens emotional support, reduces isolation, and creates positive memories that aid recovery.'
                    : 'Regular breaks prevent mental fatigue, improve focus when you return to tasks, and support brain healing.'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Custom Reason Field */}
      {actionType === 'custom' && !isGoal && (
        <FormField
          control={control}
          name="customReason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What type of activity is this?</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Personal care time, Creative hobby, etc."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Date and Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-clarity-teal-500" />
                When will you do this?
              </FormLabel>
              <FormControl>
                <Input type="date" className="p-3" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="startTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-clarity-teal-500" />
                What time?
              </FormLabel>
              <FormControl>
                <Input type="time" className="p-3" {...field} />
              </FormControl>
              <FormMessage />
              <p className="text-sm text-gray-600">
                {actionType === 'family_time' ? 'Choose a time when family is usually available' :
                 actionType === 'break_time' ? 'Schedule breaks between your main activities' :
                 'Choose a time when you typically have good energy'}
              </p>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
