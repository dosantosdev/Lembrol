import { createContext, useContext, useEffect, useState } from "react";
import { useProjectContext } from "../store/ProjectContext.jsx";
import { shouldRemind } from "./reminderService.js";

const ReminderContext = createContext();

export function ReminderProvider({ children }) {
  const { projectsState } = useProjectContext();

  const [activeReminders, setActiveReminders] = useState([]);
  const [dismissedReminders, setDismissedReminders] = useState(new Set());

  useEffect(() => {
    function checkReminders() {
      const now = new Date();

      const reminders = projectsState.tasks.filter(
        (task) => shouldRemind(task, now) && !dismissedReminders.has(task.id),
      );

      setActiveReminders(reminders);
    }

    checkReminders();

    const interval = setInterval(checkReminders, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [projectsState.tasks, dismissedReminders]);

  function dismissReminder(taskId) {
    setDismissedReminders((prevDismissed) => {
      const updatedDismissed = new Set(prevDismissed);
      updatedDismissed.add(taskId);

      return updatedDismissed;
    });

    setActiveReminders((prevReminders) =>
      prevReminders.filter((task) => task.id !== taskId),
    );
  }

  return (
    <ReminderContext.Provider
      value={{
        activeReminders,
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
