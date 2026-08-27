import { useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { useProjectContext } from "../../store/ProjectContext.jsx";
import { isTaskOverdue } from "../../reminders/reminderService.js";
import { generateId } from "../../utils/id.js";
import NewTask from "./NewTask.jsx";
import EditTask from "./EditTask.jsx";

export default function Tasks({ projectId }) {
  const { projectsState, dispatch } = useProjectContext();
  const { t, language } = useLanguage();

  const [editingTaskId, setEditingTaskId] = useState(null);

  const projectTasks = projectsState.tasks.filter(
    (task) => task.projectId === projectId,
  );

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

  function handleDeleteTask(id) {
    dispatch({
      type: "DELETE_TASK",
      payload: id,
    });
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

  return (
    <section>
      <h2 className="mb-4 text-2xl font-bold text-stone-700">
        {t("tasks", "title")}
      </h2>

      <NewTask onAdd={handleAddTask} />

      {projectTasks.length === 0 && (
        <p className="my-4 text-stone-800">{t("tasks", "empty")}</p>
      )}

      {projectTasks.length > 0 && (
        <ul className="mt-8 rounded-md bg-stone-100 p-4">
          {projectTasks.map((task) => {
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

                      {task.completed && (
                        <div className="mt-1 text-sm text-stone-400">
                          {t("tasks", "completed")}
                        </div>
                      )}

                      {overdue && (
                        <div className="mt-1 font-medium text-sm text-red-600">
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
                      onClick={() => handleDeleteTask(task.id)}
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
          })}
        </ul>
      )}
    </section>
  );
}
