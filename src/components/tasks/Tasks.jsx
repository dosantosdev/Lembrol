import { useMemo, useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { useProjectContext } from "../../store/ProjectContext.jsx";
import { isTaskOverdue } from "../../reminders/reminderService.js";
import { generateId } from "../../utils/id.js";
import ConfirmDialog from "../ui/ConfirmDialog.jsx";
import NewTask from "./NewTask.jsx";
import EditTask from "./EditTask.jsx";
import TaskPriority from "./TaskPriority.jsx";

export default function Tasks({ projectId }) {
  const { projectsState, dispatch } = useProjectContext();
  const { t, language } = useLanguage();

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);

  const projectTasks = projectsState.tasks.filter(
    (task) => task.projectId === projectId,
  );

  const pendingTasks = useMemo(() => {
    const priorityOrder = { high: 1, medium: 2, low: 3 };

    return projectTasks
      .filter((task) => !task.completed)
      .sort((taskA, taskB) => {
        const priorityA = priorityOrder[taskA.priority] ?? 2;
        const priorityB = priorityOrder[taskB.priority] ?? 2;

        if (priorityA !== priorityB) {
          return priorityA - priorityB;
        }

        const taskAOverdue = isTaskOverdue(taskA);
        const taskBOverdue = isTaskOverdue(taskB);

        if (taskAOverdue && !taskBOverdue) return -1;
        if (!taskAOverdue && taskBOverdue) return 1;

        if (!taskA.dueDate && !taskB.dueDate) return 0;
        if (!taskA.dueDate) return 1;
        if (!taskB.dueDate) return -1;

        return (
          new Date(`${taskA.dueDate}T00:00:00`) -
          new Date(`${taskB.dueDate}T00:00:00`)
        );
      });
  }, [projectTasks]);

  const completedTasks = useMemo(() => {
    return projectTasks
      .filter((task) => task.completed)
      .sort((taskA, taskB) => {
        if (!taskA.completedAt) return 1;
        if (!taskB.completedAt) return -1;

        return new Date(taskB.completedAt) - new Date(taskA.completedAt);
      });
  }, [projectTasks]);

  const deletingTask = projectTasks.find((task) => task.id === deletingTaskId);

  function handleAddTask(taskData) {
    dispatch({
      type: "ADD_TASK",
      payload: {
        ...taskData,
        id: generateId(),
        projectId,
      },
    });
  }

  function handleDeleteTask() {
    dispatch({
      type: "DELETE_TASK",
      payload: deletingTaskId,
    });

    setDeletingTaskId(null);
  }

  function handleToggleTask(id) {
    dispatch({
      type: "TOGGLE_TASK",
      payload: id,
    });
  }

  function formatTaskDate(date) {
    if (!date) return null;

    return new Date(`${date}T00:00:00`).toLocaleDateString(language, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function renderTask(task) {
    const overdue = isTaskOverdue(task);

    return (
      <li key={task.id} className="lembrol-task-item">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggleTask(task.id)}
              className="lembrol-checkbox mt-1.5"
            />

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={
                    task.completed
                      ? "text-slate-500 line-through"
                      : overdue
                        ? "font-semibold text-rose-300"
                        : "font-medium text-slate-100"
                  }
                >
                  {task.text}
                </span>

                {!task.completed && <TaskPriority priority={task.priority} />}
              </div>

              {task.completed && (
                <div className="mt-1 text-xs text-slate-500">
                  {t("tasks", "completed")}
                </div>
              )}

              {overdue && !task.completed && (
                <div className="mt-1 text-xs font-medium text-rose-300">
                  {t("tasks", "overdue")}
                </div>
              )}

              {(task.dueDate || task.dueTime) && (
                <div className="mt-1 text-xs text-slate-500">
                  {task.dueDate && formatTaskDate(task.dueDate)}
                  {task.dueDate && task.dueTime && " • "}
                  {task.dueTime}
                </div>
              )}
            </div>
          </div>

          <div className="flex shrink-0 gap-3">
            <button
              type="button"
              className="lembrol-inline-button"
              onClick={() => setEditingTaskId(task.id)}
            >
              {t("common", "edit")}
            </button>

            <button
              type="button"
              className="lembrol-inline-button lembrol-inline-button--danger"
              onClick={() => setDeletingTaskId(task.id)}
            >
              {t("common", "clear")}
            </button>
          </div>
        </div>

        {editingTaskId === task.id && (
          <EditTask task={task} onClose={() => setEditingTaskId(null)} />
        )}
      </li>
    );
  }

  return (
    <section>
      <div className="mb-5">
        <p className="lembrol-section-kicker">{t("tasks", "title")}</p>
        <h2 className="mt-1 text-2xl font-bold text-slate-100">
          {t("tasks", "title")}
        </h2>
      </div>

      <NewTask onAdd={handleAddTask} />

      {pendingTasks.length > 0 && (
        <div className="mt-8">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-violet-200/55">
            {t("tasks", "pending")}
          </h3>

          <ul className="lembrol-task-list">{pendingTasks.map(renderTask)}</ul>
        </div>
      )}

      {completedTasks.length > 0 && (
        <div className="mt-8">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
            {t("tasks", "completedTitle")}
          </h3>

          <ul className="lembrol-task-list lembrol-task-list--completed">
            {completedTasks.map(renderTask)}
          </ul>
        </div>
      )}

      {deletingTask && (
        <ConfirmDialog
          title={t("tasks", "deleteTitle")}
          message={t("tasks", "deleteMessage")}
          onConfirm={handleDeleteTask}
          onCancel={() => setDeletingTaskId(null)}
        />
      )}
    </section>
  );
}
