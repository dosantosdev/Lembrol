import { useRef, useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import Modal from "../ui/Modal.jsx";

export default function NewTask({ onAdd }) {
  const { t } = useLanguage();

  const [enteredTask, setEnteredTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [reminderMinutes, setReminderMinutes] = useState("");
  const [priority, setPriority] = useState("medium");

  const modal = useRef();

  function handleSubmit(event) {
    event.preventDefault();

    if (!enteredTask.trim()) {
      modal.current.open();
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
    <>
      <form onSubmit={handleSubmit} className="lembrol-task-form">
        <div>
          <label className="lembrol-label">{t("tasks", "taskLabel")}</label>

          <input
            type="text"
            value={enteredTask}
            onChange={(event) => setEnteredTask(event.target.value)}
            placeholder={t("tasks", "placeholder")}
            className="lembrol-input"
          />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
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

          <div>
            <label className="lembrol-label">
              {t("tasks", "priorityLabel")}
            </label>

            <select
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
              className="lembrol-input"
            >
              <option value="high">
                🔴 {t("tasks", "priorityHigh")}
              </option>
              <option value="medium">
                🟡 {t("tasks", "priorityMedium")}
              </option>
              <option value="low">
                🟢 {t("tasks", "priorityLow")}
              </option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button type="submit" className="lembrol-primary-button">
            {t("tasks", "add")}
          </button>
        </div>
      </form>

      <Modal ref={modal} buttonCaption={t("common", "okay")}>
        <div className="lembrol-modal-icon">✦</div>

        <h2 className="text-xl font-bold text-slate-100">
          {t("validation", "invalidInput")}
        </h2>

        <p className="mt-3 text-slate-300">
          {t("validation", "missingValues")}
        </p>
      </Modal>
    </>
  );
}
