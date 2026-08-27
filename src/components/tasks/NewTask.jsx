import { useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";

export default function NewTask({ onAdd }) {
  const { t } = useLanguage();

  const [enteredTask, setEnteredTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [reminderMinutes, setReminderMinutes] = useState("");
  const [priority, setPriority] = useState("medium");

  function handleSubmit(event) {
    event.preventDefault();

    if (!enteredTask.trim()) {
      return;
    }

    onAdd({
      text: enteredTask.trim(),
      dueDate,
      dueTime,
      reminderMinutes: reminderMinutes === "" ? null : Number(reminderMinutes),
      priority,
      completed: false,
    });

    setEnteredTask("");
    setDueDate("");
    setDueTime("");
    setReminderMinutes("");
    setPriority("medium");
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-md bg-stone-100 p-5">
      <div>
        <label className="block text-sm font-medium text-stone-700">
          {t("tasks", "taskLabel")}
        </label>

        <input
          type="text"
          value={enteredTask}
          onChange={(event) => setEnteredTask(event.target.value)}
          placeholder={t("tasks", "placeholder")}
          className="mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-400"
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="block text-sm font-medium text-stone-700">
            {t("tasks", "dueDateLabel")}
          </label>

          <input
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            className="mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700">
            {t("tasks", "dueTimeLabel")}
          </label>

          <input
            type="time"
            value={dueTime}
            onChange={(event) => setDueTime(event.target.value)}
            className="mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700">
            {t("tasks", "reminderLabel")}
          </label>

          <select
            value={reminderMinutes}
            onChange={(event) => setReminderMinutes(event.target.value)}
            className="mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-400"
          >
            <option value="">{t("tasks", "noReminder")}</option>

            <option value="5">{t("tasks", "fiveMinutes")}</option>

            <option value="15">{t("tasks", "fifteenMinutes")}</option>

            <option value="30">{t("tasks", "thirtyMinutes")}</option>

            <option value="60">{t("tasks", "oneHour")}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700">
            {t("tasks", "priorityLabel")}
          </label>

          <select
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
            className="mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-400"
          >
            <option value="high">🔴 {t("tasks", "priorityHigh")}</option>

            <option value="medium">🟡 {t("tasks", "priorityMedium")}</option>

            <option value="low">🟢 {t("tasks", "priorityLow")}</option>
          </select>
        </div>
      </div>

      <div className="mt-5 flex justify-end">
        <button
          type="submit"
          className="rounded-md bg-stone-700 px-5 py-2 text-sm font-medium text-white hover:bg-stone-800"
        >
          {t("tasks", "add")}
        </button>
      </div>
    </form>
  );
}
