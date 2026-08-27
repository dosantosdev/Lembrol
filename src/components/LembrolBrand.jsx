import { useMemo } from "react";
import { useProjectContext } from "../store/ProjectContext.jsx";
import { useReminderContext } from "../reminders/ReminderProvider.jsx";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import {
  getReminderDate,
  getTaskDueDate,
} from "../reminders/reminderService.js";

function getTaskStatus(task, now) {
  if (task.completed) {
    return "calm";
  }

  // Se existe um lembrete ativo, a situação é de alerta.
  if (task.dueDate && task.dueTime && task.reminderMinutes !== null) {
    const reminderDate = getReminderDate(task);

    if (reminderDate && now >= reminderDate) {
      return "alert";
    }
  }

  // Tarefa com data e horário.
  const dueDate = getTaskDueDate(task);

  if (dueDate) {
    // A tarefa já passou do vencimento.
    if (now > dueDate) {
      return "alert";
    }

    // A tarefa vence nas próximas 24 horas.
    const hoursUntilDue =
      (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilDue <= 24) {
      return "warning";
    }

    return "calm";
  }

  // Tarefa com data, mas sem horário.
  // Nesse caso, consideramos o final daquele dia como vencimento.
  if (task.dueDate) {
    const dueDateWithoutTime = new Date(`${task.dueDate}T23:59:59`);

    if (!Number.isNaN(dueDateWithoutTime.getTime())) {
      if (now > dueDateWithoutTime) {
        return "alert";
      }

      const hoursUntilDue =
        (dueDateWithoutTime.getTime() - now.getTime()) / (1000 * 60 * 60);

      if (hoursUntilDue <= 24) {
        return "warning";
      }
    }
  }

  return "calm";
}

export default function LembrolBrand({ compact = false }) {
  const { projectsState } = useProjectContext();
  const { activeReminders } = useReminderContext();
  const { t } = useLanguage();

  const status = useMemo(() => {
    // Um lembrete que está ativo sempre coloca o Lembrol em alerta.
    if (activeReminders.length > 0) {
      return "alert";
    }

    const now = new Date();

    const pendingTasks = projectsState.tasks.filter((task) => !task.completed);

    // Vermelho tem prioridade sobre amarelo.
    const hasAlert = pendingTasks.some(
      (task) => getTaskStatus(task, now) === "alert",
    );

    if (hasAlert) {
      return "alert";
    }

    // Amarelo indica tarefa próxima do vencimento.
    const hasWarning = pendingTasks.some(
      (task) => getTaskStatus(task, now) === "warning",
    );

    if (hasWarning) {
      return "warning";
    }

    return "calm";
  }, [activeReminders.length, projectsState.tasks]);

  const statusLabel = {
    calm: t("lembrol", "statusCalm"),
    warning: t("lembrol", "statusWarning"),
    alert: t("lembrol", "statusAlert"),
  }[status];

  return (
    <div
      className={
        compact ? "flex items-center gap-3" : "flex flex-col items-center"
      }
    >
      <div
        className={`lembrol-orb lembrol-orb--${status}`}
        role="img"
        aria-label={`Lembrol: ${statusLabel}`}
        title={statusLabel}
      >
        <span className="lembrol-orb__halo" />

        <span className="lembrol-orb__glass" />

        <span className="lembrol-orb__smoke lembrol-orb__smoke--one" />

        <span className="lembrol-orb__smoke lembrol-orb__smoke--two" />

        <span className="lembrol-orb__smoke lembrol-orb__smoke--three" />

        <span className="lembrol-orb__spark lembrol-orb__spark--one" />

        <span className="lembrol-orb__spark lembrol-orb__spark--two" />
      </div>

      <div className={compact ? "" : "mt-4 text-center"}>
        <div className="lembrol-wordmark">LEMBROL</div>

        {!compact && (
          <div className="mt-1 text-xs tracking-[0.2em] text-violet-200/60">
            {statusLabel}
          </div>
        )}
      </div>
    </div>
  );
}
