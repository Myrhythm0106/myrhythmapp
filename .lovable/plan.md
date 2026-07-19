# Recording length: 20 min free, 4 hours premium

## Current state (verified)
- `useRecordingLimits.ts` `DAILY_LIMITS.free = 30` min; paid tiers unlimited.
- `MemoryBridgeRecorder.tsx` premium per-recording cap = **180 min** (bottleneck).
- `QuickCaptureRecorder.tsx` premium cap already **240 min**, free = 30 min.
- MediaRecorder + IndexedDB chunk path already handles multi-hour blobs; AssemblyAI supports multi-hour audio. No backend change required.

## Changes

1. **`src/hooks/memoryBridge/useRecordingLimits.ts`**
   - `DAILY_LIMITS.free`: `30` → **`20`** minutes/day.

2. **`src/components/memoryBridge/MemoryBridgeRecorder.tsx`**
   - Free per-recording cap: `30` → **`20`** min.
   - Premium per-recording cap: `180` → **`240`** min (4 hours).

3. **`src/components/memoryBridge/QuickCaptureRecorder.tsx`**
   - Free per-recording cap: `30` → **`20`** min. Premium stays at 240.

4. **Copy / UX polish**
   - "Approaching limit" toast reads "4 hours" (not "240 minutes") for premium, "20 minutes" for free.
   - At 3h30m mark for premium, subtle inline hint: "You can keep going up to 4 hours."
   - Free-tier upgrade nudge on `RecordingFeatureGate` / `RecordingLimitsWarning` updated to reference "20 minutes/day" and "record up to 4 hours per session on premium".

## Not changing
- Founding-comped users resolve to premium → get full 4h automatically.
- 48-hour transcript retention window unchanged.
- Storage / edge function code unchanged.

## Verification
- Premium/founding-comped user: timer runs past 3h without auto-stop; stops at 4h.
- Free user: timer stops at 20 min with upgrade prompt.
- Daily free cap enforced at 20 min across recordings.
