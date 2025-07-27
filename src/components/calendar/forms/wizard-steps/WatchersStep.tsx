
import React, { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFormContext } from 'react-hook-form';
import { useAccountabilitySystem } from '@/hooks/use-accountability-system';
import { Users, Plus, X, Heart, UserCheck, Stethoscope, User, Eye } from 'lucide-react';

export function WatchersStep() {
  const { control, watch, setValue } = useFormContext();
  const { supportCircle, isLoading } = useAccountabilitySystem();
  const [selectedWatchers, setSelectedWatchers] = useState<string[]>(watch('watchers') || []);

  const toggleWatcher = (memberId: string) => {
    const isSelected = selectedWatchers.includes(memberId);
    const newWatchers = isSelected 
      ? selectedWatchers.filter(id => id !== memberId)
      : [...selectedWatchers, memberId];
    
    setSelectedWatchers(newWatchers);
    setValue('watchers', newWatchers);
  };

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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-gray-500">
              Loading your support circle...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Helper Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-800 mb-1">
                Select from Your Support Circle
              </p>
              <p className="text-sm text-blue-700">
                Only members of your support circle can be watchers. They'll receive gentle updates about your activities 
                and can offer encouragement when you need it most.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What Watchers See */}
      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Eye className="h-4 w-4 text-gray-600" />
            What will your watchers see?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>When you complete an activity (celebrate with you!)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span>If you haven't started 30 minutes after scheduled time (gentle reminder)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Your progress toward linked goals (encouragement)</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            ℹ️ They won't see personal details unless you choose to share them
          </p>
        </CardContent>
      </Card>

      {/* Selected Watchers */}
      {selectedWatchers.length > 0 && (
        <Card className="border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-green-800">
              Selected Watchers ({selectedWatchers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedWatchers.map((watcherId) => {
                const member = supportCircle.find(m => m.id === watcherId);
                if (!member) return null;
                return (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {getRoleIcon(member.role)}
                        <div>
                          <p className="font-medium text-sm">{member.member_name}</p>
                          <p className="text-xs text-gray-500">{member.relationship}</p>
                        </div>
                      </div>
                      <Badge className={`text-xs ${getRoleColor(member.role)}`}>
                        {member.role}
                      </Badge>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleWatcher(member.id)}
                      className="h-8 w-8 p-0 hover:bg-red-50"
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add from Support Circle */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Add from Your Support Circle</CardTitle>
        </CardHeader>
        <CardContent>
          {supportCircle.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-sm text-gray-500 mb-2">No support circle members yet</p>
              <p className="text-xs text-gray-400">Add members to your support circle first to select them as watchers</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {supportCircle
                .filter(member => !selectedWatchers.includes(member.id))
                .map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
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
                      variant="outline"
                      size="sm"
                      onClick={() => toggleWatcher(member.id)}
                      className="h-8"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Skip Option */}
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">
          You can always add watchers later or do this activity on your own
        </p>
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            setSelectedWatchers([]);
            setValue('watchers', []);
          }}
          className="text-sm"
        >
          Skip - I'll do this independently
        </Button>
      </div>
    </div>
  );
}
