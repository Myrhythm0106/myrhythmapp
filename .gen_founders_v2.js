const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, PageOrientation, LevelFormat,
  HeadingLevel, BorderStyle, WidthType, ShadingType, PageNumber, PageBreak,
} = require('docx');

const ORANGE = "EA580C";
const TEAL = "0F766E";
const GREY = "475569";
const LIGHT = "FFF7ED";
const TEAL_LIGHT = "CCFBF1";

const CONFIDENTIAL = "MyRhythm Founders Edition v0.1 — Confidential. Do not distribute without written permission. © MyRhythm 2026.";

function p(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120 },
    ...opts,
    children: [new TextRun({ text, ...(opts.run || {}) })],
  });
}
function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 320, after: 160 },
    children: [new TextRun({ text, bold: true, size: 36, color: ORANGE, font: "Arial" })],
  });
}
function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, bold: true, size: 28, color: TEAL, font: "Arial" })],
  });
}
function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text, bold: true, size: 24, color: GREY, font: "Arial" })],
  });
}
function bullet(text, level = 0) {
  return new Paragraph({
    numbering: { reference: "bullets", level },
    spacing: { after: 80 },
    children: [new TextRun({ text, font: "Arial", size: 22 })],
  });
}
function bulletRich(runs, level = 0) {
  return new Paragraph({
    numbering: { reference: "bullets", level },
    spacing: { after: 80 },
    children: runs.map(r => new TextRun({ font: "Arial", size: 22, ...r })),
  });
}
function body(text) {
  return new Paragraph({
    spacing: { after: 140 },
    children: [new TextRun({ text, font: "Arial", size: 22 })],
  });
}
function callout(text, color = ORANGE, fill = LIGHT) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [new TableRow({ children: [new TableCell({
      width: { size: 9360, type: WidthType.DXA },
      shading: { fill, type: ShadingType.CLEAR },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 4, color },
        bottom: { style: BorderStyle.SINGLE, size: 4, color },
        left: { style: BorderStyle.SINGLE, size: 16, color },
        right: { style: BorderStyle.SINGLE, size: 4, color },
      },
      margins: { top: 160, bottom: 160, left: 200, right: 200 },
      children: [new Paragraph({ children: [new TextRun({ text, font: "Arial", size: 22, bold: true, color: GREY })] })],
    })] })],
  });
}

function tableCell(text, opts = {}) {
  const { bold = false, fill, color = "1F2937", width } = opts;
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    shading: fill ? { fill, type: ShadingType.CLEAR } : undefined,
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: "CBD5E1" },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: "CBD5E1" },
      left: { style: BorderStyle.SINGLE, size: 4, color: "CBD5E1" },
      right: { style: BorderStyle.SINGLE, size: 4, color: "CBD5E1" },
    },
    margins: { top: 120, bottom: 120, left: 140, right: 140 },
    children: text.split("\n").map(line => new Paragraph({
      spacing: { after: 60 },
      children: [new TextRun({ text: line, font: "Arial", size: 20, bold, color })],
    })),
  });
}

// Shared content blocks
function levelMatrix() {
  const widths = [1400, 2400, 3000, 2560]; // sum 9360
  const header = new TableRow({
    tableHeader: true,
    children: [
      tableCell("Level", { bold: true, fill: ORANGE, color: "FFFFFF", width: widths[0] }),
      tableCell("Who it's for", { bold: true, fill: ORANGE, color: "FFFFFF", width: widths[1] }),
      tableCell("Features they maximise", { bold: true, fill: ORANGE, color: "FFFFFF", width: widths[2] }),
      tableCell("Benefit", { bold: true, fill: ORANGE, color: "FFFFFF", width: widths[3] }),
    ],
  });
  const rows = [
    ["Basic",
      "Just discharged or early recovery. Caregiver-supported. Low cognitive load.",
      "Energy Check-in, Daily Action card, Smart Schedule (auto-suggested), Voice Capture, Support Circle view.",
      "Reduce overwhelm. One decision per moment. Never miss a medication, appointment or commitment."],
    ["Intermediate",
      "Two to six weeks in. Building a trusted routine. Caregiver in the loop, not in the driver's seat.",
      "Full 4C loop (Capture → Commit → Calibrate → Celebrate), Memory Bridge, Support Circle invites, Vision Board (1 pillar), Weekly Review.",
      "Build a routine you trust. Loop family in without burdening them. See weekly wins, not weekly failures."],
    ["Advanced",
      "Two months and beyond. Self-directed. Often mentoring others or coordinating clinicians.",
      "Full 5-pillar Vision Board, Goals → Priorities → Actions traceability, Calendar sync (Google / Outlook), Continuity Rail re-entry, Clinician export, Founder Feedback loop.",
      "Run your life as a system. Export evidence to clinicians. Coach the next Founder."],
  ].map((r, i) => new TableRow({ children: [
    tableCell(r[0], { bold: true, fill: i % 2 ? "FFFFFF" : "FFF7ED", width: widths[0], color: ORANGE }),
    tableCell(r[1], { fill: i % 2 ? "FFFFFF" : "FFF7ED", width: widths[1] }),
    tableCell(r[2], { fill: i % 2 ? "FFFFFF" : "FFF7ED", width: widths[2] }),
    tableCell(r[3], { fill: i % 2 ? "FFFFFF" : "FFF7ED", width: widths[3] }),
  ] }));
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: widths,
    rows: [header, ...rows],
  });
}

function milestonesBlock() {
  return [
    h3("What you'll know how to do"),
    body("Each milestone is cumulative — by Month 3 you can do everything from Hour 1 onwards, faster and with less effort."),
    bulletRich([{ text: "After 1 hour — ", bold: true, color: ORANGE }, { text: "Log your first Energy Check, accept one Smart Schedule suggestion, and record one Voice Capture." }]),
    bulletRich([{ text: "After 1 day — ", bold: true, color: ORANGE }, { text: "Complete the 4C loop once (Capture → Commit → Calibrate → Celebrate). Review tomorrow's schedule before sleep." }]),
    bulletRich([{ text: "After 1 week — ", bold: true, color: ORANGE }, { text: "Invite one Support Circle member, set one Vision pillar, and complete your first Weekly Review." }]),
    bulletRich([{ text: "After 1 month — ", bold: true, color: ORANGE }, { text: "Full 5-pillar Vision board live, Goals → Priorities → Actions traced end-to-end, Calendar sync active, first Founder Feedback submitted." }]),
    bulletRich([{ text: "After 3 months — ", bold: true, color: ORANGE }, { text: "Self-directed Memory Bridge mastery. Clinician export ready on demand. Mentoring a new Founder through their first week." }]),
  ];
}

function retentionWarnings(verbose = false) {
  const out = [
    h3("Recording retention & deletion warnings"),
    body("Voice recordings are kept for 30 days on the free Founders tier (storage cost management). Transcripts and extracted ACTs are kept forever — only the audio is removed. You will receive escalating warnings before deletion:"),
    bulletRich([{ text: "Day 5 of retention — ", bold: true, color: TEAL }, { text: "Friendly heads-up: \"Your recording has been saved.\"" }]),
    bulletRich([{ text: "Day 25 (5 days before deletion) — ", bold: true, color: ORANGE }, { text: "Amber banner + email: extract anything you want to keep." }]),
    bulletRich([{ text: "Day 27 (3 days before deletion) — ", bold: true, color: ORANGE }, { text: "Escalated amber banner, in-app + email." }]),
    bulletRich([{ text: "Day 28 (2 days before deletion) — ", bold: true, color: "B91C1C" }, { text: "Red banner, push notification + email — urgent." }]),
    bulletRich([{ text: "Day 29 (1 day before deletion) — ", bold: true, color: "B91C1C" }, { text: "Final red banner, push + email: \"Deleting tomorrow.\"" }]),
    bulletRich([{ text: "Day 30 — ", bold: true, color: GREY }, { text: "Audio permanently deleted. Transcript and any extracted ACTs remain in your library." }]),
    callout("Tap Save Forever (Taste & See tier) on any warning banner to preserve the recording. One tap, no re-upload."),
  ];
  if (verbose) {
    out.push(body("Reminders are sent through the same channel you use for other MyRhythm alerts (in-app banner, push, email). If you've muted notifications, only the in-app banner appears — check Settings → Notifications if you want push/email back on."));
  }
  return out;
}

// Doc shell
const sharedNumbering = {
  config: [{
    reference: "bullets",
    levels: [
      { level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
      { level: 1, format: LevelFormat.BULLET, text: "◦", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 1440, hanging: 360 } } } },
    ],
  }],
};

const sharedStyles = {
  default: { document: { run: { font: "Arial", size: 22 } } },
  paragraphStyles: [
    { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
      run: { size: 36, bold: true, font: "Arial", color: ORANGE },
      paragraph: { spacing: { before: 320, after: 160 }, outlineLevel: 0 } },
    { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
      run: { size: 28, bold: true, font: "Arial", color: TEAL },
      paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 } },
    { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
      run: { size: 24, bold: true, font: "Arial", color: GREY },
      paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 } },
  ],
};

function footer() {
  return new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: CONFIDENTIAL, font: "Arial", size: 6, color: "94A3B8" })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: "Page ", font: "Arial", size: 16, color: "94A3B8" }),
          new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 16, color: "94A3B8" }),
        ],
      }),
    ],
  });
}

function cover(title, subtitle, edition) {
  return [
    new Paragraph({ spacing: { before: 2400 } }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 },
      children: [new TextRun({ text: "MyRhythm", bold: true, size: 64, color: ORANGE, font: "Arial" })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 },
      children: [new TextRun({ text: title, bold: true, size: 48, color: GREY, font: "Arial" })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 },
      children: [new TextRun({ text: subtitle, size: 28, color: TEAL, font: "Arial", italics: true })] }),
    new Paragraph({ alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: edition, size: 22, color: GREY, font: "Arial" })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200 },
      children: [new TextRun({ text: "Founders Edition v0.2 · 23 June 2026", size: 20, color: GREY, font: "Arial" })] }),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

// ===== QUICK START =====
function quickStart() {
  const children = [
    ...cover("Quick Start", "From discharge to mastery, on your terms.", "For Founders, Investors & Sales partners"),

    h1("Welcome, Founder"),
    body("This Quick Start gets you moving in 60 minutes and shows you exactly where you'll be after 1 hour, 1 day, 1 week, 1 month and 3 months. It also doubles as the at-a-glance brief we share with investors and sales partners — same product, three depths of use."),
    callout("MyRhythm does not diagnose, treat or fix any medical condition. It helps you build a rhythm that holds when your brain doesn't."),

    h1("The three Founder levels"),
    body("Pick the level that sounds like you today. You will graduate — most Founders move from Basic to Intermediate inside 3 weeks."),
    levelMatrix(),
    body(""),
    callout("Investor & sales note: the level matrix is also our expansion story. Average Founder LTV roughly doubles between Basic and Intermediate and doubles again at Advanced as Vision, Calendar sync and Clinician export come online.", TEAL, TEAL_LIGHT),

    h1("Your first 60 minutes"),
    bullet("Open the app, complete the Energy Check (8 questions, ~3 minutes)."),
    bullet("Accept one Smart Schedule suggestion for today."),
    bullet("Record one Voice Capture — a meeting, a thought, or tomorrow's plan."),
    bullet("Tap the Daily Action card and complete it (one tap = win)."),
    bullet("Bookmark /launch on your home screen."),

    h1("Milestones"),
    ...milestonesBlock(),

    h1("Where to go next"),
    body("Open the MyRhythm User Manual (Founders Edition v0.2) for the full walkthrough of every feature, the 4C loop, the Bridge Pathway and the retention policy."),
  ];

  return new Document({
    creator: "MyRhythm", title: "MyRhythm Quick Start — Founders Edition v2",
    styles: sharedStyles, numbering: sharedNumbering,
    sections: [{
      properties: { page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1080, right: 1440, bottom: 1080, left: 1440 },
      } },
      footers: { default: footer() },
      children,
    }],
  });
}

// ===== USER MANUAL =====
function userManual() {
  const children = [
    ...cover("User Manual", "Bridge the Discharge Cliff. Close the Clinical-Ready vs Life-Ready gap.", "Founders Edition — Comprehensive Guide"),

    h1("How to use this manual"),
    body("This manual is the long companion to the Quick Start. Read it section by section, or jump to the feature you need. Every chapter ends with a \"You'll know how to…\" checklist tied to the time-based milestones in the Quick Start."),
    callout("MyRhythm does not diagnose, treat or fix any medical condition. We help you build a rhythm that holds when your brain doesn't. Anything clinical stays with your clinician."),

    h1("The three Founder levels"),
    body("MyRhythm grows with you. The same app powers a just-discharged Founder using only the Daily Action card, and an Advanced Founder running their week through Vision, Goals and Calendar sync."),
    levelMatrix(),
    body(""),
    h3("Why this matters for investors and partners"),
    bullet("Basic onboards anyone in under 10 minutes — that's our acquisition surface."),
    bullet("Intermediate is where habit forms — that's where retention and referrals come from."),
    bullet("Advanced is where clinical export, calendar sync and mentoring unlock professional and provider revenue."),

    h1("Time-based competency milestones"),
    body("This is the same ladder shown in the Quick Start, expanded with the underlying features and what \"good\" looks like at each step."),
    ...milestonesBlock(),
    h3("After 1 hour — in detail"),
    bullet("Energy Check completed — your baseline is now stored and feeds Smart Schedule."),
    bullet("One Smart Schedule slot accepted — orange tick on the card."),
    bullet("One Voice Capture recorded — appears in Capture inbox with auto-transcript."),
    h3("After 1 day — in detail"),
    bullet("Full 4C loop run once: Capture (voice or text) → Commit (turn into ACT) → Calibrate (adjust energy/time) → Celebrate (tap done)."),
    bullet("Tomorrow's Smart Schedule reviewed and confirmed."),
    h3("After 1 week — in detail"),
    bullet("One Support Circle member invited (Contact List + Support Circle are distinct — Support Circle members can see and respond to needs)."),
    bullet("One Vision pillar set — Health, Family, Work, Play, or Growth."),
    bullet("Weekly Review completed — celebrate wins, recalibrate next week."),
    h3("After 1 month — in detail"),
    bullet("All 5 Vision pillars active, with at least one Goal under each."),
    bullet("Goals → Priorities → Actions chain visible in the Traceability breadcrumb."),
    bullet("Google or Outlook Calendar synced — your MyRhythm schedule flows both ways."),
    bullet("First Founder Feedback submitted — your voice shapes v0.2."),
    h3("After 3 months — in detail"),
    bullet("Memory Bridge runs without prompts — you capture, commit, calibrate and celebrate on muscle memory."),
    bullet("Clinician export generated and shared at least once."),
    bullet("You're mentoring at least one new Founder through their first week."),

    h1("C1 — Capture"),
    body("Capture is step one of the 4C loop. The goal: nothing important stays trapped in your head. Voice, text, or photo — capture it, then let MyRhythm turn it into a Commitment."),

    h2("Voice capture"),
    bullet("Tap the mic on any screen. Speak naturally — meetings, thoughts, tomorrow's plan."),
    bullet("Recording stops automatically after silence, or tap to stop."),
    bullet("AssemblyAI transcribes and the extract-acts pipeline pulls out ACTs (Actions, Commitments, Tasks)."),
    bullet("Edit the title in Capture Title Editor before committing."),

    h2("Text & photo capture"),
    bullet("Type into the Capture inbox, or snap a photo of a whiteboard, prescription label or worksheet."),
    bullet("Photos are stored alongside the capture — useful evidence for clinician export later."),

    ...retentionWarnings(true),

    h3("You'll know how to…"),
    bullet("Record, transcribe and commit a voice note (After 1 hour)."),
    bullet("Recognise each retention warning and act on it (Day 25, 27, 28, 29)."),
    bullet("Save a recording forever before deletion (one tap)."),

    h1("C2 — Commit"),
    body("Commit converts a capture into an ACT (Action, Commitment, Task) with an owner, an energy band and a Smart Schedule slot. The Smart Schedule card auto-suggests invitees from your Support Circle when relevant."),

    h1("C3 — Calibrate"),
    body("Calibrate is the honest middle. Adjust energy, move slots, or hand an ACT to a Support Circle member. The Continuity Rail catches re-entries — if you drop off for two days, MyRhythm summarises what you missed and offers a soft restart."),

    h1("C4 — Celebrate"),
    body("Every completed ACT triggers a Victory tap. Weekly Review aggregates wins so you never end the week thinking \"I did nothing\" when you actually did a lot."),

    h1("Cognitive Continuity (the operating layer)"),
    body("The 4C loop runs on a Cognitive Continuity layer — Stage Lens, Persona Switch, Continuity Thread, and the Reentry Detector. This is what keeps the experience coherent across good days, bad days and recovery setbacks. It is not a fifth C."),

    h1("Vision, Goals, Priorities, Actions"),
    body("Traceability flows top-down. A Vision pillar contains Goals; Goals contain Priorities; Priorities generate Actions that land on the Smart Schedule. The breadcrumb at the top of every Action shows exactly where it came from."),

    h1("Support Circle & Contact List"),
    bullet("Contact List = everyone you might invite to an event or send a message to."),
    bullet("Support Circle = the trusted few who get visibility of your needs and can respond."),
    bullet("Smart Schedule fuzzy-matches names you speak against both lists when auto-suggesting invitees."),

    h1("Calendar sync"),
    bullet("Settings → External Integrations → Google Calendar or Outlook."),
    bullet("Sync is bi-directional. MyRhythm events appear in your calendar; calendar events appear on your Smart Schedule with energy badges suggested."),

    h1("Clinician export"),
    body("Settings → Export → Clinician PDF. Bundles your captures, ACTs, energy history and Weekly Reviews into a clinician-friendly PDF with the standard MyRhythm footer."),

    h1("Founders feedback loop"),
    body("Every screen has the EditionBadge. Tap it to leave feedback against that exact view — feedback lands in the founding_feedback table and is reviewed weekly before each v0.2 release candidate."),

    h1("Where to go next"),
    bullet("Quick Start (Founders Edition v0.2) — the 60-minute version."),
    bullet("Bridge Pathway brief — how MyRhythm sits between ward and life."),
    bullet("Founders Feedback — tap any EditionBadge."),
  ];

  return new Document({
    creator: "MyRhythm", title: "MyRhythm User Manual — Founders Edition v2",
    styles: sharedStyles, numbering: sharedNumbering,
    sections: [{
      properties: { page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1080, right: 1440, bottom: 1080, left: 1440 },
      } },
      footers: { default: footer() },
      children,
    }],
  });
}

(async () => {
  const qs = quickStart();
  const um = userManual();
  fs.writeFileSync("/mnt/documents/MyRhythm_QuickStart_FoundersEdition_v2.docx", await Packer.toBuffer(qs));
  fs.writeFileSync("/mnt/documents/MyRhythm_UserManual_FoundersEdition_v2.docx", await Packer.toBuffer(um));
  console.log("Wrote both v2 DOCX files");
})();
