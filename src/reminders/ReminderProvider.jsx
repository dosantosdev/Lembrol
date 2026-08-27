import { createContext, useContext, useEffect, useState } from "react";
import { useProjectContext } from "../store/ProjectContext.jsx";
import { shouldRemind, getReminderDate } from "./reminderService.js";
import { triggerReminderAlert } from "./alertService.js";
import { loadReminderState, saveReminderState } from "./reminderStorage.js";
import { useSettings } from "../store/SettingsContext.jsx";

const ReminderContext = createContext();

function getReminderKey(task) {
  const reminderDate = getReminderDate(task);

  if (!reminderDate) {
    return null;
  }

  return `${task.id}-${reminderDate.getTime()}`;
}

const storedReminderState = loadReminderState();

export function ReminderProvider({ children }) {
  const { projectsState } = useProjectContext();
  const { settings } = useSettings();

  const [activeReminders, setActiveReminders] = useState([]);

  const [dismissedReminders, setDismissedReminders] = useState(
    new Set(storedReminderState.dismissedReminders),
  );

  const [notifiedReminders, setNotifiedReminders] = useState(
    new Set(storedReminderState.notifiedReminders),
  );

  useEffect(() => {
    const existingReminderKeys = new Set();

    projectsState.tasks.forEach((task) => {
      const reminderKey = getReminderKey(task);

      if (reminderKey) {
        existingReminderKeys.add(reminderKey);
      }
    });

    setDismissedReminders((previous) => {
      return new Set(
        [...previous].filter((key) => existingReminderKeys.has(key)),
      );
    });

    setNotifiedReminders((previous) => {
      return new Set(
        [...previous].filter((key) => existingReminderKeys.has(key)),
      );
    });
  }, [projectsState.tasks]);

  useEffect(() => {
    saveReminderState({
      dismissedReminders,
      notifiedReminders,
    });
  }, [dismissedReminders, notifiedReminders]);

  useEffect(() => {
    function checkReminders() {
      const now = new Date();

      const reminders = projectsState.tasks.filter((task) => {
        const reminderKey = getReminderKey(task);

        return (
          shouldRemind(task, now) &&
          reminderKey &&
          !dismissedReminders.has(reminderKey)
        );
      });

      setActiveReminders(reminders);

      const newNotifications = reminders.filter((task) => {
        const reminderKey = getReminderKey(task);

        return reminderKey && !notifiedReminders.has(reminderKey);
      });

      if (newNotifications.length > 0) {
        newNotifications.forEach((task) => {
          triggerReminderAlert(task, settings.reminders);
        });

        setNotifiedReminders((previous) => {
          const updated = new Set(previous);

          newNotifications.forEach((task) => {
            const reminderKey = getReminderKey(task);

            if (reminderKey) {
              updated.add(reminderKey);
            }
          });

          return updated;
        });
      }
    }

    checkReminders();

    const interval = setInterval(checkReminders, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [projectsState.tasks, dismissedReminders, notifiedReminders, settings]);

  function dismissReminder(taskId) {
    const task = projectsState.tasks.find((item) => item.id === taskId);

    const reminderKey = task ? getReminderKey(task) : null;

    if (reminderKey) {
      setDismissedReminders((previous) => {
        const updated = new Set(previous);

        updated.add(reminderKey);

        return updated;
      });
    }

    setActiveReminders((previous) =>
      previous.filter((task) => task.id !== taskId),
    );
  }

  return (
    <ReminderContext.Provider
      value={{
        activeReminders,
        notifiedReminders,
        dismissReminder,
      }}
    >
      {children}
    </ReminderContext.Provider>
  );
}

export function useReminderContext() {
  return useContext(ReminderContext);
}
