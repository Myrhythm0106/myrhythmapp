import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMemoryBridge } from '@/hooks/memoryBridge/useMemoryBridge';
import { Calendar, Clock, Zap, Target, Brain, Heart } from 'lucide-react';

export function PACTSchedulingInterface() {
  const { extractedActions } = useMemoryBridge();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  const unscheduledPACTs = extractedActions.filter(a => a.status === 'pending');

  const getOptimalTimeSlot = (priority: number, energyLevel?: number) => {
    if (priority > 8) return 'morning-peak'; // 8-10 AM
    if (priority > 6) return 'morning-mid'; // 10-12 PM
    if (priority > 4) return 'afternoon'; // 2-4 PM
    return 'evening'; // 6-8 PM
  };

  const getEnergyIcon = (energyLevel: number) => {
    if (energyLevel > 7) return <Zap className="h-4 w-4 text-yellow-500" />;
    if (energyLevel > 5) return <Target className="h-4 w-4 text-green-500" />;
    if (energyLevel > 3) return <Brain className="h-4 w-4 text-blue-500" />;
    return <Heart className="h-4 w-4 text-purple-500" />;
  };

  const timeSlots = [
    { id: 'morning-peak', label: 'Morning Peak', time: '8:00-10:00 AM', energy: 'High', color: 'bg-yellow-50 border-yellow-200' },
    { id: 'morning-mid', label: 'Late Morning', time: '10:00-12:00 PM', energy: 'Medium-High', color: 'bg-green-50 border-green-200' },
    { id: 'afternoon', label: 'Afternoon Focus', time: '2:00-4:00 PM', energy: 'Medium', color: 'bg-blue-50 border-blue-200' },
    { id: 'evening', label: 'Evening Routine', time: '6:00-8:00 PM', energy: 'Low-Medium', color: 'bg-purple-50 border-purple-200' }
  ];

  return (
    <div className="space-y-6">
      {/* AI-Powered Scheduling Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Brain className="h-5 w-5" />
            AI-Powered PACT Scheduling
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-purple-700">
            Smart scheduling based on energy levels, priority, and optimal completion times.
            One-click scheduling with automatic calendar integration.
          </p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Unscheduled PACTs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              Unscheduled PACTs ({unscheduledPACTs.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {unscheduledPACTs.map((pact) => {
                const optimalSlot = getOptimalTimeSlot(pact.priority_level);
                const optimalSlotInfo = timeSlots.find(slot => slot.id === optimalSlot);
                
                return (
                  <div key={pact.id} className="p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="font-medium text-sm mb-2">{pact.action_text}</p>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            Priority: {pact.priority_level}/10
                          </Badge>
                          {pact.confidence_score && (
                            <Badge variant="outline" className="text-xs">
                              Confidence: {Math.round(pact.confidence_score * 100)}%
                            </Badge>
                          )}
                        </div>
                        {optimalSlotInfo && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {getEnergyIcon(8)} 
                            <span>Optimal: {optimalSlotInfo.label}</span>
                          </div>
                        )}
                      </div>
                      <Button size="sm" className="shrink-0">
                        Schedule Now
                      </Button>
                    </div>
                  </div>
                );
              })}
              
              {unscheduledPACTs.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>All PACTs are scheduled!</p>
                  <p className="text-sm">Great job staying organized.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Optimal Time Slots */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Optimal Time Slots
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {timeSlots.map((slot) => (
                <div 
                  key={slot.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${slot.color} ${
                    selectedTimeSlot === slot.id ? 'ring-2 ring-purple-500' : ''
                  }`}
                  onClick={() => setSelectedTimeSlot(slot.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{slot.label}</h4>
                      <p className="text-sm text-muted-foreground">{slot.time}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Energy Level: {slot.energy}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-xs">
                        {unscheduledPACTs.filter(p => getOptimalTimeSlot(p.priority_level) === slot.id).length} suggested
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedTimeSlot && (
              <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-medium text-purple-800 mb-2">Auto-Schedule for {timeSlots.find(s => s.id === selectedTimeSlot)?.label}</h4>
                <p className="text-sm text-purple-700 mb-3">
                  This will automatically schedule all compatible PACTs for this time slot with calendar reminders.
                </p>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Auto-Schedule All Compatible PACTs
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Scheduling Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4">
              <Zap className="h-5 w-5 text-yellow-500" />
              <span className="text-sm">Schedule High Priority</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4">
              <Calendar className="h-5 w-5 text-blue-500" />
              <span className="text-sm">Today's Focus</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4">
              <Clock className="h-5 w-5 text-green-500" />
              <span className="text-sm">This Week</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4">
              <Brain className="h-5 w-5 text-purple-500" />
              <span className="text-sm">Energy Match</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}