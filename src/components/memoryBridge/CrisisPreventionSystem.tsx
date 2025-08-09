import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useMemoryBridge } from '@/hooks/memoryBridge/useMemoryBridge';
import { supabase } from '@/integrations/supabase/client';
import { 
  AlertTriangle, 
  Shield, 
  TrendingDown, 
  TrendingUp, 
  Brain, 
  Heart, 
  Clock, 
  Users,
  Activity,
  Zap,
  Eye,
  Bell
} from 'lucide-react';

interface RiskPattern {
  id: string;
  type: 'memory_gap' | 'commitment_overload' | 'relationship_stress' | 'energy_depletion';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  indicators: string[];
  recommendation: string;
  autoActions: string[];
  detectedAt: string;
}

interface CognitiveLoadMetrics {
  currentLoad: number;
  weeklyAverage: number;
  peakCapacity: number;
  commitmentCount: number;
  energyLevel: number;
  stressIndicators: string[];
}

interface RelationshipRisk {
  participant: string;
  riskLevel: 'low' | 'medium' | 'high';
  lastInteraction: string;
  pendingCommitments: number;
  emotionalStakes: string;
  urgency: number;
}

export function CrisisPreventionSystem() {
  const { user } = useAuth();
  const { extractedActions, fetchExtractedActions } = useMemoryBridge();
  const [riskPatterns, setRiskPatterns] = useState<RiskPattern[]>([]);
  const [cognitiveLoad, setCognitiveLoad] = useState<CognitiveLoadMetrics>({
    currentLoad: 0,
    weeklyAverage: 0,
    peakCapacity: 100,
    commitmentCount: 0,
    energyLevel: 5,
    stressIndicators: []
  });
  const [relationshipRisks, setRelationshipRisks] = useState<RelationshipRisk[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (user) {
      analyzeRiskPatterns();
      calculateCognitiveLoad();
      assessRelationshipRisks();
    }
  }, [user, extractedActions]);

  const analyzeRiskPatterns = async () => {
    if (!user) return;
    
    setIsAnalyzing(true);
    
    try {
      await fetchExtractedActions();
      
      const patterns: RiskPattern[] = [];
      const now = new Date();
      
      // Analyze memory gaps
      const recentActions = extractedActions.filter(action => {
        const actionDate = new Date(action.created_at);
        const daysDiff = (now.getTime() - actionDate.getTime()) / (1000 * 60 * 60 * 24);
        return daysDiff <= 7;
      });
      
      if (recentActions.length > 10) {
        patterns.push({
          id: 'overcommitment',
          type: 'commitment_overload',
          severity: 'high',
          title: 'Commitment Overload Detected',
          description: `You have ${recentActions.length} commitments in the past week, which is above your typical capacity.`,
          indicators: [
            `${recentActions.length} commitments in 7 days`,
            'Above average weekly load',
            'Multiple high-priority items'
          ],
          recommendation: 'Consider postponing non-urgent commitments or asking for help with some tasks.',
          autoActions: ['Notify support circle', 'Suggest priority review'],
          detectedAt: now.toISOString()
        });
      }
      
      // Analyze overdue commitments
      const overdueActions = extractedActions.filter(action => {
        if (action.status !== 'pending') return false;
        const actionDate = new Date(action.created_at);
        const daysDiff = (now.getTime() - actionDate.getTime()) / (1000 * 60 * 60 * 24);
        return daysDiff > 3;
      });
      
      if (overdueActions.length > 0) {
        patterns.push({
          id: 'overdue_commitments',
          type: 'memory_gap',
          severity: overdueActions.length > 3 ? 'critical' : 'medium',
          title: 'Overdue Commitments Detected',
          description: `${overdueActions.length} commitments are overdue, which may strain relationships.`,
          indicators: [
            `${overdueActions.length} overdue items`,
            'Potential relationship impact',
            'Memory gaps evident'
          ],
          recommendation: 'Review overdue commitments and communicate with involved parties about revised timelines.',
          autoActions: ['Alert family members', 'Schedule review session'],
          detectedAt: now.toISOString()
        });
      }
      
      // Analyze emotional stakes
      const highStakeActions = extractedActions.filter(action => 
        action.emotional_stakes && 
        (action.emotional_stakes.includes('important') || action.emotional_stakes.includes('critical'))
      );
      
      if (highStakeActions.length > 5) {
        patterns.push({
          id: 'emotional_overload',
          type: 'relationship_stress',
          severity: 'medium',
          title: 'High Emotional Stakes Pattern',
          description: 'Multiple commitments with high emotional importance detected.',
          indicators: [
            `${highStakeActions.length} emotionally significant commitments`,
            'Increased stress potential',
            'Relationship pressure points'
          ],
          recommendation: 'Focus on the most critical relationships and consider spreading commitments over time.',
          autoActions: ['Suggest priority ranking', 'Recommend stress management'],
          detectedAt: now.toISOString()
        });
      }
      
      setRiskPatterns(patterns);
    } catch (error) {
      console.error('Error analyzing risk patterns:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const calculateCognitiveLoad = async () => {
    if (!user) return;

    try {
      // Get recent mood entries for energy levels
      const { data: moodEntries } = await supabase
        .from('mood_entries')
        .select('energy_level, created_at')
        .eq('user_id', user.id)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      const avgEnergy = moodEntries?.reduce((acc, entry) => acc + entry.energy_level, 0) / (moodEntries?.length || 1) || 5;
      
      // Calculate cognitive load based on commitments and complexity
      const pendingActions = extractedActions.filter(a => a.status === 'pending');
      const commitmentComplexity = pendingActions.reduce((acc, action) => {
        let complexity = 1;
        if (action.emotional_stakes) complexity += 1;
        if (action.assigned_to && action.assigned_to !== 'me') complexity += 1;
        if (action.priority_level > 7) complexity += 1;
        return acc + complexity;
      }, 0);
      
      const currentLoad = Math.min(100, (commitmentComplexity / 20) * 100);
      const weeklyAverage = currentLoad * 0.8; // Simulate weekly average
      
      const stressIndicators = [];
      if (currentLoad > 80) stressIndicators.push('High commitment density');
      if (avgEnergy < 4) stressIndicators.push('Low energy levels');
      if (pendingActions.length > 15) stressIndicators.push('Too many pending items');
      
      setCognitiveLoad({
        currentLoad,
        weeklyAverage,
        peakCapacity: 100,
        commitmentCount: pendingActions.length,
        energyLevel: avgEnergy,
        stressIndicators
      });
    } catch (error) {
      console.error('Error calculating cognitive load:', error);
    }
  };

  const assessRelationshipRisks = () => {
    const participantMap = new Map<string, RelationshipRisk>();
    
    extractedActions.forEach(action => {
      if (!action.assigned_to || action.assigned_to === 'me') return;
      
      const participant = action.assigned_to;
      if (!participantMap.has(participant)) {
        participantMap.set(participant, {
          participant,
          riskLevel: 'low',
          lastInteraction: action.created_at,
          pendingCommitments: 0,
          emotionalStakes: '',
          urgency: 0
        });
      }
      
      const risk = participantMap.get(participant)!;
      
      if (action.status === 'pending') {
        risk.pendingCommitments++;
        
        // Calculate days since commitment
        const daysSince = (new Date().getTime() - new Date(action.created_at).getTime()) / (1000 * 60 * 60 * 24);
        if (daysSince > 3) risk.urgency += 1;
        if (daysSince > 7) risk.urgency += 2;
      }
      
      if (action.emotional_stakes) {
        risk.emotionalStakes = action.emotional_stakes;
        risk.urgency += 1;
      }
      
      // Determine risk level
      if (risk.urgency > 3 || risk.pendingCommitments > 3) {
        risk.riskLevel = 'high';
      } else if (risk.urgency > 1 || risk.pendingCommitments > 1) {
        risk.riskLevel = 'medium';
      }
    });
    
    setRelationshipRisks(Array.from(participantMap.values()));
  };

  const triggerPreventiveAction = async (pattern: RiskPattern) => {
    try {
      // Generate alert for support circle
      await supabase.functions.invoke('generate-accountability-alert', {
        body: {
          userId: user?.id,
          alertType: 'crisis_prevention',
          title: `Crisis Prevention: ${pattern.title}`,
          message: pattern.description,
          severity: pattern.severity,
          targetMembers: [] // Will be populated based on permissions
        }
      });
      
      // Update pattern to mark as addressed
      setRiskPatterns(prev => 
        prev.map(p => 
          p.id === pattern.id 
            ? { ...p, autoActions: [...p.autoActions, 'Alert sent to support circle'] }
            : p
        )
      );
    } catch (error) {
      console.error('Error triggering preventive action:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            Crisis Prevention Status
            {riskPatterns.length > 0 && (
              <Badge variant="destructive">{riskPatterns.length} alerts</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${cognitiveLoad.currentLoad > 80 ? 'text-red-600' : 'text-green-600'}`}>
                {Math.round(cognitiveLoad.currentLoad)}%
              </div>
              <p className="text-sm text-muted-foreground">Cognitive Load</p>
              <Progress value={cognitiveLoad.currentLoad} className="mt-2" />
            </div>
            
            <div className="text-center">
              <div className={`text-2xl font-bold ${relationshipRisks.filter(r => r.riskLevel === 'high').length > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {relationshipRisks.filter(r => r.riskLevel !== 'low').length}
              </div>
              <p className="text-sm text-muted-foreground">Relationship Risks</p>
            </div>
            
            <div className="text-center">
              <div className={`text-2xl font-bold ${cognitiveLoad.energyLevel < 4 ? 'text-red-600' : 'text-green-600'}`}>
                {cognitiveLoad.energyLevel.toFixed(1)}
              </div>
              <p className="text-sm text-muted-foreground">Energy Level</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Patterns */}
      {riskPatterns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Detected Risk Patterns
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {riskPatterns.map((pattern) => (
              <Alert key={pattern.id} className={getSeverityColor(pattern.severity)}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{pattern.title}</h4>
                        <Badge variant={pattern.severity === 'critical' ? 'destructive' : 'secondary'}>
                          {pattern.severity}
                        </Badge>
                      </div>
                      <p className="text-sm mb-2">{pattern.description}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs font-medium mb-1">Indicators:</p>
                      <ul className="text-xs space-y-1">
                        {pattern.indicators.map((indicator, index) => (
                          <li key={index} className="flex items-center gap-1">
                            <div className="w-1 h-1 bg-current rounded-full"></div>
                            {indicator}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <p className="text-xs font-medium mb-1">Recommendation:</p>
                      <p className="text-xs">{pattern.recommendation}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => triggerPreventiveAction(pattern)}
                      >
                        <Bell className="h-3 w-3 mr-1" />
                        Alert Support Circle
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Eye className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Cognitive Load Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Cognitive Load Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Current Load</span>
                <span className="text-sm">{Math.round(cognitiveLoad.currentLoad)}%</span>
              </div>
              <Progress value={cognitiveLoad.currentLoad} />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Weekly Average</span>
                <span className="text-sm">{Math.round(cognitiveLoad.weeklyAverage)}%</span>
              </div>
              <Progress value={cognitiveLoad.weeklyAverage} />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Active Commitments:</span> {cognitiveLoad.commitmentCount}
            </div>
            <div>
              <span className="font-medium">Energy Level:</span> {cognitiveLoad.energyLevel.toFixed(1)}/10
            </div>
          </div>
          
          {cognitiveLoad.stressIndicators.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Stress Indicators:</p>
              <div className="flex flex-wrap gap-1">
                {cognitiveLoad.stressIndicators.map((indicator, index) => (
                  <Badge key={index} variant="secondary">
                    {indicator}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Relationship Risk Assessment */}
      {relationshipRisks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Relationship Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {relationshipRisks.map((risk, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="font-medium">{risk.participant}</span>
                      <span className="text-xs text-muted-foreground">
                        {risk.pendingCommitments} pending commitments
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant={getRiskColor(risk.riskLevel)}>
                      {risk.riskLevel} risk
                    </Badge>
                    {risk.urgency > 2 && (
                      <Badge variant="destructive">
                        <Clock className="h-3 w-3 mr-1" />
                        Urgent
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-green-600">Active</div>
              <p className="text-xs text-muted-foreground">Monitoring Status</p>
            </div>
            <div>
              <div className="text-lg font-semibold">{extractedActions.length}</div>
              <p className="text-xs text-muted-foreground">Total Commitments</p>
            </div>
            <div>
              <div className="text-lg font-semibold text-blue-600">
                {isAnalyzing ? 'Analyzing...' : 'Complete'}
              </div>
              <p className="text-xs text-muted-foreground">Last Analysis</p>
            </div>
            <div>
              <div className="text-lg font-semibold">
                {riskPatterns.length === 0 ? '✓' : '⚠️'}
              </div>
              <p className="text-xs text-muted-foreground">System Status</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}