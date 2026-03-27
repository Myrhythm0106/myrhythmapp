

# Contact List Feature + Commit Section Updates

## Context

The SmartScheduleCard already supports adding attendees via Support Circle and manual email entry. But there's no persistent **contact list** — every manual email is typed fresh each time. The "Commit" section in the strategy document also doesn't mention edit, deny, or manual email capabilities.

## Two Deliverables

### A. Contact List Feature (New Database Table + UI)

A lightweight personal address book that sits alongside Support Circle. Support Circle = trusted people with permissions to your data. Contact List = anyone you might invite to meetings (no data access).

**Database**: New `user_contacts` table:
- `id`, `user_id`, `name`, `email`, `created_at`, `updated_at`
- RLS: users can only CRUD their own contacts
- Unique constraint on `(user_id, email)`

**Smart auto-save**: When a user manually types an email in the SmartScheduleCard, offer to save it to contacts. Next time, it appears as a suggestion alongside Support Circle members.

**Typeahead in SmartScheduleCard**: When typing an email, fuzzy-match against:
1. Support Circle members (shown with a badge)
2. Saved contacts (shown with a different badge)
3. If no match, allow free-text entry

This is the "SMART showup" behaviour described in the investor deck — stored emails surface as the user types, without blocking free input.

**UI integration**: No separate "contacts page" needed initially. Contacts are managed inline:
- Auto-suggested while typing in the attendee field
- "Save to contacts?" prompt after adding a new email
- Optional: a small "Manage Contacts" link in Settings for bulk editing

### B. Strategy Document Updates

Update the "Commit" pillar description in the 5-Year Strategy PDF (v4) and the PRD to explicitly include:

- **Edit**: User can adjust suggested date/time/attendees before confirming
- **Deny**: User can dismiss/reject any AI-suggested scheduling item
- **Manual email entry**: Type any email address; system auto-suggests from Contact List and Support Circle
- **Contact List**: Persistent personal address book that learns from usage

### Files

| File | Action |
|------|--------|
| Migration SQL | Create `user_contacts` table with RLS |
| `src/components/scheduling/SmartScheduleCard.tsx` | Add typeahead against contacts + "Save to contacts?" prompt |
| `src/hooks/use-contacts.ts` | Create — CRUD hook for `user_contacts` table |
| `/mnt/documents/MyRhythm_Productivity_5_Year_Strategy_v4.pdf` | Regenerate with updated Commit section |
| `/mnt/documents/MyRhythm_PRD_IP_Documentation.md` | Update Section 5.2 Commit flow to include edit, deny, manual email, contact list |
| `src/components/investor/ProductivityInvestorSlides.tsx` | Update Slide 08 (CCM Management pillar) to reference edit/deny/contact list |

### How Typeahead Works

```text
User types: "sa..."
┌─────────────────────────────────┐
│ 👥 Sarah Johnson (Support Circle)│
│ 📋 Sam Peters (Saved Contact)    │
│ ➕ Type full email to add new    │
└─────────────────────────────────┘
```

- Support Circle members matched by name or email
- Saved contacts matched by name or email
- No match? User keeps typing a full email — validated on submit
- After adding a new email: "Save to contacts for next time?" toast with Save button

### 5-Year Plan Placement

- **Year 1 MVP**: Contact list auto-save from scheduling flow, typeahead suggestions
- **Year 2**: Contact list sync with external address books (Google Contacts, Outlook People)
- **Year 3-5**: AI-suggested attendees based on meeting context and past invitation patterns

