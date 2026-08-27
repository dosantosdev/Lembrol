import { useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { useProjectContext } from "../../store/ProjectContext.jsx";

export default function EditTask({ task, onClose }) {
  const { dispatch } = useProjectContext();
  const { t } = useLanguage();

  const [text, setText] = useState(task.text || "");
  const [dueDate, setDueDate] = useState(task.dueDate || "");
  const [dueTime, setDueTime] = useState(task.dueTime || "");
  const [reminderMinutes, setReminderMinutes] = useState(
    task.reminderMinutes ?? "",
  );
  const [priority, setPriority] = useState(task.priority || "medium");

  function handleSave(event) {
    event.preventDefault();

    if (!text.trim()) {
      return;
    }

    dispatch({
      type: "UPDATE_TASK",
      payload: {
        id: task.id,
        text: text.trim(),
        dueDate,
        dueTime,
        reminderMinutes:
          reminderMinutes === "" ? null : Number(reminderMinutes),
        priority,
      },
    });

    onClose();
  }

  return (
    <form onSubmit={handleSave} className="lembrol-edit-task">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,2fr)_1fr_1fr_1fr]">
        <div>
          <label className="lembrol-label">{t("tasks", "taskLabel")}</label>

          <input
            type="text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            className="lembrol-input"
          />
        </div>

        <div>
          <label className="lembrol-label">
            {t("tasks", "dueDateLabel")}
          </label>

          <input
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            className="lembrol-input"
          />
        </div>

        <div>
          <label className="lembrol-label">
            {t("tasks", "dueTimeLabel")}
          </label>

          <input
            type="time"
            value={dueTime}
            onChange={(event) => setDueTime(event.target.value)}
            className="lembrol-input"
          />
        </div>

        <div>
          <label className="lembrol-label">
            {t("tasks", "reminderLabel")}
          </label>

          <select
            value={reminderMinutes}
            onChange={(event) => setReminderMinutes(event.target.value)}
            className="lembrol-input"
          >
            <option value="">{t("tasks", "noReminder")}</option>
            <option value="5">{t("tasks", "fiveMinutes")}</option>
            <option value="15">{t("tasks", "fifteenMinutes")}</option>
            <option value="30">{t("tasks", "thirtyMinutes")}</option>
            <option value="60">{t("tasks", "oneHour")}</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="w-full md:max-w-xs">
          <label className="lembrol-label">
            {t("tasks", "priorityLabel")}
          </label>

          <select
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
            className="lembrol-input"
          >
            <option value="high">🔴 {t("tasks", "priorityHigh")}</option>
            <option value="medium">🟡 {t("tasks", "priorityMedium")}</option>
            <option value="low">🟢 {t("tasks", "priorityLow")}</option>
          </select>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="lembrol-secondary-button"
          >
            {t("common", "cancel")}
          </button>

          <button type="submit" className="lembrol-primary-button">
            {t("common", "save")}
          </button>
        </div>
      </div>
    </form>
  );
}
