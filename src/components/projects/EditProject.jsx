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
    <form onSubmit={handleSave} className="lembrol-form-card">
      <div className="mb-6">
        <p className="lembrol-section-kicker">{t("common", "edit")}</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-100">
          {project.title}
        </h1>
      </div>

      <div className="space-y-5">
        <div>
          <label className="lembrol-label">
            {t("projects", "titleLabel")}
          </label>

          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="lembrol-input"
          />
        </div>

        <div>
          <label className="lembrol-label">
            {t("projects", "descriptionLabel")}
          </label>

          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows="3"
            className="lembrol-input resize-y"
          />
        </div>

        <div>
          <label className="lembrol-label">
            {t("projects", "dueDateLabel")}
          </label>

          <input
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            className="lembrol-input max-w-xs"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
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
    </form>
  );
}
