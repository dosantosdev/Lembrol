import { createContext, useContext, useEffect, useRef, useState } from "react";

import { useProjectContext } from "../store/ProjectContext.jsx";

import { shouldRemind, getReminderDate } from "./reminderService.js";

import { triggerReminderAlert } from "./alertService.js";

import { loadReminderState, saveReminderState } from "./reminderStorage.js";

import { stopReminderSound } from "./soundService.js";

import { useSettings } from "../store/SettingsContext.jsx";

const ReminderContext = createContext();

const SNOOZE_OPTIONS = [
  {
    label: "5 minutos",
    minutes: 5,
  },
  {
    label: "10 minutos",
    minutes: 10,
  },
  {
    label: "15 minutos",
    minutes: 15,
  },
  {
    label: "30 minutos",
    minutes: 30,
  },
  {
    label: "45 minutos",
    minutes: 45,
  },
  {
    label: "1 hora",
    minutes: 60,
  },
];

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

  const [notificationOpen, setNotificationOpen] = useState(false);

  const [notificationMode, setNotificationMode] = useState("alert");

  const [dismissedReminders, setDismissedReminders] = useState(
    new Set(storedReminderState.dismissedReminders),
  );

  const [notifiedReminders, setNotifiedReminders] = useState(
    new Set(storedReminderState.notifiedReminders),
  );

  const [snoozedReminders, setSnoozedReminders] = useState(
    storedReminderState.snoozedReminders || {},
  );

  const notificationTimerRef = useRef(null);

  useEffect(() => {
    if (window.electronAPI?.updateTrayCount) {
      window.electronAPI.updateTrayCount(activeReminders.length);
    }
  }, [activeReminders.length]);

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

    setSnoozedReminders((previous) => {
      const updated = {};

      Object.entries(previous).forEach(([key, snoozeTime]) => {
        if (existingReminderKeys.has(key)) {
          updated[key] = snoozeTime;
        }
      });

      return updated;
    });
  }, [projectsState.tasks]);

  useEffect(() => {
    saveReminderState({
      dismissedReminders,
      notifiedReminders,
      snoozedReminders,
    });
  }, [dismissedReminders, notifiedReminders, snoozedReminders]);

  useEffect(() => {
    function checkReminders() {
      const now = new Date();

      const reminders = projectsState.tasks.filter((task) => {
        const reminderKey = getReminderKey(task);

        if (!reminderKey) {
          return false;
        }

        if (dismissedReminders.has(reminderKey)) {
          return false;
        }

        const snoozeUntil = snoozedReminders[reminderKey];

        if (snoozeUntil) {
          const snoozeDate = new Date(snoozeUntil);

          if (now < snoozeDate) {
            return false;
          }
        }

        return shouldRemind(task, now);
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

        setNotificationMode("alert");
        setNotificationOpen(true);

        if (notificationTimerRef.current) {
          clearTimeout(notificationTimerRef.current);
        }

        notificationTimerRef.current = setTimeout(() => {
          setNotificationOpen(false);
          notificationTimerRef.current = null;
        }, 8000);

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

        setSnoozedReminders((previous) => {
          const updated = {
            ...previous,
          };

          newNotifications.forEach((task) => {
            const reminderKey = getReminderKey(task);

            if (reminderKey) {
              delete updated[reminderKey];
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
  }, [
    projectsState.tasks,
    dismissedReminders,
    notifiedReminders,
    snoozedReminders,
    settings,
  ]);

  useEffect(() => {
    return () => {
      if (notificationTimerRef.current) {
        clearTimeout(notificationTimerRef.current);
      }

      stopReminderSound();
    };
  }, []);

  function dismissReminder(taskId) {
    const task = projectsState.tasks.find((item) => item.id === taskId);

    const reminderKey = task ? getReminderKey(task) : null;

    stopReminderSound();

    if (reminderKey) {
      setDismissedReminders((previous) => {
        const updated = new Set(previous);

        updated.add(reminderKey);

        return updated;
      });

      setSnoozedReminders((previous) => {
        const updated = {
          ...previous,
        };

        delete updated[reminderKey];

        return updated;
      });
    }

    setActiveReminders((previous) => {
      const updated = previous.filter((task) => task.id !== taskId);

      if (updated.length === 0) {
        setNotificationOpen(false);
      }

      return updated;
    });
  }

  function stopReminder(taskId) {
    stopReminderSound();

    setActiveReminders((previous) => {
      return previous.filter((task) => task.id !== taskId);
    });
  }

  function snoozeReminder(taskId, minutes) {
    const task = projectsState.tasks.find((item) => item.id === taskId);

    if (!task) {
      return;
    }

    const reminderKey = getReminderKey(task);

    if (!reminderKey) {
      return;
    }

    stopReminderSound();

    const snoozeUntil = new Date(Date.now() + minutes * 60 * 1000);

    setSnoozedReminders((previous) => ({
      ...previous,
      [reminderKey]: snoozeUntil.toISOString(),
    }));

    setActiveReminders((previous) => {
      return previous.filter((task) => task.id !== taskId);
    });

    setNotificationOpen(false);
  }

  function openNotifications() {
    if (notificationTimerRef.current) {
      clearTimeout(notificationTimerRef.current);

      notificationTimerRef.current = null;
    }

    setNotificationMode("bell");
    setNotificationOpen(true);
  }

  function closeNotifications() {
    setNotificationOpen(false);
  }

  return (
    <ReminderContext.Provider
      value={{
        activeReminders,
        notifiedReminders,
        notificationOpen,
        notificationMode,

        snoozeOptions: SNOOZE_OPTIONS,

        dismissReminder,
        stopReminder,
        snoozeReminder,

        openNotifications,
        closeNotifications,
      }}
    >
      {children}
    </ReminderContext.Provider>
  );
}

export function useReminderContext() {
  return useContext(ReminderContext);
}
