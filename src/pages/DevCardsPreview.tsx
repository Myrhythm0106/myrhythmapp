import { ActionsTableView } from '@/components/memoryBridge/ActionsTableView';
import type { NextStepsItem } from '@/types/memoryBridge';
import type { MeetingSummaryModel } from '@/components/memoryBridge/ExecutiveSummaryPanel';

const actions: NextStepsItem[] = [
  {
    id: 'a1', action_text: 'Email the physio to confirm my Wednesday appointment and ask about the new exercises',
    success_criteria: 'the appointment is confirmed in writing', priority_level: 1, status: 'doing',
    proposed_date: '2026-09-02', proposed_time: '10:00', start_date: null, completion_date: '2026-09-05',
    reference_code: 'MB-260901-A1', assigned_watchers: ['w1', 'w2'], assigned_to: 'Me',
  } as NextStepsItem,
  {
    id: 'a2', action_text: 'Book the follow-up with Dr Okafor', success_criteria: '',
    priority_level: 3, status: 'not_started', start_date: '2026-09-03', end_date: '2026-09-10',
    reference_code: 'MB-260901-A2', assigned_to: 'Me',
  } as NextStepsItem,
  {
    id: 'a3', action_text: 'Share the summary with Sarah from my Support Circle',
    success_criteria: "Sarah has read it and we've talked it through", priority_level: 3, status: 'done',
    start_date: '2026-09-01', end_date: '2026-09-01', reference_code: 'MB-260901-A3', assigned_to: 'Me',
    assigned_watchers: ['w1'],
  } as NextStepsItem,
];

const meeting: MeetingSummaryModel = {
  title: 'Discharge planning call', date: '1 September 2026', participants: ['Me', 'Sarah'],
  summary: 'Summary text', themes: [], decisions: [], openQuestions: [],
  counts: { total: 3, withProposedDate: 1, scheduled: 2, complete: 1 },
};

export default function DevCardsPreview() {
  return (
    <div className="min-h-screen bg-exhibit-surface p-6">
      <ActionsTableView
        actions={actions}
        meetingSummary={meeting}
        onDragEnd={() => {}}
        onStatusChange={() => {}}
        onPriorityChange={() => {}}
        onTextChange={() => {}}
        onSuccessCriteriaChange={() => {}}
        onRaciChange={() => {}}
        onStartDateChange={() => {}}
        onDueDateChange={() => {}}
        onWatchersChange={() => {}}
        onOpenNotes={() => {}}
        onOpenReminders={() => {}}
        onArchive={() => {}}
        onRestore={() => {}}
        onSendToAll={async () => {}}
        ladders={{ a1: [1, 3] }}
        onSort={() => {}}
        sortField="priority"
        sortDirection="asc"
      />
    </div>
  );
}
