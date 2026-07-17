export interface ReminderPreferences {
  soundEnabled: boolean;
  popupEnabled: boolean;
  browserPushEnabled: boolean;
  earlyWarningMinutes: number;
  dndEnabled: boolean;
  workingHoursStart: string; // e.g. "09:00"
  workingHoursEnd: string;   // e.g. "18:00"
}

const DEFAULT_PREFS: ReminderPreferences = {
  soundEnabled: true,
  popupEnabled: true,
  browserPushEnabled: false,
  earlyWarningMinutes: 5,
  dndEnabled: false,
  workingHoursStart: "09:00",
  workingHoursEnd: "18:00",
};

export function loadPreferences(): ReminderPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFS;
  const stored = localStorage.getItem('crm_reminder_prefs');
  if (!stored) return DEFAULT_PREFS;
  try {
    return { ...DEFAULT_PREFS, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_PREFS;
  }
}

export function savePreferences(prefs: ReminderPreferences) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('crm_reminder_prefs', JSON.stringify(prefs));
}
