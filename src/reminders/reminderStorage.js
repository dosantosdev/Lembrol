const REMINDER_STATE_KEY = "lembrol-reminder-state";

const defaultReminderState = {
  dismissedReminders: [],
  notifiedReminders: [],
};

export function loadReminderState() {
  const storedState = localStorage.getItem(REMINDER_STATE_KEY);

  if (!storedState) {
    return defaultReminderState;
  }

  try {
    const parsedState = JSON.parse(storedState);

    return {
      dismissedReminders: Array.isArray(parsedState.dismissedReminders)
        ? parsedState.dismissedReminders
        : [],

      notifiedReminders: Array.isArray(parsedState.notifiedReminders)
        ? parsedState.notifiedReminders
        : [],
    };
  } catch {
    return defaultReminderState;
  }
}

export function saveReminderState(state) {
  localStorage.setItem(
    REMINDER_STATE_KEY,
    JSON.stringify({
      dismissedReminders: [...state.dismissedReminders],
      notifiedReminders: [...state.notifiedReminders],
    }),
  );
}
