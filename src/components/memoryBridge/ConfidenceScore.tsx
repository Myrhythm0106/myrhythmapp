import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle,
  Info
} from 'lucide-react';

interface ConfidenceScoreProps {
  score: number; // 0-100
  actionsCount: number;
  transcriptQuality?: 'high' | 'medium' | 'low';
  processingMethod?: 'openai' | 'lemur' | 'fallback';
}

export function ConfidenceScore({ 
  score, 
  actionsCount, 
  transcriptQuality = 'high',
  processingMethod = 'openai' 
}: ConfidenceScoreProps) {
  const getScoreLevel = (score: number) => {
    if (score >= 85) return { level: 'high', color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle };
    if (score >= 70) return { level: 'medium', color: 'text-yellow-600', bg: 'bg-yellow-50', icon: AlertCircle };
    return { level: 'low', color: 'text-red-600', bg: 'bg-red-50', icon: Info };
  };

  const { level, color, bg, icon: Icon } = getScoreLevel(score);

  const getConfidenceMessage = () => {
    if (score >= 85) {
      return "Excellent! High confidence in extracted actions. Ready to schedule.";
    }
    if (score >= 70) {
      return "Good extraction. Please review actions before scheduling.";
    }
    return "Please review carefully - consider re-recording for better results.";
  };

  const getMethodBadge = () => {
    switch (processingMethod) {
      case 'openai':
        return <Badge className="bg-blue-100 text-blue-800">AI Powered</Badge>;
      case 'lemur':
        return <Badge className="bg-purple-100 text-purple-800">LeMUR</Badge>;
      case 'fallback':
        return <Badge className="bg-orange-100 text-orange-800">Rule-based</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className={`border-2 ${bg}`}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield className={`h-5 w-5 ${color}`} />
            <h3 className="font-semibold">Confidence Score</h3>
          </div>
          {getMethodBadge()}
        </div>

        <div className="space-y-4">
          {/* Score Display */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className={`h-4 w-4 ${color}`} />
              <span className={`text-2xl font-bold ${color}`}>{score}%</span>
            </div>
            <Badge 
              variant={level === 'high' ? 'default' : level === 'medium' ? 'secondary' : 'destructive'}
              className="capitalize"
            >
              {level} Confidence
            </Badge>
          </div>

          {/* Progress Bar */}
          <Progress 
            value={score} 
            className="h-2"
          />

          {/* Message */}
          <p className="text-sm text-muted-foreground">
            {getConfidenceMessage()}
          </p>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
            <div className="text-center">
              <div className="text-lg font-semibold text-memory-emerald-600">{actionsCount}</div>
              <p className="text-xs text-muted-foreground">Actions Found</p>
            </div>
            <div className="text-center">
              <div className={`text-lg font-semibold ${
                transcriptQuality === 'high' ? 'text-green-600' :
                transcriptQuality === 'medium' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {transcriptQuality.charAt(0).toUpperCase() + transcriptQuality.slice(1)}
              </div>
              <p className="text-xs text-muted-foreground">Audio Quality</p>
            </div>
          </div>

          {/* Tips for Improvement */}
          {score < 70 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Tips for Better Results:</p>
                  <ul className="text-xs text-blue-800 mt-1 space-y-1">
                    <li>• Speak clearly and avoid background noise</li>
                    <li>• Use specific commitment language ("I will...")</li>
                    <li>• Mention dates and times when possible</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}