import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const nowIso = new Date().toISOString();

    const { data: due, error } = await supabase
      .from("action_reminders")
      .select("id, user_id, action_id, due_at, offset_days, tone")
      .is("sent_at", null)
      .lte("due_at", nowIso)
      .limit(200);

    if (error) throw error;

    let sent = 0;

    for (const reminder of due ?? []) {
      const { data: action } = await supabase
        .from("extracted_actions")
        .select("id, action_text, status, archived_at, completion_date, end_date")
        .eq("id", reminder.action_id)
        .maybeSingle();

      // Its diary item answered Done / Let it go anywhere in the app also counts as finished.
      const { data: diary } = await supabase
        .from("calendar_events")
        .select("status, reminder_status")
        .eq("extracted_action_id", reminder.action_id);
      const diaryClosed = (diary ?? []).some(
        (e: { status: string | null; reminder_status: string | null }) =>
          ["done", "completed", "cancelled"].includes(e.status ?? "") ||
          ["done", "let_go", "cancelled"].includes(e.reminder_status ?? ""),
      );

      // Skip anything already finished or archived — no nagging on done work.
      const finished =
        !action ||
        action.archived_at ||
        diaryClosed ||
        ["done", "completed", "cancelled"].includes(action.status ?? "");

      if (!finished) {
        const offset = reminder.offset_days ?? 0;
        const when =
          offset < 0
            ? `in ${Math.abs(offset)} day${Math.abs(offset) === 1 ? "" : "s"}`
            : offset === 0
            ? "today"
            : `${offset} day${offset === 1 ? "" : "s"} ago`;

        const body =
          offset > 0
            ? `Still open: "${action.action_text}" was due ${when}. Want to move it or close it?`
            : `"${action.action_text}" is due ${when}.`;

        await supabase.from("cross_device_notifications").insert({
          user_id: reminder.user_id,
          notification_type: "action_reminder",
          device_source: "server",
          data: {
            action_id: reminder.action_id,
            title: "My next step",
            body,
            tone: reminder.tone ?? "steady",
            offset_days: offset,
          },
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        });

        sent++;
      }

      await supabase
        .from("action_reminders")
        .update({ sent_at: nowIso })
        .eq("id", reminder.id);
    }

    return new Response(JSON.stringify({ processed: due?.length ?? 0, sent }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("send-action-reminders error", e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
