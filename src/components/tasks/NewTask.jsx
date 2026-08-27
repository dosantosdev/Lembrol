import { useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";

export default function NewTask({ onAdd }) {
  const { t } = useLanguage();

  const [enteredTask, setEnteredTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [reminderMinutes, setReminderMinutes] = useState("");

  function handleTaskChange(event) {
    setEnteredTask(event.target.value);
  }

  function handleDateChange(event) {
    setDueDate(event.target.value);
  }

  function handleTimeChange(event) {
    setDueTime(event.target.value);
  }

  function handleReminderChange(event) {
    setReminderMinutes(event.target.value);
  }

  function handleClick() {
    if (enteredTask.trim() === "") {
      return;
    }

    onAdd({
      text: enteredTask.trim(),
      dueDate,
      dueTime,
      reminderMinutes: reminderMinutes ? Number(reminderMinutes) : null,
      completed: false,
    });

    setEnteredTask("");
    setDueDate("");
    setDueTime("");
    setReminderMinutes("");
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4">
        <input
          type="text"
          className="w-64 px-2 py-1 rounded-sm bg-stone-200"
          onChange={handleTaskChange}
          value={enteredTask}
          placeholder={t("tasks", "placeholder")}
        />

        <button
          className="text-stone-700 hover:text-stone-950"
          onClick={handleClick}
        >
          {t("tasks", "add")}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-stone-500">
            {t("tasks", "dueDateLabel")}
          </label>

          <input
            type="date"
            className="px-2 py-1 rounded-sm bg-stone-200 text-stone-700"
            value={dueDate}
            onChange={handleDateChange}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-stone-500">
            {t("tasks", "dueTimeLabel")}
          </label>

          <input
            type="time"
            className="px-2 py-1 rounded-sm bg-stone-200 text-stone-700"
            value={dueTime}
            onChange={handleTimeChange}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-stone-500">
            {t("tasks", "reminderLabel")}
          </label>

          <select
            className="px-2 py-1 rounded-sm bg-stone-200 text-stone-700"
            value={reminderMinutes}
            onChange={handleReminderChange}
          >
            <option value="">{t("tasks", "noReminder")}</option>

            <option value="5">{t("tasks", "fiveMinutes")}</option>

            <option value="15">{t("tasks", "fifteenMinutes")}</option>

            <option value="30">{t("tasks", "thirtyMinutes")}</option>

            <option value="60">{t("tasks", "oneHour")}</option>
          </select>
        </div>
      </div>
    </div>
  );
}
