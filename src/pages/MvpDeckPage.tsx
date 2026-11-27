import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import heroImg from '@/assets/hero-composed-executive.jpg';
import recordImg from '@/assets/step-record-consultation.jpg';
import confirmImg from '@/assets/step-confirm-review.jpg';
import scheduleImg from '@/assets/step-schedule-balance.jpg';
import circleImg from '@/assets/step-community-circle.jpg';

const NORTH_POINT =
  'MyRhythm remembers, so I can follow through. My confidence returns, people can count on me again, and step by step I build the life I choose. And I never do it alone.';

const C = {
  ink: '#14161F', paper: '#FAF7F2', orange: '#F97316', purple: '#7C3AED',
  teal: '#0D9488', emerald: '#059669', muted: '#5B6070', line: 'rgba(20,22,31,0.08)',
};

type Slide = { title: string; dark?: boolean; notes: string; body: ReactNode };

const Kicker = ({ children, color = C.orange }: { children: ReactNode; color?: string }) => (
  <div style={{ fontSize: 24, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700, color }}>{children}</div>
);
const Title = ({ children, light }: { children: ReactNode; light?: boolean }) => (
  <h2 style={{ fontSize: 80, lineHeight: 1.05, letterSpacing: '-0.035em', fontWeight: 700, margin: '20px 0 0', color: light ? '#fff' : C.ink }}>{children}</h2>
);
const Card = ({ children, accent = C.orange, dark }: { children: ReactNode; accent?: string; dark?: boolean }) => (
  <div style={{
    borderRadius: 36, padding: '40px 44px', borderLeft: `10px solid ${accent}`,
    background: dark ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.85)',
    boxShadow: dark ? 'none' : '0 20px 50px rgba(20,22,31,0.08)', border: `1px solid ${dark ? 'rgba(255,255,255,0.12)' : C.line}`,
    borderLeftWidth: 10, borderLeftColor: accent,
  }}>{children}</div>
);
const CardHead = ({ children, dark }: { children: ReactNode; dark?: boolean }) => (
  <div style={{ fontSize: 38, fontWeight: 700, lineHeight: 1.15, color: dark ? '#fff' : C.ink }}>{children}</div>
);
const CardText = ({ children, dark }: { children: ReactNode; dark?: boolean }) => (
  <div style={{ fontSize: 30, lineHeight: 1.32, marginTop: 14, color: dark ? 'rgba(255,255,255,0.78)' : C.muted }}>{children}</div>
);

function Feature({ n, kicker, title, points, img, accent }: { n: number; kicker: string; title: string; points: string[]; img: string; accent: string }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 760px', height: '100%' }}>
      <div style={{ padding: '110px 90px 90px 120px', display: 'flex', flexDirection: 'column' }}>
        <Kicker color={accent}>MVP feature {n} · {kicker}</Kicker>
        <Title>{title}</Title>
        <ul style={{ listStyle: 'none', padding: 0, margin: '56px 0 0', display: 'grid', gap: 26 }}>
          {points.map((p) => (
            <li key={p} style={{ display: 'flex', gap: 24, fontSize: 34, lineHeight: 1.3, color: C.ink }}>
              <span style={{ flex: '0 0 18px', height: 18, marginTop: 14, borderRadius: 99, background: accent }} />{p}
            </li>
          ))}
        </ul>
      </div>
      <div style={{ padding: 40 }}>
        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 48 }} />
      </div>
    </div>
  );
}

const Pad = ({ children }: { children: ReactNode }) => (
  <div style={{ padding: '110px 120px', height: '100%', display: 'flex', flexDirection: 'column' }}>{children}</div>
);

const SLIDES: Slide[] = [
  {
    title: 'MyRhythm', dark: true,
    notes: 'Open slowly. This is not software, it is someone getting their life back.',
    body: (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 700px', height: '100%' }}>
        <div style={{ padding: '140px 100px 120px 120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Kicker>Memory-First Design™</Kicker>
          <h1 style={{ fontSize: 150, fontWeight: 800, letterSpacing: '-0.05em', margin: '24px 0 0', color: '#fff' }}>MyRhythm</h1>
          <p style={{ fontSize: 42, lineHeight: 1.3, color: 'rgba(255,255,255,0.85)', marginTop: 40, maxWidth: 960, fontStyle: 'italic' }}>"{NORTH_POINT}"</p>
        </div>
        <img src={heroImg} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    ),
  },
  {
    title: 'The problem',
    notes: 'Remembering is the problem, never failure. Name the feelings people carry.',
    body: (
      <Pad>
        <Kicker>The problem we solve</Kicker>
        <Title>When memory slips, what really slips is trust.</Title>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 36, marginTop: 80 }}>
          <Card accent={C.orange}><CardHead>Confidence knocked</CardHead><CardText>You start doubting your own head after an appointment blurs.</CardText></Card>
          <Card accent={C.purple}><CardHead>Feeling unreliable</CardHead><CardText>A missed call or school meeting, and people start checking up on you.</CardText></Card>
          <Card accent={C.teal}><CardHead>Feeling alone</CardHead><CardText>Life feels unfair, and the practical load falls on you or one carer.</CardText></Card>
        </div>
        <p style={{ fontSize: 34, color: C.muted, marginTop: 'auto' }}>This is about remembering, not failing.</p>
      </Pad>
    ),
  },
  {
    title: 'Three failures',
    notes: 'Medical care gets people medically stable. Nothing gets them life-ready.',
    body: (
      <Pad>
        <Kicker color={C.purple}>Why it happens</Kicker>
        <Title>Three gaps nobody owns.</Title>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 36, marginTop: 80 }}>
          <Card accent={C.orange}><CardHead>The Discharge Cliff</CardHead><CardText>Support drops away the day you leave hospital.</CardText></Card>
          <Card accent={C.purple}><CardHead>Clinical-Ready vs Life-Ready</CardHead><CardText>Medically stable is not the same as ready for work, family and commitments.</CardText></Card>
          <Card accent={C.teal}><CardHead>The Ideal-Brain Assumption</CardHead><CardText>Most tools assume a perfect memory and endless focus.</CardText></Card>
        </div>
      </Pad>
    ),
  },
  {
    title: 'Who it serves',
    notes: 'One loop, many lives. Start with brain injury, open to anyone who wants to follow through.',
    body: (
      <Pad>
        <Kicker color={C.teal}>Who it is for</Kicker>
        <Title>Anyone who wants to remember what matters and follow through.</Title>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 30, marginTop: 70 }}>
          {[
            ['Brain injury survivors', 'Rebuilding after hospital', C.orange],
            ['Caregivers', 'Carrying two people’s diaries', C.purple],
            ['Returning professionals', 'Back to work and meetings', C.teal],
            ['Stress and overwhelm', 'Too much held in one head', C.emerald],
            ['ADHD and focus', 'Good intentions, lost threads', C.orange],
            ['Memory changes', 'Staying independent for longer', C.purple],
          ].map(([h, t, a]) => <Card key={h} accent={a}><CardHead>{h}</CardHead><CardText>{t}</CardText></Card>)}
        </div>
      </Pad>
    ),
  },
  {
    title: 'The promise', dark: true,
    notes: 'A discreet personal and executive assistant at every appointment, meeting and family conversation.',
    body: (
      <Pad>
        <Kicker>The promise</Kicker>
        <div style={{ margin: 'auto 0', display: 'grid', gap: 18 }}>
          {['Captures it.', 'Plans it.', 'Keeps it.', 'Follows it through.'].map((l, i) => (
            <div key={l} style={{ fontSize: 110, fontWeight: 800, letterSpacing: '-0.04em', color: [C.orange, '#A78BFA', '#2DD4BF', '#34D399'][i] }}>{l}</div>
          ))}
          <div style={{ fontSize: 52, color: '#fff', marginTop: 30 }}>You stay in control.</div>
        </div>
      </Pad>
    ),
  },
  {
    title: 'Capture', notes: 'One tap on Home. Upload works too. Everyone is told they are being recorded.',
    body: <Feature n={1} kicker="Capture" accent={C.orange} img={recordImg} title="One tap to keep the conversation."
      points={['Record from Home with a single tap, or upload a recording or report', 'A calm reminder to let everyone know you are recording', 'Nothing records secretly, ever']} />,
  },
  {
    title: 'Confirm', notes: 'The most distinctive moment. Agreed, Guidance, Suggestions. Inferred steps never start ticked.',
    body: <Feature n={2} kicker="Confirm" accent={C.purple} img={confirmImg} title="A clear summary, then your choice."
      points={['Key summary in plain language', 'Next steps grouped: Agreed, Guidance, Suggestions', 'Nothing reaches the diary without your choice']} />,
  },
  {
    title: 'Commit', notes: 'Times come from the assessment: your best hours, never double-booked.',
    body: <Feature n={3} kicker="Commit" accent={C.teal} img={scheduleImg} title="Into your diary, at your best time."
      points={['Suggested times based on when you work best', 'Reminders attached the moment a step is added', 'All or nothing: added means reminded and traceable']} />,
  },
  {
    title: 'Follow through', notes: 'This is where other apps stop and MyRhythm keeps going, gently, until it is done.',
    body: (
      <Pad>
        <Kicker color={C.emerald}>MVP feature 4 · Follow through</Kicker>
        <Title>Stays with you until it is done.</Title>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28, marginTop: 80 }}>
          {[
            ['Get ready', 'A prompt before it starts', C.orange],
            ['Done, Snooze, Let go', 'Your call, one tap', C.purple],
            ['One gentle follow-up', 'Never nagging', C.teal],
            ['Still open at 18:00', 'Close the day settled', C.emerald],
          ].map(([h, t, a], i) => (
            <Card key={h} accent={a}><div style={{ fontSize: 26, color: C.muted, fontWeight: 700 }}>0{i + 1}</div><CardHead>{h}</CardHead><CardText>{t}</CardText></Card>
          ))}
        </div>
        <p style={{ fontSize: 34, color: C.ink, marginTop: 'auto' }}>Done closes the loop everywhere, with Undo always there.</p>
      </Pad>
    ),
  },
  {
    title: 'No one walks alone', notes: 'Support is visible but always in your hands. Private stays private. There is an off switch.',
    body: <Feature n={5} kicker="No one walks alone" accent={C.orange} img={circleImg} title="Loop in someone you trust."
      points={['Support Circle sharing is off until you choose', 'Levels: busy or free, see my day, help with my day', 'Private items always show as Busy']} />,
  },
  {
    title: 'MVP scope',
    notes: 'Be honest about what waits. The MVP is the full loop, end to end.',
    body: (
      <Pad>
        <Kicker>What makes the MVP</Kicker>
        <Title>The whole loop now. Extras later.</Title>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginTop: 70 }}>
          <Card accent={C.emerald}><CardHead>In the MVP</CardHead><CardText>Two-step sign-up · one-tap capture · summary and next steps · smart diary times · reminders to done · Support Circle · My Vision in ACTion</CardText></Card>
          <Card accent={C.purple}><CardHead>Coming next</CardHead><CardText>Smartwatch capture · discharge summary to life-ready plan · Bring a Witness co-listen · calendar sync</CardText></Card>
        </div>
      </Pad>
    ),
  },
  {
    title: 'Three lines', dark: true,
    notes: 'If the room drifts into features, bring them back with these.',
    body: (
      <Pad>
        <Kicker>Three lines to remember</Kicker>
        <div style={{ display: 'grid', gap: 32, marginTop: 60 }}>
          <Card dark accent={C.orange}><CardText dark>"We bridge the Discharge Cliff and the Clinical-to-Life Ready Gap. Medical care gets people medically stable, MyRhythm gets them life-ready and reliable again."</CardText></Card>
          <Card dark accent="#A78BFA"><CardText dark>"It's not another to-do list you abandon after three days. It's an end-to-end follow-through loop from the spoken word to a completed task."</CardText></Card>
          <Card dark accent="#2DD4BF"><CardText dark>"{NORTH_POINT}"</CardText></Card>
        </div>
      </Pad>
    ),
  },
  {
    title: 'Follow-through and dignity',
    notes: 'Speak from the heart. You know this problem better than anyone in the room.',
    body: (
      <Pad>
        <Kicker color={C.purple}>Why it matters</Kicker>
        <Title>Follow-through and dignity.</Title>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 36, marginTop: 70 }}>
          <Card accent={C.orange}><CardHead>Follow-through</CardHead><CardText>Where recovery turns into real life. Keeping a promise again.</CardText></Card>
          <Card accent={C.purple}><CardHead>Dignity is agency</CardHead><CardText>Leaving any room knowing you will do what you said.</CardText></Card>
          <Card accent={C.teal}><CardHead>Carers, back to family</CardHead><CardText>A partner or son again, not the person policing the diary.</CardText></Card>
        </div>
        <p style={{ fontSize: 36, color: C.ink, marginTop: 'auto', fontStyle: 'italic' }}>"Other apps record what was said. MyRhythm makes sure what was said actually happens."</p>
      </Pad>
    ),
  },
  {
    title: 'How people feel', dark: true,
    notes: 'Live demo now: open /launch/home and walk Home, Record, Diary, Support Circle.',
    body: (
      <Pad>
        <Kicker>How people feel</Kicker>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginTop: 60 }}>
          {['Reliable', 'Trustworthy', 'Confident', 'Independent', 'Following through'].map((w, i) => (
            <span key={w} style={{ fontSize: 44, fontWeight: 700, padding: '18px 40px', borderRadius: 99, color: '#fff', background: [C.orange, C.purple, C.teal, C.emerald, C.orange][i] }}>{w}</span>
          ))}
        </div>
        <p style={{ fontSize: 48, lineHeight: 1.3, color: '#fff', marginTop: 90, maxWidth: 1500, fontStyle: 'italic' }}>"{NORTH_POINT}"</p>
        <p style={{ fontSize: 26, color: 'rgba(255,255,255,0.55)', marginTop: 'auto' }}>MyRhythm does not diagnose or treat any condition.</p>
      </Pad>
    ),
  },
];

function Scaled({ slide, index }: { slide: Slide; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const ro = new ResizeObserver(() => setScale(Math.min(el.clientWidth / 1920, el.clientHeight / 1080)));
    ro.observe(el); return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <SlideFrame slide={slide} index={index} style={{ position: 'absolute', left: '50%', top: '50%', marginLeft: -960, marginTop: -540, transform: `scale(${scale})` }} />
    </div>
  );
}

function SlideFrame({ slide, index, style }: { slide: Slide; index: number; style?: React.CSSProperties }) {
  return (
    <div className="mvp-slide" style={{
      width: 1920, height: 1080, overflow: 'hidden', position: 'relative', fontFamily: 'inherit',
      background: slide.dark ? `radial-gradient(circle at 20% 10%, #2A2350, ${C.ink} 60%)` : C.paper, ...style,
    }}>
      {slide.body}
      <div style={{ position: 'absolute', right: 60, bottom: 40, fontSize: 20, color: slide.dark ? 'rgba(255,255,255,0.5)' : C.muted }}>
        MyRhythm · {index + 1} / {SLIDES.length}
      </div>
    </div>
  );
}

export default function MvpDeckPage() {
  const [params, setParams] = useSearchParams();
  const print = params.has('print');
  const raw = parseInt(params.get('slide') ?? '1', 10);
  const index = Number.isFinite(raw) ? Math.min(Math.max(raw - 1, 0), SLIDES.length - 1) : 0;
  const [notes, setNotes] = useState(false);
  const touchX = useRef<number | null>(null);

  const go = useCallback((i: number) => {
    const n = Math.min(Math.max(i, 0), SLIDES.length - 1);
    setParams((p) => { const q = new URLSearchParams(p); q.set('slide', String(n + 1)); return q; }, { replace: true });
  }, [setParams]);

  useEffect(() => { document.title = `${index + 1}/${SLIDES.length} · ${SLIDES[index].title}`; }, [index]);
  useEffect(() => {
    if (print) { const t = setTimeout(() => window.print(), 600); return () => clearTimeout(t); }
    const onKey = (e: KeyboardEvent) => {
      if (['ArrowRight', ' ', 'PageDown'].includes(e.key)) { e.preventDefault(); go(index + 1); }
      if (['ArrowLeft', 'PageUp'].includes(e.key)) go(index - 1);
      if (e.key === 'n') setNotes((v) => !v);
      if (e.key === 'f') document.documentElement.requestFullscreen?.();
    };
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  }, [go, index, print]);

  if (print) {
    return (
      <div>
        <style>{`@page { size: 1920px 1080px; margin: 0 } body { margin: 0 } .mvp-slide { break-after: page; page-break-after: always }`}</style>
        {SLIDES.map((s, i) => <SlideFrame key={s.title} slide={s} index={i} />)}
      </div>
    );
  }

  const slide = SLIDES[index];
  const btn = 'min-h-[48px] rounded-full px-5 text-sm font-medium bg-white/10 text-white hover:bg-white/20 disabled:opacity-30';
  return (
    <div className="fixed inset-0 flex flex-col bg-black"
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current; touchX.current = null;
        if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
      }}>
      <div className="flex-1 min-h-0"><Scaled slide={slide} index={index} /></div>
      {notes && <div className="px-6 py-3 text-white/85 text-base bg-white/5">{slide.notes}</div>}
      <div className="flex flex-wrap items-center justify-center gap-2 p-3">
        <button className={btn} onClick={() => go(index - 1)} disabled={index === 0}>Previous</button>
        <span className="text-white/70 text-sm px-2">{index + 1} / {SLIDES.length}</span>
        <button className={btn} onClick={() => go(index + 1)} disabled={index === SLIDES.length - 1}>Next</button>
        <button className={btn} onClick={() => setNotes((v) => !v)}>{notes ? 'Hide notes' : 'Notes'}</button>
        <button className={btn} onClick={() => document.documentElement.requestFullscreen?.()}>Present</button>
        <button className={btn} onClick={() => window.open('/mvp-deck?print', '_blank')}>Export PDF</button>
      </div>
    </div>
  );
}
