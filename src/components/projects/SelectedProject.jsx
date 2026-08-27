import { useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { useProjectContext } from "../../store/ProjectContext.jsx";
import ConfirmDialog from "../ui/ConfirmDialog.jsx";
import EditProject from "./EditProject.jsx";
import Tasks from "../tasks/Tasks.jsx";

export default function SelectedProject() {
  const { projectsState, dispatch } = useProjectContext();
  const { t, language } = useLanguage();

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const project = projectsState.projects.find(
    (project) => project.id === projectsState.selectedProjectId,
  );

  if (!project) {
    return null;
  }

  function handleDeleteProject() {
    dispatch({
      type: "DELETE_PROJECT",
    });

    setShowDeleteConfirmation(false);
  }

  function handleStartEditing() {
    setIsEditing(true);
  }

  function handleCloseEditing() {
    setIsEditing(false);
  }

  function formatDate(date) {
    if (!date) {
      return null;
    }

    return new Date(`${date}T00:00:00`).toLocaleDateString(language, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div className="w-full max-w-3xl">
      {!isEditing && (
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-stone-800">
              {project.title}
            </h1>

            {project.description && (
              <p className="mt-2 text-stone-600">{project.description}</p>
            )}

            {project.dueDate && (
              <p className="mt-2 text-sm text-stone-400">
                {t("projects", "dueDateLabel")}: {formatDate(project.dueDate)}
              </p>
            )}
          </div>

          <div className="flex shrink-0 gap-3">
            <button
              type="button"
              onClick={handleStartEditing}
              className="text-stone-700 hover:text-stone-950"
            >
              {t("common", "edit")}
            </button>

            <button
              type="button"
              onClick={() => setShowDeleteConfirmation(true)}
              className="text-stone-700 hover:text-red-500"
            >
              {t("common", "delete")}
            </button>
          </div>
        </div>
      )}

      {isEditing && (
        <EditProject project={project} onClose={handleCloseEditing} />
      )}

      <div className="mt-8">
        <Tasks projectId={project.id} />
      </div>

      {showDeleteConfirmation && (
        <ConfirmDialog
          title={t("projects", "deleteTitle")}
          message={t("projects", "deleteMessage")}
          onConfirm={handleDeleteProject}
          onCancel={() => setShowDeleteConfirmation(false)}
        />
      )}
    </div>
  );
}
