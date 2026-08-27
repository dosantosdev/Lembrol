import { useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { useProjectContext } from "../../store/ProjectContext.jsx";
import ConfirmDialog from "../ui/ConfirmDialog.jsx";
import EditProject from "./EditProject.jsx";
import ProjectProgress from "./ProjectProgress.jsx";
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

  const projectTasks = projectsState.tasks.filter(
    (task) => task.projectId === project.id,
  );

  function handleDeleteProject() {
    dispatch({
      type: "DELETE_PROJECT",
    });

    setShowDeleteConfirmation(false);
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
    <div className="w-full max-w-5xl">
      {!isEditing && (
        <>
          <div className="lembrol-project-header">
            <div className="min-w-0">
              <p className="lembrol-section-kicker">{t("projects", "title")}</p>

              <h1 className="mt-2 break-word text-3xl font-bold text-slate-100 md:text-4xl">
                {project.title}
              </h1>

              {project.description && (
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                  {project.description}
                </p>
              )}

              {project.dueDate && (
                <p className="mt-3 text-sm text-violet-200/55">
                  {t("projects", "dueDateLabel")}: {formatDate(project.dueDate)}
                </p>
              )}
            </div>

            <div className="flex shrink-0 gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="lembrol-text-button"
              >
                {t("common", "edit")}
              </button>

              <button
                type="button"
                onClick={() => setShowDeleteConfirmation(true)}
                className="lembrol-text-button lembrol-text-button--danger"
              >
                {t("common", "delete")}
              </button>
            </div>
          </div>

          <ProjectProgress tasks={projectTasks} />
        </>
      )}

      {isEditing && (
        <EditProject project={project} onClose={() => setIsEditing(false)} />
      )}

      <div className="mt-10">
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
