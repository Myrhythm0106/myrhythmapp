# Close the loop on finished steps + fix six security findings

## 1. Closing the loop (your "Yes")

When a diary item that came from a conversation is ticked **Done** (Home, calendar, reminder card, Still open list, or the detail sheet):
- The conversation action it came from is also marked done, so nothing is left hanging or showing as open.
- Support Circle members linked to that action are told it is done (same notice the app already uses when a step is completed from the conversation).
- You see one calm message: "Done — your conversation step is closed and your Support Circle has been told." with an **Undo** option. Undo reopens the action and withdraws the notice.
- If the item was private or has no Support Circle link, the message simply says the step is closed.
- "Let it go" closes the action as let go (no Support Circle notice); "Move to tomorrow" keeps it open.

## 2. Security — only the six findings you listed

No other findings are touched.
- **Accountability alerts:** anyone could create alerts. Now only for yourself (system jobs still work).
- **Security events:** anyone could write events. Now only for yourself (system jobs still work).
- **Trial subscriptions:** a rule let anyone manage any trial. Removed; only system jobs manage trials, you can still view your own.
- **Transcription jobs:** a rule let anyone update any job. Removed; you update your own, system jobs still work.
- **Shared empowerment statements:** read-only for signed-in people only, nobody can change them.
- **Voice recordings (care professional access):** the rule did not check who was looking. Now only the specific active care professional the owner shared with can open them.

Then mark those six as fixed.

## Technical details
- New helper in `src/launch/reminders/` (`closeLinkedAction`) called from every Done/let-go path where `extracted_action_id` exists; uses existing `useCompleteAction` logic and `notify_circle_of_step_completion` / `withdraw_step_completion_notice` RPCs; toast via existing toaster. Unit test: done → action completed + notify called; let go → no notify; undo → withdraw.
- Migration: drop `Anyone can create alerts`, `System can create security events`, `System can manage trial subscriptions`, `System can update transcription jobs`; recreate INSERT policies as `TO authenticated WITH CHECK (auth.uid() = user_id)` (service role bypasses RLS). Recreate `authenticated_users_view_statements` as `TO authenticated USING (auth.uid() IS NOT NULL)`. Recreate storage policy `Health professionals can access voice recordings` adding `lower(scm.member_email) = lower(public.get_current_user_email())` (no `member_user_id` column exists).
- `security--manage_security_finding` mark_as_fixed for the six internal_ids only.
