export type ReminderState = 'Scheduled' | 'Upcoming' | 'Due' | 'Overdue' | 'Critical' | 'Acknowledged' | 'Completed';

export type ReminderPriority = 'High' | 'Normal' | 'Low';

export interface ReminderItem {
  id: string;
  title: string;          // e.g. Lead Name
  subtitle?: string;      // e.g. Phone Number
  details?: string;       // e.g. Client Summary
  scheduledAt: string;    // ISO string
  status: string;         // 'Pending' | 'Completed' etc.
  priority?: ReminderPriority;
  originalPayload?: unknown;  // Keep reference to the original object (e.g. Lead)
}

export interface EngineReminder extends ReminderItem {
  engineState: ReminderState;
  snoozedUntil?: number;
  acknowledgedAt?: number;
  waitingMinutes?: number; 
}

export interface ReminderEngineAPI {
  activeReminders: EngineReminder[];
  acknowledgeReminder: (id: string) => void;
  snoozeReminder: (id: string, minutes: number) => void;
  completeReminder: (id: string) => Promise<void>;
  callNow: (id: string) => void;
  contextActiveId: string | null;
  setContextActiveId: (id: string | null) => void;
}
