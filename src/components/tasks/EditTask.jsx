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
    task.reminderMinutes ?? null,
  );

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
          reminderMinutes === "" || reminderMinutes === null
            ? null
            : Number(reminderMinutes),
      },
    });

    onClose();
  }

  return (
    <form onSubmit={handleSave} className="mt-3 rounded-md bg-stone-200 p-4">
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-stone-700">
            {t("tasks", "taskLabel")}
          </label>

          <input
            type="text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            className="mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-700 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700">
            {t("tasks", "dueDateLabel")}
          </label>

          <input
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            className="mt-1 rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-700 focus:outline-none"
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
            className="mt-1 rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-700 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700">
            {t("tasks", "reminderLabel")}
          </label>

          <select
            value={reminderMinutes ?? ""}
            onChange={(event) => setReminderMinutes(event.target.value)}
            className="mt-1 rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-700 focus:outline-none"
          >
            <option value="">{t("tasks", "noReminder")}</option>

            <option value="5">{t("tasks", "fiveMinutes")}</option>

            <option value="15">{t("tasks", "fifteenMinutes")}</option>

            <option value="30">{t("tasks", "thirtyMinutes")}</option>

            <option value="60">{t("tasks", "oneHour")}</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <button
          type="submit"
          className="rounded-md bg-stone-700 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
        >
          {t("common", "save")}
        </button>

        <button
          type="button"
          onClick={onClose}
          className="rounded-md bg-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-400"
        >
          {t("common", "cancel")}
        </button>
      </div>
    </form>
  );
}
