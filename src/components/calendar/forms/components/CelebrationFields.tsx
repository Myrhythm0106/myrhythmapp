import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { Cake, Heart, Gift } from 'lucide-react';

export function CelebrationFields() {
  const { control, watch } = useFormContext();
  const actionType = watch('type');
  
  // Only show celebration fields for celebration-related action types
  const celebrationTypes = ['birthday', 'anniversary', 'milestone', 'achievement', 'special_occasion', 'memory_marker', 'gift_reminder', 'celebration'];
  
  if (!celebrationTypes.includes(actionType)) {
    return null;
  }

  const getFieldsForType = () => {
    switch (actionType) {
      case 'birthday':
        return (
          <>
            <FormField
              control={control}
              name="celebrantName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium flex items-center gap-2">
                    <Cake className="h-4 w-4" />
                    Who's birthday is it?
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Mom, Sarah, My daughter" 
                      {...field} 
                      className="p-3"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="celebrantAge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">How old are they turning?</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Age" 
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      className="p-3"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      
      case 'anniversary':
        return (
          <>
            <FormField
              control={control}
              name="celebrantName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    What anniversary is this?
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Wedding anniversary, First date anniversary" 
                      {...field} 
                      className="p-3"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="relationshipYears"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">How many years?</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Years together" 
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      className="p-3"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      
      case 'gift_reminder':
        return (
          <FormField
            control={control}
            name="giftIdeas"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium flex items-center gap-2">
                  <Gift className="h-4 w-4" />
                  Gift ideas or notes
                </FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Gift ideas, budget, where to buy, etc." 
                    {...field} 
                    className="p-3 min-h-[80px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <Card className="mt-4">
      <CardContent className="pt-6 space-y-4">
        {getFieldsForType()}
        
        <FormField
          control={control}
          name="celebrationNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">Celebration notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Special memories, plans, or thoughts about this celebration..." 
                  {...field} 
                  className="p-3 min-h-[80px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {(actionType === 'birthday' || actionType === 'anniversary') && (
          <FormField
            control={control}
            name="isRecurringCelebration"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-base font-medium">
                    Celebrate every year
                  </FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Automatically create this celebration annually
                  </p>
                </div>
              </FormItem>
            )}
          />
        )}
      </CardContent>
    </Card>
  );
}