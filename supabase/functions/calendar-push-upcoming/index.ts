import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const GOOGLE_CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID");
const GOOGLE_CLIENT_SECRET = Deno.env.get("GOOGLE_CLIENT_SECRET");
const OUTLOOK_CLIENT_ID = Deno.env.get("OUTLOOK_CLIENT_ID");
const OUTLOOK_CLIENT_SECRET = Deno.env.get("OUTLOOK_CLIENT_SECRET");

function isoFor(date: string, time: string | null, minutes = 30): { start: string; end: string } {
  const t = (time ?? "09:00").slice(0, 5);
  const start = new Date(`${date}T${t}:00`);
  const end = new Date(start.getTime() + minutes * 60_000);
  return { start: start.toISOString(), end: end.toISOString() };
}

async function refreshIfNeeded(
  supabase: any,
  integration: any,
  tokenData: any,
  provider: "google" | "outlook",
) {
  const expiresAt = tokenData.token_expires_at ? new Date(tokenData.token_expires_at) : new Date(0);
  if (expiresAt > new Date()) return tokenData.access_token as string;

  const url =
    provider === "google"
      ? "https://oauth2.googleapis.com/token"
      : "https://login.microsoftonline.com/common/oauth2/v2.0/token";
  const clientId = provider === "google" ? GOOGLE_CLIENT_ID : OUTLOOK_CLIENT_ID;
  const clientSecret = provider === "google" ? GOOGLE_CLIENT_SECRET : OUTLOOK_CLIENT_SECRET;

  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId!,
      client_secret: clientSecret!,
      refresh_token: tokenData.refresh_token,
      grant_type: "refresh_token",
    }),
  });
  if (!resp.ok) throw new Error(`Failed to refresh ${provider} token: ${await resp.text()}`);
  const data = await resp.json();
  const newExpiry = new Date(Date.now() + data.expires_in * 1000).toISOString();
  await supabase.rpc("update_calendar_integration_tokens", {
    p_integration_id: integration.id,
    p_access_token: data.access_token,
    p_refresh_token: data.refresh_token || tokenData.refresh_token,
    p_token_expires_at: newExpiry,
  });
  return data.access_token as string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !user) throw new Error("Unauthorized");

    // Upcoming window: today .. +14 days
    const today = new Date().toISOString().slice(0, 10);
    const in14 = new Date(Date.now() + 14 * 86400_000).toISOString().slice(0, 10);

    const { data: events, error: evErr } = await supabase
      .from("calendar_events")
      .select("*")
      .eq("user_id", user.id)
      .gte("date", today)
      .lte("date", in14)
      .neq("status", "cancelled");
    if (evErr) throw evErr;

    const { data: integrations } = await supabase
      .from("calendar_integrations")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true);

    const result = {
      pushed_google: 0,
      pushed_outlook: 0,
      skipped: 0,
      errors: [] as string[],
      providers_connected: (integrations ?? []).map((i: any) => i.provider),
    };

    if (!integrations || integrations.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: "No calendars connected", ...result }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    for (const integration of integrations) {
      const { data: tokens, error: tErr } = await supabase.rpc(
        "get_calendar_integration_tokens",
        { p_integration_id: integration.id },
      );
      if (tErr || !tokens || !tokens[0]) {
        result.errors.push(`${integration.provider}: missing tokens`);
        continue;
      }
      const tokenData = tokens[0];
      let accessToken: string;
      try {
        accessToken = await refreshIfNeeded(supabase, integration, tokenData, integration.provider);
      } catch (e) {
        result.errors.push(`${integration.provider}: ${(e as Error).message}`);
        continue;
      }

      for (const ev of events ?? []) {
        const alreadyPushed =
          (integration.provider === "google" && ev.google_event_id) ||
          (integration.provider === "outlook" && ev.outlook_event_id);
        if (alreadyPushed) {
          result.skipped++;
          continue;
        }
        const { start, end } = isoFor(ev.date, ev.time, 30);

        try {
          if (integration.provider === "google") {
            const r = await fetch(
              "https://www.googleapis.com/calendar/v3/calendars/primary/events",
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  summary: ev.title,
                  description: ev.description ?? "Pushed from MyRhythm",
                  start: { dateTime: start },
                  end: { dateTime: end },
                }),
              },
            );
            if (!r.ok) throw new Error(await r.text());
            const created = await r.json();
            await supabase
              .from("calendar_events")
              .update({
                google_event_id: created.id,
                pushed_to_google_at: new Date().toISOString(),
                last_push_error: null,
              })
              .eq("id", ev.id);
            result.pushed_google++;
          } else if (integration.provider === "outlook") {
            const r = await fetch("https://graph.microsoft.com/v1.0/me/events", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                subject: ev.title,
                body: { contentType: "Text", content: ev.description ?? "Pushed from MyRhythm" },
                start: { dateTime: start, timeZone: "UTC" },
                end: { dateTime: end, timeZone: "UTC" },
              }),
            });
            if (!r.ok) throw new Error(await r.text());
            const created = await r.json();
            await supabase
              .from("calendar_events")
              .update({
                outlook_event_id: created.id,
                pushed_to_outlook_at: new Date().toISOString(),
                last_push_error: null,
              })
              .eq("id", ev.id);
            result.pushed_outlook++;
          }
        } catch (e) {
          const msg = (e as Error).message.slice(0, 500);
          await supabase
            .from("calendar_events")
            .update({ last_push_error: `${integration.provider}: ${msg}` })
            .eq("id", ev.id);
          result.errors.push(`${integration.provider} (${ev.title}): ${msg}`);
        }
      }

      await supabase
        .from("calendar_integrations")
        .update({ last_sync: new Date().toISOString() })
        .eq("id", integration.id);
    }

    return new Response(
      JSON.stringify({ success: true, ...result }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("push-upcoming error:", error);
    return new Response(
      JSON.stringify({ success: false, error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
