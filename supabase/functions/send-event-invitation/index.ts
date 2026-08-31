import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { buildInviteIcs, toBase64 } from "../_shared/ics.ts";

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
  timeZone?: string;
  durationMinutes?: number;
  invites?: Person[];
  watchers?: Person[];
}

function esc(s: string): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
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

function rsvpButtons(base: string, token: string): string {
  const btn = (answer: string, label: string, bg: string) =>
    `<a href="${base}/functions/v1/rsvp-response?token=${encodeURIComponent(token)}&answer=${answer}"
        style="display:inline-block;padding:12px 20px;margin:0 6px 8px 0;border-radius:10px;
               background:${bg};color:#fff;text-decoration:none;font-weight:600;font-size:15px;">${label}</a>`;
  return `
    <p style="margin:18px 0 8px;color:#555;font-size:13px;">Can you make it?</p>
    <div>
      ${btn("accepted", "Yes", "#c2410c")}
      ${btn("maybe", "Maybe", "#6b7280")}
      ${btn("declined", "No", "#374151")}
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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabase = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!);
    const { data: userData, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const admin = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const body = (await req.json()) as Payload;
    if (!body?.actionText || !body?.startDate || !body?.startTime) {
      return new Response(
        JSON.stringify({ error: "actionText, startDate and startTime are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const invites = (body.invites || []).filter((p) => p?.email);
    const watchers = (body.watchers || []).filter((p) => p?.email);
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
    const organiserEmail = userData.user.email || "noreply@myrhythmapp.com";

    // --- Stable UID + version, so replies and updates match the same entry ---
    let uid = "";
    let sequence = 0;
    if (body.eventId) {
      const { data: ev } = await admin
        .from("calendar_events")
        .select("ics_uid, ics_sequence")
        .eq("id", body.eventId)
        .maybeSingle();
      uid = ev?.ics_uid || `${body.eventId}@myrhythmapp.com`;
      sequence = (ev?.ics_sequence ?? 0) + (ev?.ics_uid ? 1 : 0);
      await admin
        .from("calendar_events")
        .update({ ics_uid: uid, ics_sequence: sequence })
        .eq("id", body.eventId);
    } else {
      uid = `${crypto.randomUUID()}@myrhythmapp.com`;
    }

    // --- One-tap reply tokens, for clients without RSVP buttons ---
    const tokens = new Map<string, string>();
    if (body.eventId) {
      const { data: rows } = await admin
        .from("event_invitations")
        .select("id, invitee_email, response_token")
        .eq("event_id", body.eventId);
      for (const p of invites) {
        const row = (rows || []).find(
          (r: any) => (r.invitee_email || "").toLowerCase() === p.email.toLowerCase(),
        );
        if (row) {
          let t = row.response_token as string | null;
          if (!t) {
            t = crypto.randomUUID().replace(/-/g, "");
            await admin.from("event_invitations").update({ response_token: t }).eq("id", row.id);
          }
          tokens.set(p.email.toLowerCase(), t);
        } else {
          const t = crypto.randomUUID().replace(/-/g, "");
          const { error: insErr } = await admin.from("event_invitations").insert({
            event_id: body.eventId,
            invitee_email: p.email,
            invitee_name: p.name || null,
            inviter_id: userData.user.id,
            status: "pending",
            response_token: t,
          });
          if (!insErr) tokens.set(p.email.toLowerCase(), t);
        }
      }
    }

    const when = `${body.startDate} at ${body.startTime}`;
    const duration = body.durationMinutes && body.durationMinutes > 0 ? body.durationMinutes : 30;

    const failures: { email: string; error: string }[] = [];
    let sent = 0;

    for (const person of invites) {
      try {
        const ics = buildInviteIcs({
          uid,
          sequence,
          title: body.actionText,
          description: body.context,
          startDate: body.startDate,
          startTime: body.startTime,
          durationMinutes: duration,
          timeZone: body.timeZone,
          organiserName: organiser,
          organiserEmail,
          dueDate: body.dueDate,
          attendees: [{ email: person.email, name: person.name }],
        });
        const tok = tokens.get(person.email.toLowerCase());
        const res = await resend.emails.send({
          from: "MyRhythm <noreply@myrhythmapp.com>",
          replyTo: organiserEmail,
          to: [person.email],
          subject: `Invitation: ${body.actionText.slice(0, 60)} — ${when}`,
          html: shell(`
            <p style="margin:0 0 12px;"><strong>${esc(organiser)}</strong> has invited you to:</p>
            <p style="font-size:17px;font-weight:600;margin:0 0 12px;">${esc(body.actionText)}</p>
            <p style="margin:0 0 8px;"><strong>When:</strong> ${esc(when)}${
            body.timeZone ? ` (${esc(body.timeZone)})` : ""
          }</p>
            <p style="margin:0 0 8px;"><strong>How long:</strong> ${duration} minutes</p>
            ${body.dueDate ? `<p style="margin:0 0 8px;"><strong>Finish by:</strong> ${esc(body.dueDate)}</p>` : ""}
            ${body.context ? `<p style="margin:12px 0 0;color:#555;">${esc(body.context)}</p>` : ""}
            ${tok ? rsvpButtons(supabaseUrl, tok) : ""}
            <p style="margin:16px 0 0;color:#555;font-size:13px;">
              Your calendar should show Yes / No / Maybe on this invitation. Accepting adds it to
              your own Google, Outlook or Apple calendar.
            </p>`),
          attachments: [
            {
              filename: "invite.ics",
              content: toBase64(ics),
              contentType: 'text/calendar; charset=utf-8; method=REQUEST; name="invite.ics"',
            } as any,
          ],
          headers: { "Content-Class": "urn:content-classes:calendarmessage" },
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
