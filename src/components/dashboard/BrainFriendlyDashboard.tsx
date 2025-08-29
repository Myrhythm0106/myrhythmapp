import React, { useState, useEffect } from 'react';
import { User, ArrowRight, CheckCircle2, Calendar, Target, TrendingUp, Star } from 'lucide-react';
import { getRandomIChooseStatement } from '@/data/premiumAffirmations';

export function BrainFriendlyDashboard() {
  const [currentStatement, setCurrentStatement] = useState(() =>
    getRandomIChooseStatement('recovery', false, 'great')
  );
  const [monthlyTheme, setMonthlyTheme] = useState<string>('');

  useEffect(() => {
    const savedTheme = localStorage.getItem('monthlyTheme') || 'Mindful Completion';
    setMonthlyTheme(savedTheme);
    
    const newStatement = getRandomIChooseStatement(
      'recovery', 
      false, 
      'great',
      [],
      savedTheme
    );
    setCurrentStatement(newStatement);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header with #IChoose Statement */}
      <div className="text-center py-12 px-6">
        <h1 className="text-5xl font-bold text-foreground mb-4">
          #IChoose {currentStatement.text}
        </h1>
        <p className="text-xl text-muted-foreground">
          This month's theme is: <span className="font-medium text-brain-health-700">{monthlyTheme}</span>
        </p>
      </div>

      {/* Main Dashboard Container */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="bg-card rounded-3xl shadow-lg p-8">
          
          {/* Navigation Tabs */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-brain-health-50 rounded-full p-1">
              <button className="px-6 py-2 rounded-full text-sm font-medium text-muted-foreground">
                Day
              </button>
              <button className="px-6 py-2 rounded-full text-sm font-medium bg-card text-foreground shadow-sm">
                Week
              </button>
            </div>
          </div>

          {/* Four Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Column 1: Day */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-foreground">Day</h3>
              
              <div className="bg-brain-health-50/50 rounded-2xl p-6 space-y-4">
                <h4 className="font-bold text-foreground">Top Priorities</h4>
                <p className="text-sm text-muted-foreground">
                  Complete morning routine<br/>
                  Review therapy notes<br/>
                  Practice mindfulness
                </p>
              </div>

              <div className="bg-brain-health-50/50 rounded-2xl p-6 space-y-4">
                <h4 className="font-bold text-foreground">Upcoming Appointments</h4>
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-brain-health-600" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Chasriterd Youn</p>
                    <p className="text-xs text-muted-foreground">2:30 PM</p>
                  </div>
                </div>
              </div>

              <div className="bg-brain-health-50/50 rounded-2xl p-6 space-y-4">
                <h4 className="font-bold text-foreground">Varrrntenting</h4>
                <p className="text-sm text-muted-foreground">
                  Track progress on<br/>
                  cognitive exercises<br/>
                  and mood patterns
                </p>
              </div>

              <div className="bg-brain-health-50/50 rounded-2xl p-6 space-y-4">
                <h4 className="font-bold text-foreground">Quick Notes</h4>
                <p className="text-sm text-muted-foreground">
                  Remember to take<br/>
                  breaks between tasks<br/>
                  Focus on breathing
                </p>
              </div>
            </div>

            {/* Column 2: Week */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-foreground">Week</h3>
              
              <div className="bg-clarity-teal-50/50 rounded-2xl p-6 space-y-4">
                <h4 className="font-bold text-foreground">Upcoming Appointments</h4>
                <div className="space-y-2">
                  <p className="text-sm text-foreground">Dr. Smith - Thursday 10 AM</p>
                  <p className="text-sm text-foreground">Therapy Session - Friday 3 PM</p>
                </div>
              </div>

              <div className="bg-clarity-teal-50/50 rounded-2xl p-6 space-y-4">
                <h4 className="font-bold text-foreground">Vtisualilimes</h4>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Weekly Goal Progress</p>
                  <div className="w-full bg-brain-health-100 rounded-full h-2">
                    <div className="bg-sunrise-amber-500 h-2 rounded-full w-3/4"></div>
                  </div>
                </div>
              </div>

              <div className="bg-clarity-teal-50/50 rounded-2xl p-6 space-y-4">
                <h4 className="font-bold text-foreground">Moudllany</h4>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-memory-emerald-500 rounded-full"></div>
                  <p className="text-sm text-foreground">All systems healthy</p>
                </div>
              </div>

              <div className="bg-clarity-teal-50/50 rounded-2xl p-6 space-y-4">
                <h4 className="font-bold text-foreground">WooktoHess</h4>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({length: 35}).map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-3 h-3 rounded-sm ${
                        i % 7 === 0 || i % 7 === 6 ? 'bg-brain-health-200' : 'bg-brain-health-100'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Column 3: Month */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-foreground">Month</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-memory-emerald-50/50 rounded-xl">
                  <div className="w-4 h-4 bg-memory-emerald-500 rounded-sm mt-0.5"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Complete cognitive assessment</p>
                    <p className="text-xs text-muted-foreground">Scheduled for next week</p>
                  </div>
                  <span className="text-xs text-muted-foreground">3.01m</span>
                </div>

                <div className="flex items-start gap-3 p-4 bg-sunrise-amber-50/50 rounded-xl">
                  <div className="w-4 h-4 bg-sunrise-amber-500 rounded-sm mt-0.5"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Update care plan</p>
                    <p className="text-xs text-muted-foreground">Review with healthcare team</p>
                  </div>
                  <span className="text-xs text-muted-foreground">2.15m</span>
                </div>

                <div className="flex items-start gap-3 p-4 bg-brain-health-50/50 rounded-xl">
                  <div className="w-4 h-4 bg-brain-health-500 rounded-sm mt-0.5"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Family support meeting</p>
                    <p className="text-xs text-muted-foreground">Monthly check-in</p>
                  </div>
                  <span className="text-xs text-muted-foreground">1.45m</span>
                </div>
              </div>
            </div>

            {/* Column 4: Year */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-foreground">Year</h3>
              
              <div className="bg-beacon-50/50 rounded-2xl p-6 space-y-4">
                <h4 className="font-bold text-foreground">Annual</h4>
                <div className="space-y-2">
                  <p className="text-sm text-foreground">Complete independence goals</p>
                  <p className="text-sm text-foreground">Expand social connections</p>
                  <p className="text-sm text-foreground">Master new skills</p>
                </div>
              </div>

              <div className="bg-beacon-50/50 rounded-2xl p-6 space-y-4">
                <h4 className="font-bold text-foreground">Annual Goals</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">Cognitive Enhancement</p>
                    <p className="text-xs text-muted-foreground">Improve memory and focus through targeted exercises</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Wellness Integration</p>
                    <p className="text-xs text-muted-foreground">Build sustainable daily routines for optimal health</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}