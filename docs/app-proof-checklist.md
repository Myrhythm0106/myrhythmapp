# MyRhythm — Proof Checklist (the gate before selling anything)

**The rule:** Founding Member seats do not open until every box below is ticked with a date. This turns `docs/readiness-statement.md` into a test you can actually run.

---

## 1. iPhone long capture (target: Week 2, by 27 Sept)

**Steps:**
1. On a real iPhone, sign in and open the Memory Bridge.
2. Start a recording and leave it running for at least 2 hours (a meeting, the TV, a podcast — anything with speech).
3. Stop, tap Save & Extract Actions.
4. Check: the capture appears in your diary with the correct duration, the write-up exists, next steps were extracted, and the recording survives closing and reopening the app.

**Result:**
- [ ] PASS / [ ] FAIL — Date tested: ______
- Notes: ______________

## 2. Android long capture (target: Week 4, by 11 Oct)

Same steps on a real Android phone. Chrome or the installed app.

**Result:**
- [ ] PASS / [ ] FAIL — Date tested: ______
- Notes: ______________

## 3. Two-account Support Circle permission test (target: Week 6, by 25 Oct)

You need two real accounts: yours and a supporter's (the permanent tester account works for one side).

1. From account A, invite the supporter with **watch** permission on one capture only.
2. Sign in as the supporter. Confirm: they see that one capture's summary and can leave encouragement.
3. Confirm they **cannot** see: any other capture, any transcript or audio beyond what was shared, any calendar item they weren't invited to.
4. Change the permission to **calendar access** on one event. Confirm the supporter sees that event and still nothing else.
5. Remove the permission entirely. Confirm the shared items disappear from the supporter's view.

**Result:**
- [ ] PASS / [ ] FAIL — Date tested: ______
- Anything the supporter saw that they shouldn't have: ______________

## 4. Twenty-conversation action accuracy sample (target: Weeks 4–6, by 25 Oct)

1. Process 20 real or realistic conversations through Memory Bridge (live recordings or document imports both count).
2. For each, score the extracted next steps: **accurate** (right action, right owner, usable as-is), **editable** (right idea, needed wording or date fix), **wrong** (invented, missed or misattributed).
3. Pass mark: at least 16 of 20 land accurate or editable, and zero invented actions presented as fact.

| Total | Accurate | Editable | Wrong | Pass? |
| --- | --- | --- | --- | --- |
| 20 | | | | |

**Result:**
- [ ] PASS / [ ] FAIL — Date completed: ______

## 5. Google and Outlook calendar connection keys (target: Week 9, by 15 Nov) — **no longer a blocker**

Steps now reach Google, Outlook and Apple Calendar without any account linking: every dated step offers Add to my calendar (Google / Outlook / file / email to me), the calendar page sends a whole week at once, and Settings gives a private subscribe link that keeps any calendar current. Test that route instead before founding seats open:

- [ ] Add one step to Google Calendar from the Next Step Summary — Date: ______
- [ ] Add one step to Outlook the same way — Date: ______
- [ ] Open the downloaded file on an iPhone and confirm it lands in Apple Calendar — Date: ______
- [ ] Paste the Settings subscribe link into one calendar and confirm new steps appear — Date: ______

The two-way connected-account route below stays optional and can follow later:

**Google:**
1. In Google Cloud Console, create (or open) the OAuth app and copy the Client ID and Client Secret.
2. Add them to the project's secrets as `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.
3. Test: connect a real Google Calendar from Settings and confirm busy times show up.

**Outlook:**
1. In the Microsoft Entra app registration, copy the Application (client) ID and secret.
2. Add them as `OUTLOOK_CLIENT_ID` and `OUTLOOK_CLIENT_SECRET` (these are the names the app reads).
3. Test: connect a real Outlook calendar and confirm busy times show up.

**Result (optional, not a gate):**
- [ ] Google connected and tested — Date: ______
- [ ] Outlook connected and tested — Date: ______


---

## The gate decision

- [ ] **All five boxes ticked → Stripe goes live, Script 6 (founding seats) can be sent.**
- [ ] **Any box unticked → founding seats stay closed. The unticked items get the next fortnight's two app blocks. Nothing else changes.**

Signed off by: ______________  Date: ______
