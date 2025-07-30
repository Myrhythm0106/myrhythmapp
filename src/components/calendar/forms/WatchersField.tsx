
import React, { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useFormContext } from 'react-hook-form';
import { useAccountabilitySystem } from '@/hooks/use-accountability-system';
import { Users, Plus, X, Heart, UserCheck, Stethoscope, User } from 'lucide-react';

export function WatchersField() {
  const { control, setValue, watch } = useFormContext();
  const { supportCircle, isLoading } = useAccountabilitySystem();
  const [selectedWatchers, setSelectedWatchers] = useState<string[]>(watch('watchers') || []);

  // Debug: Log what we're getting
  console.log('🔍 WatchersField Debug:', {
    supportCircleCount: supportCircle.length,
    isLoading,
    members: supportCircle.map(m => ({ 
      id: m.id, 
      name: m.member_name, 
      status: m.status,
      permissions: m.permissions 
    }))
  });

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'family':
        return <Heart className="h-4 w-4 text-red-500" />;
      case 'friend':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'medical':
      case 'healthcare':
        return <Stethoscope className="h-4 w-4 text-green-500" />;
      case 'caregiver':
        return <UserCheck className="h-4 w-4 text-purple-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'family':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'friend':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'medical':
      case 'healthcare':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'caregiver':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const toggleWatcher = (memberId: string) => {
    const isSelected = selectedWatchers.includes(memberId);
    const newWatchers = isSelected 
      ? selectedWatchers.filter(id => id !== memberId)
      : [...selectedWatchers, memberId];
    
    setSelectedWatchers(newWatchers);
    setValue('watchers', newWatchers);
  };

  if (isLoading) {
    return (
      <FormItem>
        <FormLabel>Notify Others (Optional)</FormLabel>
        <FormControl>
          <div className="text-sm text-gray-500">Loading support circle...</div>
        </FormControl>
      </FormItem>
    );
  }

  return (
    <FormField
      control={control}
      name="watchers"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Notify Support Circle Members (Optional)</FormLabel>
          <FormControl>
            <div className="space-y-3">
              {supportCircle.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="py-4">
                    <div className="text-center text-sm text-gray-500">
                      <Users className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p>No support circle members yet.</p>
                      <p className="text-xs mt-1">Add members to your support circle to invite them as watchers.</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 mb-3">
                    Select support circle members to notify about this activity:
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {supportCircle.map((member) => (
                      <div 
                        key={member.id} 
                        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedWatchers.includes(member.id) 
                            ? 'bg-blue-50 border-blue-200' 
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                        onClick={() => toggleWatcher(member.id)}
                      >
                        <div className="flex items-center gap-3">
                          {getRoleIcon(member.role)}
                          <div>
                            <p className="font-medium text-sm">{member.member_name}</p>
                            <p className="text-xs text-gray-500">{member.relationship}</p>
                          </div>
                          <Badge className={`text-xs ${getRoleColor(member.role)}`}>
                            {member.role}
                          </Badge>
                        </div>
                        <Button
                          type="button"
                          variant={selectedWatchers.includes(member.id) ? "default" : "outline"}
                          size="sm"
                          className="h-8"
                        >
                          {selectedWatchers.includes(member.id) ? (
                            <>
                              <X className="h-4 w-4 mr-1" />
                              Remove
                            </>
                          ) : (
                            <>
                              <Plus className="h-4 w-4 mr-1" />
                              Add
                            </>
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                  {selectedWatchers.length > 0 && (
                    <p className="text-xs text-blue-600 mt-2">
                      {selectedWatchers.length} member(s) will be notified about this activity
                    </p>
                  )}
                </div>
              )}
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
