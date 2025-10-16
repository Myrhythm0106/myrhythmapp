
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Target,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";

export function RevenueTrackerView() {
  const [selectedMonth, setSelectedMonth] = useState("current");

  // Revenue data based on your £500K plan
  const revenueData = {
    current: {
      month: "January 2025",
      target: 12500,
      actual: 8500,
      variance: -4000,
      subscribers: {
        starter: { count: 180, revenue: 1439 },
        pro: { count: 120, revenue: 1199 },
        careTeam: { count: 30, revenue: 480 }
      },
      clinical: {
        small: { count: 1, revenue: 99 },
        medium: { count: 1, revenue: 299 },
        enterprise: { count: 0, revenue: 0 }
      },
      premium: {
        analytics: 45,
        reports: 12,
        family: 80
      }
    }
  };

  const currentData = revenueData.current;
  const progressToTarget = (currentData.actual / currentData.target) * 100;
  const annualProjection = currentData.actual * 12; // Simple projection

  const monthlyTargets = [
    { month: "Jan", target: 12500, actual: 8500 },
    { month: "Feb", target: 15000, actual: 0 },
    { month: "Mar", target: 18000, actual: 0 },
    { month: "Apr", target: 22000, actual: 0 },
    { month: "May", target: 26000, actual: 0 },
    { month: "Jun", target: 30000, actual: 0 },
    { month: "Jul", target: 35000, actual: 0 },
    { month: "Aug", target: 37000, actual: 0 },
    { month: "Sep", target: 39000, actual: 0 },
    { month: "Oct", target: 41000, actual: 0 },
    { month: "Nov", target: 41500, actual: 0 },
    { month: "Dec", target: 41667, actual: 0 }
  ];

  return (
    <div className="space-y-6">
      {/* Revenue Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Current Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mobile-heading-lg font-bold">£{currentData.actual.toLocaleString()}</div>
            <p className="text-green-100">This month</p>
            <Progress value={progressToTarget} className="mt-2 bg-white/20" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Monthly Target
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mobile-heading-lg font-bold">£{currentData.target.toLocaleString()}</div>
            <p className="text-blue-100">January 2025</p>
            <div className="text-sm mt-2">
              {currentData.variance < 0 ? '⚠️' : '✅'} £{Math.abs(currentData.variance).toLocaleString()} 
              {currentData.variance < 0 ? ' behind' : ' ahead'}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Annual Projection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mobile-heading-lg font-bold">£{annualProjection.toLocaleString()}</div>
            <p className="text-purple-100">Based on current</p>
            <div className="text-sm mt-2">
              {annualProjection >= 500000 ? '✅ On track' : '⚠️ Needs improvement'}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Total Subscribers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mobile-heading-lg font-bold">
              {currentData.subscribers.starter.count + 
               currentData.subscribers.pro.count + 
               currentData.subscribers.careTeam.count}
            </div>
            <p className="text-orange-100">Active subscribers</p>
            <div className="text-sm mt-2">Target: 2,800 by Dec</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="breakdown" className="w-full">
        <TabsList className="w-full overflow-x-auto flex md:grid md:grid-cols-4 gap-1">
          <TabsTrigger value="breakdown" className="flex-shrink-0">
            <span className="hidden sm:inline">Revenue Breakdown</span>
            <span className="sm:hidden">Revenue</span>
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex-shrink-0">
            <span className="hidden sm:inline">Monthly Trends</span>
            <span className="sm:hidden">Trends</span>
          </TabsTrigger>
          <TabsTrigger value="projections" className="flex-shrink-0">Projections</TabsTrigger>
          <TabsTrigger value="actions" className="flex-shrink-0">
            <span className="hidden sm:inline">Action Items</span>
            <span className="sm:hidden">Actions</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="breakdown" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Consumer Subscriptions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Consumer Subscriptions (60% target)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <div>
                      <div className="font-medium">Starter Plan (£7.99)</div>
                      <div className="text-sm text-gray-600">{currentData.subscribers.starter.count} subscribers</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">£{currentData.subscribers.starter.revenue}</div>
                      <div className="text-sm text-gray-600">monthly</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div>
                      <div className="font-medium">Pro Plan (£9.99)</div>
                      <div className="text-sm text-gray-600">{currentData.subscribers.pro.count} subscribers</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">£{currentData.subscribers.pro.revenue}</div>
                      <div className="text-sm text-gray-600">monthly</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <div>
                      <div className="font-medium">Care Team (£15.99)</div>
                      <div className="text-sm text-gray-600">{currentData.subscribers.careTeam.count} subscribers</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">£{currentData.subscribers.careTeam.revenue}</div>
                      <div className="text-sm text-gray-600">monthly</div>
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <div className="flex justify-between font-bold">
                      <span>Consumer Total:</span>
                      <span>£{currentData.subscribers.starter.revenue + currentData.subscribers.pro.revenue + currentData.subscribers.careTeam.revenue}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Clinical Partnerships */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-600" />
                  Clinical Partnerships (30% target)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <div className="font-medium">Small Clinics (£99)</div>
                      <div className="text-sm text-gray-600">{currentData.clinical.small.count} partners</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">£{currentData.clinical.small.revenue}</div>
                      <div className="text-sm text-gray-600">monthly</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <div>
                      <div className="font-medium">Medium Healthcare (£299)</div>
                      <div className="text-sm text-gray-600">{currentData.clinical.medium.count} partners</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">£{currentData.clinical.medium.revenue}</div>
                      <div className="text-sm text-gray-600">monthly</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <div>
                      <div className="font-medium">Enterprise (£599)</div>
                      <div className="text-sm text-gray-600">{currentData.clinical.enterprise.count} partners</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">£{currentData.clinical.enterprise.revenue}</div>
                      <div className="text-sm text-gray-600">monthly</div>
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <div className="flex justify-between font-bold">
                      <span>Clinical Total:</span>
                      <span>£{currentData.clinical.small.revenue + currentData.clinical.medium.revenue + currentData.clinical.enterprise.revenue}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Premium Features Revenue (10% target)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-indigo-50 rounded-lg text-center">
                  <div className="font-medium">Advanced Analytics</div>
                  <div className="mobile-heading-md font-bold text-indigo-600">{currentData.premium.analytics}</div>
                  <div className="text-sm text-gray-600">users</div>
                </div>
                <div className="p-3 bg-teal-50 rounded-lg text-center">
                  <div className="font-medium">Clinical Reports</div>
                  <div className="mobile-heading-md font-bold text-teal-600">{currentData.premium.reports}</div>
                  <div className="text-sm text-gray-600">users</div>
                </div>
                <div className="p-3 bg-pink-50 rounded-lg text-center">
                  <div className="font-medium">Family Dashboard</div>
                  <div className="mobile-heading-md font-bold text-pink-600">{currentData.premium.family}</div>
                  <div className="text-sm text-gray-600">users</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="w-5 h-5" />
                Monthly Revenue Targets vs Actual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyTargets.map((month, index) => (
                  <div key={month.month} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="w-12 text-center font-medium">{month.month}</div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Target: £{month.target.toLocaleString()}</span>
                        <span>Actual: £{month.actual.toLocaleString()}</span>
                      </div>
                      <Progress 
                        value={month.actual > 0 ? (month.actual / month.target) * 100 : 0} 
                        className="h-2"
                      />
                    </div>
                    <div className="w-20 text-right">
                      {month.actual > 0 ? (
                        <Badge variant={month.actual >= month.target ? "default" : "destructive"}>
                          {((month.actual / month.target) * 100).toFixed(0)}%
                        </Badge>
                      ) : (
                        <Badge variant="outline">Pending</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projections" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Scenarios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-green-800">Optimistic</span>
                      <span className="font-bold text-green-600">£650,000</span>
                    </div>
                    <p className="text-sm text-green-700">130% of target - accelerated growth</p>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-blue-800">Realistic</span>
                      <span className="font-bold text-blue-600">£500,000</span>
                    </div>
                    <p className="text-sm text-blue-700">100% of target - steady execution</p>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-orange-800">Conservative</span>
                      <span className="font-bold text-orange-600">£375,000</span>
                    </div>
                    <p className="text-sm text-orange-700">75% of target - slower adoption</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Assumptions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm">App launch on July 25, 2025</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm">5% monthly churn rate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm">15% month-over-month growth</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm">Clinical sales cycle: 45 days</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Customer LTV: £150</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="actions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Critical Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 rounded-lg">
                    <div className="font-medium text-red-800">Revenue Gap Alert</div>
                    <p className="text-sm text-red-700">£4,000 behind January target</p>
                    <Button size="sm" className="mt-2">Address Now</Button>
                  </div>
                  
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <div className="font-medium text-orange-800">Clinical Pipeline</div>
                    <p className="text-sm text-orange-700">Need 2 more partnerships this month</p>
                    <Button size="sm" variant="outline" className="mt-2">Review Pipeline</Button>
                  </div>

                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="font-medium text-yellow-800">Conversion Rate</div>
                    <p className="text-sm text-yellow-700">Trial-to-paid below 25% target</p>
                    <Button size="sm" variant="outline" className="mt-2">Optimize Funnel</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  Growth Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="font-medium text-green-800">Care Team Upsells</div>
                    <p className="text-sm text-green-700">30% of Pro users qualify for upgrade</p>
                    <Button size="sm" variant="outline" className="mt-2">Launch Campaign</Button>
                  </div>
                  
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-medium text-blue-800">Enterprise Outreach</div>
                    <p className="text-sm text-blue-700">5 qualified leads in pipeline</p>
                    <Button size="sm" variant="outline" className="mt-2">Accelerate</Button>
                  </div>

                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="font-medium text-purple-800">Premium Features</div>
                    <p className="text-sm text-purple-700">Low adoption - need marketing push</p>
                    <Button size="sm" variant="outline" className="mt-2">Market Better</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
