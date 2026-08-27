import { useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";

export default function NewTask({ onAdd }) {
  const { t } = useLanguage();
  const [enteredTask, setEnteredTask] = useState("");

  function handleChange(event) {
    setEnteredTask(event.target.value);
  }

  function handleClick() {
    if (enteredTask.trim() === "") {
      return;
    }

    onAdd(enteredTask);
    setEnteredTask("");
  }

  return (
    <div className="flex items-center gap-4">
      <input
        type="text"
        className="w-64 px-2 py-1 rounded-sm bg-stone-200"
        onChange={handleChange}
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
  );
}
