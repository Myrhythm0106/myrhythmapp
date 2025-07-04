
import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function GoalDefinitionGuide() {
  return (
    <Card className="bg-gradient-to-r from-memory-emerald-50 to-clarity-teal-50 border-memory-emerald-200">
      <CardContent className="pt-4">
        <div className="flex items-center gap-2 mb-3">
          <HelpCircle className="h-5 w-5 text-memory-emerald-600" />
          <h4 className="font-semibold text-memory-emerald-800">Goal Definition Guide</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <Badge className="bg-memory-emerald-100 text-memory-emerald-700 mb-2">WHAT</Badge>
            <p className="text-gray-600">Be specific about what you want to achieve</p>
          </div>
          <div>
            <Badge className="bg-clarity-teal-100 text-clarity-teal-700 mb-2">WHEN</Badge>
            <p className="text-gray-600">Set a realistic timeframe</p>
          </div>
          <div>
            <Badge className="bg-brain-health-100 text-brain-health-700 mb-2">HOW</Badge>
            <p className="text-gray-600">Define how you'll measure success</p>
          </div>
          <div>
            <Badge className="bg-purple-100 text-purple-700 mb-2">WHY</Badge>
            <p className="text-gray-600">Connect to what matters to you</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
