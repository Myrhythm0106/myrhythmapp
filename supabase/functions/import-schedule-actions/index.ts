// Extract actionable items from an uploaded schedule/report and stage them
// in extracted_actions so the existing PostExtractionDialog can review and
// push them to the user's MyRhythm calendar.
//
// Reuses the same downstream pipeline as voice-based Memory Bridge captures:
// one meeting_recordings parent row + one extracted_actions row per action.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const BodySchema = z.object({
  filePath: z.string().min(1).max(1024),
  fileName: z.string().min(1).max(255),
  mimeType: z.string().min(1).max(128),
});

const TEXT_MIME_PREFIXES = ["text/"];
const IMAGE_MIMES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
]);
const PDF_MIME = "application/pdf";
const DOCX_MIME =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(
      ...bytes.subarray(i, Math.min(i + chunk, bytes.length)),
    );
  }
  return btoa(binary);
}

const SYSTEM_PROMPT = `You are an assistant that reads a schedule, care plan, meeting note, or report and extracts actionable items the user should put on their calendar.

Return STRICT JSON of shape:
{ "actions": [
    {
      "title": string (max 120 chars, imperative, e.g. "Book physio review"),
      "description": string (1-2 sentences, why/context),
      "suggested_date": string | null (YYYY-MM-DD, based on any dates/relative timing in the document; leave null if unclear),
      "suggested_time": string | null (HH:MM 24h, only if the document specifies or strongly implies a time),
      "duration_minutes": number (default 30 if unclear),
      "category": "appointment" | "task" | "medication" | "follow_up" | "exercise" | "reminder" | "other",
      "priority_level": 1 | 2 | 3 (1 = high, 2 = normal, 3 = low),
      "source_quote": string (short verbatim snippet, max 160 chars)
    }
  ]
}

Rules:
- Only include actions the user must DO. Skip general information, disclaimers, and headers.
- Do not invent dates. If the document says "next week" or "in 6 weeks", leave suggested_date null and mention the phrase in description.
- Keep titles short and imperative.
- Return an empty array if no clear actions exist.
- Reply with JSON only. No prose, no code fences.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !SUPABASE_ANON_KEY) {
      return jsonResponse({ error: "Server misconfigured" }, 500);
    }
    if (!LOVABLE_API_KEY) {
      return jsonResponse({ error: "LOVABLE_API_KEY missing" }, 500);
    }

    // Auth
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.startsWith("Bearer ")) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }
    const token = authHeader.replace("Bearer ", "");
    const anon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data: claimsData, error: claimsErr } = await anon.auth.getClaims(
      token,
    );
    if (claimsErr || !claimsData?.claims?.sub) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }
    const userId = claimsData.claims.sub as string;

    // Validate body
    const raw = await req.json().catch(() => null);
    const parsed = BodySchema.safeParse(raw);
    if (!parsed.success) {
      return jsonResponse(
        { error: "Invalid request", details: parsed.error.flatten() },
        400,
      );
    }
    const { filePath, fileName, mimeType } = parsed.data;

    // File path must be scoped to the user's folder
    if (!filePath.startsWith(`${userId}/`)) {
      return jsonResponse({ error: "Forbidden path" }, 403);
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Download file from storage
    const { data: fileBlob, error: dlErr } = await supabase.storage
      .from("document-imports")
      .download(filePath);
    if (dlErr || !fileBlob) {
      console.error("Download failed", dlErr);
      return jsonResponse({ error: "Could not read uploaded file" }, 400);
    }

    // Build the multimodal user message based on type
    const userContent: Array<Record<string, unknown>> = [
      {
        type: "text",
        text:
          `Document filename: ${fileName}\n\nExtract every calendar-worthy action from this document. Reply with JSON only.`,
      },
    ];

    const lowerMime = mimeType.toLowerCase();
    if (TEXT_MIME_PREFIXES.some((p) => lowerMime.startsWith(p))) {
      const text = (await fileBlob.text()).slice(0, 40000);
      if (!text.trim()) {
        return jsonResponse({ error: "Document is empty" }, 400);
      }
      userContent.push({ type: "text", text: `Document content:\n${text}` });
    } else if (IMAGE_MIMES.has(lowerMime)) {
      const bytes = new Uint8Array(await fileBlob.arrayBuffer());
      const b64 = bytesToBase64(bytes);
      userContent.push({
        type: "image_url",
        image_url: { url: `data:${lowerMime};base64,${b64}` },
      });
    } else if (lowerMime === PDF_MIME) {
      const bytes = new Uint8Array(await fileBlob.arrayBuffer());
      const b64 = bytesToBase64(bytes);
      userContent.push({
        type: "file",
        file: {
          filename: fileName,
          file_data: `data:${PDF_MIME};base64,${b64}`,
        },
      });
    } else if (lowerMime === DOCX_MIME || fileName.toLowerCase().endsWith(".docx")) {
      try {
        const mammoth = await import("npm:mammoth@1.7.2");
        const bytes = new Uint8Array(await fileBlob.arrayBuffer());
        const { value: text } = await mammoth.extractRawText({
          buffer: bytes as unknown as Buffer,
        });
        if (!text || !text.trim()) {
          return jsonResponse({ error: "Could not read DOCX content" }, 400);
        }
        userContent.push({
          type: "text",
          text: `Document content:\n${text.slice(0, 40000)}`,
        });
      } catch (err) {
        console.error("DOCX parse failed", err);
        return jsonResponse(
          { error: "Could not parse DOCX. Try PDF or plain text." },
          400,
        );
      }
    } else {
      return jsonResponse(
        {
          error:
            `Unsupported file type: ${mimeType}. Upload PDF, DOCX, an image, or plain text.`,
        },
        400,
      );
    }

    // Call Lovable AI Gateway
    const aiRes = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userContent },
          ],
          response_format: { type: "json_object" },
        }),
      },
    );

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error("AI gateway failed", aiRes.status, errText);
      if (aiRes.status === 429) {
        return jsonResponse(
          { error: "Rate limit reached. Please try again shortly." },
          429,
        );
      }
      if (aiRes.status === 402) {
        return jsonResponse(
          {
            error:
              "AI credits exhausted for this workspace. Please top up to continue.",
          },
          402,
        );
      }
      return jsonResponse(
        { error: "AI extraction failed", details: errText },
        502,
      );
    }

    const aiJson = await aiRes.json();
    const content = aiJson?.choices?.[0]?.message?.content ?? "{}";
    let parsedActions: Array<Record<string, unknown>> = [];
    try {
      const obj = JSON.parse(content);
      if (Array.isArray(obj?.actions)) parsedActions = obj.actions;
    } catch {
      parsedActions = [];
    }

    // Create parent meeting_recordings row
    const { data: meetingRow, error: mrErr } = await supabase
      .from("meeting_recordings")
      .insert({
        user_id: userId,
        meeting_title: fileName,
        meeting_type: "document_import",
        is_active: false,
        started_at: new Date().toISOString(),
        ended_at: new Date().toISOString(),
        processing_status: "completed",
        processing_completed_at: new Date().toISOString(),
        participants: [],
        transcript: null,
      })
      .select("id")
      .single();

    if (mrErr || !meetingRow) {
      console.error("meeting_recordings insert failed", mrErr);
      return jsonResponse({ error: "Could not create import record" }, 500);
    }

    // Fetch the user's existing events in the suggested-date window so we can
    // avoid dropping actions onto times that already have something booked.
    const uniqueDates = Array.from(
      new Set(
        parsedActions
          .map((a) => String(a.suggested_date ?? "").trim())
          .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)),
      ),
    );

    const busyByDate: Record<string, Set<string>> = {};
    if (uniqueDates.length) {
      const { data: existing } = await supabase
        .from("calendar_events")
        .select("date, time")
        .eq("user_id", userId)
        .in("date", uniqueDates);
      for (const row of existing ?? []) {
        const d = String((row as any).date);
        const t = String((row as any).time ?? "").slice(0, 5);
        if (!busyByDate[d]) busyByDate[d] = new Set();
        if (t) busyByDate[d].add(t);
      }
    }

    function nextFreeSlot(date: string, startTime: string): string {
      const busy = busyByDate[date];
      if (!busy) return startTime;
      // Walk in 30-minute steps until we find a free slot within 09:00-18:00
      let [h, m] = startTime.split(":").map(Number);
      if (Number.isNaN(h)) return startTime;
      for (let i = 0; i < 20; i++) {
        const t = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
        if (!busy.has(t)) {
          if (!busyByDate[date]) busyByDate[date] = new Set();
          busyByDate[date].add(t);
          return t;
        }
        m += 30;
        if (m >= 60) {
          m -= 60;
          h += 1;
        }
        if (h >= 18) break;
      }
      return startTime;
    }

    const rows = parsedActions
      .map((a) => {
        const title = String(a.title ?? "").trim().slice(0, 200);
        if (!title) return null;
        const description = String(a.description ?? "").trim().slice(0, 1000);
        const rawDate = String(a.suggested_date ?? "").trim();
        const proposed_date = /^\d{4}-\d{2}-\d{2}$/.test(rawDate)
          ? rawDate
          : null;
        const rawTime = String(a.suggested_time ?? "").trim();
        let proposed_time = /^\d{2}:\d{2}$/.test(rawTime) ? rawTime : null;
        if (proposed_date && proposed_time) {
          proposed_time = nextFreeSlot(proposed_date, proposed_time);
        } else if (proposed_date && !proposed_time) {
          // Default to 10:00 and let collision-avoid shift as needed
          proposed_time = nextFreeSlot(proposed_date, "10:00");
        }
        const duration = Number.isFinite(a.duration_minutes)
          ? Math.max(5, Math.min(240, Number(a.duration_minutes)))
          : 30;
        const category = [
          "appointment",
          "task",
          "medication",
          "follow_up",
          "exercise",
          "reminder",
          "other",
        ].includes(String(a.category)) ? String(a.category) : "task";
        const priority = [1, 2, 3].includes(Number(a.priority_level))
          ? Number(a.priority_level)
          : 2;
        const sourceQuote = String(a.source_quote ?? "").trim().slice(0, 500);

        return {
          user_id: userId,
          meeting_recording_id: meetingRow.id,
          action_text: title,
          what_outcome: title,
          category,
          action_type: "commitment",
          status: "not_started",
          source_type: "document",
          proposed_date,
          proposed_time,
          start_date: proposed_date,
          assigned_to: "me",
          owner: "me",
          created_by: userId,
          priority_level: priority,
          confidence_score: 0.7,
          user_notes: description || null,
          due_context: sourceQuote || null,
          extraction_method: "document_import",
          detail_level: "standard",
          calendar_checked: false,
          support_circle_notified: false,
          how_steps: [],
          micro_tasks: [],
          potential_barriers: [],
          alternative_phrasings: [],
          next_natural_steps: [],
          // duration is not a first-class column on extracted_actions; keep in notes.
          motivation_statement: duration
            ? `Suggested duration: ${duration} minutes`
            : null,
        };
      })
      .filter(Boolean);

    if (rows.length) {
      const { error: insErr } = await supabase
        .from("extracted_actions")
        .insert(rows as any[]);
      if (insErr) {
        console.error("extracted_actions insert failed", insErr);
        return jsonResponse(
          { error: "Could not save extracted actions", details: insErr.message },
          500,
        );
      }
    }

    // NOTE: we intentionally DO NOT delete the uploaded file here.
    // The client deletes it after the user reviews & approves the extracted
    // actions, so they can re-check the source if extraction looks off.
    // A 30-day retention policy on the bucket sweeps any orphans.

    return jsonResponse({
      success: true,
      meetingId: meetingRow.id,
      actionsCount: rows.length,
      title: fileName,
      filePath, // returned so client can delete it after user approves
    });
      success: true,
      meetingId: meetingRow.id,
      actionsCount: rows.length,
      title: fileName,
    });
  } catch (err) {
    console.error("import-schedule-actions error", err);
    return jsonResponse(
      { error: err instanceof Error ? err.message : "Unknown error" },
      500,
    );
  }
});
