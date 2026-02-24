import { ReactNode } from "react";

/* ─── Shared layout wrapper ─── */
function Slide({ children, bg = "white" }: { children: ReactNode; bg?: string }) {
  return (
    <div
      className="w-[1920px] h-[1080px] overflow-hidden flex flex-col"
      style={{
        background: bg,
        fontFamily: "'Inter', 'SF Pro Display', -apple-system, system-ui, sans-serif",
        color: "#1a1a2e",
      }}
    >
      {children}
    </div>
  );
}

function GradientLine() {
  return (
    <div
      className="w-[120px] h-[4px] rounded-full"
      style={{ background: "linear-gradient(90deg, #f97316, #a855f7)" }}
    />
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <span
      className="text-[16px] font-semibold tracking-[0.2em] uppercase"
      style={{ color: "#a855f7" }}
    >
      {children}
    </span>
  );
}

/* ─── SLIDE 1: TITLE ─── */
function Slide01() {
  return (
    <Slide bg="#fafafa">
      <div className="flex-1 flex flex-col items-center justify-center px-[200px] text-center">
        <GradientLine />
        <h1 className="mt-[40px] text-[96px] font-bold tracking-tight leading-none" style={{ color: "#1a1a2e" }}>
          MyRhythm
        </h1>
        <p className="mt-[24px] text-[32px] font-light tracking-wide" style={{ color: "#64748b" }}>
          Continuous Cognitive Support
        </p>
        <div className="mt-[60px] w-[600px] h-[1px]" style={{ background: "rgba(0,0,0,0.08)" }} />
        <p className="mt-[24px] text-[20px]" style={{ color: "#94a3b8" }}>
          Investor Presentation · 2026
        </p>
      </div>
    </Slide>
  );
}

/* ─── SLIDE 2: THE HUMAN PROBLEM ─── */
function Slide02() {
  return (
    <Slide>
      <div className="flex-1 flex flex-col justify-center px-[160px]">
        <SectionLabel>The Human Problem</SectionLabel>
        <h2 className="mt-[24px] text-[72px] font-bold leading-[1.1]">
          69 million people sustain a<br />traumatic brain injury every year.
        </h2>
        <div className="mt-[60px] flex gap-[80px]">
          {[
            { stat: "53M", label: "Americans are caregivers" },
            { stat: "85%", label: "of TBI survivors report daily cognitive struggles" },
            { stat: "6 wks", label: "average rehab before discharge" },
          ].map((d) => (
            <div key={d.label}>
              <div className="text-[56px] font-bold" style={{ color: "#f97316" }}>{d.stat}</div>
              <div className="text-[20px] mt-[8px] max-w-[280px]" style={{ color: "#64748b" }}>{d.label}</div>
            </div>
          ))}
        </div>
        <p className="mt-[60px] text-[28px] font-light italic" style={{ color: "#94a3b8" }}>
          Rehab ends. Life does not.
        </p>
      </div>
    </Slide>
  );
}

/* ─── SLIDE 3: THE SYSTEM GAP ─── */
function Slide03() {
  return (
    <Slide>
      <div className="flex-1 flex flex-col justify-center px-[160px]">
        <SectionLabel>The System Gap</SectionLabel>
        <h2 className="mt-[24px] text-[56px] font-bold leading-tight">
          The patient goes home. The system moves on.
        </h2>
        <div className="mt-[60px] flex items-center gap-[40px]">
          {/* Left: what exists */}
          <div className="flex-1 p-[40px] rounded-[16px]" style={{ background: "#f8fafc" }}>
            <div className="text-[18px] font-semibold uppercase tracking-widest mb-[20px]" style={{ color: "#94a3b8" }}>What Exists</div>
            <ul className="space-y-[16px] text-[22px]" style={{ color: "#475569" }}>
              <li>Clinical rehab: 6–12 weeks</li>
              <li>Structured therapist sessions</li>
              <li>Discharge with pamphlets</li>
              <li>Follow-up: 1 visit in 6 months</li>
            </ul>
          </div>
          {/* Gap */}
          <div className="flex flex-col items-center gap-[8px]">
            <div className="w-[4px] h-[80px]" style={{ background: "linear-gradient(180deg, #f97316, transparent)" }} />
            <div className="text-[24px] font-bold px-[20px] py-[12px] rounded-full" style={{ background: "#fef3c7", color: "#92400e" }}>GAP</div>
            <div className="w-[4px] h-[80px]" style={{ background: "linear-gradient(180deg, transparent, #a855f7)" }} />
          </div>
          {/* Right: what's needed */}
          <div className="flex-1 p-[40px] rounded-[16px]" style={{ background: "#faf5ff" }}>
            <div className="text-[18px] font-semibold uppercase tracking-widest mb-[20px]" style={{ color: "#a855f7" }}>What Is Needed</div>
            <ul className="space-y-[16px] text-[22px]" style={{ color: "#475569" }}>
              <li>Continuous daily support</li>
              <li>Promise and commitment tracking</li>
              <li>Care team coordination</li>
              <li>Indefinite — for life</li>
            </ul>
          </div>
        </div>
      </div>
    </Slide>
  );
}

/* ─── SLIDE 4: THE REAL BREAKDOWN ─── */
function Slide04() {
  return (
    <Slide>
      <div className="flex-1 flex flex-col justify-center px-[160px]">
        <SectionLabel>The Real Breakdown</SectionLabel>
        <h2 className="mt-[24px] text-[56px] font-bold leading-tight">
          What actually happens after discharge
        </h2>
        <div className="mt-[50px] flex gap-[32px]">
          {[
            { step: "01", title: "Forgotten promises", desc: "Appointments missed. Commitments broken. Not from apathy — from injured cognition." },
            { step: "02", title: "Eroded trust", desc: "Partners, children, employers stop relying on them. Relationships fracture silently." },
            { step: "03", title: "Caregiver burnout", desc: "Family members become unpaid, untrained cognitive scaffolding — with no tools." },
            { step: "04", title: "Confidence collapse", desc: "The person withdraws. Stops trying. The brain injury wins." },
          ].map((d) => (
            <div key={d.step} className="flex-1">
              <div className="text-[48px] font-bold" style={{ color: "#f97316" }}>{d.step}</div>
              <div className="mt-[12px] text-[24px] font-semibold">{d.title}</div>
              <div className="mt-[12px] text-[18px] leading-relaxed" style={{ color: "#64748b" }}>{d.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  );
}

/* ─── SLIDE 5: WHY TOOLS FAIL ─── */
function Slide05() {
  const rows = [
    { tool: "Apple Reminders", designed: "Neurotypical brains", fails: "Single notification, easily dismissed, no escalation" },
    { tool: "Notion / Todoist", designed: "Productivity workers", fails: "No context, no support network, no accountability" },
    { tool: "CareZone", designed: "Medication tracking", fails: "Narrow scope, no cognitive support" },
    { tool: "Lumosity", designed: "Brain games", fails: "No real-life application, no accountability" },
  ];
  return (
    <Slide>
      <div className="flex-1 flex flex-col justify-center px-[160px]">
        <SectionLabel>Why Existing Tools Fail</SectionLabel>
        <h2 className="mt-[24px] text-[48px] font-bold">
          None of these were built for brains that work differently.
        </h2>
        <div className="mt-[50px]">
          <div className="flex text-[16px] font-semibold uppercase tracking-widest pb-[16px] border-b" style={{ color: "#94a3b8", borderColor: "#e2e8f0" }}>
            <div className="w-[280px]">Tool</div>
            <div className="w-[320px]">Designed For</div>
            <div className="flex-1">Why It Fails</div>
          </div>
          {rows.map((r) => (
            <div key={r.tool} className="flex items-start py-[20px] border-b text-[22px]" style={{ borderColor: "#f1f5f9" }}>
              <div className="w-[280px] font-semibold">{r.tool}</div>
              <div className="w-[320px]" style={{ color: "#64748b" }}>{r.designed}</div>
              <div className="flex-1" style={{ color: "#64748b" }}>{r.fails}</div>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  );
}

/* ─── SLIDE 6: THE INSIGHT ─── */
function Slide06() {
  return (
    <Slide bg="#fafafa">
      <div className="flex-1 flex flex-col items-center justify-center px-[240px] text-center">
        <SectionLabel>The Insight</SectionLabel>
        <h2 className="mt-[40px] text-[64px] font-bold leading-[1.15]">
          Recovery is not a destination.<br />It is a daily practice.
        </h2>
        <div className="mt-[48px] w-[80px] h-[4px] rounded-full" style={{ background: "linear-gradient(90deg, #f97316, #a855f7)" }} />
        <p className="mt-[48px] text-[28px] leading-relaxed max-w-[900px]" style={{ color: "#64748b" }}>
          The missing layer is not another app. It is continuous cognitive support — woven into the fabric of daily life, backed by people who care.
        </p>
      </div>
    </Slide>
  );
}

/* ─── SLIDE 7: THE CATEGORY ─── */
function Slide07() {
  return (
    <Slide>
      <div className="flex-1 flex flex-col justify-center px-[160px]">
        <SectionLabel>New Category</SectionLabel>
        <h2 className="mt-[24px] text-[56px] font-bold">Continuous Cognitive Support</h2>
        <p className="mt-[20px] text-[24px] max-w-[800px]" style={{ color: "#64748b" }}>
          Not brain games. Not reminders. Not clinical software. The infrastructure layer between clinical care and daily living.
        </p>
        <div className="mt-[60px] flex items-center gap-[24px]">
          <div className="flex-1 py-[40px] px-[48px] rounded-[16px] text-center" style={{ background: "#f0f9ff" }}>
            <div className="text-[20px] font-semibold" style={{ color: "#0284c7" }}>Clinical Care</div>
            <div className="text-[16px] mt-[8px]" style={{ color: "#64748b" }}>Structured rehab</div>
            <div className="text-[16px]" style={{ color: "#64748b" }}>6–12 weeks</div>
          </div>
          <div className="w-[200px] h-[4px]" style={{ background: "linear-gradient(90deg, #0284c7, #f97316)" }} />
          <div className="flex-1 py-[40px] px-[48px] rounded-[16px] text-center border-2" style={{ borderColor: "#f97316", background: "#fff7ed" }}>
            <div className="text-[24px] font-bold" style={{ color: "#f97316" }}>MyRhythm</div>
            <div className="text-[16px] mt-[8px]" style={{ color: "#64748b" }}>Continuous support</div>
            <div className="text-[16px]" style={{ color: "#64748b" }}>For life</div>
          </div>
          <div className="w-[200px] h-[4px]" style={{ background: "linear-gradient(90deg, #f97316, #a855f7)" }} />
          <div className="flex-1 py-[40px] px-[48px] rounded-[16px] text-center" style={{ background: "#faf5ff" }}>
            <div className="text-[20px] font-semibold" style={{ color: "#a855f7" }}>Daily Life</div>
            <div className="text-[16px] mt-[8px]" style={{ color: "#64748b" }}>Work, family, goals</div>
            <div className="text-[16px]" style={{ color: "#64748b" }}>Indefinite</div>
          </div>
        </div>
      </div>
    </Slide>
  );
}

/* ─── SLIDE 8: THE SOLUTION ─── */
function Slide08() {
  const pillars = [
    { title: "Memory Bridge", desc: "Record conversations. AI extracts promises, commitments, and next steps automatically.", icon: "🎙" },
    { title: "Progressive Escalation", desc: "Gentle → moderate → urgent reminders. Support Circle activated when needed.", icon: "📈" },
    { title: "Support Circle", desc: "Trusted network of 5 people who step in when the brain needs backup.", icon: "🤝" },
    { title: "Daily Brain Boost", desc: "240+ cognitive exercises building resilience, confidence, and mental agility.", icon: "🧠" },
  ];
  return (
    <Slide>
      <div className="flex-1 flex flex-col justify-center px-[160px]">
        <SectionLabel>The Solution</SectionLabel>
        <h2 className="mt-[24px] text-[56px] font-bold">How MyRhythm Works</h2>
        <div className="mt-[50px] grid grid-cols-2 gap-[32px]">
          {pillars.map((p) => (
            <div key={p.title} className="p-[40px] rounded-[16px]" style={{ background: "#f8fafc" }}>
              <div className="text-[40px]">{p.icon}</div>
              <div className="mt-[16px] text-[28px] font-semibold">{p.title}</div>
              <div className="mt-[12px] text-[20px] leading-relaxed" style={{ color: "#64748b" }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  );
}

/* ─── SLIDE 9: VISION, PURPOSE & GOALS ─── */
function Slide09() {
  return (
    <Slide>
      <div className="flex-1 flex flex-col justify-center px-[160px]">
        <SectionLabel>Differentiator</SectionLabel>
        <h2 className="mt-[24px] text-[56px] font-bold">Start with Why. Break it Down. Stay Accountable.</h2>
        <div className="mt-[50px] space-y-[24px]">
          {[
            { label: "Vision", q: "Where do you want to be?", desc: "Capture life direction and purpose — not just tasks" },
            { label: "Goals", q: "What will get you there?", desc: "AI-assisted breakdown into actionable, time-bound steps" },
            { label: "Accountability", q: "Who keeps you honest?", desc: "Support Circle integration, progress tracking, celebration triggers" },
          ].map((row) => (
            <div key={row.label} className="flex items-start gap-[32px] p-[32px] rounded-[16px]" style={{ background: "#f8fafc" }}>
              <div className="w-[160px] shrink-0">
                <div className="text-[24px] font-bold" style={{ color: "#f97316" }}>{row.label}</div>
                <div className="text-[18px] mt-[4px] italic" style={{ color: "#94a3b8" }}>{row.q}</div>
              </div>
              <div className="text-[22px] leading-relaxed" style={{ color: "#475569" }}>{row.desc}</div>
            </div>
          ))}
        </div>
        <p className="mt-[40px] text-[24px] font-light italic" style={{ color: "#94a3b8" }}>
          Every productivity app starts with a task. MyRhythm starts with a purpose.
        </p>
      </div>
    </Slide>
  );
}

/* ─── SLIDE 10: THE EXPANSION ─── */
function Slide10() {
  const rings = [
    { label: "TBI Survivors", size: 200, color: "#f97316", textColor: "#fff" },
    { label: "Mild Cognitive Impairment", size: 340, color: "#fed7aa", textColor: "#92400e" },
    { label: "Caregivers (53M in US)", size: 480, color: "#faf5ff", textColor: "#7c3aed" },
    { label: "Brain Health & Productivity", size: 620, color: "#f0f9ff", textColor: "#0284c7" },
  ];
  return (
    <Slide>
      <div className="flex-1 flex px-[160px] items-center">
        <div className="w-[700px] shrink-0">
          <SectionLabel>The Expansion</SectionLabel>
          <h2 className="mt-[24px] text-[48px] font-bold leading-tight">
            Starts concentrated.<br />Expands to universal utility.
          </h2>
          <p className="mt-[24px] text-[22px]" style={{ color: "#64748b" }}>
            We begin with TBI survivors — the most underserved, highest-need cohort. Every feature we build for them works for everyone.
          </p>
          <GradientLine />
        </div>
        {/* Concentric circles */}
        <div className="flex-1 flex items-center justify-center relative" style={{ height: 700 }}>
          {rings.slice().reverse().map((r) => (
            <div
              key={r.label}
              className="absolute rounded-full flex items-end justify-center pb-[20px]"
              style={{
                width: r.size,
                height: r.size,
                background: r.color,
                border: r.color === "#f97316" ? "none" : "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <span className="text-[15px] font-medium text-center px-[16px]" style={{ color: r.textColor }}>
                {r.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  );
}

/* ─── SLIDE 11: UNIVERSAL UTILITY ─── */
function Slide11() {
  return (
    <Slide>
      <div className="flex-1 flex flex-col justify-center px-[160px]">
        <SectionLabel>Universal Utility</SectionLabel>
        <h2 className="mt-[24px] text-[56px] font-bold">Built for TBI. Useful for Every Brain.</h2>
        <div className="mt-[50px] flex gap-[40px]">
          <div className="flex-1 p-[40px] rounded-[16px]" style={{ background: "#fff7ed" }}>
            <div className="text-[22px] font-semibold mb-[20px]" style={{ color: "#f97316" }}>For Cognitive Recovery</div>
            <ul className="space-y-[14px] text-[20px]" style={{ color: "#475569" }}>
              <li>Memory Bridge with AI extraction</li>
              <li>Progressive escalation reminders</li>
              <li>Support Circle activation</li>
              <li>Clinical progress tracking</li>
            </ul>
          </div>
          <div className="flex-1 p-[40px] rounded-[16px]" style={{ background: "#f0f9ff" }}>
            <div className="text-[22px] font-semibold mb-[20px]" style={{ color: "#0284c7" }}>For Peak Performance</div>
            <ul className="space-y-[14px] text-[20px]" style={{ color: "#475569" }}>
              <li>Meeting action capture</li>
              <li>Accountability partnerships</li>
              <li>Goal tracking & breakdown</li>
              <li>Cognitive fitness training</li>
            </ul>
          </div>
        </div>
        <div className="mt-[40px] flex flex-wrap gap-[16px]">
          {["Brain injury survivors", "Students", "Professionals", "Aging parents", "Anyone with ADHD", "Post-surgery recovery"].map((u) => (
            <span key={u} className="px-[20px] py-[10px] rounded-full text-[18px]" style={{ background: "#f1f5f9", color: "#475569" }}>{u}</span>
          ))}
        </div>
        <p className="mt-[32px] text-[22px] font-light italic" style={{ color: "#94a3b8" }}>
          The features that help a TBI survivor keep promises are the same features that help a CEO keep commitments.
        </p>
      </div>
    </Slide>
  );
}

/* ─── SLIDE 12: MARKET SIZE ─── */
function Slide12() {
  return (
    <Slide>
      <div className="flex-1 flex flex-col justify-center px-[160px]">
        <SectionLabel>Market Opportunity</SectionLabel>
        <h2 className="mt-[24px] text-[56px] font-bold">TAM · SAM · SOM</h2>
        <div className="mt-[50px]">
          <div className="flex text-[16px] font-semibold uppercase tracking-widest pb-[16px] border-b" style={{ color: "#94a3b8", borderColor: "#e2e8f0" }}>
            <div className="w-[160px]">Metric</div>
            <div className="flex-1">Segment</div>
            <div className="w-[200px] text-right">Size</div>
          </div>
          {[
            { metric: "TAM", segment: "Global cognitive wellness & brain injury market", size: "$4.2B" },
            { metric: "SAM", segment: "English-speaking TBI + MCI + caregivers", size: "$1.1B" },
            { metric: "SOM", segment: "UK + US direct-to-consumer Year 1", size: "$28M" },
          ].map((r) => (
            <div key={r.metric} className="flex items-center py-[24px] border-b text-[24px]" style={{ borderColor: "#f1f5f9" }}>
              <div className="w-[160px] font-bold" style={{ color: "#f97316" }}>{r.metric}</div>
              <div className="flex-1" style={{ color: "#475569" }}>{r.segment}</div>
              <div className="w-[200px] text-right text-[32px] font-bold">{r.size}</div>
            </div>
          ))}
        </div>
        <p className="mt-[40px] text-[22px]" style={{ color: "#64748b" }}>
          8.1% CAGR · Aging population · Growing awareness · Projected growth through 2026 and beyond.
        </p>
      </div>
    </Slide>
  );
}

/* ─── SLIDE 13: COMPETITIVE ADVANTAGE ─── */
function Slide13() {
  const features = ["Progressive Escalation", "Support Circle", "Memory Bridge (AI)", "Goal → Purpose Alignment", "Clinical + Consumer"];
  const competitors = [
    { name: "MyRhythm", checks: [true, true, true, true, true] },
    { name: "Lumosity", checks: [false, false, false, false, false] },
    { name: "Todoist", checks: [false, false, false, false, false] },
    { name: "CareZone", checks: [false, true, false, false, false] },
    { name: "Headspace", checks: [false, false, false, false, false] },
  ];
  return (
    <Slide>
      <div className="flex-1 flex flex-col justify-center px-[160px]">
        <SectionLabel>Competitive Advantage</SectionLabel>
        <h2 className="mt-[24px] text-[48px] font-bold">Why MyRhythm Wins</h2>
        <div className="mt-[50px]">
          {/* Header */}
          <div className="flex items-end pb-[16px] border-b" style={{ borderColor: "#e2e8f0" }}>
            <div className="w-[300px]" />
            {competitors.map((c) => (
              <div key={c.name} className="flex-1 text-center text-[18px] font-semibold" style={{ color: c.name === "MyRhythm" ? "#f97316" : "#94a3b8" }}>
                {c.name}
              </div>
            ))}
          </div>
          {/* Rows */}
          {features.map((f, fi) => (
            <div key={f} className="flex items-center py-[18px] border-b" style={{ borderColor: "#f1f5f9" }}>
              <div className="w-[300px] text-[20px]" style={{ color: "#475569" }}>{f}</div>
              {competitors.map((c) => (
                <div key={c.name} className="flex-1 text-center text-[24px]">
                  {c.checks[fi] ? (
                    <span style={{ color: "#16a34a" }}>✓</span>
                  ) : (
                    <span style={{ color: "#d1d5db" }}>—</span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-[40px] p-[24px] rounded-[12px]" style={{ background: "#f8fafc" }}>
          <span className="text-[20px] font-semibold">Moat: </span>
          <span className="text-[20px]" style={{ color: "#64748b" }}>
            Lived experience · Community trust · Clinical validation pathway · Network effects from Support Circle
          </span>
        </div>
      </div>
    </Slide>
  );
}

/* ─── SLIDE 14: DISTRIBUTION ADVANTAGE ─── */
function Slide14() {
  return (
    <Slide>
      <div className="flex-1 flex flex-col justify-center px-[160px]">
        <SectionLabel>Distribution</SectionLabel>
        <h2 className="mt-[24px] text-[56px] font-bold">Built-In Growth Loops</h2>
        <div className="mt-[50px] flex gap-[32px]">
          {[
            { title: "Community-Led", desc: "TBI survivor networks, Headway UK, Brain Injury Association. Trust-based adoption where clinical referrals fail.", color: "#f97316" },
            { title: "Clinical Partnerships", desc: "Rehabilitation centres prescribing MyRhythm as post-discharge support. Embedded into the care pathway.", color: "#a855f7" },
            { title: "Support Circle Virality", desc: "Every user invites up to 5 people. Each Support Circle member sees the product working — and has their own needs.", color: "#0284c7" },
          ].map((ch) => (
            <div key={ch.title} className="flex-1 p-[40px] rounded-[16px]" style={{ background: "#f8fafc" }}>
              <div className="w-[48px] h-[4px] rounded-full mb-[20px]" style={{ background: ch.color }} />
              <div className="text-[24px] font-semibold">{ch.title}</div>
              <div className="mt-[16px] text-[20px] leading-relaxed" style={{ color: "#64748b" }}>{ch.desc}</div>
            </div>
          ))}
        </div>
        <p className="mt-[40px] text-[24px] font-light italic" style={{ color: "#94a3b8" }}>
          Every user who adds a Support Circle member is a distribution event.
        </p>
      </div>
    </Slide>
  );
}

/* ─── SLIDE 15: EARLY EVIDENCE ─── */
function Slide15() {
  return (
    <Slide>
      <div className="flex-1 flex flex-col justify-center px-[160px]">
        <SectionLabel>Early Evidence</SectionLabel>
        <h2 className="mt-[24px] text-[56px] font-bold">What We Have Today</h2>
        <div className="mt-[50px] grid grid-cols-2 gap-[24px]">
          {[
            { title: "Working Product", desc: "Live, functional MVP with Memory Bridge, Support Circle, Brain Boost, Calendar, and Goal tracking." },
            { title: "Authentic Problem-Market Fit", desc: "Built by a TBI survivor. Not a Silicon Valley solution looking for a problem." },
            { title: "Clinical Conversations", desc: "Partnership discussions with Headway UK and rehabilitation centres. Interest validated." },
            { title: "Full Feature Set", desc: "Progressive escalation, AI action extraction, cognitive exercises (240+), and gratitude journaling." },
          ].map((e) => (
            <div key={e.title} className="p-[32px] rounded-[16px] border" style={{ borderColor: "#e2e8f0" }}>
              <div className="text-[24px] font-semibold">{e.title}</div>
              <div className="mt-[12px] text-[20px] leading-relaxed" style={{ color: "#64748b" }}>{e.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  );
}

/* ─── SLIDE 16: BUSINESS MODEL ─── */
function Slide16() {
  return (
    <Slide>
      <div className="flex-1 flex flex-col justify-center px-[160px]">
        <SectionLabel>Business Model</SectionLabel>
        <h2 className="mt-[24px] text-[48px] font-bold">Path to £500K by December 2026</h2>
        <div className="mt-[50px] flex gap-[40px]">
          {/* B2C */}
          <div className="flex-1">
            <div className="text-[20px] font-semibold uppercase tracking-widest mb-[24px]" style={{ color: "#f97316" }}>B2C — Now</div>
            <div className="space-y-[20px]">
              {[
                { plan: "Founding Member", price: "£10/month", note: "First 500 users · Locked forever" },
                { plan: "Standard", price: "£15/month", note: "Post-founding pricing" },
                { plan: "Annual", price: "£150/year", note: "Save £30" },
              ].map((p) => (
                <div key={p.plan} className="p-[24px] rounded-[12px]" style={{ background: "#f8fafc" }}>
                  <div className="flex justify-between items-baseline">
                    <span className="text-[22px] font-semibold">{p.plan}</span>
                    <span className="text-[24px] font-bold" style={{ color: "#f97316" }}>{p.price}</span>
                  </div>
                  <div className="text-[16px] mt-[4px]" style={{ color: "#94a3b8" }}>{p.note}</div>
                </div>
              ))}
            </div>
          </div>
          {/* B2B */}
          <div className="flex-1">
            <div className="text-[20px] font-semibold uppercase tracking-widest mb-[24px]" style={{ color: "#a855f7" }}>B2B — 12-Month Horizon</div>
            <div className="space-y-[20px]">
              {[
                { plan: "Clinical License", price: "£50/user/month", note: "Per-patient pricing for rehab centres" },
                { plan: "Enterprise / NHS", price: "Custom", note: "Volume licensing and integration" },
                { plan: "Insurance Pathway", price: "TBD", note: "Reimbursement code exploration" },
              ].map((p) => (
                <div key={p.plan} className="p-[24px] rounded-[12px]" style={{ background: "#faf5ff" }}>
                  <div className="flex justify-between items-baseline">
                    <span className="text-[22px] font-semibold">{p.plan}</span>
                    <span className="text-[24px] font-bold" style={{ color: "#a855f7" }}>{p.price}</span>
                  </div>
                  <div className="text-[16px] mt-[4px]" style={{ color: "#94a3b8" }}>{p.note}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-[40px] flex gap-[48px]">
          {[
            { label: "LTV", value: "£150+" },
            { label: "CAC", value: "£25" },
            { label: "Gross Margin", value: "85%+" },
            { label: "Churn", value: "<5% monthly" },
          ].map((m) => (
            <div key={m.label}>
              <div className="text-[16px] uppercase tracking-widest" style={{ color: "#94a3b8" }}>{m.label}</div>
              <div className="text-[28px] font-bold mt-[4px]">{m.value}</div>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  );
}

/* ─── SLIDE 17: THE FOUNDER ─── */
function Slide17() {
  return (
    <Slide bg="#fafafa">
      <div className="flex-1 flex flex-col items-center justify-center px-[240px] text-center">
        <SectionLabel>The Founder</SectionLabel>
        <h2 className="mt-[32px] text-[56px] font-bold leading-tight">
          Built by a TBI survivor who<br />needed this tool to exist.
        </h2>
        <div className="mt-[48px] w-[80px] h-[4px] rounded-full" style={{ background: "linear-gradient(90deg, #f97316, #a855f7)" }} />
        <p className="mt-[48px] text-[26px] leading-relaxed max-w-[900px]" style={{ color: "#475569" }}>
          Not a Silicon Valley solution looking for a problem. A real person who experienced the system gap firsthand — the forgotten appointments, the eroded trust, the cognitive fatigue — and decided to build what should have existed.
        </p>
        <p className="mt-[32px] text-[22px]" style={{ color: "#94a3b8" }}>
          Authentic founder-market fit · Clinical advisory board · Technical execution
        </p>
      </div>
    </Slide>
  );
}

/* ─── SLIDE 18: THE ASK ─── */
function Slide18() {
  return (
    <Slide>
      <div className="flex-1 flex flex-col justify-center px-[160px]">
        <SectionLabel>The Ask</SectionLabel>
        <h2 className="mt-[24px] text-[56px] font-bold">Investment Opportunity</h2>
        <div className="mt-[50px] flex gap-[40px]">
          {/* Use of funds */}
          <div className="flex-1">
            <div className="text-[20px] font-semibold mb-[24px]" style={{ color: "#475569" }}>Use of Funds</div>
            {[
              { label: "Technology Development", pct: 40, color: "#f97316" },
              { label: "Sales & Marketing", pct: 35, color: "#a855f7" },
              { label: "Operations & Team", pct: 20, color: "#0284c7" },
              { label: "Reserve & Contingency", pct: 5, color: "#94a3b8" },
            ].map((f) => (
              <div key={f.label} className="mb-[16px]">
                <div className="flex justify-between text-[18px] mb-[6px]">
                  <span>{f.label}</span>
                  <span className="font-semibold">{f.pct}%</span>
                </div>
                <div className="w-full h-[8px] rounded-full" style={{ background: "#f1f5f9" }}>
                  <div className="h-full rounded-full" style={{ width: `${f.pct}%`, background: f.color }} />
                </div>
              </div>
            ))}
          </div>
          {/* Milestones */}
          <div className="flex-1">
            <div className="text-[20px] font-semibold mb-[24px]" style={{ color: "#475569" }}>2026 Milestones</div>
            {[
              { q: "Q1", milestone: "500 founding members secured", revenue: "£75K" },
              { q: "Q2", milestone: "Clinical pilot partnerships live", revenue: "£175K" },
              { q: "Q3", milestone: "2,500 subscribers, AI features", revenue: "£325K" },
              { q: "Q4", milestone: "Market leadership, Series B ready", revenue: "£500K" },
            ].map((m) => (
              <div key={m.q} className="flex items-start gap-[16px] mb-[20px]">
                <div className="w-[48px] h-[48px] rounded-full flex items-center justify-center shrink-0 text-[18px] font-bold" style={{ background: "#fff7ed", color: "#f97316" }}>
                  {m.q}
                </div>
                <div>
                  <div className="text-[20px] font-semibold">{m.milestone}</div>
                  <div className="text-[18px]" style={{ color: "#64748b" }}>Cumulative revenue: {m.revenue}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-[48px] flex items-center justify-between p-[32px] rounded-[16px]" style={{ background: "#f8fafc" }}>
          <div>
            <div className="text-[24px] font-bold">MyRhythm: Continuous Cognitive Support</div>
            <div className="text-[18px] mt-[4px]" style={{ color: "#64748b" }}>Every promise kept builds trust. Every small win compounds.</div>
          </div>
          <div className="text-[18px]" style={{ color: "#94a3b8" }}>
            investors@myrhythm.com · myrhythm.app
          </div>
        </div>
      </div>
    </Slide>
  );
}

/* ─── SLIDE RENDERER ─── */
const slides = [Slide01, Slide02, Slide03, Slide04, Slide05, Slide06, Slide07, Slide08, Slide09, Slide10, Slide11, Slide12, Slide13, Slide14, Slide15, Slide16, Slide17, Slide18];

export function InvestorSlides({ currentSlide }: { currentSlide: number }) {
  const SlideComponent = slides[currentSlide] || Slide01;
  return <SlideComponent />;
}
