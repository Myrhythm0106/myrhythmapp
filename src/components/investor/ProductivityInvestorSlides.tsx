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

/* ─── SLIDE 1: TITLE — Deloitte/Accenture aesthetic, CCM front & centre ─── */
function Slide01() {
  return (
    <Slide bg="#0a0a1a">
      {/* Top accent line */}
      <div className="w-full h-[4px]" style={{ background: "linear-gradient(90deg, #f97316, #a855f7)" }} />
      <div className="flex-1 flex flex-col items-center justify-center px-[200px] text-center">
        <h1
          className="text-[80px] font-bold tracking-[0.04em] leading-none"
          style={{ color: "#ffffff" }}
        >
          MyRhythm
        </h1>
        <p className="mt-[28px] text-[36px] font-medium tracking-wide" style={{ color: "#028090" }}>
          Collaborative Cognitive Management
        </p>
        <p className="mt-[24px] text-[24px] font-light leading-relaxed max-w-[900px]" style={{ color: "#cbd5e1" }}>
          Built for the hardest cognitive (memory) challenges. Designed for cognitive resilience. Available to everyone.
        </p>
        <div className="mt-[48px] w-[600px] h-[1px]" style={{ background: "rgba(255,255,255,0.1)" }} />
        {/* Bottom metadata bar */}
        <div className="mt-[48px] w-full flex items-center justify-between px-[40px]">
          <span className="text-[16px]" style={{ color: "rgba(255,255,255,0.4)" }}>
            Investor Presentation · Pre-Seed Round · Confidential
          </span>
          <span className="text-[16px]" style={{ color: "rgba(255,255,255,0.4)" }}>
            Prepared by Annabel Aaron, Founder &amp; CEO
          </span>
          <span className="text-[16px]" style={{ color: "rgba(255,255,255,0.4)" }}>
            March 2026
          </span>
        </div>
      </div>
      {/* Confidential watermark */}
      <div className="absolute bottom-[20px] right-[32px] text-[11px] tracking-[0.3em] uppercase" style={{ color: "rgba(255,255,255,0.12)" }}>
        CONFIDENTIAL
      </div>
    </Slide>
  );
}

/* ─── SLIDE 2: THE PRODUCTIVITY PROBLEM ─── */
function Slide02() {
  return (
    <Slide>
      <div className="flex-1 flex flex-col justify-center px-[160px]">
        <SectionLabel>The Productivity Problem</SectionLabel>
        <h2 className="mt-[24px] text-[64px] font-bold leading-[1.1]">
          Knowledge workers lose 2.1 hours<br />every day to cognitive friction.
        </h2>
        <div className="mt-[60px] flex gap-[80px]">
          {[
            { stat: "2.1hrs", label: "Lost daily to interruptions, context-switching, and re-orientation" },
            { stat: "23 min", label: "Average time to refocus after a single interruption" },
            { stat: "71%", label: "of professionals report forgetting commitments made in meetings" },
          ].map((d) => (
            <div key={d.label}>
              <div className="text-[56px] font-bold" style={{ color: "#f97316" }}>{d.stat}</div>
              <div className="text-[20px] mt-[8px] max-w-[320px]" style={{ color: "#64748b" }}>{d.label}</div>
            </div>
          ))}
        </div>
        <p className="mt-[60px] text-[28px] font-light italic" style={{ color: "#94a3b8" }}>
          The cost is not time. It is reliability.
        </p>
      </div>
    </Slide>
  );
}

/* ─── SLIDE 3: THE HIDDEN COST ─── */
function Slide03() {
  return (
    <Slide>
      <div className="flex-1 flex flex-col justify-center px-[160px]">
        <SectionLabel>The Hidden Cost</SectionLabel>
        <h2 className="mt-[24px] text-[56px] font-bold leading-tight">
          Broken commitments erode trust,<br />teams, and careers.
        </h2>
        <div className="mt-[50px] flex gap-[32px]">
          {[
            { step: "01", title: "Missed follow-ups", desc: "The action from Monday's meeting never happens. Nobody chases it. Momentum dies." },
            { step: "02", title: "Lost credibility", desc: "Colleagues stop relying on you. Reputation erodes silently, meeting by meeting." },
            { step: "03", title: "Relationship erosion", desc: "Partners, clients, and teams lose confidence. Trust compounds — and so does its absence." },
            { step: "04", title: "Career stagnation", desc: "Promotion decisions are trust decisions. Unreliable execution is invisible self-sabotage." },
            { step: "05", title: "Confidence collapses", desc: "Repeated memory failures erode self-trust. You stop committing because you've stopped believing you'll follow through." },
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

/* ─── SLIDE 4: WHY IT HAPPENS ─── */
function Slide04() {
  return (
    <Slide bg="#fafafa">
      <div className="flex-1 flex flex-col items-center justify-center px-[240px] text-center">
        <SectionLabel>Why It Happens</SectionLabel>
        <h2 className="mt-[40px] text-[64px] font-bold leading-[1.15]">
          The gap between intending and doing<br />has no infrastructure.
        </h2>
        <div className="mt-[48px] w-[80px] h-[4px] rounded-full" style={{ background: "linear-gradient(90deg, #f97316, #a855f7)" }} />
        <p className="mt-[48px] text-[28px] leading-relaxed max-w-[900px]" style={{ color: "#64748b" }}>
          We have tools for planning. Tools for communication. Tools for storage. But nothing exists between the moment you decide to do something and the moment you reliably do it.
        </p>
      </div>
    </Slide>
  );
}

/* ─── SLIDE 5: THE SCALE ─── */
function Slide05() {
  return (
    <Slide>
      <div className="flex-1 flex flex-col justify-center px-[160px]">
        <SectionLabel>The Scale</SectionLabel>
        <h2 className="mt-[24px] text-[56px] font-bold leading-tight">
          A universal problem disguised<br />as individual failure.
        </h2>
        <div className="mt-[50px] flex flex-wrap gap-[20px]">
          {[
            { pop: "Knowledge Workers", size: "1B+ globally", note: "Context-switching, meeting overload" },
            { pop: "Students", size: "200M+ globally", note: "Executive function still developing" },
            { pop: "Aging Adults", size: "55M+ (US alone)", note: "Mild cognitive decline, forgetfulness" },
            { pop: "ADHD", size: "366M globally", note: "Intention-action gap is defining symptom" },
            { pop: "Caregivers", size: "53M in US", note: "Cognitive overload from dual responsibilities" },
            { pop: "Acquired Brain Injury (ABI & TBI)", size: "80M+ annually", note: "Clinical-grade cognitive support" },
          ].map((p) => (
            <div key={p.pop} className="w-[calc(33.33%-14px)] p-[28px] rounded-[16px]" style={{ background: "#f8fafc" }}>
              <div className="text-[22px] font-semibold">{p.pop}</div>
              <div className="text-[20px] font-bold mt-[8px]" style={{ color: "#f97316" }}>{p.size}</div>
              <div className="text-[16px] mt-[6px]" style={{ color: "#94a3b8" }}>{p.note}</div>
            </div>
          ))}
        </div>
        <p className="mt-[40px] text-[24px] font-light italic" style={{ color: "#94a3b8" }}>
          One functional problem. Many conditions. No existing solution.
        </p>
      </div>
    </Slide>
  );
}

/* ─── SLIDE 6: WHY TOOLS FAIL ─── */
function Slide06() {
  const rows = [
    { tool: "Notion / Todoist", designed: "Organised, self-directed workers", fails: "Assumes you remember to check it. No re-engagement after interruption." },
    { tool: "Apple Reminders", designed: "Simple notification use", fails: "Single ping, easily dismissed. No escalation, no accountability." },
    { tool: "Calendly / Cal.com", designed: "Scheduling coordination", fails: "Schedules the meeting, not the follow-through." },
    { tool: "Headspace / Calm", designed: "Meditation & relaxation", fails: "Reduces stress, doesn't improve execution reliability." },
  ];
  return (
    <Slide>
      <div className="flex-1 flex flex-col justify-center px-[160px]">
        <SectionLabel>Why Tools Fail</SectionLabel>
        <h2 className="mt-[24px] text-[48px] font-bold">
          Productivity tools assume the brain they are trying to help.
        </h2>
        <div className="mt-[50px]">
          <div className="flex text-[16px] font-semibold uppercase tracking-widest pb-[16px] border-b" style={{ color: "#94a3b8", borderColor: "#e2e8f0" }}>
            <div className="w-[280px]">Tool</div>
            <div className="w-[340px]">Designed For</div>
            <div className="flex-1">Why It Fails</div>
          </div>
          {rows.map((r) => (
            <div key={r.tool} className="flex items-start py-[20px] border-b text-[22px]" style={{ borderColor: "#f1f5f9" }}>
              <div className="w-[280px] font-semibold">{r.tool}</div>
              <div className="w-[340px]" style={{ color: "#64748b" }}>{r.designed}</div>
              <div className="flex-1" style={{ color: "#64748b" }}>{r.fails}</div>
            </div>
          ))}
        </div>
        <p className="mt-[40px] text-[22px] font-light italic" style={{ color: "#94a3b8" }}>
          Every tool on this list requires reliable cognition to use reliably.
        </p>
      </div>
    </Slide>
  );
}

/* ─── SLIDE 7: THE INSIGHT ─── */
function Slide07() {
  return (
    <Slide bg="#fafafa">
      <div className="flex-1 flex flex-col items-center justify-center px-[240px] text-center">
        <SectionLabel>The Insight</SectionLabel>
        <h2 className="mt-[40px] text-[64px] font-bold leading-[1.15]">
          The problem is not organisation.<br />It is cognitive continuity.
        </h2>
        <div className="mt-[48px] w-[80px] h-[4px] rounded-full" style={{ background: "linear-gradient(90deg, #f97316, #a855f7)" }} />
        <p className="mt-[48px] text-[28px] leading-relaxed max-w-[900px]" style={{ color: "#64748b" }}>
          People do not fail because they lack lists. They fail because interruptions break their thread of intention — and nothing exists to restore it.
        </p>
        <p className="mt-[32px] text-[26px] leading-relaxed max-w-[900px] font-medium" style={{ color: "#475569" }}>
          When people feel reliable, confidence returns. When confidence returns, productivity follows. The lever is not efficiency — it is self-trust.
        </p>
      </div>
    </Slide>
  );
}

/* ─── SLIDE 8: THE CATEGORY ─── */
function Slide08() {
  return (
    <Slide>
      <div className="flex-1 flex flex-col justify-center px-[160px]">
        <SectionLabel>The Methodology</SectionLabel>
        <h2 className="mt-[24px] text-[56px] font-bold">Collaborative Cognitive Management</h2>
        <p className="mt-[20px] text-[24px] max-w-[900px]" style={{ color: "#64748b" }}>
          The LEAP platform is powered by CCM — three pillars that bridge intention and reliable execution.
        </p>
        <div className="mt-[28px] flex gap-[20px]">
          {[
            { pillar: "Collaborative", desc: "Support Circles, caregiver dashboards, shared accountability", color: "#a855f7" },
            { pillar: "Cognitive", desc: "Memory Bridge — captures what your brain can't hold, Rhythmic Intelligence, energy-aware scheduling", color: "#0284c7" },
            { pillar: "Management", desc: "Task chunking, smart scheduling, celebration streaks", color: "#f97316" },
          ].map((p) => (
            <div key={p.pillar} className="flex-1 p-[20px] rounded-[12px]" style={{ background: "#f8fafc" }}>
              <div className="text-[20px] font-bold" style={{ color: p.color }}>{p.pillar}</div>
              <div className="text-[16px] mt-[6px]" style={{ color: "#64748b" }}>{p.desc}</div>
            </div>
          ))}
        </div>
        <div className="mt-[60px] flex items-center gap-[24px]">
          <div className="flex-1 py-[40px] px-[48px] rounded-[16px] text-center" style={{ background: "#f0f9ff" }}>
            <div className="text-[20px] font-semibold" style={{ color: "#0284c7" }}>Intention</div>
            <div className="text-[16px] mt-[8px]" style={{ color: "#64748b" }}>You decide to act</div>
            <div className="text-[16px]" style={{ color: "#64748b" }}>Meetings, ideas, commitments</div>
          </div>
          <div className="w-[200px] h-[4px]" style={{ background: "linear-gradient(90deg, #0284c7, #f97316)" }} />
          <div className="flex-1 py-[40px] px-[48px] rounded-[16px] text-center border-2" style={{ borderColor: "#f97316", background: "#fff7ed" }}>
            <div className="text-[24px] font-bold" style={{ color: "#f97316" }}>MyRhythm</div>
            <div className="text-[16px] mt-[8px]" style={{ color: "#64748b" }}>Cognitive continuity layer</div>
            <div className="text-[16px]" style={{ color: "#64748b" }}>Capture → Commit → Calibrate → Celebrate</div>
          </div>
          <div className="w-[200px] h-[4px]" style={{ background: "linear-gradient(90deg, #f97316, #a855f7)" }} />
          <div className="flex-1 py-[40px] px-[48px] rounded-[16px] text-center" style={{ background: "#faf5ff" }}>
            <div className="text-[20px] font-semibold" style={{ color: "#a855f7" }}>Reliable Execution</div>
            <div className="text-[16px] mt-[8px]" style={{ color: "#64748b" }}>Promises kept, trust built</div>
            <div className="text-[16px]" style={{ color: "#64748b" }}>Compounding confidence</div>
          </div>
        </div>
      </div>
    </Slide>
  );
}

/* ─── SLIDE 9: THE SOLUTION ─── */
function Slide09() {
  const steps = [
    { title: "Capture", desc: "Voice-record any conversation. AI extracts every commitment, promise, and next step — so your brain doesn't have to hold them.", icon: "🎙" },
    { title: "Commit", desc: "Review, confirm, and schedule extracted actions. Assign accountability. Make intention concrete.", icon: "✅" },
    { title: "Calibrate", desc: "Progressive re-engagement when you drift. Gentle → moderate → urgent. Support Circle activated when needed.", icon: "🔄" },
    { title: "Celebrate", desc: "Every completion logged. Streaks tracked. Confidence compounds. The system proves you can be relied upon.", icon: "🏆" },
  ];
  return (
    <Slide>
      <div className="flex-1 flex flex-col justify-center px-[160px]">
        <SectionLabel>The Solution</SectionLabel>
        <h2 className="mt-[24px] text-[56px] font-bold">Capture → Commit → Calibrate → Celebrate</h2>
        <p className="mt-[16px] text-[24px]" style={{ color: "#64748b" }}>
          The CCM engine that powers every LEAP experience.
        </p>
        <div className="mt-[50px] grid grid-cols-4 gap-[28px]">
          {steps.map((s, i) => (
            <div key={s.title} className="p-[32px] rounded-[16px] relative" style={{ background: "#f8fafc" }}>
              <div className="text-[40px]">{s.icon}</div>
              <div className="mt-[16px] text-[28px] font-semibold">{s.title}</div>
              <div className="mt-[12px] text-[18px] leading-relaxed" style={{ color: "#64748b" }}>{s.desc}</div>
              {i < 3 && (
                <div className="absolute top-[50%] right-[-18px] text-[24px] font-bold" style={{ color: "#f97316" }}>→</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Slide>
  );
}

/* ─── SLIDE 10: HOW IT WORKS ─── */
function Slide10() {
  const loop = [
    { time: "Morning", action: "Set intention", detail: "Review today's commitments. Confirm priorities. Brain knows what matters." },
    { time: "Mid-day", action: "Interruption hits", detail: "Meeting runs over. Email derails focus. Context switches pile up." },
    { time: "Afternoon", action: "Re-engagement", detail: "MyRhythm detects drift. Progressive nudge restores the thread. You pick up where you left off." },
    { time: "Evening", action: "Completion", detail: "Actions marked done. Wins celebrated. Tomorrow's intentions seeded." },
    { time: "Over time", action: "Reliability becomes identity", detail: "You keep promises. Others notice. Confidence returns. Productivity follows naturally — not from pressure, but from self-trust." },
  ];
  return (
    <Slide>
      <div className="flex-1 flex flex-col justify-center px-[160px]">
        <SectionLabel>How It Works</SectionLabel>
        <h2 className="mt-[24px] text-[56px] font-bold">A Closed Performance Loop Across the Day</h2>
        <div className="mt-[50px] flex items-start gap-[16px]">
          {loop.map((l, i) => (
            <div key={l.time} className="flex-1 flex flex-col items-center text-center">
              <div className="w-[64px] h-[64px] rounded-full flex items-center justify-center text-[20px] font-bold" style={{ background: i === 2 ? "#f97316" : "#f8fafc", color: i === 2 ? "#fff" : "#475569" }}>
                {i + 1}
              </div>
              <div className="mt-[16px] text-[18px] font-bold" style={{ color: "#f97316" }}>{l.time}</div>
              <div className="mt-[8px] text-[20px] font-semibold">{l.action}</div>
              <div className="mt-[8px] text-[16px] leading-relaxed px-[8px]" style={{ color: "#64748b" }}>{l.detail}</div>
              {i < loop.length - 1 && (
                <div className="absolute" />
              )}
            </div>
          ))}
        </div>
        <div className="mt-[40px] flex justify-center">
          <div className="px-[32px] py-[12px] rounded-full text-[18px] font-medium" style={{ background: "#fff7ed", color: "#92400e" }}>
            Morning → Interruption → Re-engagement → Completion → Confidence
          </div>
        </div>
      </div>
    </Slide>
  );
}

/* ─── SLIDE 11: THE CLINICAL MOAT ─── */
function Slide11() {
  return (
    <Slide bg="#fafafa">
      <div className="flex-1 flex flex-col items-center justify-center px-[200px] text-center">
        <SectionLabel>The Clinical Moat</SectionLabel>
        <h2 className="mt-[32px] text-[64px] font-bold leading-[1.15]">
          Validated in the hardest<br />cognitive environments.
        </h2>
        <div className="mt-[48px] w-[80px] h-[4px] rounded-full" style={{ background: "linear-gradient(90deg, #f97316, #a855f7)" }} />
        <p className="mt-[40px] text-[32px] leading-relaxed max-w-[1000px]" style={{ color: "#475569" }}>
          We built MyRhythm to work for ABI & TBI survivors — people whose cognition fluctuates hourly, whose memory fails under load, who lose the thread after every interruption.
        </p>
        <p className="mt-[32px] text-[28px] font-semibold" style={{ color: "#f97316" }}>
          Built from lived experience. If it works there, it works everywhere.
        </p>
        <p className="mt-[16px] text-[20px] max-w-[800px]" style={{ color: "#94a3b8" }}>
          Brain injury recovery is our foundation — the lived experience that shapes every feature in the LEAP platform.
        </p>
        <div className="mt-[48px] flex gap-[48px]">
          {[
            { label: "Progressive escalation", desc: "Built for brains that dismiss single pings" },
            { label: "Support Circle", desc: "Built for people who need human backup" },
            { label: "AI action extraction", desc: "Built for minds that can't hold meeting details" },
          ].map((f) => (
            <div key={f.label} className="text-center max-w-[300px]">
              <div className="text-[20px] font-semibold">{f.label}</div>
              <div className="text-[16px] mt-[6px]" style={{ color: "#94a3b8" }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  );
}

/* ─── SLIDE 12: THE EXPANSION ─── */
function Slide12() {
  const rings = [
    { label: "ABI & TBI Survivors", size: 200, color: "#a855f7", textColor: "#fff" },
    { label: "Mild Cognitive Impairment", size: 340, color: "#faf5ff", textColor: "#7c3aed" },
    { label: "Caregivers (53M in US)", size: 480, color: "#fff7ed", textColor: "#92400e" },
    { label: "Knowledge Workers & Professionals", size: 640, color: "#f0f9ff", textColor: "#0284c7" },
  ];
  return (
    <Slide>
      <div className="flex-1 flex px-[160px] items-center">
        <div className="w-[700px] shrink-0">
          <SectionLabel>The Expansion</SectionLabel>
          <h2 className="mt-[24px] text-[48px] font-bold leading-tight">
            Designed for ABI/TBI.<br />Available to everyone.
          </h2>
          <p className="mt-[24px] text-[22px]" style={{ color: "#64748b" }}>
            ABI &amp; TBI survivors are our north star — every feature is built for this community. Everyone else benefits from that rigour.
          </p>
          <div className="mt-[32px]">
            <GradientLine />
          </div>
          <div className="mt-[28px] space-y-[14px]">
            {[
              { phase: "Phase 1 (Launch)", desc: "Available to everyone — professionals, students, productivity seekers. Immediate revenue, no regulatory friction.", color: "#0284c7" },
              { phase: "Phase 2 (Months 6–12)", desc: "Clinical partnerships, pilot programmes with rehab centres.", color: "#f97316" },
              { phase: "Phase 3 (Year 2+)", desc: "Full ABI/TBI clinical focus — NHS, insurance, institutional licensing.", color: "#a855f7" },
            ].map((p) => (
              <div key={p.phase} className="flex items-start gap-[12px]">
                <div className="w-[10px] h-[10px] rounded-full mt-[8px] shrink-0" style={{ background: p.color }} />
                <div>
                  <span className="text-[18px] font-semibold" style={{ color: p.color }}>{p.phase}</span>
                  <span className="text-[17px] ml-[8px]" style={{ color: "#475569" }}>{p.desc}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-[24px] text-[18px] italic" style={{ color: "#94a3b8" }}>
            Revenue starts broad, then deepens into clinical.
          </p>
        </div>
        {/* Concentric circles — ABI at centre */}
        <div className="flex-1 flex items-center justify-center relative" style={{ height: 700 }}>
          {rings.slice().reverse().map((r) => (
            <div
              key={r.label}
              className="absolute rounded-full flex items-end justify-center pb-[20px]"
              style={{
                width: r.size,
                height: r.size,
                background: r.color,
                border: r.color === "#a855f7" ? "none" : "1px solid rgba(0,0,0,0.06)",
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

/* ─── SLIDE 13: MARKET SIZE ─── */
function Slide13() {
  return (
    <Slide>
      <div className="flex-1 flex flex-col justify-center px-[120px]">
        <SectionLabel>Market Opportunity</SectionLabel>
        <h2 className="mt-[20px] text-[44px] font-bold">The Combined Opportunity</h2>
        <p className="mt-[8px] text-[22px]" style={{ color: "#64748b" }}>
          $22B productivity + wellness TAM — with clinical ABI + TBI as our high-conviction beachhead
        </p>

        {/* Two-column ABI vs TBI breakdown */}
        <div className="mt-[32px] grid grid-cols-[180px_1fr_1fr] gap-0 text-[18px]">
          {/* Header row */}
          <div className="py-[12px] border-b-2" style={{ borderColor: "#e2e8f0" }} />
          <div className="py-[12px] border-b-2 text-center font-bold text-[20px]" style={{ borderColor: "#e2e8f0", color: "#0284c7" }}>
            ABI (Non-Traumatic)
          </div>
          <div className="py-[12px] border-b-2 text-center font-bold text-[20px]" style={{ borderColor: "#e2e8f0", color: "#f97316" }}>
            TBI (Traumatic)
          </div>

          {/* Annual cases */}
          <div className="py-[14px] border-b font-semibold" style={{ borderColor: "#f1f5f9", color: "#334155" }}>Annual Cases</div>
          <div className="py-[14px] border-b text-center" style={{ borderColor: "#f1f5f9", color: "#475569" }}>12.2M strokes + 2M+ other (tumour, anoxia, infection)</div>
          <div className="py-[14px] border-b text-center" style={{ borderColor: "#f1f5f9", color: "#475569" }}>69M globally</div>

          {/* Key populations */}
          <div className="py-[14px] border-b font-semibold" style={{ borderColor: "#f1f5f9", color: "#334155" }}>Key Populations</div>
          <div className="py-[14px] border-b text-center" style={{ borderColor: "#f1f5f9", color: "#475569" }}>Stroke survivors, post-surgery, encephalitis</div>
          <div className="py-[14px] border-b text-center" style={{ borderColor: "#f1f5f9", color: "#475569" }}>Falls, accidents, sport, military</div>

          {/* Market size */}
          <div className="py-[14px] border-b font-semibold" style={{ borderColor: "#f1f5f9", color: "#334155" }}>Clinical Segment</div>
          <div className="py-[14px] border-b text-center text-[24px] font-bold" style={{ borderColor: "#f1f5f9", color: "#0284c7" }}>$2.4B</div>
          <div className="py-[14px] border-b text-center text-[24px] font-bold" style={{ borderColor: "#f1f5f9", color: "#f97316" }}>$1.8B</div>

          {/* Combined row */}
          <div className="py-[16px] font-bold text-[20px]" style={{ color: "#334155" }}>Combined</div>
          <div className="py-[16px] col-span-2 text-center text-[28px] font-bold" style={{ color: "#16a34a" }}>
            $4.2B Clinical Beachhead within $22B TAM
          </div>
        </div>

        {/* SAM / SOM */}
        <div className="mt-[28px] flex gap-[40px]">
          <div className="flex-1 rounded-[12px] p-[20px]" style={{ background: "#f8fafc" }}>
            <div className="text-[16px] font-semibold uppercase tracking-widest" style={{ color: "#94a3b8" }}>SAM</div>
            <div className="mt-[8px] text-[28px] font-bold">$4.2B</div>
            <div className="mt-[4px] text-[16px]" style={{ color: "#64748b" }}>English-speaking knowledge workers + ABI/TBI + brain health</div>
          </div>
          <div className="flex-1 rounded-[12px] p-[20px]" style={{ background: "#f8fafc" }}>
            <div className="text-[16px] font-semibold uppercase tracking-widest" style={{ color: "#94a3b8" }}>SOM</div>
            <div className="mt-[8px] text-[28px] font-bold">$35M</div>
            <div className="mt-[4px] text-[16px]" style={{ color: "#64748b" }}>UK + US direct-to-consumer Year 1</div>
          </div>
        </div>

        <p className="mt-[20px] text-[18px]" style={{ color: "#64748b" }}>
          We begin with concentrated clinical need and expand to universal utility. Sources: Grand View Research 2023, Precedence Research, WSO 2022, Lancet Neurology 2019
        </p>
      </div>
    </Slide>
  );
}

/* ─── SLIDE 14: DISTRIBUTION ─── */
function Slide14() {
  return (
    <Slide>
      <div className="flex-1 flex flex-col justify-center px-[160px]">
        <SectionLabel>Distribution</SectionLabel>
        <h2 className="mt-[24px] text-[56px] font-bold">Built-In Adoption Channels</h2>
        <div className="mt-[50px] flex items-center gap-[16px]">
          {[
            { stage: "Workplace", desc: "Team accountability loops. One user brings the tool — the team adopts it.", color: "#0284c7" },
            { stage: "Home", desc: "Personal commitments flow into the same system. One tool for all of life.", color: "#f97316" },
            { stage: "Family", desc: "Support Circles connect partners, parents, children. Each member sees the value.", color: "#a855f7" },
            { stage: "Clinical", desc: "Clinicians prescribe for post-surgery, ABI, TBI, and cognitive rehab. Medical credibility.", color: "#16a34a" },
            { stage: "Insurer", desc: "Outcome data enables reimbursement pathways. Institutional adoption.", color: "#64748b" },
          ].map((s, i) => (
            <div key={s.stage} className="flex-1 flex flex-col items-center text-center">
              <div className="w-[80px] h-[80px] rounded-full flex items-center justify-center text-[28px] font-bold text-white" style={{ background: s.color }}>
                {i + 1}
              </div>
              <div className="mt-[16px] text-[22px] font-semibold">{s.stage}</div>
              <div className="mt-[8px] text-[16px] leading-relaxed" style={{ color: "#64748b" }}>{s.desc}</div>
            </div>
          ))}
        </div>
        <p className="mt-[48px] text-[24px] font-light italic text-center" style={{ color: "#94a3b8" }}>
          Workplace → Home → Family → Clinical → Insurer. Each stage unlocks the next.
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
        <h2 className="mt-[24px] text-[56px] font-bold">What Happens When People Use It</h2>
        <div className="mt-[50px] flex gap-[40px]">
          {[
            { metric: "Consistency", direction: "↑", detail: "Users complete more of what they commit to. The closed loop creates follow-through.", color: "#16a34a" },
            { metric: "Restart After Interruption", direction: "↑", detail: "Progressive re-engagement pulls users back to their thread — instead of losing the day.", color: "#f97316" },
            { metric: "Confidence", direction: "↑", detail: "Tracked wins compound into self-trust. Users report feeling more capable over time.", color: "#a855f7" },
            { metric: "Productivity", direction: "↑", detail: "As reliability builds and confidence returns, users report sustained productivity gains — not through working harder, but through trusting themselves to follow through.", color: "#0284c7" },
          ].map((e) => (
            <div key={e.metric} className="flex-1 p-[36px] rounded-[16px]" style={{ background: "#f8fafc" }}>
              <div className="text-[48px] font-bold" style={{ color: e.color }}>{e.direction}</div>
              <div className="mt-[10px] text-[24px] font-semibold">{e.metric}</div>
              <div className="mt-[12px] text-[17px] leading-relaxed" style={{ color: "#64748b" }}>{e.detail}</div>
            </div>
          ))}
        </div>
        <div className="mt-[40px] flex gap-[32px]">
          <div className="px-[24px] py-[12px] rounded-full text-[18px]" style={{ background: "#f0f9ff", color: "#0284c7" }}>Working MVP</div>
          <div className="px-[24px] py-[12px] rounded-full text-[18px]" style={{ background: "#fff7ed", color: "#92400e" }}>Lived-experience validation</div>
          <div className="px-[24px] py-[12px] rounded-full text-[18px]" style={{ background: "#faf5ff", color: "#7c3aed" }}>Clinical conversations active</div>
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
        <h2 className="mt-[24px] text-[48px] font-bold">Recurring LEAP Platform Revenue</h2>
        <p className="mt-[16px] text-[24px]" style={{ color: "#64748b" }}>Path to £500K by December 2026</p>
        <div className="mt-[40px] flex gap-[40px]">
          {/* Revenue streams */}
          <div className="flex-1">
            <div className="text-[20px] font-semibold uppercase tracking-widest mb-[24px]" style={{ color: "#f97316" }}>How We Make Money</div>
            <div className="space-y-[20px]">
              {[
                { stream: "B2C Subscription", price: "£10–15/month", note: "Individual cognitive performance. Founding member pricing available." },
                { stream: "B2B Team Licensing", price: "£8/user/month", note: "Team accountability and cognitive continuity for organisations." },
                { stream: "Clinical Licensing", price: "£50/patient/month", note: "Post-discharge cognitive support. Prescribed by clinicians." },
              ].map((p) => (
                <div key={p.stream} className="p-[24px] rounded-[12px]" style={{ background: "#f8fafc" }}>
                  <div className="flex justify-between items-baseline">
                    <span className="text-[22px] font-semibold">{p.stream}</span>
                    <span className="text-[22px] font-bold" style={{ color: "#f97316" }}>{p.price}</span>
                  </div>
                  <div className="text-[16px] mt-[4px]" style={{ color: "#94a3b8" }}>{p.note}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Why this is a good investment */}
          <div className="flex-1">
            <div className="text-[20px] font-semibold uppercase tracking-widest mb-[24px]" style={{ color: "#a855f7" }}>Why This Makes Money for Investors</div>
            <div className="space-y-[16px]">
              {[
                { plain: "£500K revenue by Dec 2026", meaning: "Proves the model works — real customers paying real money" },
                { plain: "85% gross margins", meaning: "For every £1 we earn, 85p is profit before overheads" },
                { plain: "9:1 return on customer spend", meaning: "Every £1 spent getting a customer returns £9 over their lifetime" },
                { plain: "Recurring subscriptions", meaning: "Money comes in every month — not one-off purchases" },
                { plain: "Multiple exit paths", meaning: "Acquisition by health-tech or productivity platform, or continued growth" },
              ].map((m) => (
                <div key={m.plain} className="p-[16px] rounded-[12px]" style={{ background: "#faf5ff" }}>
                  <div className="text-[20px] font-semibold">{m.plain}</div>
                  <div className="text-[16px] mt-[4px]" style={{ color: "#64748b" }}>{m.meaning}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Slide>
  );
}

/* ─── SLIDE 17: COMPETITIVE ADVANTAGE ─── */
function Slide17() {
  return (
    <Slide>
      <div className="flex-1 flex flex-col justify-center px-[160px]">
        <SectionLabel>Competitive Advantage</SectionLabel>
        <h2 className="mt-[24px] text-[56px] font-bold">Why This Wins</h2>
        <div className="mt-[50px] flex gap-[32px]">
          <div className="flex-1 p-[40px] rounded-[16px] border-2" style={{ borderColor: "#e2e8f0" }}>
            <div className="text-[22px] font-bold mb-[16px]" style={{ color: "#94a3b8" }}>Not a Productivity App</div>
            <div className="text-[20px] leading-relaxed" style={{ color: "#64748b" }}>
              Productivity tools assume functioning cognition. They work when you're at your best. They fail exactly when you need them most.
            </div>
          </div>
          <div className="flex-1 p-[40px] rounded-[16px] border-2" style={{ borderColor: "#e2e8f0" }}>
            <div className="text-[22px] font-bold mb-[16px]" style={{ color: "#94a3b8" }}>Not Therapy</div>
            <div className="text-[20px] leading-relaxed" style={{ color: "#64748b" }}>
              Therapy is episodic. Once a week, one hour. The other 167 hours have no support layer. Life happens in the gaps between sessions.
            </div>
          </div>
          <div className="flex-1 p-[40px] rounded-[16px] border-2" style={{ borderColor: "#f97316", background: "#fff7ed" }}>
           <div className="text-[22px] font-bold mb-[16px]" style={{ color: "#f97316" }}>LEAP + CCM Platform</div>
            <div className="text-[20px] leading-relaxed" style={{ color: "#475569" }}>
              Always-on. Collaborative. Adapts to cognitive state. Escalates when needed. Celebrates when earned. Life empowerment, not just productivity.
            </div>
          </div>
        </div>
        <div className="mt-[40px] p-[24px] rounded-[12px]" style={{ background: "#f8fafc" }}>
          <span className="text-[20px] font-semibold">Moat: </span>
          <span className="text-[20px]" style={{ color: "#64748b" }}>
            Clinical-grade reliability · Lived-experience foundation · Network effects via Support Circle · Behavioural data moat
          </span>
        </div>
      </div>
    </Slide>
  );
}

/* ─── SLIDE 18: THE ASK ─── */
function Slide18() {
  return (
    <Slide>
      <div className="flex-1 flex flex-col justify-center px-[120px]">
        <SectionLabel>The Ask</SectionLabel>
        <h2 className="mt-[20px] text-[52px] font-bold">
          We are raising <span style={{ color: "#f97316" }}>£250,000</span> in pre-seed funding.
        </h2>

        <div className="mt-[36px] flex gap-[32px]">
          {/* LEFT: What your money buys */}
          <div className="flex-1">
            <div className="text-[20px] font-semibold mb-[20px]" style={{ color: "#475569" }}>What Your £250K Buys</div>
            {[
              { amount: "£100K", purpose: "Build the product to clinical-grade standard" },
              { amount: "£75K", purpose: "Get the first 1,000 paying users" },
              { amount: "£37.5K", purpose: "Run clinical pilots that prove outcomes" },
              { amount: "£25K", purpose: "Hire key team members" },
              { amount: "£12.5K", purpose: "Safety net for unexpected costs" },
            ].map((f) => (
              <div key={f.amount} className="flex items-baseline gap-[12px] mb-[12px]">
                <span className="text-[22px] font-bold shrink-0 w-[100px]" style={{ color: "#f97316" }}>{f.amount}</span>
                <span className="text-[20px]" style={{ color: "#475569" }}>{f.purpose}</span>
              </div>
            ))}
          </div>

          {/* RIGHT: What happens next */}
          <div className="flex-1">
            <div className="text-[20px] font-semibold mb-[20px]" style={{ color: "#475569" }}>Your Investment Journey</div>
            {[
              { time: "Month 1–3", event: "Product launched, founding members onboarded" },
              { time: "Month 4–6", event: "Clinical pilots producing outcome data" },
              { time: "Month 7–9", event: "2,500+ subscribers, B2B revenue starting" },
              { time: "Month 10–12", event: "£500K revenue run rate — Series A ready" },
            ].map((m) => (
              <div key={m.time} className="flex items-start gap-[12px] mb-[14px]">
                <span className="text-[18px] font-bold shrink-0 w-[120px]" style={{ color: "#a855f7" }}>{m.time}</span>
                <span className="text-[20px]" style={{ color: "#475569" }}>{m.event}</span>
              </div>
            ))}
          </div>
        </div>

        {/* What the investor gets */}
        <div className="mt-[28px] p-[28px] rounded-[16px]" style={{ background: "#fff7ed" }}>
          <div className="text-[22px] font-bold mb-[12px]">What You Get as an Investor</div>
          <div className="flex gap-[48px]">
            <div className="flex-1">
              <div className="text-[20px]" style={{ color: "#475569" }}>
                <strong>Equity in MyRhythm</strong> — you own a percentage of the company
              </div>
              <div className="text-[20px] mt-[8px]" style={{ color: "#475569" }}>
                <strong>Early-stage entry</strong> — before clinical validation increases the valuation
              </div>
            </div>
            <div className="flex-1">
              <div className="text-[20px]" style={{ color: "#475569" }}>
                <strong>10–20x typical return</strong> — pre-seed health-tech investors see significant multiples
              </div>
              <div className="text-[20px] mt-[8px]" style={{ color: "#475569" }}>
                <strong>Your £250K today</strong> could be worth substantially more at Series A
              </div>
            </div>
          </div>
        </div>

        <div className="mt-[20px] flex items-center justify-between">
          <div className="text-[20px] font-semibold" style={{ color: "#1a1a2e" }}>
            Empower Your Day. Own Your Rhythm.
          </div>
          <div className="text-[18px]" style={{ color: "#94a3b8" }}>
            investors@myrhythm.com · myrhythm.app
          </div>
        </div>
        <div className="mt-[12px] text-[14px] text-center" style={{ color: "#94a3b8" }}>
          MyRhythm is a life empowerment and productivity app. It is not a medical device.
        </div>
      </div>
    </Slide>
  );
}

/* ─── SLIDE 19: REFERENCES ─── */
function Slide19() {
  return (
    <Slide bg="#0a0a1a">
      <div className="flex-1 flex flex-col justify-center px-[160px]">
        <span className="text-[16px] font-semibold tracking-[0.2em] uppercase" style={{ color: "#a855f7" }}>
          References
        </span>
        <h2 className="mt-[24px] text-[48px] font-bold" style={{ color: "#ffffff" }}>Sources &amp; Citations</h2>
        <div className="mt-[40px] grid grid-cols-2 gap-x-[60px] gap-y-[20px]">
          {[
            "McKinsey Global Institute (2023). The social economy: Unlocking value and productivity through social technologies.",
            "Microsoft Research (2023). Viva Insights — Attention span and context-switching in knowledge work.",
            "Grand View Research (2023). Cognitive Assessment & Training Market Size Report, 2023–2030.",
            "Precedence Research (2023). Brain Health Supplements & Digital Cognitive Wellness Market.",
            "Wood, R.L. (1997). Neuropathological indicators of brain damage. Brain Injury, 11(10), pp.735–741.",
            "Dikmen, S.S. et al. (2009). Cognitive outcome following traumatic brain injury. Journal of the International Neuropsychological Society.",
            "CDC (2022). TBI-related emergency department visits, hospitalisations, and readmission data.",
            "World Stroke Organisation (2022). Global Stroke Fact Sheet. Lancet Neurology.",
          ].map((ref, i) => (
            <div key={i} className="flex gap-[12px]">
              <span className="text-[16px] font-mono shrink-0" style={{ color: "#a855f7" }}>[{i + 1}]</span>
              <span className="text-[16px] leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>{ref}</span>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  );
}

/* ─── SLIDE 20: APPENDIX — RECOMMENDED MVP ─── */
function Slide20() {
  return (
    <Slide bg="#0a0a1a">
      <div className="flex-1 flex flex-col justify-center px-[120px]">
        <span className="text-[16px] font-semibold tracking-[0.2em] uppercase" style={{ color: "#a855f7" }}>
          Appendix
        </span>
        <h2 className="mt-[20px] text-[44px] font-bold" style={{ color: "#ffffff" }}>Recommended MVP</h2>
        <p className="mt-[8px] text-[20px]" style={{ color: "rgba(255,255,255,0.5)" }}>
          Every feature built to clinical-grade cognitive standards. Available to all users from day one.
        </p>

        <div className="mt-[32px] flex gap-[40px]">
          {/* MVP Core */}
          <div className="flex-1 p-[32px] rounded-[16px]" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="text-[20px] font-bold mb-[20px]" style={{ color: "#f97316" }}>MVP Core (Months 1–3)</div>
            <div className="space-y-[14px]">
              {[
                { name: "Memory Bridge", desc: "Voice capture + AI action extraction" },
                { name: "Support Circle", desc: "Invite up to 5 people, escalation alerts" },
                { name: "Daily Brain Boost", desc: "50 cognitive exercises from the 240+ library" },
                { name: "Smart Scheduling", desc: "MYRHYTHM assessment determines cognitive peaks; users block unavailable days; AI schedules at optimal windows" },
                { name: "Founding Member", desc: "Stripe subscription, £10/month" },
              ].map((f) => (
                <div key={f.name}>
                  <span className="text-[18px] font-semibold" style={{ color: "#ffffff" }}>{f.name}</span>
                  <span className="text-[16px] ml-[8px]" style={{ color: "rgba(255,255,255,0.5)" }}>— {f.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Post-MVP */}
          <div className="flex-1 p-[32px] rounded-[16px]" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="text-[20px] font-bold mb-[20px]" style={{ color: "#a855f7" }}>Post-MVP (Months 4–6)</div>
            <div className="space-y-[14px]">
              {[
                { name: "Clinical Dashboard", desc: "Provider view of patient progress (ABI/TBI unlock)" },
                { name: "Full Brain Boost Library", desc: "240+ exercises across all cognitive domains" },
                { name: "Progressive Escalation v2", desc: "Customisable urgency tiers" },
                { name: "B2B Team Licensing", desc: "Organisational accounts and admin portal" },
                { name: "Analytics & Reporting", desc: "Outcome tracking and exportable reports" },
              ].map((f) => (
                <div key={f.name}>
                  <span className="text-[18px] font-semibold" style={{ color: "#ffffff" }}>{f.name}</span>
                  <span className="text-[16px] ml-[8px]" style={{ color: "rgba(255,255,255,0.4)" }}>— {f.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-[32px] p-[20px] rounded-[12px] text-center" style={{ background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.15)" }}>
          <span className="text-[18px] font-medium" style={{ color: "#f97316" }}>
            MVP Scope: 12 weeks · Budget: £100K of £250K raise · Target: 50 founding members at launch
          </span>
        </div>
      </div>
    </Slide>
  );
}

/* ─── SLIDE RENDERER ─── */
const slides = [Slide01, Slide02, Slide03, Slide04, Slide05, Slide06, Slide07, Slide08, Slide09, Slide10, Slide11, Slide12, Slide13, Slide14, Slide15, Slide16, Slide17, Slide18, Slide19, Slide20];

export function ProductivityInvestorSlides({ currentSlide }: { currentSlide: number }) {
  const SlideComponent = slides[currentSlide] || Slide01;
  return <SlideComponent />;
}
