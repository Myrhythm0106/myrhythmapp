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

/* ─── SLIDE 1: TITLE (Deloitte/Accenture aesthetic) ─── */
function Slide01() {
  return (
    <Slide bg="#0a0a1a">
      {/* Top accent line */}
      <div className="w-full h-[4px]" style={{ background: "linear-gradient(90deg, #f97316, #a855f7)" }} />

      <div className="flex-1 flex flex-col justify-center px-[200px] relative">
        {/* Main title block */}
        <h1
          className="text-[96px] font-bold leading-none"
          style={{ color: "#ffffff", letterSpacing: "0.04em" }}
        >
          MyRhythm
        </h1>
        <p
          className="mt-[28px] text-[36px] font-light tracking-wide"
          style={{ color: "#028090" }}
        >
          Collaborative Cognitive Management
        </p>
        <p
          className="mt-[20px] text-[24px] font-light leading-relaxed max-w-[800px]"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          Bridging the gap between clinical care and daily living
        </p>

        {/* Divider */}
        <div className="mt-[60px] w-full h-[1px]" style={{ background: "rgba(255,255,255,0.1)" }} />

        {/* Bottom metadata bar */}
        <div className="mt-[40px] flex items-end justify-between">
          <div>
            <p className="text-[16px] tracking-[0.15em] uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>
              Investor Presentation
            </p>
            <p className="mt-[6px] text-[14px]" style={{ color: "rgba(255,255,255,0.25)" }}>
              Pre-Seed Round · Confidential
            </p>
          </div>

          <div className="text-center">
            <p className="text-[18px] font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>
              Annabel Aaron
            </p>
            <p className="mt-[4px] text-[14px]" style={{ color: "rgba(255,255,255,0.3)" }}>
              Founder &amp; CEO
            </p>
          </div>

          <div className="text-right">
            <p className="text-[16px] tracking-[0.15em] uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>
              March 2026
            </p>
          </div>
        </div>
      </div>

      {/* Confidential watermark */}
      <div className="absolute bottom-[20px] right-[40px]">
        <span className="text-[11px] tracking-[0.3em] uppercase" style={{ color: "rgba(255,255,255,0.12)" }}>
          Confidential
        </span>
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
        <h2 className="mt-[24px] text-[60px] font-bold leading-[1.1]">
          Every year, 69 million people sustain a TBI.<br />
          <span style={{ color: "#f97316" }}>12 million more suffer a stroke or acquired brain injury.</span>
        </h2>
        <div className="mt-[60px] flex gap-[60px]">
          {[
            { stat: "69M", label: "traumatic brain injuries annually (Dewan et al., 2019)" },
            { stat: "12M", label: "new strokes annually (Feigin et al., Lancet Neurology 2021)" },
            { stat: "53M", label: "Americans are caregivers (AARP/NAC 2020)" },
            { stat: "85%", label: "of ABI & TBI survivors report daily cognitive struggles" },
          ].map((d) => (
            <div key={d.label}>
              <div className="text-[48px] font-bold" style={{ color: "#f97316" }}>{d.stat}</div>
              <div className="text-[18px] mt-[8px] max-w-[240px]" style={{ color: "#64748b" }}>{d.label}</div>
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
  const impactCards = [
    { icon: "💔", label: "Marriages", stat: "49%", detail: "of pre-injury relationships break down within 5–8 years", source: "Wood & Yurdakul, Brain Injury 1997" },
    { icon: "💼", label: "Careers", stat: "60%", detail: "of moderate-severe TBI survivors unable to return to prior employment", source: "Shames et al., NeuroRehabilitation 2007" },
    { icon: "🏥", label: "Readmission", stat: "1 in 3", detail: "TBI patients readmitted to hospital within 5 years", source: "CDC/NIDILRR Model Systems" },
    { icon: "💰", label: "Economic", stat: "$40B+", detail: "annual direct US healthcare costs for TBI alone", source: "Miller et al., Medical Care 2021" },
    { icon: "😔", label: "Caregivers", stat: "40%", detail: "of brain injury caregivers report clinical depression", source: "National Academies 2022" },
    { icon: "👨‍👩‍👧", label: "Children", stat: "68%", detail: "of families report children's wellbeing significantly affected", source: "UKABIF Family Survey 2019" },
    { icon: "🧠", label: "Memory", stat: "54%", detail: "of moderate-severe TBI survivors report persistent memory difficulties affecting daily life", source: "Dikmen et al., Archives of Physical Medicine 2009" },
    { icon: "😞", label: "Confidence", stat: "57%", detail: "of ABI survivors report clinically significant loss of self-confidence and identity", source: "Gracey et al., Neuropsychological Rehabilitation 2008" },
  ];

  return (
    <Slide>
      <div className="flex-1 flex flex-col justify-center px-[100px]">
        <SectionLabel>The System Gap</SectionLabel>
        <h2 className="mt-[16px] text-[44px] font-bold leading-tight">
          The ABI & TBI patient goes home. The system moves on.<br />
          <span style={{ color: "#dc2626" }}>The real damage begins.</span>
        </h2>

        <p className="mt-[20px] text-[22px] rounded-[12px] px-[24px] py-[16px]" style={{ background: "#fef2f2", color: "#991b1b" }}>
          Clinical rehab: 6–12 weeks post-ABI/TBI. Then: a pamphlet and a follow-up in 6 months.
        </p>

        <div className="mt-[28px] grid grid-cols-4 gap-[16px]">
          {impactCards.map((card) => (
            <div key={card.label} className="rounded-[12px] p-[16px] border" style={{ background: "#ffffff", borderColor: "#e2e8f0" }}>
              <div className="flex items-center gap-[8px] mb-[6px]">
                <span className="text-[18px]">{card.icon}</span>
                <span className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: "#94a3b8" }}>{card.label}</span>
              </div>
              <div className="text-[32px] font-bold" style={{ color: "#dc2626" }}>{card.stat}</div>
              <p className="text-[13px] mt-[4px] leading-snug" style={{ color: "#475569" }}>{card.detail}</p>
              <p className="text-[11px] mt-[4px] italic" style={{ color: "#94a3b8" }}>{card.source}</p>
            </div>
          ))}
        </div>

        <p className="mt-[20px] text-[11px]" style={{ color: "#94a3b8" }}>
          Sources: Wood 1997; Shames 2007; CDC/NIDILRR; Miller 2021; National Academies 2022; UKABIF 2019; Dikmen 2009; Gracey 2008
        </p>

        <p className="mt-[12px] text-[24px] font-light italic text-center" style={{ color: "#64748b" }}>
          "No app. No system. No continuity. Just a person trying to remember who they were."
        </p>
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
          The missing layer is not another app. It is Collaborative Cognitive Management — woven into the fabric of daily life, backed by people who care.
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
        <h2 className="mt-[24px] text-[56px] font-bold">Collaborative Cognitive Management</h2>
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
            <div className="text-[16px] mt-[8px]" style={{ color: "#64748b" }}>Collaborative Cognitive</div>
            <div className="text-[16px]" style={{ color: "#64748b" }}>Management</div>
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
    { title: "Vision & Goal Setting", desc: "Set life goals, break them into steps, and share progress with rehab and medical teams. Forward momentum that empowers and maintains clinical connections.", icon: "🎯" },
    { title: "Support Circle", desc: "Trusted network of 5 people who step in when the brain needs backup.", icon: "🤝" },
    { title: "Daily Brain Boost", desc: "240+ cognitive exercises building resilience, confidence, and mental agility.", icon: "🧠" },
    { title: "Smart Scheduling", desc: "Your AI personal assistant. MYRHYTHM assessment determines your cognitive peaks. Memory Bridge extracts commitments. AI auto-schedules at optimal windows, suggests inviting attendees from your Support Circle, and syncs with Google Calendar and Outlook.", icon: "📅" },
  ];
  return (
    <Slide>
      <div className="flex-1 flex flex-col justify-center px-[160px]">
        <SectionLabel>The Solution</SectionLabel>
        <h2 className="mt-[24px] text-[56px] font-bold">How MyRhythm Works</h2>
        {/* Top row: 3 pillars */}
        <div className="mt-[50px] grid grid-cols-3 gap-[28px]">
          {pillars.slice(0, 3).map((p) => (
            <div key={p.title} className="p-[36px] rounded-[16px]" style={{ background: "#f8fafc" }}>
              <div className="text-[40px]">{p.icon}</div>
              <div className="mt-[14px] text-[26px] font-semibold">{p.title}</div>
              <div className="mt-[10px] text-[18px] leading-relaxed" style={{ color: "#64748b" }}>{p.desc}</div>
            </div>
          ))}
        </div>
        {/* Bottom row: 3 pillars */}
        <div className="mt-[28px] grid grid-cols-3 gap-[28px]">
          {pillars.slice(3).map((p) => (
            <div key={p.title} className="p-[36px] rounded-[16px]" style={{ background: "#f8fafc" }}>
              <div className="text-[40px]">{p.icon}</div>
              <div className="mt-[14px] text-[26px] font-semibold">{p.title}</div>
              <div className="mt-[10px] text-[18px] leading-relaxed" style={{ color: "#64748b" }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  );
}

/* ─── SLIDE 9: THE DAILY BEHAVIOUR LOOP ─── */
function Slide09() {
  const loopSteps = [
    { phase: "Capture", time: "Morning", icon: "🌅", desc: "Vision reminds you why. Goals show you what. Your day starts with purpose, not panic.", color: "#f97316" },
    { phase: "Commit", time: "During the Day", icon: "⚡", desc: "Actions keep you moving. Support Circle keeps you accountable. Every step is tracked.", color: "#0284c7" },
    { phase: "Calibrate", time: "Evening", icon: "📊", desc: "Review progress. Adjust tomorrow. Medical team sees continuity without extra appointments.", color: "#7c3aed" },
    { phase: "Celebrate", time: "Always", icon: "🎉", desc: "Every win — big or small — is recognised. Confidence builds. Momentum compounds.", color: "#16a34a" },
  ];
  return (
    <Slide>
      <div className="flex-1 flex flex-col justify-center px-[160px]">
        <SectionLabel>The Behaviour Loop</SectionLabel>
        <h2 className="mt-[24px] text-[56px] font-bold">Capture → Commit → Calibrate → Celebrate</h2>
        <p className="mt-[16px] text-[24px]" style={{ color: "#64748b" }}>
          Five pillars. One daily cycle. A closed loop that turns vision into visible progress.
        </p>
        <div className="mt-[44px] grid grid-cols-4 gap-[28px]">
          {loopSteps.map((s) => (
            <div key={s.phase} className="p-[32px] rounded-[16px] text-center" style={{ background: "#f8fafc" }}>
              <div className="text-[44px]">{s.icon}</div>
              <div className="mt-[12px] text-[28px] font-bold" style={{ color: s.color }}>{s.phase}</div>
              <div className="mt-[6px] text-[16px] font-medium" style={{ color: "#94a3b8" }}>{s.time}</div>
              <div className="mt-[14px] text-[17px] leading-relaxed" style={{ color: "#475569" }}>{s.desc}</div>
            </div>
          ))}
        </div>
        <p className="mt-[36px] text-[22px] font-light italic" style={{ color: "#94a3b8" }}>
          Every productivity app starts with a task. MyRhythm starts with a purpose.
        </p>
      </div>
    </Slide>
  );
}

/* ─── SLIDE 10: THE EXPANSION ─── */
function Slide10() {
  const rings = [
    { label: "ABI & TBI Survivors", size: 200, color: "#f97316", textColor: "#fff" },
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
            We begin with ABI & TBI survivors — the most underserved, highest-need cohort. Every feature we build for them works for everyone.
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
        <h2 className="mt-[24px] text-[56px] font-bold">Built for ABI & TBI. Useful for Every Brain.</h2>
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
          The features that help an ABI & TBI survivor keep promises are the same features that help a CEO keep commitments.
        </p>
      </div>
    </Slide>
  );
}

/* ─── SLIDE 12: MARKET SIZE ─── */
function Slide12() {
  return (
    <Slide>
      <div className="flex-1 flex flex-col justify-center px-[120px]">
        <SectionLabel>Market Opportunity</SectionLabel>
        <h2 className="mt-[20px] text-[44px] font-bold">The Combined Opportunity</h2>
        <p className="mt-[8px] text-[26px] font-semibold" style={{ color: "#f97316" }}>
          TAM: $4.2B — Global ABI + TBI Cognitive Support Market
        </p>

        {/* Two-column ABI vs TBI breakdown */}
        <div className="mt-[36px] grid grid-cols-[180px_1fr_1fr] gap-0 text-[18px]">
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
          <div className="py-[14px] border-b font-semibold" style={{ borderColor: "#f1f5f9", color: "#334155" }}>Market Size</div>
          <div className="py-[14px] border-b text-center text-[24px] font-bold" style={{ borderColor: "#f1f5f9", color: "#0284c7" }}>$2.4B</div>
          <div className="py-[14px] border-b text-center text-[24px] font-bold" style={{ borderColor: "#f1f5f9", color: "#f97316" }}>$1.8B</div>

          {/* Combined row */}
          <div className="py-[16px] font-bold text-[20px]" style={{ color: "#334155" }}>Combined</div>
          <div className="py-[16px] col-span-2 text-center text-[28px] font-bold" style={{ color: "#16a34a" }}>
            $4.2B Total Addressable Market
          </div>
        </div>

        {/* SAM / SOM */}
        <div className="mt-[28px] flex gap-[40px]">
          <div className="flex-1 rounded-[12px] p-[20px]" style={{ background: "#f8fafc" }}>
            <div className="text-[16px] font-semibold uppercase tracking-widest" style={{ color: "#94a3b8" }}>SAM</div>
            <div className="mt-[8px] text-[28px] font-bold">$1.1B</div>
            <div className="mt-[4px] text-[16px]" style={{ color: "#64748b" }}>English-speaking ABI + TBI + MCI + caregivers</div>
          </div>
          <div className="flex-1 rounded-[12px] p-[20px]" style={{ background: "#f8fafc" }}>
            <div className="text-[16px] font-semibold uppercase tracking-widest" style={{ color: "#94a3b8" }}>SOM</div>
            <div className="mt-[8px] text-[28px] font-bold">$28M</div>
            <div className="mt-[4px] text-[16px]" style={{ color: "#64748b" }}>UK + US direct-to-consumer Year 1</div>
          </div>
        </div>

        <p className="mt-[20px] text-[18px]" style={{ color: "#64748b" }}>
          8.1% CAGR · Sources: Dewan et al., J Neurosurg 2019; GBD 2019 / Feigin et al., Lancet Neurology 2021; AARP/NAC 2020; Grand View Research 2023
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
            { title: "Community-Led", desc: "ABI & TBI survivor networks, Headway UK, Brain Injury Association. Trust-based adoption where clinical referrals fail.", color: "#f97316" },
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
            { title: "Authentic Problem-Market Fit", desc: "Built by an ABI survivor. Not a Silicon Valley solution looking for a problem." },
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
        <div className="mt-[40px] flex gap-[40px]">
          {/* Revenue streams */}
          <div className="flex-1">
            <div className="text-[20px] font-semibold uppercase tracking-widest mb-[24px]" style={{ color: "#f97316" }}>How We Make Money</div>
            <div className="space-y-[20px]">
              {[
                { plan: "Founding Member", price: "£10/month", note: "First 500 users · Locked forever" },
                { plan: "Standard", price: "£15/month", note: "Post-founding pricing" },
                { plan: "Clinical License", price: "£50/user/month", note: "Per-patient pricing for rehab centres" },
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

/* ─── SLIDE 17: THE FOUNDER ─── */
function Slide17() {
  return (
    <Slide bg="#fafafa">
      <div className="flex-1 flex flex-col items-center justify-center px-[240px] text-center">
        <SectionLabel>The Founder</SectionLabel>
        <h2 className="mt-[32px] text-[56px] font-bold leading-tight">
          Built by an ABI survivor who<br />needed this tool to exist.
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
            MyRhythm: Life Empowerment And Productivity Operating System (LEAP-OS)
          </div>
          <div className="text-[18px]" style={{ color: "#94a3b8" }}>
            investors@myrhythm.com · myrhythm.app
          </div>
        </div>
      </div>
    </Slide>
  );
}

/* ─── SLIDE 19: REFERENCES ─── */
function Slide19() {
  const references = [
    {
      number: 1,
      authors: "Dewan MC, Rattani A, Gupta S, et al.",
      title: "Estimating the global incidence of traumatic brain injury.",
      journal: "Journal of Neurosurgery",
      details: "2019; 130(4): 1080–1097.",
    },
    {
      number: 2,
      authors: "Feigin VL, Stark BA, Johnson CO, et al.",
      title: "Global, regional, and national burden of stroke and its risk factors, 1990–2019: a systematic analysis for the Global Burden of Disease Study 2019.",
      journal: "Lancet Neurology",
      details: "2021; 20(10): 795–820.",
    },
    {
      number: 3,
      authors: "World Stroke Organization.",
      title: "Global Stroke Fact Sheet.",
      journal: "",
      details: "2022.",
    },
    {
      number: 4,
      authors: "AARP & National Alliance for Caregiving.",
      title: "Caregiving in the U.S.",
      journal: "",
      details: "2020.",
    },
    {
      number: 5,
      authors: "Grand View Research.",
      title: "Cognitive Assessment & Training in Healthcare Market Report.",
      journal: "",
      details: "2023.",
    },
    {
      number: 6,
      authors: "Rabinowitz AR, Levin HS.",
      title: "Cognitive Sequelae of Traumatic Brain Injury.",
      journal: "Psychiatr Clin North Am",
      details: "2014; 37(1): 1–11.",
    },
    {
      number: 7,
      authors: "Miller GF, DePadilla L, Xu L.",
      title: "Costs of non-fatal traumatic brain injury in the United States, 2016.",
      journal: "Medical Care",
      details: "2021; 59(5): 451–455.",
    },
    {
      number: 8,
      authors: "Wood RL, Yurdakul LK.",
      title: "Change in relationship status following traumatic brain injury.",
      journal: "Brain Injury",
      details: "1997; 11(7): 491–501.",
    },
    {
      number: 9,
      authors: "National Academies of Sciences, Engineering, and Medicine.",
      title: "Traumatic Brain Injury: A Roadmap for Accelerating Progress.",
      journal: "National Academies Press",
      details: "2022.",
    },
    {
      number: 10,
      authors: "Shames J, Treger I, Ring H, Giaquinto S.",
      title: "Return to work following traumatic brain injury: trends and challenges.",
      journal: "NeuroRehabilitation",
      details: "2007; 22(3): 205–213.",
    },
    {
      number: 11,
      authors: "GBD 2021 Stroke Collaborators / Feigin VL, et al.",
      title: "Global, regional, and national burden of stroke and its risk factors, 1990–2021.",
      journal: "Lancet Neurology",
      details: "2024; 23(10): 973–1003.",
    },
  ];

  return (
    <Slide>
      <div className="flex flex-col h-full px-[60px] py-[48px]" style={{ background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)" }}>
        <div className="flex items-center gap-[12px] mb-[32px]">
          <div className="w-[6px] h-[36px] rounded-full" style={{ background: "linear-gradient(180deg, #1a1a2e, #3b82f6)" }} />
          <h2 className="text-[36px] font-bold tracking-tight" style={{ color: "#1a1a2e" }}>
            References
          </h2>
        </div>

        <div className="flex-1 flex flex-col justify-center gap-[20px]">
          {references.map((ref) => (
            <div key={ref.number} className="flex gap-[12px] text-[17px] leading-[1.5]">
              <span className="font-bold min-w-[24px]" style={{ color: "#3b82f6" }}>{ref.number}.</span>
              <p style={{ color: "#334155" }}>
                <span className="font-semibold">{ref.authors}</span>{" "}
                "{ref.title}"{" "}
                {ref.journal && <em>{ref.journal}, </em>}
                {ref.details}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-[20px] flex items-center justify-between border-t pt-[16px]" style={{ borderColor: "#e2e8f0" }}>
          <div className="text-[16px]" style={{ color: "#94a3b8" }}>
            All statistics cited in this presentation are sourced from the references above.
          </div>
          <div className="text-[16px]" style={{ color: "#94a3b8" }}>
            myrhythm.app
          </div>
        </div>
      </div>
    </Slide>
  );
}

/* ─── SLIDE 20: APPENDIX — RECOMMENDED MVP ─── */
function Slide20() {
  const mvpCore = [
    { title: "Memory Bridge", desc: "Voice capture + AI action extraction — the core CCM loop" },
    { title: "Support Circle", desc: "Invite up to 5 people, escalation alerts, accountability" },
    { title: "Daily Brain Boost", desc: "50 cognitive exercises from the 240+ library" },
    { title: "Smart Scheduling", desc: "MYRHYTHM assessment determines peaks; AI auto-schedules with attendee invitations; smart email auto-complete from saved contacts; confirm or auto-accept" },
    { title: "Founding Member Sub", desc: "Stripe integration, £10/month subscription" },
  ];
  const postMvp = [
    { title: "Clinical Dashboard", desc: "Provider view of patient progress & outcomes" },
    { title: "Full Brain Boost Library", desc: "All 240+ cognitive exercises unlocked" },
    { title: "Progressive Escalation v2", desc: "Customisable urgency tiers & rules" },
    { title: "B2B Licensing Portal", desc: "Enterprise onboarding & management" },
    { title: "Analytics & Reporting", desc: "Outcome tracking, exportable reports" },
  ];
  return (
    <Slide bg="#0a0a1a">
      <div className="flex-1 flex flex-col px-[120px] py-[80px]">
        <div className="flex items-center gap-[16px]">
          <div className="w-[6px] h-[36px] rounded-full" style={{ background: "linear-gradient(180deg, #f97316, #a855f7)" }} />
          <span className="text-[16px] font-semibold tracking-[0.2em] uppercase" style={{ color: "#a855f7" }}>
            Appendix
          </span>
        </div>
        <h2 className="mt-[20px] text-[52px] font-bold" style={{ color: "#ffffff" }}>
          Recommended MVP
        </h2>
        <p className="mt-[12px] text-[22px]" style={{ color: "rgba(255,255,255,0.45)" }}>
          Features selected to demonstrate end-to-end CCM: Capture → Commit → Calibrate → Celebrate
        </p>

        <div className="mt-[48px] flex gap-[48px] flex-1">
          {/* Left column: MVP Core */}
          <div className="flex-1">
            <div className="flex items-center gap-[12px] mb-[28px]">
              <div className="w-[12px] h-[12px] rounded-full" style={{ background: "#f97316" }} />
              <span className="text-[20px] font-bold tracking-wide uppercase" style={{ color: "#f97316" }}>
                MVP Core — Months 1–3
              </span>
            </div>
            <div className="flex flex-col gap-[20px]">
              {mvpCore.map((item, i) => (
                <div key={i} className="p-[24px] rounded-[12px] border" style={{ background: "rgba(249,115,22,0.06)", borderColor: "rgba(249,115,22,0.15)" }}>
                  <div className="text-[22px] font-semibold" style={{ color: "#ffffff" }}>{item.title}</div>
                  <div className="mt-[6px] text-[16px]" style={{ color: "rgba(255,255,255,0.5)" }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column: Post-MVP */}
          <div className="flex-1">
            <div className="flex items-center gap-[12px] mb-[28px]">
              <div className="w-[12px] h-[12px] rounded-full" style={{ background: "#a855f7" }} />
              <span className="text-[20px] font-bold tracking-wide uppercase" style={{ color: "#a855f7" }}>
                Post-MVP — Months 4–6
              </span>
            </div>
            <div className="flex flex-col gap-[20px]">
              {postMvp.map((item, i) => (
                <div key={i} className="p-[24px] rounded-[12px] border" style={{ background: "rgba(168,85,247,0.06)", borderColor: "rgba(168,85,247,0.15)" }}>
                  <div className="text-[22px] font-semibold" style={{ color: "#ffffff" }}>{item.title}</div>
                  <div className="mt-[6px] text-[16px]" style={{ color: "rgba(255,255,255,0.5)" }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-[40px] py-[20px] px-[32px] rounded-[12px] flex items-center justify-between" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <span className="text-[18px] font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>
            MVP Scope: <span style={{ color: "#f97316" }}>12 weeks</span>
          </span>
          <span className="text-[18px] font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>
            Budget: <span style={{ color: "#f97316" }}>£100K</span> of £250K raise
          </span>
          <span className="text-[18px] font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>
            Target: <span style={{ color: "#f97316" }}>50 founding members</span> at launch
          </span>
        </div>
      </div>
    </Slide>
  );
}

/* ─── SLIDE RENDERER ─── */
const slides = [Slide01, Slide02, Slide03, Slide04, Slide05, Slide06, Slide07, Slide08, Slide09, Slide10, Slide11, Slide12, Slide13, Slide14, Slide15, Slide16, Slide17, Slide18, Slide19, Slide20];

export function InvestorSlides({ currentSlide }: { currentSlide: number }) {
  const SlideComponent = slides[currentSlide] || Slide01;
  return <SlideComponent />;
}
