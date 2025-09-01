import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  TestTube, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Brain,
  Zap,
  Target,
  Clock,
  Users
} from 'lucide-react';
import { useRealtimeACTs } from '@/hooks/memoryBridge/useRealtimeACTs';
import { toast } from 'sonner';

const TEST_SAMPLES = [
  {
    id: 'perfect_action',
    label: '✅ Perfect Action',
    transcript: "Action: I will call Dr. Smith at 555-0123 by Friday at 2pm because my blood pressure medication needs adjustment and this is critical for my health management.",
    expectedCount: 1,
    description: 'Contains all SMART criteria - Specific, Measurable, Assignable, Relevant, Time-bound'
  },
  {
    id: 'conversation_extract',
    label: '🗣️ Natural Conversation',
    transcript: "So I think we should definitely follow up on that insurance claim. Sarah, can you call them tomorrow morning? And John mentioned he needs to schedule his physical exam this month. Oh, and there's an issue with the pharmacy - they keep getting our prescriptions wrong.",
    expectedCount: 3,
    description: 'Should extract: Action (Sarah call insurance), Action (John schedule exam), Issue (pharmacy errors)'
  },
  {
    id: 'meeting_scenario',
    label: '🏥 Healthcare Meeting',
    transcript: "Decision: We've decided to switch to the new medication protocol starting Monday because the current one isn't controlling symptoms effectively. Action: I'll coordinate with the pharmacy to get the new prescriptions filled by end of week. Issue: The patient transportation system is unreliable - high priority issue affecting multiple appointments.",
    expectedCount: 3,
    description: 'Mixed types: Decision, Action, and Issue with different priorities'
  },
  {
    id: 'vague_language',
    label: '❌ Vague Language (Should Extract Little)',
    transcript: "We should probably think about maybe doing something about that at some point. It would be nice if someone could look into it when they have time.",
    expectedCount: 0,
    description: 'Intentionally vague - should extract 0 or very few items with low confidence'
  }
];

interface ACTExtractionTestProps {
  meetingId?: string;
  onTestComplete?: (results: any) => void;
}

export function ACTExtractionTest({ meetingId = 'test-meeting-123', onTestComplete }: ACTExtractionTestProps) {
  const [selectedTest, setSelectedTest] = useState<string>('');
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  
  const { acts, isExtracting, extractACTs, clearACTs } = useRealtimeACTs(meetingId);

  const runTest = async (testCase: typeof TEST_SAMPLES[0]) => {
    setIsRunning(true);
    setSelectedTest(testCase.id);
    clearACTs();
    
    try {
      await extractACTs(testCase.transcript);
      
      // Wait a moment for extraction to complete
      setTimeout(() => {
        const result = {
          testId: testCase.id,
          expected: testCase.expectedCount,
          actual: acts.length,
          passed: acts.length >= testCase.expectedCount * 0.8, // 80% threshold
          extractedItems: acts,
          timestamp: new Date().toISOString()
        };
        
        setTestResults(prev => [...prev.filter(r => r.testId !== testCase.id), result]);
        onTestComplete?.(result);
        
        if (result.passed) {
          toast.success(`Test "${testCase.label}" passed! 🎉`);
        } else {
          toast.error(`Test "${testCase.label}" failed. Expected ~${testCase.expectedCount}, got ${acts.length}`);
        }
        
        setIsRunning(false);
        setSelectedTest('');
      }, 2000);
      
    } catch (error) {
      console.error('Test error:', error);
      toast.error('Test failed to run');
      setIsRunning(false);
      setSelectedTest('');
    }
  };

  const runAllTests = async () => {
    for (const testCase of TEST_SAMPLES) {
      await runTest(testCase);
      await new Promise(resolve => setTimeout(resolve, 3000)); // Wait between tests
    }
  };

  const getTestResult = (testId: string) => {
    return testResults.find(r => r.testId === testId);
  };

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50/50 to-purple-50/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5 text-blue-600" />
          ACT Extraction Testing Suite
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Test the AI's ability to extract Actions, Decisions, and Issues from different types of conversations
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Real-time ACTs Display */}
        {acts.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-600" />
              <span className="font-medium">Live Extracted ACTs</span>
              <Badge variant="secondary">{acts.length} items</Badge>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {acts.map((act, index) => (
                <div key={index} className="p-2 bg-white/80 rounded border border-purple-200 text-xs">
                  <div className="font-medium text-purple-800">{act.action}</div>
                  <div className="text-purple-600 mt-1">
                    👤 {act.assignee} • ⏰ {act.deadline} • 🎯 Priority: {act.priority}
                  </div>
                </div>
              ))}
            </div>
            <Button 
              onClick={clearACTs} 
              variant="outline" 
              size="sm"
              className="w-full"
            >
              Clear Results
            </Button>
          </div>
        )}

        <Separator />

        {/* Test Cases */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Test Cases</h3>
            <Button 
              onClick={runAllTests}
              disabled={isRunning}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Zap className="h-3 w-3" />
              Run All Tests
            </Button>
          </div>

          {TEST_SAMPLES.map((testCase) => {
            const result = getTestResult(testCase.id);
            const isCurrentTest = selectedTest === testCase.id;
            
            return (
              <Card key={testCase.id} className={`p-4 ${isCurrentTest ? 'ring-2 ring-blue-400' : ''}`}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{testCase.label}</span>
                      {result && (
                        result.passed ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Expected: {testCase.expectedCount}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    {testCase.description}
                  </p>
                  
                  <div className="bg-muted/50 p-2 rounded text-xs italic">
                    "{testCase.transcript.slice(0, 100)}..."
                  </div>
                  
                  {result && (
                    <div className="flex items-center gap-4 text-xs">
                      <span className={`flex items-center gap-1 ${
                        result.passed ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <Target className="h-3 w-3" />
                        Actual: {result.actual}
                      </span>
                      <span className="text-muted-foreground">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {new Date(result.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  )}
                  
                  <Button
                    onClick={() => runTest(testCase)}
                    disabled={isRunning}
                    size="sm"
                    variant={result?.passed ? "default" : "outline"}
                    className="w-full gap-2"
                  >
                    {isCurrentTest && isExtracting ? (
                      <>
                        <Brain className="h-3 w-3 animate-pulse" />
                        Extracting...
                      </>
                    ) : (
                      <>
                        <TestTube className="h-3 w-3" />
                        Run Test
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Test Summary */}
        {testResults.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h3 className="font-medium">Test Summary</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-green-50 rounded">
                  <div className="text-lg font-bold text-green-700">
                    {testResults.filter(r => r.passed).length}
                  </div>
                  <div className="text-xs text-green-600">Passed</div>
                </div>
                <div className="p-3 bg-red-50 rounded">
                  <div className="text-lg font-bold text-red-700">
                    {testResults.filter(r => !r.passed).length}
                  </div>
                  <div className="text-xs text-red-600">Failed</div>
                </div>
                <div className="p-3 bg-blue-50 rounded">
                  <div className="text-lg font-bold text-blue-700">
                    {testResults.reduce((acc, r) => acc + r.actual, 0)}
                  </div>
                  <div className="text-xs text-blue-600">Total ACTs</div>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}