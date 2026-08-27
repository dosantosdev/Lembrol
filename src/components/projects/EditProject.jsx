import { useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { useProjectContext } from "../../store/ProjectContext.jsx";

export default function EditProject({ project, onClose }) {
  const { dispatch } = useProjectContext();
  const { t } = useLanguage();

  const [title, setTitle] = useState(project.title || "");
  const [description, setDescription] = useState(project.description || "");
  const [dueDate, setDueDate] = useState(project.dueDate || "");

  function handleSave(event) {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    dispatch({
      type: "UPDATE_PROJECT",
      payload: {
        id: project.id,
        title: title.trim(),
        description: description.trim(),
        dueDate,
      },
    });

    onClose();
  }

  return (
    <form onSubmit={handleSave} className="mt-4 rounded-md bg-stone-200 p-4">
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-stone-700">
            {t("projects", "titleLabel")}
          </label>

          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-700 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700">
            {t("projects", "descriptionLabel")}
          </label>

          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows="3"
            className="mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-700 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700">
            {t("projects", "dueDateLabel")}
          </label>

          <input
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            className="mt-1 rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-700 focus:outline-none"
          />
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
