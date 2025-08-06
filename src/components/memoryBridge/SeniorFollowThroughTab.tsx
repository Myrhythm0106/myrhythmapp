
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { SeniorPACTTable } from './SeniorPACTTable';
import { useMemoryBridge } from '@/hooks/memoryBridge/useMemoryBridge';
import { Target, Heart, CheckCircle, Clock, TrendingUp, Star } from 'lucide-react';

export function SeniorFollowThroughTab() {
  const { extractedActions, fetchExtractedActions } = useMemoryBridge();

  useEffect(() => {
    fetchExtractedActions();
  }, [fetchExtractedActions]);

  // Calculate stats
  const totalPACTs = extractedActions.length;
  const completedPACTs = extractedActions.filter(action => action.status === 'completed').length;
  const confirmedPACTs = extractedActions.filter(action => action.status === 'confirmed').length;
  const pendingPACTs = extractedActions.filter(action => action.status === 'pending').length;
  
  const completionRate = totalPACTs > 0 ? Math.round((completedPACTs / totalPACTs) * 100) : 0;
  const trustScore = Math.round((completionRate * 0.6) + ((confirmedPACTs / totalPACTs) * 40));

  if (totalPACTs === 0) {
    return (
      <Card className="border-2 border-dashed border-brain-health/30">
        <CardContent className="pt-12 pb-12">
          <div className="text-center space-y-6">
            <div className="mx-auto w-20 h-20 bg-brain-health/10 rounded-full flex items-center justify-center">
              <Target className="h-10 w-10 text-brain-health" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-brain-health mb-3">No Promises Yet</h3>
              <p className="text-lg text-muted-foreground mb-6 max-w-md mx-auto">
                Start recording conversations to capture your promises and commitments automatically.
              </p>
              <div className="bg-gradient-to-r from-brain-health/10 to-emerald/10 rounded-lg p-6 max-w-lg mx-auto">
                <div className="flex items-center gap-3 justify-center mb-3">
                  <Heart className="h-5 w-5 text-brain-health" />
                  <span className="font-semibold text-brain-health">Your Journey to Better Relationships</span>
                  <Heart className="h-5 w-5 text-brain-health" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Record a conversation and watch as we find every commitment that matters to the people you care about.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Empowering Header */}
      <Card className="bg-gradient-to-r from-brain-health/10 to-emerald/10 border-2 border-brain-health/30">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl font-bold text-brain-health mb-3">
            I Keep My Promises
          </CardTitle>
          <p className="text-lg text-muted-foreground mb-6">
            Every commitment I honor builds trust and strengthens my relationships
          </p>
          
          {/* Trust Score Display */}
          <div className="inline-flex items-center gap-4 bg-white/60 rounded-full px-8 py-4 border border-brain-health/20">
            <div className="text-center">
              <div className="text-4xl font-bold text-brain-health">{trustScore}%</div>
              <div className="text-sm text-muted-foreground">Trust Score</div>
            </div>
            <div className="w-px h-12 bg-brain-health/20"></div>
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-6 w-6 ${
                    i < Math.ceil(trustScore / 20) ? 'text-sunrise-amber fill-current' : 'text-gray-200'
                  }`} 
                />
              ))}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-white/60 rounded-lg border border-emerald/20">
              <div className="mx-auto w-12 h-12 bg-emerald/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="text-3xl font-bold text-emerald-600 mb-2">{completedPACTs}</div>
              <div className="text-sm font-medium text-muted-foreground">Promises Kept</div>
            </div>

            <div className="text-center p-6 bg-white/60 rounded-lg border border-orange/20">
              <div className="mx-auto w-12 h-12 bg-orange/10 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-orange-600 mb-2">{pendingPACTs}</div>
              <div className="text-sm font-medium text-muted-foreground">Need Action</div>
            </div>

            <div className="text-center p-6 bg-white/60 rounded-lg border border-brain-health/20">
              <div className="mx-auto w-12 h-12 bg-brain-health/10 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-brain-health" />
              </div>
              <div className="text-3xl font-bold text-brain-health mb-2">{totalPACTs}</div>
              <div className="text-sm font-medium text-muted-foreground">Total Promises</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm font-medium">
              <span>Promise Completion Progress</span>
              <span>{completedPACTs} of {totalPACTs} complete</span>
            </div>
            <Progress value={completionRate} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* PACT Management Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Target className="h-6 w-6 text-brain-health" />
            My Promise Tracker
          </CardTitle>
          <p className="text-lg text-muted-foreground">
            Track, organize, and follow through on your Promises, Actions, Commitments & Tasks
          </p>
        </CardHeader>
        <CardContent>
          <SeniorPACTTable extractedActions={extractedActions} />
        </CardContent>
      </Card>
    </div>
  );
}
