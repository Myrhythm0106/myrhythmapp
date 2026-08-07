import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

interface Person {
  email: string;
  name?: string;
}

interface Payload {
  eventId?: string;
  actionText: string;
  startDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  dueDate?: string;
  context?: string;
  invites?: Person[];
  watchers?: Person[];
}

function esc(s: string): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function icsEscape(s: string): string {
  return String(s ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function toUtcStamp(date: string, time: string, addMinutes = 0): string {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const dt = new Date(Date.UTC(y, (m || 1) - 1, d || 1, hh || 9, mm || 0));
  dt.setUTCMinutes(dt.getUTCMinutes() + addMinutes);
  return dt.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function buildIcs(p: Payload, organiser: string): string {
  const uid = `${crypto.randomUUID()}@myrhythmapp.com`;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//MyRhythm//Capture//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${toUtcStamp(p.startDate, p.startTime)}`,
    `DTSTART:${toUtcStamp(p.startDate, p.startTime)}`,
    `DTEND:${toUtcStamp(p.startDate, p.startTime, 30)}`,
    `SUMMARY:${icsEscape(p.actionText.slice(0, 120))}`,
    `DESCRIPTION:${icsEscape(p.context || "Shared from MyRhythm")}`,
    `ORGANIZER;CN=${icsEscape(organiser)}:mailto:noreply@myrhythmapp.com`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function shell(inner: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align:center;margin-bottom:24px;">
        <h1 style="color:#111;margin:0;font-size:22px;">MyRhythm</h1>
      </div>
      <div style="background:#f8f9fa;padding:20px;border-radius:10px;">${inner}</div>
      <p style="color:#999;font-size:12px;text-align:center;margin-top:24px;">
        Sent from MyRhythm. If you weren't expecting this, you can ignore it.
      </p>
    </div>`;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // --- Auth: validate the caller's JWT in code ---
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace("Bearer ", "").trim();
    if (!token) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
    );
    const { data: userData, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = (await req.json()) as Payload;
    if (!body?.actionText || !body?.startDate || !body?.startTime) {
      return new Response(
        JSON.stringify({ error: "actionText, startDate and startTime are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const invites = (body.invites || []).filter(p => p?.email);
    const watchers = (body.watchers || []).filter(p => p?.email);
    if (invites.length === 0 && watchers.length === 0) {
      return new Response(JSON.stringify({ sent: 0, failures: [] }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const organiser =
      (userData.user.user_metadata?.name as string) ||
      userData.user.email ||
      "Someone in MyRhythm";

    const when = `${body.startDate} at ${body.startTime}`;
    const ics = buildIcs(body, organiser);
    const icsBase64 = btoa(ics);

    const failures: { email: string; error: string }[] = [];
    let sent = 0;

    for (const person of invites) {
      try {
        const res = await resend.emails.send({
          from: "MyRhythm <noreply@myrhythmapp.com>",
          to: [person.email],
          subject: `${organiser} invited you: ${body.actionText.slice(0, 60)}`,
          html: shell(`
            <p style="margin:0 0 12px;"><strong>${esc(organiser)}</strong> has invited you to:</p>
            <p style="font-size:17px;font-weight:600;margin:0 0 12px;">${esc(body.actionText)}</p>
            <p style="margin:0 0 8px;"><strong>When:</strong> ${esc(when)}</p>
            ${body.dueDate ? `<p style="margin:0 0 8px;"><strong>Due by:</strong> ${esc(body.dueDate)}</p>` : ""}
            ${body.context ? `<p style="margin:12px 0 0;color:#555;">${esc(body.context)}</p>` : ""}
            <p style="margin:16px 0 0;color:#555;font-size:13px;">
              The attached calendar file will add this to your own calendar.
            </p>`),
          attachments: [
            { filename: "invitation.ics", content: icsBase64 },
          ],
        });
        if ((res as any)?.error) throw new Error((res as any).error.message || "Send failed");
        sent++;
      } catch (e: any) {
        console.error("invite send failed", person.email, e?.message);
        failures.push({ email: person.email, error: e?.message || "Send failed" });
      }
    }

    for (const person of watchers) {
      try {
        const res = await resend.emails.send({
          from: "MyRhythm <noreply@myrhythmapp.com>",
          to: [person.email],
          subject: `You're now following: ${body.actionText.slice(0, 60)}`,
          html: shell(`
            <p style="margin:0 0 12px;"><strong>${esc(organiser)}</strong> added you as a supporter for:</p>
            <p style="font-size:17px;font-weight:600;margin:0 0 12px;">${esc(body.actionText)}</p>
            <p style="margin:0 0 8px;"><strong>Planned for:</strong> ${esc(when)}</p>
            <p style="margin:16px 0 0;color:#555;font-size:13px;">
              You'll be able to see progress on this in your MyRhythm Support Circle view.
              No action is needed from you right now.
            </p>`),
        });
        if ((res as any)?.error) throw new Error((res as any).error.message || "Send failed");
        sent++;
      } catch (e: any) {
        console.error("watcher notice failed", person.email, e?.message);
        failures.push({ email: person.email, error: e?.message || "Send failed" });
      }
    }

    return new Response(JSON.stringify({ sent, failures }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("send-event-invitation error", error);
    return new Response(JSON.stringify({ error: error?.message || "Unexpected error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);
