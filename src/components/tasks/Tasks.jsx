import { useMemo, useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { useProjectContext } from "../../store/ProjectContext.jsx";
import { isTaskOverdue } from "../../reminders/reminderService.js";
import { generateId } from "../../utils/id.js";
import ConfirmDialog from "../ui/ConfirmDialog.jsx";
import NewTask from "./NewTask.jsx";
import EditTask from "./EditTask.jsx";

export default function Tasks({ projectId }) {
  const { projectsState, dispatch } = useProjectContext();
  const { t, language } = useLanguage();

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);

  const projectTasks = projectsState.tasks.filter(
    (task) => task.projectId === projectId,
  );

  const pendingTasks = useMemo(() => {
    const priorityOrder = {
      high: 1,
      medium: 2,
      low: 3,
    };

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

        if (taskAOverdue && !taskBOverdue) {
          return -1;
        }

        if (!taskAOverdue && taskBOverdue) {
          return 1;
        }

        if (!taskA.dueDate && !taskB.dueDate) {
          return 0;
        }

        if (!taskA.dueDate) {
          return 1;
        }

        if (!taskB.dueDate) {
          return -1;
        }

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
        if (!taskA.completedAt) {
          return 1;
        }

        if (!taskB.completedAt) {
          return -1;
        }

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

  function handleEditTask(id) {
    setEditingTaskId(id);
  }

  function handleCloseEdit() {
    setEditingTaskId(null);
  }

  function formatTaskDate(date) {
    if (!date) {
      return null;
    }

    return new Date(`${date}T00:00:00`).toLocaleDateString(language, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function getPriorityLabel(priority) {
    if (priority === "high") {
      return `🔴 ${t("tasks", "priorityHigh")}`;
    }

    if (priority === "low") {
      return `🟢 ${t("tasks", "priorityLow")}`;
    }

    return `🟡 ${t("tasks", "priorityMedium")}`;
  }

  function renderTask(task) {
    const overdue = isTaskOverdue(task);

    return (
      <li key={task.id} className="my-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggleTask(task.id)}
              className="mt-1"
            />

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={
                    task.completed
                      ? "text-stone-400 line-through"
                      : overdue
                        ? "font-medium text-red-700"
                        : "text-stone-800"
                  }
                >
                  {task.text}
                </span>

                {!task.completed && (
                  <span className="text-xs font-medium text-stone-500">
                    {getPriorityLabel(task.priority)}
                  </span>
                )}
              </div>

              {task.completed && (
                <div className="mt-1 text-sm text-stone-400">
                  {t("tasks", "completed")}
                </div>
              )}

              {overdue && (
                <div className="mt-1 text-sm font-medium text-red-600">
                  {t("tasks", "overdue")}
                </div>
              )}

              {(task.dueDate || task.dueTime) && (
                <div className="mt-1 text-sm text-stone-400">
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
              className="text-stone-700 hover:text-stone-950"
              onClick={() => handleEditTask(task.id)}
            >
              {t("common", "edit")}
            </button>

            <button
              type="button"
              className="text-stone-700 hover:text-red-500"
              onClick={() => setDeletingTaskId(task.id)}
            >
              {t("common", "clear")}
            </button>
          </div>
        </div>

        {editingTaskId === task.id && (
          <EditTask task={task} onClose={handleCloseEdit} />
        )}
      </li>
    );
  }

  return (
    <section>
      <h2 className="mb-4 text-2xl font-bold text-stone-700">
        {t("tasks", "title")}
      </h2>

      <NewTask onAdd={handleAddTask} />

      {projectTasks.length === 0 && (
        <p className="my-4 text-stone-800">{t("tasks", "empty")}</p>
      )}

      {pendingTasks.length > 0 && (
        <div className="mt-8">
          <h3 className="mb-3 text-lg font-bold text-stone-700">
            {t("tasks", "pending")}
          </h3>

          <ul className="rounded-md bg-stone-100 p-4">
            {pendingTasks.map(renderTask)}
          </ul>
        </div>
      )}

      {completedTasks.length > 0 && (
        <div className="mt-8">
          <h3 className="mb-3 text-lg font-bold text-stone-500">
            {t("tasks", "completedTitle")}
          </h3>

          <ul className="rounded-md bg-stone-100 p-4 opacity-80">
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
