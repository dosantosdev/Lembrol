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

  /*
   * Atualiza o contador da bandeja sempre que
   * a quantidade de lembretes ativos mudar.
   */
  useEffect(() => {
    if (window.electronAPI?.updateTrayCount) {
      window.electronAPI.updateTrayCount(activeReminders.length);
    }
  }, [activeReminders.length]);

  /*
   * Remove estados que pertencem a tarefas
   * que não existem mais.
   */
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

  /*
   * Persiste o estado dos lembretes.
   */
  useEffect(() => {
    saveReminderState({
      dismissedReminders,
      notifiedReminders,
      snoozedReminders,
    });
  }, [dismissedReminders, notifiedReminders, snoozedReminders]);

  /*
   * Verifica os lembretes a cada segundo.
   */
  useEffect(() => {
    function checkReminders() {
      const now = new Date();

      const reminders = [];

      const newNotifications = [];

      projectsState.tasks.forEach((task) => {
        const reminderKey = getReminderKey(task);

        if (!reminderKey) {
          return;
        }

        /*
         * Se foi dispensado, nunca mais aparece
         * para este lembrete.
         */
        if (dismissedReminders.has(reminderKey)) {
          return;
        }

        const snoozeUntil = snoozedReminders[reminderKey];

        /*
         * Se está adiado e o tempo ainda não terminou,
         * o lembrete permanece temporariamente escondido.
         */
        if (snoozeUntil) {
          const snoozeDate = new Date(snoozeUntil);

          if (now < snoozeDate) {
            return;
          }

          /*
           * O adiamento terminou.
           *
           * Como o lembrete foi adiado, ele precisa
           * tocar novamente mesmo que já tenha passado
           * a janela original de 60 segundos.
           */
          if (!notifiedReminders.has(reminderKey)) {
            newNotifications.push(task);
          }
        }

        /*
         * Um lembrete já notificado continua sendo
         * considerado ativo até ser dispensado ou adiado.
         */
        const isCurrentlyDue = shouldRemind(task, now);

        const wasAlreadyNotified = notifiedReminders.has(reminderKey);

        if (isCurrentlyDue || wasAlreadyNotified) {
          reminders.push(task);
        }

        /*
         * Primeiro disparo do lembrete.
         */
        if (isCurrentlyDue && !wasAlreadyNotified) {
          if (!newNotifications.some((item) => item.id === task.id)) {
            newNotifications.push(task);
          }
        }
      });

      /*
       * Atualiza os lembretes que continuam pendentes.
       *
       * IMPORTANTE:
       * Eles não desaparecem depois de 60 segundos.
       */
      setActiveReminders(reminders);

      if (newNotifications.length > 0) {
        newNotifications.forEach((task) => {
          triggerReminderAlert(task, settings.reminders);
        });

        /*
         * O alerta visual automático fica aberto
         * durante 8 segundos.
         *
         * Isso NÃO remove o lembrete do sino.
         */
        setNotificationMode("alert");
        setNotificationOpen(true);

        if (notificationTimerRef.current) {
          clearTimeout(notificationTimerRef.current);
        }

        notificationTimerRef.current = setTimeout(() => {
          setNotificationOpen(false);
          notificationTimerRef.current = null;
        }, 8000);

        /*
         * Marca o lembrete como notificado.
         *
         * Isso faz com que ele continue aparecendo
         * no sino mesmo depois da janela de 60 segundos.
         */
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

        /*
         * Se o lembrete acabou de tocar novamente
         * após um adiamento, remove o adiamento.
         */
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

  /*
   * Limpeza somente quando o Provider for desmontado.
   */
  useEffect(() => {
    return () => {
      if (notificationTimerRef.current) {
        clearTimeout(notificationTimerRef.current);
      }

      stopReminderSound();
    };
  }, []);

  /*
   * Dispensa definitivamente o lembrete.
   */
  function dismissReminder(taskId) {
    const task = projectsState.tasks.find((item) => item.id === taskId);

    const reminderKey = task ? getReminderKey(task) : null;

    stopReminderSound();

    if (reminderKey) {
      /*
       * Marca como dispensado.
       */
      setDismissedReminders((previous) => {
        const updated = new Set(previous);

        updated.add(reminderKey);

        return updated;
      });

      /*
       * Remove de qualquer adiamento existente.
       */
      setSnoozedReminders((previous) => {
        const updated = {
          ...previous,
        };

        delete updated[reminderKey];

        return updated;
      });

      /*
       * Remove da lista de notificações já disparadas.
       */
      setNotifiedReminders((previous) => {
        const updated = new Set(previous);

        updated.delete(reminderKey);

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

  /*
   * Apenas para o som.
   *
   * O lembrete continua pendente.
   */
  function stopReminder() {
    stopReminderSound();
  }

  /*
   * Adia o lembrete.
   */
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

    /*
     * Guarda o horário até o qual o lembrete
     * deve permanecer escondido.
     */
    setSnoozedReminders((previous) => ({
      ...previous,
      [reminderKey]: snoozeUntil.toISOString(),
    }));

    /*
     * Remove o estado de "já notificado".
     *
     * Isso é fundamental:
     * quando o adiamento terminar, o lembrete
     * poderá tocar novamente.
     */
    setNotifiedReminders((previous) => {
      const updated = new Set(previous);

      updated.delete(reminderKey);

      return updated;
    });

    /*
     * Remove imediatamente do sino.
     */
    setActiveReminders((previous) => {
      return previous.filter((task) => task.id !== taskId);
    });

    setNotificationOpen(false);
  }

  /*
   * Abre manualmente a lista pelo sino.
   */
  function openNotifications() {
    if (notificationTimerRef.current) {
      clearTimeout(notificationTimerRef.current);

      notificationTimerRef.current = null;
    }

    setNotificationMode("bell");
    setNotificationOpen(true);
  }

  /*
   * Fecha somente o painel visual.
   *
   * Isso NÃO dispensa nenhum lembrete.
   */
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
