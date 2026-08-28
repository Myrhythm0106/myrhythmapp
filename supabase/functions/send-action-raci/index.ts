import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const BodySchema = z.object({
  actionIds: z.array(z.string().uuid()).min(1).max(100),
});

const ROLE_LINES: Record<string, string> = {
  responsible: "This step is yours to do.",
  accountable: "You're the one who signs this step off.",
  consulted: "You're asked first on this step — input welcome before it's done.",
  informed: "We'll keep you in the loop on this step.",
};

const PRIORITY_LABELS: Record<number, string> = { 1: "High", 2: "High", 3: "Medium", 4: "Low", 5: "Low" };

interface Person {
  name: string;
  email?: string | null;
}

function collectRecipients(action: any): { person: Person; role: string }[] {
  const out: { person: Person; role: string }[] = [];
  const ownerEmail = (action.owner_email || "").trim().toLowerCase();
  if (ownerEmail) out.push({ person: { name: action.assigned_to || ownerEmail, email: ownerEmail }, role: "responsible" });
  const acc = action.accountable;
  if (acc?.email) out.push({ person: { name: acc.name || acc.email, email: String(acc.email).trim().toLowerCase() }, role: "accountable" });
  for (const p of Array.isArray(action.consulted) ? action.consulted : []) {
    if (p?.email) out.push({ person: { name: p.name || p.email, email: String(p.email).trim().toLowerCase() }, role: "consulted" });
  }
  for (const p of Array.isArray(action.informed) ? action.informed : []) {
    if (p?.email) out.push({ person: { name: p.name || p.email, email: String(p.email).trim().toLowerCase() }, role: "informed" });
  }
  const seen = new Set<string>();
  return out.filter(({ person }) => {
    const key = person.email!;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function actionHtml(action: any, senderName: string, role: string): string {
  const rows: string[] = [];
  rows.push(`<h2 style="margin:0 0 8px;color:#1a1a1a;font-size:18px;">${esc(action.action_text)}</h2>`);
  rows.push(`<p style="margin:0 0 12px;color:#c2410c;font-weight:600;">${esc(ROLE_LINES[role] || "")}</p>`);
  const facts: string[] = [];
  if (action.start_date || action.end_date) {
    facts.push(
      `<strong>When:</strong> ${action.start_date ? esc(action.start_date) : "—"} → ${action.end_date ? esc(action.end_date) : "—"}`
    );
  }
  facts.push(`<strong>Priority:</strong> ${PRIORITY_LABELS[action.priority_level ?? 3] || "Medium"}`);
  if (action.success_criteria) facts.push(`<strong>Done when:</strong> ${esc(action.success_criteria)}`);
  if (action.reference_code) facts.push(`<strong>Reference:</strong> ${esc(action.reference_code)}`);
  rows.push(`<p style="margin:0;color:#444;font-size:14px;line-height:1.7;">${facts.join("<br/>")}</p>`);
  rows.push(
    `<p style="margin:16px 0 0;color:#666;font-size:13px;">Sent by ${esc(senderName)} from MyRhythm — the app that keeps your plan going after the conversation ends.</p>`
  );
  return rows.join("\n");
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: "Invalid request", details: parsed.error.flatten() }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { actionIds } = parsed.data;

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceKey);

    // Validate the caller
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userErr } = await admin.auth.getUser(token);
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Not signed in" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = userData.user.id;

    const { data: profile } = await admin
      .from("profiles")
      .select("full_name, email")
      .eq("id", userId)
      .maybeSingle();
    const senderName = profile?.full_name || profile?.email || "Someone you know";

    // Only the caller's own actions
    const { data: actions, error: fetchErr } = await admin
      .from("extracted_actions")
      .select("id, action_text, assigned_to, owner_email, accountable, consulted, informed, start_date, end_date, priority_level, success_criteria, reference_code")
      .in("id", actionIds)
      .eq("user_id", userId);
    if (fetchErr) throw fetchErr;

    let sent = 0;
    const failures: string[] = [];
    const notifiedIds: string[] = [];

    for (const action of actions || []) {
      const recipients = collectRecipients(action);
      if (recipients.length === 0) continue;
      for (const { person, role } of recipients) {
        try {
          const { error: sendErr } = await resend.emails.send({
            from: "MyRhythm <noreply@myrhythmapp.com>",
            to: [person.email!],
            subject: `A next step that involves you${action.reference_code ? ` (${action.reference_code})` : ""}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 24px;">
                  <h1 style="color: #333; margin: 0;">MyRhythm</h1>
                  <p style="color: #666; margin: 5px 0; font-size: 13px;">A next step that involves you</p>
                </div>
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
                  ${actionHtml(action, senderName, role)}
                </div>
                <p style="color: #999; font-size: 12px; text-align: center; margin-top: 24px;">
                  This email was sent from MyRhythm. If you didn't expect it, you can safely ignore it.
                </p>
              </div>`,
          });
          if (sendErr) throw new Error(sendErr.message);
          sent++;
        } catch (e) {
          console.error("send failed", person.email, e);
          failures.push(person.email!);
        }
      }
      notifiedIds.push(action.id);
    }

    if (notifiedIds.length > 0) {
      await admin
        .from("extracted_actions")
        .update({ raci_notified_at: new Date().toISOString() })
        .in("id", notifiedIds)
        .eq("user_id", userId);
    }

    return new Response(JSON.stringify({ ok: true, sent, failures }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (e) {
    console.error("send-action-raci error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unexpected error" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
