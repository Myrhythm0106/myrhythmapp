import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, PoundSterling, Users, Target, ArrowUpRight, Shield, Brain, Heart, Zap } from 'lucide-react';

// ─── Data ───────────────────────────────────────────────────────────────────────

const newSubs = [250,150,100,120,140,160,180,200,220,250,280,300];
const b2bPartners = [2,3,5,7,10,12,15,18,22,27,33,40];
const providerListings = [0,0,5,8,12,18,25,32,40,50,60,75];
const engCosts = [15000,15000,15000,18000,18000,20000,20000,22000,22000,25000,25000,28000];
const infraCosts = [1500,1500,2000,2000,2500,2500,3000,3000,3500,3500,4000,4000];
const mktCosts = [3000,3000,5000,5000,8000,8000,10000,10000,12000,12000,15000,15000];
const opsCosts = [2000,2000,3000,3000,4000,4000,5000,5000,6000,6000,7000,7000];
const complianceCosts = [1000,1000,1500,1500,2000,2000,2000,2500,2500,3000,3000,3000];
const csCosts = [0,0,1000,1500,2000,2500,3000,3500,4000,4500,5000,5500];

function buildMonthlyData() {
  const data = [];
  let cumSubs = 0;
  let cumPL = 0;
  let cash = 250000;

  for (let m = 0; m < 12; m++) {
    const churn = m === 0 ? 0 : Math.round(cumSubs * 0.05);
    cumSubs = cumSubs + newSubs[m] - churn;
    const b2cMRR = cumSubs * 10;
    const b2bMRR = b2bPartners[m] * 249;
    const provMRR = providerListings[m] * 99;
    const totalMRR = b2cMRR + b2bMRR + provMRR;
    const totalCosts = engCosts[m] + infraCosts[m] + mktCosts[m] + opsCosts[m] + complianceCosts[m] + csCosts[m];
    const ebit = totalMRR - totalCosts;
    cumPL += ebit;
    const funding = m === 0 ? 250000 : 0;
    cash = (m === 0 ? 0 : cash) + funding + ebit;

    data.push({
      month: `M${m + 1}`,
      b2cMRR, b2bMRR, provMRR, totalMRR,
      totalCosts, ebit, cumPL, cash,
      subscribers: cumSubs,
      arr: totalMRR * 12,
      engineering: engCosts[m],
      marketing: mktCosts[m],
      operations: opsCosts[m],
      infrastructure: infraCosts[m],
    });
  }
  return data;
}

const monthlyData = buildMonthlyData();
const lastMonth = monthlyData[monthlyData.length - 1];

const fundingRounds = [
  { round: 'Pre-Seed', amount: '£250K', valuation: '£1.67M', timeline: 'Q1 2026', milestone: '1,000 founding members, MVP live', explain: 'First investment to build the product — investors get shares at £1.67M company value' },
  { round: 'Series A', amount: '£2M', valuation: '£15M', timeline: 'Q1 2027', milestone: '5,000+ users, £42K MRR', explain: 'Bigger investment to grow fast — company now worth £15M based on proven traction' },
  { round: 'Series B', amount: '£10M', valuation: '£75M', timeline: 'Q1 2028', milestone: '50K users, NHS pilots', explain: 'Major funding for market dominance — NHS partnerships validate the clinical value' },
  { round: 'Series C', amount: '£25M', valuation: '£200M', timeline: '2029', milestone: 'Market leadership, API platform', explain: 'Growth capital for global expansion — company valued at £200M' },
];

const mvpFeatures = [
  { name: 'Memory Bridge', budget: '£25K', ccm: 'Capture', icon: Brain, evidence: '73% of caregivers forget verbal commitments' },
  { name: 'Smart Scheduling', budget: '£20K', ccm: 'Commit', icon: Zap, evidence: 'Cognitive peaks vary 40% person-to-person' },
  { name: 'Support Circle', budget: '£15K', ccm: 'Collaborative', icon: Heart, evidence: '89% better outcomes with coordinated care' },
  { name: 'Next Steps Hub', budget: '£12K', ccm: 'Calibrate', icon: Target, evidence: '3x completion with visual tracking' },
];

const fmt = (n: number) => n >= 1000 ? `£${(n / 1000).toFixed(0)}K` : `£${n}`;

// Layman explanation helper
const Explain = ({ children }: { children: string }) => (
  <p className="text-xs text-muted-foreground/70 italic mt-1">{children}</p>
);

// ─── Component ──────────────────────────────────────────────────────────────────

export default function FounderFinancialsPage() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">LEAP-OS Financial Model</h1>
        <p className="text-muted-foreground mt-1">The World's First Cognitive Operating System — Investor Dashboard</p>
        <Explain>This dashboard shows how the business will earn money, what it costs to run, and when we expect to become profitable.</Explain>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Pre-Seed Ask', value: '£250K', sub: '£1.67M valuation', icon: PoundSterling, explain: 'The money we need now to build and launch — investors value the company at £1.67M' },
          { label: 'M12 ARR', value: fmt(lastMonth.arr), sub: `${fmt(lastMonth.totalMRR)} MRR`, icon: TrendingUp, explain: "If month 12's revenue repeated all year, we'd earn this much" },
          { label: 'Subscribers (M12)', value: lastMonth.subscribers.toLocaleString(), sub: '5% monthly churn', icon: Users, explain: 'Total paying users by month 12 — we lose about 5% each month to cancellations' },
          { label: 'Gross Margin', value: '85%', sub: 'LTV:CAC 9:1', icon: Target, explain: 'We keep 85p of every £1 earned, and earn £9 for every £1 spent on marketing' },
        ].map(({ label, value, sub, icon: Icon, explain }) => (
          <Card key={label} className="border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{label}</span>
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{sub}</p>
              <Explain>{explain}</Explain>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pricing Clarification */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <PoundSterling className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-foreground">Founding Member Pricing</p>
              <p className="text-sm text-muted-foreground mt-1">
                <strong>Founding Members: £10/month</strong> — locked in forever as a reward for early supporters
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Standard Price: £15/month</strong> — what new users pay after founding spots fill (50% more)
              </p>
              <Explain>Founding members save £5/month (£60/year). This creates urgency to sign up early and rewards our first 500 users.</Explain>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowUpRight className="h-5 w-5 text-primary" />
            12-Month MRR Projection
          </CardTitle>
          <CardDescription>B2C subscriptions + B2B clinical + Provider directory</CardDescription>
          <Explain>This chart shows how our monthly income grows from three sources: consumer subscriptions (B2C), clinical partnerships (B2B), and provider directory listings.</Explain>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" className="text-muted-foreground" />
              <YAxis tickFormatter={(v) => fmt(v)} className="text-muted-foreground" />
              <Tooltip formatter={(v: number) => `£${v.toLocaleString()}`} />
              <Legend />
              <Area type="monotone" dataKey="b2cMRR" name="B2C MRR" stackId="1" fill="hsl(var(--primary))" stroke="hsl(var(--primary))" fillOpacity={0.6} />
              <Area type="monotone" dataKey="b2bMRR" name="B2B MRR" stackId="1" fill="hsl(var(--accent))" stroke="hsl(var(--accent))" fillOpacity={0.6} />
              <Area type="monotone" dataKey="provMRR" name="Provider MRR" stackId="1" fill="hsl(var(--secondary))" stroke="hsl(var(--secondary))" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Cost Breakdown + Cash Flow */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Cost Structure</CardTitle>
            <CardDescription>Monthly operating costs by category</CardDescription>
            <Explain>Where our money goes each month — engineering is the biggest cost because we're building complex AI features.</Explain>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(v) => fmt(v)} />
                <Tooltip formatter={(v: number) => `£${v.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="engineering" name="Engineering" stackId="a" fill="hsl(var(--primary))" />
                <Bar dataKey="marketing" name="Marketing" stackId="a" fill="hsl(var(--accent))" />
                <Bar dataKey="operations" name="Operations" stackId="a" fill="hsl(var(--secondary))" />
                <Bar dataKey="infrastructure" name="Infra" stackId="a" fill="hsl(var(--muted))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cash Flow</CardTitle>
            <CardDescription>Running cash balance with £250K injection</CardDescription>
            <Explain>The solid line shows money in the bank. The dashed line shows monthly profit/loss — when it crosses above zero, we're making money.</Explain>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(v) => fmt(v)} />
                <Tooltip formatter={(v: number) => `£${v.toLocaleString()}`} />
                <Line type="monotone" dataKey="cash" name="Cash Balance" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="ebit" name="Monthly EBIT" stroke="hsl(var(--destructive))" strokeWidth={1.5} dot={false} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Unit Economics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Unit Economics
          </CardTitle>
          <Explain>These numbers show how profitable each individual customer is — investors love these metrics because they prove the business model works.</Explain>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { label: 'CAC', value: '£35', explain: 'Cost to get one new customer — includes ads and referral rewards' },
              { label: 'LTV', value: '£315', explain: 'Total revenue one customer generates over their lifetime (~21 months)' },
              { label: 'LTV:CAC', value: '9.0x', explain: 'We earn £9 for every £1 spent on marketing — 3x+ is considered healthy' },
              { label: 'Gross Margin', value: '85%', explain: 'We keep 85p of every £1 after basic server costs' },
              { label: 'Payback', value: '3.5 months', explain: 'We recover marketing cost in 3.5 months — then it\'s pure profit' },
            ].map(({ label, value, explain }) => (
              <div key={label} className="text-center">
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-xl font-bold text-foreground mt-1">{value}</p>
                <Explain>{explain}</Explain>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* MVP Features with CCM */}
      <Card>
        <CardHeader>
          <CardTitle>MVP Features — CCM Framework Mapping</CardTitle>
          <CardDescription>£100K budget justified by market evidence</CardDescription>
          <Explain>Each feature maps to a layer of our Cognitive Operating System (CCM) — this shows investors we're building with purpose, not guessing.</Explain>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {mvpFeatures.map(({ name, budget, ccm, icon: Icon, evidence }) => (
              <div key={name} className="flex items-start gap-3 p-4 rounded-lg border border-border">
                <Icon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{ccm}</span>
                    <span className="text-sm text-muted-foreground ml-auto">{budget}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 italic">{evidence}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Funding Roadmap */}
      <Card>
        <CardHeader>
          <CardTitle>Funding Roadmap</CardTitle>
          <CardDescription>Pre-Seed → Series C progression</CardDescription>
          <Explain>Each round brings bigger investment at a higher company valuation — this shows the growth path from startup to market leader.</Explain>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {fundingRounds.map(({ round, amount, valuation, timeline, milestone, explain }, i) => (
              <div key={round}>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                    {i < fundingRounds.length - 1 && <div className="w-px h-8 bg-border" />}
                  </div>
                  <div className="flex-1 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <span className="font-semibold text-foreground">{round}</span>
                    <span className="text-primary font-bold">{amount}</span>
                    <span className="text-sm text-muted-foreground">@ {valuation}</span>
                    <span className="text-xs text-muted-foreground">({timeline})</span>
                  </div>
                  <p className="text-xs text-muted-foreground hidden md:block max-w-xs">{milestone}</p>
                </div>
                <div className="ml-7 mt-1">
                  <Explain>{explain}</Explain>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground text-center pb-8">
        Confidential — MyRhythm LEAP-OS Financial Projections. For authorised viewing only.
      </p>
    </div>
  );
}
