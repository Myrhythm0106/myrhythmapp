import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";
import { parseIcsReply } from "../_shared/ics.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const VALID = new Set(["accepted", "declined", "maybe"]);

function page(title: string, message: string): Response {
  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <title>${title}</title></head>
      <body style="font-family:-apple-system,Segoe UI,Arial,sans-serif;background:#faf8f4;margin:0;padding:48px 20px;">
        <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:16px;padding:32px;text-align:center;">
          <h1 style="font-size:20px;color:#111;margin:0 0 12px;">${title}</h1>
          <p style="font-size:16px;color:#444;line-height:1.6;margin:0;">${message}</p>
          <p style="font-size:13px;color:#999;margin-top:28px;">MyRhythm</p>
        </div>
      </body></html>`,
    { status: 200, headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" } },
  );
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    // --- One-tap link from the invitation email ---
    if (req.method === "GET") {
      const url = new URL(req.url);
      const token = (url.searchParams.get("token") || "").trim();
      const answer = (url.searchParams.get("answer") || "").trim().toLowerCase();
      if (!token || !VALID.has(answer)) {
        return page("That link didn't work", "Please use the Yes / No / Maybe buttons in the email.");
      }

      const { data: row } = await admin
        .from("event_invitations")
        .select("id, invitee_name, event_id")
        .eq("response_token", token)
        .maybeSingle();

      if (!row) {
        return page("That link has expired", "Ask the person who invited you to send it again.");
      }

      await admin
        .from("event_invitations")
        .update({ status: answer, responded_at: new Date().toISOString(), response_date: new Date().toISOString() })
        .eq("id", row.id);

      const { data: ev } = await admin
        .from("calendar_events")
        .select("title, date, time")
        .eq("id", row.event_id)
        .maybeSingle();

      const what = ev?.title ? `<strong>${ev.title}</strong>` : "this";
      const when = ev?.date ? ` on ${ev.date}${ev.time ? ` at ${String(ev.time).slice(0, 5)}` : ""}` : "";

      if (answer === "accepted") {
        return page("Thank you — you're in", `You said yes to ${what}${when}. It's in the organiser's plan, and the calendar file in the email adds it to yours.`);
      }
      if (answer === "declined") {
        return page("Thank you for letting us know", `You said no to ${what}${when}. The organiser has been told.`);
      }
      return page("Thank you", `You said maybe to ${what}${when}. The organiser has been told.`);
    }

    // --- Inbound calendar reply (METHOD:REPLY) forwarded from the mailbox ---
    if (req.method === "POST") {
      const contentType = req.headers.get("content-type") || "";
      let icsBody = "";
      if (contentType.includes("application/json")) {
        const json = await req.json();
        icsBody = json?.ics || json?.text || json?.body || "";
      } else {
        icsBody = await req.text();
      }

      const reply = parseIcsReply(icsBody);
      if (!reply.uid || !reply.email || !reply.status) {
        return new Response(JSON.stringify({ ok: false, error: "Could not read the reply" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: ev } = await admin
        .from("calendar_events")
        .select("id")
        .eq("ics_uid", reply.uid)
        .maybeSingle();
      if (!ev) {
        return new Response(JSON.stringify({ ok: false, error: "Unknown event" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { error } = await admin
        .from("event_invitations")
        .update({
          status: reply.status,
          responded_at: new Date().toISOString(),
          response_date: new Date().toISOString(),
        })
        .eq("event_id", ev.id)
        .ilike("invitee_email", reply.email);
      if (error) throw error;

      return new Response(JSON.stringify({ ok: true, status: reply.status }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  } catch (e: any) {
    console.error("rsvp-response error", e);
    return new Response(JSON.stringify({ error: e?.message || "Unexpected error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
