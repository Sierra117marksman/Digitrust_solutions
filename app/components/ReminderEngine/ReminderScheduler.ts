import { ReminderItem, EngineReminder, ReminderState } from './ReminderTypes';
import { ReminderPreferences } from './ReminderPreferences';

export function calculateReminderState(
  item: ReminderItem,
  nowMs: number,
  prefs: ReminderPreferences,
  snoozedUntil?: number,
  acknowledgedAt?: number
): EngineReminder {
  const scheduledMs = new Date(item.scheduledAt).getTime();
  const diffMs = scheduledMs - nowMs;
  const diffMinutes = Math.round(diffMs / 60000);
  
  let engineState: ReminderState = 'Scheduled';
  let waitingMinutes = 0;

  if (item.status === 'Completed') {
    engineState = 'Completed';
  } else if (acknowledgedAt && nowMs - acknowledgedAt < 60000 * 60) {
    // If acknowledged within the last hour, keep it acknowledged
    engineState = 'Acknowledged';
  } else if (snoozedUntil && nowMs < snoozedUntil) {
    // If snoozed, treat it as Scheduled (hidden)
    engineState = 'Scheduled';
  } else {
    // Calculate based on time
    if (diffMinutes > prefs.earlyWarningMinutes) {
      engineState = 'Scheduled'; // > 5 mins away
    } else if (diffMinutes > 0 && diffMinutes <= prefs.earlyWarningMinutes) {
      engineState = 'Upcoming'; // 1 to 5 mins away
    } else if (diffMinutes === 0) {
      engineState = 'Due'; // Exactly now
    } else if (diffMinutes < 0 && diffMinutes >= -59) {
      engineState = 'Overdue'; // Up to 59 mins overdue
      waitingMinutes = Math.abs(diffMinutes);
    } else if (diffMinutes < -59) {
      engineState = 'Critical'; // 60+ mins overdue
      waitingMinutes = Math.abs(diffMinutes);
    }
  }

  return {
    ...item,
    engineState,
    snoozedUntil,
    acknowledgedAt,
    waitingMinutes
  };
}

export function sortReminders(reminders: EngineReminder[]): EngineReminder[] {
  return reminders.sort((a, b) => {
    // 1. Critical first
    if (a.engineState === 'Critical' && b.engineState !== 'Critical') return -1;
    if (b.engineState === 'Critical' && a.engineState !== 'Critical') return 1;
    
    // 2. High priority
    if (a.priority === 'High' && b.priority !== 'High') return -1;
    if (b.priority === 'High' && a.priority !== 'High') return 1;
    
    // 3. Overdue
    if (a.engineState === 'Overdue' && b.engineState !== 'Overdue') return -1;
    if (b.engineState === 'Overdue' && a.engineState !== 'Overdue') return 1;
    
    // 4. Earliest time
    return new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime();
  });
}
